const Course     = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const getMySubmissions = async (req, res) => {
  const studentId = req.user._id
  try {
    const submissions = await Submission.find({ studentId })
      .populate('assignmentId', 'title dueDate')
      .populate('assignmentId.courseId', 'name');
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error getting progress', error: err.message });
  }
};

const getSubmissionsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const submissions = await Submission.find()
      .populate({
        path: 'assignmentId',
        match: { courseId },
        populate: { path: 'courseId', select: 'name' }
      })
      .populate('studentId', 'name email');

    // Filter out null assignmentId (from non-matching courseId)
    const filtered = submissions.filter(s => s.assignmentId);
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
  }
};


const getCoursePercentage = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.params;

    // 1) Ensure course exists and is complete
    const course = await Course.findById(courseId).select('status');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.status !== 'complete') {
      return res
        .status(400)
        .json({ message: 'Course must be completed first' });
    }

    // 2) Sum up maxScore of all assignments in that course
    const assignments = await Assignment.find({ course: courseId }).select('maxScore');
    const totalPossible = assignments.reduce((sum, a) => sum + (a.maxScore || 0), 0);

    // 3) Sum up this student’s earned grades
    const assignmentIds = assignments.map(a => a._id);
    const subs = await Submission.find({
      studentId: studentId,
      assignmentId: { $in: assignmentIds }
    }).select('grade');
    const totalEarned = subs.reduce((sum, s) => sum + (s.grade || 0), 0);

    // 4) Calculate and return percent
    const percent = totalPossible
      ? Math.round((totalEarned / totalPossible) * 10000) / 100
      : 0;

    res.json({ totalPossible, totalEarned, percent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
//                for student        for tutor
module.exports = { getMySubmissions, getSubmissionsByCourse, getCoursePercentage};