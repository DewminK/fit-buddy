import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadUser } from '../store/slices/authSlice';
import { loadFavorites } from '../store/slices/favoritesSlice';
import { loadTheme } from '../store/slices/themeSlice';
import { loadWaterData } from '../store/slices/waterSlice';
import { loadWorkouts } from '../store/slices/workoutsSlice';

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
      await dispatch(loadWaterData());
      
      // Load workouts from AsyncStorage
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const storedWorkout = await AsyncStorage.getItem('fitbuddy_workouts');
      if (storedWorkout) {
        dispatch(loadWorkouts(JSON.parse(storedWorkout)));
      }
      
      setIsNavigationReady(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === 'auth';
    const inWelcome = segments[0] === 'welcome';
    const inTabs = segments[0] === '(tabs)';

    setTimeout(() => {
      // If not authenticated and not in auth or welcome, go to welcome
      if (!isAuthenticated && !inAuthGroup && !inWelcome) {
        router.replace('/welcome');
      } 
      // If authenticated and in auth or welcome, go to tabs
      else if (isAuthenticated && (inAuthGroup || inWelcome)) {
        router.replace('/(tabs)');
      }
    }, 1);
  }, [isAuthenticated, segments, isNavigationReady]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Slot />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
