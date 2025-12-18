'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ArrowLeft, Bookmark, Copy, FolderSymlink, History, Import, LockKeyholeOpen, Merge, Pencil, Settings, SlidersHorizontal, Trash2, X } from 'lucide-react';

import { PlusIcon } from '@/components/icons';

import { Question } from './types';
import { ActionDropdown } from '@/components/ui';

interface CreateSetFormProps {
  onImport: (questions: Question[]) => void;
  onBack?: () => void;
}

export default function CreateSetForm({ onImport, onBack }: CreateSetFormProps) {
  const { register, setValue } = useFormContext();
  const [tagInput, setTagInput] = useState('');
  const [showImportModal, setShowImportModal] = useState(false); // modal toggle

  const [importText, setImportText] = useState('');
  const [separatorSides, setSeparatorSides] = useState('comma'); // 'comma' | 'tab'
  const [separatorCards, setSeparatorCards] = useState('newline'); // 'newline' | 'semicolon'

  console.log('CreateSetForm: onBack prop present?', !!onBack);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    // Update form state directly with comma-separated string
    setValue('tags', value);
  };

  const handleImportSubmit = () => {

    if (!importText.trim()) {
      alert('Please enter some text to import.');
      return;
    }

    // 1. Determine delimiters
    const cardDelimiter = separatorCards === 'semicolon' ? ';' : '\n';
    const sideDelimiter = separatorSides === 'tab' ? '\t' : ',';

    console.log('Importing with:', { cardDelimiter, sideDelimiter, importText });

    // 2. Split into cards
    const rawCards = importText.split(cardDelimiter);
    console.log('Raw cards:', rawCards);

    // 3. Parse each card
    let addedCount = 0;
    const newQuestions: Question[] = [];
    rawCards.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) return;

      const parts = line.split(sideDelimiter);
      console.log('Parsing line:', line, 'Parts:', parts);

      // We take the first part as front, second as back.
      // If no second part, back is empty.
      const front = parts[0] ? parts[0].trim() : '';
      const back = parts[1] ? parts[1].trim() : '';

      if (front || back) {
        newQuestions.push({
          id: `${Date.now()}-${Math.random()}`,
          type: 'Flashcard',
          content: {
            front,
            back,
            image: '',
          },
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      onImport(newQuestions);
      setShowImportModal(false);
      setImportText('');
    } else {
      alert('Could not parse any flashcards from the text.');
    }

  };

  const dropdownItems =
    [
      {
        label: 'Duplicate',
        icon: <Copy size={16} />,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          // setDuplicateModalOpen(true);
        },
      },
      {
        label: 'Bookmark',
        icon: (
          <Bookmark
            size={16}
            className="text-[#444444]"
          />
        ),
        // onClick: handleBookmark,
      },
      {
        label: 'Manage Access',
        icon: <LockKeyholeOpen size={16} />,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          // if (onManageAccess) {
          //   onManageAccess(id);
          // } else {
          //   setManageAccessModalOpen(true);
          // }
        },
      },
      {
        label: 'Move',
        icon: <FolderSymlink size={16} />,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          // if (onMove) {
          //   // trigger parent grid’s MoveFolderModal
          //   // onMove(id);
          // } else {
          //   // fallback legacy modal if parent didn’t supply onMove
          //   // setMoveModalOpen(true);
          // }
        },
      },
      {
        label: 'Merge',
        icon: <Merge size={16} />,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          // setMoveModalOpen(true);
        },
      },
      {
        label: 'Delete',
        icon: <Trash2 size={16} />,
        className: 'text-red-500 font-medium',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          // setRemoveModalOpen(true);
        },
      },

    ];

  return (
    <div className="max-w-full mb-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center h-10 px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#0890A8] text-sm font-medium w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </Link>
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-none border border-gray-300 rounded-md h-10 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:text-gray-900 hover:border-[#0890A8]"
            onClick={() => setShowImportModal(true)}
          >
            <Import className="h-4 w-4" />
            <span className="hidden xs:inline">Import</span>
            <span className="xs:hidden">Import</span>
          </button>
          <button
            type="button"
            className="border border-gray-300 rounded-md h-10 px-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-[#0890A8]"
          >
            <ActionDropdown items={dropdownItems} triggerIcon={<SlidersHorizontal className="h-4 w-4" />} />
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none bg-[#0890A8] hover:bg-[#0890A8]/75 text-white rounded-md h-10 px-4 text-sm font-medium flex items-center justify-center gap-1 whitespace-nowrap"
          >
            <PlusIcon size={20} />
            Create Set
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {
        showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blur background */}
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowImportModal(false)}
            ></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 z-10">
              <button
                type="button"
                className="absolute top-3 right-5 text-[#444444] hover:text-[#444444]/75 border border-gray-300 rounded-full p-1"
                onClick={() => setShowImportModal(false)}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <Import className="h-4 w-4" />
                Import
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Copy & Paste your data below to create flashcards seamlessly!
                  </label>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder={`Front Side 1${separatorSides === 'tab' ? '\t' : ','}Back Side 1${separatorCards === 'semicolon' ? ';' : '\n'}Front Side 2${separatorSides === 'tab' ? '\t' : ','}Back Side 2${separatorCards === 'semicolon' ? ';' : '\n'}Front Side 3${separatorSides === 'tab' ? '\t' : ','}Back Side 3`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890A8]/75 font-mono text-sm"
                    rows={8}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                  <div>
                    <span className="block text-lg text-gray-700 mb-1 font-bold italic">
                      Between sides
                    </span>
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="separatorSides"
                          value="comma"
                          checked={separatorSides === 'comma'}
                          onChange={(e) => setSeparatorSides(e.target.value)}
                        />
                        Comma
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="separatorSides"
                          value="tab"
                          checked={separatorSides === 'tab'}
                          onChange={(e) => setSeparatorSides(e.target.value)}
                        />
                        Tab
                      </label>
                    </div>
                  </div>

                  <div>
                    <span className="block text-lg text-gray-700 mb-1 font-bold italic">
                      Between Flashcards
                    </span>
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="separatorCards"
                          value="newline"
                          checked={separatorCards === 'newline'}
                          onChange={(e) => setSeparatorCards(e.target.value)}
                        />
                        New Line
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="separatorCards"
                          value="semicolon"
                          checked={separatorCards === 'semicolon'}
                          onChange={(e) => setSeparatorCards(e.target.value)}
                        />
                        Semicolon
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleImportSubmit}
                  className="flex items-center justify-center gap-2 bg-[#0890A8] hover:bg-[#0890A8]/75 text-white rounded-md px-4 py-2 text-sm font-medium self-end"
                >
                  <Import className="h-4 w-4" />
                  Import
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Main form */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter quiz set title. Eg: Bio Chapter 12"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890A8] focus:border-none"
            {...register('title', { required: true })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Enter a description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890A8] focus:border-none"
            rows={3}
            {...register('description')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            placeholder="Enter tags, separated by comma"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890A8] focus:border-none"
            value={tagInput}
            onChange={handleTagInputChange}
          />
        </div>
      </div>
    </div >
  );
}
