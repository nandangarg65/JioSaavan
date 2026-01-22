import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { audioService } from '../services/AudioService';
import {
  setIsPlaying,
  setPosition,
  skipToNext as storeSkipToNext,
  skipToPrevious as storeSkipToPrevious,
  skipToIndex as storeSkipToIndex,
} from '../store/usePlayerStore';

export const useAudioPlayer = () => {
  const dispatch = useAppDispatch();
  const player = useAppSelector((state) => state.player);
  const lastSongIdRef = useRef<string | null>(null);
  const wasPlayingRef = useRef(false);

  // Load and play song when currentSong changes
  useEffect(() => {
    const loadAndPlay = async () => {
      if (!player.currentSong) {
        await audioService.unload();
        lastSongIdRef.current = null;
        return;
      }

      const songUrl = player.currentSong.url;
      const songId = player.currentSong.id;

      // Only load if song actually changed
      if (songId !== lastSongIdRef.current && songUrl) {
        lastSongIdRef.current = songId;
        const loaded = await audioService.loadSong(songUrl, songId);
        
        if (loaded && player.isPlaying) {
          await audioService.play();
        }
      }
    };

    loadAndPlay();
  }, [player.currentSong?.id, player.currentSong?.url]);

  // Handle isPlaying state changes from Redux
  useEffect(() => {
    const handlePlayState = async () => {
      if (!player.currentSong?.url) return;
      
      // Make sure song is loaded
      if (audioService.getCurrentSongId() !== player.currentSong.id) {
        const loaded = await audioService.loadSong(
          player.currentSong.url,
          player.currentSong.id
        );
        if (!loaded) return;
      }

      if (player.isPlaying && !wasPlayingRef.current) {
        await audioService.play();
      } else if (!player.isPlaying && wasPlayingRef.current) {
        await audioService.pause();
      }
      
      wasPlayingRef.current = player.isPlaying;
    };

    handlePlayState();
  }, [player.isPlaying, player.currentSong?.id]);

  const togglePlayPause = useCallback(async () => {
    if (!player.currentSong?.url) return;
    
    // Make sure song is loaded first
    if (audioService.getCurrentSongId() !== player.currentSong.id) {
      const loaded = await audioService.loadSong(
        player.currentSong.url,
        player.currentSong.id
      );
      if (!loaded) return;
    }
    
    await audioService.togglePlayPause();
  }, [player.currentSong?.id, player.currentSong?.url]);

  const seekTo = useCallback(async (positionMillis: number) => {
    await audioService.seekTo(positionMillis);
    dispatch(setPosition(positionMillis));
  }, [dispatch]);

  const skipToNext = useCallback(async () => {
    dispatch(storeSkipToNext());
  }, [dispatch]);

  const skipToPrevious = useCallback(async () => {
    // If more than 3 seconds into song, restart it
    if (player.currentPosition > 3000) {
      await seekTo(0);
    } else {
      dispatch(storeSkipToPrevious());
    }
  }, [dispatch, player.currentPosition, seekTo]);

  const skipToIndex = useCallback(async (index: number) => {
    dispatch(storeSkipToIndex(index));
  }, [dispatch]);

  return {
    // State
    currentSong: player.currentSong,
    isPlaying: player.isPlaying,
    currentPosition: player.currentPosition,
    duration: player.duration,
    queue: player.queue,
    queueIndex: player.queueIndex,
    shuffle: player.shuffle,
    repeat: player.repeat,

    // Actions
    togglePlayPause,
    seekTo,
    skipToNext,
    skipToPrevious,
    skipToIndex,
  };
};

