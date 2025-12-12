import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/services/query-keys';

import { apiRequest } from '../api-client';
import { QUIZ_ENDPOINTS } from '../endpoints';

/* -------------------------------------------------------------------------
   TYPES
   ------------------------------------------------------------------------- */

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  tags?: string[];
  folderId?: string;
  owner?: string;
  createdBy?: string | {
    _id: string;
    name: string;
    username?: string;
  };
  sharedWith?: string[];
  publicAccess?: string;
  isBookmarked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Inner API payload that wraps the actual array
interface QuizDataPayload {
  results: Quiz[];
  totalCount: number;
}

// Top-level API response structure — this now matches your backend
interface QuizResponse {
  data: QuizDataPayload;
  error?: any;
  status?: number;
}

/* -------------------------------------------------------------------------
   GET QUIZZES
   ------------------------------------------------------------------------- */

export const useQuizzes = (folderId?: string) => {
  return useQuery<Quiz[]>({
    queryKey: QUERY_KEYS.QUIZZES.byFolder(folderId),
    queryFn: async () => {
      const response = await apiRequest<QuizResponse>(
        folderId
          ? QUIZ_ENDPOINTS.GET_FOLDER_QUIZZES(folderId)
          : QUIZ_ENDPOINTS.GET_MY_QUIZZES
      );

      if (response.error) throw response.error;

      // ✅ Real quizzes live here: data.data.results
      // console.log(response.data?.data?.results);

      return response.data?.data?.results || [];
    },
  });
};

// Get public quizzes (for recent/public section)
export const usePublicQuizzes = (limit?: number, offset?: number) => {
  return useQuery<QuizDataPayload>({
    queryKey: [...QUERY_KEYS.QUIZZES.all, 'public', limit, offset],
    queryFn: async () => {
      const response = await apiRequest<any>(
        QUIZ_ENDPOINTS.GET_QUIZZES,
        {
          params: {
            limit: limit?.toString(),
            offset: offset?.toString(),
          },
        }
      );

      if (response.error) throw response.error;

      // Backend transform interceptor wraps response as:
      // { statusCode, timestamp, path, data: { results: Quiz[], totalCount: number } }
      // So response.data is the whole wrapper, and response.data.data is the actual payload
      const payload = response.data?.data || { results: [], totalCount: 0 };
      return payload;
    },
  });
};

// Get recent quizzes (for dashboard)
export const useRecentQuizzes = (limit?: number, offset?: number) => {
  return useQuery<QuizDataPayload>({
    queryKey: [...QUERY_KEYS.QUIZZES.all, 'recent', limit, offset],
    queryFn: async () => {
      const response = await apiRequest<any>(
        QUIZ_ENDPOINTS.GET_RECENT_QUIZZES,
        {
          params: {
            limit: limit?.toString(),
            offset: offset?.toString(),
          },
        }
      );

      if (response.error) throw response.error;

      // Backend transform interceptor wraps response as:
      // { statusCode, timestamp, path, data: { results: Quiz[], totalCount: number } }
      const payload = response.data?.data || { results: [], totalCount: 0 };
      return payload;
    },
  });
};

/* -------------------------------------------------------------------------
   GET QUIZ BY ID
   ------------------------------------------------------------------------- */

type QuizDetailResponse = {
  data: {
    data: Quiz; // most of your endpoints return data.data
  };
  error?: any;
  status?: number;
};

export const useQuiz = (quizId?: string) => {
  return useQuery<Quiz>({
    queryKey: QUERY_KEYS.QUIZZES.details(quizId ?? ''),
    enabled: !!quizId,
    queryFn: async () => {
      const response = await apiRequest<QuizDetailResponse>(
        QUIZ_ENDPOINTS.GET_QUIZ(quizId as string)
      );
      if (response.error) throw response.error;

      // Handle both shapes: { data: { data: Quiz } } or { data: Quiz }
      const payload = (response as any)?.data?.data ?? (response as any)?.data;
      return payload as Quiz;
    },
  });
};

