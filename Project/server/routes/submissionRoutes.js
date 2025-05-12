const express = require("express");
const router = express.Router();
const {submitAssignment, getSubmissionsForAssignment} = require("../controllers/submissionController");
const { authenticate, checkRole } = require("../middleware/authMiddleware");

router.post(
  '/assignments/:assignmentId/submissions',
  authenticate,
  checkRole(['student']),
  (req, res, next) => {
    console.log("📡 submission route matched!");
    next();
  },
submitAssignment);

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

module.exports = router;
