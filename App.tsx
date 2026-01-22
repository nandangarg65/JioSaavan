import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { audioService } from './src/services/AudioService';

// Audio Player Provider component that initializes audio
const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    audioService.initialize();
  }, []);

  return <>{children}</>;
};

const LoadingView = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color="#FF6B35" />
  </View>
);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={<LoadingView />} persistor={persistor}>
          <AudioPlayerProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <RootNavigator />
                <StatusBar style="auto" />
              </NavigationContainer>
            </SafeAreaProvider>
          </AudioPlayerProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