/* -------------------------------------------------------------------------
   CREATE QUIZ
   ------------------------------------------------------------------------- */

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Quiz>) => {
      // Extract folderId from data if present
      const { folderId, ...quizData } = data;

      if (folderId) {
        const response = await apiRequest(
          QUIZ_ENDPOINTS.CREATE_QUIZ_IN_FOLDER(folderId),
          { body: quizData }
        );
        if (response.error) throw response.error;
        return response.data;
      } else {
        const response = await apiRequest(QUIZ_ENDPOINTS.CREATE_QUIZ, {
          body: quizData,
        });
        if (response.error) throw response.error;
        return response.data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.myQuizzes });
      if (variables.folderId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.QUIZZES.byFolder(variables.folderId),
        });
      }
    },
  });
};

/* -------------------------------------------------------------------------
   UPDATE QUIZ
   ------------------------------------------------------------------------- */

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      data,
    }: {
      quizId: string;
      data: Partial<Quiz>;
    }) => {
      const response = await apiRequest<{ data: Quiz }>(
        QUIZ_ENDPOINTS.UPDATE_QUIZ(quizId),
        { body: data }
      );

      if (response.error) throw response.error;
      return response.data?.data as Quiz;
    },
    onSuccess: (updatedQuiz) => {
      if (updatedQuiz && updatedQuiz._id) {
        queryClient.setQueryData(
          QUERY_KEYS.QUIZZES.details(updatedQuiz._id),
          updatedQuiz
        );
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.myQuizzes });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.QUIZZES.bookmarked,
      });
    },
  });
};

/* -------------------------------------------------------------------------
   DELETE QUIZ
   ------------------------------------------------------------------------- */

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await apiRequest(QUIZ_ENDPOINTS.DELETE_QUIZ(quizId));
      if (response.error) throw response.error;
      return quizId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.myQuizzes });
    },
  });
};

/* -------------------------------------------------------------------------
   TRASH / RESTORE / PERMANENT DELETE
   ------------------------------------------------------------------------- */

export const useTrashQuizzes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZZES.trash,
    queryFn: async () => {
      const response = await apiRequest(QUIZ_ENDPOINTS.GET_QUIZZES_TRASH);
      if (response.error) throw response.error;
      return response.data?.data || [];
    },
  });
};

// Restore quiz from trash
export const useRestoreQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await apiRequest(QUIZ_ENDPOINTS.RESTORE_QUIZ(quizId));
      if (response.error) throw response.error;
      return quizId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.trash });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.all });
    },
  });
};

export const usePermanentlyDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await apiRequest(
        QUIZ_ENDPOINTS.PERMANENTLY_DELETE_QUIZ(quizId)
      );
      if (response.error) throw response.error;
      return quizId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.trash });
    },
  });
};

/* -------------------------------------------------------------------------
   MOVE QUIZ
   ------------------------------------------------------------------------- */

export const useMoveQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      targetFolderId,
    }: {
      quizId: string;
      targetFolderId: string;
    }) => {
      const response = await apiRequest(
        QUIZ_ENDPOINTS.MOVE_QUIZ(quizId),
        { body: { targetFolderId } }
      );

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.myQuizzes });
    },
  });
};



/* -------------------------------------------------------------------------
   DUPLICATE QUIZ
   ------------------------------------------------------------------------- */

export const useDuplicateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      newTitle,
    }: {
      quizId: string;
      newTitle: string;
    }) => {
      const response = await apiRequest(QUIZ_ENDPOINTS.DUPLICATE_QUIZ(quizId), {
        body: { newTitle },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.myQuizzes });
    },
  });
};

/* -------------------------------------------------------------------------
   BOOKMARK / UNBOOKMARK QUIZ
   ------------------------------------------------------------------------- */

