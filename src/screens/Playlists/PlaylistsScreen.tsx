import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { usePlaylists } from '../../hooks/usePlaylists';
import { Playlist } from '../../types';

const PlaylistsScreen = () => {
  const { colors } = useTheme();
  const { playlists, createPlaylist, deletePlaylist } = usePlaylists();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), newPlaylistDesc.trim() || undefined);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateModal(false);
    }
  };

  const handleDeletePlaylist = (id: string, name: string) => {
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePlaylist(id) },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>Playlists</Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add" size={24} color={colors.white} />
        <Text style={[styles.addButtonText, { color: colors.white }]}>New Playlist</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity style={[styles.playlistItem, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="musical-notes" size={24} color={colors.primary} />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.playlistSongs, { color: colors.textSecondary }]}>
          {item.songs.length} songs
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeletePlaylist(item.id, item.name)}>
        <Ionicons name="trash-outline" size={20} color={colors.icon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Playlists Yet</Text>
      <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
        Create your first playlist to organize your music
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderPlaylistItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={playlists.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Playlist Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Playlist</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
              placeholder="Playlist name"
              placeholderTextColor={colors.textSecondary}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newPlaylistDesc}
              onChangeText={setNewPlaylistDesc}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.surface }]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleCreatePlaylist}
              >
                <Text style={[styles.modalButtonText, { color: colors.white }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: Spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  addButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  playlistName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  playlistSongs: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    fontSize: Typography.fontSizes.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
});

export default PlaylistsScreen;

