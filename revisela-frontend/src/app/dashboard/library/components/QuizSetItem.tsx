// 'use client';

// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react';

// import {
//   Bookmark,
//   Copy,
//   FolderSymlink,
//   History,
//   LockKeyholeOpen,
//   Merge,
//   Pencil,
//   Trash2,
// } from 'lucide-react';

// import {
//   ConfirmationModal,
//   DuplicateQuizModal,
//   MoveQuizModal,
// } from '@/components/modals';
// import { ActionDropdown } from '@/components/ui';

// import defaultuser from '../../../../assets/images/default-user.png';

// interface QuizSetItemProps {
//   id?: string;
//   title: string;
//   description: string;
//   tags: string[];
//   rating?: number;
//   user?: {
//     name: string;
//     profileImage?: string;
//   };
//   isBookmarked?: boolean;
//   isInTrash?: boolean;
//   onClick?: (id: string, title: string) => void;
//   onDelete?: (id: string) => void;
//   onRestore?: (id: string) => void;
// }

// const QuizSetItem: React.FC<QuizSetItemProps> = ({
//   id = '',
//   title,
//   description,
//   tags,
//   rating = 0,
//   user,
//   isBookmarked = false,
//   isInTrash = false,
//   onClick,
//   onDelete,
//   onRestore,
// }) => {
//   const [removeModalOpen, setRemoveModalOpen] = useState(false);
//   const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
//   const [moveModalOpen, setMoveModalOpen] = useState(false);

//   const router = useRouter();

//   const dropdownItems = isInTrash
//     ? [
//         {
//           label: 'Restore',
//           icon: <History size={16} />,
//           onClick: (e: React.MouseEvent) => {
//             e.stopPropagation();
//             onRestore?.(id);
//           },
//         },
//         {
//           label: 'Delete Permanently',
//           icon: <Trash2 size={16} />,
//           className: 'text-red-500 font-medium',
//           onClick: (e: React.MouseEvent) => {
//             e.stopPropagation();
//             setRemoveModalOpen(true);
//           },
//         },
//       ]
//     : [
//         {
//           label: 'Edit',
//           icon: <Pencil size={16} />,
//           onClick: (e: React.MouseEvent) => {
//             e.stopPropagation();
//             router.push(`/dashboard/quizzes/${id}/edit`);
//           },
//         },
//         {
//           label: 'Duplicate',
//           icon: <Copy size={16} />,
//           onClick: (e: React.MouseEvent) => {
//             e.stopPropagation();
//             setDuplicateModalOpen(true);
//           },
//         },
//         {
//           label: isBookmarked ? 'Undo Bookmark' : 'Bookmark',
//           icon: (
//             <Bookmark
//               size={16}
//               className={isBookmarked ? 'fill-[#0890A8] text-[#0890A8]' : ''}
//             />
//           ),
//           onClick: (e: React.MouseEvent) => e.stopPropagation(),
//         },
//         {
//           label: 'Move',
//           icon: <FolderSymlink size={16} />,
//           onClick: (e: React.MouseEvent) => {
//             e.stopPropagation();
//             setMoveModalOpen(true);
//           },
//         },
//         {
//           label: 'Merge',
//           icon: <Merge size={16} />,
//           onClick: (e: React.MouseEvent) => {
//             e.stopPropagation();
//             setMoveModalOpen(true);
//           },
//         },
//         {
//           label: 'Delete',
//           icon: <Trash2 size={16} />,
//           className: 'text-red-500 font-medium',
//           onClick: (e: React.MouseEvent) => {
//             e.stopPropagation();
//             setRemoveModalOpen(true);
//           },
//         },
//       ];

//   const handleRemove = () => {
//     if (onDelete) {
//       setRemoveModalOpen(false);
//       onDelete(id);
//     }
//   };

//   return (
//     <>
//       <div
//         className="p-4 border  border-black rounded-lg bg-white hover:border-[#0890A8]  cursor-pointer flex flex-col gap-2"
//         // onClick={() => router.push(`/dashboard/library/${id}`)}
//         onClick={() => onClick?.(id, title)}
//       >
//         {/* Header: Title + Dropdown */}
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-2">
//             <span className="font-semibold text-[#444444]">{title}</span>
//           </div>

