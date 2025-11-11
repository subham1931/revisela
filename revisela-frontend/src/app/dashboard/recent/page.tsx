'use client';

import React from 'react';

import { QuizSetItem } from '../library/components';

export default function RecentPage() {
  // Mock quiz sets data - use the same data as in RecentSection or fetch from API
  const recentQuizSets = [
    {
      id: '1',
      title: 'IB Calculus',
      description:
        'Designed for both SL and HL students, this set covers key topics such as limits, differentiation, and integration, along with their real-world applications.',
      tags: ['Maths', 'IB', 'Calculus'],
      creator: { name: 'Sam Smith', isCurrentUser: false },
      rating: 2,
      isBookmarked: false,
    },
    {
      id: '2',
      title: 'IB Calculus',
      description:
        'Designed for both SL and HL students, this set covers key topics such as limits, differentiation, and integration, along with their real-world applications.',
      tags: ['Maths', 'IB', 'Calculus'],
      creator: { name: 'Sam Smith', isCurrentUser: false },
      rating: 2,
      isBookmarked: false,
    },
    {
      id: '3',
      title: 'IB Calculus',
      description:
        'Designed for both SL and HL students, this set covers key topics such as limits, differentiation, and integration, along with their real-world applications.',
      tags: ['Maths', 'IB', 'Calculus'],
      creator: { name: 'John Doe', isCurrentUser: false },
      rating: 2,
      isBookmarked: false,
    },
    // Add more items to match your image
  ];

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-1 text-[#0890A8]">Recent</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentQuizSets.map((quizSet) => (
          <QuizSetItem
            key={quizSet.id}
            title={quizSet.title}
            description={quizSet.description}
            tags={quizSet.tags}
            creator={quizSet.creator}
            rating={quizSet.rating}
            isBookmarked={quizSet.isBookmarked}
          />
        ))}
      </div>
    </div>
  );
}
