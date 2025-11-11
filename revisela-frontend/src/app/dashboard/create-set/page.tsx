'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { Plus } from 'lucide-react';

import CreateQuestionCard from './_components/CreateQuestionCard';
import CreateSetForm from './_components/create-quizset-form';
import QuestionTypeSelector from './_components/question-type-selector';

// Adjust this path if needed
import { useCreateQuiz } from '@/services/features/quizzes';

export type QuestionType = 'Flashcard' | 'Multiple Choice Question (MCQ)' | 'Fill-In';

export interface Question {
  id: string;
  type: QuestionType;
  content: any;
}

export interface QuizSetData {
  title: string;
  description: string;
  tags: string[] | any;
  questions: Question[];
}

type ApiQuestion =
  | {
      type: 'flashCard';
      question: string;
      answer: string;
      image?: string;
    }
  | {
      type: 'mcq';
      question: string;
      answer: string; // must equal one of options[].value
      options: { label: string; value: string }[];
    }
  | {
      type: 'fillIn';
      question: string; // contains ___
      answer: string;
    };

interface CreateQuizPayload {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  questions: ApiQuestion[];
}

// ---------- Validation + Debug constants ----------
const REQUIRED_MCQ_OPTIONS = 4; // set to 4 if your backend allows 4

// For console table
type ValidationError = {
  path: string;   // e.g., "title", "questions[0].options"
  code: string;   // e.g., "mcq.options.count"
  message: string;
};

