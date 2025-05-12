
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';

import TutorUploadAssignment from "./pages/Courses/TutorUploadAssignment";
import StudentCourseView from "./pages/Courses/StudentCourseView";
import TutorCourseView from "./pages/Courses/TutorCourseView";
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

      {/* ToastContainer here */}
      <ToastContainer />
    </Router>
  );
}


export default App;
