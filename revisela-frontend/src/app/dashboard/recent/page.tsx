'use client';

import React from 'react';

import QuizCard from '@/components/ui/quiz/QuizCard';
import { usePublicQuizzes } from '@/services/features/quizzes';

export default function RecentPage() {

  const { data: publicQuizzesData, isLoading } = usePublicQuizzes(3, 0);
  const recentQuizzes = publicQuizzesData?.results || [];
  if (!isLoading && recentQuizzes.length === 0) {
    return null;
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6 text-[#0890A8]">Recent</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading recent quizzes...</p>
      ) : recentQuizzes.length === 0 ? (
        <p className="text-gray-500">No recent quizzes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recentQuizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              id={quiz._id}
              title={quiz.title}
              description={quiz.description || ''}
              tags={quiz.tags || []}
              rating={0}
              user={{
                name: typeof quiz.createdBy === 'object'
                  ? quiz.createdBy?.name || 'Unknown'
                  : 'Unknown',
                profileImage: typeof quiz.createdBy === 'object'
                  ? quiz.createdBy?.profileImage
                  : undefined,
              }}
              parentRoute="dashboard/recent"
              isBookmarked={!!quiz.isBookmarked}
            />
          ))}
        </div>
      )}
    </div>
  );
}
