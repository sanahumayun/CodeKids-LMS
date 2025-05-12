const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

// Get messages for a course chat room
exports.getMessages = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const chatRoom = await ChatRoom.findOne({ courseId });
    if (!chatRoom) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    const messages = await Message.find({ chatRoomId: chatRoom._id })
      .sort({ timestamp: 1 })
      .populate('sender', 'name');

    res.json({
      success: true,
      messages: messages.map(m => ({
        _id: m._id,
        content: m.content,
        sender: m.sender,
        timestamp: m.timestamp
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
};

// Get all chat rooms for a user
exports.getUserChatRooms = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chatRooms = await ChatRoom.find({
      'participants.userId': userId
    }).populate('courseId', 'title');

    res.json({
      success: true,
      chatRooms: chatRooms.map(room => ({
        _id: room._id,
        courseId: room.courseId._id,
        courseTitle: room.courseId.title,
        participants: room.participants
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch chat rooms' });
  }
};