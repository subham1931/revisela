import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'light';
  animation?: 'spin' | 'pulse' | 'dots' | 'bars' | 'ripple';
  className?: string;
}

/**
 * A beautiful animated loading spinner component with multiple animation variants
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  animation = 'spin',
  className = '',
}) => {
  // Size mappings
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Color mappings
  const colorMap = {
    primary: '#0890A8',
    secondary: '#444444',
    light: '#FFFFFF',
  };

  const currentColor = colorMap[variant];

  // Render different animation types
  const renderAnimation = () => {
    switch (animation) {
      case 'spin':
        return (
          <div
            className={`${sizeMap[size]} animate-smooth-spin rounded-full border-2 border-transparent ${className}`}
            style={{
              borderTopColor: currentColor,
              borderRightColor: `${currentColor}40`,
            }}
            role="status"
            aria-label="loading"
          />
        );

      case 'pulse':
        return (
          <div
            className={`${sizeMap[size]} rounded-full animate-smooth-pulse ${className}`}
            style={{ backgroundColor: currentColor }}
            role="status"
            aria-label="loading"
          />
        );

      case 'dots':
        return (
          <div
            className={`flex items-center justify-center space-x-1 ${className}`}
            role="status"
            aria-label="loading"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full animate-loading-dots`}
                style={{
                  backgroundColor: currentColor,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div
            className={`flex items-end justify-center space-x-1 ${className}`}
            role="status"
            aria-label="loading"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${size === 'xs' ? 'w-0.5' : size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : size === 'lg' ? 'w-2' : 'w-3'} animate-loading-bars rounded-sm`}
                style={{
                  backgroundColor: currentColor,
                  height:
                    size === 'xs'
                      ? '8px'
                      : size === 'sm'
                        ? '12px'
                        : size === 'md'
                          ? '16px'
                          : size === 'lg'
                            ? '24px'
                            : '32px',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        );

      case 'ripple':
        return (
          <div
            className={`${sizeMap[size]} relative ${className}`}
            role="status"
            aria-label="loading"
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-2 animate-ripple"
                style={{
                  borderColor: currentColor,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        );

      default:
        return (
          <div
            className={`${sizeMap[size]} animate-smooth-spin rounded-full border-2 border-transparent ${className}`}
            style={{
              borderTopColor: currentColor,
              borderRightColor: `${currentColor}40`,
            }}
            role="status"
            aria-label="loading"
          />
        );
    }
  };

  return renderAnimation();
};

export default LoadingSpinner;
