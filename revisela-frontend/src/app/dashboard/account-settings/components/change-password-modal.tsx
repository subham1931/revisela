// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { Eye, EyeOff } from 'lucide-react';
// import { z } from 'zod';

// import { apiRequest } from '@/services/api-client';
// import { AUTH_ENDPOINTS } from '@/services/endpoints';

// import { Button, Input, Modal } from '@/components/ui';
// import { useToast } from '@/components/ui/toast';

// // Password schema with validation rules
// const passwordSchema = z
//   .object({
//     currentPassword: z.string().min(1, 'Current password is required'),
//     newPassword: z
//       .string()
//       .min(8, 'Password must be at least 8 characters')
//       .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
//       .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
//       .regex(/[0-9]/, 'Password must contain at least one number'),
//     confirmPassword: z.string().min(1, 'Please confirm your new password'),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: 'Passwords do not match',
//     path: ['confirmPassword'],
//   });

// type PasswordFormData = z.infer<typeof passwordSchema>;

// interface ChangePasswordModalProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   userId: string;
// }

// const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
//   isOpen,
//   onOpenChange,
//   userId,
// }) => {
//   const { toast } = useToast();
//   const [isPending, setIsPending] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isDirty, isValid },
//   } = useForm<PasswordFormData>({
//     resolver: zodResolver(passwordSchema),
//     defaultValues: {
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: '',
//     },
//   });

//   const handleChangePassword = async (data: PasswordFormData) => {
//     if (!isDirty || !isValid) return;

//     try {
//       setIsPending(true);
//       // This endpoint might need to be adjusted based on your API
//       const response = await apiRequest(AUTH_ENDPOINTS.RESET_PASSWORD, {
//         body: {
//           userId,
//           currentPassword: data.currentPassword,
//           newPassword: data.newPassword,
//         },
//       });

//       if (response.error) {
//         throw response.error;
//       }

//       toast({
//         title: 'Password Updated',
//         description: 'Your password has been changed successfully.',
//         type: 'success',
//       });

//       handleClose();
//     } catch (error: any) {
//       toast({
//         title: 'Password Update Failed',
//         description:
//           error.message || 'Failed to update password. Please try again.',
//         type: 'error',
//       });
//     } finally {
//       setIsPending(false);
//     }
//   };

//   const handleClose = () => {
//     reset();
//     onOpenChange(false);
//   };

//   return (
//     <Modal
//       title="Change Password"
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       description="Update your account password"
//     >
//       <form
//         onSubmit={handleSubmit(handleChangePassword)}
//         className="space-y-4 mt-4"
//       >
//         <Input
//           label="Current Password"
//           type={showCurrentPassword ? 'text' : 'password'}
//           placeholder="Enter your current password"
//           {...register('currentPassword')}
//           error={errors.currentPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <Input
//           label="New Password"
//           type={showNewPassword ? 'text' : 'password'}
//           placeholder="Enter new password"
//           {...register('newPassword')}
//           error={errors.newPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowNewPassword(!showNewPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <Input
//           label="Confirm New Password"
//           type={showConfirmPassword ? 'text' : 'password'}
//           placeholder="Confirm new password"
//           {...register('confirmPassword')}
//           error={errors.confirmPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <div className="flex justify-end gap-2 mt-6">
//           <Button type="button" variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="bg-[#0890A8] text-white"
//             disabled={!isDirty || !isValid || isPending}
//           >
//             {isPending ? 'Updating...' : 'Update Password'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default ChangePasswordModal;

//       handleClose();
//     } catch (error: any) {
//       toast({
//         title: 'Password Update Failed',
//         description:
//           error.message || 'Failed to update password. Please try again.',
//         type: 'error',
//       });
//     } finally {
//       setIsPending(false);
//     }
//   };

//   const handleClose = () => {
//     reset();
//     onOpenChange(false);
//   };

//   return (
//     <Modal
//       title="Change Password"
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       description="Update your account password"
//     >
//       <form
//         onSubmit={handleSubmit(handleChangePassword)}
//         className="space-y-4 mt-4"
//       >
//         <Input
//           label="Current Password"
//           type={showCurrentPassword ? 'text' : 'password'}
//           placeholder="Enter your current password"
//           {...register('currentPassword')}
//           error={errors.currentPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <Input
//           label="New Password"
//           type={showNewPassword ? 'text' : 'password'}
//           placeholder="Enter new password"
//           {...register('newPassword')}
//           error={errors.newPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowNewPassword(!showNewPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <Input
//           label="Confirm New Password"
//           type={showConfirmPassword ? 'text' : 'password'}
//           placeholder="Confirm new password"
//           {...register('confirmPassword')}
//           error={errors.confirmPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <div className="flex justify-end gap-2 mt-6">
//           <Button type="button" variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="bg-[#0890A8] text-white"
//             disabled={!isDirty || !isValid || isPending}
//           >
//             {isPending ? 'Updating...' : 'Update Password'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default ChangePasswordModal;

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeClosed, EyeOff, X } from 'lucide-react';
import { z } from 'zod';

