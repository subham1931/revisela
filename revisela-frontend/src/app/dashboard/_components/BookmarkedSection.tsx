'use client';

import Link from 'next/link';
import React from 'react';
import { ChevronRight } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { useBookmarkedQuizzes } from '@/services/features/quizzes';

const BookmarkedSection: React.FC = () => {
  const { data: bookmarkedQuizzesResponse, isLoading } = useBookmarkedQuizzes();
  // Backend returns: { statusCode, timestamp, path, data: { success, count, data: Quiz[] } }
  // apiRequest unwraps to: response.data = { statusCode, timestamp, path, data: { success, count, data: Quiz[] } }
  // So we need: response.data.data.data for the Quiz[] array
  const bookmarkedQuizzes = bookmarkedQuizzesResponse || [];

  // Skip rendering if no bookmarks
  if (!isLoading && bookmarkedQuizzes.length === 0) {
    return null;
  }

  return (
    <section className="group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]">
            Bookmarked
          </h2>
          <ChevronRight
            className="w-5 h-5 text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]"
            strokeWidth={2.5}
          />
        </div>

        <Link
          href={ROUTES.DASHBOARD.BOOKMARKS}
          className="flex items-center text-[#0890A8] hover:underline"
        >
          View all
          <ChevronRight size={20} strokeWidth={2.5} />
        </Link>
      </div>

      {isLoading ? (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500 text-sm">Loading bookmarked quizzes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bookmarkedQuizzes.slice(0, 3).map((quiz: any) => (
            <QuizCard
              key={quiz._id}
              id={quiz._id}
              title={quiz.title}
              description={quiz.description || ''}
              tags={quiz.tags || []}
              rating={quiz.rating || 0}
              user={{
                name: typeof quiz.createdBy === 'object'
                  ? quiz.createdBy?.name || 'You'
                  : 'You',
                profileImage: typeof quiz.createdBy === 'object'
                  ? quiz.createdBy?.profileImage
                  : undefined,
              }}
              parentRoute="dashboard"
              isBookmarked={true}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookmarkedSection;
