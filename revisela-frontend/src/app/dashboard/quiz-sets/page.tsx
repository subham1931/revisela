// app/dashboard/quiz-sets/ClientPage.tsx
'use client';

import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';
import QuizSetExplorer from '@/components/ui/quiz/QuizSetExplorer';
import { apiRequest } from '@/services'; // adjust path
import { QUIZ_ENDPOINTS } from '@/services/endpoints'; // adjust path

type QuizDetailResponse = {
  data: { data: Quiz } | Quiz;
  error?: any;
  status?: number;
};

export default function ClientQuizSetsPage() {
  const handleQuizClick = async (id: string, title: string) => {
    try {
      const res = await apiRequest<QuizDetailResponse>(QUIZ_ENDPOINTS.GET_QUIZ(id));
      const quiz = (res as any)?.data?.data ?? (res as any)?.data;
      console.log('Clicked quiz (full details):', quiz);
    } catch (err) {
      console.error('Failed to fetch quiz details:', err);
    }
  };

  return (
    <div className="space-y-6">
      <QuizSetProvider>
        <QuizSetExplorer title="Quiz Sets" allowCreateQuiz onQuizClick={handleQuizClick} />
      </QuizSetProvider>
    </div>
  );
}