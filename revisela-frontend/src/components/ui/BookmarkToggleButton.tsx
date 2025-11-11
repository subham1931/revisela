import React from 'react';

import { Bookmark } from 'lucide-react';

interface BookmarkToggleButtonProps {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
  className?: string;
  title?: string;
}

const BookmarkToggleButton: React.FC<BookmarkToggleButtonProps> = ({
  isBookmarked,
  onClick,
  size = 18,
  className = '',
  title,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      title={title || (isBookmarked ? 'Remove bookmark' : 'Add bookmark')}
    >
      {isBookmarked ? (
        <Bookmark
          size={size}
          className="text-[#0890A8] fill-[#0890A8]"
          strokeWidth={1.5}
        />
      ) : (
        <Bookmark
          size={size}
          className="text-[#444444] hover:text-[#0890A8]"
          strokeWidth={1.5}
        />
      )}
    </button>
  );
};

export default BookmarkToggleButton;
