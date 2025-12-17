'use client';

import Link from 'next/link';
import React from 'react';

import { ChevronRight } from 'lucide-react';

import ChevronRightIcon from '@/components/icons/chevron-right';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { useRecentQuizzes } from '@/services/features/quizzes';
import ROUTES from '@/constants/routes';
import { useUser } from '@/services/features/users';
import { Quiz } from '@/services/features/quizzes';
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

const RecentSection = () => {
  // Fetch recent quizzes (limit 3 for dashboard view)
  const { data: recentQuizzesData, isLoading } = useRecentQuizzes(3, 0);
  const recentQuizzes = recentQuizzesData?.results || [];
  const totalCount = recentQuizzesData?.totalCount || 0;
  const currentUser = useAppSelector(selectUser);

  // Don't show section if no quizzes
  if (!isLoading && recentQuizzes.length === 0) {
    return null;
  }

  const showViewAll = totalCount > 3;

  return (
    <section className='group'>
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]">Recent</h2>
          <ChevronRight className="w-5 h-5 text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]" />
        </div>
        {showViewAll && (
          <Link
            href={ROUTES.DASHBOARD.RECENT}
            className="flex items-center text-[#0890A8] cursor-pointer"
          >
            View all
            <ChevronRight size={20} strokeWidth={2.5} />
          </Link>
        )}
      </div>

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
    </section>
  );
};

export default RecentSection;
