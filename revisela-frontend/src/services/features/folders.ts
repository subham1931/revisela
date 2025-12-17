import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/services/query-keys';

import { apiRequest } from '../api-client';
import { FOLDER_ENDPOINTS } from '../endpoints';

interface SubFolder {
  _id: string;
  name: string;
  isBookmarked?: boolean;
}

interface Folder {
  _id: string;
  name: string;
  description?: string;
  parentFolder?: string;
  owner: string;
  subFolders?: SubFolder[];
  quizzes?: string[];
  sharedWith?: string[];
  publicAccess?: string;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
}

interface CreateFolderRequest {
  name: string;
  parentFolder?: string;
  description?: string;
  publicAccess?: string;
}

interface FolderResponse {
  data: Folder[];
}

// Define response interfaces for bookmarked folders
interface FolderApiResponse {
  data: {
    success: boolean;
    count: number;
    data: Folder[];
  };
}

// Fetch user's folders
export const useFolders = (parentId?: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QUERY_KEYS.FOLDERS.byParent(parentId),
    queryFn: async () => {
      const response = await apiRequest<FolderResponse>(
        FOLDER_ENDPOINTS.GET_FOLDERS,
        {
          params: parentId ? { parentId } : undefined,
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data?.data || [];
    },
  });
};

// Create a new folder
export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFolderRequest) => {
      const response = await apiRequest<FolderResponse>(
        FOLDER_ENDPOINTS.CREATE_FOLDER,
        {
          body: data,
        }
      );

      if (response.error) {
        throw response.error;
      }

      return { data: response.data?.data || [] };
    },
    onSuccess: (data: FolderResponse) => {
      // Invalidate the folders query to refetch the list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.all,
      });

      if (data?.data?.[0]?.parentFolder) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.FOLDERS.byParent(data.data[0].parentFolder),
        });
      }
    },
  });
};

// Update a folder
// Update a folder (rename or change description)
export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Pick<Folder, 'name' | 'description'>;
    }) => {
      const response = await apiRequest<{ data: Folder }>(
        FOLDER_ENDPOINTS.UPDATE_FOLDER(id),
        {
          body: data,
        }
      );

      if (response.error) {
        throw new Error(response.error.message || 'Failed to update folder');
      }

      // Expect the API to return the updated folder
      return response.data?.data;
    },
    onSuccess: (updatedFolder) => {
      console.log('✅ Folder updated', updatedFolder);

      // Update this specific folder in cache if it exists
      if (updatedFolder?._id) {
        queryClient.setQueryData(
          QUERY_KEYS.FOLDERS.details(updatedFolder._id),
          updatedFolder
        );
      }

      // Invalidate all major folder queries so UI refreshes
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOLDERS.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.bookmarked,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOLDERS.trash });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.byParent(),
      });
    },
    onError: (error) => {
      console.error('❌ Folder update failed:', error);
    },
  });
};

// Delete a folder
export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderId: string) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.DELETE_FOLDER(folderId)
      );

      if (response.error) {
        throw response.error;
      }

      return folderId;
    },
    onSuccess: (_, folderId) => {
      // Invalidate the folders query to refetch the list
      queryClient.invalidateQueries({
        queryKey: ['folders'],
      });
    },
  });
};

// Get details for a single folder
export const useFolderDetails = (folderId?: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.FOLDERS.details(folderId || ''),
    queryFn: async () => {
      if (!folderId) return null;

      const response = await apiRequest<{ data: Folder }>(
        FOLDER_ENDPOINTS.GET_FOLDER(folderId)
      );

      if (response.error) {
        throw response.error;
      }

      return response.data?.data;
    },
    enabled: enabled && !!folderId,
  });
};

// Get folders in trash
export const useTrashFolders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.FOLDERS.trash,
    queryFn: async () => {
      const response = await apiRequest<FolderResponse>(
        FOLDER_ENDPOINTS.GET_FOLDERS_TRASH
      );

      if (response.error) {
        throw response.error;
      }

      return response.data?.data || [];
    },
  });
};

// Restore folder from trash
export const useRestoreFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderId: string) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.RESTORE_FOLDER(folderId)
      );

      if (response.error) {
        throw response.error;
      }

      return folderId;
    },
    onSuccess: (folderId) => {
      // Invalidate both trash and regular folders queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.trash,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.all,
      });
    },
  });
};

