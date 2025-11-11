import React from 'react';

interface SkeletonLoaderProps {
  type?:
    | 'card'
    | 'text'
    | 'circle'
    | 'button'
    | 'input'
    | 'avatar'
    | 'folder'
    | 'quiz';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

/**
 * Skeleton loader component for placeholder content during loading
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const baseClasses =
    'animate-pulse bg-gradient-to-r from-light-gray to-lightest-gray rounded';

  // Define common predefined styles
  const typeStyles = {
    text: 'h-4 w-full rounded',
    card: 'h-36 w-full rounded-lg',
    circle: 'rounded-full h-12 w-12',
    button: 'h-10 w-32 rounded-md',
    input: 'h-10 w-full rounded-md',
    avatar: 'h-12 w-12 rounded-full',
    folder: 'h-12 w-full rounded-lg',
    quiz: 'h-56 w-full rounded-lg',
  };

  // Custom dimensions if provided
  const style = {
    width: width ? width : '',
    height: height ? height : '',
  };

  // Create multiple skeletons if count > 1
  const renderSkeletons = () => {
    return Array(count)
      .fill(null)
      .map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${typeStyles[type]} ${className}`}
          style={style}
          aria-hidden="true"
        />
      ));
  };

  return (
    <div className={`space-y-${count > 1 ? '3' : '0'} w-full`}>
      {renderSkeletons()}
    </div>
  );
};

export default SkeletonLoader;
