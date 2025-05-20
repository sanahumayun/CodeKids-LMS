const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: String,
  ratings: {
    understanding: Number,
    participation: Number,
    interest: Number,
    homework: Number,
  },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  pdfUrl: String,
});

module.exports = mongoose.model('Feedback', feedbackSchema);
