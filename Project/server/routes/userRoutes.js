const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, checkRole } = require('../middleware/authMiddleware'); 
const User = require('../models/User');
const Submission = require('../models/Submission');
const Classwork = require('../models/Classwork');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');

router.get('/', userController.getUsers);
router.delete('/:userId', authenticate, checkRole(['admin']), userController.deleteUser);

// GET /api/admin/users/search?q=searchTerm
router.get('/admin/users/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Search query is required" });

  try {
    // Case-insensitive regex search for name or email
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    }).select('-password'); // exclude sensitive info

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to search users" });
  }
});

router.get("/admin/users/:userId/details", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user basic info INCLUDING password
    // If password is excluded by default, explicitly select it:
    const user = await User.findById(userId).select("+password").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "student") {
      const enrolledCourses = await Course.find({ studentsEnrolled: userId })
        .select("_id title description")
        .lean();

      // Submissions by student - populate assignment title, and include file URL
      const assignmentSubmissions = await Submission.find({ studentId: userId })
        .populate({
          path: "assignmentId",
          select: "title",
        })
        .select("_id assignmentId submittedAt fileUrl")  // include fileUrl or whatever your field is called
        .lean();

      // Format submissions with assignment title and fileUrl
      const submissionsFormatted = assignmentSubmissions.map((sub) => ({
        _id: sub._id,
        assignmentTitle: sub.assignmentId?.title || "Unknown",
        submittedAt: sub.submittedAt,
        fileUrl: sub.fileUrl || null,   // pass file url here
      }));

      // Classwork uploads already select fileUrl
      const classworkUploads = await Classwork.find({ student: userId })
        .select("title description fileUrl createdAt")
        .lean();

      // Feedbacks for this student (approved only)
      const tutorFeedbacks = await Feedback.find({
        studentId: userId,
        approved: true,
      })
        .populate({ path: "tutorId", select: "name" })
        .lean();

      const tutorFeedbacksFormatted = tutorFeedbacks.map((fb) => ({
        _id: fb._id,
        tutorName: fb.tutorId?.name || "Unknown",
        comments: fb.comments,
        date: fb.createdAt,
      }));

      return res.json({
        user,
        enrolledCourses,
        assignmentSubmissions: submissionsFormatted,
        classworkUploads,
        tutorFeedbacks: tutorFeedbacksFormatted,
        taughtCourses: [],
        studentEnrollments: [],
      });
    } else if (user.role === "tutor") {
      // Courses taught by tutor
      const taughtCourses = await Course.find({ instructorId: userId })
        .select("_id title studentsEnrolled")
        .lean();

      // Student enrollments grouped by course
      const studentEnrollments = await Promise.all(
        taughtCourses.map(async (course) => {
          const students = await User.find({
            _id: { $in: course.studentsEnrolled },
            role: "student",
          })
            .select("_id name")
            .lean();

          return {
            course: { _id: course._id, title: course.title },
            students,
          };
        })
      );

      // Find all assignments of these courses
      const courseIds = taughtCourses.map((c) => c._id);
      const assignments = await Assignment.find({ course: { $in: courseIds } })
        .select("_id title course")
        .lean();
      const assignmentIds = assignments.map((a) => a._id);

      // Find all submissions for these assignments
      const submissions = await Submission.find({
        assignmentId: { $in: assignmentIds },
      })
        .populate([
          { path: "studentId", select: "name" },
          { path: "assignmentId", select: "title" },
        ])
        .select("_id studentId assignmentId submittedAt fileUrl")  // include fileUrl
        .lean();

      // Format submissions
      const assignmentSubmissions = submissions.map((sub) => ({
        _id: sub._id,
        assignmentTitle: sub.assignmentId?.title || "Unknown",
        studentId: sub.studentId?._id,
        studentName: sub.studentId?.name || "Unknown",
        submittedAt: sub.submittedAt,
        fileUrl: sub.fileUrl || null,
      }));

      // Feedbacks given by this tutor (approved only)
      const tutorFeedbacksRaw = await Feedback.find({
        tutorId: userId,
        approved: true,
      })
        .populate({ path: "studentId", select: "name" })
        .lean();

      const tutorFeedbacks = tutorFeedbacksRaw.map((fb) => ({
        _id: fb._id,
        studentId: fb.studentId?._id,
        studentName: fb.studentId?.name || "Unknown",
        comments: fb.comments,
        date: fb.createdAt,
      }));

      return res.json({
        user,
        enrolledCourses: [],
        assignmentSubmissions,
        classworkUploads: [],  // tutors don't have classwork uploads
        tutorFeedbacks,
        taughtCourses,
        studentEnrollments,
      });
    } else {
      // Admin or unknown role: just return user info (including password)
      return res.json({ user });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
