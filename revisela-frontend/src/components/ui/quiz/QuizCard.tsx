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
  Users,
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
  isClass?: boolean;
  isShared?: boolean;
  hideActions?: boolean;
  parentRoute?: string;
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
  isClass = false,
  isShared = false,
  hideActions = false,
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
            router.push(`/dashboard/${id}/edit`);
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
            onManageAccess?.(id) ?? setManageAccessModalOpen(true);
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
        // {
        //   label: 'Merge',
        //   icon: <Merge size={16} />,
        //   onClick: (e: React.MouseEvent) => {
        //     e.stopPropagation();
        //     setMoveModalOpen(true);
        //   },
        // },
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
    if ((!isClass || parentRoute.includes('classes')) && parentRoute !== 'trash') {
      const route = parentRoute.startsWith('/') ? parentRoute : `/${parentRoute}`;
      router.push(`${route}/${id}`);
    }
  };

  return (
    <>
      <div
        className="p-4 border-2 border-[#ACACAC] rounded-lg bg-white hover:border-[#0890A8] cursor-pointer flex flex-col gap-2"
        onClick={handleCardClick}
      >
        {/* Title + actions */}
        <div className="flex items-start justify-between">
          <span className="font-semibold text-[#444444]">{title}</span>

          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {!isInTrash && isBookmarked && !hideActions && (
              <Bookmark
                size={18}
                className="text-[#444444] fill-[#444444]"
                strokeWidth={1.5}
              />
            )}

            {!isInTrash && isShared && (
              <Users
                size={18}
                className="text-[#444444]"
                strokeWidth={1.5}
              />
            )}

            {!hideActions && <ActionDropdown items={dropdownItems} />}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 h-15 max-h-15">{description}</p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mt-2 text-xs items-center">
          <p>Tags :</p>
          {(tags.length ? tags : ['General', 'Sample', 'Quiz']).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* User + rating */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Image
              src={user?.profileImage || defaultuser}
              alt={user?.name || 'You'}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <span className="text-sm text-gray-700">
                {user?.name || 'You'}
              </span>
              <span className="text-xs text-gray-700">Not Shared</span>
            </div>
          </div>

          {rating > 0 && (
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-yellow-400">
                  {i < rating ? '★' : '☆'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}

      <DuplicateQuizModal
        isOpen={duplicateModalOpen}
        onOpenChange={setDuplicateModalOpen}
        quizId={id}
        quizTitle={title}
      />

      <MoveQuizModal
        isOpen={moveModalOpen}
        onOpenChange={setMoveModalOpen}
        quizId={id}
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

      {quizData && currentUser && (
        <QuizManageAccessModal
          isOpen={manageAccessModalOpen}
          onOpenChange={setManageAccessModalOpen}
          quizId={id}
          owner={{
            _id:
              typeof quizData.createdBy === 'string'
                ? quizData.createdBy
                : quizData.createdBy?._id || '',
            name:
              typeof quizData.createdBy === 'object'
                ? quizData.createdBy?.name || 'Unknown'
                : 'Unknown',
            email:
              typeof quizData.createdBy === 'object'
                ? quizData.createdBy?.email || ''
                : '',
            avatar:
              typeof quizData.createdBy === 'object'
                ? quizData.createdBy?.profileImage
                : undefined,
          }}
          members={(quizData.sharedWith || []).map((share: any) => {
            let id = '';
            let name = 'Unknown';
            let email = '';
            let avatar;

            if (typeof share.user === 'string') id = share.user;
            else if (share.user?._id) {
              id = share.user._id;
              name = share.user.name;
              email = share.user.email;
              avatar = share.user.profileImage;
            } else if (share.user?.name) {
              id = share.user._id || '';
              name = share.user.name;
              email = share.user.email;
              avatar = share.user.profileImage;
            } else id = share.user?.toString();

            return {
              _id: id,
              name,
              email,
              avatar,
              role:
                share.accessLevel === 'admin'
                  ? 'collaborator'
                  : share.accessLevel || 'member',
            };
          })}
          currentUserId={currentUser.id || currentUser._id || ''}
          publicAccess={
            quizData.publicAccess === 'public' ? 'public' : 'restricted'
          }
          userAccessLevel="owner"
        />
      )}
    </>
  );
};

export default QuizCard;
