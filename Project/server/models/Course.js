const mongoose = require('mongoose');

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
    ref: 'User', // assuming the instructor is a User
    required: true
  },
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // assuming students are also Users
  }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }]
});

courseSchema.virtual('studentCount').get(function () {
  return this.studentsEnrolled.length;
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
