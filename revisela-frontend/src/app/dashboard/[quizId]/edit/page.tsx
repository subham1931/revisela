'use client';

import React from 'react';

import QuizDetail from '@/components/features/quiz/QuizDetail';

interface PageProps {
    params: {
        quizId: string;
    };
}

const EditQuizPage: React.FC<PageProps> = ({ params }) => {
    return <QuizDetail quizId={params.quizId} initialEditMode={true} />;
};

export default EditQuizPage;
