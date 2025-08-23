import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (societyId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/societies/${societyId}/reviews`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ societyId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/societies/${societyId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

// Initial state
const initialState = {
  reviews: [],
  loading: false,
  error: null,
  success: false,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    ...initialState,
    currentSocietyId: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    setCurrentSocietyId: (state, action) => {
      state.currentSocietyId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch reviews
    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(fetchReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add review
    builder.addCase(addReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addReview.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews.unshift(action.payload);
      state.success = true;
    });
    builder.addCase(addReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, resetSuccess, setCurrentSocietyId } = reviewsSlice.actions;
export default reviewsSlice.reducer;
