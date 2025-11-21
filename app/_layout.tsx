import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadUser } from '../store/slices/authSlice';
import { loadFavorites } from '../store/slices/favoritesSlice';
import { loadTheme } from '../store/slices/themeSlice';

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Load persisted data
    const loadData = async () => {
      await dispatch(loadUser());
      await dispatch(loadFavorites());
      await dispatch(loadTheme());
      setIsNavigationReady(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'auth';

    setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        router.replace('/auth/login');
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }, 1);
  }, [isAuthenticated, segments, isNavigationReady]);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
