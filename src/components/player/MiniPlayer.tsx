import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { RootStackParamList } from '../../navigation/types';

const MiniPlayer = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentSong, isPlaying, currentPosition, duration, togglePlayPause, skipToNext } = useAudioPlayer();

  if (!currentSong) return null;

  // Calculate progress percentage
  const songDuration = duration > 0 ? duration : (currentSong.duration * 1000);
  const progressPercent = songDuration > 0 ? (currentPosition / songDuration) * 100 : 0;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}
      onPress={() => navigation.navigate('Player')}
      activeOpacity={0.9}
    >
      {/* Progress Bar */}
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View style={[styles.progress, { backgroundColor: colors.primary, width: `${progressPercent}%` }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image source={{ uri: currentSong.artwork }} style={styles.artwork} />
        
        <View style={styles.songInfo}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color={colors.text}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              skipToNext();
            }}
          >
            <Ionicons name="play-skip-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  progressBar: {
    height: 2,
    width: '100%',
  },
  progress: {
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
  },
  songInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  artist: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  controlButton: {
    padding: Spacing.sm,
  },
});

export default MiniPlayer;

