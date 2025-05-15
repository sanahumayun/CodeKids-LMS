const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  responses: [
  {
    question: { type: String, required: true },
    rating: { type: Number, required: true }
  }
],

  comment: { type: String, trim: true },

  createdAt: { type: Date, default: Date.now },
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
