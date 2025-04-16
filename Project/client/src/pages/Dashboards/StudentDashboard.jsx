"use client"
import { Link, useNavigate } from "react-router-dom"
import "./StudentDashboard.css"

const StudentDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <h2 className="dashboard-title">🎓 Student Dashboard</h2>
        <ul className="dashboard-menu">
          <li className="menu-item">
            <Link to="/student-course-view" className="menu-link enrolled-courses-link">
              <span className="menu-icon">🎓</span>
              <span className="menu-text">My Enrolled Courses</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/submit-review-form" className="menu-link review-link">
              <span className="menu-icon">🌟</span>
              <span className="menu-text">Review Instructors</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/chat" className="menu-link chat-link">
              <span className="menu-icon">💬</span>
              <span className="menu-text">Chat with Tutor</span>
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

export default StudentDashboard
