
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './global.css';

import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';

import TutorUploadAssignment from "./pages/Courses/TutorUploadAssignment";
import StudentCourseDetail from "./pages/Courses/StudentCourseDetail";

import CourseList from "./pages/Courses/CourseList";
import CreateCourse from "./pages/Courses/CreateCourse";
import TutorCourseDetails from "./pages/Courses/TutorCourseDetails";
import StudentReviewForm from "./pages/Courses/StudentReview";
import AdminReviewsPage from "./pages/Courses/AdminReviews";
import TutorFeedbackPage from "./pages/Courses/TutorFeedback";
import StudentFeedbackPage from "./pages/Courses/StudentFeedback";

import CreateTutor from "./pages/Create_Accounts/CreateTutor";
import CreateStudent from "./pages/Create_Accounts/CreateStudent";
import DeleteAccount from "./pages/Create_Accounts/DeleteAccount";

import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import TutorDashboard from "./pages/Dashboards/TutorDashboard";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";

import { ChatProvider } from "../src/ChatContext";
import ChatLayout from "../src/pages/Chat/ChatLayout";
import "./App.css";

function App() {
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"]; 
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<CourseList />} />
        <Route path="/admin/courses/create" element={<CreateCourse />} />
        <Route path="/admin/create-tutor" element={<CreateTutor />} />
        <Route path="/admin/create-student" element={<CreateStudent />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
        <Route path="/admin/delete" element={<DeleteAccount />} />

        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
        <Route path="/tutor/courses/:courseId" element={<TutorCourseDetails />} />
        <Route path="/tutor/courses/upload-assignment" element={<TutorUploadAssignment />} />
        <Route path="/tutor/feedback" element={<TutorFeedbackPage />} />

        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses/:courseId" element={<StudentCourseDetail />} />
        <Route path="/student/courses/:courseId/reviews" element={<StudentReviewForm />} />
        <Route path="/student/feedback" element={<StudentFeedbackPage />} />

        {/* Chat Routes */}
        <Route path="/chat" element={<ChatProvider><ChatLayout /></ChatProvider>} />
      </Routes>

      {/* ToastContainer here */}
      <ToastContainer />
    </Router>
  );
}


export default App;
