'use client';

import React from 'react';

import { QuizSetProvider } from '@/components/ui/quiz/QuizSetContext';

import {
  BookmarkedSection,
  LibrarySection,
  RecentSection,
  SharedSection,
} from './_components';

const Dashboard = () => {
  return (
    <div className="space-y-10 w-full">
      <RecentSection />

      {/* LibrarySection inside dashboard */}
      <QuizSetProvider>
        <LibrarySection parentRoute="dashboard" /> {/* dynamic route */}
      </QuizSetProvider>

      <SharedSection />
      <BookmarkedSection />
    </div>
  );
};

export default Dashboard;
