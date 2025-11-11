import React, { useState } from 'react';
import MediaDisplay from '@/components/ui/quiz/MediaDisplay';

interface FlashcardProps {
  question: string;
  answer: string;
  image?: string;
  onAnswerChange?: (val: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer, image, onAnswerChange }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="p-4 border rounded-lg bg-white flex flex-col gap-4">
      {/* Front / Back */}
      {!showAnswer ? (
        <div>
          <p className="font-semibold mb-2">Question:</p>
          <p>{question}</p>
          {image && <MediaDisplay imageUrl={image} />}
        </div>
      ) : (
        <div>
          <p className="font-semibold mb-2">Answer:</p>
          <input
            type="text"
            placeholder="Type your answer"
            value={answer}
            onChange={(e) => onAnswerChange?.(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
          {image && <MediaDisplay imageUrl={image} />}
        </div>
      )}

      {/* Flip Button */}
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="mt-2 px-4 py-1 bg-[#0890A8] text-white rounded hover:bg-teal-600 w-max"
      >
        {showAnswer ? 'Show Question' : 'Show Answer'}
      </button>
    </div>
  );
};

export default Flashcard;
