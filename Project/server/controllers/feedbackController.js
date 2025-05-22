const Course = require('../models/Course');
const userController = require('../controllers/userController');
const Feedback = require('../models/Feedback');
const uploadBufferToS3 = require("../utils/s3UploadBuffer");
const generateFeedbackPDF = require("../utils/pdfGenerator");

exports.submitFeedback = async (req, res) => {
  const { courseId, studentId, comments, ratings } = req.body;
  const tutorId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course.instructorId === tutorId) {
    return res.status(403).json({ message: "Unauthorized or invalid course status." });
  }

  const feedback = new Feedback({ courseId, studentId, tutorId, comments, ratings });
  await feedback.save();

  res.status(201).json({ message: "Feedback submitted successfully. Awaiing admin approval" });
};

exports.getStudentFeedback = async (req, res) => {
  const studentId = req.user.id;
  try {
    const feedbacks = await Feedback.find({ studentId, approved: true }) // ✅ Only approved
      .populate('courseId', 'title') 
      .populate('tutorId', 'name') 
      .select('comments ratings pdfUrl');

    res.status(200).json(feedbacks);
  } catch (err) {
    console.error("Error fetching student feedback:", err);
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
};


exports.approveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.feedbackId)
      .populate("courseId studentId tutorId");

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const pdfBuffer = await generateFeedbackPDF(feedback);
    const filename = `feedbacks/${feedback.studentId.name.replace(/\s+/g, "_")}_${Date.now()}.pdf`;

    const pdfUrl = await uploadBufferToS3(pdfBuffer, filename);

    feedback.approved = true;
    feedback.pdfUrl = pdfUrl;
    await feedback.save();

    res.status(200).json({ message: "Feedback approved", pdfUrl });
  } catch (err) {
    console.error("Approval failed:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getPendingFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: false })
      .populate("courseId", "title")
      .populate("studentId", "name")
      .populate("tutorId", "name")
      .sort({ createdAt: -1 }); // optional: newest first

    console.log(`feedbacks: ${feedbacks}`);
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error("Error fetching pending feedbacks:", error);
    res.status(500).json({ message: "Server error fetching feedbacks" });
  }
};






