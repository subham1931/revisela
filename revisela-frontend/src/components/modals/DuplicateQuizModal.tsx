'use client';

import React, { useState } from 'react';

import { useDuplicateQuiz } from '@/services/features/quizzes';

import { Button, Input, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/toast/index';

interface DuplicateQuizModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  quizTitle?: string;
  onSuccess?: () => void;
}

export const DuplicateQuizModal: React.FC<DuplicateQuizModalProps> = ({
  isOpen,
  onOpenChange,
  quizId,
  quizTitle = '',
  onSuccess,
}) => {
  const [title, setTitle] = useState(`Copy of ${quizTitle}`.trim());
  const { toast } = useToast();
  const duplicateQuiz = useDuplicateQuiz();

  const handleDuplicate = () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please give a name for the duplicated quiz',
        type: 'error',
      });
      return;
    }

    duplicateQuiz.mutate(
      { quizId, newTitle: title },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Quiz duplicated successfully',
            type: 'success',
          });
          handleClose();
          onSuccess?.();
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error?.message || 'Failed to duplicate quiz',
            type: 'error',
          });
        },
      }
    );
  };

  const handleClose = () => {
    setTitle(`Copy of ${quizTitle}`.trim());
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Duplicate Quiz"
      description="Create a copy of this quiz and its questions."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleDuplicate}
            loading={duplicateQuiz.isPending}
            loadingText="Duplicating..."
            className="bg-[#0890A8] text-white hover:bg-[#06788C] disabled:bg-[#0890A8]/60"
          >
            Duplicate
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quiz Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quiz title"
          />
        </div>
      </div>
    </Modal>
  );
};
