'use client';

import React from 'react';

import { useUpdateFolder } from '@/services/features/folders';

import { GridSkeletonLoader } from '../loaders';
import FolderItem from './FolderItem';

export interface Folder {
  _id: string;
  name: string;
  parentFolder?: string;
  isBookmarked?: boolean;
  [key: string]: any;
}

interface FolderGridProps {
  folders: Folder[];
  isLoading: boolean;
  emptyMessage?: string;
  onFolderClick?: (id: string, name: string) => void;
  onFolderDelete?: (id: string) => void;
  folderIcon?: React.ReactNode;
  className?: string;
  gridClassName?: string;
}

const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  isLoading,
  emptyMessage = 'No folders found',
  onFolderClick,
  onFolderDelete,
  folderIcon,
  className = '',
  gridClassName = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4',
}) => {
  // --- React Query mutation hook for rename ---
  const updateFolder = useUpdateFolder();

  // --- Handle rename callback passed from FolderItem ---
  const handleFolderRename = (id: string, newName: string) => {
    updateFolder.mutate(
      { id, data: { name: newName } },
      {
        onSuccess: () => {
          console.log('✅ Folder renamed:', newName);
          // Automatically invalidates and refetches via the hook’s onSuccess logic
        },
        onError: (error) => {
          console.error('❌ Failed to rename folder:', error);
        },
      }
    );
  };

  // --- Render ---
  return (
    <div className={className}>
      {isLoading ? (
        <GridSkeletonLoader
          type="folder"
          count={6}
          columns={3}
          className={gridClassName}
        />
      ) : folders && folders.length > 0 ? (
        <div className={`grid ${gridClassName}`}>
          {folders.map((folder) => {
            // console.log(
            //   `📁 Folder: ${folder} | Bookmarked: ${folder.isBookmarked}`
            // );

            return (
              <FolderItem
                key={folder._id}
                id={folder._id}
                name={folder.name}
                isBookmarked={folder.isBookmarked}
                onClick={onFolderClick}
                onDelete={onFolderDelete}
                onRename={handleFolderRename} // ✅ added this line
                customIcon={folderIcon}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">{emptyMessage}</div>
      )}
    </div>
  );
};

export default FolderGrid;
