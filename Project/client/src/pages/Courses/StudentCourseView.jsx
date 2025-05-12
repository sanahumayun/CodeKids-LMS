import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const StudentCourseView = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/courses/student/courses`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch student courses:", err.response ? err.response.data : err.message);
        setError("Failed to load your courses.");
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <button className="button button-primary" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2 className="page-title">My Enrolled Courses</h2>
        {courses.length === 0 ? (
          <p className="empty-message">You are not enrolled in any courses yet.</p>
        ) : (
          <ul className="course-list">
            {courses.map((course) => (
              <li key={course._id} className="card course-item">
                <Link to={`/student/courses/${course._id}`}>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentCourseView;
