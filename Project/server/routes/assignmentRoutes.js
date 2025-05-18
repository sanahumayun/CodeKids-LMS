const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

router.post('/tutor/courses/:courseId/upload-assignment', authenticate, checkRole(['tutor']), upload.single('assignmentFile'), assignmentController.uploadAssignment);
router.delete('/courses/:courseId/:assignmentId/delete-assignment', authenticate, checkRole(['tutor', 'admin']), assignmentController.deleteAssignment);
router.post('/tutor/courses/:courseId/assignments',authenticate,checkRole(['tutor']), upload.single('assignmentFile'), assignmentController.uploadAssignment);
router.get('/courses/:courseId/assignments', authenticate, checkRole(['student', 'tutor', 'admin']),assignmentController.getAssignmentsByCourse);
router.get('/assignments/:assignmentId', authenticate, checkRole(['student', 'tutor', 'admin']), assignmentController.getAssignmentById);

module.exports = router;
