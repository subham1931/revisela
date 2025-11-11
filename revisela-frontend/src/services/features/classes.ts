import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiRequest } from '../api-client';
import { CLASS_ENDPOINTS } from '../endpoints';

// Types based on the Postman collection
interface ClassMember {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    username?: string;
  };
  accessLevel: 'owner' | 'admin' | 'collaborator' | 'member';
  joinedAt: string;
}

interface Class {
  _id: string;
  name: string;
  orgName: string;
  description: string;
  classCode: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    username?: string;
  };
  members: ClassMember[];
  quizzes: any[];
  folders: any[];
  publicAccess: 'restricted' | 'edit' | 'view_only' | 'none';
  isActive: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  userAccessLevel: 'owner' | 'admin' | 'collaborator' | 'member';
  memberCount: number;
}

interface ClassInvitation {
  _id: string;
  classId: string;
  class?: Class;
  role: 'admin' | 'member' | 'collaborator';
  invitedAt: string;
}

// Create class
export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      orgName: string;
      publicAccess?: 'restricted' | 'edit' | 'view_only' | 'none';
    }) => {
      const response = await apiRequest<Class>(CLASS_ENDPOINTS.CREATE_CLASS, {
        body: data,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Get all classes the current user is a member of
export const useMyClasses = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['my-classes'],
    queryFn: async () => {
      const response = await apiRequest<{ data: Class[] }>(
        CLASS_ENDPOINTS.GET_MY_CLASSES
      );

      if (response.error) {
        throw response.error;
      }

      return response.data?.data;
    },
    enabled: options?.enabled !== false, // Default to true unless explicitly set to false
  });
};

// Get class by ID
// export const useClass = (classId: string) => {
//   return useQuery({
//     queryKey: ['class', classId],
//     queryFn: async () => {
//       const response = await apiRequest<Class>(
//         CLASS_ENDPOINTS.GET_CLASS(classId)
//       );

//       if (response.error) {
//         throw response.error;
//       }

//       return response.data!;
//     },
//     enabled: !!classId,
//   });
// };

export const useClass = (classId: string) => {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      // Tell TypeScript the API response has a `data` field containing Class
      const response = await apiRequest<{ data: Class }>(
        CLASS_ENDPOINTS.GET_CLASS(classId)
      );

      if (response.error) throw response.error;

      // Extract the inner `data` object
      return response.data!.data;
    },
    enabled: !!classId,
  });
};

// Update class
export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      data,
    }: {
      classId: string;
      data: {
        name?: string;
        description?: string;
        publicAccess?: 'restricted' | 'edit' | 'view_only' | 'none';
      };
    }) => {
      const response = await apiRequest<Class>(
        CLASS_ENDPOINTS.UPDATE_CLASS(classId),
        {
          body: data,
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['class', data._id] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Delete class
export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: string) => {
      const response = await apiRequest(CLASS_ENDPOINTS.DELETE_CLASS(classId));

      if (response.error) {
        throw response.error;
      }

      return classId;
    },
    onSuccess: (classId) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Join class with class code
export const useJoinClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classCode: string) => {
      const response = await apiRequest<Class>(CLASS_ENDPOINTS.JOIN_CLASS, {
        body: { classCode },
      });

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Leave class
export const useLeaveClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: string) => {
      const response = await apiRequest(CLASS_ENDPOINTS.LEAVE_CLASS(classId));

      if (response.error) {
        throw response.error;
      }

      return classId;
    },
    onSuccess: (classId) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Add members to class
export const useAddClassMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      data,
    }: {
      classId: string;
      data: {
        emails: string[];
        accessLevel: 'admin' | 'collaborator' | 'member';
      };
    }) => {
      const response = await apiRequest(CLASS_ENDPOINTS.ADD_MEMBERS(classId), {
        body: data,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Update member access level
export const useUpdateMemberAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      userId,
      accessLevel,
    }: {
      classId: string;
      userId: string;
      accessLevel: 'admin' | 'collaborator' | 'member';
    }) => {
      const response = await apiRequest(
        CLASS_ENDPOINTS.UPDATE_MEMBER_ACCESS(classId, userId),
        {
          body: { accessLevel },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });
};

// Remove member from class
export const useRemoveClassMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      userId,
    }: {
      classId: string;
      userId: string;
    }) => {
      const endpoint = CLASS_ENDPOINTS.REMOVE_MEMBER(classId, userId);

      const response = await apiRequest(endpoint, { body: undefined });

      if (response.error) {
        throw response.error;
      }

      return { classId, userId };
    },
    onSuccess: ({ classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });
};

