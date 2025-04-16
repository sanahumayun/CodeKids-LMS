const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
  assignment: { 
    type: Schema.Types.ObjectId, 
    ref: 'Assignment', 
    required: true 
  },
  student: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  files: [{
    name: String,
    path: String
  }],
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  grade: Number,
  feedback: String,
  gradedAt: Date
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;