import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { resetWorkouts } from '../store/slices/workoutsSlice';
import { clearNotifications } from '../store/slices/notificationsSlice';

export async function resetAppData() {
  // Clear AsyncStorage
  await AsyncStorage.clear();
  // Clear SecureStore
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('user');
  // Reset Redux slices
  store.dispatch(logout());
  store.dispatch(resetWorkouts());
  store.dispatch(clearNotifications());
}
