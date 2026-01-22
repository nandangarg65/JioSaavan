import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode } from '../types';

interface ThemeState {
  themeMode: ThemeMode;
  isDark: boolean;
}

const initialState: ThemeState = {
  themeMode: 'light',
  isDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      state.isDark = action.payload === 'dark';
    },
    toggleTheme: (state) => {
      const newMode = state.themeMode === 'light' ? 'dark' : 'light';
      state.themeMode = newMode;
      state.isDark = newMode === 'dark';
    },
  },
});

export const { setThemeMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

