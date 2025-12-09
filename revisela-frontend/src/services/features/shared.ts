import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/services/query-keys';

import { apiRequest } from '../api-client';
import { SHARED_ENDPOINTS } from '../endpoints';

// Types based on the API response structure
interface SharedOwner {
  _id: string;
  name: string;
  username?: string;
  email: string;
}

interface SharedFolder {
  _id: string;
  name: string;
  description?: string;
  parentFolder?: string;
  owner: SharedOwner;
  subFolders?: string[];
  quizzes?: SharedQuiz[];
  userAccessLevel: 'member' | 'collaborator' | 'admin';
  isBookmarked: boolean;
  type: 'folder';
  publicAccess?: string;
  isInTrash?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface SharedVia {
  folderId: string;
  folderName: string;
  accessLevel: 'member' | 'collaborator' | 'admin';
}

interface SharedQuiz {
  _id: string;
  title: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  createdBy: SharedOwner;
  isBookmarked: boolean;
  type: 'quiz';
  sharedVia?: SharedVia;
  isInTrash?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface SharedContentResponse {
  success: boolean;
  data: {
    folders: SharedFolder[];
    quizzes: SharedQuiz[];
    totalCount: {
      folders: number;
      quizzes: number;
      total: number;
    };
  };
  message: string;
}

interface SharedFoldersResponse {
  success: boolean;
  data: SharedFolder[];
  count: number;
  message: string;
}

interface SharedQuizzesResponse {
  success: boolean;
  data: SharedQuiz[];
  count: number;
  message: string;
}

// Hook to get all shared content (folders and quizzes)
export const useSharedContent = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SHARED.all,
    queryFn: async () => {
      const response = await apiRequest<SharedContentResponse>(
        SHARED_ENDPOINTS.GET_ALL_SHARED
      );

      if (response.error) {
        throw response.error;
      }

      const sharedData = (response.data?.data as any)?.data as
        | SharedContentResponse['data']
        | undefined;

      if (sharedData && typeof sharedData === 'object') {
        return sharedData;
      }

      return {
        folders: [],
        quizzes: [],
        totalCount: { folders: 0, quizzes: 0, total: 0 },
      };
    },
  });
};

// Hook to get only shared folders
export const useSharedFolders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SHARED.folders,
    queryFn: async () => {
      const response = await apiRequest<SharedFoldersResponse>(
        SHARED_ENDPOINTS.GET_SHARED_FOLDERS
      );

      if (response.error) {
        throw response.error;
      }

      return response.data?.data || [];
    },
  });
};

// Hook to get only shared quizzes
export const useSharedQuizzes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SHARED.quizzes,
    queryFn: async () => {
      const response = await apiRequest<SharedQuizzesResponse>(
        SHARED_ENDPOINTS.GET_SHARED_QUIZZES
      );

      if (response.error) {
        throw response.error;
      }

      // Backend transform interceptor wraps response as:
      // { statusCode, timestamp, path, data: { success: true, data: SharedQuiz[], count, message } }
      // So response.data is the wrapper, response.data.data is the backend response object,
      // and response.data.data.data is the actual quizzes array
      const quizzesArray = (response.data?.data as any)?.data;
      return Array.isArray(quizzesArray) ? (quizzesArray as SharedQuiz[]) : [];
    },
  });
};

// Export types for use in components
export type {
  SharedFolder,
  SharedQuiz,
  SharedOwner,
  SharedVia,
  SharedContentResponse,
  SharedFoldersResponse,
  SharedQuizzesResponse,
};
