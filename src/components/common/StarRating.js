import React from 'react';

const StarRating = ({ rating = 0, interactive = false, onRatingChange, size = 'w-5 h-5' }) => {
  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} 
                     transition-transform duration-150 ${size}`}
        >
          <svg
            className={`${size} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRating;
