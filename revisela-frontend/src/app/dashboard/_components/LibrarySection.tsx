'use client';

import Link from 'next/link';

import { ChevronRight, ChevronsRightIcon } from 'lucide-react';

import ChevronRightIcon from '@/components/icons/chevron-right';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { useQuizSets } from '@/components/ui/quiz/QuizSetContext';

import { ROUTES } from '@/constants/routes';

interface LibrarySectionProps {
  parentRoute?: string; // Added to dynamically route
}

const LibrarySection: React.FC<LibrarySectionProps> = ({
  parentRoute = 'library',
}) => {
  const { quizzes, isLoading } = useQuizSets();
  // console.log(quizzes?._isBookmarked);

  return (
    <section className="group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={ROUTES.DASHBOARD.LIBRARY}
          className="flex items-center gap-2"
        >
          <h2 className="text-3xl font-bold text-[#444444] transition-colors duration-200 group-hover:text-[#0890A8]">
            My Library
          </h2>
          <ChevronRight className="w-5 h-5 font-bold text-[#444444]  transition-colors duration-200 group-hover:text-[#0890A8]" />
        </Link>

        {/* Optional “View all” link */}
        {/* <Link
          href={ROUTES.DASHBOARD.LIBRARY}
          className="flex items-center text-[#0890A8] cursor-pointer"
        >
          View all
        </Link> */}
      </div>

      {/* Content */}
      {isLoading ? (
        <p>Loading...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {quizzes.slice(0, 3).map((quizSet) => {
            // console.log(
            //   `Quiz: ${quizSet.title} | Bookmarked:`,
            //   quizSet.isBookmarked
            // );

            return (
              <QuizCard
                key={quizSet._id}
                id={quizSet._id}
                title={quizSet.title}
                description={quizSet.description || ''}
                tags={quizSet.tags || []}
                rating={quizSet.rating || 0}
                user={{
                  name: quizSet.creator?.name || 'You',
                  profileImage: quizSet.creator?.profileImage,
                }}
                parentRoute={parentRoute}
                onDelete={(id) => console.log('Delete quiz', id)}
                isBookmarked={!!quizSet.isBookmarked}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LibrarySection;
