'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

import { useResetPassword } from '@/services/features/auth';

import { Button, Input, OtpInput } from '@/components/ui';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type Step = 'email' | 'otp' | 'reset';

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const {
    mutate: resetPassword,
    isPending,
    error: apiError,
  } = useResetPassword();

  // Email form setup
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  // Password reset form setup
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSendEmail = (data: EmailFormData) => {
    console.log('handleSendEmail called'); // <-- add this
    setEmail(data.email);
    console.log('Sending code to:', data.email);
    setStep('otp');
  };

  const handleVerifyOtp = (code: string) => {
    setOtp(code);
    if (code.length === 6) {
      // Automatically move to reset step when OTP is complete
      setStep('reset');
    }
  };

  const handleResetPassword = (data: ResetPasswordFormData) => {
    resetPassword(
      {
        email,
        otp,
        newPassword: data.password,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto">
      <h2 className="text-2xl font-medium text-center text-[#444444] mb-4">
        Forgot password
      </h2>

      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {apiError instanceof Error
            ? apiError.message
            : 'Password reset failed'}
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={handleSubmitEmail(handleSendEmail)}>
          <Input
            className="w-[20rem]"
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...registerEmail('email')}
            error={emailErrors.email?.message}
            rightElement={
              <Button
                type="submit"
                className="bg-[#0890A8] text-white px-3 py-1 text-sm rounded-md"
              >
                Send
              </Button>
            }
          />
        </form>
      )}

      {step === 'otp' && (
        <OtpInput
          length={6}
          onComplete={handleVerifyOtp}
          helperText="Input the six digit code that has been sent to your email"
        />
      )}

      {step === 'reset' && (
        <form onSubmit={handleSubmitPassword(handleResetPassword)}>
          <div className="flex flex-col gap-4">
            <Input
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              {...registerPassword('password')}
              error={passwordErrors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#ACACAC] hover:text-[#444444]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...registerPassword('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#ACACAC] hover:text-[#444444]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              }
            />

            <Button
              type="submit"
              className="bg-[#0890A8] text-white block w-full h-[3.0625rem] mt-4"
              disabled={isPending}
            >
              {isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
