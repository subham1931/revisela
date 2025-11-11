'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  rightElement?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  className,
  name,
  label,
  rightElement,
  error,
  ...props
}) => {
  const rightElementRef = useRef<HTMLDivElement>(null);
  const [rightPadding, setRightPadding] = useState<number>(0);

  useEffect(() => {
    if (rightElement && rightElementRef.current) {
      // Get width of right element and add a small buffer (8px)
      const width = rightElementRef.current.offsetWidth + 8;
      setRightPadding(width);
    } else {
      setRightPadding(0);
    }
  }, [rightElement]);

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={name}
          className="block mb-[5px] text-[18px] text-[#444444]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            'w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-[#0890A8] focus:border-0 placeholder:text-[#ACACAC]',
            error ? 'border-red-500' : 'border-[#ACACAC]',
            className
          )}
          name={name}
          style={
            rightPadding > 0
              ? { paddingRight: `${rightPadding + 10}px` }
              : undefined
          }
          {...props}
        />
        {rightElement && (
          <div
            ref={rightElementRef}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
