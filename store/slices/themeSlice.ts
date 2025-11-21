import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDark: boolean;
}

const initialState: ThemeState = {
  isDark: false,
};

const THEME_STORAGE_KEY = '@fitbuddy_theme';

export const loadTheme = createAsyncThunk(
  'theme/loadTheme',
  async () => {
    try {
      const themeValue = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return themeValue === 'dark';
    } catch (error) {
      console.error('Error loading theme:', error);
      return false;
    }
  }
);

export const saveTheme = createAsyncThunk(
  'theme/saveTheme',
  async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
      return isDark;
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isDark = action.payload;
      })
      .addCase(saveTheme.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isDark = action.payload;
      });
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
