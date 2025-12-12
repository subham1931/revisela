'use client';
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import QuizGrid from './QuizGrid';
import { useQuizSets } from './QuizSetContext';
import { GridSkeletonLoader } from '@/components/ui/loaders';
import { ROUTES } from '@/constants/routes';

interface QuizSetExplorerProps {
  title?: string;
  allowCreateQuiz?: boolean;
  onQuizClick?: (id: string, title: string) => void;
  onDataLoaded?: (count: number) => void;
  hideEmptyState?: boolean;   // ⭐ NEW
  parentRoute?: string;
}

const QuizSetExplorer: React.FC<QuizSetExplorerProps> = ({
  title = 'Quiz Sets',
  onQuizClick,
  onDataLoaded,
  hideEmptyState = false,     // ⭐ NEW DEFAULT
  parentRoute,
}) => {
  const { quizzes, isLoading, deleteQuiz } = useQuizSets();
  const router = useRouter();

  const handleQuizClick = useCallback(
    (id: string, quizTitle: string) => {
      if (onQuizClick) return onQuizClick(id, quizTitle);

      if (parentRoute) {
        // Ensure we don't end up with double slashes if parentRoute already starts with /
        const route = parentRoute.startsWith('/') ? parentRoute : `/${parentRoute}`;
        router.push(`${route}/${id}`);
      } else {
        router.push(ROUTES.DASHBOARD.QUIZ_SETS.DETAIL(id));
      }
    },
    [onQuizClick, router, parentRoute]
  );

  // Notify parent about loaded data
  useEffect(() => {
    if (!isLoading && onDataLoaded) {
      onDataLoaded(quizzes.length);
    }
    // console.log("quizzes",quizzes);

  }, [isLoading, quizzes.length, onDataLoaded]);

  if (isLoading) {
    return (
      <GridSkeletonLoader type="quiz" count={6} columns={3} />
    );
  }

  // No quizzes case
  if (quizzes.length === 0) {
    if (hideEmptyState) return null;
    return (
      <div className="text-center py-4 text-gray-500">
        You don't have any quiz sets yet
      </div>
    );
  }

  // Normal render
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-[#444444]">{title}</h2>
      </div>

      <QuizGrid
        quizzes={quizzes}
        isLoading={false}
        onQuizClick={handleQuizClick}
        onQuizDelete={deleteQuiz}
        parentRoute={parentRoute}
      />
    </div>
  );
};

export default QuizSetExplorer;
