const express = require('express');
const router = express.Router();
const { getMySubmissions, getSubmissionsByCourse, getCoursePercentage} = require('../controllers/progressController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');

router.get('/student', checkRole('student'), getMySubmissions);
router.get('/tutor/:courseId', checkRole('tutor'), getSubmissionsByCourse);
router.get('/course/:courseId/percentage', authenticate, checkRole('student'), getCoursePercentage );

module.exports = router;