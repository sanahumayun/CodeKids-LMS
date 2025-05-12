import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <nav className="sidebar-nav">
          <Link to="/admin/courses/create" className="nav-link">Create Course</Link>
          <Link to="/admin/courses" className="nav-link">View Courses</Link>
          <Link to="/admin/create-tutor" className="nav-link">Create Tutor</Link>
          <Link to="/admin/create-student" className="nav-link">Create Student</Link>
          <button 
            className="button button-secondary logout-button" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1 className="dashboard-heading">Admin Dashboard</h1>

        <div className="analytics-cards">
          <div className="analytics-card card">Total Courses: {courses.length}</div>
          <div className="analytics-card card">Total Tutors: --</div>
          <div className="analytics-card card">Total Students: --</div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
