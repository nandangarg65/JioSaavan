import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { RootStackParamList } from '../../../navigation/types';
import { usePlayerStore } from '../../../hooks/usePlayer';
import { searchSongs, searchArtists, searchAlbums } from '../../../services/api';
import { mapApiSongsToSongs, mapApiArtistsToArtists, mapApiAlbumsToAlbums } from '../../../utils/mappers';
import { Song, Artist, Album } from '../../../types';

const SuggestedTab = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setQueue, setIsPlaying } = usePlayerStore();

  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [newAlbums, setNewAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [songsRes, artistsRes, albumsRes] = await Promise.all([
        searchSongs('trending hindi', 1, 10),
        searchArtists('bollywood', 1, 10),
        searchAlbums('latest', 1, 10),
      ]);
      setTrendingSongs(mapApiSongsToSongs(songsRes));
      setArtists(mapApiArtistsToArtists(artistsRes));
      setNewAlbums(mapApiAlbumsToAlbums(albumsRes));
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongPress = (songs: Song[], index: number) => {
    setQueue(songs, index);
    setIsPlaying(true);
    navigation.navigate('Player');
  };

  const handleArtistPress = (artistId: string) => {
    navigation.navigate('ArtistDetail', { artistId });
  };

  const handleAlbumPress = (albumId: string) => {
    navigation.navigate('AlbumDetail', { albumId });
  };

  const renderSectionHeader = (title: string, onSeeAll?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Trending Songs */}
      {renderSectionHeader('Trending Now', () => {})}
      <FlatList
        horizontal
        data={trendingSongs.slice(0, 6)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.recentItem}
            onPress={() => handleSongPress(trendingSongs, index)}
          >
            <Image source={{ uri: item.artwork }} style={styles.recentImage} />
            <Text
              style={[styles.recentTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.recentArtist, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.artist}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Artists */}
      {renderSectionHeader('Popular Artists', () => {})}
      <FlatList
        horizontal
        data={artists}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.artistItem}
            onPress={() => handleArtistPress(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.artistImage} />
            <Text
              style={[styles.artistName, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* New Albums */}
      {renderSectionHeader('New Releases', () => {})}
      <FlatList
        horizontal
        data={newAlbums}
        keyExtractor={(item) => `album-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalList, styles.lastSection]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recentItem}
            onPress={() => handleAlbumPress(item.id)}
          >
            <Image source={{ uri: item.artwork }} style={styles.recentImage} />
            <Text
              style={[styles.recentTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.recentArtist, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.artist}
            </Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
  },
  seeAll: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  recentItem: {
    width: 140,
  },
  recentImage: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  recentTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  recentArtist: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  artistItem: {
    alignItems: 'center',
    width: 100,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.sm,
  },
  artistName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    textAlign: 'center',
  },
  lastSection: {
    paddingBottom: 100,
  },
});

export default SuggestedTab;

