// src/components/ui/TabSwitch.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface TabOption {
  value: string;
  label: string;
}

interface TabSwitchProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TabSwitch: React.FC<TabSwitchProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex bg-gray-100 p-0.5 rounded-xl w-full justify-center items-center',
        className
      )}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            className={cn(
              'py-2 px-4 font-medium rounded-xl transition-colors',
              isActive
                ? 'text-white'
                : 'text-gray-700 hover:bg-gray-200'
            )}
            style={{
              backgroundColor: isActive ? '#444444' : 'transparent',
            }}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitch;
