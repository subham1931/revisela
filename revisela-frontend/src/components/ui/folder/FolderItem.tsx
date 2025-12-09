'use client';

import React, { useEffect, useState } from 'react';

import {
  Bookmark,
  Copy,
  FolderClosed,
  FolderOpen,
  FolderSymlink,
  History,
  LockKeyholeOpen,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';

import {
  useBookmarkFolder,
  useDeleteFolder,
  usePermanentlyDeleteFolder,
  useFolderDetails,
} from '@/services/features/folders';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

import {
  ConfirmationModal,
  DuplicateFolderModal,
  MoveFolderModal,
  FolderManageAccessModal,
} from '@/components/modals';
import { ActionDropdown, Button, Modal } from '@/components/ui';

export interface FolderItemProps {
  id: string;
  name: string;
  onClick?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  onManageAccess?: (id: string) => void;
  onMove?: (id: string) => void; // ✅ new callback, triggers parent modal
  customIcon?: React.ReactNode;
  className?: string;
  isInTrash?: boolean;
  handleDeleteInParent?: boolean;
  isBookmarked?: boolean;
  isShared?: boolean; // ✅ indicates if folder is shared with others
}

const FolderItem: React.FC<FolderItemProps> = ({
  id,
  name,
  onClick,
  onDelete,
  onRestore,
  onRename,
  onManageAccess,
  onMove,
  customIcon,
  className = '',
  isInTrash = false,
  handleDeleteInParent = false,
  isBookmarked = false,
  isShared = false,
}) => {
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(name);
  const [manageAccessModalOpen, setManageAccessModalOpen] = useState(false);

  const deleteFolder = useDeleteFolder();
  const bookmarkFolder = useBookmarkFolder();
  const permanentlyDeleteFolder = usePermanentlyDeleteFolder();
  const currentUser = useAppSelector(selectUser);

  // Fetch folder data when manage access modal opens
  const { data: folderData } = useFolderDetails(
    manageAccessModalOpen ? id : undefined,
    manageAccessModalOpen
  );

  /* -------------------------------------------------------------
     Base actions
  ------------------------------------------------------------- */

  const handleClick = () => onClick?.(id, name);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    bookmarkFolder.mutate({ folderId: id, bookmarked: !isBookmarked });
  };

  const handleRemove = () => {
    const closeAnd = (cb?: () => void) => {
      setRemoveModalOpen(false);
      cb?.();
    };

    if (handleDeleteInParent && onDelete) {
      closeAnd(() => onDelete(id));
      return;
    }

    if (isInTrash) {
      permanentlyDeleteFolder.mutate(id, {
        onSuccess: () => closeAnd(() => onDelete?.(id)),
        onError: (error) => {
          closeAnd();
          console.error('Failed to permanently delete folder:', error);
        },
      });
    } else {
      deleteFolder.mutate(id, {
        onSuccess: () => closeAnd(() => onDelete?.(id)),
        onError: (error) => {
          closeAnd();
          console.error('Failed to delete folder:', error);
        },
      });
    }
  };

  const handleRenameSubmit = () => {
    if (!renameValue.trim()) return;
    setRenameModalOpen(false);
    onRename?.(id, renameValue.trim()); // trigger parent rename mutation
  };

  const isLoading =
    !handleDeleteInParent &&
    (isInTrash ? permanentlyDeleteFolder.isPending : deleteFolder.isPending);

  /* -------------------------------------------------------------
     Dropdown items
  ------------------------------------------------------------- */

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
        label: 'Delete',
        icon: <Trash2 size={16} />,
        className: 'text-red-500 font-medium',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          setRemoveModalOpen(true);
        },
      },
    ]
    : isShared
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
              className={isBookmarked ? 'fill-[#444444] text-[#444444]' : ''}
            />
          ),
          onClick: handleBookmark,
        },
        {
          label: 'Move',
          icon: <FolderOpen size={16} />,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onMove?.(id);
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
      ]
      : [
        {
          label: 'Rename',
          icon: <Pencil size={16} />,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            setRenameValue(name);
            setRenameModalOpen(true);
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
              className={isBookmarked ? 'fill-[#444444] text-[#444444]' : ''}
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
            if (onMove) {
              // trigger parent grid’s MoveFolderModal
              onMove(id);
            } else {
              // fallback legacy modal if parent didn’t supply onMove
              setMoveModalOpen(true);
            }
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
      {/* --- Folder Card --- */}
      <div
        className={`p-4 border-2 border-[#ACACAC] rounded-lg bg-white flex justify-between items-center cursor-pointer transition-all duration-150
          hover:border-[#0890A8] focus:border-[#0890A8] focus:outline-none ${className}`}
        onClick={handleClick}
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          {customIcon || <FolderClosed size={20} />}
          <span className="text-[#444444] truncate">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isInTrash && isBookmarked && (
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

          <ActionDropdown items={dropdownItems} />
        </div>
      </div>

      {/* --- Rename Modal --- */}
      <Modal
        title="Rename Folder"
        icon={<Pencil size={20} className="text-gray-500" />}
        isOpen={renameModalOpen}
        onOpenChange={setRenameModalOpen}
      >
        <div className="flex flex-col gap-5 my-5">
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="border border-[#ACACAC] p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#0890A8]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleRenameSubmit}
              className="bg-[#0890A8] text-white"
            >
              Rename
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- Duplicate Modal --- */}
      {!isInTrash && (
        <DuplicateFolderModal
          isOpen={duplicateModalOpen}
          onOpenChange={setDuplicateModalOpen}
          folderId={id}
          originalName={name}
        />
      )}

      {/* --- Fallback Move Modal (when parent doesn’t supply onMove) --- */}
      {!isInTrash && !onMove && (
        <MoveFolderModal
          isOpen={moveModalOpen}
          onOpenChange={setMoveModalOpen}
          folderId={id}
          folderName={name}
        />
      )}

      {/* --- Delete / Remove Confirmation --- */}
      <ConfirmationModal
        isOpen={removeModalOpen}
        onOpenChange={setRemoveModalOpen}
        title={isInTrash ? 'Delete Item' : 'Remove Folder'}
        icon={<Trash2 size={20} className="text-red-500" />}
        titleColor="text-red-600"
        subHeading="Are you sure you want to delete this item?"
        description={
          isInTrash
            ? 'This action cannot be undone. Are you sure you want to permanently delete this folder?'
            : 'Are you sure you want to remove this folder?'
        }
        centerDescription
        confirmText={isInTrash ? 'Confirm' : 'Remove'}
        confirmButtonClass={
          isInTrash
            ? 'text-black border hover:border-[#E70000]'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }
        onConfirm={handleRemove}
        isLoading={isLoading}
      />

      {/* Manage Access Modal */}
      {folderData && currentUser && (
        <FolderManageAccessModal
          isOpen={manageAccessModalOpen}
          onOpenChange={setManageAccessModalOpen}
          folderId={id}
          owner={{
            _id: typeof folderData.owner === 'string'
              ? folderData.owner
              : (folderData.owner as any)?._id || '',
            name: typeof folderData.owner === 'object'
              ? (folderData.owner as any)?.name || 'Unknown'
              : 'Unknown',
            email: typeof folderData.owner === 'object'
              ? (folderData.owner as any)?.email || ''
              : '',
            avatar: typeof folderData.owner === 'object'
              ? (folderData.owner as any)?.profileImage
              : undefined,
          }}
          members={
            (folderData.sharedWith || []).map((share: any) => {
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
          publicAccess={folderData.publicAccess === 'public' ? 'public' : 'restricted'}
          userAccessLevel={
            typeof folderData.owner === 'string'
              ? folderData.owner === currentUser.id || folderData.owner === currentUser._id
                ? 'owner'
                : folderData.sharedWith?.some((share: any) => {
                  const userId = typeof share.user === 'string' ? share.user : share.user?._id;
                  return userId === currentUser.id || userId === currentUser._id;
                })
                  ? (folderData.sharedWith?.find((share: any) => {
                    const userId = typeof share.user === 'string' ? share.user : share.user?._id;
                    return userId === currentUser.id || userId === currentUser._id;
                  })?.accessLevel === 'admin' ? 'admin' : 'collaborator')
                  : 'none'
              : (folderData.owner as any)?._id === currentUser.id || (folderData.owner as any)?._id === currentUser._id
                ? 'owner'
                : 'none'
          }
        />
      )}
    </>
  );
};

export default FolderItem;
