'use client';

import React from 'react';

import { GridSkeletonLoader } from '@/components/ui/loaders';

import { QuizSetItem } from '@/app/dashboard/library/components';

import QuizCard from './QuizCard';
import QuizItem from './QuizItem';

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  tags?: string[];
  isBookmarked?: boolean;
  [key: string]: any;
}

interface QuizGridProps {
  quizzes: Quiz[];
  isLoading: boolean;
  emptyMessage?: string;
  onQuizClick?: (id: string, title: string) => void;
  onQuizDelete?: (id: string) => void;
  className?: string;
  gridClassName?: string;
}

const QuizGrid: React.FC<QuizGridProps> = ({
  quizzes,
  isLoading,
  emptyMessage = 'No quizzes found',
  onQuizClick,
  onQuizDelete,
  className = '',
  gridClassName = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4',
}) => {
  return (
    <div className={className}>
      {isLoading ? (
        <GridSkeletonLoader
          type="quiz"
          count={6}
          columns={3}
          className={gridClassName}
        />
      ) : quizzes && quizzes.length > 0 ? (
        <div className={`grid ${gridClassName}`}>
          {quizzes.map((quiz) => {
            // console.log(
            //   `📘 Quiz: ${quiz} | Bookmarked: ${quiz.isBookmarked}`
            // );

            return (
              <QuizCard
                key={quiz._id}
                id={quiz._id}
                title={quiz.title}
                description={quiz.description || ' '}
                tags={quiz.tags || []}
                isBookmarked={quiz.isBookmarked}
                user={{
                  name: quiz.createdBy?.name || 'You',
                  profileImage: quiz.createdBy?.profileImage,
                }}
                onDelete={onQuizDelete}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">{emptyMessage}</div>
      )}
    </div>
  );
};

export default QuizGrid;
