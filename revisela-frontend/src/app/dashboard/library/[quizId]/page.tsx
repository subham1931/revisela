'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import QuizDetail from '@/components/features/quiz/QuizDetail';

const LibraryQuizDetailPage: React.FC = () => {
    const params = useParams();

    const quizId = Array.isArray(params.quizId)
        ? params.quizId[0]
        : params.quizId;

    if (!quizId) return null;

    return <QuizDetail quizId={quizId} />;
};

export default LibraryQuizDetailPage;
