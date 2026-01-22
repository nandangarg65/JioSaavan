import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeReducer from './useThemeStore';
import playerReducer from './usePlayerStore';
import favoritesReducer from './useFavoritesStore';
import playlistsReducer from './usePlaylistsStore';
import searchReducer from './useSearchStore';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'player', 'favorites', 'playlists', 'search'], // Persist these reducers
};

const rootReducer = combineReducers({
  theme: themeReducer,
  player: playerReducer,
  favorites: favoritesReducer,
  playlists: playlistsReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

