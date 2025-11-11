'use client';

import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { z } from 'zod';
import { useLogin } from '@/services/features/auth';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import GoogleIcon from '@/assets/icons/google.svg';
import MicrosoftIcon from '@/assets/icons/microsoft.svg';
import AuthVector from '@/assets/images/auth-screen-bg.svg';
import Logo from '@/assets/icons/revisela-logo.png';

import AuthNavbar from './AuthNavbar';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SigninProps {
  onClose: () => void;
  signupSuccess?: boolean;
  sessionExpired?: boolean;
}

const Signin: React.FC<SigninProps> = ({
  onClose,
  signupSuccess = false,
  sessionExpired = false,
}) => {
  const { mutate: login, isPending, error: apiError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          window.location.href = '/dashboard';
        },
      }
    );
  };

  return (
    <AnimatePresence>
      <>
        {/* Background Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Fullscreen Panel divided into 2 */}
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-white z-50 flex overflow-hidden"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* Left Side: Login Form + Navbar */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Navbar */}
            <div className="mb-6 bg-amber-500 w-full">
              <div
                className={` top-0 left-0 z-50 w-full flex items-center justify-between px-10 py-3 bg-white transition-shadow duration-300 
        `}
              >
                <Image
                  src={Logo}
                  alt="Logo"
                  className="w-[102px] cursor-pointer"
                />
                <div className="bg-[#F7F7F7] p-1">
                  <button
                    // onClick={() => setShowLogin(true)}
                    className="w-fit px-6 py-2 rounded-md text-[18px] bg-[#0890A8] text-white hover:scale-105 transition-transform duration-300"
                  >
                    Log In
                  </button>
                  <button
                    // onClick={() => setShowLogin(true)}
                    className="w-fit px-6 py-2 rounded text-[18px]  text-black shadow-none "
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="text-center w-full max-w-md mx-auto flex flex-col gap-6">
              <h2 className="text-3xl font-semibold text-[#0890A8]">
                Welcome Back 👋
              </h2>

              {/* Social Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="text-[16px] flex items-center gap-2 w-full h-[3.0625rem] border-[#E5E5E5]"
                >
                  <Image src={GoogleIcon} alt="Google" />
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-[16px] flex items-center gap-2 w-full h-[3.0625rem] border-[#E5E5E5]"
                >
                  <Image src={MicrosoftIcon} alt="Microsoft" />
                  Continue with Microsoft
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-[50%] h-[1px] bg-[#000]"></div>
                <p className="text-[18px] text-[#444444]">Or</p>
                <div className="w-[50%] h-[1px] bg-[#000]"></div>
              </div>

              {/* Messages */}
              {signupSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Account created successfully! Please log in.
                </div>
              )}
              {sessionExpired && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  Your session has expired. Please log in again.
                </div>
              )}
              {apiError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {apiError instanceof Error
                    ? apiError.message
                    : 'Login failed'}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <div className="flex items-center justify-between">
                  <Checkbox label="Remember me" {...register('rememberMe')} />
                  <a
                    href="?forget-password=true"
                    className="text-[18px] text-[#0890A8]"
                  >
                    Forgot Password?
                  </a>
                </div>
                <Button
                  type="submit"
                  className="bg-[#0890A8] text-white block w-full h-[3.0625rem]"
                  disabled={isPending}
                >
                  {isPending ? 'Logging in...' : 'Log In'}
                </Button>
              </form>

              <p className="text-center text-[14px] text-[#444444]">
                Don't have an account?{' '}
                <a href="?signup=true" className="text-[#0890A8]">
                  Sign up
                </a>
              </p>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="hidden md:flex flex-1 bg-[#0890A8] items-center justify-center">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-6 text-white hover:text-gray-900 transition-colors border rounded-full"
            >
              <X size={28} />
            </button>
            <Image
              src={AuthVector}
              alt="Auth Vector"
              className="object-contain max-h-full"
            />
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default Signin;
