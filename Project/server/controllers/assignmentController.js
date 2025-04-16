const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');

// Helper function to handle file uploads
const handleFileUpload = (files, uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return files.map(file => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadPath, fileName);
    fs.writeFileSync(filePath, file.buffer);
    return {
      name: file.originalname,
      path: filePath
    };
  });
};

// Create assignment (Tutor only)
exports.createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate, maxScore } = req.body;
    
    // Verify the tutor teaches this course
    const course = await Course.findOne({
      _id: courseId,
      tutor: req.user._id
    });
    
    if (!course) {
      return res.status(403).json({ message: 'You are not the tutor for this course' });
    }

    const assignmentFiles = req.files ? handleFileUpload(req.files, `uploads/assignments/${courseId}`) : [];

    const assignment = new Assignment({
      course: courseId,
      tutor: req.user._id,
      title,
      description,
      dueDate,
      maxScore,
      files: assignmentFiles
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assignments for a course
exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify user is either tutor or enrolled student
    const course = await Course.findOne({
      _id: courseId,
      $or: [
        { tutor: req.user._id },
        { students: req.user._id }
      ]
    });
    
    if (!course) {
      return res.status(403).json({ message: 'Not authorized to view assignments for this course' });
    }

    const assignments = await Assignment.find({ course: courseId })
      .populate('tutor', 'name email');
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single assignment
exports.getAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await Assignment.findById(assignmentId)
      .populate('tutor', 'name email')
      .populate('course', 'title');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify user is either tutor or enrolled student
    const course = await Course.findOne({
      _id: assignment.course,
      $or: [
        { tutor: req.user._id },
        { students: req.user._id }
      ]
    });
    
    if (!course) {
      return res.status(403).json({ message: 'Not authorized to view this assignment' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit assignment (Student only)
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    // Get the assignment
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify student is enrolled in the course
    const course = await Course.findOne({
      _id: assignment.course,
      students: req.user._id
    });
    
    if (!course) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id
    });
    
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    const submissionFiles = req.files ? handleFileUpload(req.files, `uploads/submissions/${assignmentId}`) : [];

    const submission = new Submission({
      assignment: assignmentId,
      student: req.user._id,
      files: submissionFiles
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Grade assignment (Tutor only)
exports.gradeAssignment = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    
    // Get the submission
    const submission = await Submission.findById(submissionId)
      .populate('assignment');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify the tutor teaches this course
    const course = await Course.findOne({
      _id: submission.assignment.course,
      tutor: req.user._id
    });
    
    if (!course) {
      return res.status(403).json({ message: 'You are not the tutor for this course' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    
    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get submissions for an assignment (Tutor only)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    // Get the assignment
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify the tutor teaches this course
    const course = await Course.findOne({
      _id: assignment.course,
      tutor: req.user._id
    });
    
    if (!course) {
      return res.status(403).json({ message: 'You are not the tutor for this course' });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate('student', 'name email');
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student's submissions
exports.getStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('assignment', 'title course')
      .populate('assignment.course', 'title');
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};