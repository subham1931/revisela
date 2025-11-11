import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  error?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      checked,
      onCheckedChange,
      error,
      ...props
    },
    ref
  ) => {
    const handleToggle = () => {
      if (onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {label && (
              <label className="text-[18px] text-secondary-black">
                {label}
              </label>
            )}
            {description && (
              <p className="text-[18px] text-neutral-gray">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={`cursor-pointer relative w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
              checked ? 'bg-[#0890A8] justify-end' : 'bg-gray-300 justify-start'
            }`}
            aria-checked={checked}
            role="switch"
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 mx-0.5`}
            ></span>
            <input
              type="checkbox"
              className="sr-only"
              ref={ref}
              checked={checked}
              onChange={handleToggle}
              {...props}
            />
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
