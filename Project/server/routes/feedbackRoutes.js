const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const {authenticate, checkRole} = require('../middleware/authMiddleware'); 

router.post('/tutor/feedback/submit', authenticate, checkRole(['tutor']), feedbackController.submitFeedback);

router.get('/student/feedback', authenticate, feedbackController.getStudentFeedback);

module.exports = router;
