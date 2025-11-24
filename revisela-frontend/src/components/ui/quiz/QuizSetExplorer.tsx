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
  onDataLoaded?: (count: number) => void;       // ⭐ added
}

const QuizSetExplorer: React.FC<QuizSetExplorerProps> = ({
  title = 'Quiz Sets',
  onQuizClick,
  onDataLoaded,
}) => {
  const { quizzes, isLoading, deleteQuiz } = useQuizSets();
  const router = useRouter();

  const handleQuizClick = useCallback(
    (id: string, quizTitle: string) => {
      if (onQuizClick) return onQuizClick(id, quizTitle);
      router.push(ROUTES.DASHBOARD.QUIZ_SETS.DETAIL(id));
    },
    [onQuizClick, router]
  );

  useEffect(() => {
    if (!isLoading && onDataLoaded) {
      onDataLoaded(quizzes.length);
    }
  }, [isLoading, quizzes.length, onDataLoaded]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-[#444444]">{title}</h2>
      </div>

      {isLoading ? (
        <GridSkeletonLoader type="quiz" count={6} columns={3} />
      ) : quizzes.length > 0 ? (
        <QuizGrid
          quizzes={quizzes}
          isLoading={false}
          onQuizClick={handleQuizClick}
          onQuizDelete={deleteQuiz}
        />
      ) : (
        <div className="text-center py-4 text-gray-500">
          You don't have any quiz sets yet
        </div>
      )}
    </div>
  );
};

export default QuizSetExplorer;
