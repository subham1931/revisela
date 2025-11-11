import React from 'react';

interface ChevronRightIconProps {
  className?: string;
}

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M7 3L17.0012 12.0021L7 21.0042"
        stroke="#444444"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronRightIcon;
