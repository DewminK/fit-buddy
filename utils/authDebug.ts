import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility functions for managing local authentication
 * These are helper functions for development and testing
 */

const REGISTERED_USERS_KEY = 'fitbuddy_registered_users';

export const authDebugUtils = {
  /**
   * Get all registered users (without passwords for security)
   */
  async getAllUsers() {
    try {
      const usersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      return users.map((user: any) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  /**
   * Clear all registered users (useful for testing)
   */
  async clearAllUsers() {
    try {
      await AsyncStorage.removeItem(REGISTERED_USERS_KEY);
      console.log('✅ All registered users cleared');
    } catch (error) {
      console.error('Error clearing users:', error);
    }
  },

  /**
   * Check if a username exists
   */
  async userExists(username: string) {
    try {
      const usersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      return users.some((u: any) => u.username.toLowerCase() === username.toLowerCase());
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  },

  /**
   * Get user count
   */
  async getUserCount() {
    try {
      const usersJson = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      return users.length;
    } catch (error) {
      console.error('Error getting user count:', error);
      return 0;
    }
  },
};

// Export for console debugging in development
if (__DEV__) {
  (global as any).authDebug = authDebugUtils;
  console.log('🔧 Auth debug utils available in console: global.authDebug');
}
