const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");

// Submit review route
router.post(
  '/student/courses/:courseId/reviews',
  authenticate, checkRole(['student']),
  reviewController.submitReview
);

router.get(
  '/admin/reviews',
  authenticate, checkRole(['admin']),
  reviewController.getAllReviews
);

router.get('/student/courses/:courseId/reviews', authenticate, checkRole(['student', 'tutor']), reviewController.getReviewsForCourse);


module.exports = router;
