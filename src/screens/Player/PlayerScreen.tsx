import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { usePlayerStore } from '../../hooks/usePlayer';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useFavorites } from '../../hooks/useFavorites';
import { RootStackParamList } from '../../navigation/types';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = width - Spacing.xxl * 2;

const PlayerScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Use audio player for actual playback controls
  const {
    currentSong,
    isPlaying,
    currentPosition,
    duration,
    shuffle,
    repeat,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    seekTo,
  } = useAudioPlayer();

  // Use player store for shuffle/repeat toggle
  const { toggleShuffle, toggleRepeat } = usePlayerStore();

  // Favorites
  const { isFavorite, toggleFavorite } = useFavorites();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Use duration from audio service if available, otherwise use song duration
  const songDuration = duration > 0 ? duration : (currentSong ? currentSong.duration * 1000 : 0);
  const isCurrentFavorite = currentSong ? isFavorite(currentSong.id) : false;

  if (!currentSong) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="chevron-down" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.noSongContainer}>
          <Ionicons name="musical-notes" size={80} color={colors.textTertiary} />
          <Text style={[styles.noSongText, { color: colors.text }]}>No song playing</Text>
          <Text style={[styles.noSongSubtext, { color: colors.textSecondary }]}>
            Select a song to start playing
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="chevron-down" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Now Playing</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <Image source={{ uri: currentSong.artwork }} style={styles.artwork} />
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {currentSong.title}
        </Text>
        <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={songDuration}
          value={currentPosition}
          onSlidingComplete={seekTo}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatTime(currentPosition)}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {formatTime(songDuration)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle} style={styles.secondaryControl}>
          <Ionicons
            name="shuffle"
            size={24}
            color={shuffle ? colors.primary : colors.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipToPrevious} style={styles.primaryControl}>
          <Ionicons name="play-skip-back" size={32} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlayPause}
          style={[styles.playButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={36}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipToNext} style={styles.primaryControl}>
          <Ionicons name="play-skip-forward" size={32} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleRepeat} style={styles.secondaryControl}>
          <Ionicons
            name={repeat === 'one' ? 'repeat' : 'repeat'}
            size={24}
            color={repeat !== 'off' ? colors.primary : colors.icon}
          />
          {repeat === 'one' && (
            <Text style={[styles.repeatOne, { color: colors.primary }]}>1</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => currentSong && toggleFavorite(currentSong)}
        >
          <Ionicons
            name={isCurrentFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isCurrentFavorite ? colors.primary : colors.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="chatbubble-outline" size={24} color={colors.icon} />
          <Text style={[styles.bottomButtonText, { color: colors.textSecondary }]}>Lyrics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigation.navigate('Queue')}
        >
          <Ionicons name="list" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  headerButton: { padding: Spacing.sm },
  headerTitle: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.medium },
  noSongContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xxl },
  noSongText: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.fontWeights.semibold, marginTop: Spacing.lg },
  noSongSubtext: { fontSize: Typography.fontSizes.md, marginTop: Spacing.sm, textAlign: 'center' },
  artworkContainer: { alignItems: 'center', marginTop: Spacing.xl },
  artwork: { width: ARTWORK_SIZE, height: ARTWORK_SIZE, borderRadius: BorderRadius.xl },
  songInfo: { alignItems: 'center', marginTop: Spacing.xxl, paddingHorizontal: Spacing.xxl },
  title: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold, textAlign: 'center' },
  artist: { fontSize: Typography.fontSizes.lg, marginTop: Spacing.sm },
  progressContainer: { marginTop: Spacing.xxl, paddingHorizontal: Spacing.lg },
  slider: { width: '100%', height: 40 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -Spacing.sm },
  time: { fontSize: Typography.fontSizes.sm },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl, gap: Spacing.xl },
  secondaryControl: { padding: Spacing.md },
  primaryControl: { padding: Spacing.md },
  playButton: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  repeatOne: { position: 'absolute', fontSize: 10, fontWeight: Typography.fontWeights.bold, top: 8, right: 8 },
  bottomActions: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.xxxl, marginTop: 'auto', marginBottom: Spacing.xxl },
  bottomButton: { alignItems: 'center', gap: Spacing.xs },
  bottomButtonText: { fontSize: Typography.fontSizes.xs },
});

export default PlayerScreen;

