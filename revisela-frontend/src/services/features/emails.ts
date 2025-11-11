import { useMutation } from '@tanstack/react-query';

import { apiRequest } from '../api-client';
import { EMAIL_ENDPOINTS } from '../endpoints';

// Types
interface EmailInvitationData {
  email: string;
  className: string;
  role: 'admin' | 'member' | 'collaborator';
  sendRegistrationLink?: boolean;
}

interface EmailNotificationData {
  email: string;
  className: string;
  event: 'added' | 'removed' | 'updated';
  role: 'admin' | 'member' | 'collaborator';
}

interface TestEmailData {
  email: string;
  subject: string;
  content: string;
}

// Send class invitation email
export const useSendClassInvitation = () => {
  return useMutation({
    mutationFn: async (data: EmailInvitationData) => {
      const response = await apiRequest(EMAIL_ENDPOINTS.SEND_INVITATION, {
        body: data,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
};

// Send class notification email
export const useSendClassNotification = () => {
  return useMutation({
    mutationFn: async (data: EmailNotificationData) => {
      const response = await apiRequest(EMAIL_ENDPOINTS.SEND_NOTIFICATION, {
        body: data,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
};

// Test email service
export const useTestEmail = () => {
  return useMutation({
    mutationFn: async (data: TestEmailData) => {
      const response = await apiRequest(EMAIL_ENDPOINTS.TEST_EMAIL, {
        body: data,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
};
