import React from "react";
import { Link, useNavigate } from "react-router-dom"

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
          <Link to="/student/courses" className="nav-link">My Enrolled Courses</Link>
          <Link to="/chat" className="nav-link">Chat with Tutor</Link>
          <button 
            className="button button-secondary logout-button" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>
    
      <main className="dashboard-main">
          <h1 className="dashboard-heading">Student Dashboard</h1>

          <div className="analytics-cards">
            <div className="analytics-card card">Assignment Deadlines: --</div>
            <div className="analytics-card card">Weekly Schedule: --</div>
          </div>
        </main>
    </div>
  );
};

export default StudentDashboard;
