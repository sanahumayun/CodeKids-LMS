const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { authenticate, checkRole } = require('../middleware/authMiddleware'); // if you have auth

// Optional: you can secure this route if needed
// router.get('/', authenticate, checkRole(['admin']), getUsers);
router.get('/', getUsers);

module.exports = router;
