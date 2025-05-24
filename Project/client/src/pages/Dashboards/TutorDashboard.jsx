import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import Notification from "../../components/notifs";

const TutorDashboard = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([]);
  const [showCourses, setShowCourses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/")
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses`, { headers: { Authorization: `Bearer ${authToken}` } });

        const coursesWithEnrolled = res.data.map(course => ({
          ...course,
          enrolledCount: course.studentsEnrolled ? course.studentsEnrolled.length : 0
        }));

        console.log("Courses with enrolled students:", coursesWithEnrolled);

        setCourses(coursesWithEnrolled);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tutor courses:", err);
        setError("Failed to load your courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const totalEnrolledStudents = courses.reduce(
    (sum, course) => sum + (course.enrolledCount || 0),
    0
  );

  const allAssignments = courses.flatMap(course =>
    course.assignments.map(assign => ({
      ...assign,
      courseTitle: course.title,
    }))
  );

  const now = new Date();
  const upcomingDeadlines = allAssignments
    .filter(a => new Date(a.dueDate) > now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);


  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Tutor</h2>
        <nav className="sidebar-nav">
          {/* Dropdown button */}
          <button
            className="button button-secondary"
            onClick={() => setShowCourses((prev) => !prev)}
            aria-expanded={showCourses}
            aria-controls="teaching-courses-list"
          >
            My Courses {showCourses ? "⬆" : "⬇"}
          </button>

          {/* Dropdown list */}
          {showCourses && (
            <ul id="teaching-courses-list" className="course-dropdown-list">
              {loading && <li>Loading courses...</li>}
              {error && <li className="error-message">{error}</li>}
              {!loading && !error && courses.length === 0 && (
                <li>No assigned courses found.</li>
              )}
              {!loading && !error && courses.map((course) => (
                <li key={course._id} className="course-dropdown-item">
                  <Link to={`/tutor/courses/${course._id}`} onClick={() => setShowCourses(false)}>
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link to="/chat" className="nav-link">
            Chat with Student
          </Link>

          <button
            className="button button-secondary logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1 className="dashboard-heading">Tutor Dashboard</h1>

        <Notification></Notification>

        <div className="analytics-cards">
          <div className="analytics-card card">
            Total Assigned Courses: {courses.length}
          </div>
          <div className="analytics-card card">
            Total Enrolled Students: {totalEnrolledStudents}
          </div>
          <div className="analytics-card card">
            Upcoming Deadlines:
            {upcomingDeadlines.length > 0 ? (
              <ul>
                {upcomingDeadlines.map((assignment) => (
                  <li key={assignment._id}>
                    <strong>{assignment.courseTitle}</strong> – {assignment.title}<br />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming deadlines</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default TutorDashboard;
