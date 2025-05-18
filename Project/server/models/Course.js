const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const classworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment' 
  }],
  materials: [materialSchema],
  classworks: [classworkSchema], // 👈 Embedded classworks
  status: {
    type: String,
    enum: ['in progress', 'complete'],
    default: 'in progress'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

courseSchema.virtual('numEnrolled').get(function () {
  return this.studentsEnrolled ? this.studentsEnrolled.length : 0;
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
