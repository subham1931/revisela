'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { ArrowLeft, Check, X } from 'lucide-react';

import { useQuiz } from '@/services/features/quizzes';

import ScoreModal from '@/components/modals/score-modal';
import { Button } from '@/components/ui';
import MediaDisplay from '@/components/ui/quiz/MediaDisplay';

const ReviseQuizPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const quizId = Array.isArray(params.quizId)
    ? params.quizId[0]
    : params.quizId;

  const { data: quiz, isLoading, error } = useQuiz(quizId);

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);

  const [scoreData, setScoreData] = useState<{
    total: number;
    correct: number;
    percentage: number;
  }>({
    total: 0,
    correct: 0,
    percentage: 0,
  });

  const handleInputChange = (qId: string, value: any) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [qId]: value }));
    }
  };

  const calculateScore = () => {
    let total = 0;
    let correctCount = 0;

    quiz?.questions?.forEach((q: any) => {
      total++;
      const userAnswer = answers[q._id];
      const correctAnswer = q.correctAnswer ?? q.answer;

      if (
        (q.type.toLowerCase() === 'flashcard' && userAnswer === 'correct') ||
        (q.type.toLowerCase() !== 'flashcard' && userAnswer === correctAnswer)
      ) {
        correctCount++;
      }
    });

    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return { total, correct: correctCount, percentage };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    setScoreData(score);
    setScoreModalOpen(true);
    setShowAnswers(true);
  };

  const handleViewAnswers = () => {
    setShowAnswers(true);
    setScoreModalOpen(false);
  };

  if (isLoading) return <p className="text-center py-10">Loading quiz...</p>;
  if (error || !quiz)
    return (
      <p className="text-center py-10 text-red-600">Failed to load quiz.</p>
    );

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#0890A8] text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        {showAnswers ? (
          <button
            className="bg-[#0890A8] flex items-center px-4 py-2 text-white rounded-md border border-gray-300 hover:border-[#0890A8] text-sm font-medium"
            onClick={() => {
              setAnswers({});
              setFlipped({});
              setSubmitted(false);
              setShowAnswers(false);
            }}
          >
            Retake
          </button>
        ) : (
          <button
            className="bg-[#0890A8] flex items-center px-4 py-2 text-white rounded-md border border-gray-300 hover:border-[#0890A8] text-sm font-medium"
            onClick={handleSubmit}
            disabled={submitted}
          >
            Submit
          </button>
        )}
      </div>

      <h1 className="text-2xl font-semibold">{quiz.title}</h1>

      {/* Questions */}
      {quiz.questions?.map((q: any, idx: number) => {
        const type = q.type.toLowerCase();
        const userAnswer = answers[q._id];
        const correctAnswer = q.correctAnswer ?? q.answer;
        const isCorrect =
          (type === 'flashcard' && userAnswer === 'correct') ||
          (type !== 'flashcard' && userAnswer === correctAnswer);

        return (
          <div
            key={q._id || idx}
            className="relative p-6 rounded-lg bg-white flex flex-col gap-4 shadow-sm border border-gray-200"
          >
            {/* Answer Indicator */}
            {showAnswers && (
              <div className="absolute top-2 right-2">
                <div
                  className={`rounded-full border-2 p-1 ${isCorrect ? 'border-green-500' : 'border-red-500'
                    }`}
                >
                  {isCorrect ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <X size={16} className="text-red-500" />
                  )}
                </div>
              </div>
            )}

            <p className="font-medium">{idx + 1}.</p>
            {/* {q.image && <MediaDisplay imageUrl={q.image} />} */}

            {/* MCQ */}
            {type === 'mcq' && (
              <div className="flex flex-col gap-5 text-[#444444]">
                <div className="flex items-center gap-5 ">
                  <div dangerouslySetInnerHTML={{ __html: q.question || '' }} />
                  <p>{q.image && <MediaDisplay imageUrl={q.image} />}</p>
                </div>
                <div className="flex flex-col gap-3">
                  {q.options?.map((option: any, i: number) => {
                    const label = String.fromCharCode(65 + i);
                    const userSelected = option.value === userAnswer;
                    const isOptionCorrect = option.value === correctAnswer;

                    return (
                      <div key={i} className="flex items-center gap-3">
                        {/* Option Label */}
                        <span className="text-lg font-semibold text-[#444444] min-w-[24px]">
                          {label}.
                        </span>

                        {/* Option Box */}
                        <div
                          onClick={() => handleInputChange(q._id, option.value)}
                          className={`w-full max-w-xl px-4 py-3 rounded-xl border-2 transition-all cursor-pointer select-none
                            ${showAnswers
                              ? isOptionCorrect
                                ? 'border-green-500 bg-green-50'
                                : userSelected
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-[#ACACAC]'
                              : userSelected
                                ? 'border-[#0890A8] bg-white'
                                : 'border-[#ACACAC] hover:border-[#0890A8] hover:bg-gray-50'
                            }
                            ${submitted ? 'opacity-70 cursor-not-allowed' : ''}
                          `}
                        >
                          <span className="block text-base text-gray-800 break-words">
                            {option.label}
                          </span>
                        </div>

                        {/* Optional Image Outside */}
                        {option.image && (
                          <div className="flex-shrink-0 ml-3 w-24">
                            <MediaDisplay imageUrl={option.image} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fill-in */}
            {type === 'fillin' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-5 ">
                  <div dangerouslySetInnerHTML={{ __html: q.question || '' }} />
                  <p>{q.image && <MediaDisplay imageUrl={q.image} />}</p>
                </div>
                <input
                  type="text"
                  placeholder="Type your answer here"
                  value={userAnswer || ''}
                  onChange={(e) => handleInputChange(q._id, e.target.value)}
                  className={`flex-1 rounded-xl p-2 border-2 $`}
                  disabled={submitted}
                />
                {q.image && <MediaDisplay imageUrl={q.image} />}
                {showAnswers && (
                  <p>Answer : {q.answer}</p>
                )}
              </div>
            )}

            {/* Flashcard */}
            {type === 'flashcard' && (
              <div className="flex flex-col gap-2">
                {/* Front */}
                {!flipped[q._id] && !submitted && (
                  <div className="flex flex-col justify-center items-center gap-10 p-5 rounded-lg bg-white">
                    <div className="flex items-center gap-5 ">
                      <div className="text-lg font-semibold" dangerouslySetInnerHTML={{ __html: q.question || '' }} />
                      {q.image && <MediaDisplay imageUrl={q.image} />}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFlipped((prev) => ({ ...prev, [q._id]: true }))
                      }
                      className="hover:text-[#0890A8] p-3 rounded-xl"
                    >
                      Show Answer
                    </Button>
                  </div>
                )}

                {/* Back */}
                {(flipped[q._id] || submitted) && (
                  <div className="flex flex-col justify-center items-center gap-3 p-6 rounded-lg bg-white">
                    <div className="flex justify-center items-center gap-2">
                      <div className="text-base text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: q.answer || '' }} />
                      {q.image && <MediaDisplay imageUrl={q.image} />}
                    </div>

                    <div className="flex gap-4 mt-3">
                      {['correct', 'wrong'].map((val) => {
                        const isSelected = answers[q._id] === val;
                        const borderColor = isSelected
                          ? 'border-[#0890A8]'
                          : 'border-[#ACACAC]';

                        return (
                          <button
                            key={val}
                            className={`p-3 rounded-xl flex items-center gap-2 border-2 ${borderColor}`}
                            disabled={submitted}
                            onClick={() => handleInputChange(q._id, val)}
                          >
                            <div className="rounded-full border">
                              {val === 'correct' ? (
                                <Check size={16} className="" />
                              ) : (
                                <X size={16} className="text-red-500" />
                              )}
                            </div>
                            {val.charAt(0).toUpperCase() + val.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom Submit Button */}
      {!showAnswers && (
        <div className="flex justify-center my-10">
          <button
            className="bg-[#0890A8] flex items-center px-4 py-2 text-white rounded-md border border-gray-300 hover:border-[#0890A8] text-sm font-medium"
            onClick={handleSubmit}
            disabled={submitted}
          >
            Submit
          </button>
        </div>
      )}

      {/* Score Modal */}
      <ScoreModal
        isOpen={scoreModalOpen}
        onOpenChange={setScoreModalOpen}
        total={scoreData.total}
        correct={scoreData.correct}
        wrong={scoreData.total - scoreData.correct}
        percentage={scoreData.percentage}
        onViewAnswers={handleViewAnswers} // FIXED
      />
    </div>
  );
};

export default ReviseQuizPage;
