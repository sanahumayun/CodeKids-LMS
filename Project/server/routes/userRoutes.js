const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { authenticate, checkRole } = require('../middleware/authMiddleware'); 

router.get('/', getUsers);

module.exports = router;
