import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const StudentCourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submission, setSubmission] = useState({});
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/courses/student/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setCourse(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch course details:", err.response ? err.response.data : err.message);
        setError("Failed to load course details.");
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleSubmissionChange = (e, assignmentId) => {
    setSubmission((prev) => ({
      ...prev,
      [assignmentId]: e.target.value,
    }));
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const content = submission[assignmentId];

    if (!content) {
      toast.error("Please provide your submission.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("You are not logged in!");
        return;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/assignments/${assignmentId}/submissions`,
        { content },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Assignment submitted successfully!");
      setSubmission((prev) => ({
        ...prev,
        [assignmentId]: "", // Clear the submission after successful submission
      }));
    } catch (err) {
      console.error("Error submitting assignment:", err);
      toast.error("Failed to submit assignment.");
    }
  };

  if (loading) return <div className="loader">Loading course details...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <button className="button button-primary" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2 className="page-title">{course.title}</h2>
        <p>{course.description}</p>

        <h3>Assignments</h3>
        {course.assignments.length === 0 ? (
          <p className="empty-message">No assignments available.</p>
        ) : (
          <ul className="assignment-list">
            {course.assignments.map((assignment) => (
              <li key={assignment._id} className="card assignment-item">
                <h4>{assignment.title}</h4>
                <p>{assignment.description}</p>
                <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>

                <textarea
                  placeholder="Enter your submission here"
                  value={submission[assignment._id] || ""}
                  onChange={(e) => handleSubmissionChange(e, assignment._id)}
                  rows="4"
                  className="submission-textarea"
                />
                <button
                  onClick={() => handleSubmitAssignment(assignment._id)}
                  className="button button-primary"
                >
                  Submit Assignment
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentCourseDetail;
