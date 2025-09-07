import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocietyById } from '../../store/slices/societiesSlice';
import { fetchReviews, addReview, setCurrentSocietyId } from '../../store/slices/reviewsSlice';
import StarRating from '../common/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

const SocietyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    security: 0,
    amenities: 0,
    location: 0,
    maintenance: 0,
    noise: 0
  });

  const { currentSociety, isLoading: societyLoading } = useSelector((state) => state.societies);
  const { reviews, isLoading: reviewsLoading, isAdding } = useSelector((state) => state.reviews);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchSocietyById(id));
      dispatch(setCurrentSocietyId(id));
      dispatch(fetchReviews(id));
    }
  }, [dispatch, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to add a review');
      return;
    }

    if (newReview.rating === 0) {
      toast.error('Please select overall rating');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please add a review text');
      return;
    }

    try {
      // Ensure all required data is present and properly formatted
      const reviewData = {
        rating: parseInt(newReview.rating),
        comment: newReview.comment.trim(),
        security: parseInt(newReview.security) || 0,
        amenities: parseInt(newReview.amenities) || 0,
        location: parseInt(newReview.location) || 0,
        maintenance: parseInt(newReview.maintenance) || 0,
        noise: parseInt(newReview.noise) || 0
      };

      console.log('Submitting review:', { societyId: id, reviewData }); // Debug log

      await dispatch(addReview({
        societyId: id,
        reviewData
      })).unwrap();
      
      setNewReview({
        rating: 0,
        comment: '',
        security: 0,
        amenities: 0,
        location: 0,
        maintenance: 0,
        noise: 0
      });
      
      setShowReviewForm(false);
      toast.success('Review added successfully!');
      dispatch(fetchReviews(id)); // Refresh reviews
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.message || 'Failed to add review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRating = (rating) => {
    const numericRating = Number(rating) || 0;
    return numericRating.toFixed(1);
  };

  if (societyLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="w-12 h-12" />
      </div>
    );
  }

  if (!currentSociety) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Society Not Found</h2>
          <p className="text-secondary-600 mb-6">The society you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/societies')}
            className="btn-primary"
          >
            Browse Societies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Society Header */}
      <div className="card p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-3xl font-bold text-secondary-900">
                {currentSociety.name}
              </h1>
              {currentSociety.verified && (
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-secondary-600 text-lg mb-4">
              {currentSociety.address}, {currentSociety.city}
            </p>
            {currentSociety.description && (
              <p className="text-secondary-700 mb-4">
                {currentSociety.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <StarRating rating={Number(currentSociety.in_app_rating_avg) || 0} size="w-6 h-6" />
              <span className="text-lg font-semibold text-secondary-900">
                {formatRating(currentSociety.in_app_rating_avg)}
              </span>
            </div>
            <span className="text-secondary-600">
              ({currentSociety.in_app_rating_count || 0} reviews)
            </span>
          </div>
          {currentSociety.created_by_name && (
            <span className="text-sm text-secondary-500">
              Added by {currentSociety.created_by_name}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reviews Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Reviews</h2>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-primary"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </button>
            )}
          </div>

          {/* Add Review Form */}
          {showReviewForm && (
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Rating *
                  </label>
                  <StarRating
                    rating={newReview.rating}
                    interactive={true}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                    size="w-8 h-8"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Comment *
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="input-field"
                    placeholder="Share your experience living in this society..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Pros
                    </label>
                    <textarea
                      value={newReview.pros}
                      onChange={(e) => setNewReview({ ...newReview, pros: e.target.value })}
                      rows={3}
                      className="input-field"
                      placeholder="What did you like about this society?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Cons
                    </label>
                    <textarea
                      value={newReview.cons}
                      onChange={(e) => setNewReview({ ...newReview, cons: e.target.value })}
                      rows={3}
                      className="input-field"
                      placeholder="What could be improved?"
                    />
                  </div>
                </div>

                {/* Additional Rating Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Security Rating
                    </label>
                    <StarRating
                      rating={newReview.security}
                      interactive={true}
                      onRatingChange={(rating) => setNewReview({ ...newReview, security: rating })}
                      size="w-6 h-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Amenities Rating
                    </label>
                    <StarRating
                      rating={newReview.amenities}
                      interactive={true}
                      onRatingChange={(rating) => setNewReview({ ...newReview, amenities: rating })}
                      size="w-6 h-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Location Rating
                    </label>
                    <StarRating
                      rating={newReview.location}
                      interactive={true}
                      onRatingChange={(rating) => setNewReview({ ...newReview, location: rating })}
                      size="w-6 h-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Maintenance Rating
                    </label>
                    <StarRating
                      rating={newReview.maintenance}
                      interactive={true}
                      onRatingChange={(rating) => setNewReview({ ...newReview, maintenance: rating })}
                      size="w-6 h-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Noise Rating
                    </label>
                    <StarRating
                      rating={newReview.noise}
                      interactive={true}
                      onRatingChange={(rating) => setNewReview({ ...newReview, noise: rating })}
                      size="w-6 h-6"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="btn-primary"
                  >
                    {isAdding ? <LoadingSpinner size="w-5 h-5" color="text-white" /> : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="w-8 h-8" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary-600">No reviews yet. Be the first to review this society!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="card p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Reviewer name + rating */}
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {review.display_name}
                          </h4>
                          <StarRating rating={review.overall_rating} size="w-5 h-5" />
                        </div>

                        {/* Review text */}
                        <p className="text-gray-700 mb-3 leading-relaxed">
                          {review.text}
                        </p>

                        {/* Date */}
                        <p className="text-xs text-gray-500">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
      


                  <p className="text-secondary-700 mb-4">{review.comment}</p>

                  {(review.pros || review.cons) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {review.pros && (
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Pros:</h5>
                          <p className="text-sm text-secondary-600">{review.pros}</p>
                        </div>
                      )}
                      {review.cons && (
                        <div>
                          <h5 className="font-medium text-red-700 mb-2">Cons:</h5>
                          <p className="text-sm text-secondary-600">{review.cons}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Society Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-secondary-700">Address:</span>
                <p className="text-secondary-900">{currentSociety.address}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-700">City:</span>
                <p className="text-secondary-900">{currentSociety.city}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-700">Average Rating:</span>
                <p className="text-secondary-900">
                  {formatRating(currentSociety.in_app_rating_avg)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-secondary-700">Total Reviews:</span>
                <p className="text-secondary-900">{currentSociety.in_app_rating_count || 0}</p>
              </div>
              {currentSociety.verified && (
                <div>
                  <span className="text-sm font-medium text-secondary-700">Status:</span>
                  <p className="text-green-600 font-medium">✓ Verified</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetail;
