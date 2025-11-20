import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notification, NotificationState, NotificationType } from '../../types';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'isRead'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;

      // Guardar en localStorage
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        localStorage.setItem('notifications', JSON.stringify(state.notifications));
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.isRead = true);
      state.unreadCount = 0;
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },

    deleteNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      localStorage.removeItem('notifications');
    },

    initializeNotifications: (state) => {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          state.notifications = parsed;
          state.unreadCount = parsed.filter((n: Notification) => !n.isRead).length;
        } catch (error) {
          console.error('Error loading notifications:', error);
          state.notifications = [];
          state.unreadCount = 0;
        }
      }
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  initializeNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
