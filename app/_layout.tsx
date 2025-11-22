import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadUser } from '../store/slices/authSlice';
import { loadFavorites } from '../store/slices/favoritesSlice';
import { loadNotifications } from '../store/slices/notificationsSlice';
import { loadTheme } from '../store/slices/themeSlice';
import { loadWaterData } from '../store/slices/waterSlice';
import { loadWorkouts } from '../store/slices/workoutsSlice';
import ErrorBoundary from '../components/ErrorBoundary';

// Suppress yellow box warnings in production
if (!__DEV__) {
  LogBox.ignoreAllLogs(true);
  
  // Override console.error to prevent red box in production
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    // Still log to native console for debugging, but don't show red box
    originalConsoleError(...args);
  };
  
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    // Still log to native console for debugging, but don't show yellow box
    originalConsoleWarn(...args);
  };
}

// Suppress specific warnings that are not critical (for development)
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

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
      try {
        await dispatch(loadUser());
        await dispatch(loadFavorites());
        await dispatch(loadTheme());
        await dispatch(loadWaterData());
        
        // Load workouts from AsyncStorage
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        
        try {
          const storedWorkout = await AsyncStorage.getItem('fitbuddy_workouts');
          if (storedWorkout) {
            dispatch(loadWorkouts(JSON.parse(storedWorkout)));
          }
        } catch (error) {
          console.error('Failed to load workouts:', error);
        }
        
        // Load notifications from AsyncStorage
        try {
          const storedNotifications = await AsyncStorage.getItem('fitbuddy_notifications');
          if (storedNotifications) {
            dispatch(loadNotifications(JSON.parse(storedNotifications)));
          }
        } catch (error) {
          console.error('Failed to load notifications:', error);
        }
      } catch (error) {
        console.error('Failed to load initial app data:', error);
      } finally {
        // Always set navigation ready even if some data fails to load
        setIsNavigationReady(true);
      }
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
    <ErrorBoundary>
      <Provider store={store}>
        <RootLayoutNav />
      </Provider>
    </ErrorBoundary>
  );
}
