'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ArrowLeft, Import, Settings, X } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  content: any;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  tags: string[];
  questions: Question[];
}

export default function QuizDetailPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showAnswers, setShowAnswers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number | null;
  }>({});
  const [fillInAnswers, setFillInAnswers] = useState<{ [key: string]: string }>(
    {}
  );
  const [showImportModal, setShowImportModal] = useState(false);

  // Load quiz from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('quizSets') || '[]');
    const foundQuiz = stored.find((q: any) => q.id === quizId);
    if (foundQuiz) setQuiz(foundQuiz);
  }, [quizId]);

  function maskBlanks(text: string) {
    const parts = text.split(/(\?\?.*?\?\?)/g);
    return parts.map((part, i) => {
      if (part.startsWith('??') && part.endsWith('??')) {
        return (
          <span
            key={i}
            className="inline-block border-b-2 border-gray-600 mx-1 w-24 align-middle"
          >
            &nbsp;
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  const handleToggleAnswer = (id: string) =>
    setShowAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleSelectOption = (qid: string, idx: number) =>
    setSelectedOptions((prev) => ({ ...prev, [qid]: idx }));

  if (!quiz) return <p className="p-6 text-gray-500">Quiz not found.</p>;

  return (
    <div className="max-w-full ml-6 mb-8 relative">
      {/* Top Toolbar */}
       <div className="flex justify-between items-center mb-6">
        <Link
          href="/dashboard/library"
          className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#0890A8] text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </Link>
        <div className="flex gap-2 items-center">
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium"
          >
            Revise
          </button>
        </div>
      </div>

      {/* Quiz Metadata */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={quiz.title}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={quiz.description}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            value={Array.isArray(quiz.tags) ? quiz.tags.join(', ') : quiz.tags}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Quiz Content */}
      <div className="space-y-6 ">
        {quiz.questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          quiz.questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-6 border border-gray-200 rounded-lg bg-white shadow hover:shadow-md"
            >
              <p className="text-lg font-medium text-gray-800 mb-4">
                {idx + 1}. {maskBlanks(q.content.question || q.content.front)}
              </p>

              {q.type === 'Multiple Choice Question (MCQ)' &&
                q.content.options && (
                  <div className="space-y-3 bg-amber-200">
                    {q.content.options.map((opt: string, i: number) => (
                      <div
                        key={i}
                        onClick={() => handleSelectOption(q.id, i)}
                        className={`flex items-center gap-3 cursor-pointer border rounded-lg p-2 transition ${
                          selectedOptions[q.id] === i
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-semibold w-5">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

              {q.type === 'Flashcard' && (
                <div>
                  <button
                    onClick={() => handleToggleAnswer(q.id)}
                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                  >
                    {showAnswers[q.id] ? 'Hide Answer' : 'View Answer'}
                  </button>
                  {showAnswers[q.id] && (
                    <p className="mt-3 text-gray-700">
                      Answer: {q.content.back}
                    </p>
                  )}
                </div>
              )}

              {q.type === 'Fill-In' && (
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={fillInAnswers[q.id] || ''}
                  onChange={(e) =>
                    setFillInAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded border-gray-300 focus:ring focus:ring-blue-200"
                />
              )}
            </div>
          ))
        )}

        <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
          Submit
        </button>
      </div>
    </div>
  );
}
