const express = require("express");
const router = express.Router();
const { submitAssignment } = require("../controllers/submissionController");
const { checkRole } = require("../middleware/authMiddleware");
// Students submit assignment
router.post("/", checkRole("student"), submitAssignment);
module.exports = router;
