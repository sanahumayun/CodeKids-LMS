const Review = require('../models/Review');
const Course = require('../models/Course');

exports.submitReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;
    const { responses, comment } = req.body;

    // Validate that responses is an object and has all questions answered
    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({ error: "Responses must be provided as an object." });
    }

    // Optionally: Validate keys and values here (e.g., check question IDs and values 1-5)

    // Check if student is enrolled in the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    if (!course.studentsEnrolled.includes(studentId)) {
      return res.status(403).json({ error: "You are not enrolled in this course." });
    }

    // Check if review already exists by this student for this course (optional)
    const existingReview = await Review.findOne({ courseId, studentId });
    if (existingReview) {
      return res.status(400).json({ error: "You have already submitted a review for this course." });
    }

    // Create new review
    const review = new Review({
      courseId,
      instructorId: course.instructorId,
      studentId,
      responses,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('studentId', 'name')        // Only fetch username
      .populate('courseId', 'title')            // Only fetch title
      .populate('instructorId', 'name');    // Only fetch instructor's username

    res.status(200).json({ reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getReviewsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const reviews = await Review.find({ courseId })
      .populate('studentId', 'name')      // Only fetch student name
      .populate('instructorId', 'name')   // Optionally fetch instructor name
      .lean();

    res.status(200).json({ reviews });
  } catch (err) {
    console.error("Error fetching course reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.checkIfStudentReviewedCourse = async (req, res) => {
  console.log(`hello`);
  try {
    const { courseId } = req.params;
    const studentId = req.user.id; 
    console.log(`student id ${studentId}`);

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const review = await Review.findOne({ courseId, studentId });

    res.status(200).json({ hasReview: !!review });
  } catch (err) {
    console.error("Error checking student review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


