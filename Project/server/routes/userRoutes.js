const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, checkRole } = require('../middleware/authMiddleware'); 

router.get('/', userController.getUsers);
router.delete('/:userId', authenticate, checkRole(['admin']), userController.deleteUser);

module.exports = router;
