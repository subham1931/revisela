'use client';

import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

import {
  useFolders as useApiFolder,
  useCreateFolder,
  useDeleteFolder,
  useFolderDetails,
  useUpdateFolder
} from '@/services/features/folders';

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface FolderContextProps {
  currentFolderId: string | undefined;
  folders: any[];
  subFolders: any[];
  currentFolder: any | null;
  isLoading: boolean;
  folderDetailsLoading: boolean;
  breadcrumbs: BreadcrumbItem[];
  navigateToFolder: (id: string | undefined, name?: string) => void;
  navigateUp: () => void;
  createFolder: (name: string, desc?: string) => Promise<any>;
  updateFolder: (id: string, name: string) => Promise<any>;
  deleteFolder: (id: string) => Promise<any>;
  rootName: string;
  rootPath: string;
}

const FolderContext = createContext<FolderContextProps | undefined>(undefined);

export const FolderProvider = ({
  children,
  initialFolderId,
  rootName,
  rootPath
}: {
  children: ReactNode;
  initialFolderId?: string;
  rootName: string;
  rootPath: string;
}) => {
  const [currentFolderId, setCurrentFolderId] = useState(initialFolderId);
  const [folderHistory, setFolderHistory] = useState<
    { id: string; name: string }[]
  >(initialFolderId ? [{ id: initialFolderId, name: '' }] : []);

  const { data: folders, isLoading } = useApiFolder(undefined);
  const { data: currentFolder, isLoading: folderDetailsLoading } =
    useFolderDetails(currentFolderId, !!currentFolderId);

  const subFolders = currentFolder?.subFolders || [];

  const createFolderMut = useCreateFolder();
  const updateFolderMut = useUpdateFolder();
  const deleteFolderMut = useDeleteFolder();

  const navigateToFolder = useCallback((id, name) => {
    setCurrentFolderId(id);

    if (id && name) {
      setFolderHistory((prev) => {
        const idx = prev.findIndex((f) => f.id === id);
        if (idx >= 0) return prev.slice(0, idx + 1);
        return [...prev, { id, name }];
      });
    } else {
      setFolderHistory([]);
    }
  }, []);

  const navigateUp = useCallback(() => {
    if (folderHistory.length === 0) {
      setCurrentFolderId(undefined);
      return;
    }

    const newHist = folderHistory.slice(0, -1);
    setFolderHistory(newHist);

    if (newHist.length === 0) {
      setCurrentFolderId(undefined);
    } else {
      setCurrentFolderId(newHist[newHist.length - 1].id);
    }
  }, [folderHistory]);

  const breadcrumbs: BreadcrumbItem[] = [
    { id: '', name: rootName, path: rootPath },
    ...folderHistory.map((f) => ({
      id: f.id,
      name: f.name,
      path: `${rootPath}?folderId=${f.id}`
    }))
  ];

  return (
    <FolderContext.Provider
      value={{
        currentFolderId,
        folders: currentFolderId ? [] : folders || [],
        subFolders,
        currentFolder: currentFolder || null,
        isLoading,
        folderDetailsLoading,
        breadcrumbs,
        navigateToFolder,
        navigateUp,
        createFolder: (name, desc) =>
          createFolderMut.mutateAsync({
            name,
            description: desc,
            parentFolder: currentFolderId
          }),
        updateFolder: (id, name) =>
          updateFolderMut.mutateAsync({ id, data: { name } }),
        deleteFolder: (id) => deleteFolderMut.mutateAsync(id),
        rootName,
        rootPath
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderSystem = () => {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error('useFolderSystem must be used in FolderProvider');
  return ctx;
};
