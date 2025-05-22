const Notification = require("../models/Notification");

const createNotification = async (userId, userType, message, link = null) => {
  try {
    const notif = new Notification({ userId, userType, message, link });
    await notif.save();
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

module.exports = createNotification;
