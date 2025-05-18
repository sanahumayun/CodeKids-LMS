import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/courses/admin/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReviews(res.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="dashboard-main">
      <button 
        className="button button-secondary" 
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h1 className="dashboard-heading">All Course Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Responses</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev) => (
              <tr key={rev._id}>
                <td>{rev.studentId?.name}</td>
                <td>{rev.courseId?.title}</td>
                <td>{rev.instructorId?.name}</td>
                <td>
                  {rev.responses.map((resp) => (
                    <div key={resp._id}>
                      <strong>{resp.question}</strong>: {resp.rating}
                    </div>
                  ))}
                </td>
                <td>{rev.comment || '—'}</td>
                <td>{new Date(rev.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
};

export default AdminReviewsPage;
