'use client';

import Image from 'next/image';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, X } from 'lucide-react';
import { z } from 'zod';

import { useLogin, useSignup } from '@/services/features/auth';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { DateInput } from '@/components/ui/DateInput';
import { Input } from '@/components/ui/Input';

import GoogleIcon from '@/assets/icons/google.svg';
import MicrosoftIcon from '@/assets/icons/microsoft.svg';
import Logo from '@/assets/icons/revisela-logo.png';
import AuthVector from '@/assets/images/auth-screen-bg.svg';

import ForgotPasswordForm from './ForgotPasswordForm';
import { useRouter } from 'next/navigation';

// ✅ Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  birthday: z.object({
    day: z.string().min(1, 'Required'),
    month: z.string().min(1, 'Required'),
    year: z.string().min(1, 'Required'),
  }),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
  }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// ✅ Types
type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  // 👇 State to manage which page to show
  const [page, setPage] = React.useState<'login' | 'signup' | 'forgot'>(
    'login'
  );
const router = useRouter();
  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [showSignupPassword, setShowSignupPassword] = React.useState(false);

  // Forgot password specific
  const [otpSent, setOtpSent] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Hooks
  const {
    mutate: login,
    isPending: loginPending,
    error: loginError,
  } = useLogin();
  const {
    mutate: signup,
    isPending: signupPending,
    error: signupError,
  } = useSignup();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', username: '', email: '', password: '' },
  });

  const forgotForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleLogin = (data: LoginFormData) => {
    login(
      { email: data.email, password: data.password },
      { onSuccess: () => (window.location.href = '/dashboard') }
    );
  };

  const handleSignup = (data: SignupFormData) => {
    const birthdayStr = data.birthday
      ? `${data.birthday.year}-${data.birthday.month}-${data.birthday.day}`
      : undefined;
    signup(
      {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        birthday: birthdayStr,
      },
      { onSuccess: () => setPage('login') }
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

        {/* Modal Wrapper */}
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-white z-50 flex overflow-hidden"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* Left Side */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden relative">
            {/* Header Tabs */}
            <div className="mb-6 w-full flex items-center justify-between px-10 py-3 bg-white">
              <Image
                src={Logo}
                alt="Logo"
                className="w-[102px] cursor-pointer"
                onClick={() => router.push('/')}
                priority
              />
              <div className="relative flex gap-2 bg-[#F7F7F7] p-1 rounded-md">
                <motion.div
                  layout
                  className="absolute top-0 left-0 h-full bg-[#0890A8] rounded-md"
                  style={{
                    width: page === 'forgot' ? 0 : 'calc(50% - 4px)',
                    left:
                      page === 'login'
                        ? '2px'
                        : page === 'signup'
                          ? 'calc(50% + 2px)'
                          : '2px',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <button
                  onClick={() => setPage('login')}
                  className={`relative z-10 px-6 py-2 rounded-md text-[18px] ${
                    page === 'login' ? 'text-white' : 'text-black'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setPage('signup')}
                  className={`relative z-10 px-6 py-2 rounded-md text-[18px] ${
                    page === 'signup' ? 'text-white' : 'text-black'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Animated Content */}
            <div className="relative w-full flex-1 flex items-start justify-center overflow-auto scrollbar-none">
              <AnimatePresence mode="wait">
                {/* LOGIN */}
                {page === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    className="w-full max-w-xl mx-auto flex flex-col gap-6 mt-10"
                  >
                    <p className="text-center">
                      Back so soon? We knew you couldn't stay away.
                    </p>

                    {/* Social Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Image src={GoogleIcon} alt="Google" /> Continue with
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Image src={MicrosoftIcon} alt="Microsoft" /> Continue
                        with Microsoft
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-4">
                      <div className="flex-1 h-[1px] bg-gray-300"></div>
                      <span className="text-gray-500 font-medium">Or</span>
                      <div className="flex-1 h-[1px] bg-gray-300"></div>
                    </div>

                    {/* Login Form */}
                    <form
                      onSubmit={loginForm.handleSubmit(handleLogin)}
                      className="flex flex-col gap-4"
                    >
                      <Input
                        label="Email"
                        placeholder="Enter your email"
                        {...loginForm.register('email')}
                        error={loginForm.formState.errors.email?.message}
                      />
                      <div className="relative">
                        <Input
                          label="Password"
                          placeholder="Enter your password"
                          type={showLoginPassword ? 'text' : 'password'}
                          {...loginForm.register('password')}
                          error={loginForm.formState.errors.password?.message}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                          className="absolute right-3 top-[38px] text-gray-500"
                        >
                          {showLoginPassword ? <Eye /> : <EyeOff />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Checkbox
                          label="Remember me"
                          {...loginForm.register('rememberMe')}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPage('forgot');
                            setOtpSent(false);
                          }}
                          className="text-[#0890A8] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <Button
                        type="submit"
                        disabled={loginPending}
                        className="bg-[#0890A8] w-2/4 mx-auto"
                      >
                        {loginPending ? 'Logging in...' : 'Log In'}
                      </Button>
                      {loginError && (
                        <p className="text-red-500 text-center">
                          {loginError instanceof Error
                            ? loginError.message
                            : 'Login failed'}
                        </p>
                      )}
                    </form>
                  </motion.div>
                )}

                {/* SIGNUP */}
                {page === 'signup' && (
                  <motion.div
                    key="signup"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    className="w-full max-w-xl mx-auto flex flex-col gap-6 mt-4"
                  >
                    <p className="text-center">
                      Join the study squad! We promise it’s more fun than it
                      sounds.
                    </p>
                    {/* Social */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Image src={GoogleIcon} alt="Google" /> Continue with
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Image src={MicrosoftIcon} alt="Microsoft" /> Continue
                        with Microsoft
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-4">
                      <div className="flex-1 h-[1px] bg-gray-300"></div>
                      <span className="text-gray-500 font-medium">Or</span>
                      <div className="flex-1 h-[1px] bg-gray-300"></div>
                    </div>

                    {/* Signup Form */}
                    <form
                      onSubmit={signupForm.handleSubmit(handleSignup)}
                      className="flex flex-col gap-4"
                    >
                      <Input
                        label="Name"
                        placeholder="Enter your name"
                        {...signupForm.register('name')}
                        error={signupForm.formState.errors.name?.message}
                      />
                      <Input
                        label="Username"
                        placeholder="Choose a username"
                        {...signupForm.register('username')}
                        error={signupForm.formState.errors.username?.message}
                      />
                      <Controller
                        name="birthday"
                        control={signupForm.control}
                        render={({ field }) => (
                          <DateInput
                            label="Birthday"
                            onChange={(dateValues) =>
                              field.onChange(dateValues)
                            }
                            error={
                              signupForm.formState.errors.birthday?.day
                                ?.message ||
                              signupForm.formState.errors.birthday?.month
                                ?.message ||
                              signupForm.formState.errors.birthday?.year
                                ?.message
                            }
                          />
                        )}
                      />
                      <Input
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        {...signupForm.register('email')}
                        error={signupForm.formState.errors.email?.message}
                      />
                      <div className="relative">
                        <Input
                          label="Password"
                          placeholder="Enter your password"
                          type={showSignupPassword ? 'text' : 'password'}
                          {...signupForm.register('password')}
                          error={signupForm.formState.errors.password?.message}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                          className="absolute right-3 top-[38px] text-gray-500"
                        >
                          {showSignupPassword ? <Eye /> : <EyeOff />}
                        </button>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          label="I agree to the Terms of Service and Privacy Policy"
                          {...signupForm.register('agreeToTerms')}
                          error={
                            signupForm.formState.errors.agreeToTerms?.message
                          }
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={signupPending}
                        className="bg-[#0890A8] w-2/4 mx-auto"
                      >
                        {signupPending ? 'Creating account...' : 'Sign Up'}
                      </Button>
                      {signupError && (
                        <p className="text-red-500 text-center">
                          {signupError instanceof Error
                            ? signupError.message
                            : 'Signup failed'}
                        </p>
                      )}
                    </form>
                  </motion.div>
                )}

                {/* FORGOT PASSWORD */}
                {page === 'forgot' && (
                  // <motion.div
                  //   key="forgot"
                  //   initial={{ x: 300, opacity: 0 }}
                  //   animate={{ x: 0, opacity: 1 }}
                  //   exit={{ x: -300, opacity: 0 }}
                  //   transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  //   className="w-full max-w-3xl mx-auto flex flex-col gap-6 relative justify-center items-center p-6 rounded-lg"
                  // >
                  //   {/* Back Button */}
                  //   <button
                  //     onClick={() => {
                  //       setPage('login');
                  //       setOtpSent(false);
                  //     }}
                  //     className="absolute top-2 left-10 text-[#0890A8] border border-[#0890A8] text-lg font-medium rounded-full px-2 py-1 hover:bg-[#0890A8] hover:text-white transition-colors"
                  //   >
                  //     ←
                  //   </button>

                  //   <h2 className="text-2xl font-bold text-center text-black mt-6">
                  //     Forgot Password 🔐
                  //   </h2>

                  //   <form
                  //     className="flex flex-col gap-4 mt-4 w-[60%]"
                  //     onSubmit={(e) => {
                  //       e.preventDefault();
                  //       alert('Password updated successfully!');
                  //       setOtpSent(false);
                  //       setPage('login');
                  //     }}
                  //   >
                  //     {/* Email Input */}
                  //     <Input
                  //       label="Email"
                  //       placeholder="Enter your registered email"
                  //       type="email"
                  //       {...forgotForm.register('email')}
                  //       error={forgotForm.formState.errors.email?.message}
                  //       disabled={otpSent}
                  //     />

                  //     {/* Send OTP Button */}
                  //     {!otpSent && (
                  //       <Button
                  //         type="button"
                  //         className="bg-[#0890A8] w-2/4 mx-auto"
                  //         onClick={() => setOtpSent(true)}
                  //       >
                  //         Send OTP
                  //       </Button>
                  //     )}

                  //     {/* OTP + New Password Fields */}
                  //     <div
                  //       className={`transition-opacity duration-500 ${
                  //         !otpSent ? 'opacity-50 pointer-events-none' : ''
                  //       }`}
                  //     ><p className='text-center'>Input six digit code that has beeen sent to your email</p>
                  //       {/* OTP Inputs */}
                  //       <div className="flex justify-between gap-2 mt-4">
                  //         {[...Array(6)].map((_, index) => (
                  //           <input
                  //             key={index}
                  //             type="text"
                  //             maxLength={1}
                  //             disabled={!otpSent}
                  //             className="w-12 h-12 text-center border rounded-md text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#0890A8]"
                  //             onKeyUp={(
                  //               e: React.KeyboardEvent<HTMLInputElement>
                  //             ) => {
                  //               const target = e.target as HTMLInputElement;
                  //               if (
                  //                 target.value.length === 1 &&
                  //                 target.nextElementSibling
                  //               ) {
                  //                 (
                  //                   target.nextElementSibling as HTMLInputElement
                  //                 ).focus();
                  //               }
                  //               if (
                  //                 e.key === 'Backspace' &&
                  //                 target.previousElementSibling
                  //               ) {
                  //                 (
                  //                   target.previousElementSibling as HTMLInputElement
                  //                 ).focus();
                  //               }
                  //             }}
                  //           />
                  //         ))}
                  //       </div>

                  //       {/* New Password */}
                  //       <div className="relative mt-4">
                  //         <Input
                  //           label="New Password"
                  //           placeholder="Enter new password"
                  //           type={showNewPassword ? 'text' : 'password'}
                  //           disabled={!otpSent}
                  //           className={`${!otpSent ? 'opacity-50' : ''}`}
                  //         />
                  //         <button
                  //           type="button"
                  //           onClick={() => setShowNewPassword(!showNewPassword)}
                  //           className="absolute right-3 top-[38px] text-gray-500"
                  //           disabled={!otpSent}
                  //         >
                  //           {showNewPassword ? <Eye /> : <EyeOff />}
                  //         </button>
                  //       </div>

                  //       {/* Confirm Password */}
                  //       <div className="relative mt-4">
                  //         <Input
                  //           label="Confirm Password"
                  //           placeholder="Confirm new password"
                  //           type={showConfirmPassword ? 'text' : 'password'}
                  //           disabled={!otpSent}
                  //           className={`${!otpSent ? 'opacity-50' : ''}`}
                  //         />
                  //         <button
                  //           type="button"
                  //           onClick={() =>
                  //             setShowConfirmPassword(!showConfirmPassword)
                  //           }
                  //           className="absolute right-3 top-[38px] text-gray-500"
                  //           disabled={!otpSent}
                  //         >
                  //           {showConfirmPassword ? <Eye /> : <EyeOff />}
                  //         </button>
                  //       </div>

                  //       {/* Update Password Button */}
                  //       <Button
                  //         type="submit"
                  //         className={`bg-[#0890A8] w-full mx-auto mt-2 ${
                  //           !otpSent ? 'opacity-50 pointer-events-none' : ''
                  //         }`}
                  //       >
                  //         Update Password
                  //       </Button>
                  //     </div>
                  //   </form>
                  // </motion.div>
                  <ForgotPasswordForm
                    onBack={() => setPage('login')}
                    onSuccess={() => setPage('login')}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="hidden md:flex flex-1 bg-[#0890A8] items-center justify-center relative">
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

export default AuthModal;
