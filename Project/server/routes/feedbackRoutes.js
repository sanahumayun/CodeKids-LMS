const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const {authenticate, checkRole} = require('../middleware/authMiddleware'); 

router.post('/tutor/feedback/submit', authenticate, checkRole(['tutor']), feedbackController.submitFeedback);

router.get('/student/feedback', authenticate, feedbackController.getStudentFeedback);

router.post("/admin/:feedbackId/approve", authenticate, checkRole(['admin']), feedbackController.approveFeedback);

router.get("/admin/feedback/pending", authenticate, checkRole(['admin']), feedbackController.getPendingFeedbacks);

module.exports = router;
