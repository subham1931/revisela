'use client';

import React from 'react';
import { Button } from '@/components/ui/Button'; // Adjust import path

export interface Quiz {
  id: string;
  title: string;
  // add more quiz fields if needed
}

interface QuizGridProps {
  quizzes: Quiz[];
  columns?: number; // Number of quizzes per row
  className?: string;
  onView?: (quizId: string) => void;
}

const QuizGrid: React.FC<QuizGridProps> = ({
  quizzes,
  columns = 3,
  className = '',
  onView,
}) => {
  const colsClass = `grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-4`;

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">No quizzes available.</div>
    );
  }

  return (
    <div className={`${className} grid ${colsClass}`}>
      {quizzes.map((q) => (
        <div
          key={q.id}
          className="bg-white p-4 border rounded-lg shadow-sm flex flex-col justify-between"
        >
          <h4 className="font-medium text-lg mb-2">{q.title}</h4>
          <div className="mt-auto flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(q.id)}
            >
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizGrid;
