import { QuestionType } from './types';

export function getDefaultContentForType(type: QuestionType) {
  switch (type) {
    case 'Flashcard':
      return { front: '', back: '', image: '' };
    case 'Multiple Choice Question (MCQ)':
      return { question: '', options: ['', '', '', '', ''], correct: null }; // 5 options
    case 'Fill-In':
      return { question: '', answer: '' };
    case 'Selector':
      return {};
    default:
      return {};
  }
}
