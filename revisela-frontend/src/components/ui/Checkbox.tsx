import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              'h-4 w-4 text-[#0890A8] focus:ring-[#0890A8] border-gray-300 rounded',
              error && 'border-red-500'
            )}
            {...props}
          />
          {label && (
            <label className="text-[18px] cursor-pointer text-[#444444] select-none">
              {label}
            </label>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
