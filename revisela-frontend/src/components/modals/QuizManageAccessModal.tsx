'use client';

import React from 'react';
import GenericManageAccessModal from './GenericManageAccessModal';
import {
  useShareQuiz,
  useRemoveQuizMember,
  useUpdateQuizMemberAccess,
  useUpdateQuizPublicAccess,
  useGetQuizShareLink,
} from '@/services/features/quizzes';

interface QuizManageAccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
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

export const QuizManageAccessModal: React.FC<QuizManageAccessModalProps> = ({
  isOpen,
  onOpenChange,
  quizId,
  owner,
  members,
  currentUserId,
  publicAccess,
  userAccessLevel,
}) => {
  const shareQuiz = useShareQuiz();
  const removeQuizMember = useRemoveQuizMember();
  const updateQuizMemberAccess = useUpdateQuizMemberAccess();
  const updateQuizPublicAccess = useUpdateQuizPublicAccess();
  const getQuizShareLink = useGetQuizShareLink();

  const handleAddMembers = async (emails: string[], accessLevel: string) => {
    await shareQuiz.mutateAsync({
      quizId,
      emails,
      accessLevel: accessLevel as 'admin' | 'collaborator' | 'member',
    });
  };

  const handleRemoveMember = async (userId: string) => {
    await removeQuizMember.mutateAsync({
      quizId,
      userId,
    });
  };

  const handleUpdateMemberAccess = async (userId: string, accessLevel: string) => {
    await updateQuizMemberAccess.mutateAsync({
      quizId,
      userId,
      accessLevel: accessLevel as 'admin' | 'collaborator' | 'member',
    });
  };

  const handleUpdatePublicAccess = async (newPublicAccess: string) => {
    await updateQuizPublicAccess.mutateAsync({
      quizId,
      publicAccess: newPublicAccess as 'restricted' | 'public',
    });
  };

  const handleGetShareLink = async () => {
    const result = await getQuizShareLink.mutateAsync(quizId);
    return result.link;
  };

  const quizLink = `${window.location.origin}/quizzes/${quizId}`;

  return (
    <GenericManageAccessModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      owner={owner}
      members={members}
      currentUserId={currentUserId}
      resourceId={quizId}
      resourceLink={quizLink}
      publicAccess={publicAccess}
      userAccessLevel={userAccessLevel}
      resourceType="quiz"
      onAddMembers={handleAddMembers}
      onRemoveMember={handleRemoveMember}
      onUpdateMemberAccess={handleUpdateMemberAccess}
      onUpdatePublicAccess={handleUpdatePublicAccess}
      onGetShareLink={handleGetShareLink}
    />
  );
};
