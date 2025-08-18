import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import societiesSlice from './slices/societiesSlice';
import reviewsSlice from './slices/reviewsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    societies: societiesSlice,
    reviews: reviewsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Export for use in components if needed
export const selectAuth = (state) => state.auth;
export const selectSocieties = (state) => state.societies;
export const selectReviews = (state) => state.reviews;
