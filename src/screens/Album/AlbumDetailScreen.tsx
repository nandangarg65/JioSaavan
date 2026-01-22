import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';
import { usePlayerStore } from '../../hooks/usePlayer';
import { Song, Album } from '../../types';
import { getAlbumDetails } from '../../services/api';
import { mapApiSongsToSongs, mapApiAlbumToAlbum } from '../../utils/mappers';

const { width } = Dimensions.get('window');
const ALBUM_IMAGE_SIZE = width * 0.5;

const AlbumDetailScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AlbumDetail'>>();
  const { setQueue, setIsPlaying } = usePlayerStore();

  const [album, setAlbum] = useState<Album | null>(null);
  const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlbumData();
  }, [route.params.albumId]);

  const loadAlbumData = async () => {
    try {
      setLoading(true);
      const albumData = await getAlbumDetails(route.params.albumId);
      if (albumData) {
        setAlbum(mapApiAlbumToAlbum(albumData));
        if (albumData.songs) {
          setAlbumSongs(mapApiSongsToSongs(albumData.songs));
        }
      }
    } catch (error) {
      console.error('Error loading album:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDuration = albumSongs.reduce((acc, song) => acc + song.duration, 0);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  const handlePlayAll = () => {
    if (albumSongs.length > 0) {
      setQueue(albumSongs, 0);
      setIsPlaying(true);
      navigation.navigate('Player');
    }
  };

  const handleShuffle = () => {
    if (albumSongs.length > 0) {
      const shuffled = [...albumSongs].sort(() => Math.random() - 0.5);
      setQueue(shuffled, 0);
      setIsPlaying(true);
      navigation.navigate('Player');
    }
  };

  const handleSongPress = (index: number) => {
    setQueue(albumSongs, index);
    setIsPlaying(true);
    navigation.navigate('Player');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!album) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.navHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Album not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Image source={{ uri: album.artwork }} style={styles.albumImage} />
      <Text style={[styles.albumTitle, { color: colors.text }]}>{album.title}</Text>
      <Text style={[styles.albumArtist, { color: colors.textSecondary }]}>
        {album.artist} • {album.year}
      </Text>
      <Text style={[styles.albumStats, { color: colors.textTertiary }]}>
        {albumSongs.length} Songs • {formatDuration(totalDuration)}
      </Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.shuffleButton, { backgroundColor: colors.primary }]} onPress={handleShuffle}>
          <Ionicons name="shuffle" size={20} color={colors.white} />
          <Text style={[styles.buttonText, { color: colors.white }]}>Shuffle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.playButton, { borderColor: colors.primary }]} onPress={handlePlayAll}>
          <Ionicons name="play" size={20} color={colors.primary} />
          <Text style={[styles.buttonText, { color: colors.primary }]}>Play</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.songsHeader}>
        <Text style={[styles.songsTitle, { color: colors.text }]}>Songs</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(index)}>
      <Image source={{ uri: item.artwork }} style={styles.songArtwork} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>{item.artist}</Text>
      </View>
      <TouchableOpacity><Ionicons name="play-circle" size={32} color={colors.primary} /></TouchableOpacity>
      <TouchableOpacity style={styles.moreBtn}><Ionicons name="ellipsis-vertical" size={20} color={colors.icon} /></TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Nav Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <View style={styles.navRight}>
          <TouchableOpacity><Ionicons name="search" size={24} color={colors.text} /></TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: Spacing.lg }}><Ionicons name="heart-outline" size={24} color={colors.text} /></TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={albumSongs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderSongItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  navRight: { flexDirection: 'row' },
  headerContent: { alignItems: 'center', paddingHorizontal: Spacing.lg },
  albumImage: { width: ALBUM_IMAGE_SIZE, height: ALBUM_IMAGE_SIZE, borderRadius: BorderRadius.xl },
  albumTitle: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold, marginTop: Spacing.lg, textAlign: 'center' },
  albumArtist: { fontSize: Typography.fontSizes.md, marginTop: Spacing.xs },
  albumStats: { fontSize: Typography.fontSizes.sm, marginTop: Spacing.xs },
  actionButtons: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  shuffleButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.full, gap: Spacing.sm },
  playButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.full, borderWidth: 1, gap: Spacing.sm },
  buttonText: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.medium },
  songsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: Spacing.xxl, marginBottom: Spacing.md },
  songsTitle: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.semibold },
  seeAll: { fontSize: Typography.fontSizes.md },
  listContent: { paddingBottom: 100 },
  songItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  songArtwork: { width: 50, height: 50, borderRadius: BorderRadius.md },
  songInfo: { flex: 1, marginLeft: Spacing.md },
  songTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.medium },
  songArtist: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
  moreBtn: { padding: Spacing.sm },
});

export default AlbumDetailScreen;

