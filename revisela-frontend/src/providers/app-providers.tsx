'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { setUnauthorizedHandler } from '@/services/api-client';

import { ToastProvider } from '@/components/ui/toast/index';

import { initAuth, logout } from '@/store/slices/authSlice';

import { performLogout } from '@/lib/auth-utils';

import { queryClient } from '@/services';
import { store, useAppDispatch } from '@/store';

function AuthInitializer() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth from localStorage
    dispatch(initAuth());

    // Set up global 401 error handler
    const handleUnauthorized = () => {
      // Use centralized logout function
      performLogout();

      // Dispatch logout to clear Redux state
      dispatch(logout());

      // Redirect to login with session expired message
      // router.push('/auth?session=expired');
    };

    setUnauthorizedHandler(handleUnauthorized);
  }, [dispatch, router]);

  return null;
}

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ToastProvider>
  );
}
