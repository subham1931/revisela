import React, { useState } from 'react';

import { useDuplicateFolder } from '@/services/features/folders';

import { Button, Input, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/toast';

interface DuplicateFolderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  originalName?: string;
  onSuccess?: () => void;
}

export const DuplicateFolderModal: React.FC<DuplicateFolderModalProps> = ({
  isOpen,
  onOpenChange,
  folderId,
  originalName = '',
  onSuccess,
}) => {
  const [name, setName] = useState(`Copy of ${originalName}`.trim());
  const { toast } = useToast();
  const duplicateFolder = useDuplicateFolder();

  const handleDuplicate = () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a name for the duplicated folder',
        type: 'error',
      });
      return;
    }

    duplicateFolder.mutate(
      { folderId, name },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Folder duplicated successfully',
            type: 'success',
          });
          handleClose();
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to duplicate folder',
            type: 'error',
          });
        },
      }
    );
  };

  const handleClose = () => {
    setName(`Copy of ${originalName}`.trim());
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Duplicate Folder"
      description="Create a copy of this folder with all its contents."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleDuplicate}
            loading={duplicateFolder.isPending}
            loadingText="Duplicating..."
            className="bg-[#0890A8] text-white hover:bg-[#06788C] disabled:bg-[#0890A8]/60"
          >
            Duplicate
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Folder Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter folder name"
          />
        </div>
      </div>
    </Modal>
  );
};
