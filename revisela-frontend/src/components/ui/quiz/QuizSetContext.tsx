'use client';

import React, { createContext, useContext } from 'react';
import {
  useQuizzes,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
} from '@/services/features/quizzes';

interface QuizSet {
  _id: string;
  title: string;
  folderId?: string;
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

export const QuizSetProvider = ({
  children,
  folderId,
}: {
  children: React.ReactNode;
  folderId?: string;
}) => {
  // If folderId is empty string → treat as undefined
  const safeFolderId = folderId && folderId.trim() !== '' ? folderId : undefined;

  // ONE SINGLE QUERY handles both folder & root
  const {
    data: quizzes = [],
    isLoading,
    refetch,
  } = useQuizzes(safeFolderId);

  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const deleteQuizMutation = useDeleteQuiz();

  const createQuiz = async (data: Partial<QuizSet>) => {
    const payload = { ...data };
    if (safeFolderId) {
      payload.folderId = safeFolderId;
    }
    await createQuizMutation.mutateAsync(payload);
    refetch();
  };

  const updateQuiz = async (id: string, data: Partial<QuizSet>) => {
    await updateQuizMutation.mutateAsync({ quizId: id, data });
    refetch();
  };

  const deleteQuiz = async (id: string) => {
    await deleteQuizMutation.mutateAsync(id);
    refetch();
  };

  return (
    <QuizSetContext.Provider
      value={{
        quizzes,
        isLoading,
        refresh: refetch,
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
  const ctx = useContext(QuizSetContext);
  if (!ctx) throw new Error('useQuizSets must be used inside QuizSetProvider');
  return ctx;
};
