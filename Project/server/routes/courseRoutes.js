const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const upload = require('../utils/upload');

// Admin Routes
router.get('/admin/courses', courseController.getAllCourses);
router.post('/admin/courses/create', authenticate, checkRole(['admin']), courseController.createCourse);
router.post('/admin/courses/:courseId/enroll', authenticate, checkRole(['admin']), courseController.enrollStudent);
router.post('/admin/courses/:courseId/remove', authenticate, checkRole(['admin']), courseController.removeStudent);

// Tutor Routes
router.get('/tutor/courses', authenticate, checkRole(['tutor']), courseController.getTutorCourses);
router.get('/tutor/courses/:courseId', authenticate, checkRole(['tutor']), courseController.getTutorCourseDetail);
router.post('/tutor/courses/:courseId/upload-assignment', authenticate, checkRole(['tutor']), upload.single('assignmentFile'), courseController.uploadAssignment);
router.patch('/tutor/courses/:courseId/status', authenticate, checkRole(['tutor']), courseController.updateCourseStatus);
router.post('/tutor/courses/:courseId/upload-material', authenticate, checkRole(['tutor']), upload.single("materialFile"), courseController.uploadCourseMaterial);

// Student Routes
router.get('/student/courses', authenticate, checkRole(['student']), courseController.getMyEnrolledCourses);
router.get('/student/courses/:courseId', authenticate, checkRole(['student']), courseController.getStudentCourseDetail);

module.exports = router;