'use client';

import Link from 'next/link';
import React from 'react';

import { ChevronRight } from 'lucide-react';

import QuizCard from '@/components/ui/quiz/QuizCard';
import { useSharedQuizzes } from '@/services/features/shared';

import { ROUTES } from '@/constants/routes';

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
            <QuizCard
              key={quiz._id}
              id={quiz._id}
              title={quiz.title}
              description={quiz.description || ''}
              tags={quiz.tags || []}
              rating={0}
              user={{
                name: quiz.createdBy?.name || 'Unknown',
                profileImage: quiz.createdBy?.profileImage,
              }}
              parentRoute="dashboard/shared"
              isBookmarked={!!quiz.isBookmarked}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SharedSection;
