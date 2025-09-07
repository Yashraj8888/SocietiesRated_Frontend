import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Societies API
export const societiesAPI = {
  getTopSocieties: () => api.get('/societies/top'),
  searchSocieties: (query, limit = 10) => api.get(`/societies/search?query=${encodeURIComponent(query)}&limit=${limit}`),
  getSocietiesByCity: (city, limit = 10) => api.get(`/societies/city/${encodeURIComponent(city)}?limit=${limit}`),
  getNearbySocieties: (lat, lng, radius = 5000) => api.get(`/societies/nearby/search?lat=${lat}&lng=${lng}&radius=${radius}`),
  getSocietyById: (id) => api.get(`/societies/${id}`),
  addSociety: (societyData) => {
    const formattedData = {
      name: societyData.name,
      address: societyData.address,
      city: societyData.city,
      description: societyData.description,
      lat: parseFloat(societyData.latitude) || null,
      lng: parseFloat(societyData.longitude) || null
    };
    return api.post('/societies/add', formattedData);
  },
};

// Reviews API
export const reviewsAPI = {
  getSocietyReviews: (societyId) => api.get(`/reviews/${societyId}`),
  addReview: (reviewData) => {
    // Match exactly what backend expects
    const formattedData = {
      society_id: reviewData.societyId,
      overall_rating: parseInt(reviewData.rating),
      text: reviewData.comment || '',  // Ensure text is not undefined
      dims: {
        security: parseInt(reviewData.dimensions.security) || 0,
        amenities: parseInt(reviewData.dimensions.amenities) || 0,
        location: parseInt(reviewData.dimensions.location) || 0,
        maintenance: parseInt(reviewData.dimensions.maintenance) || 0,
        noise: parseInt(reviewData.dimensions.noise) || 0
      }
    };
    console.log('Sending review data:', formattedData); // Debug log
    return api.post('/reviews/create', formattedData);
  }
};

export default api;
