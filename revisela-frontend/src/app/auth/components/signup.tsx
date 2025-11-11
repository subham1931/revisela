'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSignup } from '@/services/features/auth';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { DateInput } from '@/components/ui/DateInput';
import { Input } from '@/components/ui/Input';

import GoogleIcon from '@/assets/icons/google.svg';
import MicrosoftIcon from '@/assets/icons/microsoft.svg';

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

// Define the form data type from the schema
type SignupFormData = z.infer<typeof signupSchema>;

const SignUp = () => {
  const router = useRouter();
  const { mutate: signup, isPending, error: apiError } = useSignup();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      birthday: {
        day: '',
        month: '',
        year: '',
      },
    },
  });

  const onSubmit = (data: SignupFormData) => {
    // Format birthday as ISO string
    const birthdayStr = `${data.birthday.year}-${data.birthday.month}-${data.birthday.day}`;

    signup(
      {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        birthday: birthdayStr,
      },
      {
        onSuccess: () => {
          // Redirect to login page with success message
          router.push('/auth?signup=success');
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 my-[3.75rem]"
    >
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
        <Button
          type="button"
          variant="outline"
          className="text-[16px] flex items-center text-nowrap gap-2 w-full h-[3.0625rem] border-[#E5E5E5] mb-2 sm:mb-0"
        >
          <Image src={GoogleIcon} alt="Google" />
          Sign up with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-[16px] flex items-center text-nowrap gap-2 w-full h-[3.0625rem] border-[#E5E5E5]"
        >
          <Image src={MicrosoftIcon} alt="Microsoft" />
          Sign up with Microsoft
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="w-[50%] h-[1px] bg-[#000]"></div>
        <p className="text-[18px] text-[#444444]">Or</p>
        <div className="w-[50%] h-[1px] bg-[#000]"></div>
      </div>

      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {apiError instanceof Error ? apiError.message : 'Signup failed'}
        </div>
      )}

      <Input
        label="Full Name"
        placeholder="Enter your full name"
        type="text"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Username"
        placeholder="Enter your username"
        type="text"
        {...register('username')}
        error={errors.username?.message}
      />
      <Controller
        name="birthday"
        control={control}
        render={({ field }) => (
          <DateInput
            label="Birthday"
            onChange={(dateValues) => field.onChange(dateValues)}
            error={
              errors.birthday?.day?.message ||
              errors.birthday?.month?.message ||
              errors.birthday?.year?.message
            }
          />
        )}
      />
      <Input
        label="Email"
        placeholder="Enter your email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        placeholder="Create a password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />

      <div className="flex items-center">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          {...register('agreeToTerms')}
          error={errors.agreeToTerms?.message}
        />
      </div>

      <Button
        type="submit"
        className="bg-[#0890A8] text-white block w-full h-[3.0625rem]"
        disabled={isPending}
      >
        {isPending ? 'Creating account...' : 'Sign Up'}
      </Button>

      <p className="text-center text-[14px] text-[#444444]">
        Already have an account?{' '}
        <a href="?signup=false" className="text-[#0890A8]">
          Log in
        </a>
      </p>
    </form>
  );
};

export default SignUp;
