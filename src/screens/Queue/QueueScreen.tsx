import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { usePlayerStore } from '../../hooks/usePlayer';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { Song } from '../../types';

const QueueScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { queue, queueIndex, removeFromQueue, clearQueue } = usePlayerStore();
  const { skipToIndex, currentSong } = useAudioPlayer();

  const handleSongPress = (index: number) => {
    skipToIndex(index);
  };

  const handleRemoveSong = (index: number) => {
    removeFromQueue(index);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Now Playing</Text>
      {currentSong && (
        <View style={[styles.nowPlayingCard, { backgroundColor: colors.surface }]}>
          <Image source={{ uri: currentSong.artwork }} style={styles.nowPlayingArtwork} />
          <View style={styles.nowPlayingInfo}>
            <Text style={[styles.nowPlayingTitle, { color: colors.text }]} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text style={[styles.nowPlayingArtist, { color: colors.textSecondary }]} numberOfLines={1}>
              {currentSong.artist}
            </Text>
          </View>
        </View>
      )}
      
      <View style={styles.upNextHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Up Next</Text>
        <Text style={[styles.queueCount, { color: colors.textSecondary }]}>
          {queue.length - queueIndex - 1} songs
        </Text>
      </View>
    </View>
  );

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
    const isCurrentSong = index === queueIndex;
    
    return (
      <TouchableOpacity
        style={[
          styles.songItem,
          isCurrentSong && { backgroundColor: colors.primary + '20' },
        ]}
        onPress={() => handleSongPress(index)}
      >
        <View style={styles.songIndex}>
          {isCurrentSong ? (
            <Ionicons name="musical-note" size={16} color={colors.primary} />
          ) : (
            <Text style={[styles.indexText, { color: colors.textSecondary }]}>{index + 1}</Text>
          )}
        </View>
        <Image source={{ uri: item.artwork }} style={styles.artwork} />
        <View style={styles.songInfo}>
          <Text 
            style={[styles.songTitle, { color: isCurrentSong ? colors.primary : colors.text }]} 
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.artist} • {formatDuration(item.duration)}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveSong(index)}
        >
          <Ionicons name="close" size={20} color={colors.icon} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Queue is Empty</Text>
      <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
        Add songs to your queue to see them here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Queue</Text>
        <TouchableOpacity onPress={clearQueue} style={styles.clearButton}>
          <Text style={[styles.clearText, { color: colors.primary }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={queue}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListHeaderComponent={renderHeader}
        renderItem={renderSongItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={queue.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: { padding: Spacing.sm },
  headerTitle: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.fontWeights.semibold },
  clearButton: { padding: Spacing.sm },
  clearText: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.medium },
  headerContent: { paddingHorizontal: Spacing.lg },
  sectionTitle: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.semibold, marginBottom: Spacing.md },
  nowPlayingCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.lg },
  nowPlayingArtwork: { width: 60, height: 60, borderRadius: BorderRadius.md },
  nowPlayingInfo: { flex: 1, marginLeft: Spacing.md },
  nowPlayingTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.medium },
  nowPlayingArtist: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
  upNextHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.md },
  queueCount: { fontSize: Typography.fontSizes.sm },
  list: { paddingBottom: 100 },
  emptyList: { flex: 1 },
  songItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  songIndex: { width: 24, alignItems: 'center', marginRight: Spacing.sm },
  indexText: { fontSize: Typography.fontSizes.sm },
  artwork: { width: 50, height: 50, borderRadius: BorderRadius.md },
  songInfo: { flex: 1, marginLeft: Spacing.md },
  songTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.medium },
  songArtist: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
  removeButton: { padding: Spacing.sm },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xxl },
  emptyTitle: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.fontWeights.semibold, marginTop: Spacing.lg },
  emptyDesc: { fontSize: Typography.fontSizes.md, marginTop: Spacing.sm, textAlign: 'center' },
});

export default QueueScreen;

