import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addSociety } from '../../store/slices/societiesSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

const AddSociety = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState({});
  const { isAdding } = useSelector((state) => state.societies);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to add a society');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Society name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = 'Latitude must be a valid number between -90 and 90';
    }

    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = 'Longitude must be a valid number between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const societyData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        description: formData.description.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude
      };

      const result = await dispatch(addSociety(societyData)).unwrap();
      toast.success('Society added successfully!');
      navigate(`/society/${result.id}`);
    } catch (error) {
      console.error('Add society error:', error);
      toast.error(error.message || 'Failed to add society');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        });
        toast.success('Location added successfully!');
      },
      (error) => {
        toast.error('Unable to get your location. Please enter coordinates manually.');
      }
    );
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">Add New Society</h1>
        <p className="text-secondary-600 mb-8">
          Help others by adding a housing society to our database. Please provide accurate information.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Society Name */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Society Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter society name"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`input-field ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Enter full address"
              required
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`input-field ${errors.city ? 'border-red-500' : ''}`}
              placeholder="Enter city name"
              required
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="input-field"
              placeholder="Describe the society, its amenities, and features..."
            />
          </div>

          {/* Location Coordinates */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-secondary-700">
                Location Coordinates (Optional)
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                📍 Use Current Location
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className={`input-field ${errors.latitude ? 'border-red-500' : ''}`}
                  placeholder="Latitude (e.g., 28.6139)"
                />
                {errors.latitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className={`input-field ${errors.longitude ? 'border-red-500' : ''}`}
                  placeholder="Longitude (e.g., 77.2090)"
                />
                {errors.longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-secondary-500">
              Adding coordinates helps users find nearby societies and enables location-based features.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isAdding}
              className="btn-primary flex-1"
            >
              {isAdding ? (
                <>
                  <LoadingSpinner size="w-5 h-5" color="text-white" />
                  <span className="ml-2">Adding Society...</span>
                </>
              ) : (
                'Add Society'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/societies')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Guidelines */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Guidelines:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Provide accurate and complete information</li>
            <li>• Use the official society name as it appears on documents</li>
            <li>• Include the complete address with landmarks if possible</li>
            <li>• Add coordinates for better location accuracy</li>
            <li>• Write a helpful description highlighting key features</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddSociety;
