import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Player: undefined;
  Search: undefined;
  ArtistDetail: { artistId: string };
  AlbumDetail: { albumId: string };
  Queue: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Playlists: undefined;
  Settings: undefined;
};

export type HomeTabParamList = {
  Suggested: undefined;
  Songs: undefined;
  Artists: undefined;
  Albums: undefined;
};

