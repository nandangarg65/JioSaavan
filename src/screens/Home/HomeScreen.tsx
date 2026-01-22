import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../hooks/useTheme';
import { Typography, Spacing } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';
import SuggestedTab from './tabs/SuggestedTab';
import SongsTab from './tabs/SongsTab';
import ArtistsTab from './tabs/ArtistsTab';
import AlbumsTab from './tabs/AlbumsTab';

type TabType = 'Suggested' | 'Songs' | 'Artists' | 'Albums';

const tabs: TabType[] = ['Suggested', 'Songs', 'Artists', 'Albums'];

const HomeScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabType>('Suggested');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Suggested':
        return <SuggestedTab />;
      case 'Songs':
        return <SongsTab />;
      case 'Artists':
        return <ArtistsTab />;
      case 'Albums':
        return <AlbumsTab />;
      default:
        return <SuggestedTab />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="musical-notes" size={28} color={colors.primary} />
          <Text style={[styles.logoText, { color: colors.text }]}>Mume</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
          style={[styles.searchButton, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="search" size={22} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
                activeTab === tab && { borderBottomColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? colors.primary : colors.textSecondary },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>{renderTabContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoText: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  tab: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.medium,
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;

