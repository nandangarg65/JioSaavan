import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
} from '../store/useFavoritesStore';
import { Song } from '../types';

export const useFavorites = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.songs);

  const isFavorite = useCallback(
    (songId: string) => favorites.some((s) => s.id === songId),
    [favorites]
  );

  return {
    favorites,
    isFavorite,
    addToFavorites: (song: Song) => dispatch(addToFavorites(song)),
    removeFromFavorites: (songId: string) => dispatch(removeFromFavorites(songId)),
    toggleFavorite: (song: Song) => dispatch(toggleFavorite(song)),
    clearFavorites: () => dispatch(clearFavorites()),
  };
};

