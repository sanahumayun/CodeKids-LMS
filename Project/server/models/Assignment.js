const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
  course: { 
    type: Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  tutor: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  maxScore: { 
    type: Number, 
    required: true 
  },
  files: [{
    name: String,
    path: String
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;