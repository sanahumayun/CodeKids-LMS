import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import Notifications from "../../components/notifs";

const StudentDashboard = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextDeadlines, setNextDeadlines] = useState(null);
  const [showCourses, setShowCourses] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);


  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    const fetchCoursesAndData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/courses/student/courses`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const coursesWithRatings = await Promise.all(
          res.data.map(async (course) => {
            // fetch reviews for each course to calculate avg rating
            const reviewsRes = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/courses/student/courses/${course._id}/reviews`,
              { headers: { Authorization: `Bearer ${authToken}` } }
            );

            const allRatings = reviewsRes.data.reviews.flatMap(r =>
              r.responses.map(q => q.rating)
            );

            const avgRating =
              allRatings.length > 0
                ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
                : null;

            return {
              ...course,
              avgRating,
            };
          })
        );

        setCourses(coursesWithRatings);

        // Collect all assignments with course title for deadlines
        const allAssignments = coursesWithRatings.flatMap(course =>
          (course.assignments || []).map(assignment => ({
            ...assignment,
            courseTitle: course.title,
          }))
        );

        const now = new Date();
        const upcoming = allAssignments
          .filter(a => new Date(a.dueDate) > now)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        setNextDeadlines(upcoming.slice(0, 3));

        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchCoursesAndData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/notifications/my`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setNotifLoading(false);
      }
    };

    fetchNotifications();
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Student</h2>
        <nav className="sidebar-nav">

          {/* Dropdown button */}
          <button
            className="button button-secondary"
            onClick={() => setShowCourses((prev) => !prev)}
            aria-expanded={setCourses}
            aria-controls="enrolled-courses-list"
          >
            My Enrolled Courses {showCourses ? "⬆" : "⬇"}
          </button>

          {/* Dropdown list */}
          {showCourses && (
            <ul id="enrolled-courses-list" className="course-dropdown-list">
              {loading && <li>Loading courses...</li>}
              {error && <li className="error-message">{error}</li>}
              {!loading && !error && courses.length === 0 && (
                <li>No enrolled courses found.</li>
              )}
              {!loading && !error && courses.map((course) => (
                <li key={course._id} className="course-dropdown-item">
                  <Link to={`/student/courses/${course._id}`} onClick={() => setShowCourses(false)}>
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link to="/student/progress" className="nav-link">My Progress</Link>
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

        <Notifications />

        <div className="analytics-cards">
          <div className="analytics-card card">
            Total Enrolled Courses: <p>{courses.length}</p>
          </div>
          <div className="analytics-card card">
            Average Ratings per Course:
            <ul>
              {courses.map((course) => (
                <li key={course._id}>
                  {course.title}: {course.avgRating || "No ratings yet"}
                </li>
              ))}
            </ul>
          </div>
          <div className="analytics-card card">
            Upcoming Deadlines:
            {nextDeadlines.length > 0 ? (
              <ul>
                {nextDeadlines.map((assignment) => (
                  <li key={assignment._id}>
                    <strong>{assignment.courseTitle}</strong> – {assignment.title}
                    <br />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming assignments</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
};

export default StudentDashboard;
