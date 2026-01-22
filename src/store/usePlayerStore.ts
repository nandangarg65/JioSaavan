import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '../types';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentPosition: number;
  duration: number;
  queue: Song[];
  queueIndex: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentPosition: 0,
  duration: 0,
  queue: [],
  queueIndex: 0,
  shuffle: false,
  repeat: 'off',
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setPosition: (state, action: PayloadAction<number>) => {
      state.currentPosition = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setQueue: (state, action: PayloadAction<{ songs: Song[]; startIndex?: number }>) => {
      const { songs, startIndex = 0 } = action.payload;
      state.queue = songs;
      state.queueIndex = startIndex;
      state.currentSong = songs[startIndex] || null;
    },
    addToQueue: (state, action: PayloadAction<Song>) => {
      state.queue.push(action.payload);
    },
    playNext: (state, action: PayloadAction<Song>) => {
      state.queue.splice(state.queueIndex + 1, 0, action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.queue = state.queue.filter((_, i) => i !== index);
      if (index < state.queueIndex) state.queueIndex--;
      if (index === state.queueIndex && index >= state.queue.length) {
        state.queueIndex = Math.max(0, state.queue.length - 1);
      }
      state.currentSong = state.queue[state.queueIndex] || null;
    },
    clearQueue: (state) => {
      state.queue = [];
      state.queueIndex = 0;
      state.currentSong = null;
    },
    skipToNext: (state) => {
      if (state.queue.length === 0) return;
      let nextIndex: number;
      if (state.shuffle) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else if (state.queueIndex < state.queue.length - 1) {
        nextIndex = state.queueIndex + 1;
      } else if (state.repeat === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
      state.queueIndex = nextIndex;
      state.currentSong = state.queue[nextIndex];
      state.currentPosition = 0;
    },
    skipToPrevious: (state) => {
      if (state.queue.length === 0) return;
      if (state.currentPosition > 3000) {
        state.currentPosition = 0;
        return;
      }
      const prevIndex = state.queueIndex > 0 ? state.queueIndex - 1 : state.queue.length - 1;
      state.queueIndex = prevIndex;
      state.currentSong = state.queue[prevIndex];
      state.currentPosition = 0;
    },
    skipToIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.queue.length) {
        state.queueIndex = index;
        state.currentSong = state.queue[index];
        state.currentPosition = 0;
      }
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    toggleRepeat: (state) => {
      const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
      const currentIndex = modes.indexOf(state.repeat);
      state.repeat = modes[(currentIndex + 1) % modes.length];
    },
    reorderQueue: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.queue.splice(fromIndex, 1);
      state.queue.splice(toIndex, 0, removed);

      // Update queueIndex if the current song moved
      if (state.queueIndex === fromIndex) {
        state.queueIndex = toIndex;
      } else if (fromIndex < state.queueIndex && toIndex >= state.queueIndex) {
        state.queueIndex--;
      } else if (fromIndex > state.queueIndex && toIndex <= state.queueIndex) {
        state.queueIndex++;
      }
    },
  },
});

export const {
  setCurrentSong,
  setIsPlaying,
  togglePlayPause,
  setPosition,
  setDuration,
  setQueue,
  addToQueue,
  playNext,
  removeFromQueue,
  clearQueue,
  skipToNext,
  skipToPrevious,
  skipToIndex,
  toggleShuffle,
  toggleRepeat,
  reorderQueue,
} = playerSlice.actions;

export default playerSlice.reducer;

