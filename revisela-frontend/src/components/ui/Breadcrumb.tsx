'use client';

import Link from 'next/link';
import React from 'react';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  separator = <ChevronRight size={20} className="text-[#444444] mx-1" />,
}) => {
  if (!items.length) return null;

  return (
    <nav className={cn('flex items-center', className)} aria-label="Breadcrumb">
      <ol className="flex items-center ">
        {items.map((item, index) => {
          const isLast = items.length > 1 && index === items.length - 1;

          // Create the breadcrumb item content
          const itemContent = (
            <div className="flex items-center gap-2">
              {item.icon}
              <span
                className={cn(
                  'text-2xl text-[#0890A8] font-bold',
                  isLast && 'hover:opacity-75 font-medium'
                )}
              >
                {item.label}
              </span>
            </div>
          );

          return (
            <li key={index} className="flex items-center ">
              {index > 0 && separator}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center hover:underline cursor-pointer"
                  aria-current={item.isCurrent ? 'page' : undefined}
                >
                  {itemContent}
                </Link>
              ) : (
                <div
                  className={cn(
                    'flex items-center',
                    item.onClick && 'cursor-pointer'
                  )}
                  onClick={item.onClick}
                  aria-current={item.isCurrent ? 'page' : undefined}
                >
                  {itemContent}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
