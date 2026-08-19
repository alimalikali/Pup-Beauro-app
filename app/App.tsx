import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { getToken, deleteToken } from './src/utils/secureStorage';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { store } from './src/store';
import { loginSuccess } from './src/store/authSlice';
import { AppNavigator } from './src/navigation/AppNavigator';
import { authApi } from './src/services/api';
import { connectSocket } from './src/services/socket';
import { Colors } from './src/constants';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Amiri_400Regular,
    Amiri_700Bold,
  });

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await getToken('token');
        if (token) {
          const me = await authApi.me() as any;
          store.dispatch(loginSuccess({ user: me, token }));
          connectSocket(token);
        }
      } catch {
        await deleteToken('token');
      } finally {
        setReady(true);
      }
    }
    if (fontsLoaded) restoreSession();
  }, [fontsLoaded]);

  useEffect(() => {
    if (ready && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [ready, fontsLoaded]);

  if (!ready || !fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.pinkHot} size="large" />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
