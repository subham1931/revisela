import React, { ReactNode, createContext, useCallback, useContext, useState, useEffect } from 'react';
import {
  useFolders as useApiFolder,
  useCreateFolder,
  useDeleteFolder,
  useFolderDetails,
  useUpdateFolder,
} from '@/services/features/folders';

export interface SubFolder {
  _id: string;
  name: string;
  isBookmarked?: boolean;
}

export interface Folder {
  _id: string;
  name: string;
  description?: string;
  parentFolder?: string;
  owner: string;
  subFolders?: SubFolder[];
  quizzes?: any[];
  sharedWith?: any[];
  publicAccess?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface FolderContextProps {
  currentFolderId: string | undefined;
  folders: Folder[];
  subFolders: SubFolder[];
  isLoading: boolean;
  folderDetailsLoading: boolean;
  currentFolder: Folder | null;
  breadcrumbs: BreadcrumbItem[];
  navigateToFolder: (id: string | undefined, folderName?: string) => void;
  navigateUp: () => void;
  createFolder: (name: string, description?: string) => Promise<any>;
  updateFolder: (id: string, name: string) => Promise<any>;
  deleteFolder: (id: string) => Promise<any>;
  rootName: string;
  rootPath: string;
}

const FolderContext = createContext<FolderContextProps | undefined>(undefined);

export interface FolderProviderProps {
  children: ReactNode;
  initialFolderId?: string;
  rootName?: string;
  rootPath: string;
}

export const FolderProvider: React.FC<FolderProviderProps> = ({
  children,
  initialFolderId,
  rootName = 'My Library',
  rootPath,
}) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(initialFolderId);
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>(
    initialFolderId ? [{ id: initialFolderId, name: '' }] : []
  );

  const { data: folders, isLoading } = useApiFolder(undefined); // root folders
  const { data: currentFolder, isLoading: folderDetailsLoading } = useFolderDetails(
    currentFolderId,
    !!currentFolderId
  );

  const subFolders = currentFolder?.subFolders || [];
  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();
  const deleteFolderMutation = useDeleteFolder();

  // Navigate to a folder
  const navigateToFolder = useCallback(
    (folderId: string | undefined, folderName?: string) => {
      setCurrentFolderId(folderId);

      if (folderId && folderName) {
        setFolderHistory((prev) => {
          // Remove any forward history if we clicked a breadcrumb
          const existingIndex = prev.findIndex((f) => f.id === folderId);
          if (existingIndex >= 0) return prev.slice(0, existingIndex + 1);
          return [...prev, { id: folderId, name: folderName }];
        });
      } else {
        // Go to root
        setFolderHistory([]);
      }
    },
    []
  );

  // Back button logic
  const navigateUp = useCallback(() => {
    if (folderHistory.length === 0) {
      setCurrentFolderId(undefined);
      return;
    }
    const newHistory = folderHistory.slice(0, -1);
    setFolderHistory(newHistory);
    if (newHistory.length === 0) {
      setCurrentFolderId(undefined);
    } else {
      setCurrentFolderId(newHistory[newHistory.length - 1].id);
    }
  }, [folderHistory]);

  // Build breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { id: '', name: rootName, path: rootPath },
    ...folderHistory.map((f) => ({
      id: f.id,
      name: f.name,
      path: `${rootPath}?folderId=${f.id}`,
    })),
  ];

  const createFolder = async (name: string, description?: string) =>
    createFolderMutation.mutateAsync({
      name,
      description,
      parentFolder: currentFolderId,
    });

  const updateFolder = async (id: string, name: string) =>
    updateFolderMutation.mutateAsync({ id, data: { name } });

  const deleteFolder = async (id: string) => deleteFolderMutation.mutateAsync(id);

  return (
    <FolderContext.Provider
      value={{
        currentFolderId,
        folders: currentFolderId ? [] : folders || [],
        subFolders,
        isLoading,
        folderDetailsLoading,
        currentFolder: currentFolder || null,
        breadcrumbs,
        navigateToFolder,
        navigateUp,
        createFolder,
        updateFolder,
        deleteFolder,
        rootName,
        rootPath,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderSystem = () => {
  const context = useContext(FolderContext);
  if (!context) throw new Error('useFolderSystem must be used within a FolderProvider');
  return context;
};
