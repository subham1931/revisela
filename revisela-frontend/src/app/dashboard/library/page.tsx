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

import { useSearchParams } from 'next/navigation';
import React from 'react';

import { FolderExplorer, FolderProvider } from '@/components/ui/folder';
import ContentSection from '@/components/ui/folder/ContentSection';
import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';

import { ROUTES } from '@/constants/routes';

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const initialFolderId = searchParams.get('folderId') || undefined;

  const isRoot = !initialFolderId;

  return (
    <FolderProvider
      initialFolderId={initialFolderId}
      rootName="My Library"
      rootPath={ROUTES.DASHBOARD.LIBRARY}
    >
      <FolderExplorer
        title="Folders"
        renderContent={(currentFolderId, options) => {
          if (!currentFolderId) {
            return (
              <section className="mt-8">
                <QuizSetProvider folderId={null}>
                  <QuizSetExplorer title="Quiz Sets" />
                </QuizSetProvider>
              </section>
            );
          }
          return (
            <ContentSection
              currentFolderId={currentFolderId}
              suppressQuizzes={!!options?.suppressQuizzes}
            />
          );
        }}
      />
    </FolderProvider>
  );
}
