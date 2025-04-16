const express = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Admin dashboard route
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    res.json({ msg: 'Welcome to the Admin Dashboard' });
  }
);

// Tutor dashboard route
router.get(
  '/tutor',
  authMiddleware,
  roleMiddleware(['tutor']),
  (req, res) => {
    res.json({ msg: 'Welcome to the Tutor Dashboard' });
  }
);

// Student dashboard route
router.get(
  '/student',
  authMiddleware,
  roleMiddleware(['student']),
  (req, res) => {
    res.json({ msg: 'Welcome to the Student Dashboard' });
  }
);

module.exports = router;
