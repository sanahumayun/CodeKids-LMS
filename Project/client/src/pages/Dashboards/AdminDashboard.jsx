import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [tutorCount, setTutorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [topCourses, setTopCourses] = useState([]);

  // New states for search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };

        // Fetch all enriched courses
        const courseRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/admin/courses`, { headers });
        const allCourses = courseRes.data.courses || courseRes.data;
        setCourses(allCourses);

        // Fetch tutor and student counts
        const [tutorsRes, studentsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/users?role=tutor`, { headers }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/users?role=student`, { headers }),
        ]);

        setTutorCount(tutorsRes.data.length);
        setStudentCount(studentsRes.data.length);

        // Fetch all reviews once
        const reviewRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/admin/reviews`, { headers });
        const reviews = reviewRes.data.reviews;

        // Map courseId => [ratings...]
        const ratingsByCourse = {};
        reviews.forEach(review => {
          const courseId = review.course;
          const ratings = review.responses.map(r => r.rating);
          if (!ratingsByCourse[courseId]) ratingsByCourse[courseId] = [];
          ratingsByCourse[courseId].push(...ratings);
        });

        // Enrich courses with avgRating
        const coursesWithAvg = allCourses.map(course => {
          const ratings = ratingsByCourse[course._id] || [];
          const avgRating =
            ratings.length > 0
              ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
              : null;
          return { ...course, avgRating };
        });

        const top3 = coursesWithAvg
          .filter(c => c.avgRating !== null)
          .sort((a, b) => b.avgRating - a.avgRating)
          .slice(0, 3);

        setTopCourses(top3);
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      }
    };

    fetchData();
  }, []);

  // Search handler with debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const authToken = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${authToken}` };

    setSearchLoading(true);

    const delayDebounce = setTimeout(() => {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/users/admin/users/search?q=${searchQuery}`, { headers })
        .then((res) => {
          setSearchResults(res.data);
          setSearchLoading(false);
        })
        .catch(() => {
          setSearchResults([]);
          setSearchLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <nav className="sidebar-nav">
          <Link to="/admin/courses/create" className="nav-link">Create Course</Link>
          <Link to="/admin/courses" className="nav-link">View Courses</Link>
          <Link to="/admin/create-tutor" className="nav-link">Create Tutor</Link>
          <Link to="/admin/create-student" className="nav-link">Create Student</Link>
          <Link to="/admin/reviews" className="nav-link">View Reviews</Link>
          <Link to="/admin/delete" className="nav-link">Delete Profiles</Link>
          <Link to="/admin/feedback-approvals" className="nav-link">Approve Evaluation Reports</Link>
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

        {/* Search bar */}
        <section style={{ marginBottom: "2rem" }}>
          <label htmlFor="user-search" style={{ fontWeight: "bold" }}>Search Students/Tutors:</label>
          <input
            id="user-search"
            type="text"
            placeholder="Enter name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ marginTop: "0.5rem", width: "100%", maxWidth: 400 }}
          />
          {searchLoading && <p>Searching...</p>}
          {searchResults.length > 0 && (
            <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", maxWidth: 400, background: "#fff" }}>
              {searchResults.map(user => (
                <li
                  key={user._id}
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                  style={{ cursor: "pointer", padding: "8px", borderBottom: "1px solid #eee" }}
                >
                  <strong>{user.name}</strong> ({user.email}) — <em>{user.role}</em>
                </li>
              ))}
            </ul>
          )}
          {searchQuery.length >= 2 && !searchLoading && searchResults.length === 0 && (
            <p>No users found.</p>
          )}
        </section>

        <div className="analytics-cards">
          <div className="analytics-card card">Total Courses: {courses.length}</div>
          <div className="analytics-card card">Total Tutors: {tutorCount}</div>
          <div className="analytics-card card">Total Students: {studentCount}</div>
          <div className="analytics-card card">
            <h3>Top 3 Rated Courses</h3>
            {topCourses.length > 0 ? (
              <ul>
                {topCourses.map(course => (
                  <li key={course._id}>
                    {course.title} – {course.avgRating}⭐
                  </li>
                ))}
              </ul>
            ) : (
              <p>No rated courses yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
