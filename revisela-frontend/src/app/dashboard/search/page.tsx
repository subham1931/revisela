'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGlobalSearch } from '@/services/features/library';
import { SearchNavbar } from './SearchNavbar';
import FolderItem from '@/components/ui/folder/FolderItem';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { ROUTES } from '@/constants/routes';
import { User as UserIcon, Users } from 'lucide-react';
import Image from 'next/image';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');

  // ✅ Debounce input so we don’t call API on every keystroke
  useEffect(() => {
    // If query comes from URL, update state
    const urlQuery = searchParams.get('query') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
      setDebouncedQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(handler);
  }, [query]);

  // ✅ Fetch only when debouncedQuery has value
  const { data, isLoading, isError } = useGlobalSearch(debouncedQuery);

  const { users = [], folders = [], quizzes = [], classes = [] } = data || {};

  const handleViewAll = (tab: string) => {
    setActiveTab(tab);
  };

  const renderSectionHeader = (title: string, count: number, tab: string) => (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-[#1F1F1F]">{title}</h2>
      <button
        onClick={() => handleViewAll(tab)}
        className="text-[#0890A8] text-sm font-semibold hover:underline"
      >
        View All
      </button>
    </div>
  );

  const renderUsers = (limit?: number) => {
    const displayUsers = limit ? users.slice(0, limit) : users;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayUsers.map((user) => (
          <div key={user._id} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition bg-white min-h-[80px]">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              {user.profileImage ? (
                <Image src={user.profileImage} alt={user.username} width={48} height={48} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="text-gray-500" size={24} />
              )}
            </div>
            {/* Info */}
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-[#1F1F1F] truncate text-base">{user.name}</h3>
              <p className="text-sm text-gray-500 truncate">@{user.username || 'username'}</p>
            </div>
            {/* Action */}
            <div className="text-gray-400">
              <Users size={20} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderFolders = (limit?: number) => {
    const displayFolders = limit ? folders.slice(0, limit) : folders;
    return (

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayFolders.map((folder) => (
          <FolderItem
            key={folder._id}
            id={folder._id}
            name={folder.name}
            onClick={() => router.push(`${ROUTES.DASHBOARD.LIBRARY}?folderId=${folder._id}`)}
            className="hover:shadow-md transition"
          />
        ))}
      </div>

    );
  };

  const renderClasses = (limit?: number) => {
    const displayClasses = limit ? classes.slice(0, limit) : classes;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayClasses.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between min-h-[140px]"
            onClick={() => router.push(`${ROUTES.DASHBOARD.CLASSES.ROOT}/${classItem._id}`)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2.5 rounded-lg text-green-700">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F1F1F] text-lg line-clamp-1">{classItem.name}</h3>
                  <p className="text-sm text-gray-500">{classItem.description || 'No description'}</p>
                </div>
              </div>
              <div className="text-gray-400">...</div>
            </div>
            {classItem.classCode && (
              <div className="mt-4">
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                  Code: {classItem.classCode}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderQuizzes = (limit?: number) => {
    const displayQuizzes = limit ? quizzes.slice(0, limit) : quizzes;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayQuizzes.map((quiz: any) => (
          <div key={quiz._id} className="h-full">
            <QuizCard
              id={quiz._id}
              title={quiz.title}
              description={quiz.description}
              tags={quiz.tags || []}
              rating={quiz.rating}
              isBookmarked={quiz.isBookmarked}
              user={quiz.creator || quiz.createdBy ? {
                name: (quiz.creator || quiz.createdBy).name,
                profileImage: undefined
              } : undefined}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    const hasResults = users.length > 0 || folders.length > 0 || quizzes.length > 0 || classes.length > 0;

    if (isLoading) {
      return <p className="text-gray-500 text-center mt-10">Loading results...</p>;
    }
    if (isError) {
      return <p className="text-red-500 text-center mt-10">Failed to load search results.</p>;
    }
    if (!debouncedQuery) {
      return <p className="text-gray-400 text-center mt-10">Start typing to search...</p>;
    }
    if (!hasResults) {
      return <p className="text-gray-500 text-center mt-10">No results found for "{debouncedQuery}".</p>;
    }

    // Specific Tabs
    if (activeTab === 'users') {
      return users.length > 0 ? <div className="mt-6">{renderUsers()}</div> : <p className="text-gray-500 text-center mt-10">No users found.</p>;
    }
    if (activeTab === 'folders') {
      return folders.length > 0 ? <div className="mt-6">{renderFolders()}</div> : <p className="text-gray-500 text-center mt-10">No folders found.</p>;
    }
    if (activeTab === 'classes') {
      return classes.length > 0 ? <div className="mt-6 ">{renderClasses()}</div> : <p className="text-gray-500 text-center mt-10">No classes found.</p>;
    }
    if (activeTab === 'quizzes') {
      return quizzes.length > 0 ? <div className="mt-6 ">{renderQuizzes()}</div> : <p className="text-gray-500 text-center mt-10">No quiz sets found.</p>;
    }

    // 'All' Tab - Stacked View
    return (
      <div className="space-y-8 mt-6 ">
        {folders.length > 0 && (
          <section>
            {renderSectionHeader('Folders', folders.length, 'folders')}
            {renderFolders(3)}
          </section>
        )}

        {quizzes.length > 0 && (
          <section>
            {renderSectionHeader('Quiz Sets', quizzes.length, 'quizzes')}
            {renderQuizzes(3)}
          </section>
        )}

        {classes.length > 0 && (
          <section>
            {renderSectionHeader('Classes', classes.length, 'classes')}
            {renderClasses(3)}
          </section>
        )}

        {users.length > 0 && (
          <section>
            {renderSectionHeader('Users', users.length, 'users')}
            {renderUsers(3)}
          </section>
        )}
      </div>
    );
  };

  return (
    <div className=" max-w-7xl mx-auto min-h-[calc(100vh-80px)] w-full ">
      {/* Search Header */}
      {debouncedQuery && (
        <>
          <h1 className="text-2xl font-normal text-[#1F1F1F] mb-6">
            Showing results for “<span className="font-semibold">{debouncedQuery}</span>”
          </h1>
          <SearchNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}

      <div className="w-full">
        {renderContent()}
      </div>

      {!debouncedQuery && (
        <p className="text-gray-400 text-center mt-10">
          Start typing to search...
        </p>
      )}
    </div>
  );
};

export default SearchPage;
