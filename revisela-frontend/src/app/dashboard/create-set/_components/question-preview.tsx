'use client';

import { useState } from 'react';

type QuestionType = 'Flashcard' | 'Multiple Choice Question (MCQ)' | 'Fill-In';

interface QuestionPreviewProps {
  type: QuestionType;
  onAdd: (content: any) => void; // Accepts content object
}

export default function QuestionPreview({ type, onAdd }: QuestionPreviewProps) {
  // State for each type
  const [flashcard, setFlashcard] = useState({ front: '', back: '' });
  const [mcq, setMcq] = useState({
    question: '',
    options: ['', ''],
    correct: null as number | null,
  });
  const [fillIn, setFillIn] = useState({ question: '', answer: '' });

  // Render UI based on type
  let content;
  if (type === 'Flashcard') {
    content = (
      <div className="space-y-2">
        <input
          className="input"
          placeholder="Front"
          value={flashcard.front}
          onChange={(e) =>
            setFlashcard({ ...flashcard, front: e.target.value })
          }
        />
        <input
          className="input"
          placeholder="Back"
          value={flashcard.back}
          onChange={(e) => setFlashcard({ ...flashcard, back: e.target.value })}
        />
      </div>
    );
  } else if (type === 'Multiple Choice Question (MCQ)') {
    content = (
      <div className="space-y-2">
        <input
          className="input w-full outline-none border-0 border-b border-b-gray-500 focus:border-b-teal-500"
          placeholder="Question"
          value={mcq.question}
          onChange={(e) => setMcq({ ...mcq, question: e.target.value })}
        />
        {mcq.options.slice(0, mcq.options.length).map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              className="input w-1/3 outline-none border-0 border-b border-b-gray-500 focus:border-b-teal-500"
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              value={opt}
              onChange={(e) => {
                const options = [...mcq.options];
                options[idx] = e.target.value;
                setMcq({ ...mcq, options });
              }}
            />
            <button
              type="button"
              className="text-gray-400 hover:text-red-500 text-lg px-1"
              onClick={() => {
                const options = mcq.options.filter((_, i) => i !== idx);
                setMcq({ ...mcq, options });
              }}
              aria-label="Remove option"
              disabled={mcq.options.length <= 2}
              title={
                mcq.options.length <= 2
                  ? 'At least 2 options required'
                  : 'Remove option'
              }
            >
              &#10005;
            </button>
          </div>
        ))}
        {mcq.options.length < 6 && (
          <button
            type="button"
            className="mt-2 text-teal-600 hover:underline text-sm"
            onClick={() => setMcq({ ...mcq, options: [...mcq.options, ''] })}
          >
            Add More Option
          </button>
        )}

        {mcq.options.length > 0 && (
          <div className="mt-4 flex items-center gap-2 ">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Select correct option:
            </p>
            <div className="flex gap-2">
              {mcq.options.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-8 h-8 rounded-full border border-teal-500 font-semibold transition
      ${
        mcq.correct === idx
          ? 'bg-teal-500 text-white'
          : 'bg-white text-teal-500 hover:bg-teal-100'
      }
    `}
                  onClick={() => setMcq({ ...mcq, correct: idx })}
                >
                  {String.fromCharCode(65 + idx)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } else if (type === 'Fill-In') {
    content = (
      <div className="space-y-2">
        <input
          className="input"
          placeholder="Question"
          value={fillIn.question}
          onChange={(e) => setFillIn({ ...fillIn, question: e.target.value })}
        />
        <input
          className="input"
          placeholder="Answer"
          value={fillIn.answer}
          onChange={(e) => setFillIn({ ...fillIn, answer: e.target.value })}
        />
      </div>
    );
  }

  // Handle add
  const handleAdd = () => {
    if (type === 'Flashcard') onAdd(flashcard);
    else if (type === 'Multiple Choice Question (MCQ)') onAdd(mcq);
    else if (type === 'Fill-In') onAdd(fillIn);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
      <h2 className="text-lg font-medium mb-4">New Question: {type}</h2>
      {content}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleAdd}
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium"
        >
          Add Question
        </button>
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}
