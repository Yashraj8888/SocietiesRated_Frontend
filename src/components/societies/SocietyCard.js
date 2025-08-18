import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';

const SocietyCard = ({ society }) => {
  const {
    id,
    name,
    address,
    city,
    in_app_rating_avg,
    in_app_rating_count,
    verified,
    description,
    created_by_name
  } = society;

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-secondary-900">
              <Link 
                to={`/society/${id}`}
                className="hover:text-primary-600 transition-colors"
              >
                {name}
              </Link>
            </h3>
            {verified && (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-secondary-600 text-sm mb-2">
            {address}, {city}
          </p>
          {description && (
            <p className="text-secondary-700 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <StarRating rating={in_app_rating_avg || 0} />
          <span className="text-sm text-secondary-500">
            ({in_app_rating_count || 0} reviews)
          </span>
        </div>
        {created_by_name && (
          <span className="text-xs text-secondary-400">
            Added by {created_by_name}
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-secondary-200">
        <Link
          to={`/society/${id}`}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default SocietyCard;
