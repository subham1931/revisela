// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { motion } from 'framer-motion';
// import { Eye, EyeOff } from 'lucide-react';
// import { z } from 'zod';

// import {
//   useForgotPassword,
//   useResetPassword,
//   useVerifyOtp,
// } from '@/services/features/auth';

// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';

// // ✅ Validation Schema
// const forgotPasswordSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
// });

// type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// interface ForgotPasswordFormProps {
//   onBack: () => void;
//   onSuccess?: () => void;
// }

// const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
//   onBack,
//   onSuccess,
// }) => {
//   const [otpSent, setOtpSent] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const forgotForm = useForm<ForgotPasswordData>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { email: '' },
//   });

//   // API hooks
//   const {
//     mutate: sendOtp,
//     isPending: otpPending,
//     error: otpError,
//   } = useForgotPassword();
//   const {
//     mutate: verifyOtp,
//     isPending: verifyPending,
//     error: verifyError,
//   } = useVerifyOtp();
//   const {
//     mutate: resetPassword,
//     isPending: resetPending,
//     error: resetError,
//   } = useResetPassword();

//     const handleSendOtp = (values: ForgotPasswordData) => {
//       sendOtp(values.email, {
//         onSuccess: () => setOtpSent(true),
//       });
//     };

//   const handleResetPassword = () => {
//     const otpInputs =
//       document.querySelectorAll<HTMLInputElement>('.otp-inputs input');
//     const otp = Array.from(otpInputs)
//       .map((inp) => inp.value)
//       .join('');

//     if (otp.length < 6) return alert('Please enter the full OTP.');

//     const email = forgotForm.getValues('email');
//     const newPassword = (
//       document.querySelector('#newPassword') as HTMLInputElement
//     )?.value;
//     const confirmPassword = (
//       document.querySelector('#confirmPassword') as HTMLInputElement
//     )?.value;

//     if (!newPassword || newPassword !== confirmPassword)
//       return alert('Passwords do not match.');

//     verifyOtp(
//       { email, otp },
//       {
//         onSuccess: () => {
//           resetPassword(
//             { email, otp, newPassword },
//             {
//               onSuccess: () => {
//                 alert('✅ Password updated successfully!');
//                 setOtpSent(false);
//                 onSuccess?.();
//               },
//             }
//           );
//         },
//       }
//     );
//   };

//   return (
//     <motion.div
//       key="forgot"
//       initial={{ x: 300, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -300, opacity: 0 }}
//       transition={{ type: 'spring', stiffness: 120, damping: 20 }}
//       className="w-full max-w-3xl mx-auto flex flex-col gap-6 relative justify-center items-center p-6 rounded-lg"
//     >
//       {/* Back Button */}
//       <button
//         onClick={() => {
//           setOtpSent(false);
//           onBack();
//         }}
//         className="absolute top-2 left-10 text-[#0890A8] border border-[#0890A8] text-lg font-medium rounded-full px-2 py-1 hover:bg-[#0890A8] hover:text-white transition-colors"
//       >
//         ←
//       </button>

//       <h2 className="text-2xl font-bold text-center text-black mt-6">
//         Forgot Password 🔐
//       </h2>

//       <form
//         className="flex flex-col gap-4 mt-4 w-[60%]"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         {/* Email Input */}
//         <Input
//           label="Email"
//           placeholder="Enter your registered email"
//           type="email"
//           {...forgotForm.register('email')}
//           error={forgotForm.formState.errors.email?.message}
//           disabled={otpSent}
//         />

//         {!otpSent ? (
//           <Button
//             type="button"
//             className="bg-[#0890A8] w-2/4 mx-auto"
//             disabled={otpPending}
//             onClick={forgotForm.handleSubmit(handleSendOtp)}
//           >
//             {otpPending ? 'Sending OTP...' : 'Send OTP'}
//           </Button>
//         ) : (
//           <div className="space-y-4">
//             <p className="text-center text-gray-600">
//               Enter the 6-digit OTP sent to your email
//             </p>

