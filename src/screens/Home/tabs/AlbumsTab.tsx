import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { Album, SortOrder } from '../../../types';
import { RootStackParamList } from '../../../navigation/types';
import { searchAlbums } from '../../../services/api';
import { mapApiAlbumsToAlbums } from '../../../utils/mappers';

const { width } = Dimensions.get('window');
const ALBUM_SIZE = (width - Spacing.lg * 3) / 2;

const AlbumsTab = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [sortOrder, setSortOrder] = useState<SortOrder>('ascending');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const results = await searchAlbums('hindi', 1, 20);
      setAlbums(mapApiAlbumsToAlbums(results));
    } catch (error) {
      console.error('Error loading albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedAlbums = [...albums].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return sortOrder === 'ascending' ? comparison : -comparison;
  });

  const handleAlbumPress = (albumId: string) => {
    navigation.navigate('AlbumDetail', { albumId });
  };

  const renderAlbumItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => handleAlbumPress(item.id)}
    >
      <Image source={{ uri: item.artwork }} style={styles.albumImage} />
      <Text style={[styles.albumTitle, { color: colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.albumArtist, { color: colors.textSecondary }]} numberOfLines={1}>
        {item.artist} • {item.year}
      </Text>
      <Text style={[styles.albumSongs, { color: colors.textTertiary }]}>
        {item.songCount} songs
      </Text>
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
        <Text style={[styles.albumCount, { color: colors.text }]}>
          {albums.length} albums
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending')}
        >
          <Text style={[styles.sortText, { color: colors.primary }]}>
            Date Modified
          </Text>
          <Ionicons
            name={sortOrder === 'ascending' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Albums Grid */}
      <FlatList
        data={sortedAlbums}
        keyExtractor={(item) => item.id}
        renderItem={renderAlbumItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  albumCount: {
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  albumItem: {
    width: ALBUM_SIZE,
  },
  albumImage: {
    width: ALBUM_SIZE,
    height: ALBUM_SIZE,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  albumTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
  },
  albumArtist: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  albumSongs: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
});

export default AlbumsTab;

