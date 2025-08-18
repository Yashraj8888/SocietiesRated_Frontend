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
  addSociety: (societyData) => api.post('/societies/add', societyData),
};

// Reviews API
export const reviewsAPI = {
  getSocietyReviews: (societyId) => api.get(`/reviews/${societyId}`),
  addReview: (reviewData) => api.post('/reviews', reviewData),
};

export default api;
