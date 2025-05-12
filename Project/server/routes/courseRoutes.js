const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");


router.get('/course-list', courseController.getAllCourses);

router.post('/', authenticate, courseController.createCourse);

router.get('/student-course-view', authenticate, checkRole(['student']), courseController.getMyEnrolledCourses);

router.get('/tutor-course-view', authenticate, checkRole(['tutor']), courseController.getTutorCourses);
router.post('/:courseId/tutor-upload-assignment',authenticate, checkRole(['tutor']), courseController.uploadAssignment);

router.post('/:courseId/enroll', authenticate, checkRole('admin'), courseController.enrollStudent);
router.post('/:courseId/remove-student', authenticate, checkRole('admin'), courseController.removeStudent);

module.exports = router;
