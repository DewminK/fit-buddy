import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure storage utility that uses SecureStore on native platforms
 * and AsyncStorage on web for development
 */

const isWeb = Platform.OS === 'web';

export const secureStorage = {
  /**
   * Save a value securely
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error('Error saving to secure storage:', error);
      throw error;
    }
  },

  /**
   * Get a value from secure storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (isWeb) {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return null;
    }
  },

  /**
   * Remove a value from secure storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error removing from secure storage:', error);
      throw error;
    }
  },

  /**
   * Clear all secure storage (use with caution)
   */
  async clear(): Promise<void> {
    try {
      if (isWeb) {
        await AsyncStorage.clear();
      } else {
        // On native, we need to manually delete specific keys
        // as SecureStore doesn't have a clear all method
        const keys = ['userToken', 'userData', 'refreshToken'];
        await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
      }
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  },
};

// Storage keys constants
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  FAVORITES: 'favorites',
  WATER_INTAKE: 'waterIntake',
  WATER_GOAL: 'waterGoal',
} as const;
