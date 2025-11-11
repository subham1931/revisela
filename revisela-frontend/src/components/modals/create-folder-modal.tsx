import React, { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useCreateFolder } from '@/services/features/folders';
import { QUERY_KEYS } from '@/services/query-keys';

import { Button, Dropdown, Input, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/toast/index';

interface CreateFolderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string;
  onSuccess?: () => void;
}

const accessOptions = [
  { label: 'Private', value: 'none' },
  { label: 'View Only', value: 'view_only' },
  { label: 'Can Edit', value: 'edit' },
];

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onOpenChange,
  parentId,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [publicAccess, setPublicAccess] = useState('none');
  const [accessLabel, setAccessLabel] = useState('Private');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createFolder, isPending } = useCreateFolder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Folder name is required',
        type: 'error',
      });
      return;
    }

    createFolder(
      {
        name,
        description,
        parentFolder: parentId,
        publicAccess,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.FOLDERS.all,
          });

          if (parentId) {
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.FOLDERS.details(parentId),
            });
          }

          toast({
            title: 'Success',
            description: 'Folder created successfully',
            type: 'success',
          });
          handleClose();
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to create folder',
            type: 'error',
          });
        },
      }
    );
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setPublicAccess('none');
    setAccessLabel('Private');
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create New Folder"
      description="Create a new folder to organize your quiz sets"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Folder Name"
          placeholder="Enter folder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Description (Optional)"
          placeholder="Enter folder description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-black">
            Public Access
          </label>
          <Dropdown
            trigger={
              <Button
                variant="outline"
                className="w-full justify-between border-[#ACACAC] text-secondary-black bg-white"
              >
                {accessLabel}
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
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>
            }
            items={accessOptions.map((option) => ({
              label: option.label,
              onClick: () => {
                setPublicAccess(option.value);
                setAccessLabel(option.label);
              },
              className:
                publicAccess === option.value
                  ? 'text-[#0890A8] font-medium'
                  : '',
            }))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-[#ACACAC] text-secondary-black"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#0890A8] text-white"
            disabled={isPending || !name.trim()}
          >
            {isPending ? 'Creating...' : 'Create Folder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFolderModal;
