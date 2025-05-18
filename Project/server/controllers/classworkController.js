const Course = require('../models/Course'); // adjust path as needed

exports.uploadClasswork = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, fileUrl } = req.body;
    const userId = req.user._id; // assumes authentication middleware sets req.user

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Check if user is either enrolled student or the instructor
    const isStudent = course.studentsEnrolled.some(studentId => studentId.equals(userId));
    const isInstructor = course.instructorId.equals(userId);

    if (!isStudent && !isInstructor) {
      return res.status(403).json({ error: 'Not authorized to upload classwork for this course' });
    }

    const newClasswork = {
      title,
      description,
      fileUrl,
      uploadedBy: userId,
      createdAt: new Date()
    };

    course.classworks.push(newClasswork);
    await course.save();

    res.status(201).json({ message: 'Classwork uploaded successfully', classwork: newClasswork });
  } catch (error) {
    console.error('Error uploading classwork:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClassworks = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId).populate('classworks.uploadedBy', 'username');

    if (!course) return res.status(404).json({ error: 'Course not found' });

    const isStudent = course.studentsEnrolled.some(studentId => studentId.equals(userId));
    const isInstructor = course.instructorId.equals(userId);

    if (!isStudent && !isInstructor) {
      return res.status(403).json({ error: 'Not authorized to view classwork for this course' });
    }

    // Filter classworks by visibility
    const visibleClassworks = course.classworks.filter(cw =>
      isInstructor || cw.uploadedBy.equals(userId)
    );

    res.status(200).json({ classworks: visibleClassworks });
  } catch (error) {
    console.error('Error fetching classworks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteClasswork = async (req, res) => {
  try {
    const { courseId, classworkId } = req.params;
    const userId = req.user._id;

    // Fetch course with classworks
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the classwork
    const classwork = course.classworks.id(classworkId);

    if (!classwork) {
      return res.status(404).json({ message: 'Classwork not found' });
    }

    // Only allow deletion if student owns the classwork
    if (classwork.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not allowed to delete this classwork' });
    }

    // Remove the classwork from the array
    classwork.remove();

    await course.save();

    res.status(200).json({ message: 'Classwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting classwork:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