//             {/* OTP Inputs */}
//             <div className="otp-inputs flex justify-between gap-2">
//               {[...Array(6)].map((_, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   maxLength={1}
//                   className="w-12 h-12 text-center border rounded-md text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#0890A8]"
//                   onChange={(e) => {
//                     e.target.value = e.target.value.replace(/[^0-9]/g, '');
//                     const next = e.target
//                       .nextElementSibling as HTMLInputElement;
//                     if (next && e.target.value) next.focus();
//                   }}
//                 />
//               ))}
//             </div>

//             {/* New Password */}
//             <div className="relative mt-4">
//               <Input
//                 id="newPassword"
//                 label="New Password"
//                 placeholder="Enter new password"
//                 type={showNewPassword ? 'text' : 'password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-[38px] text-gray-500"
//               >
//                 {showNewPassword ? <Eye /> : <EyeOff />}
//               </button>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative mt-4">
//               <Input
//                 id="confirmPassword"
//                 label="Confirm Password"
//                 placeholder="Re-enter new password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-[38px] text-gray-500"
//               >
//                 {showConfirmPassword ? <Eye /> : <EyeOff />}
//               </button>
//             </div>

//             <Button
//               onClick={handleResetPassword}
//               className="bg-[#0890A8] w-full mx-auto mt-2"
//               disabled={verifyPending || resetPending}
//             >
//               {verifyPending || resetPending
//                 ? 'Updating...'
//                 : 'Update Password'}
//             </Button>

//             {otpError && (
//               <p className="text-sm text-red-500 text-center">
//                 {otpError instanceof Error
//                   ? otpError.message
//                   : 'Failed to send OTP'}
//               </p>
//             )}
//             {verifyError && (
//               <p className="text-sm text-red-500 text-center">
//                 {verifyError instanceof Error
//                   ? verifyError.message
//                   : 'OTP verification failed'}
//               </p>
//             )}
//             {resetError && (
//               <p className="text-sm text-red-500 text-center">
//                 {resetError instanceof Error
//                   ? resetError.message
//                   : 'Password reset failed'}
//               </p>
//             )}
//           </div>
//         )}
//       </form>
//     </motion.div>
//   );
// };

// export default ForgotPasswordForm;
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

import { useResetPassword } from '@/services/features/auth';

import { Button, Input, OtpInput } from '@/components/ui';

// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { motion } from 'framer-motion';
// import { Eye, EyeOff } from 'lucide-react';
// import { z } from 'zod';

// import {
//   useForgotPassword,
//   useResetPassword,
//   useVerifyOtp,
// } from '@/services/features/auth';

// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';

// // ✅ Validation Schema
// const forgotPasswordSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
// });

// type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// interface ForgotPasswordFormProps {
//   onBack: () => void;
//   onSuccess?: () => void;
// }

// const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
//   onBack,
//   onSuccess,
// }) => {
//   const [otpSent, setOtpSent] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const forgotForm = useForm<ForgotPasswordData>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { email: '' },
//   });

//   // API hooks
//   const {
//     mutate: sendOtp,
//     isPending: otpPending,
//     error: otpError,
//   } = useForgotPassword();
//   const {
//     mutate: verifyOtp,
//     isPending: verifyPending,
//     error: verifyError,
//   } = useVerifyOtp();
//   const {
//     mutate: resetPassword,
//     isPending: resetPending,
//     error: resetError,
//   } = useResetPassword();

//     const handleSendOtp = (values: ForgotPasswordData) => {
//       sendOtp(values.email, {
//         onSuccess: () => setOtpSent(true),
//       });
//     };

//   const handleResetPassword = () => {
//     const otpInputs =
//       document.querySelectorAll<HTMLInputElement>('.otp-inputs input');
//     const otp = Array.from(otpInputs)
//       .map((inp) => inp.value)
//       .join('');

