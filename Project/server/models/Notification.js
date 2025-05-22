const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: "userType", required: true },
  userType: { type: String, enum: ["Admin", "Student", "Tutor"], required: true },
  message: { type: String, required: true },
  link: { type: String }, // e.g., "/courses/123/review"
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