// Permanently delete folder
export const usePermanentlyDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folderId: string) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.PERMANENTLY_DELETE_FOLDER(folderId)
      );

      if (response.error) {
        throw response.error;
      }

      return folderId;
    },
    onSuccess: (folderId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.trash,
      });
    },
  });
};

// Move folder to a target folder
export const useMoveFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      targetFolderId,
    }: {
      folderId: string;
      targetFolderId: string;
    }) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.MOVE_FOLDER(folderId),
        {
          body: { targetFolderId },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return { folderId, targetFolderId };
    },
    onSuccess: ({ folderId, targetFolderId }) => {
      // Invalidate both the source and target folder queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.details(folderId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.details(targetFolderId),
      });
      // Invalidate all folders to refresh the list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.all,
      });
    },
  });
};

// export const useMoveFolder = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       folderId,
//       targetFolderId,
//     }: {
//       folderId: string;
//       targetFolderId: string | null; // <-- FIX
//     }) => {
//       const response = await apiRequest(
//         FOLDER_ENDPOINTS.MOVE_FOLDER(folderId),
//         {
//           body: { targetFolderId },
//         }
//       );

//       if (response.error) {
//         throw response.error;
//       }

//       return { folderId, targetFolderId };
//     },

//     onSuccess: ({ folderId, targetFolderId }) => {
//       // Current folder details
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEYS.FOLDERS.details(folderId),
//       });

//       // Only invalidate destination folder if not root
//       if (targetFolderId) {
//         queryClient.invalidateQueries({
//           queryKey: QUERY_KEYS.FOLDERS.details(targetFolderId),
//         });
//       }

//       // Always refresh root list
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEYS.FOLDERS.all,
//       });
//     },
//   });
// };

// Duplicate a folder
export const useDuplicateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      name,
    }: {
      folderId: string;
      name: string;
    }) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.DUPLICATE_FOLDER(folderId),
        {
          body: { name },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate folders query to refresh the list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.all,
      });
    },
  });
};

// Get bookmarked folders
export const useBookmarkedFolders = () => {
  return useQuery({
    queryKey: QUERY_KEYS.FOLDERS.bookmarked,
    queryFn: async () => {
      const response = await apiRequest<FolderApiResponse>(
        FOLDER_ENDPOINTS.GET_BOOKMARKED_FOLDERS
      );

      if (response.error) {
        throw response.error;
      }

      return response.data?.data?.data || [];
    },
  });
};

// Bookmark/unbookmark folder
export const useBookmarkFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      bookmarked,
    }: {
      folderId: string;
      bookmarked: boolean;
    }) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.BOOKMARK_FOLDER(folderId),
        {
          body: { bookmarked },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return { folderId, bookmarked };
    },
    onSuccess: ({ folderId, bookmarked }) => {
      // Update the specific folder data in the cache
      queryClient.setQueryData(
        QUERY_KEYS.FOLDERS.details(folderId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return { ...oldData, isBookmarked: bookmarked };
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.bookmarked,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOLDERS.all });

      // Invalidate parent folder queries to update UI state
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.byParent(),
      });

      // Invalidate shared content queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SHARED.all });
    },
  });
};

// Folder sharing hooks
export const useShareFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      emails,
      accessLevel,
    }: {
      folderId: string;
      emails: string[];
      accessLevel: 'admin' | 'collaborator' | 'member';
    }) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.SHARE_FOLDER(folderId),
        {
          body: { emails, accessLevel },
        }
      );

      if (response.error) {
        console.error('Share Folder Error:', response.error);
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { folderId }) => {
      console.log('Share Folder Success');
      queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useUpdateFolderMemberAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      userId,
      accessLevel,
    }: {
      folderId: string;
      userId: string;
      accessLevel: 'admin' | 'collaborator' | 'member';
    }) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.UPDATE_FOLDER_MEMBER_ACCESS(folderId, userId),
        {
          body: { accessLevel },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useRemoveFolderMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      userId,
    }: {
      folderId: string;
      userId: string;
    }) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.REMOVE_FOLDER_MEMBER(folderId, userId)
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useUpdateFolderPublicAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      publicAccess,
    }: {
      folderId: string;
      publicAccess: 'restricted' | 'public';
    }) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.UPDATE_FOLDER(folderId),
        {
          body: { publicAccess },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};

export const useGetFolderShareLink = () => {
  return useMutation({
    mutationFn: async (folderId: string) => {
      const response = await apiRequest(
        FOLDER_ENDPOINTS.GET_FOLDER_SHARE_LINK(folderId)
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
};