//     if (otp.length < 6) return alert('Please enter the full OTP.');

//     const email = forgotForm.getValues('email');
//     const newPassword = (
//       document.querySelector('#newPassword') as HTMLInputElement
//     )?.value;
//     const confirmPassword = (
//       document.querySelector('#confirmPassword') as HTMLInputElement
//     )?.value;

//     if (!newPassword || newPassword !== confirmPassword)
//       return alert('Passwords do not match.');

//     verifyOtp(
//       { email, otp },
//       {
//         onSuccess: () => {
//           resetPassword(
//             { email, otp, newPassword },
//             {
//               onSuccess: () => {
//                 alert('✅ Password updated successfully!');
//                 setOtpSent(false);
//                 onSuccess?.();
//               },
//             }
//           );
//         },
//       }
//     );
//   };

//   return (
//     <motion.div
//       key="forgot"
//       initial={{ x: 300, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -300, opacity: 0 }}
//       transition={{ type: 'spring', stiffness: 120, damping: 20 }}
//       className="w-full max-w-3xl mx-auto flex flex-col gap-6 relative justify-center items-center p-6 rounded-lg"
//     >
//       {/* Back Button */}
//       <button
//         onClick={() => {
//           setOtpSent(false);
//           onBack();
//         }}
//         className="absolute top-2 left-10 text-[#0890A8] border border-[#0890A8] text-lg font-medium rounded-full px-2 py-1 hover:bg-[#0890A8] hover:text-white transition-colors"
//       >
//         ←
//       </button>

//       <h2 className="text-2xl font-bold text-center text-black mt-6">
//         Forgot Password 🔐
//       </h2>

//       <form
//         className="flex flex-col gap-4 mt-4 w-[60%]"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         {/* Email Input */}
//         <Input
//           label="Email"
//           placeholder="Enter your registered email"
//           type="email"
//           {...forgotForm.register('email')}
//           error={forgotForm.formState.errors.email?.message}
//           disabled={otpSent}
//         />

//         {!otpSent ? (
//           <Button
//             type="button"
//             className="bg-[#0890A8] w-2/4 mx-auto"
//             disabled={otpPending}
//             onClick={forgotForm.handleSubmit(handleSendOtp)}
//           >
//             {otpPending ? 'Sending OTP...' : 'Send OTP'}
//           </Button>
//         ) : (
//           <div className="space-y-4">
//             <p className="text-center text-gray-600">
//               Enter the 6-digit OTP sent to your email
//             </p>

//             {/* OTP Inputs */}
//             <div className="otp-inputs flex justify-between gap-2">
//               {[...Array(6)].map((_, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   maxLength={1}
//                   className="w-12 h-12 text-center border rounded-md text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#0890A8]"
//                   onChange={(e) => {
//                     e.target.value = e.target.value.replace(/[^0-9]/g, '');
//                     const next = e.target
//                       .nextElementSibling as HTMLInputElement;
//                     if (next && e.target.value) next.focus();
//                   }}
//                 />
//               ))}
//             </div>

//             {/* New Password */}
//             <div className="relative mt-4">
//               <Input
//                 id="newPassword"
//                 label="New Password"
//                 placeholder="Enter new password"
//                 type={showNewPassword ? 'text' : 'password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-[38px] text-gray-500"
//               >
//                 {showNewPassword ? <Eye /> : <EyeOff />}
//               </button>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative mt-4">
//               <Input
//                 id="confirmPassword"
//                 label="Confirm Password"
//                 placeholder="Re-enter new password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-[38px] text-gray-500"
//               >
//                 {showConfirmPassword ? <Eye /> : <EyeOff />}
//               </button>
//             </div>

//             <Button
//               onClick={handleResetPassword}
//               className="bg-[#0890A8] w-full mx-auto mt-2"
//               disabled={verifyPending || resetPending}
//             >
//               {verifyPending || resetPending
//                 ? 'Updating...'
//                 : 'Update Password'}
//             </Button>

