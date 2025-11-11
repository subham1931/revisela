import React, { useState } from 'react';
import { ChevronLeft, Folder, Plus } from 'lucide-react';
import { CreateFolderModal } from '@/components/modals';
import { Button } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { FolderGrid } from '.';
import { useFolderSystem } from './FolderContext';

interface FolderExplorerProps {
  title?: string;
  allowCreateFolder?: boolean;
  onFolderClick?: (id: string, name: string) => void;
  renderContent?: (currentFolderId: string | undefined) => React.ReactNode;
  className?: string;
}

const FolderExplorer: React.FC<FolderExplorerProps> = ({
  title = 'Folders',
  allowCreateFolder = true,
  onFolderClick,
  renderContent,
  className = '',
}) => {
  const { currentFolderId, subFolders, folders, currentFolder, isLoading, folderDetailsLoading, breadcrumbs, navigateToFolder, navigateUp } = useFolderSystem();

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const handleFolderClick = (folderId: string, folderName: string) => {
    navigateToFolder(folderId, folderName);
    onFolderClick?.(folderId, folderName);
  };

  const formattedBreadcrumbs = breadcrumbs.map((item, index) => ({
    label: item.name,
    icon: undefined,
    isCurrent: index === breadcrumbs.length - 1,
    onClick: () => navigateToFolder(item.id || undefined, item.name),
  }));

  const displayFolders = currentFolderId ? subFolders : folders;
  const isLoadingFolders = currentFolderId ? folderDetailsLoading : isLoading;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          {/* {currentFolderId && (
            <Button variant="outline" onClick={navigateUp} className="flex items-center gap-1 text-gray-600 hover:text-[#0890A8]">
              <ChevronLeft size={16} /> Back
            </Button>
          )} */}
          <Breadcrumb items={formattedBreadcrumbs} />
        </div>
      </div>

      {currentFolder && (
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#444444]">{currentFolder.name}</h1>
          {currentFolder.description && <p className="text-gray-500 mt-1">{currentFolder.description}</p>}
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-medium text-[#444444] mb-4">{title}</h2>
        <FolderGrid
          folders={displayFolders}
          isLoading={isLoadingFolders}
          onFolderClick={handleFolderClick}
          emptyMessage={currentFolderId ? 'This folder is empty' : "You don't have any folders yet"}
        />
      </section>

      {currentFolderId ? <div>{renderContent && renderContent(currentFolderId)}</div> : renderContent && renderContent(undefined)}

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
