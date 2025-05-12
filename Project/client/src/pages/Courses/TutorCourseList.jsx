import { useEffect, useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import axios from "axios";

const TutorCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/tutor/courses`, { withCredentials: true });
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tutor courses:", err);
        setError("Failed to load your courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="loading-message">Loading courses...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
  <div className="container">
    <button 
        className="button button-secondary" 
        onClick={() => navigate(-1)}
        disabled={loading}
      >
        ← Back
      </button>
      
    <h2 className="page-title">My Teaching Courses</h2>
    {courses.length === 0 ? (
      <p className="empty-message">You are not teaching any courses yet.</p>
    ) : (
      <div className="course-grid">
        {courses.map((course) => (
          <Link 
            to={`/tutor/courses/${course._id}`} 
            className="card course-card" 
            key={course._id}
          >
            <h3 className="card-header">{course.title}</h3>
            <p className="card-body">{course.description}</p>
          </Link>
        ))}
      </div>
    )}
  </div>
);
};

export default TutorCourseListPage;
