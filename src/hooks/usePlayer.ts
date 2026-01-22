import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
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
} from '../store/usePlayerStore';
import { Song } from '../types';

export const usePlayerStore = () => {
  const dispatch = useAppDispatch();
  const player = useAppSelector((state) => state.player);

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
    setCurrentSong: (song: Song) => dispatch(setCurrentSong(song)),
    setIsPlaying: (playing: boolean) => dispatch(setIsPlaying(playing)),
    togglePlayPause: () => dispatch(togglePlayPause()),
    setPosition: (position: number) => dispatch(setPosition(position)),
    setDuration: (duration: number) => dispatch(setDuration(duration)),
    setQueue: (songs: Song[], startIndex?: number) => dispatch(setQueue({ songs, startIndex })),
    addToQueue: (song: Song) => dispatch(addToQueue(song)),
    playNext: (song: Song) => dispatch(playNext(song)),
    removeFromQueue: (index: number) => dispatch(removeFromQueue(index)),
    clearQueue: () => dispatch(clearQueue()),
    skipToNext: () => dispatch(skipToNext()),
    skipToPrevious: () => dispatch(skipToPrevious()),
    skipToIndex: (index: number) => dispatch(skipToIndex(index)),
    toggleShuffle: () => dispatch(toggleShuffle()),
    toggleRepeat: () => dispatch(toggleRepeat()),
    reorderQueue: (fromIndex: number, toIndex: number) => dispatch(reorderQueue({ fromIndex, toIndex })),
  };
};

