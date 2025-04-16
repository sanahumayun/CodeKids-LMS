"use client"
import { Link, useNavigate } from "react-router-dom"
import "./TutorDashboard.css"

const TutorDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/")
  }

  return (
    <div className="tutor-dashboard">
      <div className="dashboard-container">
        <h2 className="dashboard-title">👨‍🏫 Tutor Dashboard</h2>

        <ul className="dashboard-menu">
          <li className="menu-item">
            <Link to="/courses/tutor-course-view" className="menu-link course-link">
              <span className="menu-icon">📘</span>
              <span className="menu-text">My Teaching Courses</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/courses/tutor-upload-assignment" className="menu-link upload-link">
              <span className="menu-icon">📝</span>
              <span className="menu-text">Upload Assignments</span>
            </Link>
          </li>
        </ul>

        <button onClick={handleLogout} className="logout-button">
          <span className="logout-icon">🚪</span> Logout
        </button>
      </div>
    </div>
  )
}

export default TutorDashboard
