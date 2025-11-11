import { cn } from '@/lib/utils';

import { LoadingSpinner } from './loaders/LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  loading?: boolean;
  loadingText?: string;
  loadingAnimation?: 'spin' | 'pulse' | 'dots' | 'bars' | 'ripple';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'md',
  className,
  disabled,
  loading,
  loadingText,
  loadingAnimation = 'spin',
  children,
  ...props
}) => {
  // Size mappings
  const sizeMap = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Spinner size mapping
  const spinnerSizeMap = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  const isDisabled = disabled || loading;
  const displayText = loading && loadingText ? loadingText : children;

  return (
    <button
      className={cn(
        // Base styles
        'font-medium transition-all duration-200 ease-in-out rounded-xl inline-flex items-center justify-center gap-2 relative overflow-hidden',

        // Size styles
        sizeMap[size],

        // Variant styles
        variant === 'solid'
          ? 'bg-primary-blue text-white shadow-sm hover:shadow-md'
          : 'border border-primary-blue text-primary-blue bg-transparent hover:bg-primary-blue/5',

        // State styles
        isDisabled
          ? 'bg-primary-blue-transparent text-white cursor-not-allowed opacity-80 shadow-none'
          : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',

        // Loading state
        loading && 'select-none',

        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading overlay for smooth transition */}
      {loading && (
        <div className="absolute inset-0 bg-inherit rounded-[0.625rem] flex items-center justify-center">
          <div className="flex items-center gap-2">
            <LoadingSpinner
              size={spinnerSizeMap[size]}
              variant={variant === 'solid' ? 'light' : 'primary'}
              animation={loadingAnimation}
            />
            {loadingText && (
              <span className="animate-pulse">{loadingText}</span>
            )}
          </div>
        </div>
      )}

      {/* Main content with opacity transition */}
      <div
        className={cn(
          'flex items-center gap-2 transition-opacity duration-200 ',
          loading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {displayText}
      </div>
    </button>
  );
};
