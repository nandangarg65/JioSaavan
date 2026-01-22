import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '../types';

interface FavoritesState {
  songs: Song[];
}

const initialState: FavoritesState = {
  songs: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Song>) => {
      const exists = state.songs.find((s) => s.id === action.payload.id);
      if (!exists) {
        state.songs.unshift({ ...action.payload, isFavorite: true });
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter((s) => s.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<Song>) => {
      const index = state.songs.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        // Remove from favorites
        state.songs.splice(index, 1);
      } else {
        // Add to favorites
        state.songs.unshift({ ...action.payload, isFavorite: true });
      }
    },
    clearFavorites: (state) => {
      state.songs = [];
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

