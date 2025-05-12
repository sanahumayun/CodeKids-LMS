import React from "react";
import { Link, useNavigate } from "react-router-dom"
import "./StudentDashboard.css"

const StudentDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Student</h2>
        <nav className="sidebar-nav">
          <Link to="/student-course-view" className="nav-link">My Enrolled Courses</Link>

          <Link to="/student-badges" className="nav-link">My Awards</Link>
          <Link to="/student-progress" className="nav-link">My Progress</Link>


          <Link to="/submit-review-form" className="nav-link">Review Instructors</Link>
          <Link to="/chat" className="nav-link">Chat with Tutor</Link>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>
    
      <main className="dashboard-main">
          <h1 className="dashboard-heading">Student Dashboard</h1>

          <div className="analytics-cards">
            <div className="analytics-card">Assignment Deadlines: --</div>
            <div className="analytics-card">Weekly Schedule: --</div>
          </div>
        </main>
    </div>
  );
};

export default StudentDashboard;
