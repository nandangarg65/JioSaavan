import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  createPlaylist,
  deletePlaylist,
  renamePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
  clearPlaylist,
} from '../store/usePlaylistsStore';
import { Song, Playlist } from '../types';

export const usePlaylists = () => {
  const dispatch = useDispatch();
  const playlists = useSelector((state: RootState) => state.playlists.playlists);

  return {
    playlists,
    createPlaylist: (name: string, description?: string) => 
      dispatch(createPlaylist({ name, description })),
    deletePlaylist: (id: string) => dispatch(deletePlaylist(id)),
    renamePlaylist: (id: string, name: string) => 
      dispatch(renamePlaylist({ id, name })),
    addSongToPlaylist: (playlistId: string, song: Song) => 
      dispatch(addSongToPlaylist({ playlistId, song })),
    removeSongFromPlaylist: (playlistId: string, songId: string) => 
      dispatch(removeSongFromPlaylist({ playlistId, songId })),
    reorderPlaylistSongs: (playlistId: string, fromIndex: number, toIndex: number) =>
      dispatch(reorderPlaylistSongs({ playlistId, fromIndex, toIndex })),
    clearPlaylist: (id: string) => dispatch(clearPlaylist(id)),
    getPlaylistById: (id: string): Playlist | undefined => 
      playlists.find(p => p.id === id),
  };
};

