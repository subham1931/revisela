'use client';

import React from 'react';

import QuizCard from '@/components/ui/quiz/QuizCard';
import { useRecentQuizzes, Quiz } from '@/services/features/quizzes';
import { useUser } from '@/services/features/users';

import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

interface RecentQuizItemProps {
  quiz: Quiz;
  currentUser: any;
}

const RecentQuizItem = ({ quiz, currentUser }: RecentQuizItemProps) => {
  const creatorId = typeof quiz.createdBy === 'string' ? quiz.createdBy : quiz.createdBy?._id;
  const shouldFetch = typeof quiz.createdBy === 'string' && !!creatorId;

  const { data: fetchedUser } = useUser(shouldFetch ? creatorId : undefined);

  const creator = typeof quiz.createdBy === 'object' ? quiz.createdBy : fetchedUser;

  // Calculate isShared
  const isShared = currentUser && creatorId && creatorId !== (currentUser.id || currentUser._id);

  return (
    <QuizCard
      id={quiz._id}
      title={quiz.title}
      description={quiz.description || ''}
      tags={quiz.tags || []}
      rating={0}
      user={{
        name: creator?.name || 'Unknown',
        profileImage: creator?.profileImage,
      }}
      parentRoute="dashboard/recent"
      isBookmarked={!!quiz.isBookmarked}
      isShared={isShared}
    />
  );
};

export default function RecentPage() {

  const { data: recentQuizzesData, isLoading } = useRecentQuizzes();
  const recentQuizzes = recentQuizzesData?.results || [];
  const currentUser = useAppSelector(selectUser);

  // if (!isLoading && recentQuizzes.length === 0) {
  //   return (
  //        <div className="">
  //     <h1 className="text-3xl font-bold mb-6 text-[#0890A8]">Recent</h1>
  //     <p className="text-gray-500">No recent quizzes found.</p>
  //     </div>
  //   );
  // }

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
            <RecentQuizItem key={quiz._id} quiz={quiz} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
}
