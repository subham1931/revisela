'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Logo from '@/assets/icons/revisela-logo.png';

// ✅ Define props interface
interface NavbarProps {
  onLoginClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isOnAuthPage = pathname.includes('/auth');
  const [isScrolled, setIsScrolled] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-10 py-3 bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-none'
      }`}
    >
      {/* Logo */}
      <Image
        src={Logo}
        alt="Logo"
        className="w-[102px] cursor-pointer"
        onClick={() => router.push('/')}
        priority
      />

      {/* Navigation Links */}
      {!isOnAuthPage && (
        <div className="flex items-center gap-6">
          <div className="flex gap-6 text-[18px] font-medium">
            <button
              onClick={() => router.push('/')}
              className={`relative pb-1 transition-all duration-300 ${
                pathname === '/'
                  ? 'font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#0890A8]'
                  : 'text-gray-700 hover:text-[#0890A8]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => router.push('/contact')}
              className={`relative pb-1 transition-all duration-300 ${
                pathname === '/contact'
                  ? 'font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#0890A8]'
                  : 'text-gray-700 hover:text-[#0890A8]'
              }`}
            >
              Contact Us
            </button>
          </div>

          {/* Sign In Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onLoginClick}
              className="w-fit text-[18px] bg-[#0890A8] text-white hover:scale-105 transition-transform duration-300"
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
