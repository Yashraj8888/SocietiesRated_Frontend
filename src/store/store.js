import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';
import societiesSlice from './slices/societiesSlice';
import reviewsSlice from './slices/reviewsSlice';

// Configure persist for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these fields
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    societies: societiesSlice,
    reviews: reviewsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Export for use in components if needed
export const selectAuth = (state) => state.auth;
export const selectSocieties = (state) => state.societies;
export const selectReviews = (state) => state.reviews;
