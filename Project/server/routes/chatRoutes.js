// // server/routes/chatRoutes.js
// const express = require('express');
// const router = express.Router();
// const chatController = require('../controllers/chatController');

// // Get recent messages for a conversation
// router.get('/messages/:userId/:recipientId', chatController.getMessages);

// // Get all conversations for a user
// router.get('/conversations/:userId', chatController.getConversations);

// module.exports = router;

// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get recent messages for a conversation
router.get('/messages/:userId/:recipientId', chatController.getMessages);

// Get all conversations for a user
router.get('/conversations/:userId', chatController.getConversations);

module.exports = router;