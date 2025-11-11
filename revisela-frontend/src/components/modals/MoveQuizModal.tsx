'use client';

import React, { useState } from 'react';
import { FolderSymlink } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useMoveQuiz } from '@/services/features/quizzes';

interface MoveQuizModalProps {
  quizId: string;
  quizTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MoveQuizModal: React.FC<MoveQuizModalProps> = ({
  quizId,
  quizTitle,
  isOpen,
  onOpenChange,
}) => {
  const [targetFolderId, setTargetFolderId] = useState('');
  const moveQuiz = useMoveQuiz();

  const handleMove = async () => {
    if (!targetFolderId.trim()) return;
    await moveQuiz.mutateAsync({ quizId, targetFolderId });
    onOpenChange(false);
  };

  return (
    <Modal
      title="Move Quiz"
      icon={<FolderSymlink size={20} className="text-gray-500" />}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-4">
        <label className="text-sm text-gray-600">
          Enter the Folder ID or destination to move “{quizTitle}”
        </label>
        <input
          type="text"
          placeholder="Target folder ID"
          value={targetFolderId}
          onChange={(e) => setTargetFolderId(e.target.value)}
          className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#0890A8]"
        />
        <Button
          onClick={handleMove}
          disabled={moveQuiz.isPending}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {moveQuiz.isPending ? 'Moving...' : 'Move'}
        </Button>
      </div>
    </Modal>
  );
};