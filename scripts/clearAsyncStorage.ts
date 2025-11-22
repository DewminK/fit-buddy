import AsyncStorage from '@react-native-async-storage/async-storage';

export async function clearAsyncStorage() {
  try {
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage cleared.');
  } catch (error) {
    console.error('❌ Error clearing AsyncStorage:', error);
  }
}

// To run this script, import and call clearAsyncStorage() from your app or a dev tool.