//           {/* Action Dropdown */}
//           <div
//             className="relative z-10"
//             onPointerDown={(e) => e.stopPropagation()}
//             onMouseDown={(e) => e.stopPropagation()}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <ActionDropdown items={dropdownItems} />
//           </div>
//         </div>

//         {/* Description */}
//         <p className="text-sm text-gray-500 h-15 max-h-15">{description}</p>

//         {/* Tags */}
//         <div className="flex gap-2 flex-wrap mt-2 text-xs items-center">
//           <p>Tags :</p>
//           {(tags && tags.length > 0 ? tags : ['General', 'Sample', 'Quiz']).map(
//             (tag) => (
//               <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
//                 {tag}
//               </span>
//             )
//           )}
//         </div>

//         {/* User Info */}
//         <div className="flex items-center gap-2 mt-2">
//           <Image
//             src={user?.profileImage || defaultuser}
//             alt={user?.name || 'You'}
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div className="flex flex-col">
//             <span className="text-sm text-gray-700">{user?.name || 'You'}</span>
//             <span className="text-xs text-gray-700">Not Shared</span>
//           </div>
//         </div>

//         {/* Rating */}
//         {rating > 0 && (
//           <div className="flex mt-2">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <span key={i} className="text-yellow-400">
//                 {i < rating ? '★' : '☆'}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <DuplicateQuizModal
//         isOpen={duplicateModalOpen}
//         onOpenChange={setDuplicateModalOpen}
//         quizId={id || ''}
//         quizTitle={title}
//       />
//       <MoveQuizModal
//         isOpen={moveModalOpen}
//         onOpenChange={setMoveModalOpen}
//         quizId={id || ''}
//         quizTitle={title}
//       />
//       <ConfirmationModal
//         isOpen={removeModalOpen}
//         onOpenChange={setRemoveModalOpen}
//         title={isInTrash ? 'Permanently Delete Quiz' : 'Remove Quiz'}
//         description={
//           isInTrash
//             ? 'This action cannot be undone. Permanently remove this quiz?'
//             : 'Are you sure you want to delete this quiz?'
//         }
//         confirmText={isInTrash ? 'Confirm' : 'Remove'}
//         confirmButtonClass={
//           isInTrash
//             ? 'text-black border hover:border-[#E70000]'
//             : 'bg-red-500 hover:bg-red-600 text-white'
//         }
//         onConfirm={() => {
//           setRemoveModalOpen(false);
//           onDelete?.(id);
//         }}
//       />
//     </>
//   );
// };

// export default QuizSetItem;





'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  Bookmark,
  Copy,
  FolderSymlink,
  History,
  Merge,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  ConfirmationModal,
  DuplicateQuizModal,
  MoveQuizModal,
} from '@/components/modals';
import { ActionDropdown } from '@/components/ui';

import defaultuser from '../../../../assets/images/default-user.png';

interface QuizSetItemProps {
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
  parentRoute?: string; // new prop to handle dynamic routes
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
}

const QuizSetItem: React.FC<QuizSetItemProps> = ({
  id = '',
  title,
  description,
  tags,
  rating = 0,
  user,
  isBookmarked = false,
  isInTrash = false,
  parentRoute = 'dashboard',
  onDelete,
  onRestore,
}) => {
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);

  const router = useRouter();

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
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
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

  const handleRemove = () => {
    if (onDelete) {
      setRemoveModalOpen(false);
      onDelete(id);
    }
  };

  // Navigate dynamically based on parentRoute
  const handleCardClick = () => {
    if (!id) return;
    router.push(`/${parentRoute}/${id}`);
    console.log('clicked')
  };

  return (
    <>
    
      <div
        className="p-4 border border-black rounded-lg bg-white hover:border-[#0890A8] cursor-pointer flex flex-col gap-2"
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <span className="font-semibold text-[#444444]">{title}</span>

          {/* Action Dropdown */}
          <div
            className="relative z-10"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <ActionDropdown items={dropdownItems} />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 h-15 max-h-15">{description}</p>

        {/* Tags */}
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

        {/* User */}
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

        {/* Rating */}
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

      {/* Modals */}
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
        onConfirm={handleRemove}
      />
    </>
  );
};

export default QuizSetItem;
