const express = require('express');
const router = express.Router();
const classworkController = require('../controllers/classworkController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const upload = require('../utils/upload');

// Upload classwork (students only)
router.post(
  '/student/courses/:courseId/upload-classwork',
  authenticate,
  checkRole(['student']),
  upload.single('classworkFile'),
  classworkController.uploadClasswork
);

// Delete classwork (students only — own classwork)
router.delete(
  '/student/courses/:courseId/:classworkId/delete-classwork',
  authenticate,
  checkRole(['student']),
  classworkController.deleteClasswork // <- fix controller method name
);

// Get classwork (students see own, tutors see all)
router.get(
  '/student/courses/:courseId/classworks',
  authenticate,
  checkRole(['student', 'tutor']),
  classworkController.getClassworks
);

module.exports = router;
