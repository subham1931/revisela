'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';

import RootNavbar from './navbar';
import Sidebar from './sidebar';
import Footer from './Footer';

type Props = {
  children: React.ReactNode;
};

const LayoutWrapper = ({ children }: Props) => {
  const pathname = usePathname();

  const isOnAuthPage = pathname.startsWith('/auth');
  const isOnDashboardPage = pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAFAFA] overflow-x-hidden">
      {!isOnAuthPage && isOnDashboardPage ? <RootNavbar /> : null}

      <div className="flex flex-1">
        {!isOnAuthPage && isOnDashboardPage ? (
          // This sidebar is w-64 (16rem) wide
          <aside className="fixed top-[4.5rem] h-fit max-h-[calc(100vh-5rem-5rem)] w-54  bg-[#FAFAFA] overflow-y-auto hide-scrollbar">
            <Sidebar />
          </aside>
        ) : null}

        {/* ✅ Main content needs a left margin to match the sidebar's width */}
        <div
          className={cn(
            'relative flex-1 w-full',
            // CRITICAL FIX: Change ml-5 to ml-64
            // This pushes the content container to the right of the sidebar
            !isOnAuthPage && isOnDashboardPage && 'ml-55' 
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutWrapper;