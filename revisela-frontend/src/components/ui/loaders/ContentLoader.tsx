import React from 'react';

import LoadingSpinner from './LoadingSpinner';

interface ContentLoaderProps {
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'light';
  className?: string;
  spinnerClassName?: string;
  fullScreen?: boolean;
}

/**
 * A content loader component with spinner and message
 */
export const ContentLoader: React.FC<ContentLoaderProps> = ({
  message = 'Loading...',
  size = 'lg',
  variant = 'primary',
  className = '',
  spinnerClassName = '',
  fullScreen = false,
}) => {
  const wrapperClasses = fullScreen
    ? 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm'
    : 'w-full';

  return (
    <div
      className={`${wrapperClasses} flex flex-col items-center justify-center p-6 ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <LoadingSpinner
          size={size}
          variant={variant}
          className={spinnerClassName}
        />

        {message && (
          <p className="text-secondary-black font-medium text-center animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentLoader;
