// 'use client';

// type QuestionType = 'Flashcard' | 'Multiple Choice Question (MCQ)' | 'Fill-In';

// interface QuestionTypeSelectorProps {
//   onSelect: (type: QuestionType) => void;
//   title?: string;
// }

// export default function QuestionTypeSelector({ 
//   onSelect, 
//   title = 'Select a question type!' 
// }: QuestionTypeSelectorProps) {
//   return (
//     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
//       <h2 className="text-center text-lg font-medium mb-6">
//         {title}
//       </h2>
//       <div className="flex gap-4 justify-center">
//         <button
//           type="button"
//           onClick={() => onSelect('Flashcard')}
//           className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-6 py-3 rounded-md font-medium"
//         >
//           Flashcard
//         </button>
//         <button
//           type="button"
//           onClick={() => onSelect('Multiple Choice Question (MCQ)')}
//           className="bg-green-100 hover:bg-green-200 text-green-800 px-6 py-3 rounded-md font-medium"
//         >
//           Multiple Choice Question (MCQ)
//         </button>
//         <button
//           type="button"
//           onClick={() => onSelect('Fill-In')}
//           className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-6 py-3 rounded-md font-medium"
//         >
//           Fill-In
//         </button>
//       </div>
//     </div>
//   );
// } 

'use client';

type QuestionType = 'Flashcard' | 'Multiple Choice Question (MCQ)' | 'Fill-In';

interface QuestionTypeSelectorProps {
  onSelect: (type: QuestionType) => void;
  onCancel?: () => void;   // ✅ Added cancel support
  title?: string;
}

export default function QuestionTypeSelector({ 
  onSelect, 
  onCancel,
  title = 'Select a question type!' 
}: QuestionTypeSelectorProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
      <h2 className="text-center text-lg font-medium mb-6">
        {title}
      </h2>
      <div className="flex gap-4 justify-center mb-4">
        <button
          type="button"
          onClick={() => onSelect('Flashcard')}
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-6 py-3 rounded-md font-medium"
        >
          Flashcard
        </button>
        <button
          type="button"
          onClick={() => onSelect('Multiple Choice Question (MCQ)')}
          className="bg-green-100 hover:bg-green-200 text-green-800 px-6 py-3 rounded-md font-medium"
        >
          Multiple Choice Question (MCQ)
        </button>
        <button
          type="button"
          onClick={() => onSelect('Fill-In')}
          className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-6 py-3 rounded-md font-medium"
        >
          Fill-In
        </button>
      </div>

      {/* ✅ Cancel button (only shows if onCancel is passed) */}
      {onCancel && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
