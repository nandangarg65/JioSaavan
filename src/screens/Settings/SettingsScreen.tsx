import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  type: 'toggle' | 'navigate' | 'action';
  value?: boolean;
  onPress?: () => void;
}

const SettingsScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          type: 'toggle',
          value: isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Playback',
      items: [
        { icon: 'play-circle', label: 'Autoplay', type: 'toggle', value: true },
        { icon: 'volume-high', label: 'Equalizer', type: 'navigate' },
        { icon: 'timer', label: 'Sleep Timer', type: 'navigate' },
      ],
    },
    {
      title: 'Library',
      items: [
        { icon: 'download', label: 'Downloads', type: 'navigate' },
        { icon: 'folder', label: 'Folders', type: 'navigate' },
        { icon: 'musical-notes', label: 'Audio Quality', type: 'navigate' },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'information-circle', label: 'About', type: 'navigate' },
        { icon: 'star', label: 'Rate App', type: 'action' },
        { icon: 'share-social', label: 'Share App', type: 'action' },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.label}
      style={[styles.settingItem, { backgroundColor: colors.surface }]}
      onPress={item.type !== 'toggle' ? item.onPress : undefined}
      disabled={item.type === 'toggle'}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={item.icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      )}
      {item.type === 'navigate' && (
        <Ionicons name="chevron-forward" size={20} color={colors.icon} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textTertiary }]}>
            Mume Music Player v1.0.0
          </Text>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingBottom: 100,
  },
  version: {
    fontSize: Typography.fontSizes.sm,
  },
});

export default SettingsScreen;

