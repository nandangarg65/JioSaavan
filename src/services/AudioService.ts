import { Audio, AVPlaybackStatus } from 'expo-av';
import { store } from '../store';
import { 
  setIsPlaying, 
  setPosition, 
  setDuration, 
  skipToNext 
} from '../store/usePlayerStore';

class AudioService {
  private sound: Audio.Sound | null = null;
  private isInitialized = false;
  private currentSongId: string | null = null;
  private positionUpdateInterval: NodeJS.Timeout | null = null;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
      console.log('AudioService initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  private onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error('Playback error:', status.error);
      }
      return;
    }

    // Update position
    if (status.positionMillis !== undefined) {
      store.dispatch(setPosition(status.positionMillis));
    }

    // Update duration
    if (status.durationMillis !== undefined) {
      store.dispatch(setDuration(status.durationMillis));
    }

    // Handle playback completion
    if (status.didJustFinish && !status.isLooping) {
      this.handleSongEnd();
    }
  };

  private handleSongEnd() {
    const state = store.getState().player;
    
    if (state.repeat === 'one') {
      // Repeat the current song
      this.seekTo(0);
      this.play();
    } else if (state.queueIndex < state.queue.length - 1 || state.repeat === 'all') {
      // Play next song
      store.dispatch(skipToNext());
    } else {
      // End of queue
      store.dispatch(setIsPlaying(false));
    }
  }

  async loadSong(url: string, songId: string): Promise<boolean> {
    try {
      await this.initialize();

      // If same song is already loaded, don't reload
      if (this.currentSongId === songId && this.sound) {
        return true;
      }

      // Unload previous sound
      await this.unload();

      // Create new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: false, progressUpdateIntervalMillis: 500 },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.currentSongId = songId;
      
      console.log('Song loaded:', songId);
      return true;
    } catch (error) {
      console.error('Failed to load song:', error);
      return false;
    }
  }

  async play(): Promise<void> {
    if (!this.sound) return;
    try {
      await this.sound.playAsync();
      store.dispatch(setIsPlaying(true));
    } catch (error) {
      console.error('Failed to play:', error);
    }
  }

  async pause(): Promise<void> {
    if (!this.sound) return;
    try {
      await this.sound.pauseAsync();
      store.dispatch(setIsPlaying(false));
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  }

  async togglePlayPause(): Promise<void> {
    const state = store.getState().player;
    if (state.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  async seekTo(positionMillis: number): Promise<void> {
    if (!this.sound) return;
    try {
      await this.sound.setPositionAsync(positionMillis);
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  }

  async unload(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
      } catch (error) {
        console.error('Failed to unload:', error);
      }
      this.sound = null;
      this.currentSongId = null;
    }
  }

  getCurrentSongId(): string | null {
    return this.currentSongId;
  }
}

export const audioService = new AudioService();