//             {otpError && (
//               <p className="text-sm text-red-500 text-center">
//                 {otpError instanceof Error
//                   ? otpError.message
//                   : 'Failed to send OTP'}
//               </p>
//             )}
//             {verifyError && (
//               <p className="text-sm text-red-500 text-center">
//                 {verifyError instanceof Error
//                   ? verifyError.message
//                   : 'OTP verification failed'}
//               </p>
//             )}
//             {resetError && (
//               <p className="text-sm text-red-500 text-center">
//                 {resetError instanceof Error
//                   ? resetError.message
//                   : 'Password reset failed'}
//               </p>
//             )}
//           </div>
//         )}
//       </form>
//     </motion.div>
//   );
// };

// export default ForgotPasswordForm;

// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { motion } from 'framer-motion';
// import { Eye, EyeOff } from 'lucide-react';
// import { z } from 'zod';

// import {
//   useForgotPassword,
//   useResetPassword,
//   useVerifyOtp,
// } from '@/services/features/auth';

// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';

// // ✅ Validation Schema
// const forgotPasswordSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
// });

// type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// interface ForgotPasswordFormProps {
//   onBack: () => void;
//   onSuccess?: () => void;
// }

// const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
//   onBack,
//   onSuccess,
// }) => {
//   const [otpSent, setOtpSent] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const forgotForm = useForm<ForgotPasswordData>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { email: '' },
//   });

//   // API hooks
//   const {
//     mutate: sendOtp,
//     isPending: otpPending,
//     error: otpError,
//   } = useForgotPassword();
//   const {
//     mutate: verifyOtp,
//     isPending: verifyPending,
//     error: verifyError,
//   } = useVerifyOtp();
//   const {
//     mutate: resetPassword,
//     isPending: resetPending,
//     error: resetError,
//   } = useResetPassword();

//     const handleSendOtp = (values: ForgotPasswordData) => {
//       sendOtp(values.email, {
//         onSuccess: () => setOtpSent(true),
//       });
//     };

//   const handleResetPassword = () => {
//     const otpInputs =
//       document.querySelectorAll<HTMLInputElement>('.otp-inputs input');
//     const otp = Array.from(otpInputs)
//       .map((inp) => inp.value)
//       .join('');

//     if (otp.length < 6) return alert('Please enter the full OTP.');

//     const email = forgotForm.getValues('email');
//     const newPassword = (
//       document.querySelector('#newPassword') as HTMLInputElement
//     )?.value;
//     const confirmPassword = (
//       document.querySelector('#confirmPassword') as HTMLInputElement
//     )?.value;

//     if (!newPassword || newPassword !== confirmPassword)
//       return alert('Passwords do not match.');

//     verifyOtp(
//       { email, otp },
//       {
//         onSuccess: () => {
//           resetPassword(
//             { email, otp, newPassword },
//             {
//               onSuccess: () => {
//                 alert('✅ Password updated successfully!');
//                 setOtpSent(false);
//                 onSuccess?.();
//               },
//             }
//           );
//         },
//       }
//     );
//   };

//   return (
//     <motion.div
//       key="forgot"
//       initial={{ x: 300, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -300, opacity: 0 }}
//       transition={{ type: 'spring', stiffness: 120, damping: 20 }}
//       className="w-full max-w-3xl mx-auto flex flex-col gap-6 relative justify-center items-center p-6 rounded-lg"
//     >
//       {/* Back Button */}
//       <button
//         onClick={() => {
//           setOtpSent(false);
//           onBack();
//         }}
//         className="absolute top-2 left-10 text-[#0890A8] border border-[#0890A8] text-lg font-medium rounded-full px-2 py-1 hover:bg-[#0890A8] hover:text-white transition-colors"
//       >
//         ←
//       </button>

//       <h2 className="text-2xl font-bold text-center text-black mt-6">
//         Forgot Password 🔐
//       </h2>

