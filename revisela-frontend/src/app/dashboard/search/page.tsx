'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchQuizzes } from '@/services/features/library';
import { SearchNavbar } from './SearchNavbar';

const SearchPage = () => {
  const params = useSearchParams();
  const initialQuery = params.get('query') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const limit = 10;

  // ✅ Debounce input so we don’t call API on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(handler);
  }, [query]);

  // ✅ Fetch only when debouncedQuery has value
  const { data, isLoading, isError } = useSearchQuizzes(
    debouncedQuery,
    limit,
    offset
  );

  const { results = [], totalCount = 0 } = data || {};

  // ✅ Reset offset when query changes
  useEffect(() => {
    setOffset(0);
  }, [debouncedQuery]);

  const renderContent = () => {
    if (activeTab === 'folders') {
      return (
        <div className="text-center mt-10 text-gray-500">
          <p>Folder search coming soon.</p>
        </div>
      );
    }
    if (activeTab === 'classes') {
      return (
        <div className="text-center mt-10 text-gray-500">
          <p>Class search coming soon.</p>
        </div>
      );
    }
    if (activeTab === 'users') {
      return (
        <div className="text-center mt-10 text-gray-500">
          <p>User search coming soon.</p>
        </div>
      );
    }

    // Default (all or quizzes) - Show Quizzes for now
    return (
      <>
        {isLoading && (
          <p className="text-gray-500 text-center mt-10">Loading...</p>
        )}

        {isError && (
          <p className="text-red-500 text-center mt-10">
            Failed to load results.
          </p>
        )}

        {!isLoading && !isError && results.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No quizzes found for “{debouncedQuery}”.
          </p>
        )}

        {results.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((quiz) => (
                <div
                  key={quiz._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <h2 className="font-semibold text-lg truncate">
                    {quiz.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {quiz.description || 'No description provided.'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Questions: {quiz.questionCount ?? 0}
                  </p>
                </div>
              ))}
            </div>

            {results.length < totalCount && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setOffset((prev) => prev + limit)}
                  className="px-5 py-2 bg-[#0890A8] text-white rounded-lg hover:bg-[#067b8e] transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-6">
      {/* Empty input → show nothing */}
      {!debouncedQuery && (
        <p className="text-gray-400 text-center mt-10">
          Start typing to search...
        </p>
      )}

      {/* Show results only when query exists */}
      {debouncedQuery && (
        <>
          <h1 className="text-2xl font-medium mb-4 text-[#444444]">
            Showing results for “{debouncedQuery}”
          </h1>

          <SearchNavbar activeTab={activeTab} onTabChange={setActiveTab} />

          {renderContent()}
        </>
      )}
    </div>
  );
};

export default SearchPage;
