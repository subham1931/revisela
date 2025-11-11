import { QueryClient } from '@tanstack/react-query';

// Create a client with default settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Export endpoints and API client
export * from './endpoints';
export * from './api-client';

// Export all feature services
export * from './features/auth';
export * from './features/users';
export * from './features/folders';
export * from './features/quizzes';
export * from './features/classes';
export * from './features/emails';
export * from './features/uploads';
export * from './features/library';
export * from './features/shared';
