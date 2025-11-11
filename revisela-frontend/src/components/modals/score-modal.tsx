import React from 'react';
import { Users } from 'lucide-react';
import { Modal, Button } from '@/components/ui';

interface ScoreModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  correct: number;
  wrong: number;
  percentage: number;
  onViewAnswers: () => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({
  isOpen,
  onOpenChange,
  total,
  correct,
  wrong,
  percentage,
  onViewAnswers,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`🥁 Your final percentage is ${percentage}% 🥁`}
      headingIcon={<Users size={50} color="#058F3A" />}
      subtitle="Why study solo when you can have a squad?"
      contentClassName="max-w-md text-center"
    >
      <div className="space-y-2">
        <p>Total Questions: {total}</p>
        <p>Correct Answers: {correct}</p>
        <p>Wrong Answers: {wrong}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={onViewAnswers}
        >
          View Answers
        </Button>
        <p className="mt-2 text-sm text-gray-500">Go...Little...Rockstar🎸</p>
      </div>
    </Modal>
  );
};

export default ScoreModal;
