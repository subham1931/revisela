/**
 * Authentication Utilities
 *
 * Centralized utilities for handling authentication operations,
 * token validation, and logout procedures following security best practices.
 */
import { safeLocalStorage } from './utils';

// Authentication storage keys
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER_DETAILS: 'userDetails',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
} as const;

/**
 * Clears all authentication data from localStorage
 * This should be called on logout, 401 errors, and account deletion
 */
export const clearAllAuthData = (): void => {
  try {
    Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
      safeLocalStorage.removeItem(key);
    });

    // Clear any other potential auth-related data
    safeLocalStorage.removeItem('sessionId');
    safeLocalStorage.removeItem('lastActivity');

    console.log('All authentication data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing authentication data:', error);
  }
};

/**
 * Checks if user is authenticated based on token presence
 */
export const isAuthenticated = (): boolean => {
  const token = safeLocalStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  return !!token;
};

/**
 * Gets the current auth token
 */
export const getAuthToken = (): string | null => {
  return safeLocalStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
};

/**
 * Gets user details from localStorage
 */
export const getUserDetails = (): any | null => {
  try {
    const userDetailsStr = safeLocalStorage.getItem(
      AUTH_STORAGE_KEYS.USER_DETAILS
    );
    return userDetailsStr ? JSON.parse(userDetailsStr) : null;
  } catch (error) {
    console.error('Error parsing user details:', error);
    return null;
  }
};

/**
 * Stores authentication data securely
 */
export const storeAuthData = (token: string, userDetails: any): void => {
  try {
    safeLocalStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    safeLocalStorage.setItem(
      AUTH_STORAGE_KEYS.USER_DETAILS,
      JSON.stringify(userDetails)
    );
  } catch (error) {
    console.error('Error storing authentication data:', error);
  }
};

/**
 * Validates if the current token is expired (if it's a JWT)
 */
export const isTokenExpired = (): boolean => {
  try {
    const token = getAuthToken();
    if (!token) return true;

    // Check if it's a JWT token
    const parts = token.split('.');
    if (parts.length !== 3) return false; // Not a JWT, assume valid

    // Decode the payload
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp ? payload.exp < currentTime : false;
  } catch (error) {
    console.error('Error validating token expiration:', error);
    return true; // Assume expired on error
  }
};

/**
 * Performs a complete logout cleanup
 * This function should be called for all logout scenarios
 */
export const performLogout = (): void => {
  clearAllAuthData();

  // Clear any cached data that might contain sensitive information
  if (typeof window !== 'undefined') {
    // Clear session storage as well
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }
};

/**
 * Handles unauthorized access (401 errors)
 * This should be called when the server returns 401
 */
export const handleUnauthorizedAccess = (): void => {
  console.warn('Unauthorized access detected - clearing authentication data');
  performLogout();
};