//       <form
//         className="flex flex-col gap-4 mt-4 w-[60%]"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         {/* Email Input */}
//         <Input
//           label="Email"
//           placeholder="Enter your registered email"
//           type="email"
//           {...forgotForm.register('email')}
//           error={forgotForm.formState.errors.email?.message}
//           disabled={otpSent}
//         />

//         {!otpSent ? (
//           <Button
//             type="button"
//             className="bg-[#0890A8] w-2/4 mx-auto"
//             disabled={otpPending}
//             onClick={forgotForm.handleSubmit(handleSendOtp)}
//           >
//             {otpPending ? 'Sending OTP...' : 'Send OTP'}
//           </Button>
//         ) : (
//           <div className="space-y-4">
//             <p className="text-center text-gray-600">
//               Enter the 6-digit OTP sent to your email
//             </p>

//             {/* OTP Inputs */}
//             <div className="otp-inputs flex justify-between gap-2">
//               {[...Array(6)].map((_, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   maxLength={1}
//                   className="w-12 h-12 text-center border rounded-md text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#0890A8]"
//                   onChange={(e) => {
//                     e.target.value = e.target.value.replace(/[^0-9]/g, '');
//                     const next = e.target
//                       .nextElementSibling as HTMLInputElement;
//                     if (next && e.target.value) next.focus();
//                   }}
//                 />
//               ))}
//             </div>

//             {/* New Password */}
//             <div className="relative mt-4">
//               <Input
//                 id="newPassword"
//                 label="New Password"
//                 placeholder="Enter new password"
//                 type={showNewPassword ? 'text' : 'password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-[38px] text-gray-500"
//               >
//                 {showNewPassword ? <Eye /> : <EyeOff />}
//               </button>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative mt-4">
//               <Input
//                 id="confirmPassword"
//                 label="Confirm Password"
//                 placeholder="Re-enter new password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-[38px] text-gray-500"
//               >
//                 {showConfirmPassword ? <Eye /> : <EyeOff />}
//               </button>
//             </div>

//             <Button
//               onClick={handleResetPassword}
//               className="bg-[#0890A8] w-full mx-auto mt-2"
//               disabled={verifyPending || resetPending}
//             >
//               {verifyPending || resetPending
//                 ? 'Updating...'
//                 : 'Update Password'}
//             </Button>

//             {otpError && (
//               <p className="text-sm text-red-500 text-center">
//                 {otpError instanceof Error
//                   ? otpError.message
//                   : 'Failed to send OTP'}
//               </p>
//             )}
//             {verifyError && (
//               <p className="text-sm text-red-500 text-center">
//                 {verifyError instanceof Error
//                   ? verifyError.message
//                   : 'OTP verification failed'}
//               </p>
//             )}
//             {resetError && (
//               <p className="text-sm text-red-500 text-center">
//                 {resetError instanceof Error
//                   ? resetError.message
//                   : 'Password reset failed'}
//               </p>
//             )}
//           </div>
//         )}
//       </form>
//     </motion.div>
//   );
// };

// export default ForgotPasswordForm;

// 'use client';

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { motion } from 'framer-motion';
// import { Eye, EyeOff } from 'lucide-react';
// import { z } from 'zod';

// import {
//   useForgotPassword,
//   useResetPassword,
//   useVerifyOtp,
// } from '@/services/features/auth';

// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';

// // ✅ Validation Schema
// const forgotPasswordSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
// });

// type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// interface ForgotPasswordFormProps {
//   onBack: () => void;
//   onSuccess?: () => void;
// }

// const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
//   onBack,
//   onSuccess,
// }) => {
//   const [otpSent, setOtpSent] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const forgotForm = useForm<ForgotPasswordData>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { email: '' },
//   });

//   // API hooks
//   const {
//     mutate: sendOtp,
//     isPending: otpPending,
//     error: otpError,
//   } = useForgotPassword();
//   const {
//     mutate: verifyOtp,
//     isPending: verifyPending,
//     error: verifyError,
//   } = useVerifyOtp();
//   const {
//     mutate: resetPassword,
//     isPending: resetPending,
//     error: resetError,
//   } = useResetPassword();

