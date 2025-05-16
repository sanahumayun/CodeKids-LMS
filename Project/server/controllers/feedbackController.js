const Course = require('../models/Course');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  const { courseId, studentId, comments, ratings } = req.body;
  const tutorId = req.user.id;

  const course = await Course.findById(courseId);
  if (!course.instructorId === tutorId) {
    return res.status(403).json({ message: "Unauthorized or invalid course status." });
  }

  const feedback = new Feedback({ courseId, studentId, tutorId, comments, ratings });
  await feedback.save();

  res.status(201).json({ message: "Feedback submitted successfully." });
};

exports.getStudentFeedback = async (req, res) => {
  const studentId = req.user.id;
  try {
    const feedbacks = await Feedback.find({ studentId })
      .populate('courseId', 'title') 
      .populate('tutorId', 'name'); 

    res.status(200).json(feedbacks);
  } catch (err) {
    console.error("Error fetching student feedback:", err);
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
};



