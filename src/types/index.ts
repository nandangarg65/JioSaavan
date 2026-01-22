export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  artistId: string;
  duration: number; // in seconds
  artwork: string;
  url?: string;
  isFavorite?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  albumCount: number;
  songCount: number;
  totalDuration?: number; // in seconds
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  artwork: string;
  year: number;
  songCount: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artwork?: string;
  songs: Song[];
  createdAt: string; // ISO date string for serialization
  updatedAt: string; // ISO date string for serialization
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
}

export type SortOrder = 'ascending' | 'descending';
export type SortBy = 'title' | 'artist' | 'album' | 'dateAdded' | 'duration';

export type TabType = 'Suggested' | 'Songs' | 'Artists' | 'Albums' | 'Folders';
export type SearchFilterType = 'Songs' | 'Artists' | 'Albums' | 'Folders';

export type ThemeMode = 'light' | 'dark' | 'system';

