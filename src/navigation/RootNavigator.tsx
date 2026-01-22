import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import PlayerScreen from '../screens/Player/PlayerScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import ArtistDetailScreen from '../screens/Artist/ArtistDetailScreen';
import AlbumDetailScreen from '../screens/Album/AlbumDetailScreen';
import QueueScreen from '../screens/Queue/QueueScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="ArtistDetail"
        component={ArtistDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AlbumDetail"
        component={AlbumDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Queue"
        component={QueueScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

