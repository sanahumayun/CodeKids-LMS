// import express from 'express';
// import {
//   createReview,
//   getInstructorReviews,
//   getPublicReviews,
//   markHelpful,
// } from '../controllers/reviewController.js';
// import { protect, parentOnly } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.route('/')
//   .post(protect, parentOnly, createReview);

// router.route('/instructor/:id')
//   .get(getInstructorReviews);

// router.route('/public')
//   .get(getPublicReviews);

// router.route('/:id/helpful')
//   .put(protect, parentOnly, markHelpful);

// export default router;
const express = require('express');

const {
  createReview,
  getInstructorReviews,
  getPublicReviews,
  markHelpful,
} = require('../controllers/reviewController.js');

const { protect, parentOnly } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/')
  .post(createReview);

router.route('/instructor/:id')
  .get(getInstructorReviews);

router.route('/public')
  .get(getPublicReviews);

router.route('/:id/helpful')
  .put(markHelpful);

module.exports = router;
