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

//                for student        for tutor
module.exports = { getMySubmissions, getSubmissionsByCourse};