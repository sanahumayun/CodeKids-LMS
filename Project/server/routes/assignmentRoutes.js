const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Tutor routes
router.post('/', 
  authenticate, 
  checkRole('tutor'), 
  upload.array('files'), 
  assignmentController.createAssignment
);

router.get('/course/:courseId', 
  authenticate, 
  assignmentController.getCourseAssignments
);

router.get('/:assignmentId', 
  authenticate, 
  assignmentController.getAssignment
);

router.get('/:assignmentId/submissions', 
  authenticate, 
  checkRole('tutor'), 
  assignmentController.getAssignmentSubmissions
);

router.put('/submissions/:submissionId/grade', 
  authenticate, 
  checkRole('tutor'), 
  assignmentController.gradeAssignment
);

// Student routes
router.post('/:assignmentId/submit', 
  authenticate, 
  checkRole('student'), 
  upload.array('files'), 
  assignmentController.submitAssignment
);

router.get('/student/submissions', 
  authenticate, 
  checkRole('student'), 
  assignmentController.getStudentSubmissions
);

module.exports = router;