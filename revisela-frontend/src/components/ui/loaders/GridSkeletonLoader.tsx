import React from 'react';

import SkeletonLoader from './SkeletonLoader';

interface GridSkeletonLoaderProps {
  type: 'folder' | 'quiz';
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * A grid skeleton loader for folder and quiz set grids
 */
export const GridSkeletonLoader: React.FC<GridSkeletonLoaderProps> = ({
  type = 'folder',
  count = 6,
  columns = 3,
  className = '',
}) => {
  // Define grid columns based on responsive design
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  // Folder item skeleton
  const renderFolderSkeleton = () => (
    <div className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse w-[20px] h-[20px] rounded-full"></div>
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-5 w-40 rounded"></div>
      </div>
      <div className="p-1 rounded-full">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse w-[18px] h-[18px] rounded-full"></div>
      </div>
    </div>
  );

  // Quiz item skeleton
  const renderQuizSkeleton = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col space-y-3">
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-6 w-4/5 rounded"></div>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-4 w-full rounded"></div>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-4 w-3/4 rounded"></div>
      <div className="flex items-center space-x-2 mt-2">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse w-7 h-7 rounded-full"></div>
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-4 w-24 rounded"></div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-6 w-16 rounded"></div>
        <div className="flex space-x-2">
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse w-8 h-8 rounded-full"></div>
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse w-8 h-8 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const items = Array(count)
    .fill(null)
    .map((_, index) => (
      <div key={index}>
        {type === 'folder' ? renderFolderSkeleton() : renderQuizSkeleton()}
      </div>
    ));

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {items}
    </div>
  );
};

export default GridSkeletonLoader;
