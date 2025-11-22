import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import exercisesReducer from './slices/exercisesSlice';
import favoritesReducer from './slices/favoritesSlice';
import notificationsReducer from './slices/notificationsSlice';
import themeReducer from './slices/themeSlice';
import waterReducer from './slices/waterSlice';
import workoutsReducer from './slices/workoutsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exercisesReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
    water: waterReducer,
    workouts: workoutsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
