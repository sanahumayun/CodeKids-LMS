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

// Middleware to parse incoming requests as JSON
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Auth Routes
app.use('/api/auth', authRoutes);

// Routes
const courseRoutes = require("./routes/courseRoutes.js");
const assignmentRoutes = require("./routes/assignmentRoutes.js");
const submissionRoutes = require("./routes/submissionRoutes.js");
const progressRoutes = require("./routes/progressRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require('./routes/userRoutes');

// app.use("/api/users", authRoutes);
app.use('/api/users', userRoutes);
// ⚠️ This opens the route to everyone (no auth check)
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", authenticate, checkRole('admin', 'tutor'), assignmentRoutes); // Same here
app.use("/api/submissions", authenticate, checkRole('admin', 'tutor', 'student'), submissionRoutes); // Allow students to submit as well
app.use("/api/progress", authenticate, checkRole('admin', 'tutor', 'student'), progressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes); 

app.get("/", (req, res) => {
  res.send("Chat Server is running");
});

// Define the port; default to 8000 if PORT isn't set in the environment
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Create HTTP server and attach socket.io
    const server = http.createServer(app);

    const io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Setup socket events (adjust accordingly in your socket file)
    require("./socket/socket.js")(io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));


    
   

