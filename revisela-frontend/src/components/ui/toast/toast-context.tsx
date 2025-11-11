'use client';

import React, { createContext, useContext, useState } from 'react';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  action?: React.ReactNode;
  duration?: number;
}

interface ToastContextType {
  toast: (props: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}

        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            className={cn(
              'fixed bottom-4 right-4 max-w-sm bg-white shadow-lg rounded-lg p-4 w-80 z-50 border data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full',
              {
                'border-green-600 bg-green-50': toast.type === 'success',
                'border-red-600 bg-red-50': toast.type === 'error',
                'border-yellow-600 bg-yellow-50': toast.type === 'warning',
                'border-blue-600 bg-blue-50': toast.type === 'info',
                'border-gray-200': !toast.type,
              }
            )}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
            duration={toast.duration || 5000}
          >
            <div className="flex justify-between items-start">
              <div>
                <ToastPrimitive.Title
                  className={cn('font-medium', {
                    'text-green-800': toast.type === 'success',
                    'text-red-800': toast.type === 'error',
                    'text-yellow-800': toast.type === 'warning',
                    'text-blue-800': toast.type === 'info',
                    'text-gray-900': !toast.type,
                  })}
                >
                  {toast.title}
                </ToastPrimitive.Title>
                {toast.description && (
                  <ToastPrimitive.Description
                    className={cn('text-sm mt-1', {
                      'text-green-700': toast.type === 'success',
                      'text-red-700': toast.type === 'error',
                      'text-yellow-700': toast.type === 'warning',
                      'text-blue-700': toast.type === 'info',
                      'text-gray-500': !toast.type,
                    })}
                  >
                    {toast.description}
                  </ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Close
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close"
              >
                <X size={16} />
              </ToastPrimitive.Close>
            </div>
            {toast.action && <div className="mt-2">{toast.action}</div>}
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
