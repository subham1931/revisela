'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { useBookmarkedQuizzes } from '@/services/features/quizzes';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';
import { useUser } from '@/services/features/users';


interface BookmarkedQuizItemProps {
  quiz: any;
  currentUser: any;
}

const BookmarkedQuizItem = ({ quiz, currentUser }: BookmarkedQuizItemProps) => {
  const creatorId = typeof quiz.createdBy === 'string' ? quiz.createdBy : quiz.createdBy?._id;

  const isObject = typeof quiz.createdBy === 'object';
  const hasProfileImage = isObject && !!(quiz.createdBy as any).profileImage;
  const shouldFetch = !!creatorId && (!isObject || !hasProfileImage);

  const { data: fetchedUser } = useUser(shouldFetch ? creatorId : undefined);

  const creator = fetchedUser || (isObject ? quiz.createdBy : undefined);
  const creatorName = creator?.name || (isObject ? (quiz.createdBy as any).name : 'Unknown');

  // Calculate isShared
  const isShared = currentUser && creatorId && creatorId !== (currentUser.id || currentUser._id);

  return (
    <QuizCard
      id={quiz._id}
      title={quiz.title}
      description={quiz.description || ''}
      tags={quiz.tags || []}
      rating={quiz.rating || 0}
      user={{
        name: creatorName,
        profileImage: creator?.profileImage,
      }}
      parentRoute="dashboard"
      isBookmarked={true}
      isShared={isShared}
    />
  );
};

const BookmarkedSection: React.FC = () => {
  const { data: bookmarkedQuizzesResponse, isLoading } = useBookmarkedQuizzes();
  const currentUser = useAppSelector(selectUser);

  const bookmarkedQuizzes = bookmarkedQuizzesResponse || [];

  // Skip rendering entire section if no bookmarks
  if (!isLoading && bookmarkedQuizzes.length === 0) return null;

  const showViewAll = bookmarkedQuizzes.length > 3; // 👈 NEW LOGIC

  return (
    <section className="group">
      <div className="flex items-center justify-between mb-6">

        {/* Title */}
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]">
            Bookmarked
          </h2>
          <ChevronRight
            className="w-5 h-5 text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]"
            strokeWidth={2.5}
          />
        </div>

        {/* View All (only if >3 bookmarks) */}
        {showViewAll && (
          <Link
            href={ROUTES.DASHBOARD.BOOKMARKS}
            className="flex items-center text-[#0890A8] hover:underline"
          >
            View all
            <ChevronRight size={20} strokeWidth={2.5} />
          </Link>
        )}
      </div>

      {/* Loader or grid */}
      {isLoading ? (
        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500 text-sm">Loading bookmarked quizzes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bookmarkedQuizzes.slice(0, 3).map((quiz: any) => (
            <BookmarkedQuizItem key={quiz._id} quiz={quiz} currentUser={currentUser} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookmarkedSection;
