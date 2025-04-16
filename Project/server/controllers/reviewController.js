const Review = require('../models/Review.js');
const asyncHandler = require('express-async-handler');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Parents only)
const createReview = asyncHandler(async (req, res) => {
  const { instructor, rating, feedback, course, isPublic } = req.body;
  
  // Check if parent already reviewed this instructor
  const existingReview = await Review.findOne({
    parent: req.user.id,
    instructor
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this instructor');
  }

  const review = await Review.create({
    instructor,
    parent: req.user.id,
    rating,
    feedback,
    course,
    isPublic: isPublic !== false // default to true
  });

  res.status(201).json(review);
});

// @desc    Get reviews for a specific instructor
// @route   GET /api/reviews/instructor/:id
// @access  Public
const getInstructorReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ 
    instructor: req.params.id,
    isPublic: true 
  })
    .populate('parent', 'name')
    .populate('course', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Get all public reviews
// @route   GET /api/reviews/public
// @access  Public
const getPublicReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isPublic: true })
    .populate('instructor', 'name')
    .populate('parent', 'name')
    .populate('course', 'name')
    .sort({ helpfulCount: -1, createdAt: -1 })
    .limit(50);

  res.json(reviews);
});

// @desc    Mark a review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private (Parents only)
const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user already marked this helpful
  // (You might want to implement this check with a separate model)
  
  review.helpfulCount += 1;
  await review.save();

  res.json({ message: 'Marked as helpful', helpfulCount: review.helpfulCount });
});

module.exports = {
  createReview,
  getInstructorReviews,
  getPublicReviews,
  markHelpful,
};
