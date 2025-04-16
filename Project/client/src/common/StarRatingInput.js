import React, { useState } from 'react';
import StarRating from './StarRating';

const StarRatingInput = ({ onRatingChange }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => {
            setRating(star);
            onRatingChange(star);
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <StarRating rating={hover || rating} size={32} />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
