import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Song } from '../../types';
import { usePlayerStore } from '../../hooks/usePlayer';
import { useFavorites } from '../../hooks/useFavorites';
import { RootStackParamList } from '../../navigation/types';

interface SongOptionsSheetProps {
  visible: boolean;
  song: Song | null;
  onClose: () => void;
}

interface OptionItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const SongOptionsSheet: React.FC<SongOptionsSheetProps> = ({ visible, song, onClose }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { playNext, addToQueue } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!song) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} mins`;
  };

  const isCurrentFavorite = isFavorite(song.id);

  const handleGoToAlbum = () => {
    onClose();
    if (song.albumId) {
      navigation.navigate('AlbumDetail', { albumId: song.albumId });
    }
  };

  const handleGoToArtist = () => {
    onClose();
    if (song.artistId) {
      navigation.navigate('ArtistDetail', { artistId: song.artistId });
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(song);
  };

  const options: OptionItem[] = [
    { icon: 'play-forward', label: 'Play Next', onPress: () => { playNext(song); onClose(); } },
    { icon: 'list', label: 'Add to Playing Queue', onPress: () => { addToQueue(song); onClose(); } },
    { icon: 'add-circle-outline', label: 'Add to Playlist', onPress: onClose },
    { icon: 'disc-outline', label: 'Go to Album', onPress: handleGoToAlbum },
    { icon: 'person-outline', label: 'Go to Artist', onPress: handleGoToArtist },
    { icon: 'information-circle-outline', label: 'Details', onPress: onClose },
    { icon: 'call-outline', label: 'Set as Ringtone', onPress: onClose },
    { icon: 'close-circle-outline', label: 'Add to Blacklist', onPress: onClose },
    { icon: 'share-social-outline', label: 'Share', onPress: onClose },
    { icon: 'trash-outline', label: 'Delete from Device', onPress: onClose },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, { backgroundColor: colors.card }]}>
              {/* Handle */}
              <View style={[styles.handle, { backgroundColor: colors.border }]} />

              {/* Song Info */}
              <View style={styles.songInfo}>
                <Image source={{ uri: song.artwork }} style={styles.artwork} />
                <View style={styles.songDetails}>
                  <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={[styles.songMeta, { color: colors.textSecondary }]} numberOfLines={1}>
                    {song.artist} | {formatDuration(song.duration)}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleToggleFavorite}>
                  <Ionicons
                    name={isCurrentFavorite ? "heart" : "heart-outline"}
                    size={24}
                    color={isCurrentFavorite ? colors.primary : colors.icon}
                  />
                </TouchableOpacity>
              </View>

              {/* Options */}
              <View style={styles.options}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={option.onPress}
                  >
                    <Ionicons name={option.icon} size={22} color={colors.icon} />
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
  },
  songDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  songTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
  },
  songMeta: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  options: {
    paddingTop: Spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  optionLabel: {
    fontSize: Typography.fontSizes.lg,
  },
});

export default SongOptionsSheet;