// export const useBookmarkQuiz = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       quizId,
//       bookmarked,
//     }: {
//       quizId: string;
//       bookmarked: boolean;
//     }) => {
//       const response = await apiRequest(QUIZ_ENDPOINTS.BOOKMARK_QUIZ(quizId), {
//         body: { bookmarked },
//       });

//       if (response.error) {
//         throw response.error;
//       }

//       return { quizId, bookmarked };
//     },
//     onSuccess: ({ quizId, bookmarked }) => {
//       // 1️⃣ Update the cache for the specific quiz
//       queryClient.setQueryData(
//         QUERY_KEYS.QUIZZES.details(quizId),
//         (oldData: any) => {
//           if (!oldData) return oldData;
//           return { ...oldData, isBookmarked: bookmarked };
//         }
//       );

//       // 2️⃣ Invalidate related queries so UI updates automatically
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.QUIZZES.bookmarked],
//       });
//       queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUIZZES.all] });
//     },
//   });
// };

export const useBookmarkQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      bookmarked,
    }: {
      quizId: string;
      bookmarked: boolean;
    }) => {
      const response = await apiRequest(QUIZ_ENDPOINTS.BOOKMARK_QUIZ(quizId), {
        body: { bookmarked },
      });

      if (response.error) {
        throw response.error;
      }

      return { quizId, bookmarked };
    },

    onSuccess: ({ quizId, bookmarked }) => {
      // 1️⃣ Update single quiz detail cache
      queryClient.setQueryData(
        QUERY_KEYS.QUIZZES.details(quizId),
        (oldData: any) =>
          oldData ? { ...oldData, isBookmarked: bookmarked } : oldData
      );

      // 2️⃣ Invalidate all quiz list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.all });        // My quizzes
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.public });     // Public quizzes
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QUIZZES.recent });     // Recent quizzes
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'folder'] });         // Folder quizzes
    },
  });
};

/* -------------------------------------------------------------------------
   BOOKMARKED QUIZZES
   ------------------------------------------------------------------------- */

interface QuizApiResponse {
  data: {
    success: boolean;
    count: number;
    data: Quiz[];
  };
}

//Get all bookmarked quiz
export const useBookmarkedQuizzes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.QUIZZES.bookmarked,
    queryFn: async () => {
      const response = await apiRequest<QuizApiResponse>(
        QUIZ_ENDPOINTS.GET_BOOKMARKED_QUIZZES
      );
      if (response.error) throw response.error;
      return response.data?.data?.data || [];
    },
  });
};

// Quiz sharing hooks
export const useShareQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      emails,
      accessLevel,
    }: {
      quizId: string;
      emails: string[];
      accessLevel: 'admin' | 'collaborator' | 'member';
    }) => {
      const response = await apiRequest(QUIZ_ENDPOINTS.SHARE_QUIZ(quizId), {
        body: { emails, accessLevel },
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

export const useUpdateQuizMemberAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      userId,
      accessLevel,
    }: {
      quizId: string;
      userId: string;
      accessLevel: 'admin' | 'collaborator' | 'member';
    }) => {
      const response = await apiRequest(
        QUIZ_ENDPOINTS.UPDATE_QUIZ_MEMBER_ACCESS(quizId, userId),
        {
          body: { accessLevel },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

export const useRemoveQuizMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      userId,
    }: {
      quizId: string;
      userId: string;
    }) => {
      const response = await apiRequest(
        QUIZ_ENDPOINTS.REMOVE_QUIZ_MEMBER(quizId, userId)
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

export const useUpdateQuizPublicAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      publicAccess,
    }: {
      quizId: string;
      publicAccess: 'restricted' | 'public';
    }) => {
      const response = await apiRequest(QUIZ_ENDPOINTS.UPDATE_QUIZ(quizId), {
        body: { publicAccess },
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

export const useGetQuizShareLink = () => {
  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await apiRequest(QUIZ_ENDPOINTS.GET_QUIZ_SHARE_LINK(quizId));

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
};