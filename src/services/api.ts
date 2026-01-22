const BASE_URL = 'https://saavn.sumit.co';

export interface ApiSong {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  year: string;
  releaseDate: string;
  duration: number;
  label: string;
  primaryArtists: string;
  primaryArtistsId: string;
  featuredArtists: string;
  featuredArtistsId: string;
  explicitContent: number;
  playCount: number;
  language: string;
  hasLyrics: string;
  url: string;
  copyright: string;
  image: ApiImage[];
  downloadUrl: ApiDownloadUrl[];
}

export interface ApiImage {
  quality: string;
  link: string;
}

export interface ApiDownloadUrl {
  quality: string;
  link: string;
}

export interface ApiArtist {
  id: string;
  name: string;
  url: string;
  image: ApiImage[];
  followerCount: string;
  fanCount: string;
  isVerified: boolean;
  dominantLanguage: string;
  dominantType: string;
  bio: string[];
  dob: string;
  fb: string;
  twitter: string;
  wiki: string;
  availableLanguages: string[];
  isRadioPresent: boolean;
}

export interface ApiAlbum {
  id: string;
  name: string;
  year: string;
  releaseDate: string;
  primaryArtists: string;
  primaryArtistsId: string;
  songCount: number;
  language: string;
  image: ApiImage[];
  url: string;
  songs?: ApiSong[];
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: ApiSong[] | ApiArtist[] | ApiAlbum[];
    total: number;
    start: number;
  };
}

// Helper to get best quality image
export const getBestImage = (images: ApiImage[]): string => {
  const quality500 = images.find((img) => img.quality === '500x500');
  const quality150 = images.find((img) => img.quality === '150x150');
  return quality500?.link || quality150?.link || images[images.length - 1]?.link || '';
};

// Helper to get download URL
export const getBestDownloadUrl = (urls: ApiDownloadUrl[]): string => {
  const high = urls.find((url) => url.quality === '320kbps');
  const medium = urls.find((url) => url.quality === '160kbps');
  return high?.link || medium?.link || urls[urls.length - 1]?.link || '';
};

// API Functions
export const searchSongs = async (query: string, page = 1, limit = 10): Promise<ApiSong[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/search/songs?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    const data = await response.json();
    return data.data?.results || [];
  } catch (error) {
    console.error('Error searching songs:', error);
    return [];
  }
};

export const searchAlbums = async (query: string, page = 1, limit = 10): Promise<ApiAlbum[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/search/albums?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    const data = await response.json();
    return data.data?.results || [];
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
};

export const searchArtists = async (query: string, page = 1, limit = 10): Promise<ApiArtist[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/search/artists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    const data = await response.json();
    return data.data?.results || [];
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
};

export const searchAll = async (query: string): Promise<{ songs: ApiSong[]; albums: ApiAlbum[]; artists: ApiArtist[] }> => {
  try {
    const response = await fetch(`${BASE_URL}/api/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return {
      songs: data.data?.songs?.results || [],
      albums: data.data?.albums?.results || [],
      artists: data.data?.artists?.results || [],
    };
  } catch (error) {
    console.error('Error searching all:', error);
    return { songs: [], albums: [], artists: [] };
  }
};

export const getSongDetails = async (id: string): Promise<ApiSong | null> => {
  try {
    const response = await fetch(`${BASE_URL}/api/songs/${id}`);
    const data = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error getting song details:', error);
    return null;
  }
};

export const getAlbumDetails = async (id: string): Promise<ApiAlbum | null> => {
  try {
    const response = await fetch(`${BASE_URL}/api/albums?id=${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error getting album details:', error);
    return null;
  }
};

export const getArtistDetails = async (id: string): Promise<ApiArtist | null> => {
  try {
    const response = await fetch(`${BASE_URL}/api/artists/${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error getting artist details:', error);
    return null;
  }
};

export const getArtistSongs = async (id: string, page = 1): Promise<ApiSong[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/artists/${id}/songs?page=${page}`);
    const data = await response.json();
    return data.data?.songs || [];
  } catch (error) {
    console.error('Error getting artist songs:', error);
    return [];
  }
};

export const getArtistAlbums = async (id: string, page = 1): Promise<ApiAlbum[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/artists/${id}/albums?page=${page}`);
    const data = await response.json();
    return data.data?.albums || [];
  } catch (error) {
    console.error('Error getting artist albums:', error);
    return [];
  }
};

export const getPlaylistDetails = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/api/playlists?id=${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error getting playlist:', error);
    return null;
  }
};

// Get trending/home data
export const getHomeData = async (): Promise<{ trending: ApiSong[]; newReleases: ApiAlbum[]; topArtists: ApiArtist[] }> => {
  try {
    // Search for popular content to simulate home data
    const [trendingRes, albumsRes, artistsRes] = await Promise.all([
      searchSongs('trending', 1, 20),
      searchAlbums('new', 1, 10),
      searchArtists('popular', 1, 10),
    ]);
    return {
      trending: trendingRes,
      newReleases: albumsRes,
      topArtists: artistsRes,
    };
  } catch (error) {
    console.error('Error getting home data:', error);
    return { trending: [], newReleases: [], topArtists: [] };
  }
};

