const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");

// 🔓 Public route - view all courses
router.get('/course-list', courseController.getAllCourses);

// 🔐 Create a course - authenticated users (adjust role check if needed)
router.post('/', authenticate, courseController.createCourse);

// 🔐 Get courses a student is enrolled in (students only)
router.get('/student-course-view', authenticate, checkRole(['student']), courseController.getMyEnrolledCourses);

// 🔐 Get courses a tutor is teaching (tutors only)
router.get('/tutor-course-view', authenticate, checkRole(['tutor']), courseController.getTutorCourses);
router.post('/:courseId/tutor-upload-assignment',authenticate, checkRole(['tutor']), courseController.uploadAssignment);

router.post('/:courseId/enroll', authenticate, checkRole('admin'), courseController.enrollStudent);
router.post('/:courseId/remove-student', authenticate, checkRole('admin'), courseController.removeStudent);

module.exports = router;
