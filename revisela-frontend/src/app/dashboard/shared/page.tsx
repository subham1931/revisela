"use client";

import React, { useMemo, useState } from "react";
import { Folder } from "lucide-react";

import { useSharedContent, SharedFolder } from "@/services/features/shared";

import { Breadcrumb, BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { FolderItem } from "@/components/ui/folder";
import { LoadingSpinner } from "@/components/ui/loaders";
import QuizGrid from "@/components/ui/quiz/QuizGrid";

export default function SharedPage() {
  const [path, setPath] = useState<string[]>([]);

  const { data: sharedContent, isLoading, error } = useSharedContent();

  const folderMap = useMemo(() => {
    const map = new Map<string, SharedFolder>();
    sharedContent?.folders?.forEach((f) => map.set(f._id, f));
    return map;
  }, [sharedContent]);

  const currentFolderId = path[path.length - 1] || null;
  const currentFolder = currentFolderId ? folderMap.get(currentFolderId) : null;

  const rootFolders = useMemo(() => {
    if (!sharedContent) return [];
    return sharedContent.folders.filter((f) => !f.parentFolder);
  }, [sharedContent]);

  const displayedFolders = useMemo(() => {
    if (!currentFolder) return rootFolders;
    return (currentFolder.subFolders || [])
      .map((id: string) => folderMap.get(id))
      .filter((f): f is SharedFolder => !!f);
  }, [currentFolder, rootFolders, folderMap]);

  const displayedQuizzes = useMemo(() => {
    if (!currentFolder) return sharedContent?.quizzes || [];
    return currentFolder.quizzes || [];
  }, [sharedContent, currentFolder]);

  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const root: BreadcrumbItem = {
      label: "Shared With Me",
      isCurrent: path.length === 0,
      onClick: path.length > 0 ? () => setPath([]) : undefined,
    };

    const items = path
      .map((id, index) => {
        const folder = folderMap.get(id);
        if (!folder) return null;

        return {
          label: folder.name,
          icon: <Folder size={20} className="text-[#0890A8]" />,
          isCurrent: index === path.length - 1,
          onClick:
            index === path.length - 1
              ? undefined
              : () => setPath(path.slice(0, index + 1)),
        };
      })
      .filter(Boolean) as BreadcrumbItem[];

    return [root, ...items];
  }, [path, folderMap]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load shared content.</p>
      </div>
    );
  }

  // Check if both folders and quizzes are empty
  const hasNoContent = displayedFolders.length === 0 && displayedQuizzes.length === 0;

  if (hasNoContent) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className=" flex flex-col items-center justify-center h-[60vh] text-center text-gray-600">
          {currentFolder
            ? "This folder is empty."
            : "No items shared with you yet."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* FOLDERS SECTION */}
      {displayedFolders.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-medium text-[#444444] mb-4">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedFolders.map((f) => (
              <FolderItem
                key={f._id}
                id={f._id}
                name={f.name}
                isBookmarked={f.isBookmarked}
                isShared={true}
                onClick={() => setPath([...path, f._id])}
              />
            ))}
          </div>
        </section>
      )}

      {/* QUIZZES SECTION */}
      {displayedQuizzes.length > 0 && (
        <section>
          <h2 className="text-xl font-medium text-[#444444] mb-4">Quiz Sets</h2>
          <QuizGrid
            quizzes={displayedQuizzes}
            isLoading={false}
            isShared={true}
            parentRoute="dashboard/shared"
            emptyMessage={
              currentFolder
                ? "This folder contains no quiz sets."
                : "No shared quiz sets found."
            }
          />
        </section>
      )}
    </div>
  );
}
