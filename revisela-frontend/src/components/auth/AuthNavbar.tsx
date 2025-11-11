import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';

import Logo from '@/assets/icons/revisela-logo.png';

const AuthNavbar = () => {
  // const router = useRouter()
  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => setIsScrolled(window.scrollY > 10);
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);
  return (
    <div
      className={` top-0 left-0 z-50 w-full flex items-center justify-between px-10 py-3 bg-white transition-shadow duration-300 
        `}
    >
      <Image src={Logo} alt="Logo" className="w-[102px] cursor-pointer" />
      <div className='bg-gray-200 p-1'>
        <Button
          // onClick={() => setShowLogin(true)}
          className="w-fit text-[18px] bg-[#0890A8] text-white hover:scale-105 transition-transform duration-300"
        >
          Log In
        </Button>
        <Button
          // onClick={() => setShowLogin(true)}
          className="w-fit text-[18px] bg-[#0890A8] text-white hover:scale-105 transition-transform duration-300"
        >
          Sign Up
        </Button>
        <button className='className="w-fit text-[18px] bg-[#0890A8] text-white hover:scale-105 transition-transform duration-300"'>g</button>
      </div>
    </div>
  );
};

export default AuthNavbar;
