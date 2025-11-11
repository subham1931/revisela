import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Logo from '@/assets/icons/revisela-logo.png';

const Footer = () => {
  return (
    <div className="bg-[#00171F] w-full text-white p-10 flex flex-col gap-10">
      <div className=" w-full flex flex-col items-center justify-center gap-3">
        <h1 className="font-bold">Subscribe Our Newsletter</h1>
        <p>
          Keep up with all the cool stuff - upcoming features, discounts,
          marketing and more!
        </p>
        <div className="border border-white rounded-lg">
          <input
            type="email"
            name=""
            id=""
            placeholder="Email Address"
            className="w-100 outline-none p-2 rounded-l-lg"
          />
          <button className="bg-[#0890A8] p-2 rounded-r-lg border-l">
            Subscribe
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <Image
          src={Logo}
          alt="Revisela Logo"
          width={120}
          height={40}
          priority
        />

        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:underline">
            Home
          </Link>
          <Link href="/dashboard/terms" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
        </div>

        {/* Divider */}
        <hr className="w-full border-t border-gray-300 my-2" />

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © 2025 Revisela. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