export default function CreateSetPage() {
  const methods = useForm<QuizSetData>({
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      questions: [],
    },
  });

  const { control, handleSubmit } = methods;
  const { fields, append, insert, move, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const { mutate: createQuiz, isPending } = useCreateQuiz();

  const onSubmit = (data: QuizSetData) => {
    // 1) Client-side validation with detailed console logging
    const clientErrors = validateQuizForClient(data);
    if (clientErrors.length) {
      logClientValidationErrors(clientErrors);
      alert(clientErrors[0].message); // show the first error to the user
      return;
    }

    // 2) Build API payload
    const payload: CreateQuizPayload = toApiPayload(data);

    // 3) Debug: see exactly what's sent
    // eslint-disable-next-line no-console
    console.log('Create quiz payload =>', JSON.stringify(payload, null, 2));

    // 4) Call API
    createQuiz(payload, {
      onSuccess: () => setShowSuccessModal(true),
      onError: (err: unknown) => {
        logServerValidationError(err); // detailed console output
        alert('Validation failed. See console (Network + Console tabs) for details.');
      },
    });
  };

  const handleAddNewQuestion = (index: number) => {
    setInsertAtIndex(index);
    setShowTypeSelector(true);
  };

  const handleSelectQuestionType = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `${Date.now()}`,
      type,
      content: getDefaultContentForType(type),
    };

    const destIndex = insertAtIndex !== null ? insertAtIndex : fields.length;

    if (insertAtIndex !== null) insert(insertAtIndex, newQuestion);
    else append(newQuestion);

    setActiveQuestionIndex(destIndex);
    setInsertAtIndex(null);
    setShowTypeSelector(false);
  };

  const handleMoveQuestion = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
    setActiveQuestionIndex((prev) => {
      if (prev === null) return null;
      if (prev === oldIndex) return newIndex;
      if (oldIndex < prev && newIndex >= prev) return prev - 1;
      if (oldIndex > prev && newIndex <= prev) return prev + 1;
      return prev;
    });
  };

  return (
    <FormProvider {...methods}>
      <main className="container px-4 py-6 max-w-full  ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mr-10">
          <CreateSetForm />

          <CreateQuestionCard
            control={control}
            questionFields={fields}
            activeQuestionIndex={activeQuestionIndex}
            onAddNewQuestion={handleAddNewQuestion}
            onMoveQuestion={handleMoveQuestion}
            removeQuestion={(index: number) => remove(index)}
          />

          {showTypeSelector && (
            <QuestionTypeSelector
              onSelect={handleSelectQuestionType}
              title={
                insertAtIndex !== null
                  ? `Add question at position ${insertAtIndex + 1}`
                  : 'Add question'
              }
            />
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => handleAddNewQuestion(fields.length)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className={`px-5 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 ${
                isPending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isPending ? 'Creating...' : 'Create Set'}
            </button>
          </div>
        </form>

        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
              <h2 className="text-xl font-bold mb-5">🎉 Congratulations!</h2>
              <p className="mb-6">Your quiz set has been created successfully.</p>
              <div className="flex justify-between gap-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => router.push('/dashboard')}
                >
                  Go Back
                </button>
                <button
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Revise
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </FormProvider>
  );
}

function getDefaultContentForType(type: QuestionType) {
  switch (type) {
    case 'Flashcard':
      return { front: '', back: '', image: '' };
    case 'Multiple Choice Question (MCQ)':
      return { question: '', options: ['', '', '', '', ''], correct: null }; // 5 options
    case 'Fill-In':
      return { question: '', answer: '' };
    default:
      return {};
  }
}

// ---------- Client-side validation + console helpers ----------
function validateQuizForClient(form: QuizSetData): ValidationError[] {
  const errors: ValidationError[] = [];

  const title = (form.title || '').trim();
  const description = (form.description || '').trim();

  // Adjust min lengths to match your backend if needed
  if (!title) errors.push({ path: 'title', code: 'title.required', message: 'Title is required' });
  if (title.length < 3) errors.push({ path: 'title', code: 'title.minLength', message: 'Title must be at least 3 characters' });

  if (!description) errors.push({ path: 'description', code: 'description.required', message: 'Description is required' });
  if (description.length < 10) errors.push({ path: 'description', code: 'description.minLength', message: 'Description must be at least 10 characters' });

  const tags = normalizeTags((form as any).tags);
  if (tags.length < 1) errors.push({ path: 'tags', code: 'tags.minItems', message: 'At least 1 tag is required' });

  const questions = Array.isArray(form.questions) ? form.questions : [];
  if (questions.length < 1) {
    errors.push({ path: 'questions', code: 'questions.minItems', message: 'Add at least 1 question' });
    return errors;
  }

  questions.forEach((q, i) => {
    const qPath = `questions[${i}]`;
    if (!q?.type) {
      errors.push({ path: `${qPath}.type`, code: 'question.type.required', message: `Question ${i + 1}: type is required` });
      return;
    }

    if (q.type === 'Flashcard') {
      const front = (q.content?.front || '').trim();
      const back = (q.content?.back || '').trim();
      if (!front) errors.push({ path: `${qPath}.front`, code: 'flashCard.front.required', message: `Flashcard ${i + 1}: Front is required` });
      if (!back) errors.push({ path: `${qPath}.back`, code: 'flashCard.back.required', message: `Flashcard ${i + 1}: Back is required` });
      // If your backend requires image, uncomment:
      // const image = (q.content?.image || '').trim();
      // if (!image) errors.push({ path: `${qPath}.image`, code: 'flashCard.image.required', message: `Flashcard ${i + 1}: Image URL is required` });
    }

    if (q.type === 'Multiple Choice Question (MCQ)') {
      const question = (q.content?.question || '').trim();
      const opts: string[] = q.content?.options || [];
      const trimmed = opts.map((s) => (s || '').trim());
      const nonEmpty = trimmed.filter(Boolean);
      const correctIndex = q.content?.correct;

      if (!question) errors.push({ path: `${qPath}.question`, code: 'mcq.question.required', message: `MCQ ${i + 1}: Question is required` });
      if (nonEmpty.length < REQUIRED_MCQ_OPTIONS) {
        errors.push({
          path: `${qPath}.options`,
          code: 'mcq.options.count',
          message: `MCQ ${i + 1}: Must have ${REQUIRED_MCQ_OPTIONS} non-empty options`,
        });
      }
      // uniqueness by normalized value
      const normalizedValues = nonEmpty.map(slugifyOptionValue);
      if (new Set(normalizedValues).size !== normalizedValues.length) {
        errors.push({
          path: `${qPath}.options`,
          code: 'mcq.options.unique',
          message: `MCQ ${i + 1}: Options must be unique`,
        });
      }
      if (correctIndex === null || correctIndex === undefined) {
        errors.push({ path: `${qPath}.answer`, code: 'mcq.answer.required', message: `MCQ ${i + 1}: Correct option is required` });
      } else {
        const correctLabelOriginal = (trimmed[correctIndex] || '').trim();
        if (!correctLabelOriginal) {
          errors.push({ path: `${qPath}.answer`, code: 'mcq.answer.blank', message: `MCQ ${i + 1}: Correct option cannot be blank` });
        } else {
          const answerValue = slugifyOptionValue(correctLabelOriginal);
          if (!normalizedValues.includes(answerValue)) {
            errors.push({ path: `${qPath}.answer`, code: 'mcq.answer.mismatch', message: `MCQ ${i + 1}: Answer must match one of the option values` });
          }
        }
      }
    }

    if (q.type === 'Fill-In') {
      const question = (q.content?.question || '').trim();
      if (!question) {
        errors.push({ path: `${qPath}.question`, code: 'fillIn.question.required', message: `Fill-In ${i + 1}: Question is required` });
      } else {
        const matches = question.match(/\?\?(.+?)\?\?/g) || [];
        if (matches.length !== 1) {
          errors.push({
            path: `${qPath}.question`,
            code: matches.length === 0 ? 'fillIn.placeholder.missing' : 'fillIn.placeholder.multiple',
            message: `Fill-In ${i + 1}: Must contain exactly one blank using ??WORD??`,
          });
        } else {
          const ans = extractFillInAnswer(question);
          if (!ans) {
            errors.push({ path: `${qPath}.answer`, code: 'fillIn.answer.empty', message: `Fill-In ${i + 1}: The blank (between ??  ??) cannot be empty` });
          }
        }
      }
    }
  });

  return errors;
}

function logClientValidationErrors(errors: ValidationError[]) {
  if (!errors.length) return;
  console.group('%cClient-side validation errors', 'color:#d97706;font-weight:bold;');
  console.table(errors);
  console.groupEnd();
}

function logServerValidationError(err: unknown) {
  const anyErr: any = err || {};
  const status = anyErr.status || anyErr?.response?.status;
  const data = anyErr.data || anyErr?.response?.data || anyErr;

  console.group('%cServer validation error', 'color:#ef4444;font-weight:bold;');
  if (status) console.log('Status:', status);
  console.log('Raw error data:', data);

  // Common shapes:
  // Zod: { issues: [{ path, message, code }...] }
  if (data?.issues && Array.isArray(data.issues)) {
    console.table(
      data.issues.map((i: any) => ({
        path: Array.isArray(i.path) ? i.path.join('.') : String(i.path ?? ''),
        code: i.code || '',
        message: i.message || '',
      }))
    );
  }
  // class-validator (NestJS): { message: string[] } or string
  else if (Array.isArray(data?.message)) {
    console.table(data.message.map((m: string, idx: number) => ({ index: idx, message: m })));
  } else if (typeof data?.message === 'string') {
    console.warn('message:', data.message);
  }
  console.groupEnd();
}

// ---------- Mapping + utilities ----------
function toApiPayload(form: QuizSetData): CreateQuizPayload {
  return {
    title: (form.title || '').trim(),
    description: (form.description || '').trim(),
    tags: dedupe(normalizeTags((form as any).tags)),
    isPublic: true,
    questions: (form.questions || []).map(mapQuestionToApi),
  };
}

function mapQuestionToApi(q: Question): ApiQuestion {
  if (q.type === 'Flashcard') {
    const front = (q.content.front || '').trim();
    const back = (q.content.back || '').trim();
    const image = (q.content?.image || '').trim();

    return image
      ? { type: 'flashCard', question: front, answer: back, image }
      : { type: 'flashCard', question: front, answer: back };
  }

  if (q.type === 'Multiple Choice Question (MCQ)') {
    const question = (q.content.question || '').trim();
    const originalOptions: string[] = q.content.options || [];
    const trimmed = originalOptions.map((s) => (s || '').trim());
    const nonEmpty = trimmed.filter(Boolean);

    const options = nonEmpty.map((label) => ({
      label,
      value: slugifyOptionValue(label),
    }));

    const correctIndex = q.content.correct as number;
    const correctLabelOriginal = (originalOptions[correctIndex] || '').trim();
    const answerValue = slugifyOptionValue(correctLabelOriginal);

    return {
      type: 'mcq',
      question,
      answer: answerValue,
      options,
    };
  }

  // Fill-In: convert ??WORD?? -> ___ and send extracted WORD as answer
  const rawQuestion = (q.content.question || '').trim();
  const derivedAnswer = extractFillInAnswer(rawQuestion);
  const answer = (derivedAnswer || (q.content.answer || '').trim() || '').trim();
  const normalizedQuestion = rawQuestion.replace(/\?\?(.+?)\?\?/, '___');

  return {
    type: 'fillIn',
    question: normalizedQuestion,
    answer,
  };
}

function slugifyOptionValue(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function extractFillInAnswer(q: string) {
  const m = q.match(/\?\?(.+?)\?\?/);
  return m ? m[1] : undefined;
}

function normalizeTags(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((t) => {
        if (typeof t === 'string') return t;
        if (t && typeof t === 'object') {
          const anyT = t as any;
          if (typeof anyT.value === 'string') return anyT.value;
          if (typeof anyT.label === 'string') return anyT.label;
        }
        return String(t ?? '');
      })
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function dedupe(arr: string[]) {
  return Array.from(new Set(arr.map((t) => t.trim()).filter(Boolean)));
}