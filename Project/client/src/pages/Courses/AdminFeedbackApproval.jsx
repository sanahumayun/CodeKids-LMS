import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminFeedbackApprovalPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPendingFeedbacks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/courses/admin/feedback/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbacks(res.data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const approveFeedback = async (feedbackId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/courses/admin/${feedbackId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Feedback approved and PDF generated.");
      setFeedbacks(feedbacks.filter((f) => f._id !== feedbackId));
    } catch (error) {
      console.error("Error approving feedback:", error);
      toast.error("Failed to approve feedback.");
    }
  };

  useEffect(() => {
    fetchPendingFeedbacks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
        <button className="button button-secondary" onClick={() => navigate('/admin-dashboard')}>← Back</button>
      <h2>Pending Tutor Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p>No feedbacks awaiting approval.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Student</th>
              <th>Tutor</th>
              <th>Comments</th>
              <th>Ratings</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb._id}>
                <td>{fb.courseId.title}</td>
                <td>{fb.studentId.name}</td>
                <td>{fb.tutorId.name}</td>
                <td>{fb.comments}</td>
                <td>
                  <ul>
                    {Object.entries(fb.ratings).map(([key, val]) => (
                      <li key={key}>
                        {key}: {val}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="button"
                    onClick={() => approveFeedback(fb._id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminFeedbackApprovalPage;