import { OtpInput } from '@/components/ui/OtpInput';

// adjust path
import AuthVector from '@/assets/images/auth-screen-bg.svg';

// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { Eye, EyeOff } from 'lucide-react';
// import { z } from 'zod';

// import { apiRequest } from '@/services/api-client';
// import { AUTH_ENDPOINTS } from '@/services/endpoints';

// import { Button, Input, Modal } from '@/components/ui';
// import { useToast } from '@/components/ui/toast';

// // Password schema with validation rules
// const passwordSchema = z
//   .object({
//     currentPassword: z.string().min(1, 'Current password is required'),
//     newPassword: z
//       .string()
//       .min(8, 'Password must be at least 8 characters')
//       .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
//       .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
//       .regex(/[0-9]/, 'Password must contain at least one number'),
//     confirmPassword: z.string().min(1, 'Please confirm your new password'),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: 'Passwords do not match',
//     path: ['confirmPassword'],
//   });

// type PasswordFormData = z.infer<typeof passwordSchema>;

// interface ChangePasswordModalProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   userId: string;
// }

// const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
//   isOpen,
//   onOpenChange,
//   userId,
// }) => {
//   const { toast } = useToast();
//   const [isPending, setIsPending] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isDirty, isValid },
//   } = useForm<PasswordFormData>({
//     resolver: zodResolver(passwordSchema),
//     defaultValues: {
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: '',
//     },
//   });

//   const handleChangePassword = async (data: PasswordFormData) => {
//     if (!isDirty || !isValid) return;

//     try {
//       setIsPending(true);
//       // This endpoint might need to be adjusted based on your API
//       const response = await apiRequest(AUTH_ENDPOINTS.RESET_PASSWORD, {
//         body: {
//           userId,
//           currentPassword: data.currentPassword,
//           newPassword: data.newPassword,
//         },
//       });

//       if (response.error) {
//         throw response.error;
//       }

//       toast({
//         title: 'Password Updated',
//         description: 'Your password has been changed successfully.',
//         type: 'success',
//       });

//       handleClose();
//     } catch (error: any) {
//       toast({
//         title: 'Password Update Failed',
//         description:
//           error.message || 'Failed to update password. Please try again.',
//         type: 'error',
//       });
//     } finally {
//       setIsPending(false);
//     }
//   };

//   const handleClose = () => {
//     reset();
//     onOpenChange(false);
//   };

//   return (
//     <Modal
//       title="Change Password"
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       description="Update your account password"
//     >
//       <form
//         onSubmit={handleSubmit(handleChangePassword)}
//         className="space-y-4 mt-4"
//       >
//         <Input
//           label="Current Password"
//           type={showCurrentPassword ? 'text' : 'password'}
//           placeholder="Enter your current password"
//           {...register('currentPassword')}
//           error={errors.currentPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <Input
//           label="New Password"
//           type={showNewPassword ? 'text' : 'password'}
//           placeholder="Enter new password"
//           {...register('newPassword')}
//           error={errors.newPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowNewPassword(!showNewPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <Input
//           label="Confirm New Password"
//           type={showConfirmPassword ? 'text' : 'password'}
//           placeholder="Confirm new password"
//           {...register('confirmPassword')}
//           error={errors.confirmPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <div className="flex justify-end gap-2 mt-6">
//           <Button type="button" variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="bg-[#0890A8] text-white"
//             disabled={!isDirty || !isValid || isPending}
//           >
//             {isPending ? 'Updating...' : 'Update Password'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default ChangePasswordModal;

//       handleClose();
//     } catch (error: any) {
//       toast({
//         title: 'Password Update Failed',
//         description:
//           error.message || 'Failed to update password. Please try again.',
//         type: 'error',
//       });
//     } finally {
//       setIsPending(false);
//     }
//   };

//   const handleClose = () => {
//     reset();
//     onOpenChange(false);
//   };

