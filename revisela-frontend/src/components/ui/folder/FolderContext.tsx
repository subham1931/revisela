'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import {
  useFolders as useApiFolder,
  useCreateFolder,
  useDeleteFolder,
  useFolderDetails,
  useUpdateFolder
} from '@/services/features/folders';

export interface BreadcrumbItem {
  id?: string;
  name: string;
  path: string;
}

interface FolderContextProps {
  currentFolderId?: string;
  folders: any[];
  subFolders: any[];
  currentFolder: any | null;
  isLoading: boolean;
  folderDetailsLoading: boolean;
  breadcrumbs: BreadcrumbItem[];
  navigateToFolder: (id?: string, name?: string) => void;
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
  rootPath,
  enableRouting = true
}: {
  children: ReactNode;
  initialFolderId?: string;
  rootName: string;
  rootPath: string;
  enableRouting?: boolean;
}) => {

  const router = useRouter();
  const searchParams = useSearchParams();

  // Default true if not specified
  const shouldRoute = enableRouting !== false;

  const safeInitial =
    initialFolderId && initialFolderId.trim() !== '' ? initialFolderId : undefined;

  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(safeInitial);
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>(
    safeInitial ? [{ id: safeInitial, name: '' }] : []
  );

  // Sync state with URL changes (handle back/forward button)
  useEffect(() => {
    const paramId = searchParams.get('folderId');
    const newId = paramId || undefined;

    // If routing is disabled, ignore URL changes for syncing state
    // (This prevents the modal from syncing to the URL if the URL somehow changes)
    if (!shouldRoute) return;

    if (newId !== currentFolderId) {
      setCurrentFolderId(newId);
      // Note: complex history sync might be needed here, but basic ID sync is crucial
    }
  }, [searchParams]);

  const { data: folders, isLoading } = useApiFolder(undefined);
  // useEffect(()=>{
  //   console.log(folders)
  // },[folders])

  const { data: currentFolder, isLoading: folderDetailsLoading } =
    useFolderDetails(currentFolderId, currentFolderId !== undefined);

  const subFolders = currentFolder?.subFolders || [];

  const createFolderMut = useCreateFolder();
  const updateFolderMut = useUpdateFolder();
  const deleteFolderMut = useDeleteFolder();

  const navigateToFolder = useCallback((id?: string, name?: string) => {
    const safeId = id && id.trim() !== '' ? id : undefined;

    setCurrentFolderId(safeId);

    // Update URL only if routing is enabled
    if (shouldRoute) {
      if (safeId) {
        router.push(`${rootPath}?folderId=${safeId}`);
      } else {
        router.push(rootPath);
      }
    }

    if (!safeId) {
      setFolderHistory([]);
      return;
    }

    setFolderHistory((prev) => {
      // Avoid duplicate history entries if clicking same folder
      if (prev.length > 0 && prev[prev.length - 1].id === safeId) return prev;

      const idx = prev.findIndex((f) => f.id === safeId);
      if (idx >= 0) return prev.slice(0, idx + 1);
      return [...prev, { id: safeId, name: name ?? '' }];
    });
  }, [rootPath, router, shouldRoute]);

  const navigateUp = useCallback(() => {
    if (folderHistory.length === 0) {
      setCurrentFolderId(undefined);
      if (shouldRoute) {
        router.push(rootPath);
      }
      return;
    }

    const newHist = folderHistory.slice(0, -1);
    setFolderHistory(newHist);

    if (newHist.length === 0) {
      setCurrentFolderId(undefined);
      router.push(rootPath);
    } else {
      const parentId = newHist[newHist.length - 1].id;
      setCurrentFolderId(parentId);
      if (shouldRoute) {
        router.push(`${rootPath}?folderId=${parentId}`);
      }
    }
  }, [folderHistory, rootPath, router, shouldRoute]);

  const breadcrumbs: BreadcrumbItem[] = [
    { id: undefined, name: rootName, path: rootPath },
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
        folders: currentFolderId !== undefined ? [] : folders || [],
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
