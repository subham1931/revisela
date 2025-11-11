'use client';

import React, { useState } from 'react';

import { Trash2 } from 'lucide-react';

import { Button, Input, Modal } from '@/components/ui';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<any>;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onOpenChange,
  onDelete,
}) => {
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!password) {
      setError('Please enter your password to confirm deletion');
      return;
    }

    try {
      setError('');
      setIsDeleting(true);
      // In a real implementation, we would pass the password to verify
      // For now, we'll just call the delete function
      await onDelete();
      handleClose();
    } catch (error: any) {
      setError(error.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setPassword('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Delete Account"
      titleColor="text-red-600"
      icon={<Trash2 className="text-red-500" size={24} />}
      contentClassName="max-w-md"
      showCloseButton={false}
    >
      <div className="flex flex-col gap-5">
        {/* <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
          <Trash2 className="text-red-500" size={24} />
        </div> */}
        {/* <p className="text-center text-secondary-black font-medium">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p> */}


        <Input
          label="Reason for Deletion*"
          placeholder="Please tell us why you are leaving"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <Input
          label="Re-enter your password"
          type="password"
          placeholder="Enter your password to confirm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1 border-none text-secondary-black hover:text-[#0890A8]"
            onClick={handleClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 border border-[#E70000] text- "
            onClick={handleDelete}
            type="button"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
