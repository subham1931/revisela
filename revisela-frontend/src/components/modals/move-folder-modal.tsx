'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Folder, FolderClosed, FolderSymlink, GraduationCap, Home, Loader2, Users } from 'lucide-react';

import { useMoveFolder } from '@/services/features/folders';
import { useMyClasses, useClass, useAddFolderToClass } from '@/services/features/classes';
import { QUERY_KEYS } from '@/services/query-keys';

import { Button, Modal } from '@/components/ui';
import { FolderProvider, useFolderSystem } from '@/components/ui/folder';
import { useToast } from '@/components/ui/toast/index';

/* --------------------------------------------------------------------------
   FILTERED FOLDER EXPLORER
   -------------------------------------------------------------------------- */
const FilteredFolderExplorer = ({
  folderId,
  folderName,        // <-- added
  onFolderClick,
  className,
  onNavigateToRoot,
}: {
  folderId: string;
  folderName: string;  // <-- added
  onFolderClick: (id: string, name: string) => void;
  className?: string;
  onNavigateToRoot?: () => void;
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
    rootName,
  } = useFolderSystem();

  const handleFolderClick = useCallback(
    (id: string, name: string) => {
      if (id === folderId) return;
      onFolderClick(id, name);
      navigateToFolder(id, name);
    },
    [folderId, navigateToFolder, onFolderClick]
  );

  const handleRootClick = () => {
    if (onNavigateToRoot) {
      onNavigateToRoot();
    } else {
      navigateToFolder(undefined, rootName);
    }
  }

  const filteredFolders = currentFolderId
    ? subFolders.filter((sf) => sf._id !== folderId)
    : folders.filter((f) => f._id !== folderId);

  const isLoadingFolders = currentFolderId ? folderDetailsLoading : isLoading;

  return (
    <div className={className}>

      {/* ---------- Title + Breadcrumbs ---------- */}
      <div className="flex flex-col mb-4">

        {/* Title */}

        {/* Back + Breadcrumbs */}
        <div className="flex items-center mt-2">

          <div className="flex items-center text-sm text-gray-600">
            <p className="text-md font-bold text-black">
              Move “{folderName}” to:
            </p>
            <button
              onClick={handleRootClick}
              className={`ml-2 hover:text-teal-600 ${breadcrumbs.length === 0 ? 'font-medium text-teal-700' : ''}`}
            >
              {rootName}
            </button>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className="mx-1 text-gray-400">{'>'}</span>
                <button
                  onClick={() =>
                    navigateToFolder(crumb.id || undefined, crumb.name)
                  }
                  className={`hover:text-teal-600 ${index === breadcrumbs.length - 1
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
      </div>

      {/* ---------- Folder List ---------- */}
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
                  <Folder size={20} className="text-teal-500" />
                  <span className="font-medium truncate">{folder.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm">
              {currentFolderId ? 'This folder is empty' : 'No folders available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


/* --------------------------------------------------------------------------
   CLASS EXPLORER
   -------------------------------------------------------------------------- */
const ClassExplorer = ({
  onClassClick,
  className,
}: {
  onClassClick: (id: string, name: string) => void;
  className?: string;
}) => {
  const { data: classes, isLoading } = useMyClasses();

  return (
    <div className={className}>
      <div className="flex flex-col mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <p className="text-md font-bold text-black mr-2">
            Select a Class:
          </p>
        </div>
      </div>

      <div className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            </div>
          </div>
        ) : (classes?.length ?? 0) > 0 ? (
          <div className="flex flex-col gap-2 p-2">
            {classes?.map((cls) => (
              <div
                key={cls._id}
                className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer border rounded-md"
                onClick={() => onClassClick(cls._id, cls.name)}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap size={20} className="text-teal-500" />
                  <span className="font-medium truncate">{cls.name}</span>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm">No classes found</p>
          </div>
        )}
      </div>
    </div>
  );
};


/* --------------------------------------------------------------------------
   CLASS CONTENT (Display folders in a class) - For moving a FOLDER
   -------------------------------------------------------------------------- */
const ClassContent = ({
  folderId,
  folderName,
  classId,
  className,
  classNameString,
  onOpenChange,
  onSuccess,
  onNavigateToFolder
}: {
  folderId: string;
  folderName: string;
  classId: string;
  className?: string; // CSS className
  classNameString: string; // The Name of the class
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onNavigateToFolder: (folderId: string, folderName: string) => void;
}) => {
  const { data: classData, isLoading } = useClass(classId);
  const { toast } = useToast();
  const addFolderToClass = useAddFolderToClass();

  const rootFolders = classData?.folders || [];
  // Filter out the folder being moved if it happens to be at the root (though unlikely if not already in class)
  // But mainly we prevent moving folder into itself, which is handled by ID checks usually.

  const handleMoveToClassRoot = () => {
    addFolderToClass.mutate({ classId, folderId }, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: `Folder moved to class "${classNameString}"`,
          type: 'success',
        });
        onOpenChange(false);
        onSuccess?.();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to move folder to class',
          type: 'error',
        });
      }
    })
  }

  return (
    <div className="py-3">
      <div className="mb-4 p-4">
        <div className={className}>
          {/* Title + Breadcrumbs */}
          <div className="flex flex-col mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <p className="text-md font-bold text-black mr-2">
                Move “{folderName}” to:
              </p>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <span className="font-medium text-teal-700">{classNameString}</span>
            </div>
          </div>

          {/* Folder List */}
          <div className="overflow-hidden h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : rootFolders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
                {rootFolders.map((folder: any) => (
                  <div
                    key={folder._id}
                    className={`p-3 flex items-center justify-between border rounded-md min-w-[200px] ${folder._id === folderId ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-gray-50 cursor-pointer'}`}
                    onClick={() => {
                      if (folder._id !== folderId) {
                        onNavigateToFolder(folder._id, folder.name);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Folder size={20} className="text-teal-500" />
                      <span className="font-medium truncate">{folder.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">No folders in this class</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <p>Click "Move Here" to add to the class root, or select a folder.</p>
        </div>
      </div>

      <div className="flex justify-end w-full mt-4">
        <Button
          onClick={handleMoveToClassRoot}
          disabled={addFolderToClass.isPending}
          className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1"
        >
          {addFolderToClass.isPending ? 'Moving...' : 'Move Here'}
        </Button>
      </div>
    </div>
  )
}


/* --------------------------------------------------------------------------
   MOVE FOLDER CONTENT (WITH MOVE TO ROOT BUTTON)
   -------------------------------------------------------------------------- */
const MoveFolderContent = ({
  folderId,
  onOpenChange,
  onSuccess,
  folderName,
  initialFolderId, // Added support for start folder
  contextName,
  onNavigateToRoot
}: {
  folderId: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  folderName: string;
  initialFolderId?: string;
  contextName?: string;
  onNavigateToRoot?: () => void;
}) => {
  const { toast } = useToast();
  const moveFolder = useMoveFolder();
  // We rely on local selection state
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(initialFolderId);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('');

  const handleFolderClick = useCallback(
    (id: string, name: string) => {
      if (id === folderId) return;
      setSelectedFolderId(id);
      setSelectedFolderName(name);
    },
    [folderId]
  );

  const handleMove = () => {
    if (!selectedFolderId) return;

    moveFolder.mutate(
      { folderId, targetFolderId: selectedFolderId },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: `Folder moved to "${selectedFolderName}"`,
            type: 'success',
          });
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <div className="py-3">
      <div className="mb-4 p-4">
        <FilteredFolderExplorer
          folderId={folderId}
          folderName={folderName}   // <-- PASS NAME HERE
          onFolderClick={handleFolderClick}
          className="h-[350px] overflow-y-auto"
          onNavigateToRoot={onNavigateToRoot}
        />
      </div>

      <div className="flex justify-end w-full mt-4">
        <Button
          disabled={!selectedFolderId || selectedFolderId === initialFolderId}
          onClick={handleMove}
          className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1"
        >
          Move Here
        </Button>
      </div>
    </div>
  );
};


/* --------------------------------------------------------------------------
   OUTER TWO‑STEP MODAL
   -------------------------------------------------------------------------- */
import { useFolderDetails } from '@/services/features/folders';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

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
    // Modes: root -> library | classes -> class-detail (root folders) -> class-folder (deep drill)
    const [mode, setMode] = useState<'selectRoot' | 'library' | 'class-detail' | 'class-folder'>('selectRoot');

    // State for Class Navigation
    const [selectedClass, setSelectedClass] = useState<{ id: string; name: string } | null>(null);
    const [selectedClassFolder, setSelectedClassFolder] = useState<{ id: string; name: string } | null>(null);

    // Fetch classes for the root view
    const { data: classes, isLoading: isLoadingClasses } = useMyClasses();

    // RBAC Checks
    const user = useAppSelector(selectUser);
    const userId = user?.id || user?._id;
    const { data: folder, isLoading: isLoadingFolder } = useFolderDetails(folderId, isOpen); // Fetch only when open

    const isOwner = folder?.owner === userId || (typeof folder?.owner === 'object' && (folder.owner as any)?._id === userId);
    const sharedEntry = (folder?.sharedWith as any[])?.find((member: any) =>
      (typeof member.user === 'string' ? member.user === userId : member.user?._id === userId)
    );
    const accessLevel = isOwner ? 'admin' : (sharedEntry?.accessLevel as string || 'viewer');
    const canShareToClass = ['admin', 'collaborator'].includes(accessLevel);


    const addFolderToClass = useAddFolderToClass();
    const { toast } = useToast();

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        setTimeout(() => {
          setMode('selectRoot');
          setSelectedClass(null);
          setSelectedClassFolder(null);
        }, 200);
      }
      onOpenChange(open);
    };

    const handleMoveToClass = (classId: string, classNameString: string) => {
      addFolderToClass.mutate({ classId, folderId }, {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: `Folder moved to class "${classNameString}"`,
            type: 'success',
          });
          handleOpenChange(false);
          onSuccess?.();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to move folder to class',
            type: 'error',
          });
        }
      })
    };

    const handleNavigateToClassFolder = (folderId: string, folderName: string) => {
      setSelectedClassFolder({ id: folderId, name: folderName });
      setMode('class-folder');
    };

    const renderSelectRoot = () => (
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        title="Move Folder"
        icon={<FolderSymlink size={20} />}
        contentClassName="max-w-sm"
        showCloseButton
      >
        <div className="my-2">
          <p className="text-md font-bold text-black mb-3">
            Move “{folderName}” to:
          </p>

          <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
            {/* My Library */}
            <button
              onClick={() => setMode('library')}
              className="group flex items-center justify-between px-3 py-3 hover:bg-[#ACACAC33]/20 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <FolderClosed
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

            {/* Shared With Me */}
            <button
              disabled
              className="group flex items-center justify-between px-3 py-3 hover:bg-[#ACACAC33]/20 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <Users
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

            {/* Permission Check / Loading State */}
            {isLoadingFolder && (
              <div className="p-4 text-center text-xs text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Checking permissions...
              </div>
            )}

            {!isLoadingFolder && !canShareToClass && (
              <div className="px-3 py-2 text-xs text-red-400 italic text-center">
                You need Admin or Collaborator access to move this to a class.
              </div>
            )}

            {canShareToClass && !isLoadingClasses && classes?.map(cls => (
              <button
                key={cls._id}
                disabled={addFolderToClass.isPending}
                onClick={() => handleMoveToClass(cls._id, cls.name)}
                className="group flex items-center justify-between px-3 py-3 hover:bg-[#ACACAC33]/20 rounded transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap
                    size={18}
                    className="text-black group-hover:text-[#0890A8] transition-colors"
                  />
                  <span className="font-medium text-black group-hover:text-[#0890A8] transition-colors truncate max-w-[200px]">
                    {cls.name}
                  </span>
                </div>
                {addFolderToClass.isPending ? (
                  <span className="text-xs text-gray-400">Moving...</span>
                ) : (
                  <ArrowRight
                    size={18}
                    className="text-gray-400 group-hover:text-[#0890A8] transition-colors"
                  />
                )}
              </button>
            ))}

            {canShareToClass && isLoadingClasses && <div className="p-4 text-center text-xs text-gray-400">Loading classes...</div>}
          </div>
        </div>
      </Modal>
    );

    if (mode === 'selectRoot') return renderSelectRoot();

    if (mode === 'library') {
      return (
        <Modal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          title="Move Folder"
          icon={<FolderSymlink size={20} />}
          contentClassName="max-w-3xl"
          showCloseButton
        >
          <FolderProvider rootName="My Library" rootPath="/folders" enableRouting={false}>
            <MoveFolderContent
              folderId={folderId}
              onOpenChange={onOpenChange}
              onSuccess={onSuccess}
              folderName={folderName}
              contextName="My Library"
            />
          </FolderProvider>
        </Modal>
      );
    }

    if (mode === 'class-detail' && selectedClass) {
      return (
        <Modal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          title="Move Folder"
          icon={<FolderSymlink size={20} />}
          contentClassName="max-w-3xl"
          showCloseButton
        >
          <ClassContent
            folderId={folderId}
            folderName={folderName}
            classId={selectedClass.id}
            classNameString={selectedClass.name}
            onOpenChange={onOpenChange}
            onSuccess={onSuccess}
            onNavigateToFolder={handleNavigateToClassFolder}
          />
        </Modal>
      )
    }

    if (mode === 'class-folder' && selectedClass && selectedClassFolder) {
      return (
        <Modal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          title="Move Folder"
          icon={<FolderSymlink size={20} />}
          contentClassName="max-w-3xl"
          showCloseButton
        >
          {/* Note: `rootPath` is arbitrary here since we disabled routing */}
          <FolderProvider
            rootName={selectedClass.name}
            rootPath={`/classes/${selectedClass.id}`}
            initialFolderId={selectedClassFolder.id}
            enableRouting={false}
          >
            <MoveFolderContent
              folderId={folderId}
              folderName={folderName}
              onOpenChange={onOpenChange}
              onSuccess={onSuccess}
              contextName={selectedClass.name}
              initialFolderId={selectedClassFolder.id}
              onNavigateToRoot={() => setMode('class-detail')}
            />
          </FolderProvider>
        </Modal>
      )
    }

    return null;
  };
