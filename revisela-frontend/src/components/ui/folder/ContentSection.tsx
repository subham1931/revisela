'use client';

import React, { useState, useEffect } from 'react';
import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';
import { useFolderSystem } from './FolderContext';

export default function ContentSection({
  currentFolderId,
  suppressQuizzes = false,
  parentRoute,
}: {
  currentFolderId?: string;
  suppressQuizzes?: boolean;
  parentRoute?: string;
}) {
  const { subFolders } = useFolderSystem();
  const [quizCount, setQuizCount] = useState(0);
  const [quizLoaded, setQuizLoaded] = useState(false);

  useEffect(() => {
    setQuizCount(0);
    setQuizLoaded(false);
  }, [currentFolderId]);

  const hasSubFolders = subFolders.length > 0;

  const emptyFolder =
    !hasSubFolders && quizLoaded && quizCount === 0;

    

  if (emptyFolder) {
    return (
      <div className=" flex flex-col items-center justify-center h-[60vh] text-center text-gray-600">
        This folder is empty.
      </div>
    );
  }

  const shouldShowQuizzes = !(suppressQuizzes && hasSubFolders);

  return (
    <section className="mt-8">
      {shouldShowQuizzes && (
        <QuizSetProvider folderId={currentFolderId}>
          <QuizSetExplorer
            title={hasSubFolders ? 'Quiz Sets' : undefined}
            parentRoute={parentRoute}
            onDataLoaded={(count) => {
              setQuizCount(count);
              setQuizLoaded(true);
            }}
          />
        </QuizSetProvider>
      )}
    </section>
  );
}
