const express = require('express');
const router = express.Router();
const { getMySubmissions, getSubmissionsByCourse } = require('../controllers/progressController');
const { checkRole } = require('../middleware/authMiddleware');

router.get('/student', checkRole('student'), getMySubmissions);
router.get('/tutor/:courseId', checkRole('tutor'), getSubmissionsByCourse);

module.exports = router;