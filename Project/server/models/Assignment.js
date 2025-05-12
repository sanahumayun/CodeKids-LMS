const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,  
  },
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true, 
  },
  dueDate: {
    type: Date,
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  maxScore: {
    type: Number,
    required: true,
    default: 100
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
