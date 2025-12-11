'use client';

import React from 'react';
import ReviseQuiz from '@/components/features/quiz/ReviseQuiz';

const SharedRevisePage = ({ params }: { params: { quizId: string } }) => {
    return <ReviseQuiz quizId={params.quizId} />;
};

export default SharedRevisePage;
