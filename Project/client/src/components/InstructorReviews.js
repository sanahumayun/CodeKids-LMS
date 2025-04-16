import React, { useState, useEffect } from 'react';
import { getInstructorReviews, markHelpful } from '../api/reviewApi';
import StarRating from '../common/StarRating';
import { useSelector } from 'react-redux';


const InstructorReviews = ({ instructorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getInstructorReviews(instructorId);
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setLoading(false);
      }
    };
    fetchReviews();
  }, [instructorId]);

  const handleHelpful = async (reviewId) => {
    try {
      await markHelpful(reviewId);
      setReviews(reviews.map(review => 
        review._id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 } 
          : review
      ));
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="reviews-container">
      <h3>Instructor Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <StarRating rating={review.rating} />
                <span className="reviewer">{review.parent.name}</span>
                {review.course && <span className="course">for {review.course.name}</span>}
              </div>
              <p className="feedback">{review.feedback}</p>
              <div className="review-footer">
                <button 
                  onClick={() => handleHelpful(review._id)}
                  disabled={!userInfo || userInfo.role !== 'parent'}
                  className="helpful-btn"
                >
                  Helpful ({review.helpfulCount})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorReviews;
