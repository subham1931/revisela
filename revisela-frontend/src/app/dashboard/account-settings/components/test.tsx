'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Upload, User } from 'lucide-react';

import { useInitAuthUser } from '@/services/features/auth';
import { useUploadProfileImageAlt } from '@/services/features/uploads';
import { useDeleteAccount, useUpdateProfile } from '@/services/features/users';

import { Switch } from '@/components/ui';
import { ContentLoader, LoadingSpinner } from '@/components/ui/loaders';
import { useToast } from '@/components/ui/toast/index';
import { performLogout } from '@/lib/auth-utils';
import { formatToDDMMMYYYY, safeLocalStorage } from '@/lib/utils';
import { useAppDispatch } from '@/store';
import { logout, updateProfileImage } from '@/store/slices/authSlice';

import ChangePasswordModal from './components/change-password-modal';
import DeleteAccountModal from './components/delete-account-modal';
import EditFieldModal from './components/edit-profile-detail'; // <-- New generic modal

const AccountSettings = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { data: userData, isLoading: isLoadingUser } = useInitAuthUser();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: deleteAccount } = useDeleteAccount();
  const { mutate: uploadProfileImage } = useUploadProfileImageAlt();

  const [fieldEditHistory, setFieldEditHistory] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    username: '',
    email: '',
    birthday: '',
    profileImage: '',
  });

  const [profileImage, setProfileImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Modal state for editing fields
  const [activeEditField, setActiveEditField] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setUserProfile({
        fullName: String(userData?.name || ''),
        username: String(userData?.username || ''),
        email: String(userData?.email || ''),
        birthday: formatToDDMMMYYYY(String(userData?.birthday || '')),
        profileImage: String(userData?.profileImage || ''),
      });

      if (userData?.profileImage) setProfileImage(userData.profileImage);

      const storedHistory = safeLocalStorage.getItem(`editHistory_${userData._id}`);
      if (storedHistory) setFieldEditHistory(JSON.parse(storedHistory));
    }
  }, [userData]);

  const handleUpdateProfile = (field: keyof typeof userProfile, value: string) => {
    if (userProfile[field] === value) return;

    if ((field === 'fullName' || field === 'birthday') && fieldEditHistory[field]) {
      toast({ title: 'Edit Restricted', description: `Your ${field} can only be changed once.`, type: 'error' });
      return;
    }

    if (!value.trim()) {
      toast({ title: 'Validation Error', description: `${field} cannot be empty.`, type: 'error' });
      return;
    }

    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast({ title: 'Validation Error', description: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    if (field === 'username' && !/^[a-zA-Z0-9_]+$/.test(value)) {
      toast({ title: 'Validation Error', description: 'Username can only contain letters, numbers, and underscores.', type: 'error' });
      return;
    }

    if (field === 'birthday' && !/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(value)) {
      toast({ title: 'Validation Error', description: 'Invalid date format. Please use DD-MMM-YYYY format.', type: 'error' });
      return;
    }

    setUserProfile((prev) => ({ ...prev, [field]: value }));

    const fieldMap: Record<string, string> = { fullName: 'name', username: 'username', email: 'email', birthday: 'birthday' };
    updateProfile({ [fieldMap[field]]: value, _id: userData?._id }, {
      onSuccess: () => {
        if (field === 'fullName' || field === 'birthday') {
          const updatedHistory = { ...fieldEditHistory, [field]: true };
          setFieldEditHistory(updatedHistory);
          if (userData?._id) safeLocalStorage.setItem(`editHistory_${userData._id}`, JSON.stringify(updatedHistory));
        }
        toast({ title: 'Profile Updated', description: `Your ${field} has been updated successfully.` });
      },
      onError: (error: any) => {
        setUserProfile((prev) => ({ ...prev, [field]: userProfile[field] }));
        toast({ title: 'Update Failed', description: error.message || `Failed to update ${field}.` });
      }
    });
  };

  const handleDeleteAccount = async () => {
    return new Promise((resolve, reject) => {
      deleteAccount(undefined, {
        onSuccess: () => {
          performLogout();
          dispatch(logout());
          toast({ title: 'Account Deleted', description: 'Your account has been deleted successfully.', type: 'success' });
          window.location.href = '/';
          resolve(true);
        },
        onError: (error: any) => {
          toast({ title: 'Delete Failed', description: error.message || 'Failed to delete your account.', type: 'error' });
          reject(error);
        }
      });
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      uploadProfileImage({ file }, {
        onSuccess: (data: any) => {
          setProfileImage(data?.url || '');
          dispatch(updateProfileImage(data?.url || ''));
          toast({ title: 'Profile Updated', description: 'Your profile image has been updated successfully.' });
        },
        onError: (error: any) => {
          toast({ title: 'Upload Failed', description: error.message || 'Failed to upload image.', type: 'error' });
        },
        onSettled: () => setIsUploadingImage(false)
      });
    } catch (error: any) {
      toast({ title: 'Upload Failed', description: error.message || 'Failed to upload image.', type: 'error' });
      setIsUploadingImage(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const openEditModal = (field: string) => setActiveEditField(field);
  const closeEditModal = () => setActiveEditField(null);

  if (isLoadingUser) {
    return <ContentLoader message="Loading your profile..." size="lg" variant="primary" className="h-screen" />;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-[18px] font-semibold text-[#0890A8] mb-6">Account Settings</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-[18px] font-medium text-secondary-black mb-4">Profile Section</h2>

        <div className="flex items-center mb-6">
          <div className="relative h-[96px] w-[96px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <div className="relative h-full w-full">
                <Image src={profileImage} alt="Profile" className={`h-full w-full object-cover ${isUploadingImage ? 'blur-sm' : ''}`} width={96} height={96} />
                {isUploadingImage && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"><LoadingSpinner size="sm" variant="light" /></div>}
              </div>
            ) : (
              <>
                <User height={57} width={57} className="text-gray-500" />
                <div className="h-[2px] w-9/12 bg-[#444]" />
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/png,image/jpeg,image/gif" className="hidden" />
            <button className="absolute bottom-0 left-0 right-0 text-[14px] text-white bg-black bg-opacity-50 py-1 rounded-b-full" onClick={triggerFileInput} disabled={isUploadingImage}>
              {isUploadingImage ? <span className="animate-pulse">Uploading...</span> : <span className="flex items-center justify-center"><Upload size={14} className="mr-1" />{profileImage ? 'Change' : 'Upload'}</span>}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {userProfile.fullName && (
  <>
    {[
      { field: 'fullName', label: 'Full Name', type: 'text' },
      { field: 'username', label: 'Username', type: 'text' },
      { field: 'email', label: 'Email', type: 'email' },
      { field: 'birthday', label: 'Birthday', type: 'date' }
    ].map(({ field, label }) => (
      <div
        key={field}
        className={`flex justify-between items-center border-b pb-2 cursor-pointer hover:text-[#0890A8] ${fieldEditHistory[field] ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={() => !fieldEditHistory[field] && openEditModal(field)}
      >
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">{userProfile[field as keyof typeof userProfile]}</span>
      </div>
    ))}
  </>
)}

        </div>
      </div>

      {/* Account & Privacy */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-[18px] font-medium text-secondary-black mb-4">Account & Privacy</h2>

        <div className="space-y-4">
          <button className="text-[#0890A8] font-medium text-[18px]" onClick={() => setIsPasswordModalOpen(true)}>Change/Create Password</button>
          <div className="border-t pt-4 flex justify-between items-center">
            <div>
              <p className="text-secondary-black font-medium text-[18px]">Delete Account</p>
              <p className="text-[18px] text-neutral-gray">This will delete all your data and cannot be undone.</p>
            </div>
            <button className="text-red-500 cursor-pointer" onClick={() => setIsDeleteModalOpen(true)}><Trash2 size={20} /></button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-[18px] font-medium text-secondary-black mb-4">Notifications</h2>
        <Switch label="Allow Revisela to share Updates, Marketing Material and Offers to your email." description="We promise to not be annoying!" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
      </div>

      {/* Modals */}
      <EditFieldModal
        isOpen={!!activeEditField}
        onOpenChange={(open) => !open && closeEditModal()}
        field={activeEditField || ''}
        label={activeEditField ? activeEditField.charAt(0).toUpperCase() + activeEditField.slice(1) : ''}
        type={
          activeEditField === 'email' ? 'email' :
          activeEditField === 'birthday' ? 'date' : 'text'
        }
        initialValue={activeEditField ? userProfile[activeEditField as keyof typeof userProfile] : ''}
        onSave={(value) => { handleUpdateProfile(activeEditField as any, value); closeEditModal(); }}
      />

      <DeleteAccountModal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} onDelete={handleDeleteAccount} />
      <ChangePasswordModal isOpen={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} userId={userData?._id as string} />
    </div>
  );
};

export default AccountSettings;
