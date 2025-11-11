'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ArrowLeft, Import, Settings, X } from 'lucide-react';

export default function CreateSetForm() {
  const { register, setValue } = useFormContext();
  const [tagInput, setTagInput] = useState('');
  const [showImportModal, setShowImportModal] = useState(false); // modal toggle

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    // Update form state directly with comma-separated string
    setValue('tags', value);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Import submitted!');
    setShowImportModal(false);
  };

  return (
    <div className="max-w-full  mb-8 relative">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/dashboard"
          className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#0890A8] text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go Back
        </Link>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 flex items-center gap-2"
            onClick={() => setShowImportModal(true)}
          >
            <Import className="h-4 w-4" />
            Import
          </button>
          <button
            type="button"
            className="border border-gray-300 rounded-md p-2 text-sm font-medium text-gray-700"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="submit"
            className="bg-[#0890A8] hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium"
          >
            Create Set
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
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
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowImportModal(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <Import className="h-4 w-4" />
              Import
            </div>

            <form onSubmit={handleImportSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copy & Paste your data below to create flashcards seamlessly!
                </label>
                <textarea
                  placeholder={`Front Side 1,Back Side 1
Front Side 2,Back Side 2
Front Side 3,Back Side 3`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  rows={5}
                />
              </div>

              <div className="flex gap-10">
                <div>
                  <span className="block text-lg text-gray-700 mb-1 font-bold">
                    Between sides
                  </span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="importType" value="comma" />
                      Comma
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="importType" value="tab" />
                      Tab
                    </label>
                  </div>
                </div>

                <div>
                  <span className="block text-lg text-gray-700 mb-1 font-bold">
                    Between Flashcards
                  </span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="importType" value="newline" />
                      New Line
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="importType" value="semicolon" />
                      Semicolon
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium self-end"
              >
                <Import className="h-4 w-4" />
                Import
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main form */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter quiz set title. Eg: Bio Chapter 12"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            {...register('title', { required: true })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Enter a description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            value={tagInput}
            onChange={handleTagInputChange}
          />
        </div>
      </div>
    </div>
  );
}
