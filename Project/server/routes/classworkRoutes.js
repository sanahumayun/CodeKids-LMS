const express = require('express');
const router = express.Router();
const classworkController = require('../controllers/classworkController');
const upload = require('../utils/upload'); 
const { authenticate, checkRole } = require('../middleware/authMiddleware'); 

// Upload classwork
router.post('/student/:courseId/upload-classwork', authenticate, checkRole(['student']), upload.single('classworkFile'), classworkController.uploadClasswork);

// View student's classwork for a course
router.get('/:studentId/:courseId/classwork', authenticate, checkRole(['student', 'tutor', 'admin']), classworkController.viewClasswork);

// Delete a classwork submission
router.delete('/student/:courseId/:classworkId', authenticate, checkRole(['student']), classworkController.deleteClasswork);

module.exports = router;
