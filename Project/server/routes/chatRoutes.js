const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware');

// Get messages for a course chat room
router.get('/messages/:courseId', authenticate, chatController.getMessages);

// Get all chat rooms for a user
router.get('/user-chatrooms/:userId', authenticate, chatController.getUserChatRooms);

module.exports = router;