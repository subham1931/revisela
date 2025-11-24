'use client';

import React, { useState, useEffect } from 'react';

import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';
import { useFolderSystem } from './FolderContext';

interface ContentSectionProps {
  currentFolderId?: string;
  // If true, and subfolders exist for this folder, the component will NOT render quizzes (only folders)
  // (FolderExplorer sets this to true when subfolders are present)
  suppressQuizzes?: boolean;
}

export default function ContentSection({
  currentFolderId,
  suppressQuizzes = false,
}: ContentSectionProps) {
  const { subFolders } = useFolderSystem();
  const [quizCount, setQuizCount] = useState(0);
  const [quizLoaded, setQuizLoaded] = useState(false);

  // Root behavior: don't load content at root
  const isRoot = currentFolderId === undefined || currentFolderId === null;
  useEffect(() => {
    // Reset state when folder changes
    setQuizCount(0);
    setQuizLoaded(false);
  }, [currentFolderId]);

  if (isRoot) {
    return (
      <div className="text-gray-500 text-sm py-8">
        Select a folder to view its contents.
      </div>
    );
  }

  const hasSubFolders = subFolders.length > 0;
  const hasQuizzes = quizLoaded && quizCount > 0;

  // Empty folder (no folders inside and quizzes loaded but zero)
  if (!hasSubFolders && quizLoaded && quizCount === 0) {
    return (
      <div className="text-center text-gray-500 py-10 text-sm">
        This folder is empty.
      </div>
    );
  }

  // If suppressQuizzes is true and there are subfolders, we intentionally avoid rendering quizzes
  const shouldShowQuizzes = !(suppressQuizzes && hasSubFolders);

  return (
    <section className="mt-8 space-y-10">
      {/* If there are subfolders, show them (FolderExplorer already shows FolderGrid; you can show extra UI here if required) */}
      {/* We allow FolderExplorer to render the folder grid; ContentSection just focuses on quizzes */}
      {shouldShowQuizzes && (
        <QuizSetProvider folderId={currentFolderId}>
          <QuizSetExplorer
            title={hasSubFolders ? 'Quiz Sets' : undefined}
            onDataLoaded={(count) => {
              setQuizCount(count);
              setQuizLoaded(true);
            }}
          />
        </QuizSetProvider>
      )}

      {/* If both are wanted (suppressQuizzes === false and subfolders exist), ContentSection will show quizzes as well */}
    </section>
  );
}
