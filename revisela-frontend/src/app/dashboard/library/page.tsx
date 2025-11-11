// 'use client';

// import React from 'react';
// import { useSearchParams } from 'next/navigation';
// import { FolderExplorer, FolderProvider } from '@/components/ui/folder';
// import { ROUTES } from '@/constants/routes';
// import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
// import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';
// import { QuizDetailView } from './components/QuizDetailPanel';

// export default function LibraryPage() {
//   const searchParams = useSearchParams();
//   const initialFolderId = searchParams.get('folderId') || undefined;

//   const [activeQuizId, setActiveQuizId] = React.useState<string | null>(null);

//   return (
//     <FolderProvider
//       initialFolderId={initialFolderId}
//       rootName="My Library"
//       rootPath={ROUTES.DASHBOARD.LIBRARY}
//     >
//       {/* Conditionally render library content only if no quiz is active */}
//       {/* {!activeQuizId && ( */}
//         <FolderExplorer
//           title="Folders"
//           renderContent={(currentFolderId) => (
//             <section className="mt-8 bg-amber-500">
//               <QuizSetProvider folderId={currentFolderId}>
//                 <QuizSetExplorer
//                   title={currentFolderId ? 'Quizzes in this Folder' : 'My Quiz Sets'}
//                   allowCreateQuiz
//                   onQuizClick={(id) => setActiveQuizId(id)}
//                 />
//               </QuizSetProvider>
//             </section>
//           )}
//         />
//       {/* )} */}

//       {/* Render QuizDetailView as an overlay when activeQuizId is set */}
//       {/* <QuizDetailView
//         quizId={activeQuizId}
//         onClose={() => setActiveQuizId(null)}
//       /> */}
//     </FolderProvider>
//   );
// }
'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

import { FolderExplorer, FolderProvider } from '@/components/ui/folder';
import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';

import { ROUTES } from '@/constants/routes';

// 'use client';

// import React from 'react';
// import { useSearchParams } from 'next/navigation';
// import { FolderExplorer, FolderProvider } from '@/components/ui/folder';
// import { ROUTES } from '@/constants/routes';
// import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
// import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';
// import { QuizDetailView } from './components/QuizDetailPanel';

// export default function LibraryPage() {
//   const searchParams = useSearchParams();
//   const initialFolderId = searchParams.get('folderId') || undefined;

//   const [activeQuizId, setActiveQuizId] = React.useState<string | null>(null);

//   return (
//     <FolderProvider
//       initialFolderId={initialFolderId}
//       rootName="My Library"
//       rootPath={ROUTES.DASHBOARD.LIBRARY}
//     >
//       {/* Conditionally render library content only if no quiz is active */}
//       {/* {!activeQuizId && ( */}
//         <FolderExplorer
//           title="Folders"
//           renderContent={(currentFolderId) => (
//             <section className="mt-8 bg-amber-500">
//               <QuizSetProvider folderId={currentFolderId}>
//                 <QuizSetExplorer
//                   title={currentFolderId ? 'Quizzes in this Folder' : 'My Quiz Sets'}
//                   allowCreateQuiz
//                   onQuizClick={(id) => setActiveQuizId(id)}
//                 />
//               </QuizSetProvider>
//             </section>
//           )}
//         />
//       {/* )} */}

//       {/* Render QuizDetailView as an overlay when activeQuizId is set */}
//       {/* <QuizDetailView
//         quizId={activeQuizId}
//         onClose={() => setActiveQuizId(null)}
//       /> */}
//     </FolderProvider>
//   );
// }

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const initialFolderId = searchParams.get('folderId') || undefined;

  return (
    <FolderProvider
      initialFolderId={initialFolderId}
      rootName="My Library"
      rootPath={ROUTES.DASHBOARD.LIBRARY}
    >
      <FolderExplorer
        title="Folders"
        renderContent={(currentFolderId) => (
          <section className="mt-8">
            <QuizSetProvider folderId={currentFolderId}>
              <QuizSetExplorer
                title={
                  currentFolderId ? 'Quizzes in this Folder' : 'My Quiz Sets'
                }
                allowCreateQuiz
              />
            </QuizSetProvider>
          </section>
        )}
      />
    </FolderProvider>
  );
}
