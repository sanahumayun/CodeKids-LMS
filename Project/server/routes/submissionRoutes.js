const express = require("express");
const router = express.Router();
const {submitAssignment, getSubmissionsForAssignment, updateSubmissionGrade} = require("../controllers/submissionController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

router.post(
  '/assignments/:assignmentId/submissions',
  authenticate,
  checkRole(['student']),
  (req, res, next) => {
    console.log("📡 submission route matched!");
    next();
  },
upload.single('submissionFile'), submitAssignment);

router.get(
  '/assignments/:assignmentId/submissions',
  authenticate,
  checkRole(['tutor', 'admin']),
  (req, res, next) => {
    console.log("📡 submission route matched!");
    next();
  },
  getSubmissionsForAssignment
);

router.patch(
  '/tutor/courses/assignments/:assignmentId/submissions/:submissionId/grade',
  authenticate, checkRole(['tutor']),   // Optional: protect route so only tutors can grade
  updateSubmissionGrade
);


module.exports = router;
