import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiRequest, uploadFile } from '../api-client';
import { UPLOAD_ENDPOINTS } from '../endpoints';

// Types
interface UploadResponse {
  data: {
    url: string;
    key: string;
    filename: string;
    contentType: string;
    size: number;
  };
}

interface PresignedUrlResponse {
  url: string;
  expiresIn: number;
}

// Upload a generic image
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // Validate file type
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/jpg',
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          'Invalid file type. Supported formats: JPEG, PNG, GIF, WEBP'
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size exceeds the 5MB limit');
      }

      const response = await uploadFile<UploadResponse>(
        UPLOAD_ENDPOINTS.UPLOAD_IMAGE,
        { file }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
  });
};

// Upload a document (PDF, Word)
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Supported formats: PDF, Word');
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size exceeds the 10MB limit');
      }

      const response = await uploadFile<UploadResponse>(
        UPLOAD_ENDPOINTS.UPLOAD_DOCUMENT,
        { file, fileFieldName: 'document' }
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
  });
};

// Upload profile image
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // Validate file type
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/jpg',
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          'Invalid file type. Supported formats: JPEG, PNG, GIF, WEBP'
        );
      }

      // Validate file size (2MB max is common for profile pics)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size exceeds the 2MB limit');
      }

      const response = await uploadFile<UploadResponse>(
        UPLOAD_ENDPOINTS.UPLOAD_PROFILE_IMAGE,
        { file, fileFieldName: 'profileImage' }
      );

      if (response.error) {
        throw response.error;
      }

      // Invalidate user profile cache to reflect the new profile image
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });

      return response.data!;
    },
  });
};

// Alternative profile image upload endpoint
export const useUploadProfileImageAlt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // Validate file type
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/jpg',
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          'Invalid file type. Supported formats: JPEG, PNG, GIF, WEBP'
        );
      }

      // Validate file size (2MB max is common for profile pics)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size exceeds the 2MB limit');
      }

      const response = await uploadFile<UploadResponse>(
        UPLOAD_ENDPOINTS.UPLOAD_PROFILE_IMAGE_ALT,
        { file, fileFieldName: 'profileImage' }
      );

      if (response.error) {
        throw response.error;
      }

      // Invalidate user profile cache to reflect the new profile image
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });

      return response.data?.data;
    },
  });
};

// Upload quiz question image
export const useUploadQuizQuestionImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, quizId }: { file: File; quizId: string }) => {
      // Validate file type
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/jpg',
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          'Invalid file type. Supported formats: JPEG, PNG, GIF, WEBP'
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size exceeds the 5MB limit');
      }

      const response = await uploadFile<UploadResponse>(
        UPLOAD_ENDPOINTS.UPLOAD_QUIZ_QUESTION_IMAGE,
        {
          file,
          fileFieldName: 'questionImage',
          additionalFields: { quizId },
        }
      );

      if (response.error) {
        throw response.error;
      }

      // Invalidate quiz cache to reflect the new image
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });

      return response.data!;
    },
  });
};

// Get presigned URL for a file
export const useGetPresignedUrl = (key: string, enabled = true) => {
  return useQuery({
    queryKey: ['presignedUrl', key],
    queryFn: async () => {
      const response = await apiRequest<PresignedUrlResponse>(
        UPLOAD_ENDPOINTS.GET_PRESIGNED_URL(key)
      );

      if (response.error) {
        throw response.error;
      }

      return response.data!;
    },
    enabled: !!key && enabled, // Only run when key is available and explicitly enabled
  });
};

// Delete a file
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      const response = await apiRequest(UPLOAD_ENDPOINTS.DELETE_FILE(key));

      if (response.error) {
        throw response.error;
      }

      return key;
    },
    onSuccess: (key) => {
      // Invalidate the presigned URL query for this key
      queryClient.invalidateQueries({ queryKey: ['presignedUrl', key] });
    },
  });
};
