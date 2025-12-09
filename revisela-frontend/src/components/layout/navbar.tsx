'use client';

import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Folder, GraduationCap } from 'lucide-react';

import { useLogout } from '@/services/features/auth';
import {
  EditIcon,
  FileDocumentIcon,
  GlobeIcon,
  LogoutIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from '@/components/icons';
import { CreateFolderModal } from '@/components/modals';
import { selectProfileImage, selectUser } from '@/store/slices/authSlice';
import { ROUTES } from '@/constants/routes';
import Logo from '@/assets/icons/revisela-logo.png';
import { useAppSelector } from '@/store';
import { Button, Dropdown } from '../ui';

const RootNavbar = () => {
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const user = useAppSelector(selectUser);
  const profileImage = useAppSelector(selectProfileImage);

  const handleAccountSettingsClick = () => {
    router.push(ROUTES.DASHBOARD.ACCOUNT_SETTINGS);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = '/';
      },
    });
  };

  const searchParams = useSearchParams();
  const folderId = searchParams.get('folderId');

  const handleCreateQuizSet = () => {
    // If we are on the library page, we want to stay there and open the "create" view
    if (pathname.startsWith(ROUTES.DASHBOARD.LIBRARY)) {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('action', 'create-quiz');
      router.push(`${pathname}?${currentParams.toString()}`);
    } else {
      // Fallback for other pages: go to dedicated create page or library create mode
      // User specific request: "dont make route for create set IF i was on dashboard/library"
      // Implies if elsewhere, maybe okay? 
      // But let's route to library create mode for consistency if possible, or just create-set page.
      // Let's stick to create-set page for non-library contexts to avoid confusion, or folderId propagation issues.
      // But if folderId is known, we might want library.
      // Simplifying:
      const route = folderId
        ? `${ROUTES.DASHBOARD.QUIZ_SETS.CREATE}?folderId=${folderId}`
        : ROUTES.DASHBOARD.QUIZ_SETS.CREATE;
      router.push(route);
    }
  };
  const handleCreateFolder = () => setIsFolderModalOpen(true);
  const handleCreateClass = () => router.push(ROUTES.DASHBOARD.CLASSES.CREATE);

  // ✅ Debounce search effect (waits 400ms after user stops typing)
  const pathname = usePathname();

  // ✅ Debounce search effect (waits 400ms after user stops typing)
  useEffect(() => {
    const trimmed = searchQuery.trim();

    const timeout = setTimeout(() => {
      if (trimmed) {
        router.push(`/dashboard/search?query=${encodeURIComponent(trimmed)}`);
      } else {
        // Only redirect to dashboard if we are currently on the search page
        if (pathname.includes('/dashboard/search')) {
          router.push('/dashboard');
        }
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery, router, pathname]);

  return (
    <>
      <div className="fixed z-[100] h-[77px] top-0 left-0 right-0 flex items-center justify-between px-[15px] sm:px-[30px] py-[22px] bg-white">
        <div className='flex flex-1 justify-start gap-28'>
          <Image src={Logo} alt="Logo" className="w-[102px]" />
          {/* ✅ Live search bar */}
          <div className="relative max-w-[735px] w-full">
            <div className="flex items-center relative">
              <SearchIcon className="absolute left-3 text-gray-600" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Quiz Sets, People, Subjects..."
                className="w-full py-2 px-10 border border-[#ACACAC] rounded-lg focus:outline-[#0890A8] cursor-text"
              />
            </div>
          </div>
        </div>


        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          <Button className="h-10 rounded-lg px-4 flex items-center gap-2 bg-[#7E2EFF] text-white">
            <GlobeIcon size={20} />
            Explore
          </Button>

          {/* Plus button with dropdown */}
          <Dropdown
            trigger={
              <Button
                className="h-10 px-4 flex items-center justify-center rounded-lg bg-[#0890A8] text-white"
                aria-label="Create new"
              >
                <PlusIcon size={24} />
                Create
              </Button>
            }
            items={[
              {
                label: (
                  <div className="flex items-center gap-2">
                    <FileDocumentIcon size={16} />
                    Quiz Set
                  </div>
                ),
                onClick: handleCreateQuizSet,
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <Folder size={16} />
                    Folder
                  </div>
                ),
                onClick: handleCreateFolder,
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} />
                    Class
                  </div>
                ),
                onClick: handleCreateClass,
              },
            ]}
          />

          {/* Profile dropdown */}
          <Dropdown
            trigger={
              <Button
                className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 p-0 focus:outline-none overflow-hidden"
                aria-label="User options"
              >
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <UserIcon size={24} />
                )}
              </Button>
            }
            items={[
              {
                label: (
                  <div className="flex items-center gap-2">
                    <EditIcon size={16} />
                    Account Settings
                  </div>
                ),
                onClick: handleAccountSettingsClick,
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <LogoutIcon size={16} />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </div>
                ),
                onClick: handleLogout,
                disabled: isLoggingOut,
              },
            ]}
          />
        </div>
      </div>

      {/* Folder modal */}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onOpenChange={setIsFolderModalOpen}
        onSuccess={() => router.push('/dashboard/library')}
      />
    </>
  );
};

export default RootNavbar;
