// 'use client';

// import { useSearchParams } from 'next/navigation';
// import React, { useState } from 'react';

// import { FolderExplorer, FolderProvider } from '@/components/ui/folder';
// import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
// import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';

// import { ROUTES } from '@/constants/routes';
// import { useFolderSystem } from '@/components/ui/folder';

// export default function LibraryPage() {
//   const searchParams = useSearchParams();
//   const initialFolderId = searchParams.get("folderId") || undefined;

//   return (
//     <FolderProvider
//       initialFolderId={initialFolderId}
//       rootName="My Library"
//       rootPath={ROUTES.DASHBOARD.LIBRARY}
//     >
//       <FolderExplorer
//         title="Folders"
//         renderContent={(currentFolderId) => (
//           <ContentSection currentFolderId={currentFolderId} />
//         )}
//       />
//     </FolderProvider>
//   );
// }

// function ContentSection({ currentFolderId }: { currentFolderId?: string }) {
//   const { subFolders } = useFolderSystem();
//   const [quizCount, setQuizCount] = useState(0);
//   const [quizLoaded, setQuizLoaded] = useState(false);

//   const isRoot = !currentFolderId;

//   const hasSubFolders = subFolders.length > 0;
//   const hasQuizzes = quizLoaded && quizCount > 0;
//   console.log("hasSubFolders", hasSubFolders);
//   console.log("hasQuizzes", hasQuizzes);

//   const isEmpty =
//     !isRoot &&
//     !hasSubFolders &&
//     quizLoaded &&
//     quizCount === 0;

//   if (isEmpty) {
//     return (
//       <div className="text-center text-gray-500 py-10 text-sm">
//         This folder is empty.
//       </div>
//     );
//   }

//   // If there are only quizzes (no subfolders), show only quiz section
//   if (!hasSubFolders && (hasQuizzes || !quizLoaded)) {
//     return (
//       <section className="mt-8">
//         {isRoot && (
//           <QuizSetProvider folderId={null}>
//             <QuizSetExplorer
//               title="Quiz Sets"
//               onDataLoaded={(count) => {
//                 setQuizCount(count);
//                 setQuizLoaded(true);
//               }}
//             />
//           </QuizSetProvider>
//         )}

//         {!isRoot && (
//           <QuizSetProvider folderId={currentFolderId}>
//             <QuizSetExplorer
//               title="Quiz Sets"
//               onDataLoaded={(count) => {
//                 setQuizCount(count);
//                 setQuizLoaded(true);
//               }}
//             />
//           </QuizSetProvider>
//         )}
//       </section>
//     );
//   }

//   // If there are both subfolders and quizzes, or only subfolders, show quiz section
//   return (
//     <section className="mt-8">
//       {isRoot && (
//         <QuizSetProvider folderId={null}>
//           <QuizSetExplorer
//             title="Quiz Sets"
//             onDataLoaded={(count) => {
//               setQuizCount(count);
//               setQuizLoaded(true);
//             }}
//           />
//         </QuizSetProvider>
//       )}

//       {!isRoot && (
//         <QuizSetProvider folderId={currentFolderId}>
//           <QuizSetExplorer
//             title="Quiz Sets"
//             onDataLoaded={(count) => {
//               setQuizCount(count);
//               setQuizLoaded(true);
//             }}
//           />
//         </QuizSetProvider>
//       )}
//     </section>
//   );
// }

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { FolderExplorer, FolderProvider } from '@/components/ui/folder';
import ContentSection from '@/components/ui/folder/ContentSection';
import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import CreateQuizForm from '@/app/dashboard/create-set/_components/CreateQuizForm';

export default function LibraryPage() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("folderId");
  const folderId = raw && raw.trim() !== "" ? raw : undefined;
  const isCreateMode = params.get("action") === "create-quiz";

  const [rootQuizCount, setRootQuizCount] = useState(0);
  const [rootLoaded, setRootLoaded] = useState(false);

  // Helper to exit create mode: simply remove params or go back
  const handleExitCreate = () => {
    if (folderId) {
      router.push(`${ROUTES.DASHBOARD.LIBRARY}?folderId=${folderId}`);
    } else {
      router.push(ROUTES.DASHBOARD.LIBRARY);
    }
  };

  if (isCreateMode) {
    return (
      <main className="container px-4 max-w-full">
        <CreateQuizForm
          folderId={folderId}
          onSuccess={handleExitCreate}
          onCancel={handleExitCreate}
        />
      </main>
    );
  }

  return (
    <FolderProvider 
      initialFolderId={folderId}
      rootName="My Library"
      rootPath={ROUTES.DASHBOARD.LIBRARY}
    >
      <FolderExplorer
        title="Folders"
        renderContent={(currentFolderId, options) => {
          // ========================
          // ROOT MODE
          // ========================
          if (!currentFolderId) {
            return (
              <section className="mt-8">

                <QuizSetProvider folderId={undefined}>
                  <QuizSetExplorer
                    title="Quiz Sets"
                    hideEmptyState     // <-- prevent built-in empty message
                    parentRoute="dashboard/library"
                    onDataLoaded={(count) => {
                      setRootQuizCount(count);
                      setRootLoaded(true);
                    }}
                  />
                </QuizSetProvider>

                {/* REAL EMPTY STATE (ONLY ONE) */}
                {rootLoaded && rootQuizCount === 0 && !options?.suppressQuizzes && (
                  <div className=" flex flex-col items-center justify-center h-[60vh] text-center text-gray-600">
                    You don't have any items yet...
                  </div>
                )}
              </section>
            );
          }

          // ========================
          // FOLDER MODE
          // ========================
          return <ContentSection currentFolderId={currentFolderId} parentRoute="dashboard/library" />;
        }}
      />
    </FolderProvider>
  );
}
