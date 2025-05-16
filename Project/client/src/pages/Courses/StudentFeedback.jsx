import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const StudentFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${authToken}` };

        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/courses/student/feedback`,
          { headers }
        );

        setFeedbacks(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedback.");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p>{error}</p>;

  if (feedbacks.length === 0) {
    return <p>No feedback available yet.</p>;
  }

  return (
    <div className="container">
        <button 
        className="button button-secondary" 
        onClick={() => navigate(`/student-dashboard`)}
        disabled={loading}
      >
        ← Back
      </button>

      <h2>Your Feedback</h2>
      <ul>
        {feedbacks.map((fb) => (
          <li key={fb._id} style={{ border: "1px solid #ccc", margin: "1em 0", padding: "1em" }}>
            <h3>Course: {fb.courseId?.title || "Unknown course"}</h3>
            <p><strong>Tutor:</strong> {fb.tutorId?.name || "Unknown tutor"}</p>
            <p><strong>Comments:</strong> {fb.comments || "No comments"}</p>
            <p>
              <strong>Ratings:</strong><br />
              Understanding: {fb.ratings.understanding} / 5<br />
              Participation: {fb.ratings.participation} / 5<br />
              Interest: {fb.ratings.interest} / 5<br />
              Homework: {fb.ratings.homework} / 5
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentFeedbackPage;
