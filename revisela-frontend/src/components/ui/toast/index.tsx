// Re-export a toast function for easier access
import { useToast as useToastHook } from './toast-context';

export { ToastProvider, useToast } from './toast-context';

// This is your global toast function - ensure it's only called in client components
export const toast = {
  success: (props: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    duration?: number;
  }) => {
    // This will be replaced at runtime when the hook is used
    console.error(
      "toast.success called outside of component - make sure you're using this in a client component"
    );
  },
  error: (props: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    duration?: number;
  }) => {
    console.error(
      "toast.error called outside of component - make sure you're using this in a client component"
    );
  },
  warning: (props: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    duration?: number;
  }) => {
    console.error(
      "toast.warning called outside of component - make sure you're using this in a client component"
    );
  },
  info: (props: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    duration?: number;
  }) => {
    console.error(
      "toast.info called outside of component - make sure you're using this in a client component"
    );
  },
  // Generic method that accepts type
  show: (props: {
    title: string;
    description?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    action?: React.ReactNode;
    duration?: number;
  }) => {
    console.error(
      "toast.show called outside of component - make sure you're using this in a client component"
    );
  },
};

// Create a hook to use the toast functionality in components
export function useToastFunction() {
  const { toast: showToast } = useToastHook();

  return {
    toast: {
      success: (props: {
        title: string;
        description?: string;
        action?: React.ReactNode;
        duration?: number;
      }) => {
        showToast({ ...props, type: 'success' });
      },
      error: (props: {
        title: string;
        description?: string;
        action?: React.ReactNode;
        duration?: number;
      }) => {
        showToast({ ...props, type: 'error' });
      },
      warning: (props: {
        title: string;
        description?: string;
        action?: React.ReactNode;
        duration?: number;
      }) => {
        showToast({ ...props, type: 'warning' });
      },
      info: (props: {
        title: string;
        description?: string;
        action?: React.ReactNode;
        duration?: number;
      }) => {
        showToast({ ...props, type: 'info' });
      },
      show: (props: {
        title: string;
        description?: string;
        type?: 'success' | 'error' | 'warning' | 'info';
        action?: React.ReactNode;
        duration?: number;
      }) => {
        showToast(props);
      },
    },
  };
}
