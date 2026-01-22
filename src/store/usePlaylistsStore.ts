import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, Playlist } from '../types';

interface PlaylistsState {
  playlists: Playlist[];
}

const initialState: PlaylistsState = {
  playlists: [],
};

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    createPlaylist: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      const now = new Date().toISOString();
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description,
        songs: [],
        createdAt: now,
        updatedAt: now,
      };
      state.playlists.push(newPlaylist);
    },
    deletePlaylist: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter(p => p.id !== action.payload);
    },
    renamePlaylist: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.id);
      if (playlist) {
        playlist.name = action.payload.name;
        playlist.updatedAt = new Date().toISOString();
      }
    },
    addSongToPlaylist: (state, action: PayloadAction<{ playlistId: string; song: Song }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist) {
        // Avoid duplicates
        if (!playlist.songs.find(s => s.id === action.payload.song.id)) {
          playlist.songs.push(action.payload.song);
          playlist.updatedAt = new Date().toISOString();
        }
      }
    },
    removeSongFromPlaylist: (state, action: PayloadAction<{ playlistId: string; songId: string }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist) {
        playlist.songs = playlist.songs.filter(s => s.id !== action.payload.songId);
        playlist.updatedAt = new Date().toISOString();
      }
    },
    reorderPlaylistSongs: (state, action: PayloadAction<{ playlistId: string; fromIndex: number; toIndex: number }>) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist) {
        const { fromIndex, toIndex } = action.payload;
        const [removed] = playlist.songs.splice(fromIndex, 1);
        playlist.songs.splice(toIndex, 0, removed);
        playlist.updatedAt = new Date().toISOString();
      }
    },
    clearPlaylist: (state, action: PayloadAction<string>) => {
      const playlist = state.playlists.find(p => p.id === action.payload);
      if (playlist) {
        playlist.songs = [];
        playlist.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  createPlaylist,
  deletePlaylist,
  renamePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
  clearPlaylist,
} = playlistsSlice.actions;

export default playlistsSlice.reducer;