// Update class public access
export const useUpdateClassPublicAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      publicAccess,
    }: {
      classId: string;
      publicAccess: 'restricted' | 'edit' | 'view_only' | 'none';
    }) => {
      const response = await apiRequest(
        CLASS_ENDPOINTS.UPDATE_CLASS(classId),
        {
          body: { publicAccess },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Archive class
export const useArchiveClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: string) => {
      const response = await apiRequest(CLASS_ENDPOINTS.ARCHIVE_CLASS(classId));

      if (response.error) {
        throw response.error;
      }

      return classId;
    },
    onSuccess: (classId) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Restore class
export const useRestoreClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: string) => {
      const response = await apiRequest(CLASS_ENDPOINTS.RESTORE_CLASS(classId));

      if (response.error) {
        throw response.error;
      }

      return classId;
    },
    onSuccess: (classId) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

// Add quiz to class
export const useAddQuizToClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      quizId,
    }: {
      classId: string;
      quizId: string;
    }) => {
      const response = await apiRequest(
        CLASS_ENDPOINTS.ADD_QUIZ_TO_CLASS(classId),
        {
          body: { quizId },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return { classId, quizId };
    },
    onSuccess: ({ classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });
};

// Remove quiz from class
export const useRemoveQuizFromClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      quizId,
    }: {
      classId: string;
      quizId: string;
    }) => {
      const response = await apiRequest(
        CLASS_ENDPOINTS.REMOVE_QUIZ_FROM_CLASS(classId, quizId)
      );

      if (response.error) {
        throw response.error;
      }

      return { classId, quizId };
    },
    onSuccess: ({ classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });
};

// Get class quizzes
export const useClassQuizzes = (classId: string) => {
  return useQuery({
    queryKey: ['class', classId, 'quizzes'],
    queryFn: async () => {
      const response = await apiRequest(
        CLASS_ENDPOINTS.GET_CLASS_QUIZZES(classId)
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    enabled: !!classId,
  });
};

// Add folder to class
export const useAddFolderToClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      folderId,
    }: {
      classId: string;
      folderId: string;
    }) => {
      const response = await apiRequest(
        CLASS_ENDPOINTS.ADD_FOLDER_TO_CLASS(classId),
        {
          body: { folderId },
        }
      );

      if (response.error) {
        throw response.error;
      }

      return { classId, folderId };
    },
    onSuccess: ({ classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });
};

// Remove folder from class
export const useRemoveFolderFromClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      folderId,
    }: {
      classId: string;
      folderId: string;
    }) => {
      const response = await apiRequest(
        CLASS_ENDPOINTS.REMOVE_FOLDER_FROM_CLASS(classId, folderId)
      );

      if (response.error) {
        throw response.error;
      }

      return { classId, folderId };
    },
    onSuccess: ({ classId }) => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });
};

// Legacy hooks for backward compatibility
export const useAddClassMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      data,
    }: {
      classId: string;
      data: { email: string; role: 'admin' | 'member' | 'collaborator' };
    }) => {
      const response = await apiRequest<ClassMember>(
        CLASS_ENDPOINTS.ADD_MEMBER(classId),
        {
          body: data,
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({
        queryKey: ['class', classId, 'members'],
      });
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });
};

export const useClassMembers = (classId: string) => {
  return useQuery({
    queryKey: ['class', classId, 'members'],
    queryFn: async () => {
      const response = await apiRequest<ClassMember[]>(
        CLASS_ENDPOINTS.GET_MEMBERS(classId)
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    enabled: !!classId,
  });
};

export const useAcceptClassInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: string) => {
      const response = await apiRequest(
        CLASS_ENDPOINTS.ACCEPT_INVITATION(classId)
      );

      if (response.error) {
        throw response.error;
      }

      return classId;
    },
    onSuccess: (classId) => {
      queryClient.invalidateQueries({ queryKey: ['class-invitations'] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });
};

export const usePendingInvitations = () => {
  return useQuery({
    queryKey: ['class-invitations'],
    queryFn: async () => {
      const response = await apiRequest<ClassInvitation[]>(
        CLASS_ENDPOINTS.GET_PENDING_INVITATIONS
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
  });
};