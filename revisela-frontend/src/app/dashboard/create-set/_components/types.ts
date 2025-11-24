// _components/types.ts
export type QuestionType = 'Flashcard' | 'Multiple Choice Question (MCQ)' | 'Fill-In' | 'Selector';

export interface Question {
  id: string;
  type: QuestionType;
  content: any;
}

export interface QuizSetData {
  title: string;
  description: string; // not optional!
  tags: string[] | any;
  questions: Question[];
}