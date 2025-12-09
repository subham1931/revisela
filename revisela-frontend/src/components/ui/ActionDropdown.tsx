'use client';

import React, { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Dropdown } from './Dropdown';

export interface ActionDropdownItem {
  label: ReactNode;
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  className?: string;
}

interface ActionDropdownProps {
  items: ActionDropdownItem[];
  align?: 'start' | 'center' | 'end';
  className?: string;
  triggerIcon?: ReactNode;
  triggerName?: string; // optional name label
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  items,
  align = 'end',
  className,
  triggerIcon,
  triggerName,
}) => {
  // Transform action items to dropdown items
  const dropdownItems = items.map((item) => ({
    label: (
      <div className="flex items-center">
        {item.icon && <span className="mr-2">{item.icon}</span>}
        <span>{item.label}</span>
      </div>
    ),
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      item.onClick?.(e);
    },
    className:
      item.className ?? (item.variant === 'danger' ? 'text-red-500' : ''),
    disabled: item.disabled,
  }));

  return (
    <Dropdown
      trigger={
        <button
          className="flex items-center text-[#444444] p-1 rounded-full hover:bg-gray-100 space-x-1"
          onClick={(e) => e.stopPropagation()}
        >
          {triggerName && <span className="text-sm font-medium">{triggerName}</span>}
          {triggerIcon || <MoreHorizontal size={18} />}
        </button>
      }
      items={dropdownItems}
      align={align}
      className={className}
    />
  );
};
