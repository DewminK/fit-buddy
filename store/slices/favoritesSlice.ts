import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from './exercisesSlice';

interface FavoritesState {
  favorites: Exercise[];
  isLoading: boolean;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
};

const FAVORITES_STORAGE_KEY = '@fitbuddy_favorites';

export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }
);

export const saveFavorites = createAsyncThunk(
  'favorites/saveFavorites',
  async (favorites: Exercise[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      return favorites;
    } catch (error) {
      console.error('Error saving favorites:', error);
      throw error;
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Exercise>) => {
      const exists = state.favorites.find(
        (fav) => fav.name === action.payload.name
      );
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (fav) => fav.name !== action.payload
      );
    },
    toggleFavorite: (state, action: PayloadAction<Exercise>) => {
      const index = state.favorites.findIndex(
        (fav) => fav.name === action.payload.name
      );
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.favorites = action.payload;
        state.isLoading = false;
      })
      .addCase(saveFavorites.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.favorites = action.payload;
      });
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
