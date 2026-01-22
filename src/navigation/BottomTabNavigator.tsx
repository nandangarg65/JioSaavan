import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { useTheme } from '../hooks/useTheme';
import HomeScreen from '../screens/Home/HomeScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import PlaylistsScreen from '../screens/Playlists/PlaylistsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { View, StyleSheet } from 'react-native';
import MiniPlayer from '../components/player/MiniPlayer';
import { usePlayerStore } from '../hooks/usePlayer';

const Tab = createBottomTabNavigator<MainTabParamList>();

const BottomTabNavigator = () => {
  const { colors } = useTheme();
  const { currentSong } = usePlayerStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Favorites':
                iconName = focused ? 'heart' : 'heart-outline';
                break;
              case 'Playlists':
                iconName = focused ? 'list' : 'list-outline';
                break;
              case 'Settings':
                iconName = focused ? 'settings' : 'settings-outline';
                break;
              default:
                iconName = 'home';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Playlists" component={PlaylistsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      {currentSong && <MiniPlayer />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BottomTabNavigator;

