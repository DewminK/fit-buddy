import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'favorite' | 'workout' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  exerciseName?: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

const STORAGE_KEY = 'fitbuddy_notifications';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      state.notifications.unshift(notification);
      state.unreadCount = state.notifications.filter(n => !n.read).length;
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
      
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.notifications))
        .catch((error) => console.error('Failed to save notifications:', error));
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
        state.unreadCount = state.notifications.filter(n => !n.read).length;
        
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.notifications))
          .catch((error) => console.error('Failed to save notifications:', error));
      }
    },
    
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
      
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.notifications))
        .catch((error) => console.error('Failed to save notifications:', error));
    },
    
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      state.unreadCount = state.notifications.filter(n => !n.read).length;
      
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.notifications))
        .catch((error) => console.error('Failed to save notifications:', error));
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      
      AsyncStorage.removeItem(STORAGE_KEY)
        .catch((error) => console.error('Failed to clear notifications:', error));
    },
    
    loadNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  loadNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
