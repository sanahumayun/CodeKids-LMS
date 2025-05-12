import React from "react";
import { Link, useNavigate } from "react-router-dom"
import "./TutorDashboard.css"

const TutorDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/")
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Tutor</h2>
        <nav className="sidebar-nav">
          <Link to="/courses/tutor-course-view" className="nav-link">My Teaching Courses</Link>

          <Link to="/tutor-progress" className="nav-link">View Students Progress</Link>

          <Link to="/chat" className="nav-link">
            Chat with Student
          </Link>

          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1 className="dashboard-heading">Tutor Dashboard</h1>

        <div className="analytics-cards">
          <div className="analytics-card">Weekly Schedule: --</div>
          <div className="analytics-card">Student Reviews: --</div>
          <div className="analytics-card">Enrolled Students: --</div>
        </div>
      </main>
    </div>
  );
};

export default TutorDashboard;
