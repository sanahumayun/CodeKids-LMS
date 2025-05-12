// // const Review = require('../models/Review.js');
// // const asyncHandler = require('express-async-handler');

// // // @desc    Create a new review
// // // @route   POST /api/reviews
// // // @access  Private (Parents only)
// // const createReview = asyncHandler(async (req, res) => {
// //   const { instructor, rating, feedback, course, isPublic } = req.body;
  
// //   // Check if parent already reviewed this instructor
// //   const existingReview = await Review.findOne({
// //     parent: req.user.id,
// //     instructor
// //   });

// //   if (existingReview) {
// //     res.status(400);
// //     throw new Error('You have already reviewed this instructor');
// //   }

// //   const review = await Review.create({
// //     instructor,
// //     parent: req.user.id,
// //     rating,
// //     feedback,
// //     course,
// //     isPublic: isPublic !== false // default to true
// //   });

// //   res.status(201).json(review);
// // });

// // // @desc    Get reviews for a specific instructor
// // // @route   GET /api/reviews/instructor/:id
// // // @access  Public
// // const getInstructorReviews = asyncHandler(async (req, res) => {
// //   const reviews = await Review.find({ 
// //     instructor: req.params.id,
// //     isPublic: true 
// //   })
// //     .populate('parent', 'name')
// //     .populate('course', 'name')
// //     .sort({ createdAt: -1 });

// //   res.json(reviews);
// // });

// // // @desc    Get all public reviews
// // // @route   GET /api/reviews/public
// // // @access  Public
// // const getPublicReviews = asyncHandler(async (req, res) => {
// //   const reviews = await Review.find({ isPublic: true })
// //     .populate('instructor', 'name')
// //     .populate('parent', 'name')
// //     .populate('course', 'name')
// //     .sort({ helpfulCount: -1, createdAt: -1 })
// //     .limit(50);

// //   res.json(reviews);
// // });

// // // @desc    Mark a review as helpful
// // // @route   PUT /api/reviews/:id/helpful
// // // @access  Private (Parents only)
// // const markHelpful = asyncHandler(async (req, res) => {
// //   const review = await Review.findById(req.params.id);
  
// //   if (!review) {
// //     res.status(404);
// //     throw new Error('Review not found');
// //   }

// //   // Check if user already marked this helpful
// //   // (You might want to implement this check with a separate model)
  
// //   review.helpfulCount += 1;
// //   await review.save();

// //   res.json({ message: 'Marked as helpful', helpfulCount: review.helpfulCount });
// // });

// // module.exports = {
// //   createReview,
// //   getInstructorReviews,
// //   getPublicReviews,
// //   markHelpful,
// // };


// //change
// const Review = require('../models/Review.js');
// const asyncHandler = require('express-async-handler');

// // @desc    Create a new review
// // @route   POST /api/reviews
// // @access  Private (Parents only)
// const createReview = asyncHandler(async (req, res) => {
//   //change: destructure additional fields from req.body
//   const { instructor, rating, feedback, course, isPublic, courseName, instructorName } = req.body;
  
//   // Validate rating range
//   //change: moved rating validation up for early exit
//   if (rating < 1 || rating > 5) {
//     res.status(400);
//     throw new Error('Rating must be between 1 and 5');
//   }

//   // Check if parent already reviewed this instructor
//   const existingReview = await Review.findOne({
//     parent: req.user.id,
//     instructor
//   });

//   if (existingReview) {
//     res.status(400);
//     throw new Error('You have already reviewed this instructor');
//   }

//   //change: updated review creation with new fields
//   const review = await Review.create({
//     instructor,
//     instructorName, //change: added instructor name
//     parent: req.user.id,
//     studentId: req.user.id, //change: added studentId mirroring parent
//     rating,
//     feedback,
//     course,
//     courseName, //change: added course name
//     isPublic: isPublic !== false // default to true
//   });

//   res.status(201).json(review);
// });

// // @desc    Get reviews for a specific instructor
// // @route   GET /api/reviews/instructor/:id
// // @access  Public
// const getInstructorReviews = asyncHandler(async (req, res) => {
//   //change: updated to use both instructorName and populated instructor
//   const reviews = await Review.find({ 
//     instructor: req.params.id,
//     isPublic: true 
//   })
//     .populate('parent', 'name')
//     .populate('studentId', 'name') //change: added studentId population
//     .populate('course', 'name')
//     .sort({ createdAt: -1 });

//   res.json(reviews);
// });

// // @desc    Get all public reviews
// // @route   GET /api/reviews/public
// // @access  Public
// const getPublicReviews = asyncHandler(async (req, res) => {
//   //change: updated to include new fields in response
//   const reviews = await Review.find({ isPublic: true })
//     .select('rating feedback helpfulCount createdAt courseName instructorName') //change: added new fields
//     .populate('instructor', 'name')
//     .populate('parent', 'name')
//     .populate('studentId', 'name') //change: added
//     .populate('course', 'name')
//     .sort({ helpfulCount: -1, createdAt: -1 })
//     .limit(50);

//   res.json(reviews);
// });

// // @desc    Mark a review as helpful
// // @route   PUT /api/reviews/:id/helpful
// // @access  Private (Parents only)
// const markHelpful = asyncHandler(async (req, res) => {
//   const review = await Review.findById(req.params.id);
  
//   if (!review) {
//     res.status(404);
//     throw new Error('Review not found');
//   }

//   review.helpfulCount += 1;
//   await review.save();

//   res.json({ message: 'Marked as helpful', helpfulCount: review.helpfulCount });
// });

// module.exports = {
//   createReview,
//   getInstructorReviews,
//   getPublicReviews,
//   markHelpful,
// };

//change 2
const Review = require('../models/Review.js');
const asyncHandler = require('express-async-handler');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Parents only)
const createReview = asyncHandler(async (req, res) => {
  //change: updated destructuring to use courseName instead of course ID
  const { instructor, rating, feedback, courseName, isPublic, instructorName } = req.body;
  
  // Validate rating range
  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if parent already reviewed this instructor
  const existingReview = await Review.findOne({
    parent: req.user.id,
    instructor
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this instructor');
  }

  //change: updated to use courseName instead of course ID
  const review = await Review.create({
    instructor,
    instructorName,
    parent: req.user.id,
    studentId: req.user.id,
    rating,
    feedback,
    courseName, // Now using course name directly
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
    .populate('studentId', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Get all public reviews
// @route   GET /api/reviews/public
// @access  Public
const getPublicReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isPublic: true })
    .select('rating feedback helpfulCount createdAt courseName instructorName')
    .populate('instructor', 'name')
    .populate('parent', 'name')
    .populate('studentId', 'name')
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