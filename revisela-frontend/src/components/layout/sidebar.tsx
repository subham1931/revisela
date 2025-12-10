'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import {
  Bookmark,
  Clock,
  FolderClosed,
  FolderOpen,
  GraduationCap,
  Home,
  Library,
  Trash,
  Users,
} from 'lucide-react';

import { useMyClasses } from '@/services/features/classes';
import { ClassModal } from '@/components/modals';
import { ROUTES } from '@/constants/routes';

type MenuItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

const Sidebar = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('/dashboard');
  const [showClasses, setShowClasses] = useState(true);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classModalType, setClassModalType] = useState<'create' | 'join'>(
    'create'
  );

  // Fetch user's classes - only when showClasses is true
  const { data: classes, isLoading: loadingClasses } = useMyClasses({
    enabled: showClasses,
  });

  // console.log(classes)

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const isActive = (path: string) => activeTab === path;

  const activeItemStyle = 'bg-[#0890A8]/25 text-[#0890A8]';
  const activeClassItemStyle = 'bg-[#058F3A26] text-[#058F3A] font-medium';
  const inactiveItemStyle =
    'text-secondary-black hover:bg-[#0890A8]/10 hover:text-[#0890A8] cursor-pointer';

  // Main navigation menu items
  const mainMenuItems: MenuItem[] = [
    { path: ROUTES.DASHBOARD.HOME, label: 'Home', icon: <Home size={20} /> },
    { path: ROUTES.DASHBOARD.LIBRARY, label: 'My Library', icon: <FolderClosed size={20} /> },
    { path: ROUTES.DASHBOARD.SHARED, label: 'Shared With Me', icon: <Users size={20} /> },
    { path: ROUTES.DASHBOARD.BOOKMARKS, label: 'Bookmarked', icon: <Bookmark size={20} /> },
    { path: ROUTES.DASHBOARD.RECENT, label: 'Recent', icon: <Clock size={20} /> },
    { path: ROUTES.DASHBOARD.TRASH, label: 'Trash', icon: <Trash size={20} /> },
  ];

  // Convert classes to menu items
  const classMenuItems: MenuItem[] = useMemo(
    () =>
      classes?.map((classItem) => ({
        path: `${ROUTES.DASHBOARD.CLASSES.ROOT}/${classItem._id}`,
        label: classItem.name,
        icon: <Users size={18} />,
      })) || [],
    [classes]
  );

  const hasClasses = classes && classes.length > 0;
  const hasMoreThanTwoClasses = classes && classes.length > 2;

  const handleCreateClass = () => {
    setClassModalType('create');
    setIsClassModalOpen(true);
  };

  const handleJoinClass = () => {
    setClassModalType('join');
    setIsClassModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col p-4 ">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 p-2 rounded-md ${isActive(item.path) ? activeItemStyle : inactiveItemStyle
                }`}
            >
              {item.icon}
              <span className="text-[16px]">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="my-1 border-t border-gray-200"></div>

        {/* My Classes Section */}
        <div className="space-y-1">
          {/* <div className="flex items-center justify-between">
            <button
              onClick={() => setShowClasses(!showClasses)}
              className="flex items-center gap-2 text-secondary-black hover:text-[#0890A8] cursor-pointer"
            >
              <GraduationCap size={20} />
              <span className="text-[16px] font-medium">My Classes</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  showClasses ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {hasClasses && (
              <span className="bg-[#0890A8] text-white text-xs px-2 py-1 rounded-full">
                {classes.length}
              </span>
            )}
          </div> */}

          {/* {showClasses && ( */}
          <div className="space-y-1">
            {loadingClasses ? (
              <div className="text-gray-500 text-sm p-2">Loading classes...</div>
            ) : hasClasses ? (
              <>
                <div className="space-y-1 overflow-hidden ">
                  {classMenuItems.map((item, index) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-3 p-2 rounded-md text-sm transition-all duration-200 ${isActive(item.path) ? activeClassItemStyle : inactiveItemStyle
                        } ${!showAllClasses && hasMoreThanTwoClasses && index >= 2
                          ? 'hidden'
                          : ''
                        }`}
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* View More/Less button */}
                {hasMoreThanTwoClasses && (
                  <button
                    onClick={() => setShowAllClasses(!showAllClasses)}
                    className="flex items-center justify-center gap-2 p-2 rounded-md text-sm text-[#0890A8] hover:bg-[#0890A8]/10 transition-all duration-200 mt-2"
                  >
                    {showAllClasses ? 'View Less' : `View More (${classes.length - 2} more)`}
                  </button>
                )}

                {/* Create & Join buttons */}
                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={handleJoinClass}
                    className="flex items-center justify-start gap-2 p-3 rounded-2xl bg-[#058F3A] text-white hover:bg-[#058F3A]/90 transition-all duration-200"
                  >
                    <Users size={18} />
                    Join A Class
                  </button>
                </div>
              </>
            ) : (
              // Empty state
              <div className="flex flex-col gap-3">
                <div className="text-gray-500 text-center p-2 border border-gray-200 rounded-md bg-white">
                  You haven't joined or created any classes yet.
                </div>
                <button
                  onClick={handleCreateClass}
                  className="flex items-center justify-center gap-2 p-3 rounded-md bg-[#0890A8] text-white"
                >
                  Create A Class
                </button>
                <button
                  onClick={handleJoinClass}
                  className="flex items-center justify-center gap-2 p-3 rounded-md bg-[#058F3A] text-white"
                >
                  Join A Class
                </button>
              </div>
            )}
          </div>
          {/* )} */}
        </div>
      </div>

      <ClassModal
        isOpen={isClassModalOpen}
        onOpenChange={setIsClassModalOpen}
        type={classModalType}
      />
    </>
  );
};

export default Sidebar;
