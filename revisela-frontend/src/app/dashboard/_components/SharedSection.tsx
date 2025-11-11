'use client';

import Link from 'next/link';
import React from 'react';

import { ChevronRight } from 'lucide-react';

import ChevronRightIcon from '@/components/icons/chevron-right';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { useSharedQuizzes } from '@/services/features/shared';

const SharedSection = () => {
  const { data: sharedQuizzes = [], isLoading } = useSharedQuizzes();

  // Don't show section if no shared quizzes
  if (!isLoading && (!sharedQuizzes || sharedQuizzes.length === 0)) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-[#444444]">
            Shared With Me
          </h2>
          <ChevronRightIcon className="w-5 h-5" />
        </div>
        <Link
          href="/dashboard/shared"
          className="flex items-center text-[#0890A8]"
        >
          View all <ChevronRight size={20} />
        </Link>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading shared quizzes...</p>
      ) : !Array.isArray(sharedQuizzes) || sharedQuizzes.length === 0 ? (
        <p className="text-gray-500">No shared quizzes found.</p>
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
              parentRoute="dashboard"
              isBookmarked={!!quiz.isBookmarked}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SharedSection;
