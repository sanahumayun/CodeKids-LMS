import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        <div className="dashboard-menu">
          <Link to="/create-course" className="menu-item create-course">
            <span className="menu-icon">➕</span>
            <span className="menu-text">Create Course</span>
          </Link>

          <Link to="/course-list" className="menu-link course-list">
              <span className="menu-icon">🧾</span>
              <span className="menu-text">View All Courses</span>
          </Link>

          <Link to="/create-tutor" className="menu-item create-tutor">
            <span className="menu-icon">👨‍🏫</span>
            <span className="menu-text">Create Tutor Profile</span>
          </Link>

          <Link to="/create-student" className="menu-item create-student">
            <span className="menu-icon">👩‍🎓</span>
            <span className="menu-text">Create Student Profile</span>
          </Link>
        </div>

        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
