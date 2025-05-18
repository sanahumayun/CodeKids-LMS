import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/admin/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="loader"></div>;

  return (
    <div className="container">
      <button className="button button-secondary" onClick={() => navigate('/admin-dashboard')}>
        ← Back
      </button>

      <h2 className="page-title">All Courses</h2>

      {courses.length === 0 ? (
        <p className="empty-message">No courses found.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div
              key={course._id}
              className="card clickable-card"
              onClick={() => navigate(`/admin/courses/${course._id}`)}
            >
              <h3 className="card-header">{course.title}</h3>
              <p className="card-body">{course.description}</p>
              <p className="instructor-info">
                Instructor: {course.instructorId?.name} ({course.instructorId?.email})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
