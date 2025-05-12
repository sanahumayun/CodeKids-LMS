const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.post('/:courseId/tutor-upload-assignment', assignmentController.uploadAssignment);

router.get('/:courseId/assignments', assignmentController.getAssignmentsByCourse);

router.get('/assignment/:assignmentId', assignmentController.getAssignmentById);

module.exports = router;
