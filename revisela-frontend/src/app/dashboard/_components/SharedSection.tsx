'use client';

import Link from 'next/link';
import React from 'react';

import { ChevronRight } from 'lucide-react';

import QuizCard from '@/components/ui/quiz/QuizCard';
import { useSharedQuizzes } from '@/services/features/shared';
import { useUser } from '@/services/features/users';
import { Quiz } from '@/services/features/quizzes';

import { ROUTES } from '@/constants/routes';

interface SharedQuizItemProps {
  quiz: Quiz;
}

const SharedQuizItem = ({ quiz }: SharedQuizItemProps) => {
  const creatorId = typeof quiz.createdBy === 'string' ? quiz.createdBy : quiz.createdBy?._id;

  const isObject = typeof quiz.createdBy === 'object';
  const hasProfileImage = isObject && !!(quiz.createdBy as any).profileImage;
  const shouldFetch = !!creatorId && (!isObject || !hasProfileImage);

  const { data: fetchedUser } = useUser(shouldFetch ? creatorId : undefined);

  const creator = fetchedUser || (isObject ? quiz.createdBy : undefined);
  const creatorName = creator?.name || (isObject ? (quiz.createdBy as any).name : 'Unknown');

  return (
    <QuizCard
      id={quiz._id}
      title={quiz.title}
      description={quiz.description || ''}
      tags={quiz.tags || []}
      rating={0}
      user={{
        name: creatorName,
        profileImage: creator?.profileImage,
      }}
      parentRoute="dashboard/shared"
      isBookmarked={!!quiz.isBookmarked}
      isShared={true}
    />
  );
};

const SharedSection = () => {
  const { data: sharedQuizzes = [], isLoading } = useSharedQuizzes();

  // Don't show section if no shared quizzes
  if (!isLoading && (!sharedQuizzes || sharedQuizzes.length === 0)) {
    return null;
  }

  const showViewAll = sharedQuizzes.length > 3;

  return (
    <section className="group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        {/* Title */}
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]">
            Shared With Me
          </h2>
          <ChevronRight
            className="w-5 h-5 text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]"
            strokeWidth={2.5}
          />
        </div>

        {/* View All (only if >3 bookmarks) */}
        {showViewAll && (
          <Link
            href={ROUTES.DASHBOARD.SHARED}
            className="flex items-center text-[#0890A8] hover:underline"
          >
            View all
            <ChevronRight size={20} strokeWidth={2.5} />
          </Link>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <p>Loading...</p>
      ) : sharedQuizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sharedQuizzes.slice(0, 3).map((quiz) => (
            <SharedQuizItem key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SharedSection;
