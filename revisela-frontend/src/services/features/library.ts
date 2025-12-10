import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { apiRequest } from '../api-client';
import { QUIZ_ENDPOINTS, SEARCH_ENDPOINTS } from '../endpoints';

interface QuizSet {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  tags?: string[];
  isPublic?: boolean;
  creator: {
    name: string;
    isCurrentUser: boolean;
    shared?: boolean;
  };
  rating?: number;
  isBookmarked: boolean;
}

interface QuizSetResponse {
  data: {
    results: QuizSet[];
    totalCount: number;
  };
}
// Fetch quiz sets, optionally by folder
export const useQuizSets = (
  folderId?: string,
  options?: Omit<
    UseQueryOptions<QuizSetResponse['data'], unknown, QuizSetResponse['data']>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<QuizSetResponse['data'], unknown>({
    queryKey: ['quizSets', folderId],
    queryFn: async () => {
      const endpoint = folderId
        ? QUIZ_ENDPOINTS.GET_FOLDER_QUIZZES(folderId)
        : QUIZ_ENDPOINTS.GET_MY_QUIZZES;

      const response = await apiRequest<QuizSetResponse>(endpoint);
      if (response.error) {
        throw response.error;
      }
      if (!response.data?.data) {
        // If data is undefined, return an empty result
        return { results: [], totalCount: 0 };
      }
      return response.data.data;
    },
    ...options,
  });
};

// Fetch user's created quizzes
export const useMyQuizzes = () => {
  return useQuery({
    queryKey: ['myQuizzes'],
    queryFn: async () => {
      const response = await apiRequest<QuizSet[]>(
        QUIZ_ENDPOINTS.GET_MY_QUIZZES
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
  });
};

// Search quizzes
export const useSearchQuizzes = (
  query: string,
  limit: number = 10,
  offset: number = 0
) => {
  return useQuery({
    queryKey: ['quizSearch', query, limit, offset],
    queryFn: async () => {
      const response = await apiRequest<{ results: QuizSet[]; totalCount: number }>(
        QUIZ_ENDPOINTS.SEARCH_QUIZZES,
        {
          params: { q: query, limit, offset },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data?.data || { results: [], totalCount: 0 };
    },
    enabled: !!query && query.length > 0,
  });
};

export interface GlobalSearchResults {
  users: { _id: string; name: string; username: string; email: string; avatar?: string; profileImage?: string }[];
  folders: { _id: string; name: string; description?: string }[];
  quizzes: QuizSet[];
  classes: { _id: string; name: string; classCode?: string; description?: string }[];
}

export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: ['globalSearch', query],
    queryFn: async () => {
      // The API returns { data: GlobalSearchResults, ... } due to TransformInterceptor
      const response = await apiRequest<{ data: GlobalSearchResults }>(
        SEARCH_ENDPOINTS.GLOBAL_SEARCH,
        {
          params: { q: query },
        }
      );

      if (response.error) {
        throw response.error;
      }

      // Check if response.data exists and then access the nested .data
      return response.data?.data || { users: [], folders: [], quizzes: [], classes: [] };
    },
    enabled: !!query && query.length > 0,
  });
};

// Get a specific quiz
export const useQuizSet = (id: string) => {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const response = await apiRequest<QuizSet>(QUIZ_ENDPOINTS.GET_QUIZ(id));

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    enabled: !!id, // Only run when id is available
  });
};

// Create a new quiz
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<QuizSet, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      const response = await apiRequest<QuizSet>(QUIZ_ENDPOINTS.CREATE_QUIZ, {
        body: data,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    onSuccess: () => {
      // Invalidate all related queries to refetch the lists
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['myQuizzes'] });
    },
  });
};

// Update a quiz
export const useUpdateQuizSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<QuizSet>;
    }) => {
      const response = await apiRequest<QuizSet>(
        QUIZ_ENDPOINTS.UPDATE_QUIZ(id),
        {
          body: data,
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific quiz and lists
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['myQuizzes'] });
    },
  });
};

// Delete a quiz
export const useDeleteQuizSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(QUIZ_ENDPOINTS.DELETE_QUIZ(id));

      if (response.error) {
        throw response.error;
      }

      return id;
    },
    onSuccess: (id) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['myQuizzes'] });
    },
  });
};
