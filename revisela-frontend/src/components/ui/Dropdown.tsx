'use client';

import React from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/utils';

export interface DropdownItem {
  label: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: 'separator';
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'end',
  className,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="cursor-pointer">{trigger}</div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'min-w-[210px] bg-white rounded-xl p-1 shadow-md',
            'will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade',
            'z-[200]  ring-opacity-5',
            className
          )}
          sideOffset={5}
          align={align}
          avoidCollisions
        >
          {items.map((item, index) => {
            if (item.type === 'separator') {
              return (
                <DropdownMenu.Separator
                  key={index}
                  className="h-px my-1 bg-gray-200"
                />
              );
            }

            return (
              <DropdownMenu.Item
                key={index}
                className={cn(
                  'relative flex cursor-default select-none items-center rounded-lg px-4 py-2 text-sm outline-none transition-colors',
                  'focus:bg-gray-100 focus:text-gray-900',
                  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                  item.className
                )}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
