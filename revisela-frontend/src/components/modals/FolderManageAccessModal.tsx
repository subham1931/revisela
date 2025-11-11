'use client';

import React from 'react';
import GenericManageAccessModal from './GenericManageAccessModal';
import {
  useShareFolder,
  useRemoveFolderMember,
  useUpdateFolderMemberAccess,
  useUpdateFolderPublicAccess,
  useGetFolderShareLink,
} from '@/services/features/folders';

interface FolderManageAccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  members: Array<{
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'collaborator' | 'member';
  }>;
  currentUserId: string;
  publicAccess: 'restricted' | 'public';
  userAccessLevel?: 'owner' | 'collaborator' | 'member' | 'none' | 'admin';
}

export const FolderManageAccessModal: React.FC<FolderManageAccessModalProps> = ({
  isOpen,
  onOpenChange,
  folderId,
  owner,
  members,
  currentUserId,
  publicAccess,
  userAccessLevel,
}) => {
  const shareFolder = useShareFolder();
  const removeFolderMember = useRemoveFolderMember();
  const updateFolderMemberAccess = useUpdateFolderMemberAccess();
  const updateFolderPublicAccess = useUpdateFolderPublicAccess();
  const getFolderShareLink = useGetFolderShareLink();

  const handleAddMembers = async (emails: string[], accessLevel: string) => {
    await shareFolder.mutateAsync({
      folderId,
      emails,
      accessLevel: accessLevel as 'admin' | 'collaborator' | 'member',
    });
  };

  const handleRemoveMember = async (userId: string) => {
    await removeFolderMember.mutateAsync({
      folderId,
      userId,
    });
  };

  const handleUpdateMemberAccess = async (userId: string, accessLevel: string) => {
    await updateFolderMemberAccess.mutateAsync({
      folderId,
      userId,
      accessLevel: accessLevel as 'admin' | 'collaborator' | 'member',
    });
  };

  const handleUpdatePublicAccess = async (newPublicAccess: string) => {
    await updateFolderPublicAccess.mutateAsync({
      folderId,
      publicAccess: newPublicAccess as 'restricted' | 'public',
    });
  };

  const handleGetShareLink = async () => {
    const result = await getFolderShareLink.mutateAsync(folderId);
    return result.link;
  };

  const folderLink = `${window.location.origin}/folders/${folderId}`;

  return (
    <GenericManageAccessModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      owner={owner}
      members={members}
      currentUserId={currentUserId}
      resourceId={folderId}
      resourceLink={folderLink}
      publicAccess={publicAccess}
      userAccessLevel={userAccessLevel}
      resourceType="folder"
      onAddMembers={handleAddMembers}
      onRemoveMember={handleRemoveMember}
      onUpdateMemberAccess={handleUpdateMemberAccess}
      onUpdatePublicAccess={handleUpdatePublicAccess}
      onGetShareLink={handleGetShareLink}
    />
  );
};
