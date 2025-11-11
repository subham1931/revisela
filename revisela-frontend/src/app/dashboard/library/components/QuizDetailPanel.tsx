'use client';

import React from 'react';

import { ArrowLeft } from 'lucide-react';

import { useQuiz } from '@/services/features/quizzes';

import { Skeleton } from '@/components/ui/quiz/skeleton';

/* Skeleton loader */
function QuizDetailSkeleton() {
  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm space-y-4">
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-10 w-full" />
      </div>
    </>
  );
}

/* Quiz content */
function QuizDetailContent({ quizId }: { quizId: string }) {
  const { data: quiz, isLoading, error } = useQuiz(quizId);
  console.log(quiz?.questions);

  const maskBlanks = (text: string | undefined | null) => {
    if (!text) return '';
    const parts = text.split(/(\?\?.*?\?\?)/g);
    return parts.map((part, i) => {
      if (part.startsWith('??') && part.endsWith('??')) {
        return (
          <span
            key={i}
            className="inline-block border-b-2 border-gray-500 mx-1 w-24 align-middle"
          >
            &nbsp;
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (isLoading) return <QuizDetailSkeleton />;
  if (error || !quiz)
    return (
      <div className="text-center text-red-600 bg-red-50 p-6 rounded-md border border-red-200">
        <p className="font-semibold">Something went wrong.</p>
        <p className="text-sm mt-1">Could not load quiz details.</p>
      </div>
    );

  return (
    <div className="space-y-8 mr-10">
      {/* Quiz Metadata */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Title
          </label>
          <input
            type="text"
            value={quiz.title}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 cursor-not-allowed text-lg font-semibold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Description
          </label>
          <input
            type="text"
            value={quiz.description}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
          />
        </div>
        {quiz?.tags?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={quiz.tags?.join(', ') || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions?.length > 0 ? (
          quiz.questions.map((q: any, idx: number) => {
            const type = q.type.toLowerCase(); // normalize type
            const typeLabel =
              type === 'mcq'
                ? 'MCQ'
                : type === 'fillin'
                  ? 'Fill-In'
                  : type === 'flashcard'
                    ? 'Flashcard'
                    : '';

            return (
              <div
                key={q._id || q.id}
                className="px-4 py-10 border border-gray-200 rounded-lg bg-white relative"
              >
                {/* Question number */}
                <p className="font-semibold mb-2">{idx + 1}.</p>

                {/* Flashcard */}
                {type === 'flashcard' && (
                  <div className="my-4 flex gap-5">
                    <div className="flex flex-col flex-1">
                      <label className="font-semibold mb-1">Front</label>
                      <input
                        value={q.question || ''}
                        readOnly
                        placeholder="No content"
                        className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col flex-1">
                      <label className="font-semibold mb-1">Back</label>
                      <input
                        value={q.answer || ''}
                        readOnly
                        placeholder="No content"
                        className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

                {/* MCQ */}
                {type === 'mcq' && (
                  <div className="my-4">
                    <div className="mb-4">
                      <label className="block mb-2">Question</label>
                      <input
                        value={q.question || ''}
                        readOnly
                        placeholder="Enter text here"
                        className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    {/* Options in flex style */}
                    <div className="flex flex-col gap-4">
                      <h1 className="mb-2">Options</h1>
                      {Array(4)
                        .fill(0)
                        .map((_, i) => {
                          const option = q.options?.[i];
                          if (!option) return null;
                          return (
                            <div
                              key={i}
                              className="flex w-1/2 items-center gap-2"
                            >
                              <label className="mb-1 block text-gray-500">
                                {String.fromCharCode(65 + i)}.
                              </label>
                              <input
                                value={option.label || ''}
                                readOnly
                                placeholder="No content"
                                className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                              />
                            </div>
                          );
                        })}
                    </div>

                    {/* Correct answer */}
                    <div className="my-4 flex gap-2 items-center">
                      <p className="mb-0">Correct option:</p>
                      <div className="flex gap-2">
                        {['A', 'B', 'C', 'D'].map((label, i) => {
                          const isCorrect =
                            q.answer === String.fromCharCode(97 + i);
                          return (
                            <div
                              key={i}
                              className={`transition rounded-full flex items-center justify-center w-6 h-6 ${
                                isCorrect
                                  ? 'border border-[#0890A8]'
                                  : 'border border-gray-300'
                              }`}
                              style={{ aspectRatio: '1 / 1' }}
                            >
                              {label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fill-In */}
                {type === 'fillin' && (
                  <div className="my-2">
                    <p className="font-semibold mb-2">{q.question}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Answer:</span> {q.answer}
                    </p>
                  </div>
                )}

                {/* Type badge */}
                <p
                  className={`absolute bottom-0 right-0 text-black text-sm px-3 py-2 rounded-t-xl rounded-br-lg rounded-r-none ${
                    type === 'mcq'
                      ? 'bg-[#ADF5C6]'
                      : type === 'fillin'
                        ? 'bg-[#FFCDFD]'
                        : type === 'flashcard'
                          ? 'bg-[#FFCE94]'
                          : 'bg-gray-500'
                  }`}
                >
                  {typeLabel}
                </p>
                
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg text-gray-500">
            <p>No questions have been added to this quiz yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* Full-width Quiz Detail Component */
export function QuizDetailView({
  quizId,
  onClose,
}: {
  quizId: string | null;
  onClose: () => void;
}) {
  if (!quizId) return null;

  return (
    <div className="w-full ">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 mr-10">
        {/* <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button> */}
        <button
          onClick={onClose}
          className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#0890A8] text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>
        <div className="flex gap-2 items-center">
          <button className="bg-[#0890A8] hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium">
            Revise
          </button>
        </div>
      </div>

      {/* Quiz content */}
      <QuizDetailContent quizId={quizId} />

      <div className="flex gap-2 items-center my-10 justify-center">
          <button className="bg-[#0890A8] hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium">
            Revise
          </button>
        </div>
    </div>
  );
}
