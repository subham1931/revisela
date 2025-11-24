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
  allowCreateFolder?: boolean;
  onFolderClick?: (id: string, name: string) => void;
  // renderContent now optionally receives options object from FolderExplorer
  renderContent?: (
    currentFolderId: string | undefined,
    options?: RenderContentOptions
  ) => React.ReactNode;
  className?: string;
}

const FolderExplorer: React.FC<FolderExplorerProps> = ({
  title = 'Folders',
  allowCreateFolder = true,
  onFolderClick,
  renderContent,
  className = '',
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
    navigateToFolder(folderId, folderName);
    onFolderClick?.(folderId, folderName);
  };

  const formattedBreadcrumbs = breadcrumbs.map((item, index) => ({
    label: item.name,
    isCurrent: index === breadcrumbs.length - 1,
    onClick: () => navigateToFolder(item.id || undefined, item.name),
  }));

  // Decide which folder list to show (root shows top-level folders)
  const displayFolders = currentFolderId ? subFolders : folders;
  const isLoadingFolders = currentFolderId ? folderDetailsLoading : isLoading;

  // If there are folders inside the current folder -> we likely want to show folders and (optionally) suppress quizzes.
  const hasSubFolders = displayFolders && displayFolders.length > 0;

  // We will pass suppressQuizzes to renderContent so the content renderer can avoid showing quizzes when subfolders exist.
  const renderOptions = { suppressQuizzes: hasSubFolders };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        <Breadcrumb items={formattedBreadcrumbs} />
      </div>

      {currentFolder?.description && (
        <p className="text-gray-500 mt-1 mb-4">{currentFolder.description}</p>
      )}

      {/* Only render folder grid when folders exist */}
      {displayFolders.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#444444] mb-4">{title}</h2>
          <FolderGrid
            folders={displayFolders}
            isLoading={isLoadingFolders}
            onFolderClick={handleFolderClick}
            emptyMessage={
              currentFolderId ? 'This folder is empty' : "You don't have any folders yet"
            }
          />
        </section>
      )}

      {/* Render content, but inform it whether we have subfolders (suppressQuizzes) */}
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
