'use client';

import React from 'react';

import { GridSkeletonLoader } from '@/components/ui/loaders';

import { QuizSetItem } from '@/app/dashboard/library/components';

import QuizCard from './QuizCard';
import { useUser } from '@/services/features/users';

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  tags?: string[];
  isBookmarked?: boolean;
  createdBy?: string | {
    _id: string;
    name: string;
    username?: string;
    email?: string;
    profileImage?: string;
  };
  [key: string]: any;
}

interface GridQuizItemProps {
  quiz: Quiz;
  isShared: boolean;
  parentRoute?: string;
  onDelete?: (id: string) => void;
  isClass?: boolean;
}

const GridQuizItem = ({ quiz, isShared, parentRoute, onDelete, isClass }: GridQuizItemProps) => {
  const creatorId = typeof quiz.createdBy === 'string' ? quiz.createdBy : quiz.createdBy?._id;

  const isObject = typeof quiz.createdBy === 'object';
  // Check if we have an object but it's missing the profile image
  const hasProfileImage = isObject && !!(quiz.createdBy as any).profileImage;

  // Fetch if we only have an ID, or if we have an object but no image
  const shouldFetch = !!creatorId && (!isObject || !hasProfileImage);

  const { data: fetchedUser } = useUser(shouldFetch ? creatorId : undefined);

  // Use fetched user if available, otherwise fallback to existing object
  const creator = fetchedUser || (isObject ? quiz.createdBy : undefined);

  // Safe name fallback
  const creatorName = creator?.name || (isObject ? (quiz.createdBy as any).name : 'Unknown');

  return (
    <QuizCard
      id={quiz._id}
      title={quiz.title}
      description={quiz.description || ' '}
      tags={quiz.tags || []}
      isBookmarked={quiz.isBookmarked}
      isShared={isShared}
      user={{
        name: creatorName,
        profileImage: creator?.profileImage,
      }}
      parentRoute={parentRoute}
      onDelete={onDelete}
      isClass={isClass}
    />
  );
};

interface QuizGridProps {
  quizzes: Quiz[];
  isLoading: boolean;
  emptyMessage?: string;
  onQuizClick?: (id: string, title: string) => void;
  onQuizDelete?: (id: string) => void;
  className?: string;
  gridClassName?: string;
  isShared?: boolean; // indicates if quizzes are shared
  parentRoute?: string;
  isClass?: boolean;
}

const QuizGrid: React.FC<QuizGridProps> = ({
  quizzes,
  isLoading,
  emptyMessage = 'No quizzes found',
  onQuizClick,
  onQuizDelete,
  className = '',
  gridClassName = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4',
  isShared = false,
  parentRoute,
  isClass = false,
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
            return (
              <GridQuizItem
                key={quiz._id}
                quiz={quiz}
                isShared={isShared}
                parentRoute={parentRoute}
                onDelete={onQuizDelete}
                isClass={isClass}
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
