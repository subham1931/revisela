'use client';

import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | React.ReactNode;
  titleColor?: string;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  headingIcon?: React.ReactNode; // ✅ NEW
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  titleColor,
  subtitle,
  icon,
  headingIcon, // ✅ NEW
  description,
  children,
  footer,
  contentClassName,
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-overlay-gray backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 focus:outline-none z-[101] w-[90%] max-w-md animate-scaleIn',
            contentClassName
          )}
        >
          {showCloseButton && (
            <Dialog.Close asChild>
              <button
                className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer border font-bold"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          )}

          {/* ✅ Heading Icon (Top Center) */}
          {headingIcon && (
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full ">
                {headingIcon}
              </div>
            </div>
          )}

          {/* ✅ Title */}
          {title && (
            <Dialog.Title
              className={cn(
                'flex flex-col items-center justify-center mb-2 text-center',
                titleColor || 'text-secondary-black'
              )}
            >
              <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                {icon && <span className="flex items-center">{icon}</span>}
                <span>{title}</span>
              </div>
            </Dialog.Title>
          )}

          {/* ✅ Subtitle */}
          {subtitle && (
            <div className="text-md text-black mb-4 text-center">
              {subtitle}
            </div>
          )}

          {/* ✅ Description */}
          {description && (
            <Dialog.Description className="text-sm text-gray-500 mb-4 inline-block leading-normal text-center">
              {description}
            </Dialog.Description>
          )}

          {/* ✅ Main Content */}
          <div className="mb-4 flex flex-col gap-2">{children}</div>

          {/* ✅ Footer */}
          {footer && <div className="mt-4">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
