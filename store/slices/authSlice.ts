import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { secureStorage, STORAGE_KEYS } from '../../utils/secureStorage';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  phone?: string;
  age?: number;
  weight?: number;
  height?: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login for:', username);
      const response = await authAPI.login(username, password);
      
      // Store token and user data securely
      await secureStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.token);
      await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response));
      
      console.log('✅ Login successful:', response.firstName, response.lastName);
      return response;
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string; firstName: string; lastName: string }, { rejectWithValue }) => {
    try {
      console.log('📝 Attempting registration for:', userData.username);
      const response = await authAPI.register(userData);
      
      // Store token and user data securely
      await secureStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.token);
      await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response));
      
      console.log('✅ Registration successful:', response.firstName, response.lastName);
      return response;
    } catch (error: any) {
      console.error('❌ Registration failed:', error.message);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);
        console.log('✅ User loaded from storage:', user.username);
        return user;
      }
      console.log('ℹ️ No user data found in storage');
      return null;
    } catch (error: any) {
      console.error('❌ Error loading user:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    console.log('👋 Logging out...');
    await secureStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);
    console.log('✅ Logout complete');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(action.payload))
        .catch((error) => console.error('Failed to save user data:', error));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Load User
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
