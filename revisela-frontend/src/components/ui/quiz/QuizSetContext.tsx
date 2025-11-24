'use client';

import React, { createContext, useContext, useMemo } from 'react';
import {
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  useQuizzes,
  useBookmarkedQuizzes,
} from '@/services/features/quizzes';

interface QuizSet {
  _id: string;
  title: string;
  description?: string;
  tags?: string[];
  folderId?: string | null;
  isBookmarked?: boolean;
  [key: string]: any;
}

interface QuizSetContextProps {
  quizzes: QuizSet[];
  isLoading: boolean;
  refresh: () => void;
  createQuiz: (data: Partial<QuizSet>) => Promise<any>;
  updateQuiz: (id: string, data: Partial<QuizSet>) => Promise<any>;
  deleteQuiz: (id: string) => Promise<any>;
}

const QuizSetContext = createContext<QuizSetContextProps | undefined>(undefined);

interface QuizSetProviderProps {
  children: React.ReactNode;
  folderId?: string | null;   // ✅ UPDATED TYPE
}

export const QuizSetProvider: React.FC<QuizSetProviderProps> = ({
  children,
  folderId,
}) => {
  const { data: quizzes = [], isLoading, refetch } = useQuizzes(folderId);
  const { data: bookmarkedData } = useBookmarkedQuizzes();

  const bookmarkedIds = useMemo(() => {
    const list = bookmarkedData?.data?.data || bookmarkedData?.data || [];
    return new Set(list.map((q: any) => q._id));
  }, [bookmarkedData]);

  const enrichedQuizzes = useMemo(
    () =>
      quizzes.map((quiz: any) => ({
        ...quiz,
        isBookmarked: bookmarkedIds.has(quiz._id),
      })),
    [quizzes, bookmarkedIds]
  );

  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const deleteQuizMutation = useDeleteQuiz();

  const refresh = refetch;

  const createQuiz = async (data: Partial<QuizSet>) => {
    await createQuizMutation.mutateAsync(data);
    refresh();
  };

  const updateQuiz = async (id: string, data: Partial<QuizSet>) => {
    await updateQuizMutation.mutateAsync({ quizId: id, data });
    refresh();
  };

  const deleteQuiz = async (id: string) => {
    await deleteQuizMutation.mutateAsync(id);
    refresh();
  };

  return (
    <QuizSetContext.Provider
      value={{
        quizzes: enrichedQuizzes,
        isLoading,
        refresh,
        createQuiz,
        updateQuiz,
        deleteQuiz,
      }}
    >
      {children}
    </QuizSetContext.Provider>
  );
};

export const useQuizSets = () => {
  const context = useContext(QuizSetContext);
  if (!context) {
    throw new Error('useQuizSets must be used inside a QuizSetProvider');
  }
  return context;
};
