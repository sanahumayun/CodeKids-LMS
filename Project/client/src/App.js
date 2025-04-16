// src/App.js
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';

import TutorUploadAssignment from "./pages/Courses/TutorUploadAssignment";
import StudentCourseView from "./pages/Courses/StudentCourseView";
import TutorCourseView from "./pages/Courses/TutorCourseView";
// import StudentSubmitAssignment from "./components/StudentSubmitAssignment";
import StudentProgress from "./components/StudentProgress";
import TutorViewProgress from "./components/TutorViewProgress";
import CourseList from "./pages/Courses/CourseList";
import CreateCourse from "./pages/Courses/CreateCourse";

import InstructorReviews from "./components/InstructorReviews";
import SubmitReviewForm from "./components/SubmitReviewForm";
import CreateTutor from "./pages/Create_Accounts/CreateTutor";
import CreateStudent from "./pages/Create_Accounts/CreateStudent";

import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import TutorDashboard from "./pages/Dashboards/TutorDashboard";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";

import { ChatProvider } from "../src/ChatContext";
import ChatLayout from "../src/pages/Chat/ChatLayout";
import "./App.css";

// const App = () => {
//   return (
//     <Router>
//       <div style={{ padding: "20px" }}>
//         {/* 🔗 Navigation */}
//         <nav style={{ marginBottom: "30px" }}>
//           <Link to="/">
//             <button>🏠 Home</button>
//           </Link>
//           <Link to="/create-course">
//             <button>🆕 Create Course</button>
//           </Link>
//           <Link to="/courses">
//             <button>📚 Course List</button>
//           </Link>
//           <Link to="/tutor-upload">
//             <button>📤 Tutor - Upload Assignment</button>
//           </Link>
//           <Link to="/student-course-view">
//             <button>👩‍🎓 Student - View Courses</button>
//           </Link>
//           <Link to="/student-submit">
//             <button>📨 Student - Submit Assignment</button>
//           </Link>
//           <Link to="/instructor-reviews">
//             <button>⭐ Instructor Reviews</button>
//           </Link>
//           <Link to="/submit-review">
//             <button>✏️ Submit Review</button>
//           </Link>
//           <Link to="/chat">
//             <button>💬 Chat</button>
//           </Link>
//         </nav>

//         {/* 📌 Route Setup */}
//         <Routes>
//           {/* Authentication and Role-based routes */}
//           <Route path="/" element={<AuthPage />} />

//           {/* Admin Routes */}
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />

//           {/* Tutor Routes */}
//           <Route path="/tutor/dashboard" element={<TutorDashboard />} />
//           <Route path="/tutor-upload" element={<TutorUploadAssignment />} />
//           <Route path="/tutor-progress" element={<TutorViewProgress />} />

//           {/* Student Routes */}
//           <Route path="/student/dashboard" element={<StudentDashboard />} />
//           <Route path="/student-course-view" element={<StudentCourseView />} />
//           <Route path="/student-submit" element={<StudentSubmitAssignment />} />
//           <Route path="/student-progress" element={<StudentProgress />} />

//           {/* Course Management Routes */}
//           <Route path="/courses" element={<CourseList />} />
//           <Route path="/create-course" element={<CreateCourse />} />

//           {/* Instructor Reviews Routes */}
//           <Route path="/instructor-reviews" element={<InstructorReviews />} />
//           <Route path="/instructor-reviews/:instructorId" element={<InstructorReviews />} />
//           <Route path="/submit-review" element={<SubmitReviewForm />} />
//           <Route path="/submit-review/:instructorId" element={<SubmitReviewForm />} />

//           {/* User Creation Routes */}
//           <Route path="/create-tutor" element={<CreateTutor />} />
//           <Route path="/create-student" element={<CreateStudent />} />

          // {/* Chat Routes */}
          // <Route path="/chat" element={
          //   <ChatProvider>
          //     <ChatLayout />
          //   </ChatProvider>
          // } />
//         </Routes>
//       </div>
//     </Router>
//   );
// };


function App() {
  useEffect(() => {
    // Retrieve the token from localStorage (assuming you're storing it there)
    const authToken = localStorage.getItem("authToken");

    // If the token exists, set the Authorization header for all axios requests
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"]; // Clear it if no token exists
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/create-tutor" element={<CreateTutor />} />
        <Route path="/create-student" element={<CreateStudent />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/student-course-view" element={<StudentCourseView />} />
        <Route path="/submit-review-form" element={<SubmitReviewForm />} />
        <Route path="courses/tutor-course-view" element={<TutorCourseView />} />
        <Route path="courses/tutor-upload-assignment" element={<TutorUploadAssignment />} />
        {/* Chat Routes */}
        <Route path="/chat" element={<ChatProvider><ChatLayout /></ChatProvider>} />
      </Routes>
    </Router>
  );
}


export default App;
