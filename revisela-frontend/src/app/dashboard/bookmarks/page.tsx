'use client';

import React, { useState } from 'react';

import { Folder } from 'lucide-react';

import { useBookmarkedFolders } from '@/services/features/folders';
import { useBookmarkedQuizzes } from '@/services/features/quizzes';

import { FolderItem } from '@/components/ui/folder';
import QuizCard from '@/components/ui/quiz/QuizCard';

import { ROUTES } from '@/constants/routes';

export default function BookmarksPage() {
  const [currentFolder, setCurrentFolder] = useState('All Bookmarks');

  const { data: bookmarkedFolders = [], isLoading: foldersLoading } =
    useBookmarkedFolders();

  const { data: bookmarkedQuizzesResponse, isLoading: quizzesLoading } =
    useBookmarkedQuizzes();

  // Unified empty-state condition
  const noBookmarks =
    !foldersLoading &&
    !quizzesLoading &&
    bookmarkedFolders.length === 0 &&
    (bookmarkedQuizzesResponse?.length ?? 0) === 0;

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
                {bookmarkedFolders.map((folder: any) => (
                  <FolderItem
                    key={folder._id}
                    id={folder._id}
                    name={folder.name}
                    isBookmarked={true}
                    onClick={() => setCurrentFolder(folder.name)}
                  />
                ))}
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
            ) : bookmarkedQuizzesResponse?.length === 0 ? null : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bookmarkedQuizzesResponse.map((quizSet: any) => (
                  <QuizCard
                    key={quizSet._id}
                    id={quizSet._id}
                    title={quizSet.title}
                    description={quizSet.description || ''}
                    tags={quizSet.tags || []}
                    creator={{
                      name: quizSet.createdBy?.name || 'Unknown',
                      isCurrentUser: false,
                    }}
                    rating={quizSet.rating}
                    isBookmarked={true}
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
