import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const searchSocieties = createAsyncThunk(
  'societies/searchSocieties',
  async ({ query, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/societies/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search societies');
    }
  }
);

export const fetchTopSocieties = createAsyncThunk(
  'societies/fetchTopSocieties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/societies/top');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top societies');
    }
  }
);

export const fetchSocieties = createAsyncThunk(
  'societies/fetchSocieties',
  async (searchQuery = '', { rejectWithValue }) => {
    try {
      const response = await api.get(`/societies${searchQuery ? `?search=${searchQuery}` : ''}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch societies');
    }
  }
);

export const fetchSocietyById = createAsyncThunk(
  'societies/fetchSocietyById',
  async (societyId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/societies/${societyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch society details');
    }
  }
);

export const addSociety = createAsyncThunk(
  'societies/addSociety',
  async (societyData, { rejectWithValue }) => {
    try {
      const response = await api.post('/societies/add', societyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add society');
    }
  }
);

// Initial state
const initialState = {
  societies: [],
  currentSociety: null,
  loading: false,
  error: null,
  success: false,
};

const societiesSlice = createSlice({
  name: 'societies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearSearchResults: (state) => {
      state.societies = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Search societies
    builder.addCase(searchSocieties.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchSocieties.fulfilled, (state, action) => {
      state.loading = false;
      state.societies = action.payload;
    });
    builder.addCase(searchSocieties.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch top societies
    builder.addCase(fetchTopSocieties.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTopSocieties.fulfilled, (state, action) => {
      state.loading = false;
      state.societies = action.payload;
    });
    builder.addCase(fetchTopSocieties.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch societies
    builder.addCase(fetchSocieties.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSocieties.fulfilled, (state, action) => {
      state.loading = false;
      state.societies = action.payload;
    });
    builder.addCase(fetchSocieties.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch society by ID
    builder.addCase(fetchSocietyById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSocietyById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentSociety = action.payload;
    });
    builder.addCase(fetchSocietyById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add society
    builder.addCase(addSociety.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addSociety.fulfilled, (state, action) => {
      state.loading = false;
      state.societies.unshift(action.payload);
      state.success = true;
    });
    builder.addCase(addSociety.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, resetSuccess, clearSearchResults } = societiesSlice.actions;
export default societiesSlice.reducer;
