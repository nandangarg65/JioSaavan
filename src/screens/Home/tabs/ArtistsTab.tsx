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
import { Typography, Spacing } from '../../../constants/theme';
import { Artist, SortOrder } from '../../../types';
import { RootStackParamList } from '../../../navigation/types';
import { searchArtists } from '../../../services/api';
import { mapApiArtistsToArtists } from '../../../utils/mappers';

const ArtistsTab = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [sortOrder, setSortOrder] = useState<SortOrder>('ascending');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);
      const results = await searchArtists('bollywood', 1, 20);
      setArtists(mapApiArtistsToArtists(results));
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedArtists = [...artists].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === 'ascending' ? comparison : -comparison;
  });

  const handleArtistPress = (artistId: string) => {
    navigation.navigate('ArtistDetail', { artistId });
  };

  const renderArtistItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistItem}
      onPress={() => handleArtistPress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.artistImage} />
      <View style={styles.artistInfo}>
        <Text style={[styles.artistName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.artistMeta, { color: colors.textSecondary }]}>
          {item.albumCount} Albums • {item.songCount} Songs
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
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
        <Text style={[styles.artistCount, { color: colors.text }]}>
          {artists.length} artists
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending')}
        >
          <Text style={[styles.sortText, { color: colors.primary }]}>
            Date Added
          </Text>
          <Ionicons
            name={sortOrder === 'ascending' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Artists List */}
      <FlatList
        data={sortedArtists}
        keyExtractor={(item) => item.id}
        renderItem={renderArtistItem}
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
  artistCount: {
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
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  artistImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  artistInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  artistName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.medium,
  },
  artistMeta: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  moreButton: {
    padding: Spacing.sm,
  },
});

export default ArtistsTab;

