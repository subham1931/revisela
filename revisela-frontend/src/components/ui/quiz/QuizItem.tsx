'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import {
  Bookmark,
  Copy,
  Folder,
  FolderSymlink,
  History,
  LockKeyholeOpen,
  Merge,
  Pencil,
  Star,
  Trash2,
} from 'lucide-react';

import { useBookmarkQuiz } from '@/services/features/quizzes';

import {
  ConfirmationModal,
  DuplicateQuizModal,
  MoveQuizModal,
} from '@/components/modals';
import { ActionDropdown } from '@/components/ui';

export interface QuizItemProps {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  authorName?: string;
  authorAvatar?: string;
  rating?: number;
  isBookmarked?: boolean;
  isInTrash?: boolean;
  onClick?: (id: string, title: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onShare?: (id: string) => void;
}

const QuizItem: React.FC<QuizItemProps> = ({
  id,
  title,
  description,
  tags = [],
  authorName = 'Sam Smith',
  authorAvatar,
  rating = 2,
  isBookmarked = false,
  isInTrash = false,
  onClick,
  onDelete,
  onRestore,
  onShare,
}) => {
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);

  const bookmarkQuiz = useBookmarkQuiz();

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await bookmarkQuiz.mutateAsync({ quizId: id, bookmarked: !isBookmarked });
    } catch (err) {
      console.error('❌ bookmark failed:', err);
    }
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
    : [
        {
          label: 'Edit',
          icon: <Pencil size={16} />,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            window.location.href = `/dashboard/quizzes/${id}/edit`;
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

  return (
    <>
      <div
        onClick={() => onClick?.(id, title)}
        className="w-full min-h-[220px] p-4 border border-[#E5E5E5] rounded-xl bg-white
                   flex flex-col justify-between hover:border-[#0890A8]/50 transition-all duration-200 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Folder size={18} className="text-[#444444]" />
            <span className="font-semibold text-[#444444] leading-tight">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isInTrash && isBookmarked && (
              <Bookmark
                size={18}
                className="text-[#0890A8] fill-[#0890A8]"
                strokeWidth={1.5}
              />
            )}

            {/* Wrap dropdown trigger to prevent card click and avoid stacking issues */}
            <div
              className="relative z-10"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <ActionDropdown items={dropdownItems} />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mt-2 line-clamp-4 leading-relaxed">
          {description ||
            'This quiz covers topics with real‑world examples and detailed explanations.'}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium text-gray-500">Tags:</span>{' '}
            {tags.join(', ')}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center mt-4">
          <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={authorName}
                width={28}
                height={28}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                👤
              </div>
            )}
          </div>
          <div className="ml-2">
            <p className="text-xs font-medium text-[#222]">{authorName}</p>
            <div className="flex text-[#FFD700]">
              {Array.from({ length: rating }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill="#FFD700"
                  className="text-yellow-400"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {!isInTrash && (
        <>
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
        </>
      )}

      <ConfirmationModal
        isOpen={removeModalOpen}
        onOpenChange={setRemoveModalOpen}
        title={isInTrash ? 'Permanently Delete Quiz' : 'Remove Quiz'}
        description={
          isInTrash
            ? 'This action cannot be undone. Permanently remove this quiz?'
            : 'Are you sure you want to delete this quiz?'
        }
        confirmText={isInTrash ? 'Confirm' : 'Remove'}
        confirmButtonClass={
          isInTrash
            ? 'text-black border hover:border-[#E70000]'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }
        onConfirm={() => {
          setRemoveModalOpen(false);
          onDelete?.(id);
        }}
      />
    </>
  );
};

export default QuizItem;
