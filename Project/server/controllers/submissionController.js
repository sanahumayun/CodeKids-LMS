const Submission = require('../models/Submission');

const submitAssignment = async (req, res) => {
  const { assignmentId, fileUrl } = req.body;
  const studentId = req.user._id;

  if (!assignmentId || !fileUrl) {
    return res.status(400).json({ message: 'Assignment ID and file URL are required' });
  }

  try {
    const submission = await Submission.create({
      assignmentId,
      studentId,
      fileUrl,
    });
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit assignment', error: err.message });
  }
};

module.exports = { submitAssignment };
