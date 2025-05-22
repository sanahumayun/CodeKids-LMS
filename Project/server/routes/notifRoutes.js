const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notifController');
const { authenticate, checkRole} = require('../middleware/authMiddleware'); 

router.get('/my', authenticate, notifController.getUserNotifications);

router.post('/:id/read', authenticate, notifController.markNotificationRead);

module.exports = router;
