import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
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
import { Song, Artist } from '../../types';
import { getArtistDetails, getArtistSongs } from '../../services/api';
import { mapApiSongsToSongs, mapApiArtistToArtist } from '../../utils/mappers';

const ARTIST_IMAGE_SIZE = 150;

const ArtistDetailScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ArtistDetail'>>();
  const { setQueue, setIsPlaying } = usePlayerStore();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistSongs, setArtistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistData();
  }, [route.params.artistId]);

  const loadArtistData = async () => {
    try {
      setLoading(true);
      const [artistData, songsData] = await Promise.all([
        getArtistDetails(route.params.artistId),
        getArtistSongs(route.params.artistId),
      ]);
      if (artistData) {
        setArtist(mapApiArtistToArtist(artistData));
      }
      setArtistSongs(mapApiSongsToSongs(songsData));
    } catch (error) {
      console.error('Error loading artist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (artistSongs.length > 0) {
      setQueue(artistSongs, 0);
      setIsPlaying(true);
      navigation.navigate('Player');
    }
  };

  const handleShuffle = () => {
    if (artistSongs.length > 0) {
      const shuffled = [...artistSongs].sort(() => Math.random() - 0.5);
      setQueue(shuffled, 0);
      setIsPlaying(true);
      navigation.navigate('Player');
    }
  };

  const handleSongPress = (index: number) => {
    setQueue(artistSongs, index);
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

  if (!artist) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.navHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Artist not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Image source={{ uri: artist.image }} style={styles.artistImage} />
      <Text style={[styles.artistName, { color: colors.text }]}>{artist.name}</Text>
      <Text style={[styles.artistStats, { color: colors.textSecondary }]}>
        {artistSongs.length} Songs
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
        data={artistSongs}
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
  artistImage: { width: ARTIST_IMAGE_SIZE, height: ARTIST_IMAGE_SIZE, borderRadius: ARTIST_IMAGE_SIZE / 2 },
  artistName: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold, marginTop: Spacing.lg },
  artistStats: { fontSize: Typography.fontSizes.sm, marginTop: Spacing.sm },
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

export default ArtistDetailScreen;

