const Notification = require("../models/Notification");

const createNotification = async (userId, userType, message, link = null) => {
  try {
    console.log(`Creating notification for user ${userId} (${userType}): ${message}`);
    const notif = new Notification({ userId, userType, message, link });
    await notif.save();
    console.log('Notification saved.');
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};


module.exports = createNotification;
