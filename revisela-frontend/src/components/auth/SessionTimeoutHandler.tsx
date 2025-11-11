'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Toast } from '@/components/ui';

import { logout } from '@/store/slices/authSlice';

import { isTokenExpired, performLogout } from '@/lib/auth-utils';

import { useAppDispatch, useAppSelector } from '@/store';

// Helper function to decode JWT and get expiration time
const getTokenExpiration = (token: string): number | null => {
  try {
    // JWT payload is in the format header.payload.signature
    const payload = token.split('.')[1];
    // Decode the base64 string
    const decodedPayload = JSON.parse(atob(payload));
    // Return the expiration time in milliseconds
    return decodedPayload.exp * 1000;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Time before expiration to show the warning (5 minutes)
const WARNING_TIME = 5 * 60 * 1000;
// Interval to check token expiration (every minute)
const CHECK_INTERVAL = 60 * 1000;

export const SessionTimeoutHandler = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSessionTimeout = useCallback(() => {
    // Clear warning
    setShowWarning(false);

    // Use centralized logout function
    performLogout();

    // Dispatch logout action
    dispatch(logout());

    // Redirect to login
    router.push('/auth/login?session=expired');
  }, [dispatch, router]);

  const checkTokenExpiration = useCallback(() => {
    if (!token) return;

    // Use centralized token validation
    if (isTokenExpired()) {
      handleSessionTimeout();
      return;
    }

    const expirationTime = getTokenExpiration(token);
    if (!expirationTime) return;

    const now = Date.now();
    const timeToExpiration = expirationTime - now;

    // Update time remaining for display
    setTimeRemaining(Math.max(0, timeToExpiration));

    // Show warning when approaching expiration
    if (timeToExpiration > 0 && timeToExpiration < WARNING_TIME) {
      setShowWarning(true);
    } else if (timeToExpiration <= 0) {
      // Token has expired, log out
      handleSessionTimeout();
    }
  }, [token, handleSessionTimeout]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // First check when component mounts
    checkTokenExpiration();

    // Set up interval to check token expiration
    const intervalId = setInterval(checkTokenExpiration, CHECK_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [token, isAuthenticated, checkTokenExpiration]);

  // Format remaining time into minutes
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return '';
    const minutes = Math.floor(timeRemaining / (60 * 1000));
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <>
      {showWarning && (
        <Toast
          open={showWarning}
          onOpenChange={setShowWarning}
          title="Session Expiring Soon"
          description={`Your session will expire in ${formatTimeRemaining()}. You will be logged out automatically.`}
          action={
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSessionTimeout}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm"
              >
                Logout Now
              </button>
            </div>
          }
          duration={Infinity} // Don't auto-dismiss
        />
      )}
    </>
  );
};
