import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  recentSearches: string[];
  maxRecentSearches: number;
}

const initialState: SearchState = {
  recentSearches: [],
  maxRecentSearches: 10,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query) return;
      
      // Remove if already exists (to move to top)
      state.recentSearches = state.recentSearches.filter(s => s !== query);
      
      // Add to beginning
      state.recentSearches.unshift(query);
      
      // Keep only max items
      if (state.recentSearches.length > state.maxRecentSearches) {
        state.recentSearches = state.recentSearches.slice(0, state.maxRecentSearches);
      }
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(s => s !== action.payload);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
});

export const {
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;

