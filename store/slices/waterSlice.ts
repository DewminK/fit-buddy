import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/secureStorage';

interface WaterIntake {
  date: string; // YYYY-MM-DD format
  amount: number; // in ml
  entries: Array<{
    time: string;
    amount: number;
  }>;
}

interface WaterState {
  dailyGoal: number; // in ml (default 2000ml = 2L)
  today: WaterIntake;
  history: WaterIntake[];
  isLoading: boolean;
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const initialState: WaterState = {
  dailyGoal: 2000, // 2 liters
  today: {
    date: getTodayDate(),
    amount: 0,
    entries: [],
  },
  history: [],
  isLoading: false,
};

// Async thunks
export const loadWaterData = createAsyncThunk(
  'water/loadWaterData',
  async () => {
    try {
      const goalData = await AsyncStorage.getItem(STORAGE_KEYS.WATER_GOAL);
      const intakeData = await AsyncStorage.getItem(STORAGE_KEYS.WATER_INTAKE);
      
      const goal = goalData ? parseInt(goalData) : 2000;
      const intake = intakeData ? JSON.parse(intakeData) : null;
      
      // Check if intake data is from today
      const todayDate = getTodayDate();
      if (intake && intake.date === todayDate) {
        return { goal, intake };
      }
      
      // Reset for new day
      return {
        goal,
        intake: {
          date: todayDate,
          amount: 0,
          entries: [],
        },
      };
    } catch (error) {
      console.error('Error loading water data:', error);
      return {
        goal: 2000,
        intake: {
          date: getTodayDate(),
          amount: 0,
          entries: [],
        },
      };
    }
  }
);

export const saveWaterGoal = createAsyncThunk(
  'water/saveWaterGoal',
  async (goal: number) => {
    await AsyncStorage.setItem(STORAGE_KEYS.WATER_GOAL, goal.toString());
    return goal;
  }
);

export const addWaterIntake = createAsyncThunk(
  'water/addWaterIntake',
  async (amount: number, { getState }) => {
    const state = getState() as { water: WaterState };
    const now = new Date();
    const time = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    
    const newEntry = { time, amount };
    const updatedIntake = {
      ...state.water.today,
      amount: state.water.today.amount + amount,
      entries: [...state.water.today.entries, newEntry],
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.WATER_INTAKE, JSON.stringify(updatedIntake));
    return updatedIntake;
  }
);

export const removeLastWaterIntake = createAsyncThunk(
  'water/removeLastWaterIntake',
  async (_, { getState }) => {
    const state = getState() as { water: WaterState };
    const entries = [...state.water.today.entries];
    
    if (entries.length === 0) {
      return state.water.today;
    }
    
    const lastEntry = entries.pop();
    const updatedIntake = {
      ...state.water.today,
      amount: state.water.today.amount - (lastEntry?.amount || 0),
      entries,
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.WATER_INTAKE, JSON.stringify(updatedIntake));
    return updatedIntake;
  }
);

const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    resetDailyIntake: (state) => {
      const todayDate = getTodayDate();
      state.today = {
        date: todayDate,
        amount: 0,
        entries: [],
      };
      AsyncStorage.setItem(STORAGE_KEYS.WATER_INTAKE, JSON.stringify(state.today));
    },
  },
  extraReducers: (builder) => {
    builder
      // Load water data
      .addCase(loadWaterData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadWaterData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyGoal = action.payload.goal;
        state.today = action.payload.intake;
      })
      // Save goal
      .addCase(saveWaterGoal.fulfilled, (state, action) => {
        state.dailyGoal = action.payload;
      })
      // Add intake
      .addCase(addWaterIntake.fulfilled, (state, action) => {
        state.today = action.payload;
      })
      // Remove last intake
      .addCase(removeLastWaterIntake.fulfilled, (state, action) => {
        state.today = action.payload;
      });
  },
});

export const { resetDailyIntake } = waterSlice.actions;
export default waterSlice.reducer;
