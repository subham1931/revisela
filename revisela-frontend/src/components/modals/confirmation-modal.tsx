import React from 'react';
import { Button, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** optional icon to show next to the title */
  icon?: React.ReactNode;
  /** optional subheading below the title */
  subHeading?: string | React.ReactNode;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  loadingText?: string;
  loadingAnimation?: 'spin' | 'pulse' | 'dots' | 'bars' | 'ripple';
  /** center the description text */
  centerDescription?: boolean;
  /** 🆕 configurable title color (Tailwind class or hex) */
  titleColor?: string;
  children?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  icon,
  subHeading,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-[#0890A8] hover:bg-[#0890A8]/80 text-white',
  onConfirm,
  isLoading = false,
  loadingText = 'Processing...',
  loadingAnimation = 'spin',
  centerDescription = false,
  titleColor = 'text-[#0890A8]', // 🆕 default teal
  children,
}) => {
  const handleConfirm = () => onConfirm();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={
        <div
          className={cn(
            'flex items-center justify-center gap-2 text-lg font-semibold',
            titleColor // dynamic color class or inline tailwind color
          )}
        >
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </div>
      }
      footer={
        <div className="flex justify-around gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="solid"
            className={confirmButtonClass}
            onClick={handleConfirm}
            loading={isLoading}
            loadingText={loadingText}
            loadingAnimation={loadingAnimation}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      {/* optional subheading */}
      {subHeading && (
        <h3 className="text-md font-bold text-gray-600 mb-2 text-center">
          {subHeading}
        </h3>
      )}

      {/* description with optional center alignment */}
      <p
        className={cn(
          'text-gray-600 mb-4',
          centerDescription && 'text-center'
        )}
      >
        {description}
      </p>

      {children}
    </Modal>
  );
};

export default ConfirmationModal;