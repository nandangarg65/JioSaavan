import { Song, Artist, Album } from '../types';
import { ApiSong, ApiArtist, ApiAlbum, getBestImage, getBestDownloadUrl } from '../services/api';

export const mapApiSongToSong = (apiSong: ApiSong): Song => {
  return {
    id: apiSong.id,
    title: apiSong.name,
    artist: apiSong.primaryArtists,
    artistId: apiSong.primaryArtistsId?.split(',')[0]?.trim() || '',
    album: apiSong.album?.name || '',
    albumId: apiSong.album?.id || '',
    artwork: getBestImage(apiSong.image || []),
    duration: apiSong.duration || 0,
    url: getBestDownloadUrl(apiSong.downloadUrl || []),
  };
};

export const mapApiArtistToArtist = (apiArtist: ApiArtist): Artist => {
  return {
    id: apiArtist.id,
    name: apiArtist.name,
    image: getBestImage(apiArtist.image || []),
    albumCount: 0, // Will be fetched separately if needed
    songCount: 0,  // Will be fetched separately if needed
    totalDuration: 0,
  };
};

export const mapApiAlbumToAlbum = (apiAlbum: ApiAlbum): Album => {
  return {
    id: apiAlbum.id,
    title: apiAlbum.name,
    artist: apiAlbum.primaryArtists,
    artistId: apiAlbum.primaryArtistsId?.split(',')[0]?.trim() || '',
    artwork: getBestImage(apiAlbum.image || []),
    year: parseInt(apiAlbum.year) || new Date().getFullYear(),
    songCount: apiAlbum.songCount || 0,
  };
};

export const mapApiSongsToSongs = (apiSongs: ApiSong[]): Song[] => {
  return apiSongs.map(mapApiSongToSong);
};

export const mapApiArtistsToArtists = (apiArtists: ApiArtist[]): Artist[] => {
  return apiArtists.map(mapApiArtistToArtist);
};

export const mapApiAlbumsToAlbums = (apiAlbums: ApiAlbum[]): Album[] => {
  return apiAlbums.map(mapApiAlbumToAlbum);
};

