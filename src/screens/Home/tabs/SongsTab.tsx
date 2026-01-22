import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { Song, SortOrder } from '../../../types';
import { RootStackParamList } from '../../../navigation/types';
import { usePlayerStore } from '../../../hooks/usePlayer';
import SongOptionsSheet from '../../../components/common/SongOptionsSheet';
import { searchSongs } from '../../../services/api';
import { mapApiSongsToSongs } from '../../../utils/mappers';

const SongsTab = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setQueue, setIsPlaying } = usePlayerStore();
  const [sortOrder, setSortOrder] = useState<SortOrder>('ascending');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      const results = await searchSongs('bollywood hits', 1, 30);
      setSongs(mapApiSongsToSongs(results));
      setPage(1);
      setHasMore(results.length >= 30);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreSongs = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const results = await searchSongs('bollywood hits', nextPage, 30);
      const newSongs = mapApiSongsToSongs(results);

      if (newSongs.length > 0) {
        setSongs(prev => [...prev, ...newSongs]);
        setPage(nextPage);
        setHasMore(newSongs.length >= 30);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more songs:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const sortedSongs = [...songs].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return sortOrder === 'ascending' ? comparison : -comparison;
  });

  const handleSongPress = (index: number) => {
    setQueue(sortedSongs, index);
    setIsPlaying(true);
    navigation.navigate('Player');
  };

  const handleOptionsPress = (song: Song) => {
    setSelectedSong(song);
    setShowOptions(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => handleSongPress(index)}
    >
      <Image source={{ uri: item.artwork }} style={styles.artwork} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.artist} • {formatDuration(item.duration)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => handleSongPress(index)}
      >
        <Ionicons name="play-circle" size={32} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => handleOptionsPress(item)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color={colors.icon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.songCount, { color: colors.text }]}>
          {songs.length} songs
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending')}
        >
          <Text style={[styles.sortText, { color: colors.primary }]}>
            {sortOrder === 'ascending' ? 'Ascending' : 'Descending'}
          </Text>
          <Ionicons
            name={sortOrder === 'ascending' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Songs List */}
      <FlatList
        data={sortedSongs}
        keyExtractor={(item) => item.id}
        renderItem={renderSongItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreSongs}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />

      {/* Options Sheet */}
      <SongOptionsSheet
        visible={showOptions}
        song={selectedSong}
        onClose={() => setShowOptions(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  songCount: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sortText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  listContent: {
    paddingBottom: 100,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
  },
  songInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  songTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  songArtist: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  playButton: {
    padding: Spacing.xs,
  },
  moreButton: {
    padding: Spacing.sm,
  },
  loadingMore: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
});

export default SongsTab;

