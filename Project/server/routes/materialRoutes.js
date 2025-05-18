const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const upload = require('../utils/upload');

router.post('/tutor/courses/:courseId/upload-material', authenticate, checkRole(['tutor']), upload.single("materialFile"), materialController.uploadCourseMaterial);
router.delete('/courses/:courseId/:materialId/delete-material', authenticate, checkRole(['admin', 'tutor']), upload.single("materialFile"), materialController.deleteMaterial);

module.exports = router;