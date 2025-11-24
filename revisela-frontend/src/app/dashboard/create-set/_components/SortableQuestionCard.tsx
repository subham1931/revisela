// SortableQuestionCard.tsx
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { CiImageOn, CiMusicNote1 } from 'react-icons/ci';
import { FaBold } from 'react-icons/fa6';
import { HiItalic } from 'react-icons/hi2';
import { HiUnderline } from 'react-icons/hi2';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, X } from 'lucide-react';

import MediaSelector from './MediaSelector';
import QuestionTypeSelector from './question-type-selector';
import RichTextEditor from './RichTextEditor';
import { QuizSetData } from './types';
import { getDefaultContentForType } from './utils';

interface SortableQuestionCardProps {
  id: string;
  index: number;
  type: string; // "Flashcard" | "Multiple Choice Question (MCQ)" | "Fill-In"
  control: Control<QuizSetData>;
  onAddQuestion: () => void;

  onDeleteQuestion: () => void;
  totalQuestions: number;
  selectorCount: number;
  onTypeSelected: () => void;
}

export default function SortableQuestionCard({
  id,
  index,
  type,
  control,
  onAddQuestion,
  onDeleteQuestion,
  totalQuestions,
  selectorCount,
  onTypeSelected,
}: SortableQuestionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const { field } = useController({
    name: `questions.${index}.content` as const,
    control,
  });

  const { field: typeField } = useController({
    name: `questions.${index}.type` as const,
    control,
  });

  const content = field.value || {};
  const [isActive, setIsActive] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Check which formats are active at cursor position
  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  const handleFormatClick = (command: string) => {
    document.execCommand(command);
    updateActiveFormats();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="max-w-full mb-12 relative text-gray-500"
    >
      {typeField.value === 'Selector' ? (
        <div className="relative w-full">
          <QuestionTypeSelector
            onSelect={(newType) => {
              typeField.onChange(newType);
              field.onChange(getDefaultContentForType(newType));
              onTypeSelected();
            }}
            onDelete={selectorCount > 1 ? onDeleteQuestion : undefined}
            title={`Question ${index + 1}`}
          />
          {/* Drag handle for selector */}
          <div
            {...attributes}
            {...listeners}
            className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-grab text-gray-400 hover:text-gray-600 hover:bg-[#D9D9D9] rounded-xl p-1"
          >
            <GripVertical className="h-6 w-6" />
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          {/* Question card */}
          <div
            className={`w-full bg-white border rounded-lg p-5 relative transition ${isActive ? 'border-[#0890A8] ' : 'border-gray-200'
              }`}
            tabIndex={0}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onMouseUp={updateActiveFormats}
            onKeyUp={updateActiveFormats}
          >
            {/* Top bar */}
            <div className="flex justify-between items-center mb-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-black mr-2">
                {index + 1}.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleFormatClick('bold')}
                  className={`p-1 rounded transition-colors ${activeFormats.bold ? 'bg-gray-300' : 'hover:bg-gray-100'
                    }`}
                  title="Bold"
                >
                  <FaBold size={18} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleFormatClick('italic')}
                  className={`p-1 rounded transition-colors ${activeFormats.italic ? 'bg-gray-300' : 'hover:bg-gray-100'
                    }`}
                  title="Italic"
                >
                  <HiItalic size={19} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleFormatClick('underline')}
                  className={`p-1 rounded transition-colors ${activeFormats.underline ? 'bg-gray-300' : 'hover:bg-gray-100'
                    }`}
                  title="Underline"
                >
                  <HiUnderline size={20} />
                </button>
              </div>
              <button
                type="button"
                onClick={onDeleteQuestion}
                className="flex items-center gap-1 text-black hover:text-red-600 text-sm font-medium"
              >
                <RiDeleteBin6Line className="w-5 h-5" />
              </button>
            </div>

            {/* Question content */}
            <div>
              {typeField.value === 'Flashcard' && (
                <div className="my-8 flex gap-5">
                  <div className="flex flex-col flex-1">
                    <label className="font-semibold mb-1">Front</label>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <RichTextEditor
                        value={content.front || ''}
                        onChange={(html) =>
                          field.onChange({ ...content, front: html })
                        }
                        placeholder="Enter text here."
                        className="w-full p-2 rounded-lg min-h-[42px]"
                      />
                      <MediaSelector id={`flashcard-front-${index}`} />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="font-semibold mb-1">Back</label>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <RichTextEditor
                        value={content.back || ''}
                        onChange={(html) =>
                          field.onChange({ ...content, back: html })
                        }
                        placeholder="Enter text here."
                        className="w-full p-2 rounded-lg min-h-[42px]"
                      />
                      <MediaSelector id={`flashcard-back-${index}`} />
                    </div>
                  </div>
                </div>
              )}

              {typeField.value === 'Multiple Choice Question (MCQ)' && (
                <>
                  {/* Question input */}
                  <div className="mb-4">
                    <label className="font-semibold block mb-2">Question</label>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <RichTextEditor
                        value={content.question || ''}
                        onChange={(html) =>
                          field.onChange({ ...content, question: html })
                        }
                        placeholder="Enter text here"
                        className="w-full p-2 rounded-lg min-h-[42px]"
                      />
                      <MediaSelector id={`mcq-question-${index}`} />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-4">
                    <h1>Options</h1>
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex w-1/2 items-center gap-2">
                          <label className="font-semibold mb-1 block text-gray-500">
                            {String.fromCharCode(65 + i)}.
                          </label>
                          <input
                            value={content.options?.[i] || ''}
                            onChange={(e) => {
                              const newOptions = [...(content.options || [])];
                              newOptions[i] = e.target.value;

                              let newCorrect = content.correct;
                              if (
                                !e.target.value.trim() &&
                                content.correct === i
                              ) {
                                newCorrect = null;
                              }

                              field.onChange({
                                ...content,
                                options: newOptions,
                                correct: newCorrect,
                              });
                            }}
                            placeholder="Enter text here. If blank, the option won't display."
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0890A8] focus:border-none"
                          />
                          <MediaSelector id={`mcq-option-${index}-${i}`} />
                        </div>
                      ))}
                  </div>

                  {/* Correct option selector */}
                  <div className="my-8 flex gap-2">
                    <p className="font-semibold mb-2">Correct option:</p>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map((label, i) => {
                        const isDisabled =
                          !content.options?.[i] ||
                          content.options[i].trim() === '';

                        return (
                          <div
                            key={i}
                            onClick={() => {
                              if (!isDisabled) {
                                field.onChange({
                                  ...content,
                                  correct: content.correct === i ? null : i,
                                });
                              }
                            }}
                            className={`transition rounded-full flex items-center justify-center w-6 h-6 ${content.correct === i
                              ? 'border border-[#0890A8] cursor-pointer'
                              : isDisabled
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'hover:border hover:border-[#0890A8] cursor-pointer'
                              }`}
                            style={{ aspectRatio: '1 / 1' }}
                          >
                            {label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {typeField.value === 'Fill-In' && (
                <div className="my-5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <RichTextEditor
                      value={content.question || ''}
                      onChange={(html) =>
                        field.onChange({ ...content, question: html })
                      }
                      placeholder="Enter text here."
                      className="w-full mb-2 p-2 rounded-lg min-h-[42px]"
                    />

                    <MediaSelector id={`fillin-${index}`} />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Note: To create the blank, wrap the word with 2 question marks
                    without leaving any spaces. Eg: ??WORD?? You can only create
                    one fill-in per question
                  </p>
                </div>
              )}
            </div>

            {/* Badge */}
            <p
              className={`absolute bottom-0 right-0 text-black text-sm px-3 py-2 rounded-t-xl rounded-br-lg rounded-r-none ${typeField.value === 'Multiple Choice Question (MCQ)'
                ? 'bg-[#ADF5C6]'
                : typeField.value === 'Fill-In'
                  ? 'bg-[#FFCDFD]'
                  : typeField.value === 'Flashcard'
                    ? 'bg-[#FFCE94]'
                    : 'bg-gray-500'
                }`}
            >
              {typeField.value === 'Multiple Choice Question (MCQ)'
                ? 'MCQ'
                : typeField.value === 'Fill-In'
                  ? 'Fill-In'
                  : typeField.value === 'Flashcard'
                    ? 'Flashcard'
                    : ''}
            </p>
          </div>

          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute -left-8 top-1/2 -translate-y-1/2 cursor-grab text-gray-400 hover:text-gray-600 hover:bg-[#D9D9D9] rounded-xl p-1"
          >
            <GripVertical className="h-6 w-6" />
          </div>
        </div>
      )}


      {/* Add button */}
      <button
        type="button"
        onClick={onAddQuestion}
        className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 bg-white border rounded-full p-2 shadow-md"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
