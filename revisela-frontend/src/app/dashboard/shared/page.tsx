// 'use client';

// import React, { useMemo, useState } from 'react';
// import { Folder } from 'lucide-react';

// import { useSharedContent } from '@/services/features/shared';
// import { useAppSelector } from '@/store';
// import { selectUser } from '@/store/slices/authSlice';

// import { Breadcrumb, BreadcrumbItem } from '@/components/ui/Breadcrumb';
// import { FolderItem } from '@/components/ui/folder';
// import { LoadingSpinner } from '@/components/ui/loaders';
// import { QuizSetItem } from '../library/components';

// export default function SharedPage() {
//   const [folderTrail, setFolderTrail] = useState<
//     { id: string; name: string }[]
//   >([]);

//   // Logged-in user
//   const currentUser = useAppSelector(selectUser);
//   const currentUserId =
//     currentUser?._id || (currentUser as any)?.id || '';

//   // Selected folder (from breadcrumb trail)
//   const selectedFolderId =
//     folderTrail.length > 0
//       ? folderTrail[folderTrail.length - 1].id
//       : null;

//   // Fetch ALL shared data once
//   const {
//     data: sharedContent,
//     isLoading,
//     error,
//   } = useSharedContent();

//   // =============================
//   // GET SELECTED FOLDER FROM SHARED CONTENT
//   // =============================
//   const selectedFolder = useMemo(() => {
//     if (!selectedFolderId) return null;

//     return sharedContent?.folders.find(
//       (f) => f._id === selectedFolderId
//     );
//   }, [selectedFolderId, sharedContent]);

//   // =============================
//   // FOLDERS TO DISPLAY
//   // =============================
//   const displayedFolders = selectedFolder
//     ? selectedFolder.subFolders || []
//     : sharedContent?.folders || [];
//     console.log("displayedFolders", displayedFolders);

//   // =============================
//   // QUIZZES TO DISPLAY
//   // =============================
//   const displayedQuizzes = selectedFolder
//     ? selectedFolder.quizzes || []
//     : sharedContent?.quizzes || [];

//   // =============================
//   // NAVIGATION: CLICK FOLDER
//   // =============================
//   const handleFolderClick = (id: string, name: string) => {
//     if (!id) return;

//     setFolderTrail((prev) => {
//       const exists = prev.find((item) => item.id === id);
//       if (exists) {
//         const idx = prev.findIndex((i) => i.id === id);
//         return prev.slice(0, idx + 1);
//       }
//       return [...prev, { id, name }];
//     });
//   };

//   // =============================
//   // NAVIGATION: CLICK BREADCRUMB
//   // =============================
//   const handleBreadcrumbClick = (idx: number) => {
//     if (idx < 0) {
//       setFolderTrail([]);
//       return;
//     }
//     setFolderTrail((prev) => prev.slice(0, idx + 1));
//   };

//   // =============================
//   // BUILD BREADCRUMB
//   // =============================
//   const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
//     const root: BreadcrumbItem = {
//       label: 'Shared With Me',
//       isCurrent: folderTrail.length === 0,
//       onClick:
//         folderTrail.length > 0
//           ? () => handleBreadcrumbClick(-1)
//           : undefined,
//     };

//     const trailItems = folderTrail.map((item, index) => ({
//       label: item.name,
//       icon: <Folder size={22} className="text-[#0890A8]" />,
//       isCurrent: index === folderTrail.length - 1,
//       onClick:
//         index < folderTrail.length - 1
//           ? () => handleBreadcrumbClick(index)
//           : undefined,
//     }));

//     return [root, ...trailItems];
//   }, [folderTrail]);

//   // =============================
//   // LOADING & ERROR STATES
//   // =============================
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <p className="text-red-500">
//           Failed to load shared content. Try again.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Breadcrumb */}
//       <div className="flex items-center gap-2 mb-8">
//         <Breadcrumb items={breadcrumbItems} />
//       </div>

//       {/* ======================= */}
//       {/* FOLDERS SECTION */}
//       {/* ======================= */}
//       <section className="mb-10">
//         <h2 className="text-xl font-medium text-[#444444] mb-4">
//           {selectedFolder ? 'Subfolders' : 'Shared Folders'} (
//           {displayedFolders.length})
//         </h2>

//         {displayedFolders.length === 0 ? (
//           <p className="text-center py-8 text-gray-500">
//             {selectedFolder
//               ? 'This folder has no subfolders.'
//               : 'No shared folders found.'}
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {displayedFolders.map((folder) => (
//               <FolderItem
//                 key={folder._id}
//                 id={folder._id}
//                 name={folder.name}
//                 isBookmarked={folder.isBookmarked}
//                 onClick={() =>
//                   handleFolderClick(folder._id, folder.name)
//                 }
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ======================= */}
//       {/* QUIZ SECTION */}
//       {/* ======================= */}
//       <section>
//         <h2 className="text-xl font-medium text-[#444444] mb-4">
//           {selectedFolder
//             ? 'Quiz Sets in this Folder'
//             : 'Shared Quiz Sets'}{' '}
//           ({displayedQuizzes.length})
//         </h2>

//         {displayedQuizzes.length === 0 ? (
//           <p className="text-center py-8 text-gray-500">
//             {selectedFolder
//               ? 'This folder contains no quiz sets.'
//               : 'No shared quiz sets found.'}
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {displayedQuizzes.map((quiz: any) => (
//               <QuizSetItem
//                 key={quiz._id}
//                 id={quiz._id}
//                 title={quiz.title}
//                 description={quiz.description || ''}
//                 tags={quiz.tags || []}
//                 creator={{
//                   name: quiz.createdBy?.name || 'Unknown',
//                   shared: true,
//                 }}
//                 rating={0}
//                 isBookmarked={quiz.isBookmarked}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }
"use client";

import React, { useMemo, useState } from "react";
import { Folder } from "lucide-react";

import { useSharedContent } from "@/services/features/shared";

import { Breadcrumb, BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { FolderItem } from "@/components/ui/folder";
import { LoadingSpinner } from "@/components/ui/loaders";
import QuizGrid from "@/components/ui/quiz/QuizGrid";

export default function SharedPage() {
  const [path, setPath] = useState<string[]>([]);

  const { data: sharedContent, isLoading, error } = useSharedContent();

  const folderMap = useMemo(() => {
    const map = new Map<string, any>();
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
      .filter(Boolean);
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

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* FOLDERS SECTION */}
      <section className="mb-8">
        <h2 className="text-xl font-medium text-[#444444] mb-4">Folders</h2>

        {displayedFolders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No folders found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedFolders.map((f: any) => (
              <FolderItem
                key={f._id}
                id={f._id}
                name={f.name}
                isBookmarked={f.isBookmarked}
                onClick={() => setPath([...path, f._id])}
              />
            ))}
          </div>
        )}
      </section>

      {/* QUIZZES SECTION */}
      <section>
        <h2 className="text-xl font-medium text-[#444444] mb-4">Quiz Sets</h2>

        <QuizGrid
          quizzes={displayedQuizzes}
          isLoading={false}
          emptyMessage={
            currentFolder
              ? "This folder contains no quiz sets."
              : "No shared quiz sets found."
          }
        />
      </section>
    </div>
  );
}
