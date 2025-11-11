'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import QuizGrid from './QuizGrid';
import { useQuizSets } from './QuizSetContext';
import { GridSkeletonLoader } from '@/components/ui/loaders';
import { ROUTES } from '@/constants/routes'; // adjust path if needed

interface QuizSetExplorerProps {
  title?: string;
  allowCreateQuiz?: boolean;
  onQuizClick?: (id: string, title: string) => void; // optional override
}

const QuizSetExplorer: React.FC<QuizSetExplorerProps> = ({
  title = 'Quiz Sets',
  allowCreateQuiz = true,
  onQuizClick,
}) => {
  const { quizzes, isLoading, deleteQuiz /*, createQuiz*/ } = useQuizSets();
  const router = useRouter();

  const handleQuizClick = useCallback(
    (id: string, quizTitle: string) => {
      if (onQuizClick) return onQuizClick(id, quizTitle);
      router.push(ROUTES.DASHBOARD.QUIZ_SETS.DETAIL(id));
    },
    [onQuizClick, router]
  );

  const handleCreate = useCallback(() => {
    // Navigate to your create-page flow
    router.push(ROUTES.DASHBOARD.QUIZ_SETS.CREATE);

    // Or, if you prefer to create immediately and jump to edit:
    // const newQuiz = await createQuiz({ title: 'New Quiz', description: '...' });
    // const newId = newQuiz._id ?? newQuiz.id;
    // router.push(ROUTES.DASHBOARD.QUIZ_SETS.EDIT(newId));
  }, [router /*, createQuiz*/]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-[#444444]">{title}</h2>
        {/* {allowCreateQuiz && (
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#0890A8] text-white"
          >
            <Plus size={16} />
            New Quiz Set
          </Button>
        )} */}
      </div>

      {isLoading ? (
        <GridSkeletonLoader type="quiz" count={6} columns={3} />
      ) : quizzes.length > 0 ? (
        <QuizGrid
          quizzes={quizzes}
          isLoading={false} // we already render the skeleton above
          onQuizClick={handleQuizClick}
          onQuizDelete={deleteQuiz}
        />
      ) : (
        <div className="text-center py-4 text-gray-500">
          No quiz sets found.
        </div>
      )}
    </div>
  );
};

export default QuizSetExplorer;