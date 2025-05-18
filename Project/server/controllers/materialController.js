const Course = require('../models/Course');

exports.uploadCourseMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const tutorId = req.user.id;
    const { title, description } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ error: 'Material title is required' });
    }
    if (!file) {
      return res.status(400).json({ error: 'Material file is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.instructorId.toString() !== tutorId) {
      return res.status(403).json({ error: 'You are not the instructor of this course' });
    }

    const newMaterial = {
      title,
      description: description || '',
      fileUrl: file.location, // <-- ✅ use file.location like in assignment upload
      uploadedBy: tutorId,
      createdAt: new Date(),
    };

    course.materials.push(newMaterial);
    await course.save();

    res.status(201).json({ message: 'Material saved successfully', material: newMaterial });
  } catch (err) {
    console.error('Error saving course material:', err);
    res.status(500).json({ error: 'Failed to save material' });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { courseId, materialId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const materialIndex = course.materials.findIndex(
      (m) => m._id.toString() === materialId
    );

    if (materialIndex === -1) {
      return res.status(404).json({ error: "Material not found in course" });
    }

    course.materials.splice(materialIndex, 1); // Remove embedded subdocument
    await course.save();

    res.status(200).json({ message: "Material deleted successfully", course });
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ error: "Server error" });
  }
};

