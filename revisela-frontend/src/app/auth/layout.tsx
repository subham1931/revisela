import Image from 'next/image';
import React, { PropsWithChildren } from 'react';

import AuthVector from '@/assets/images/auth-screen-bg.svg';

import Navbar from './components/navbar';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="bg-primary-white-1 flex items-center h-screen w-screen overflow-hidden">
      <div className="h-full w-full flex-1 overflow-y-auto hide-scrollbar">
        <Navbar />
        {children}
      </div>
      {/* Hide on mobile screens (under md breakpoint) */}
      <div className="hidden md:flex flex-1 bg-[#0890A8] items-center justify-center h-screen">
        <Image src={AuthVector} alt="Auth Vector" />
      </div>
    </main>
  );
};

export default Layout;
