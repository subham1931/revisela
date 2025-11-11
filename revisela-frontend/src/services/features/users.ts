import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAppSelector } from '@/store';

import { apiRequest } from '../api-client';
import { USER_ENDPOINTS } from '../endpoints';

// Add these types if not already defined
interface User {
  _id: string;
  name: string;
  username?: string;
  email: string;
  birthday?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiRequest<User[]>(USER_ENDPOINTS.GET_ALL_USERS);

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
  });
};

// Create user (admin function)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      username: string;
      email: string;
      password: string;
    }) => {
      const response = await apiRequest<User>(USER_ENDPOINTS.CREATE_USER, {
        body: data,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Get user by email
export const useUserByEmail = (email: string) => {
  return useQuery({
    queryKey: ['user', 'email', email],
    queryFn: async () => {
      const response = await apiRequest<User>(
        USER_ENDPOINTS.GET_USER_BY_EMAIL(email)
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    enabled: !!email,
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<User>;
    }) => {
      const response = await apiRequest<User>(
        USER_ENDPOINTS.UPDATE_USER(userId),
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
      queryClient.invalidateQueries({ queryKey: ['user', data._id] });
      queryClient.invalidateQueries({
        queryKey: ['user', 'email', data.email],
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest(USER_ENDPOINTS.DELETE_USER(userId));

      if (response.error) {
        throw response.error;
      }

      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Update current user's profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const { _id, ...rest } = data;
      if (!data?._id) {
        throw new Error('User ID is required to update profile');
      }

      const response = await apiRequest<User>(
        USER_ENDPOINTS.UPDATE_PROFILE(String(_id)),
        {
          body: rest,
        }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    onSuccess: ({ _id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user', String(_id)] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Delete user's own account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required to delete account');
      }

      const response = await apiRequest(USER_ENDPOINTS.DELETE_ACCOUNT(user.id));

      if (response.error) {
        throw response.error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user', 'me'] });
      queryClient.removeQueries({ queryKey: ['user', user?.id] });
    },
  });
};

//backend password validatio
// export const useDeleteAccount = () => {
//   const queryClient = useQueryClient();
//   const { user } = useAppSelector((state) => state.auth);

//   return useMutation({
//     mutationFn: async ({ password, reason }: { password: string; reason?: string }) => {
//       if (!user?.id) {
//         throw new Error('User ID is required to delete account');
//       }

//       const response = await apiRequest(USER_ENDPOINTS.DELETE_ACCOUNT(user.id), {
//         method: 'DELETE',
//         body: JSON.stringify({ password, reason }),
//       });

//       if (response.error) {
//         throw response.error;
//       }

//       return true;
//     },
//     onSuccess: () => {
//       queryClient.removeQueries({ queryKey: ['user', 'me'] });
//       queryClient.removeQueries({ queryKey: ['user', user?.id] });
//     },
//   });
// };
