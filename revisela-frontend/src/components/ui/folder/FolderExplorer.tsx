'use client';

import React, { useState } from 'react';

import { CreateFolderModal } from '@/components/modals';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { FolderGrid } from '.';
import { useFolderSystem } from './FolderContext';

interface RenderContentOptions {
  suppressQuizzes?: boolean;
}

interface FolderExplorerProps {
  title?: string;
  renderContent?: (currentFolderId?: string, options?: RenderContentOptions) => React.ReactNode;
  isClass?: boolean;
}

const FolderExplorer: React.FC<FolderExplorerProps> = ({
  title = 'Folders',
  renderContent,
  isClass = false,
}) => {
  const {
    currentFolderId,
    subFolders,
    folders,
    currentFolder,
    isLoading,
    folderDetailsLoading,
    breadcrumbs,
    navigateToFolder,
  } = useFolderSystem();

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const handleFolderClick = (folderId: string, folderName: string) => {
    const safeId = folderId && folderId.trim() !== '' ? folderId : undefined;
    navigateToFolder(safeId, folderName);
  };

  const formattedBreadcrumbs = breadcrumbs.map((item, i) => ({
    label: item.name,
    isCurrent: i === breadcrumbs.length - 1,
    onClick: () => navigateToFolder(item.id, item.name),
  }));

  const displayFolders = currentFolderId !== undefined ? subFolders : folders;
  const isLoadingFolders = currentFolderId !== undefined ? folderDetailsLoading : isLoading;

  const hasSubFolders = displayFolders?.length > 0;
  const renderOptions = { suppressQuizzes: hasSubFolders };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <Breadcrumb items={formattedBreadcrumbs} />
      </div>

      {displayFolders.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#444444] mb-4">{title}</h2>
          <FolderGrid
            folders={displayFolders}
            isLoading={isLoadingFolders}
            onFolderClick={handleFolderClick}
            emptyMessage={
              currentFolderId !== undefined ? 'This folder is empty' : "You don't have any folders yet"
            }
            isClass={isClass}
          />
        </section>
      )}

      {renderContent?.(currentFolderId, renderOptions)}

      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onOpenChange={setIsFolderModalOpen}
        parentId={currentFolderId}
        onSuccess={() => setIsFolderModalOpen(false)}
      />
    </div>
  );
};

export default FolderExplorer;
