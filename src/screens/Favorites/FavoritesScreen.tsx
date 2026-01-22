import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Song } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { usePlayerStore } from '../../hooks/usePlayer';
import { useFavorites } from '../../hooks/useFavorites';

const FavoritesScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setQueue, setIsPlaying } = usePlayerStore();
  const { favorites, removeFromFavorites } = useFavorites();

  // Use real favorites from the store
  const favoriteSongs = favorites;

  const handleSongPress = (index: number) => {
    setQueue(favoriteSongs, index);
    setIsPlaying(true);
    navigation.navigate('Player');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {favoriteSongs.length} songs
      </Text>
    </View>
  );

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
      <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
        <Ionicons name="heart" size={24} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => handleSongPress(index)}
      >
        <Ionicons name="play-circle" size={32} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
      <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
        Songs you like will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favoriteSongs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderSongItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={favoriteSongs.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
  },
  subtitle: {
    fontSize: Typography.fontSizes.md,
    marginTop: Spacing.xs,
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
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
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.semibold,
    marginTop: Spacing.lg,
  },
  emptyDesc: {
    fontSize: Typography.fontSizes.md,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});

export default FavoritesScreen;

