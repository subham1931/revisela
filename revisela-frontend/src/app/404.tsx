'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/store';

interface ErrorProps {
  error?: Error;
  reset?: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Set up redirection timer
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }, 5000);

    // Countdown logic
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [router, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-600">
            Oops! Something went wrong
          </h1>
          <p className="mt-2 text-gray-600">
            {error?.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="mt-6">
          {reset && (
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
            >
              Try again
            </button>
          )}
          <p className="mt-4 text-sm text-gray-500">
            Redirecting you in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
