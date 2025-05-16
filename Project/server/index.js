const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const { authenticate, checkRole } = require('./middleware/authMiddleware');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true               
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

mongoose.connection.once('open', async () => {
  try {
    console.log('Attempting to fix ChatRoom indexes...');
    const chatRoomCollection = mongoose.connection.db.collection('chatrooms');
    
    const indexes = await chatRoomCollection.indexes();
    console.log('Current indexes:', indexes);
    
    if (indexes.some(index => index.name === 'course_1')) {
      console.log('Dropping problematic index: course_1');
      await chatRoomCollection.dropIndex('course_1');
      console.log('Successfully dropped problematic index');
    } else {
      console.log('Problematic index not found, no need to drop');
    }
    
    console.log('ChatRoom indexes fixed successfully');
  } catch (error) {
    console.error('Error fixing ChatRoom indexes:', error);
  }
});


app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use('/api/courses', require("./routes/assignmentRoutes"));
app.use("/api/courses", require("./routes/submissionRoutes"));
app.use("/api/courses", require("./routes/reviewRoutes"));
app.use("/api/courses", require("./routes/feedbackRoutes"));

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
require("./socket/socket")(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;