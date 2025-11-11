'use client';

import React, { useMemo, useState } from 'react';

import { Folder } from 'lucide-react';

import { useFolderDetails } from '@/services/features/folders';
import { useSharedContent } from '@/services/features/shared';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

import { Breadcrumb, BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { FolderItem } from '@/components/ui/folder';
import { LoadingSpinner } from '@/components/ui/loaders';

import { QuizSetItem } from '../library/components';

interface TrailItem {
  id: string;
  name: string;
}

const getIdString = (value: any): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) {
    return value._id.toString();
  }
  if (typeof value === 'object' && typeof value.toString === 'function') {
    return value.toString();
  }
  return undefined;
};

export default function SharedPage() {
  const [folderTrail, setFolderTrail] = useState<TrailItem[]>([]);
  const currentUser = useAppSelector(selectUser);
  const currentUserId =
    currentUser?._id || (currentUser as unknown as { id?: string })?.id || '';

  const selectedTrailItem = folderTrail[folderTrail.length - 1];
  const selectedFolderId = selectedTrailItem?.id;

  // Fetch shared content using the API
  const {
    data: sharedContent,
    isLoading: isSharedLoading,
    error: sharedError,
  } = useSharedContent();

  const {
    data: selectedFolder,
    isLoading: isSelectedFolderInitialLoading,
    isFetching: isSelectedFolderFetching,
    error: selectedFolderError,
  } = useFolderDetails(selectedFolderId, !!selectedFolderId);

  const isFolderLoading =
    (!!selectedFolderId && (isSelectedFolderInitialLoading || isSelectedFolderFetching)) ||
    false;

  const handleFolderClick = (id: string, name: string) => {
    if (!id) {
      return;
    }
    setFolderTrail((prev) => {
      const alreadyInTrail = prev.find((item) => item.id === id);
      if (alreadyInTrail) {
        const index = prev.findIndex((item) => item.id === id);
        return prev.slice(0, index + 1);
      }
      return [...prev, { id, name }];
    });
  };

  const handleBreadcrumbClick = (trailIndex: number) => {
    if (trailIndex < 0) {
      setFolderTrail([]);
      return;
    }
    setFolderTrail((prev) => prev.slice(0, trailIndex + 1));
  };

  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const rootItem: BreadcrumbItem = {
      label: 'Shared With Me',
      icon: <Folder size={24} className="text-[#0890A8]" />,
      onClick:
        folderTrail.length > 0 ? () => handleBreadcrumbClick(-1) : undefined,
      isCurrent: folderTrail.length === 0,
    };

    const trailItems = folderTrail.map((item, index) => ({
      label: item.name,
      icon: <Folder size={24} className="text-[#0890A8]" />,
      isCurrent: index === folderTrail.length - 1,
      onClick:
        index === folderTrail.length - 1
          ? undefined
          : () => handleBreadcrumbClick(index),
    }));

    return [rootItem, ...trailItems];
  }, [folderTrail]);

  const accessibleSubFolders = useMemo(() => {
    if (!selectedFolder || !selectedFolderId) {
      return [];
    }

    const subFolders = Array.isArray(selectedFolder.subFolders)
      ? selectedFolder.subFolders
      : [];

    return subFolders
      .map((folder: any) => {
        const folderId = getIdString(folder?._id || folder?.id || folder);
        if (!folderId) return null;
        const ownerId = getIdString(folder?.owner);
        const sharedList = Array.isArray(folder?.sharedWith)
          ? folder.sharedWith
          : [];

        const hasAccess =
          ownerId === currentUserId ||
          sharedList.some((share: any) => {
            const sharedUserId = getIdString(share?.user);
            return sharedUserId === currentUserId;
          });

        if (!hasAccess) {
          return null;
        }

        return {
          _id: folderId,
          name: folder?.name || 'Untitled Folder',
          isBookmarked: Boolean(folder?.isBookmarked),
        };
      })
      .filter((folder: any) => folder !== null);
  }, [selectedFolderId, selectedFolder, currentUserId]);

  const displayedFolders = selectedFolderId
    ? accessibleSubFolders
    : sharedContent?.folders || [];

  const normalizedQuizzes = useMemo(() => {
    const quizzesSource = selectedFolderId
      ? Array.isArray(selectedFolder?.quizzes)
        ? selectedFolder?.quizzes
        : []
      : sharedContent?.quizzes || [];

    return quizzesSource
      .map((quiz: any) => {
        const quizId = getIdString(quiz?._id || quiz?.id || quiz);
        if (!quizId) return null;

        const creatorRaw = quiz?.createdBy;
        let creatorName = 'Unknown';

        if (creatorRaw) {
          if (typeof creatorRaw === 'string') {
            creatorName = creatorRaw;
          } else if (typeof creatorRaw === 'object') {
            creatorName = creatorRaw.name || creatorName;
          }
        }

        return {
          ...quiz,
          _id: quizId,
          createdBy: {
            ...(typeof creatorRaw === 'object' ? creatorRaw : {}),
            name: creatorName,
          },
          isBookmarked: Boolean(quiz?.isBookmarked),
        };
      })
      .filter((quiz: any) => quiz !== null);
  }, [selectedFolderId, selectedFolder?.quizzes, sharedContent?.quizzes]);

  const folderSectionTitle = selectedFolderId ? 'Subfolders' : 'Shared Folders';
  const quizSectionTitle = selectedFolderId
    ? 'Quiz Sets in this Folder'
    : 'Shared Quiz Sets';

  const folderCount = selectedFolderId
    ? displayedFolders.length
    : sharedContent?.totalCount?.folders || 0;

  const quizCount = selectedFolderId
    ? normalizedQuizzes.length
    : sharedContent?.totalCount?.quizzes || 0;

  if (isSharedLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (sharedError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load shared content</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center gap-2 mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center bg-yellow-100 h-8 w-8 rounded-full ml-2">
          <span className="text-yellow-800 font-medium">H</span>
        </div>
      </div>

      {selectedFolderError && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Unable to load the selected folder. Returning to the shared overview
          might help.
        </div>
      )}

      {/* Folders Section */}
      <section className="mb-8">
        <h2 className="text-xl font-medium text-[#444444] mb-4">
          {folderSectionTitle} ({folderCount})
        </h2>

        {isFolderLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : displayedFolders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedFolders.map((folder: any) => (
              <FolderItem
                key={folder._id}
                id={folder._id}
                name={folder.name}
                isBookmarked={Boolean(folder.isBookmarked)}
                onClick={() => handleFolderClick(folder._id, folder.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>
              {selectedFolderId
                ? 'This folder does not contain any subfolders you can access.'
                : 'No shared folders found'}
            </p>
          </div>
        )}
      </section>

      {/* Quiz Sets Section */}
      <section>
        <h2 className="text-xl font-medium text-[#444444] mb-4">
          {quizSectionTitle} ({quizCount})
        </h2>

        {isFolderLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : normalizedQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {normalizedQuizzes.map((quiz: any) => (
              <QuizSetItem
                key={quiz._id}
                id={quiz._id}
                title={quiz.title}
                description={quiz.description || ''}
                tags={quiz.tags || []}
                creator={{
                  name: quiz.createdBy?.name || 'Unknown',
                  isCurrentUser: false,
                  shared: true,
                }}
                rating={0}
                isBookmarked={Boolean(quiz.isBookmarked)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>
              {selectedFolderId
                ? 'No quiz sets found in this folder.'
                : 'No shared quiz sets found'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
