'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import { useQuiz } from '@/services/features/quizzes';

import MediaSelector from '@/components/ui/quiz/MediaSelector';

import MediaDisplay from '../../../components/ui/quiz/MediaDisplay';
import { ArrowLeft } from 'lucide-react';

const QuizDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const quizId = Array.isArray(params.quizId)
    ? params.quizId[0]
    : params.quizId;

  const { data: quiz, isLoading, error } = useQuiz(quizId);

  // Log all images in the quiz
  if (quiz) {
    console.log('--- Quiz Images ---');
    quiz.questions?.forEach((q: any, idx: number) => {
      console.log(`Question ${idx + 1}:`);
      if (q.image) console.log('  Question Image:', q.image);
      if (q.answerImage)
        console.log('  Answer Image (flashcard):', q.answerImage);

      if (q.options) {
        q.options.forEach((option: any, i: number) => {
          if (option.image)
            console.log(
              `  Option ${String.fromCharCode(65 + i)} Image:`,
              option.image
            );
        });
      }
    });
  }

  const handleGoBack = () => router.back();
  const handleRevise = () => {
    if (quizId) router.push(`${quizId}/revise`);
  };

  

  if (isLoading)
    return (
      <div className="text-center py-10 text-gray-500">
        Loading quiz details...
      </div>
    );

  if (error || !quiz)
    return (
      <div className="text-center text-red-600 bg-red-50 p-6 rounded-md border border-red-200">
        <p className="font-semibold">Something went wrong.</p>
        <p className="text-sm mt-1">Could not load quiz details.</p>
      </div>
    );

  return (
    <div className="w-full pr-15">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 ">
        <button
          onClick={handleGoBack}
          className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#0890A8] text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <button
          onClick={handleRevise}
          className="bg-[#0890A8] hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium"
        >
          Revise
        </button>
      </div>

      {/* Quiz Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 ">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={quiz.title || ''}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={quiz.description || ''}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            rows={3}
          />
        </div>

        {quiz?.tags?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={quiz.tags.join(', ')}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions?.length > 0 ? (
          quiz.questions.map((q: any, idx: number) => {
            const type = q.type.toLowerCase();
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
                <p className="font-medium mb-2">{idx + 1}.</p>

                {/* Flashcard */}
                {type === 'flashcard' && (
                  <div className="my-8 flex gap-5">
                    <div className="flex flex-col flex-1 ">
                      <label className="font-semibold mb-1">Front</label>
                      <div className="flex items-center justify-center gap-2">
                        <input
                          value={q.question || ''}
                          readOnly
                          placeholder="No content"
                          className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                        {/* {q.image && <MediaDisplay imageUrl={q.image} />} */}
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <label className="font-semibold mb-1">Back</label>
                      <input
                        value={q.answer || ''}
                        readOnly
                        placeholder="No content"
                        className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                      {/* {q.answerImage && (
                        <MediaDisplay imageUrl={q.answerImage} />
                      )} */}
                    </div>
                  </div>
                )}

                {/* MCQ */}
                {type === 'mcq' && (
                  <div className="my-4">
                    <div className="mb-4">
                      <label className="block mb-2 font-semibold">
                        Question
                      </label>
                      <div className="my-2 flex gap-2">
                        <input
                          value={q.question || ''}
                          readOnly
                          placeholder="Enter text here"
                          className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                        {/* {q.image && <MediaDisplay imageUrl={q.image} />} */}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h1 className="mb-2 font-semibold">Options</h1>
                      {q.options?.map((option: any, i: number) => (
                        <div
                          key={option._id || i}
                          className="flex items-start gap-2 w-full " // same width for all options
                        >
                          {/* Option input */}
                          <div className="w-full max-w-md ">
                            <div className="flex items-center gap-2">
                              <label className="mb-1 block text-gray-500">
                                {String.fromCharCode(65 + i)}.
                              </label>
                              <input
                                value={option.label || ''}
                                readOnly
                                className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                              />
                            </div>
                          </div>

                          {/* Media on the right */}
                          {/* {option.image && (
                            <div className="w-40 flex-shrink-0">
                              <MediaDisplay imageUrl={option.image} />
                            </div>
                          )} */}
                        </div>
                      ))}
                    </div>

                    {/* Correct answer visually */}
                    <div className="my-4 flex gap-2 items-center">
                      <p className="mb-0 font-medium">Correct Option:</p>
                      <div className="flex gap-2">
                        {q.options?.map((option: any, i: number) => {
                          const isCorrect = option.value === q.answer;
                          const label = String.fromCharCode(65 + i);
                          return (
                            <div
                              key={i}
                              className={`transition rounded-full flex items-center justify-center w-6 h-6 ${
                                isCorrect
                                  ? 'border-2 border-green-500'
                                  : 'border border-gray-300 text-gray-500'
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
                  <div className="my-2 flex flex-col gap-2">
                    <label className="font-medium">Question</label>
                    <div className="my-2 flex gap-2">
                      <input
                        type="text"
                        value={
                          q.question
                            ? q.question.replace(/_+/g, `??${q.answer}??`) +
                              ' ?'
                            : ''
                        }
                        readOnly
                        placeholder="No question"
                        className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                      {/* {q.image && <MediaDisplay imageUrl={q.image} />} */}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Note: To create the blank, wrap the word with 2 question
                      marks without leaving any spaces. Eg: ??WORD?? You can
                      only create one fill-in per question
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

      <div className="w-full flex justify-around items-center my-10">
        <button
          onClick={handleRevise}
          className="bg-[#0890A8] hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium"
        >
          Revise
        </button>
      </div>
    </div>
  );
};

export default QuizDetailPage;
