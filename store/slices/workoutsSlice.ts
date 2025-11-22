import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from './exercisesSlice';

export interface WorkoutExercise extends Exercise {
  sets?: number;
  reps?: number;
  duration?: number;
  notes?: string;
  addedAt: string;
}

interface WorkoutsState {
  currentWorkout: WorkoutExercise[];
  savedWorkouts: {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
    createdAt: string;
  }[];
}

const initialState: WorkoutsState = {
  currentWorkout: [],
  savedWorkouts: [],
};

const STORAGE_KEY = 'fitbuddy_workouts';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    addExerciseToWorkout: (state, action: PayloadAction<Exercise>) => {
      const exists = state.currentWorkout.find(
        (ex) => ex.name === action.payload.name
      );
      
      if (!exists) {
        state.currentWorkout.push({
          ...action.payload,
          sets: 3,
          reps: 10,
          addedAt: new Date().toISOString(),
        });
        
        // Save to AsyncStorage
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.currentWorkout))
          .catch((error) => console.error('Failed to save workout:', error));
      }
    },
    
    removeExerciseFromWorkout: (state, action: PayloadAction<string>) => {
      state.currentWorkout = state.currentWorkout.filter(
        (ex) => ex.name !== action.payload
      );
      
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.currentWorkout))
        .catch((error) => console.error('Failed to save workout:', error));
    },
    
    updateExerciseInWorkout: (
      state,
      action: PayloadAction<{ name: string; updates: Partial<WorkoutExercise> }>
    ) => {
      const exercise = state.currentWorkout.find(
        (ex) => ex.name === action.payload.name
      );
      
      if (exercise) {
        Object.assign(exercise, action.payload.updates);
        
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.currentWorkout))
          .catch((error) => console.error('Failed to save workout:', error));
      }
    },
    
    clearCurrentWorkout: (state) => {
      state.currentWorkout = [];
      AsyncStorage.removeItem(STORAGE_KEY)
        .catch((error) => console.error('Failed to clear workout:', error));
    },
    
    loadWorkouts: (state, action: PayloadAction<WorkoutExercise[]>) => {
      state.currentWorkout = action.payload;
    },
    
    saveCurrentWorkout: (state, action: PayloadAction<string>) => {
      if (state.currentWorkout.length > 0) {
        const newWorkout = {
          id: Date.now().toString(),
          name: action.payload,
          exercises: [...state.currentWorkout],
          createdAt: new Date().toISOString(),
        };
        
        state.savedWorkouts.push(newWorkout);
        state.currentWorkout = [];
        
        AsyncStorage.setItem('fitbuddy_saved_workouts', JSON.stringify(state.savedWorkouts))
          .catch((error) => console.error('Failed to save workouts:', error));
        AsyncStorage.removeItem(STORAGE_KEY)
          .catch((error) => console.error('Failed to clear current workout:', error));
      }
    },
  },
});

export const {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  updateExerciseInWorkout,
  clearCurrentWorkout,
  loadWorkouts,
  saveCurrentWorkout,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
