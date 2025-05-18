const Assignment = require('../models/Assignment');
const Course = require('../models/Course');


exports.uploadAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, maxScore } = req.body;
    const tutorId = req.user.id;
    const file = req.file;

    const newAssignment = new Assignment({
      course: courseId,
      tutor: tutorId,
      title,
      description,
      dueDate,
      maxScore,
      fileUrl: file ? file.location : null,
    });

    const savedAssignment = await newAssignment.save();

    await Course.findByIdAndUpdate(courseId, {
      $push: { assignments: savedAssignment._id },
    });

    res.status(201).json({ message: 'Assignment uploaded successfully', assignment: savedAssignment });
  } catch (err) {
    console.error('Error uploading assignment:', err);
    res.status(500).json({ error: 'Failed to upload assignment', details: err.message });
  }
};

exports.getAssignmentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate('assignments');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ assignments: course.assignments });
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: 'Error fetching assignments.' });
  }
};

exports.getAssignmentById = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.status(200).json({ assignment });
  } catch (err) {
    console.error('Error fetching assignment:', err);
    res.status(500).json({ error: 'Error fetching assignment.' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const assignmentIndex = course.assignments.findIndex(
      (a) => a.toString() === assignmentId
    );
    if (assignmentIndex === -1) {
      return res.status(404).json({ error: "Assignment not found in course" });
    }

    course.assignments.splice(assignmentIndex, 1);
    await course.save();

    await Assignment.findByIdAndDelete(assignmentId);

    res.status(200).json({ message: "Assignment deleted successfully", course });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

