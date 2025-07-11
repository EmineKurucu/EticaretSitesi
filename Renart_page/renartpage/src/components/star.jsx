import React from 'react';
import './star.css';

const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    const fill = Math.min(Math.max(rating - i, 0), 1) * 100; // 0–100%
    stars.push(
      <div key={i} className="star-wrapper">
        <div className="star-background">★</div>
        <div className="star-fill" style={{ width: `${fill}%` }}>★</div>
      </div>
    );
  }

  return (
    <div className="star-rating">
      {stars}
      <span className="rating-text">({rating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;
