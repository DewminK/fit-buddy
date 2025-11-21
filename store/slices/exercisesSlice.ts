import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { exerciseAPI } from '../../services/api';

export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

interface ExercisesState {
  exercises: Exercise[];
  filteredExercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  currentFilter: {
    muscle: string;
    difficulty: string;
  };
}

const initialState: ExercisesState = {
  exercises: [],
  filteredExercises: [],
  isLoading: false,
  error: null,
  currentFilter: {
    muscle: 'all',
    difficulty: 'all',
  },
};

export const fetchExercises = createAsyncThunk(
  'exercises/fetchExercises',
  async ({ muscle = '', difficulty = '' }: { muscle?: string; difficulty?: string }, { rejectWithValue }) => {
    try {
      const response = await exerciseAPI.getExercises(muscle, difficulty);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exercises');
    }
  }
);

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ muscle?: string; difficulty?: string }>) => {
      if (action.payload.muscle !== undefined) {
        state.currentFilter.muscle = action.payload.muscle;
      }
      if (action.payload.difficulty !== undefined) {
        state.currentFilter.difficulty = action.payload.difficulty;
      }
      
      // Apply filters
      state.filteredExercises = state.exercises.filter((exercise) => {
        const muscleMatch = state.currentFilter.muscle === 'all' || exercise.muscle === state.currentFilter.muscle;
        const difficultyMatch = state.currentFilter.difficulty === 'all' || exercise.difficulty === state.currentFilter.difficulty;
        return muscleMatch && difficultyMatch;
      });
    },
    clearFilters: (state) => {
      state.currentFilter = { muscle: 'all', difficulty: 'all' };
      state.filteredExercises = state.exercises;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.isLoading = false;
        state.exercises = action.payload;
        state.filteredExercises = action.payload;
        state.error = null;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, clearFilters } = exercisesSlice.actions;
export default exercisesSlice.reducer;
