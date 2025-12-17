'use client';

import React, { useState } from 'react';

import { Folder } from 'lucide-react';

import { useBookmarkedFolders } from '@/services/features/folders';
import { useBookmarkedQuizzes } from '@/services/features/quizzes';

import { FolderItem } from '@/components/ui/folder';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';
import { useUser } from '@/services/features/users';

import { ROUTES } from '@/constants/routes';


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
      user={{
        name: creatorName,
        profileImage: creator?.profileImage,
      }}
      rating={quiz.rating}
      isBookmarked={true}
      isShared={isShared}
      parentRoute="dashboard/bookmarks"
    />
  );
};

export default function BookmarksPage() {
  const [currentFolder, setCurrentFolder] = useState('All Bookmarks');
  const currentUser = useAppSelector(selectUser);

  const { data: bookmarkedFolders = [], isLoading: foldersLoading } =
    useBookmarkedFolders();

  const { data: bookmarkedQuizzesResponse, isLoading: quizzesLoading } =
    useBookmarkedQuizzes();

  // Unified empty-state condition
  const bookmarkedQuizzes = bookmarkedQuizzesResponse || [];
  const noBookmarks =
    !foldersLoading &&
    !quizzesLoading &&
    bookmarkedFolders.length === 0 &&
    bookmarkedQuizzes.length === 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-bold mb-1 text-[#0890A8]">Bookmarked</h1>
      </div>

      {/* Unified empty state */}
      {noBookmarks ? (
        <div className=" flex flex-col items-center justify-center h-[60vh] text-center text-gray-600">
          You don't have any bookmarked items yet.
        </div>
      ) : (
        <>
          {/* Folders Section */}
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#444444] mb-4">Folders</h2>

            {foldersLoading ? (
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <p className="text-gray-500">Loading bookmarked folders...</p>
              </div>
            ) : bookmarkedFolders.length === 0 ? null : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bookmarkedFolders.map((folder: any) => {
                  const ownerId = typeof folder.owner === 'string' ? folder.owner : folder.owner?._id;
                  const isFolderShared = currentUser && ownerId && ownerId !== (currentUser.id || currentUser._id);

                  return (
                    <FolderItem
                      key={folder._id}
                      id={folder._id}
                      name={folder.name}
                      isBookmarked={true}
                      isShared={isFolderShared}
                      onClick={() => setCurrentFolder(folder.name)}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* Quiz Sets Section */}
          <section>
            <h2 className="text-xl font-medium text-[#444444] mb-4">
              Quiz Sets
            </h2>

            {quizzesLoading ? (
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <p className="text-gray-500">Loading bookmarked quizzes...</p>
              </div>
            ) : bookmarkedQuizzes.length === 0 ? null : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bookmarkedQuizzes.map((quizSet: any) => (
                  <BookmarkedQuizItem
                    key={quizSet._id}
                    quiz={quizSet}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