//     const handleSendOtp = (values: ForgotPasswordData) => {
//       sendOtp(values.email, {
//         onSuccess: () => setOtpSent(true),
//       });
//     };

//   const handleResetPassword = () => {
//     const otpInputs =
//       document.querySelectorAll<HTMLInputElement>('.otp-inputs input');
//     const otp = Array.from(otpInputs)
//       .map((inp) => inp.value)
//       .join('');

//     if (otp.length < 6) return alert('Please enter the full OTP.');

//     const email = forgotForm.getValues('email');
//     const newPassword = (
//       document.querySelector('#newPassword') as HTMLInputElement
//     )?.value;
//     const confirmPassword = (
//       document.querySelector('#confirmPassword') as HTMLInputElement
//     )?.value;

//     if (!newPassword || newPassword !== confirmPassword)
//       return alert('Passwords do not match.');

//     verifyOtp(
//       { email, otp },
//       {
//         onSuccess: () => {
//           resetPassword(
//             { email, otp, newPassword },
//             {
//               onSuccess: () => {
//                 alert('✅ Password updated successfully!');
//                 setOtpSent(false);
//                 onSuccess?.();
//               },
//             }
//           );
//         },
//       }
//     );
//   };

//   return (
//     <motion.div
//       key="forgot"
//       initial={{ x: 300, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -300, opacity: 0 }}
//       transition={{ type: 'spring', stiffness: 120, damping: 20 }}
//       className="w-full max-w-3xl mx-auto flex flex-col gap-6 relative justify-center items-center p-6 rounded-lg"
//     >
//       {/* Back Button */}
//       <button
//         onClick={() => {
//           setOtpSent(false);
//           onBack();
//         }}
//         className="absolute top-2 left-10 text-[#0890A8] border border-[#0890A8] text-lg font-medium rounded-full px-2 py-1 hover:bg-[#0890A8] hover:text-white transition-colors"
//       >
//         ←
//       </button>

//       <h2 className="text-2xl font-bold text-center text-black mt-6">
//         Forgot Password 🔐
//       </h2>

//       <form
//         className="flex flex-col gap-4 mt-4 w-[60%]"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         {/* Email Input */}
//         <Input
//           label="Email"
//           placeholder="Enter your registered email"
//           type="email"
//           {...forgotForm.register('email')}
//           error={forgotForm.formState.errors.email?.message}
//           disabled={otpSent}
//         />

//         {!otpSent ? (
//           <Button
//             type="button"
//             className="bg-[#0890A8] w-2/4 mx-auto"
//             disabled={otpPending}
//             onClick={forgotForm.handleSubmit(handleSendOtp)}
//           >
//             {otpPending ? 'Sending OTP...' : 'Send OTP'}
//           </Button>
//         ) : (
//           <div className="space-y-4">
//             <p className="text-center text-gray-600">
//               Enter the 6-digit OTP sent to your email
//             </p>

//             {/* OTP Inputs */}
//             <div className="otp-inputs flex justify-between gap-2">
//               {[...Array(6)].map((_, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   maxLength={1}
//                   className="w-12 h-12 text-center border rounded-md text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#0890A8]"
//                   onChange={(e) => {
//                     e.target.value = e.target.value.replace(/[^0-9]/g, '');
//                     const next = e.target
//                       .nextElementSibling as HTMLInputElement;
//                     if (next && e.target.value) next.focus();
//                   }}
//                 />
//               ))}
//             </div>

