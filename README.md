# 🎵 React Native Music Player

A music streaming app built using **React Native (Expo)** and the **JioSaavn public API**, focusing on clean architecture, global state synchronization, and background audio playback.

---

## 🚀 Features
- Search and stream real JioSaavn songs
- Full Player with play/pause, seek, next/previous
- Background playback (works when app is minimized or locked)
- Persistent Mini Player synced with Full Player
- Queue management (add, remove, reorder)
- Queue persistence using local storage
- Shuffle & repeat modes

---

## 🛠 Tech Stack
- React Native (Expo) + TypeScript  
- React Navigation v6  
- Zustand (state management)  
- react-native-track-player (audio & background playback)  
- MMKV (local storage)  
- JioSaavn API – https://saavn.sumit.co/

---

## ⚙️ Setup
```bash
git clone https://github.com/nandangarg65/JioSaavan
cd react-native-music-player
npm install
npx expo start
