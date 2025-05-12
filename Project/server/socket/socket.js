module.exports = (io) => {
  const activeUsers = new Map();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", ({ userId, name }) => {
      activeUsers.set(socket.id, { userId, name, socketId: socket.id });
      console.log(`${name} joined with ID: ${userId}`);
    });

    // Handle course chat messages
    socket.on("courseMessage", async ({ content, courseId, senderId }) => {
      try {
        // Verify sender is in the course chat room
        const chatRoom = await ChatRoom.findOne({
          courseId,
          'participants.userId': senderId
        });
        
        if (!chatRoom) {
          return socket.emit('error', 'Not in chat room');
        }

        // Save message to database
        const message = new Message({
          chatRoomId: chatRoom._id,
          sender: senderId,
          content
        });
        await message.save();

        // Get all participants in this course chat
        const participantIds = chatRoom.participants.map(p => p.userId.toString());

        // Find all active sockets for these participants
        const recipients = Array.from(activeUsers.entries())
          .filter(([_, user]) => participantIds.includes(user.userId))
          .map(([socketId]) => socketId);

        // Send message to all participants
        recipients.forEach(id => {
          io.to(id).emit("courseMessage", {
            _id: message._id,
            content,
            sender: { _id: senderId, name: activeUsers.get(socket.id)?.name },
            timestamp: message.timestamp
          });
        });
      } catch (err) {
        console.error('Error handling course message:', err);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      activeUsers.delete(socket.id);
    });
  });
};