const express = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get(
  '/admin',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    res.json({ msg: 'Welcome to the Admin Dashboard' });
  }
);

router.get(
  '/tutor',
  authMiddleware,
  roleMiddleware(['tutor']),
  (req, res) => {
    res.json({ msg: 'Welcome to the Tutor Dashboard' });
  }
);

router.get(
  '/student',
  authMiddleware,
  roleMiddleware(['student']),
  (req, res) => {
    res.json({ msg: 'Welcome to the Student Dashboard' });
  }
);

module.exports = router;
