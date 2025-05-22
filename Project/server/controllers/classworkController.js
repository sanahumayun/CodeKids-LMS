const Classwork = require('../models/Classwork');

exports.uploadClasswork = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { description } = req.body;
    const studentId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const newClasswork = new Classwork({
      student: studentId,
      course: courseId,
      description,
      fileUrl: req.file.location || req.file.path
    });

    await newClasswork.save();
    res.status(201).json({ message: 'Classwork uploaded successfully', classwork: newClasswork });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload classwork' });
  }
};

exports.viewClasswork = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const classworks = await Classwork.find({
      course: courseId,
      student: studentId
    }).sort({ createdAt: -1 });

    res.status(200).json(classworks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classwork' });
  }
};

exports.deleteClasswork = async (req, res) => {
  try {
    const { classworkId } = req.params;
    const studentId = req.user.id;

    const classwork = await Classwork.findOneAndDelete({
      _id: classworkId,
      student: studentId
    });

    if (!classwork) {
      return res.status(404).json({ error: 'Classwork not found or unauthorized' });
    }

    res.status(200).json({ message: 'Classwork deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete classwork' });
  }
};
