import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

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
                  {Object.entries(rev.responses).map(([q, val]) => (
                    <div key={q}>{q}: {val}</div>
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
