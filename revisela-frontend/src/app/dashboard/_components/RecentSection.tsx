'use client';

import Link from 'next/link';
import React from 'react';

import { ChevronRight } from 'lucide-react';

import ChevronRightIcon from '@/components/icons/chevron-right';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { usePublicQuizzes } from '@/services/features/quizzes';

const RecentSection = () => {
  // Fetch public quizzes (recent/public quizzes)
  const { data: publicQuizzesData, isLoading } = usePublicQuizzes(3, 0);
  const recentQuizzes = publicQuizzesData?.results || [];

  // Don't show section if no quizzes
  if (!isLoading && recentQuizzes.length === 0) {
    return null;
  }

  return (
    <section className='group'>
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]">Recent</h2>
          <ChevronRight className="w-5 h-5 text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]" />
        </div>
        {/* <Link
          href="/dashboard/recent"
          className="flex items-center text-[#0890A8]"
        >
          View all <ChevronRight size={20} />
        </Link> */}
      </div>

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
              parentRoute="dashboard"
              isBookmarked={!!quiz.isBookmarked}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentSection;