//             {/* New Password */}
//             <div className="relative mt-4">
//               <Input
//                 id="newPassword"
//                 label="New Password"
//                 placeholder="Enter new password"
//                 type={showNewPassword ? 'text' : 'password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-[38px] text-gray-500"
//               >
//                 {showNewPassword ? <Eye /> : <EyeOff />}
//               </button>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative mt-4">
//               <Input
//                 id="confirmPassword"
//                 label="Confirm Password"
//                 placeholder="Re-enter new password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-[38px] text-gray-500"
//               >
//                 {showConfirmPassword ? <Eye /> : <EyeOff />}
//               </button>
//             </div>

//             <Button
//               onClick={handleResetPassword}
//               className="bg-[#0890A8] w-full mx-auto mt-2"
//               disabled={verifyPending || resetPending}
//             >
//               {verifyPending || resetPending
//                 ? 'Updating...'
//                 : 'Update Password'}
//             </Button>

//             {otpError && (
//               <p className="text-sm text-red-500 text-center">
//                 {otpError instanceof Error
//                   ? otpError.message
//                   : 'Failed to send OTP'}
//               </p>
//             )}
//             {verifyError && (
//               <p className="text-sm text-red-500 text-center">
//                 {verifyError instanceof Error
//                   ? verifyError.message
//                   : 'OTP verification failed'}
//               </p>
//             )}
//             {resetError && (
//               <p className="text-sm text-red-500 text-center">
//                 {resetError instanceof Error
//                   ? resetError.message
//                   : 'Password reset failed'}
//               </p>
//             )}
//           </div>
//         )}
//       </form>
//     </motion.div>
//   );
// };

// export default ForgotPasswordForm;

// ✅ Schemas
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

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess?: () => void;
}
// const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
//   onBack,
//   onSuccess,
// })

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onBack,
  onSuccess,
}) => {
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
  });

  // Password reset form setup
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // --- Handlers ---
  const handleSendEmail = (data: EmailFormData) => {
    console.log('Sending OTP to:', data.email);
    setEmail(data.email);
    setStep('otp');
  };

  const handleVerifyOtp = (code: string) => {
    setOtp(code);
    if (code.length === 6) {
      setStep('reset');
    }
  };

  const handleResetPassword = (data: ResetPasswordFormData) => {
    resetPassword(
      { email, otp, newPassword: data.password },
      {
        onSuccess: () => router.push('/'),
      }
    );
  };

  return (
    <div className="relative flex flex-col gap-6 max-w-2xl w-full mx-auto ">
      <button
        onClick={() => {
          // setOtpSent(false);
          onBack();
        }}
        className="absolute top-2 left- text-[#0890A8] border border-[#0890A8] text-lg font-medium rounded-full px-2 py-1 hover:bg-[#0890A8] hover:text-white transition-colors"
      >
        ←
      </button>

      <h2 className="text-2xl font-medium text-center text-[#444444] mt-8 mb-4">
        Forgot Password
      </h2>

      {/* Error message */}
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {apiError instanceof Error
            ? apiError.message
            : 'Password reset failed'}
        </div>
      )}

      {/* Step 1: Email input */}
      {step === 'email' && (
        <form
          onSubmit={handleSubmitEmail(handleSendEmail)}
          className="flex justify-center"
        >
          <Input
            className="w-[20rem]"
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...registerEmail('email')}
            error={emailErrors.email?.message}
            rightElement={
              <button
                type="submit"
                className=" text-[#0890A8] shadow-none px-3 py-1 text-sm rounded-md "
              >
                Send code
              </button>
            }
          />
        </form>
      )}

      {/* Step 2: OTP Input */}
      {step === 'otp' && (
        <OtpInput
          length={6}
          onComplete={handleVerifyOtp}
          helperText="Input the six digit code that has been sent to your email"
          className="mt-6 w-full items-center" // 👈 your custom styling here
        />
      )}

      {/* Step 3: Reset Password */}
      {step === 'reset' && (
        <form onSubmit={handleSubmitPassword(handleResetPassword)}>
          <div className="flex flex-col gap-4 max-w-md mx-auto">
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
              className="bg-[#0890A8] text-white flex items-center justify-center w-full h-[3.0625rem] mt-4"
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
