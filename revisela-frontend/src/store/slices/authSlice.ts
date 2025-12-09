import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  AUTH_STORAGE_KEYS,
  clearAllAuthData,
  getAuthToken,
  getUserDetails,
} from '@/lib/auth-utils';
import { safeLocalStorage } from '@/lib/utils';

import { RootState } from '@/store';

// Export the centralized clear function for backward compatibility
export const clearAuthData = clearAllAuthData;

// Add a utility function to get profile image
export const getProfileImageFromStorage = (): string => {
  try {
    const userDetails = getUserDetails();
    return userDetails?.profileImage || '';
  } catch (error) {
    console.error('Error reading profile image from storage', error);
  }
  return '';
};

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  username?: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initAuth: (state) => {
      const token = getAuthToken();
      const userDetails = getUserDetails();

      if (token) {
        state.token = token;
        state.isAuthenticated = true;

        if (userDetails) {
          state.user = userDetails;
        }
      }
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      // Clear Redux state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage using centralized utility
      clearAllAuthData();
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.profileImage = action.payload;
      }

      try {
        const userDetails = getUserDetails();
        if (userDetails) {
          userDetails.profileImage = action.payload;
          safeLocalStorage.setItem(
            AUTH_STORAGE_KEYS.USER_DETAILS,
            JSON.stringify(userDetails)
          );
        }
      } catch (error) {
        console.error('Failed to update profile image in storage', error);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  initAuth,
  updateProfileImage,
} = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
export const selectProfileImage = (state: RootState) =>
  state.auth.user?.profileImage || getProfileImageFromStorage();
