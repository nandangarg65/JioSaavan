import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';
import { Song, Artist, Album, SearchFilterType } from '../../types';
import { usePlayerStore } from '../../hooks/usePlayer';
import { searchSongs, searchArtists, searchAlbums } from '../../services/api';
import { mapApiSongsToSongs, mapApiArtistsToArtists, mapApiAlbumsToAlbums } from '../../utils/mappers';
import { RootState } from '../../store';
import { addRecentSearch, removeRecentSearch, clearRecentSearches } from '../../store/useSearchStore';

const filters: SearchFilterType[] = ['Songs', 'Artists', 'Albums'];

const SearchScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const { setQueue, setIsPlaying } = usePlayerStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>('Songs');
  const recentSearches = useSelector((state: RootState) => state.search.recentSearches);
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    if (query.length === 0) {
      setSongs([]);
      setArtists([]);
      setAlbums([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, activeFilter]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      // Add to recent searches
      dispatch(addRecentSearch(searchQuery));

      if (activeFilter === 'Songs') {
        const results = await searchSongs(searchQuery, 1, 20);
        setSongs(mapApiSongsToSongs(results));
      } else if (activeFilter === 'Artists') {
        const results = await searchArtists(searchQuery, 1, 20);
        setArtists(mapApiArtistsToArtists(results));
      } else if (activeFilter === 'Albums') {
        const results = await searchAlbums(searchQuery, 1, 20);
        setAlbums(mapApiAlbumsToAlbums(results));
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongPress = (song: Song, index: number) => {
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

  const handleClearAll = () => dispatch(clearRecentSearches());
  const handleRemoveSearch = (item: string) => dispatch(removeRecentSearch(item));
  const handleAddRecentSearch = (searchQuery: string) => dispatch(addRecentSearch(searchQuery));

  const hasResults = () => {
    if (activeFilter === 'Songs') return songs.length > 0;
    if (activeFilter === 'Artists') return artists.length > 0;
    if (activeFilter === 'Albums') return albums.length > 0;
    return false;
  };

  const renderRecentSearches = () => (
    <View style={styles.recentContainer}>
      <View style={styles.recentHeader}>
        <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Searches</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={[styles.clearAll, { color: colors.primary }]}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {recentSearches.length === 0 ? (
        <Text style={[styles.recentText, { color: colors.textSecondary }]}>No recent searches</Text>
      ) : (
        recentSearches.map((item, index) => (
          <View key={index} style={styles.recentItem}>
            <Text style={[styles.recentText, { color: colors.text }]}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemoveSearch(item)}>
              <Ionicons name="close" size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );

  const renderNotFound = () => (
    <View style={styles.notFoundContainer}>
      <Ionicons name="search-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.notFoundTitle, { color: colors.text }]}>Not Found</Text>
      <Text style={[styles.notFoundDesc, { color: colors.textSecondary }]}>
        Sorry, the keyword you entered cannot be found. Please check again or search with another keyword.
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderSongResults = () => (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.resultsList}
      renderItem={({ item, index }) => (
        <TouchableOpacity style={styles.resultItem} onPress={() => handleSongPress(item, index)}>
          <Image source={{ uri: item.artwork }} style={styles.resultArtwork} />
          <View style={styles.resultInfo}>
            <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>{item.artist}</Text>
          </View>
          <TouchableOpacity onPress={() => handleSongPress(item, index)}><Ionicons name="play-circle" size={32} color={colors.primary} /></TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );

  const renderArtistResults = () => (
    <FlatList
      data={artists}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.resultsList}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.resultItem} onPress={() => handleArtistPress(item.id)}>
          <Image source={{ uri: item.image }} style={[styles.resultArtwork, styles.artistArtwork]} />
          <View style={styles.resultInfo}>
            <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.resultArtist, { color: colors.textSecondary }]}>Artist</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>
      )}
    />
  );

  const renderAlbumResults = () => (
    <FlatList
      data={albums}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.resultsList}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.resultItem} onPress={() => handleAlbumPress(item.id)}>
          <Image source={{ uri: item.artwork }} style={styles.resultArtwork} />
          <View style={styles.resultInfo}>
            <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>{item.artist}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>
      )}
    />
  );

  const renderResults = () => {
    if (activeFilter === 'Songs') return renderSongResults();
    if (activeFilter === 'Artists') return renderArtistResults();
    if (activeFilter === 'Albums') return renderAlbumResults();
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.searchInput, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.icon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Search..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close" size={20} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      {query.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filters}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && { backgroundColor: colors.primary }]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, { color: activeFilter === filter ? colors.white : colors.text }]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Content */}
      {query.length === 0
        ? renderRecentSearches()
        : loading
          ? renderLoading()
          : !hasResults()
            ? renderNotFound()
            : renderResults()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, height: 44, gap: Spacing.sm },
  input: { flex: 1, fontSize: Typography.fontSizes.md },
  filtersScroll: { maxHeight: 50 },
  filters: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'transparent' },
  filterText: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.medium },
  recentContainer: { padding: Spacing.lg },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  recentTitle: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.semibold },
  clearAll: { fontSize: Typography.fontSizes.md },
  recentItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md },
  recentText: { fontSize: Typography.fontSizes.md },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl },
  notFoundTitle: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold, marginBottom: Spacing.md, marginTop: Spacing.lg },
  notFoundDesc: { fontSize: Typography.fontSizes.md, textAlign: 'center', lineHeight: 22 },
  resultsList: { padding: Spacing.lg },
  resultItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  resultArtwork: { width: 50, height: 50, borderRadius: BorderRadius.md },
  artistArtwork: { borderRadius: 25 },
  resultInfo: { flex: 1, marginLeft: Spacing.md },
  resultTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.medium },
  resultArtist: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
});

export default SearchScreen;

