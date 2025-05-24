const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.role; // Admin, Tutor, Student

    // Find notifications for the user, optionally you can filter by userType or something else
    const notifications = await Notification.find({ userId, userType }).sort({ createdAt: -1 });
    console.log(`notifs: ${notifications}`);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notifId = req.params.id;
    await Notification.findByIdAndUpdate(notifId, { isRead: true });
    res.sendStatus(200);
  } catch (err) {
    console.error('Failed to mark notification as read:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
