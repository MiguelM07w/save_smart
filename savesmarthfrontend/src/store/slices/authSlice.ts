import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Login, AuthState } from '../../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false, // Se marca true después de verificar localStorage
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Login>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
      // Also store token separately for easier access
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // NO resetear isInitialized - ya se verificó localStorage
      // Clear from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    initializeAuth: (state) => {
      // Check localStorage for existing user and token
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      console.log('🔄 Inicializando autenticación...');
      console.log('📦 User en localStorage:', storedUser ? 'Sí' : 'No');
      console.log('🎫 Token en localStorage:', storedToken ? 'Sí' : 'No');

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // Ensure token is in the user object
          if (!parsedUser.token) {
            parsedUser.token = storedToken;
          }

          console.log('✅ Sesión restaurada para:', parsedUser.username);
          state.user = parsedUser;
          state.isAuthenticated = true;
        } catch (error) {
          console.error('❌ Error parsing stored user:', error);
          // Clear invalid data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          state.user = null;
          state.isAuthenticated = false;
        }
      } else {
        console.log('⚠️ No hay sesión guardada');
        // If no user or token, clear everything
        state.user = null;
        state.isAuthenticated = false;
      }

      // IMPORTANTE: Marcar como inicializado al final (en todos los casos)
      state.isInitialized = true;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<Login>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  initializeAuth,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;