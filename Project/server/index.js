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

const allowedOrigins = [
  'http://localhost:3000',                    // local dev
  process.env.CLIENT_URL || 'https://codekids-lms.vercel.app' // production
];

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://codekids-lms.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// IMPORTANT: explicitly handle preflight
app.options('*', cors());


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
app.use('/api/courses', require("./routes/materialRoutes"));
app.use('/api/courses', require("./routes/classworkRoutes"));
app.use("/api/courses", require("./routes/submissionRoutes"));
app.use("/api/courses", require("./routes/reviewRoutes"));
app.use("/api/courses", require("./routes/feedbackRoutes"));

app.use("/api/notifications", require("./routes/notifRoutes"));

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, 
    methods: ["GET", "POST"],
    credentials: true
  }
});

require("./socket/socket")(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
