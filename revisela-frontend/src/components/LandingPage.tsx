'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import React from 'react';
import { useAppSelector } from '@/store';
import MACBOOK_IMAGE from '@/assets/images/Macbook.png';

// ✅ Props interface
interface LandingPageProps {
  onGetStarted?: () => void;
}

const LANDING_IMAGE = '/images/landing-image.png';
// const MACBOOK_IMAGE = "/assets/Macbook.png"
const UNDERLINE_ICON = '/icons/underline-icon.svg';

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleGetStarted = () => {
    if (onGetStarted) {
      // Allow parent (like HomePage) to control modal opening
      onGetStarted();
    } else {
      // Fallback navigation behavior
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="w-full h-screen px-4 py-30 md:px-[10%] lg:px-[10%] bg-white">
        <div className="w-full h-full rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-2 lg:flex-row lg:gap-8">
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="relative mb-8">
              <h2 className="text-3xl font-bold my-2 lg:text-[3rem]">
                A simple tool{' '}
              </h2>
              <h2 className="text-3xl font-bold my-2 lg:text-[3rem]">
                to <span className="bg-[#F2FF5E] px-1">help you</span>
              </h2>
              <h2 className="text-3xl font-bold my-5 lg:text-[3rem]">
                <span className="bg-[#F2FF5E] px-1">revise</span> 📖{' '}
              </h2>
            </div>
          </div>

          <div className="w-full h-full md:w-1/2 flex justify-center p-4 md:p-8 rounded-lg">
            <Image
              priority
              height={400}
              width={600}
              src={MACBOOK_IMAGE}
              alt="Landing illustration"
              className="object-contain max-h-[600px] w-auto"
            />
          </div>
        </div>

        <div className="flex justify-center mt-5  w-fit mx-auto">
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-[#0890A8] text-white font-medium rounded-lg hover:transition-colors transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Three Options Section */}
      <div className="w-full text-center px-3 py-14 md:py-[60px] bg-gradient-to-br from-[#0b2323] via-[#0b2323] to-[#2d8989] text-white flex flex-col justify-center items-center gap-10">
        <div>
          <h3 className="text-2xl md:text-4xl font-bold lg:text-[2.4rem]">
            Three Options,
          </h3>
          <h3 className="text-2xl md:text-4xl font-bold lg:text-[2.4rem]">
            Countless Possibilities 🚀
          </h3>
        </div>

        <div className="flex w-[70%] justify-around items-start p-2">
          <div className="flex flex-col gap-3 items-start">
            {['Study Better', 'Learn Quicker', 'Get Higher Grades!'].map(
              (text, i) => (
                <p
                  key={i}
                  className="text-2xl md:text-4xl lg:text-4xl font-medium bg-gradient-to-r from-[#ce81da] via-[#ffce94] to-[#adf5c6] bg-clip-text text-transparent"
                >
                  {text}
                </p>
              )
            )}
          </div>

          <div className="flex flex-col justify-center gap-3">
            <div className="bg-orange-200 p-3 text-black rounded-md">
              Flashcards
            </div>
            <div className="bg-green-200 p-3 text-black rounded-md">
              Multiple Choice Questions (MCQ)
            </div>
            <div className="bg-pink-200 p-3 text-black rounded-md">Fill-In</div>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="mt-16 max-w-6xl mx-auto px-4 md:px-[1rem] lg:px-[2rem]">
        <h2 className="text-3xl font-bold text-center mb-10 lg:text-[3rem]">
          How to Use
        </h2>

        {/* Cards Section */}
        <div className="flex flex-col gap-8 md:gap-20 px-3">
          {/* Flashcards */}
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 p-4 md:p-8 bg-[#FFCE94] rounded-[20px]">
            <div className="w-full md:w-1/2 max-w-md flex flex-col gap-10 p-4 md:p-6">
              <h3 className="text-xl md:text-3xl font-bold">Flashcards</h3>
              <p>Create flashcards within minutes!</p>
              <p>Just add the text to be displayed on the front and back ✏️</p>
            </div>
            <div className="w-full md:w-1/2 max-w-[405px] aspect-[405/270] rounded-2xl overflow-hidden">
              <div className="bg-gray-200 h-full flex flex-col items-center justify-center shadow-md rounded-lg group cursor-pointer hover:bg-gray-300 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-primary-no bg-transparent fill-current text-gray-800 ml-1" />
                </div>
                <p className="text-gray-600 text-center font-medium">
                  Flashcard Demo Video
                </p>
              </div>
            </div>
          </div>

          {/* MCQ */}
          <div className="flex flex-col md:flex-row-reverse items-stretch justify-between gap-6 p-4 md:p-8 bg-[#ADF5C6] rounded-[20px]">
            <div className="w-full md:w-1/2 max-w-md flex flex-col gap-10 p-4 md:p-6">
              <h3 className="text-xl md:text-3xl font-bold">
                Multiple Choice Questions (MCQ)
              </h3>
              <p className="text-sm">Create MCQs seamlessly!</p>
              <p className="text-sm">
                Add your question, options, choose the correct option and done ✅
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-[405px] aspect-[405/270] rounded-2xl overflow-hidden">
              <div className="bg-gray-200 h-full flex flex-col items-center justify-center shadow-md rounded-lg group cursor-pointer hover:bg-gray-300 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-gray-800 ml-1 fill-current" />
                </div>
                <p className="text-gray-600 text-center font-medium">MCQ Demo Video</p>
              </div>
            </div>
          </div>

          {/* Fill-In */}
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 p-4 md:p-8 bg-[#FFCDFD] rounded-[20px]">
            <div className="w-full md:w-1/2 max-w-md flex flex-col gap-10 p-4 md:p-6">
              <h3 className="text-xl md:text-3xl font-bold">Fill-In</h3>
              <p className="text-sm">
                Create fill-in-the-blanks without breaking a sweat 😌
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-[405px] aspect-[405/270] rounded-2xl overflow-hidden">
              <div className="bg-gray-200 h-full flex flex-col items-center justify-center shadow-md rounded-lg group cursor-pointer hover:bg-gray-300 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-gray-800 ml-1 fill-current" />
                </div>
                <p className="text-gray-600 text-center font-medium">
                  Fill-In Demo Video
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-2xl md:text-4xl font-light">
              Create 📝 → Test 👍 → Check 📖 → Repeat 🔄
            </h2>
          </div>
        </div>
      </div>

      {/* Why Revisela Section */}
      <div className="bg-gray-100 text-center mt-16 px-4 py-12">
        <h3 className="text-2xl md:text-4xl font-bold lg:text-[2.4rem] mb-15">
          Why Revisela?
        </h3>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8 max-w-5xl mx-auto mb-15">
          {['It’s free!', 'Easy to use', 'No account required'].map(
            (text, i) => (
              <div
                key={i}
                className="flex-1 flex items-center gap-2 justify-center md:justify-start px-4 py-3 rounded-md"
              >
                <span className="text-green-500 text-2xl">✅</span>
                <span className="text-lg md:text-xl lg:text-[1.5rem]">
                  {text}
                </span>
              </div>
            )
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-primary-blue text-white font-medium rounded-md hover:bg-primary-blue/75 transition-all hover:scale-105"
          >
            Try Now
          </button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
