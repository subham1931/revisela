'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal, Button } from '@/components/ui';

interface ConfirmationModalProps {
  title: string;
  description?: string;
  confirmText?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmButtonClass?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  description,
  confirmText = 'Confirm',
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
  confirmButtonClass = 'bg-red-500 hover:bg-red-600 text-white',
}) => {
  return (
    <Modal
      title={title}
      icon={<Trash2 size={20} className="text-red-500" />}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={confirmButtonClass}
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
};