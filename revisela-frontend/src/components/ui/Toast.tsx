'use client';

import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  action?: ReactNode;
  duration?: number; // Duration in ms, Infinity for no auto-dismiss
}

export const Toast = ({
  open,
  onOpenChange,
  title,
  description,
  action,
  duration = 5000,
}: ToastProps) => {
  useEffect(() => {
    if (open && duration !== Infinity) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onOpenChange]);

  if (!open) return null;

  // Use createPortal to render at the root level
  return createPortal(
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-80 z-50 border border-gray-200 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>,
    document.body
  );
};
