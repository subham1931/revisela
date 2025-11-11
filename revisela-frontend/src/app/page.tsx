'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import LandingPage from '@/components/LandingPage';
import AuthModal from '@/components/auth/AuthModal';
import Footer from '@/components/layout/Footer';
import Navbar from './auth/components/navbar';

const HomePage: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);

  return (
    <div className="w-full">
      {/* Pass handler so Navbar can trigger login modal */}
      <Navbar onLoginClick={() => setShowLogin(true)} />

      {/* Pass handler so LandingPage can also trigger login modal */}
      <LandingPage onGetStarted={() => setShowLogin(true)} />

      <Footer />

      {/* AnimatePresence for modal transitions */}
      <AnimatePresence>
        {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