//   return (
//     <Modal
//       title="Change Password"
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       description="Update your account password"
//     >
//       <form
//         onSubmit={handleSubmit(handleChangePassword)}
//         className="space-y-4 mt-4"
//       >
//         <Input
//           label="Current Password"
//           type={showCurrentPassword ? 'text' : 'password'}
//           placeholder="Enter your current password"
//           {...register('currentPassword')}
//           error={errors.currentPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <Input
//           label="New Password"
//           type={showNewPassword ? 'text' : 'password'}
//           placeholder="Enter new password"
//           {...register('newPassword')}
//           error={errors.newPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowNewPassword(!showNewPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <Input
//           label="Confirm New Password"
//           type={showConfirmPassword ? 'text' : 'password'}
//           placeholder="Confirm new password"
//           {...register('confirmPassword')}
//           error={errors.confirmPassword?.message}
//           rightElement={
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="text-[#ACACAC] hover:text-[#444444]"
//             >
//               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           }
//         />

//         <div className="flex justify-end gap-2 mt-6">
//           <Button type="button" variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="bg-[#0890A8] text-white"
//             disabled={!isDirty || !isValid || isPending}
//           >
//             {isPending ? 'Updating...' : 'Update Password'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default ChangePasswordModal;

// -------------------- Schema --------------------
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// -------------------- Props --------------------
interface ChangePasswordModalProps {
  onClose: () => void;
}

// -------------------- Component --------------------
const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  onClose,
}) => {
  const router = useRouter();

  const [otpSent, setOtpSent] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const forgotForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // ✅ Clicking outside closes modal
        />

        {/* Modal */}
        <motion.div
          className="fixed top-19 left-0 w-full h-screen bg-white z-50 flex overflow-hidden"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* Left Side */}
          <div className="flex-1 flex flex-col p-6 overflow-auto">
            <h2 className="text-2xl font-bold text-center text-[#444444] mt-8 mb-6">
              Create/Change Password
            </h2>

            <div className="relative w-full flex flex-col items-center justify-start gap-6 p-4 rounded-md">
              {/* Email Field */}
              <form
                className="w-full max-w-md"
                onSubmit={forgotForm.handleSubmit((data) => {
                  console.log('Email submitted:', data.email);
                  setOtpSent(true);
                })}
              >
                <label
                  htmlFor="email"
                  className="block mb-1 text-[16px] text-[#444444] font-medium"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...forgotForm.register('email')}
                    className="w-full px-3 py-2 pr-24 border rounded focus:outline-none focus:ring placeholder:text-[#ACACAC]"
                    disabled={otpSent}
                  />
                  {!otpSent && (
                    <button
                      type="submit"
                      className="absolute top-1/2 right-1.5 transform -translate-y-1/2 px-3 py-1 bg-[#0890A8] text-white text-sm rounded hover:bg-[#007f8f] transition-colors"
                    >
                      Send code
                    </button>
                  )}
                </div>
                {forgotForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {forgotForm.formState.errors.email.message}
                  </p>
                )}
              </form>

              {/* OTP Input */}
              {otpSent && (
                <OtpInput
                  length={6}
                  helperText="Enter the 6-digit code sent to your email"
                  className="mt-4 w-full max-w-md flex justify-between gap-1"
                />
              )}

              {/* New Password */}
              <div className="w-full max-w-md relative ">
                <label
                  htmlFor="newPassword"
                  className="block mb-1 text-[16px] text-[#444444] font-medium"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 pr-12 border rounded focus:outline-none focus:ring placeholder:text-[#ACACAC]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((p) => !p)}
                  className="absolute top-1/2 right-3 transform  text-gray-500"
                >
                  {showNewPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="w-full max-w-md relative">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-[16px] text-[#444444] font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 pr-12 border rounded focus:outline-none focus:ring placeholder:text-[#ACACAC]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute top-1/2 right-2 transform  text-gray-500"
                >
                  {showConfirmPassword ?  <Eye /> : <EyeOff /> }
                </button>
              </div>

              {/* Update Password Button */}
              <button
                type="button"
                className="w-full max-w-md bg-[#0890A8] text-white py-2 rounded hover:bg-[#007f8f] transition-colors mt-4"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Right Side (Illustration + Close button) */}
          <div className="hidden md:flex flex-1 bg-[#0890A8] items-center justify-center relative">
            <button
              onClick={onClose} // ✅ Close button works now
              className="absolute top-5 right-6 text-white hover:text-gray-900 transition-colors border rounded-full p-1"
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

export default ChangePasswordModal;
