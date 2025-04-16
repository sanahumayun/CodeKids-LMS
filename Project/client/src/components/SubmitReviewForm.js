import React, { useState } from 'react';
import { createReview } from '../api/reviewApi';
import StarRatingInput from '../common/StarRatingInput';
import { toast } from 'react-toastify';


const SubmitReviewForm = ({ instructorId, courseId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !feedback) {
      toast.error('Please provide both a rating and feedback');
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        instructor: instructorId,
        rating,
        feedback,
        course: courseId,
        isPublic
      });
      toast.success('Review submitted successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <h3>Submit Your Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating:</label>
          <StarRatingInput rating={rating} setRating={setRating} />
        </div>
        
        <div className="form-group">
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            required
          />
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label htmlFor="isPublic">Make this review public</label>
        </div>
        
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default SubmitReviewForm;
