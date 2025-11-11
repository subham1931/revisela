'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Folder, FolderSymlink, Home, Loader2 } from 'lucide-react';

import { useMoveFolder } from '@/services/features/folders';
import { QUERY_KEYS } from '@/services/query-keys';

import { Button, Modal } from '@/components/ui';
import { FolderProvider, useFolderSystem } from '@/components/ui/folder';
import { useToast } from '@/components/ui/toast';

/* --------------------------------------------------------------------------
   FILTERED FOLDER EXPLORER
   -------------------------------------------------------------------------- */
const FilteredFolderExplorer = ({
  folderId,
  onFolderClick,
  className,
}: {
  folderId: string;
  onFolderClick: (id: string, name: string) => void;
  className?: string;
}) => {
  const {
    currentFolderId,
    folders,
    subFolders,
    isLoading,
    folderDetailsLoading,
    breadcrumbs,
    navigateToFolder,
    navigateUp,
  } = useFolderSystem();

  const handleFolderClick = useCallback(
    (id: string, name: string) => {
      if (id === folderId) return;
      onFolderClick(id, name);
      navigateToFolder(id, name);
    },
    [folderId, navigateToFolder, onFolderClick]
  );

  const filteredFolders = currentFolderId
    ? subFolders.filter((sf) => sf._id !== folderId)
    : folders.filter((f) => f._id !== folderId);

  const isLoadingFolders = currentFolderId ? folderDetailsLoading : isLoading;

  return (
    <div className={className}>
      <div className="flex items-center mb-3">
        {currentFolderId && (
          <Button
            variant="outline"
            onClick={navigateUp}
            className="flex items-center gap-1 text-gray-600 hover:text-teal-600"
          >
            <span className="text-sm">Back</span>
          </Button>
        )}

        <div className="flex items-center text-sm text-gray-600 ml-3">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="mx-1 text-gray-400">{'>'}</span>}
              <button
                onClick={() =>
                  navigateToFolder(crumb.id || undefined, crumb.name)
                }
                className={`hover:text-teal-600 ${
                  index === breadcrumbs.length - 1
                    ? 'font-medium text-teal-700'
                    : ''
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        {isLoadingFolders ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            </div>
          </div>
        ) : filteredFolders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer border rounded-md min-w-[200px]"
                onClick={() => handleFolderClick(folder._id, folder.name)}
              >
                <div className="flex items-center gap-2">
                  <Folder size={20} className="text-teal-500 flex-shrink-0" />
                  <span className="font-medium truncate">{folder.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm">
              {currentFolderId
                ? 'This folder is empty'
                : 'No folders available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   MOVE FOLDER CONTENT (WITH MOVE TO ROOT BUTTON)
   -------------------------------------------------------------------------- */
const MoveFolderContent = ({
  folderId,
  onOpenChange,
  onSuccess,
  folderName,
}: {
  folderId: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  folderName: string;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const moveFolder = useMoveFolder();
  const { currentFolderId: explorerCurrentFolderId, breadcrumbs } =
    useFolderSystem();

  const [selectedFolderId, setSelectedFolderId] = useState<
    string | undefined
  >();
  const [selectedFolderName, setSelectedFolderName] = useState<string>('');
  const folderPathRef = useRef<string[]>([]);

  useEffect(() => {
    folderPathRef.current = breadcrumbs
      .map((b) => b.id)
      .filter(Boolean) as string[];
  }, [breadcrumbs]);

  const handleFolderClick = useCallback(
    (id: string, name: string) => {
      if (id === folderId) return;
      if (id === selectedFolderId) {
        setSelectedFolderId(undefined);
        setSelectedFolderName('');
      } else {
        setSelectedFolderId(id);
        setSelectedFolderName(name);
      }
    },
    [selectedFolderId, folderId]
  );

  const invalidateAllQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOLDERS.all });
    if (explorerCurrentFolderId) {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FOLDERS.byParent(explorerCurrentFolderId),
      });
    }
    folderPathRef.current.forEach((id) => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.FOLDERS.byParent(id),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.FOLDERS.details(id),
        });
      }
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.FOLDERS.details(folderId),
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.FOLDERS.byParent(undefined),
    });
  }, [queryClient, folderId, explorerCurrentFolderId]);

  const handleMove = useCallback(() => {
    if (!selectedFolderId) return;
    moveFolder.mutate(
      { folderId, targetFolderId: selectedFolderId },
      {
        onSuccess: () => {
          invalidateAllQueries();
          toast({
            title: 'Success',
            description: `Folder moved to "${selectedFolderName}"`,
            type: 'success',
          });
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: (error as any).message || 'Failed to move folder',
            type: 'error',
          });
        },
      }
    );
  }, [
    folderId,
    moveFolder,
    onOpenChange,
    onSuccess,
    selectedFolderId,
    selectedFolderName,
    toast,
    invalidateAllQueries,
  ]);

  // 🆕 Move to My Library (root)
  const handleMoveToRoot = useCallback(() => {
    moveFolder.mutate(
      { folderId, targetFolderId: 'root' },
      {
        onSuccess: () => {
          invalidateAllQueries();
          toast({
            title: 'Success',
            description: 'Folder moved to My Library',
            type: 'success',
          });
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description:
              (error as any).message || 'Failed to move folder to My Library',
            type: 'error',
          });
        },
      }
    );
  }, [
    folderId,
    moveFolder,
    onOpenChange,
    onSuccess,
    toast,
    invalidateAllQueries,
  ]);

  return (
    <div className="py-3">
      <div className="overflow-hidden mb-4 p-4">
        <FilteredFolderExplorer
          folderId={folderId}
          onFolderClick={handleFolderClick}
          className="h-[350px] overflow-y-auto"
        />

        {selectedFolderId && (
          <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-md flex items-center gap-2">
            <Folder size={16} className="text-teal-600" />
            <p className="text-sm font-medium text-teal-700">
              Selected destination:{' '}
              <span className="font-bold">{selectedFolderName}</span>
            </p>
          </div>
        )}
      </div>

      {/* --- Buttons --- */}
      <div className="flex justify-between w-full mt-4">
        <Button
          variant="outline"
          onClick={handleMoveToRoot}
          disabled={moveFolder.isPending}
          className="flex items-center gap-1 border-gray-300"
        >
          {moveFolder.isPending &&
          moveFolder.variables?.targetFolderId === 'root' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Home size={16} className="text-gray-600" />
          )}
          <span>Move to My Library</span>
        </Button>

        <Button
          disabled={!selectedFolderId || moveFolder.isPending}
          onClick={handleMove}
          className={`flex items-center gap-1 ${
            selectedFolderId && !moveFolder.isPending
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {moveFolder.isPending &&
            moveFolder.variables?.targetFolderId === selectedFolderId && (
              <Loader2 size={16} className="animate-spin" />
            )}
          <span>
            {moveFolder.isPending &&
            moveFolder.variables?.targetFolderId === selectedFolderId
              ? 'Moving...'
              : 'Move Here'}
          </span>
        </Button>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   OUTER TWO‑STEP MODAL
   -------------------------------------------------------------------------- */
export const MoveFolderModal: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  onSuccess?: () => void;
  folderName?: string;
}> = ({
  isOpen,
  onOpenChange,
  folderId,
  onSuccess,
  folderName = 'Folder 1',
}) => {
  const [mode, setMode] = useState<'selectRoot' | 'library'>('selectRoot');

  const handleOpenChange = (open: boolean) => {
    if (!open) setMode('selectRoot');
    onOpenChange(open);
  };

  if (mode === 'selectRoot') {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        title="Move"
        icon={<FolderSymlink size={20} />}
        contentClassName="max-w-sm"
        showCloseButton
      >
        <div className="my-2">
          <p className="text-md font-bold text-black mb-3">
            Move “{folderName}” to:
          </p>

          <div className="flex flex-col divide-y divide-gray-100">
            {/* My Library */}
            <button
              onClick={() => setMode('library')}
              className="group flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <Folder
                  size={18}
                  className="text-black group-hover:text-[#0890A8] transition-colors"
                />
                <span className="font-medium text-black group-hover:text-[#0890A8] transition-colors">
                  My Library
                </span>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-400 group-hover:text-[#0890A8] transition-colors"
              />
            </button>

            {/* Shared With Me (you can enable later) */}
            <button
              disabled
              className="group flex items-center justify-between px-3 py-3 text-black rounded hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <FolderSymlink
                  size={18}
                  className="text-black group-hover:text-[#0890A8] transition-colors"
                />
                <span className="font-medium text-black group-hover:text-[#0890A8] transition-colors">
                  Shared With Me
                </span>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-400 group-hover:text-[#0890A8] transition-colors"
              />
            </button>

            <button
              disabled
              className="flex items-center justify-between px-3 py-3 text-gray-400 cursor-not-allowed rounded"
            >
              <div className="flex items-center gap-2">
                <Folder size={18} className="text-green-600" />
                <span className="font-medium">Maths Class UCLA</span>
              </div>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  if (mode === 'library') {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        title="Move"
        icon={<FolderSymlink size={20} />}
        contentClassName="max-w-3xl"
        showCloseButton
      >
        <FolderProvider rootName="My Library" rootPath="/folders">
          <MoveFolderContent
            folderId={folderId}
            onOpenChange={onOpenChange}
            onSuccess={onSuccess}
            folderName={folderName}
          />
        </FolderProvider>
      </Modal>
    );
  }

  return null;
};
