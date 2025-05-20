import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchProgressAndFeedback = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${authToken}` };

        const [coursesRes, feedbacksRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/student/courses`, { headers }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses/student/feedback`, { headers }),
        ]);
        console.log("Feedbacks fetched:", feedbacksRes.data);
        setProgress(coursesRes.data);
        setFeedbacks(feedbacksRes.data);
      } catch (error) {
        console.error("Failed to fetch progress or feedback", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressAndFeedback();
  }, []);

  if (loading) return <p>Loading your progress...</p>;

  return (
    <div className="container">
      <button
        className="button button-secondary"
        onClick={() => navigate("/student-dashboard")}
      >
        ← Back
      </button>

      <h2>My CodeKids Journey</h2>

      {progress.map((course) => {
        const courseFeedback = feedbacks.find(f => f.courseId._id === course._id);

        return (
          <div key={course._id} className="card" style={{ marginBottom: "1em" }}>
            <h3>{course.title}</h3>
            <p><strong>Status:</strong> {course.status}</p>

            {course.status === "complete" && courseFeedback ? (
              <div style={{ marginTop: "1em" }}>
                <h4>Feedback from {courseFeedback.tutorId?.name || "your tutor"}:</h4>
                {courseFeedback.pdfUrl && (
                  <a
                    href={courseFeedback.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button"
                    style={{ marginTop: "0.5em" }}
                  >
                    View Feedback PDF
                  </a>
                )}
              </div>
            ) : (
              course.status === "complete" && <p>No feedback available yet.</p>
            )}
          </div>
        );
      })}

    </div>
  );
};

export default StudentProgressPage;
