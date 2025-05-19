import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${authToken}` };

        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/courses/student/courses`,
          { headers }
        );

        setProgress(res.data);
      } catch (error) {
        console.error("Failed to fetch progress", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
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

      <h2>My Course Progress</h2>

      {progress.length === 0 ? (
        <p>You are not enrolled in any courses yet.</p>
      ) : (
        progress.map((course) => (
          <div key={course._id} className="card" style={{ marginBottom: "1em" }}>
            <h3>{course.title}</h3>
            <p><strong>Status:</strong> {course.status}</p>

            {course.status === "complete" && course.feedback ? (
              <div style={{ marginTop: "1em" }}>
                <h4>Feedback from {course.instructorId?.name || "your tutor"}:</h4>
                <p><strong>Comments:</strong> {course.feedback.comments}</p>
                <p>
                  <strong>Ratings:</strong><br />
                  Understanding: {course.feedback.ratings.understanding} / 5<br />
                  Participation: {course.feedback.ratings.participation} / 5<br />
                  Interest: {course.feedback.ratings.interest} / 5<br />
                  Homework: {course.feedback.ratings.homework} / 5
                </p>
              </div>
            ) : (
              course.status === "complete" && <p>No feedback available yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentProgressPage;
