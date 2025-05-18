const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const upload = require('../utils/upload');

// Admin Routes
router.get('/admin/courses', authenticate, checkRole(['admin']), courseController.getAllCourses);
router.get('/admin/courses/:courseId', authenticate, checkRole(['admin']), courseController.getAdminCourseDetail);
router.post('/admin/courses/create', authenticate, checkRole(['admin']), courseController.createCourse);
router.post('/admin/courses/:courseId/enroll', authenticate, checkRole(['admin']), courseController.enrollStudent);
router.post('/admin/courses/:courseId/remove', authenticate, checkRole(['admin']), courseController.removeStudent);

// Tutor Routes
router.get('/tutor/courses', authenticate, checkRole(['tutor']), courseController.getTutorCourses);
router.get('/tutor/courses/:courseId', authenticate, checkRole(['tutor']), courseController.getTutorCourseDetail);
router.patch('/tutor/courses/:courseId/status', authenticate, checkRole(['tutor']), courseController.updateCourseStatus);

// Student Routes
router.get('/student/courses', authenticate, checkRole(['student', 'admin']), courseController.getMyEnrolledCourses);
router.get('/student/courses/:courseId', authenticate, checkRole(['student', 'admin']), courseController.getStudentCourseDetail);

module.exports = router;