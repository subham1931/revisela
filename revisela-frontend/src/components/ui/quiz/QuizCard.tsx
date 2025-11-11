'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {
  Bookmark,
  Copy,
  FolderSymlink,
  History,
  LockKeyholeOpen,
  Merge,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  ConfirmationModal,
  DuplicateQuizModal,
  MoveQuizModal,
  QuizManageAccessModal,
} from '@/components/modals';
import { ActionDropdown } from '@/components/ui';

import defaultuser from '@/assets/images/default-user.png';
import { useBookmarkQuiz, useQuiz } from '@/services';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

export interface QuizCardProps {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  rating?: number;
  user?: {
    name: string;
    profileImage?: string;
  };
  isBookmarked?: boolean;
  isInTrash?: boolean;
  isClass?: boolean; // NEW PROP
  parentRoute?: string; // new prop to handle dynamic routes
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onManageAccess?: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  id = '',
  title,
  description,
  tags,
  rating = 0,
  user,
  isBookmarked = false,
  isInTrash = false,
  isClass = false, // default false
  parentRoute = 'dashboard',
  onDelete,
  onRestore,
  onManageAccess,
}) => {
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [manageAccessModalOpen, setManageAccessModalOpen] = useState(false);

  const router = useRouter();
  const bookmarkQuiz = useBookmarkQuiz();
  const currentUser = useAppSelector(selectUser);
  
  // Fetch quiz data when manage access modal opens
  const { data: quizData } = useQuiz(manageAccessModalOpen ? id : undefined);

  const handleRemove = () => {
    if (onDelete) {
      setRemoveModalOpen(false);
      onDelete(id);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    bookmarkQuiz.mutate({ quizId: id, bookmarked: !isBookmarked });
  };

  // Dropdown items
  const dropdownItems = isInTrash
    ? [
        {
          label: 'Restore',
          icon: <History size={16} />,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onRestore?.(id);
          },
        },
        {
          label: 'Delete Permanently',
          icon: <Trash2 size={16} />,
          className: 'text-red-500 font-medium',
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            setRemoveModalOpen(true);
          },
        },
      ]
    : isClass
      ? [
          {
            label: 'Duplicate',
            icon: <Copy size={16} />,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              setDuplicateModalOpen(true);
            },
          },
          {
            label: isBookmarked ? 'Undo Bookmark' : 'Bookmark',
            icon: (
              <Bookmark
                size={16}
                className={isBookmarked ? 'fill-[#0890A8] text-[#0890A8]' : ''}
              />
            ),
            onClick: handleBookmark,
          },
        ]
      : [
          {
            label: 'Edit',
            icon: <Pencil size={16} />,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              router.push(`/dashboard/quizzes/${id}/edit`);
            },
          },
          {
            label: 'Duplicate',
            icon: <Copy size={16} />,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              setDuplicateModalOpen(true);
            },
          },
          {
            label: isBookmarked ? 'Undo Bookmark' : 'Bookmark',
            icon: (
              <Bookmark
                size={16}
                className={isBookmarked ? 'fill-[#0890A8] text-[#0890A8]' : ''}
              />
            ),
            onClick: handleBookmark,
          },
          {
            label: 'Manage Access',
            icon: <LockKeyholeOpen size={16} />,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              if (onManageAccess) {
                onManageAccess(id);
              } else {
                setManageAccessModalOpen(true);
              }
            },
          },
          {
            label: 'Move',
            icon: <FolderSymlink size={16} />,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              setMoveModalOpen(true);
            },
          },
          {
            label: 'Merge',
            icon: <Merge size={16} />,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              setMoveModalOpen(true);
            },
          },
          {
            label: 'Delete',
            icon: <Trash2 size={16} />,
            className: 'text-red-500 font-medium',
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              setRemoveModalOpen(true);
            },
          },
        ];

  const handleCardClick = () => {
    if (!id) return;
    if (!isClass && parentRoute !== 'trash') {
      router.push(`/${parentRoute}/${id}`);
    }
  };

  return (
    <>
      <div
        className="p-4 border-2 border-[#ACACAC] rounded-lg bg-white hover:border-[#0890A8] cursor-pointer flex flex-col gap-2"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <span className="font-semibold text-[#444444]">{title}</span>

          <div
            className="flex items-center gap-2"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {!isInTrash && isBookmarked && (
              <Bookmark
                size={18}
                className="text-[#444444] fill-[#444444]"
                strokeWidth={1.5}
              />
            )}
            <ActionDropdown items={dropdownItems} />
          </div>
        </div>

        <p className="text-sm text-gray-500 h-15 max-h-15">{description}</p>

        <div className="flex gap-2 flex-wrap mt-2 text-xs items-center">
          <p>Tags :</p>
          {(tags && tags.length > 0 ? tags : ['General', 'Sample', 'Quiz']).map(
            (tag) => (
              <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {tag}
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Image
            src={user?.profileImage || defaultuser}
            alt={user?.name || 'You'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm text-gray-700">{user?.name || 'You'}</span>
            <span className="text-xs text-gray-700">Not Shared</span>
          </div>
        </div>

        {rating > 0 && (
          <div className="flex mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < rating ? '★' : '☆'}
              </span>
            ))}
          </div>
        )}
      </div>

      <DuplicateQuizModal
        isOpen={duplicateModalOpen}
        onOpenChange={setDuplicateModalOpen}
        quizId={id || ''}
        quizTitle={title}
      />
      <MoveQuizModal
        isOpen={moveModalOpen}
        onOpenChange={setMoveModalOpen}
        quizId={id || ''}
        quizTitle={title}
      />
      <ConfirmationModal
        isOpen={removeModalOpen}
        onOpenChange={setRemoveModalOpen}
        title={isInTrash ? 'Delete Item' : 'Remove Quiz'}
        icon={<Trash2 size={20} className="text-red-500" />}
        titleColor="text-red-600"
        subHeading="Are you sure you want to delete this item?"
        description={
          isInTrash
            ? 'This action cannot be undone. Permanently remove this quiz?'
            : 'Are you sure you want to delete this quiz?'
        }
        centerDescription
        confirmText={isInTrash ? 'Confirm' : 'Remove'}
        confirmButtonClass={
          isInTrash
            ? 'text-black border hover:border-[#E70000]'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }
        onConfirm={handleRemove}
      />
      
      {/* Manage Access Modal */}
      {quizData && currentUser && (
        <QuizManageAccessModal
          isOpen={manageAccessModalOpen}
          onOpenChange={setManageAccessModalOpen}
          quizId={id}
          owner={{
            _id: typeof quizData.createdBy === 'string' 
              ? quizData.createdBy 
              : (quizData.createdBy as any)?._id || '',
            name: typeof quizData.createdBy === 'object' 
              ? (quizData.createdBy as any)?.name || 'Unknown' 
              : 'Unknown',
            email: typeof quizData.createdBy === 'object' 
              ? (quizData.createdBy as any)?.email || '' 
              : '',
            avatar: typeof quizData.createdBy === 'object' 
              ? (quizData.createdBy as any)?.profileImage 
              : undefined,
          }}
          members={
            (quizData.sharedWith || []).map((share: any) => {
              // Handle member ID: can be string, populated object with _id, or ObjectId object
              let memberId = '';
              let userName = 'Unknown';
              let userEmail = '';
              let userAvatar: string | undefined = undefined;

              if (typeof share.user === 'string') {
                memberId = share.user;
              } else if (share.user?._id) {
                // Populated user object
                memberId = share.user._id.toString();
                userName = share.user.name || 'Unknown';
                userEmail = share.user.email || '';
                userAvatar = share.user.profileImage;
              } else if (share.user && typeof share.user === 'object') {
                // Could be ObjectId or populated object - check if it has name property
                if (share.user.name) {
                  // Populated user object
                  memberId = share.user._id?.toString() || share.user.toString();
                  userName = share.user.name || 'Unknown';
                  userEmail = share.user.email || '';
                  userAvatar = share.user.profileImage;
                } else {
                  // Likely an ObjectId object
                  memberId = share.user.toString();
                }
              }

              return {
                _id: memberId,
                name: userName,
                email: userEmail,
                avatar: userAvatar,
                role: share.accessLevel === 'admin' ? 'collaborator' as const : (share.accessLevel || 'member') as 'collaborator' | 'member',
              };
            })
          }
          currentUserId={currentUser.id || currentUser._id || ''}
          publicAccess={quizData.publicAccess === 'public' ? 'public' : 'restricted'}
          userAccessLevel={
            typeof quizData.createdBy === 'string'
              ? quizData.createdBy === currentUser.id || quizData.createdBy === currentUser._id
                ? 'owner'
                : quizData.sharedWith?.some((share: any) => {
                    const userId = typeof share.user === 'string' ? share.user : share.user?._id;
                    return userId === currentUser.id || userId === currentUser._id;
                  })
                ? (quizData.sharedWith?.find((share: any) => {
                    const userId = typeof share.user === 'string' ? share.user : share.user?._id;
                    return userId === currentUser.id || userId === currentUser._id;
                  })?.accessLevel === 'admin' ? 'admin' : 'collaborator')
                : 'none'
              : (quizData.createdBy as any)?._id === currentUser.id || (quizData.createdBy as any)?._id === currentUser._id
              ? 'owner'
              : 'none'
          }
        />
      )}
    </>
  );
};

export default QuizCard;
