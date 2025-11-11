// 'use client';
// import { GripVertical, Plus } from 'lucide-react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { QuestionType } from './types';
// interface SortableQuestionCardProps {
//   id: string;
//   index: number;
//   type: QuestionType;
//   content: any;
//   isActive: boolean;
//   onActivate: () => void;
//   onAddQuestion: () => void;
// }
// function SortableQuestionCard({
//   id,
//   index,
//   type,
//   content,
//   isActive,
//   onActivate,
//   onAddQuestion,
// }: SortableQuestionCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`max-w-full border border-gray-200 rounded-lg bg-white mb-8 relative ${isActive ? 'ring-2 ring-teal-500' : ''}`}
//     >
//       <div className="p-4 flex items-start gap-4">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
//         >
//           <GripVertical className="h-6 w-6" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm mr-2">
//                 {index + 1}
//               </span>
//               <h3 className="font-medium">{type}</h3>
//             </div>
//             <button
//               type="button"
//               onClick={onActivate}
//               className="text-sm text-teal-600 hover:text-teal-800"
//             >
//               Edit
//             </button>
//           </div>
//           <div className="pl-8">
//             {/* Render actual question content */}
//             {type === 'Flashcard' && content && (
//               <div>
//                 <div className="font-semibold">Front:</div>
//                 <div>{content.front}</div>
//                 <div className="font-semibold mt-2">Back:</div>
//                 <div>{content.back}</div>
//               </div>
//             )}
//             {type === 'Multiple Choice Question (MCQ)' && content && (
//               <div>
//                 <div className="font-semibold">Q:</div>
//                 <div>{content.question}</div>
//                 <div className="font-semibold mt-2">Options:</div>
//                 <ul className="list-disc ml-5">
//                   {content.options?.map?.((opt: string, i: number) => (
//                     <li key={i} className={content.correct === i ? "text-teal-600 font-bold" : ""}>
//                       {String.fromCharCode(65 + i)}. {opt}
//                       {content.correct === i && <span className="ml-2 text-xs">(Correct)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {type === 'Fill-In' && content && (
//               <div>
//                 <div className="font-semibold">Q: {content.question}</div>
//                 {/* <div>{content.question}</div> */}
//                 <div className="font-semibold mt-2">Answer:</div>
//                 <div>{content.answer}</div>
//               </div>
//             )}
//             {/* Fallback if no content */}
//             {!content && (
//               <p className="text-gray-500 text-sm">Question content will appear here</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Add button in center bottom */}
//       <button
//         type="button"
//         onClick={onAddQuestion}
//         className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }
// interface CreateQuestionCardProps {
//   questionFields: Array<any>;
//   activeQuestionIndex: number | null;
//   onActivateQuestion: (index: number) => void;
//   onAddNewQuestion: (index: number) => void;
//   onMoveQuestion: (oldIndex: number, newIndex: number) => void;
// }
// export default function CreateQuestionCard({
//   questionFields,
//   activeQuestionIndex,
//   onActivateQuestion,
//   onAddNewQuestion,
//   onMoveQuestion
// }: CreateQuestionCardProps) {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = questionFields.findIndex(field => field.id === active.id);
//       const newIndex = questionFields.findIndex(field => field.id === over.id);
//       onMoveQuestion(oldIndex, newIndex);
//     }
//   };
//   return (
//     <div className="max-w-full mx-auto">
//       {questionFields.length > 0 && (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={questionFields.map(field => field.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questionFields.map((field, index) => (
//               <SortableQuestionCard
//                 key={field.id}
//                 id={field.id}
//                 index={index}
//                 type={field.type}
//                 content={field.content} // Pass content here!
//                 isActive={index === activeQuestionIndex}
//                 onActivate={() => onActivateQuestion(index)}
//                 onAddQuestion={() => onAddNewQuestion(index + 1)}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}
//     </div>
//   );
// }
// 'use client';
// import {
//   Control,
//   UseFieldArrayInsert,
//   UseFieldArrayRemove,
//   useController,
// } from 'react-hook-form';
// import { RiDeleteBin6Line } from 'react-icons/ri';
// import {
//   DndContext,
//   DragEndEvent,
//   KeyboardSensor,
//   PointerSensor,
//   closestCenter,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { GripVertical, Plus } from 'lucide-react';
// 'use client';
// import { GripVertical, Plus } from 'lucide-react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { QuestionType } from './types';
// interface SortableQuestionCardProps {
//   id: string;
//   index: number;
//   type: QuestionType;
//   content: any;
//   isActive: boolean;
//   onActivate: () => void;
//   onAddQuestion: () => void;
// }
// function SortableQuestionCard({
//   id,
//   index,
//   type,
//   content,
//   isActive,
//   onActivate,
//   onAddQuestion,
// }: SortableQuestionCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`max-w-full border border-gray-200 rounded-lg bg-white mb-8 relative ${isActive ? 'ring-2 ring-teal-500' : ''}`}
//     >
//       <div className="p-4 flex items-start gap-4">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
//         >
//           <GripVertical className="h-6 w-6" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm mr-2">
//                 {index + 1}
//               </span>
//               <h3 className="font-medium">{type}</h3>
//             </div>
//             <button
//               type="button"
//               onClick={onActivate}
//               className="text-sm text-teal-600 hover:text-teal-800"
//             >
//               Edit
//             </button>
//           </div>
//           <div className="pl-8">
//             {/* Render actual question content */}
//             {type === 'Flashcard' && content && (
//               <div>
//                 <div className="font-semibold">Front:</div>
//                 <div>{content.front}</div>
//                 <div className="font-semibold mt-2">Back:</div>
//                 <div>{content.back}</div>
//               </div>
//             )}
//             {type === 'Multiple Choice Question (MCQ)' && content && (
//               <div>
//                 <div className="font-semibold">Q:</div>
//                 <div>{content.question}</div>
//                 <div className="font-semibold mt-2">Options:</div>
//                 <ul className="list-disc ml-5">
//                   {content.options?.map?.((opt: string, i: number) => (
//                     <li key={i} className={content.correct === i ? "text-teal-600 font-bold" : ""}>
//                       {String.fromCharCode(65 + i)}. {opt}
//                       {content.correct === i && <span className="ml-2 text-xs">(Correct)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {type === 'Fill-In' && content && (
//               <div>
//                 <div className="font-semibold">Q: {content.question}</div>
//                 {/* <div>{content.question}</div> */}
//                 <div className="font-semibold mt-2">Answer:</div>
//                 <div>{content.answer}</div>
//               </div>
//             )}
//             {/* Fallback if no content */}
//             {!content && (
//               <p className="text-gray-500 text-sm">Question content will appear here</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Add button in center bottom */}
//       <button
//         type="button"
//         onClick={onAddQuestion}
//         className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }
// interface CreateQuestionCardProps {
//   questionFields: Array<any>;
//   activeQuestionIndex: number | null;
//   onActivateQuestion: (index: number) => void;
//   onAddNewQuestion: (index: number) => void;
//   onMoveQuestion: (oldIndex: number, newIndex: number) => void;
// }
// export default function CreateQuestionCard({
//   questionFields,
//   activeQuestionIndex,
//   onActivateQuestion,
//   onAddNewQuestion,
//   onMoveQuestion
// }: CreateQuestionCardProps) {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = questionFields.findIndex(field => field.id === active.id);
//       const newIndex = questionFields.findIndex(field => field.id === over.id);
//       onMoveQuestion(oldIndex, newIndex);
//     }
//   };
//   return (
//     <div className="max-w-full mx-auto">
//       {questionFields.length > 0 && (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={questionFields.map(field => field.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questionFields.map((field, index) => (
//               <SortableQuestionCard
//                 key={field.id}
//                 id={field.id}
//                 index={index}
//                 type={field.type}
//                 content={field.content} // Pass content here!
//                 isActive={index === activeQuestionIndex}
//                 onActivate={() => onActivateQuestion(index)}
//                 onAddQuestion={() => onAddNewQuestion(index + 1)}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}
//     </div>
//   );
// }
// 'use client';
// import { GripVertical, Plus } from 'lucide-react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { QuestionType } from './types';
// interface SortableQuestionCardProps {
//   id: string;
//   index: number;
//   type: QuestionType;
//   content: any;
//   isActive: boolean;
//   onActivate: () => void;
//   onAddQuestion: () => void;
// }
// function SortableQuestionCard({
//   id,
//   index,
//   type,
//   content,
//   isActive,
//   onActivate,
//   onAddQuestion,
// }: SortableQuestionCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`max-w-full border border-gray-200 rounded-lg bg-white mb-8 relative ${isActive ? 'ring-2 ring-teal-500' : ''}`}
//     >
//       <div className="p-4 flex items-start gap-4">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
//         >
//           <GripVertical className="h-6 w-6" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm mr-2">
//                 {index + 1}
//               </span>
//               <h3 className="font-medium">{type}</h3>
//             </div>
//             <button
//               type="button"
//               onClick={onActivate}
//               className="text-sm text-teal-600 hover:text-teal-800"
//             >
//               Edit
//             </button>
//           </div>
//           <div className="pl-8">
//             {/* Render actual question content */}
//             {type === 'Flashcard' && content && (
//               <div>
//                 <div className="font-semibold">Front:</div>
//                 <div>{content.front}</div>
//                 <div className="font-semibold mt-2">Back:</div>
//                 <div>{content.back}</div>
//               </div>
//             )}
//             {type === 'Multiple Choice Question (MCQ)' && content && (
//               <div>
//                 <div className="font-semibold">Q:</div>
//                 <div>{content.question}</div>
//                 <div className="font-semibold mt-2">Options:</div>
//                 <ul className="list-disc ml-5">
//                   {content.options?.map?.((opt: string, i: number) => (
//                     <li key={i} className={content.correct === i ? "text-teal-600 font-bold" : ""}>
//                       {String.fromCharCode(65 + i)}. {opt}
//                       {content.correct === i && <span className="ml-2 text-xs">(Correct)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {type === 'Fill-In' && content && (
//               <div>
//                 <div className="font-semibold">Q: {content.question}</div>
//                 {/* <div>{content.question}</div> */}
//                 <div className="font-semibold mt-2">Answer:</div>
//                 <div>{content.answer}</div>
//               </div>
//             )}
//             {/* Fallback if no content */}
//             {!content && (
//               <p className="text-gray-500 text-sm">Question content will appear here</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Add button in center bottom */}
//       <button
//         type="button"
//         onClick={onAddQuestion}
//         className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }
// interface CreateQuestionCardProps {
//   questionFields: Array<any>;
//   activeQuestionIndex: number | null;
//   onActivateQuestion: (index: number) => void;
//   onAddNewQuestion: (index: number) => void;
//   onMoveQuestion: (oldIndex: number, newIndex: number) => void;
// }
// export default function CreateQuestionCard({
//   questionFields,
//   activeQuestionIndex,
//   onActivateQuestion,
//   onAddNewQuestion,
//   onMoveQuestion
// }: CreateQuestionCardProps) {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = questionFields.findIndex(field => field.id === active.id);
//       const newIndex = questionFields.findIndex(field => field.id === over.id);
//       onMoveQuestion(oldIndex, newIndex);
//     }
//   };
//   return (
//     <div className="max-w-full mx-auto">
//       {questionFields.length > 0 && (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={questionFields.map(field => field.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questionFields.map((field, index) => (
//               <SortableQuestionCard
//                 key={field.id}
//                 id={field.id}
//                 index={index}
//                 type={field.type}
//                 content={field.content} // Pass content here!
//                 isActive={index === activeQuestionIndex}
//                 onActivate={() => onActivateQuestion(index)}
//                 onAddQuestion={() => onAddNewQuestion(index + 1)}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}
//     </div>
//   );
// }
// 'use client';
// import { GripVertical, Plus } from 'lucide-react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { QuestionType } from './types';
// interface SortableQuestionCardProps {
//   id: string;
//   index: number;
//   type: QuestionType;
//   content: any;
//   isActive: boolean;
//   onActivate: () => void;
//   onAddQuestion: () => void;
// }
// function SortableQuestionCard({
//   id,
//   index,
//   type,
//   content,
//   isActive,
//   onActivate,
//   onAddQuestion,
// }: SortableQuestionCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`max-w-full border border-gray-200 rounded-lg bg-white mb-8 relative ${isActive ? 'ring-2 ring-teal-500' : ''}`}
//     >
//       <div className="p-4 flex items-start gap-4">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
//         >
//           <GripVertical className="h-6 w-6" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm mr-2">
//                 {index + 1}
//               </span>
//               <h3 className="font-medium">{type}</h3>
//             </div>
//             <button
//               type="button"
//               onClick={onActivate}
//               className="text-sm text-teal-600 hover:text-teal-800"
//             >
//               Edit
//             </button>
//           </div>
//           <div className="pl-8">
//             {/* Render actual question content */}
//             {type === 'Flashcard' && content && (
//               <div>
//                 <div className="font-semibold">Front:</div>
//                 <div>{content.front}</div>
//                 <div className="font-semibold mt-2">Back:</div>
//                 <div>{content.back}</div>
//               </div>
//             )}
//             {type === 'Multiple Choice Question (MCQ)' && content && (
//               <div>
//                 <div className="font-semibold">Q:</div>
//                 <div>{content.question}</div>
//                 <div className="font-semibold mt-2">Options:</div>
//                 <ul className="list-disc ml-5">
//                   {content.options?.map?.((opt: string, i: number) => (
//                     <li key={i} className={content.correct === i ? "text-teal-600 font-bold" : ""}>
//                       {String.fromCharCode(65 + i)}. {opt}
//                       {content.correct === i && <span className="ml-2 text-xs">(Correct)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {type === 'Fill-In' && content && (
//               <div>
//                 <div className="font-semibold">Q: {content.question}</div>
//                 {/* <div>{content.question}</div> */}
//                 <div className="font-semibold mt-2">Answer:</div>
//                 <div>{content.answer}</div>
//               </div>
//             )}
//             {/* Fallback if no content */}
//             {!content && (
//               <p className="text-gray-500 text-sm">Question content will appear here</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Add button in center bottom */}
//       <button
//         type="button"
//         onClick={onAddQuestion}
//         className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }
// interface CreateQuestionCardProps {
//   questionFields: Array<any>;
//   activeQuestionIndex: number | null;
//   onActivateQuestion: (index: number) => void;
//   onAddNewQuestion: (index: number) => void;
//   onMoveQuestion: (oldIndex: number, newIndex: number) => void;
// }
// export default function CreateQuestionCard({
//   questionFields,
//   activeQuestionIndex,
//   onActivateQuestion,
//   onAddNewQuestion,
//   onMoveQuestion
// }: CreateQuestionCardProps) {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = questionFields.findIndex(field => field.id === active.id);
//       const newIndex = questionFields.findIndex(field => field.id === over.id);
//       onMoveQuestion(oldIndex, newIndex);
//     }
//   };
//   return (
//     <div className="max-w-full mx-auto">
//       {questionFields.length > 0 && (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={questionFields.map(field => field.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questionFields.map((field, index) => (
//               <SortableQuestionCard
//                 key={field.id}
//                 id={field.id}
//                 index={index}
//                 type={field.type}
//                 content={field.content} // Pass content here!
//                 isActive={index === activeQuestionIndex}
//                 onActivate={() => onActivateQuestion(index)}
//                 onAddQuestion={() => onAddNewQuestion(index + 1)}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}
//     </div>
//   );
// }
// 'use client';
// import { GripVertical, Plus } from 'lucide-react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { QuestionType } from './types';
// interface SortableQuestionCardProps {
//   id: string;
//   index: number;
//   type: QuestionType;
//   content: any;
//   isActive: boolean;
//   onActivate: () => void;
//   onAddQuestion: () => void;
// }
// function SortableQuestionCard({
//   id,
//   index,
//   type,
//   content,
//   isActive,
//   onActivate,
//   onAddQuestion,
// }: SortableQuestionCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`max-w-full border border-gray-200 rounded-lg bg-white mb-8 relative ${isActive ? 'ring-2 ring-teal-500' : ''}`}
//     >
//       <div className="p-4 flex items-start gap-4">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
//         >
//           <GripVertical className="h-6 w-6" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm mr-2">
//                 {index + 1}
//               </span>
//               <h3 className="font-medium">{type}</h3>
//             </div>
//             <button
//               type="button"
//               onClick={onActivate}
//               className="text-sm text-teal-600 hover:text-teal-800"
//             >
//               Edit
//             </button>
//           </div>
//           <div className="pl-8">
//             {/* Render actual question content */}
//             {type === 'Flashcard' && content && (
//               <div>
//                 <div className="font-semibold">Front:</div>
//                 <div>{content.front}</div>
//                 <div className="font-semibold mt-2">Back:</div>
//                 <div>{content.back}</div>
//               </div>
//             )}
//             {type === 'Multiple Choice Question (MCQ)' && content && (
//               <div>
//                 <div className="font-semibold">Q:</div>
//                 <div>{content.question}</div>
//                 <div className="font-semibold mt-2">Options:</div>
//                 <ul className="list-disc ml-5">
//                   {content.options?.map?.((opt: string, i: number) => (
//                     <li key={i} className={content.correct === i ? "text-teal-600 font-bold" : ""}>
//                       {String.fromCharCode(65 + i)}. {opt}
//                       {content.correct === i && <span className="ml-2 text-xs">(Correct)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {type === 'Fill-In' && content && (
//               <div>
//                 <div className="font-semibold">Q: {content.question}</div>
//                 {/* <div>{content.question}</div> */}
//                 <div className="font-semibold mt-2">Answer:</div>
//                 <div>{content.answer}</div>
//               </div>
//             )}
//             {/* Fallback if no content */}
//             {!content && (
//               <p className="text-gray-500 text-sm">Question content will appear here</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Add button in center bottom */}
//       <button
//         type="button"
//         onClick={onAddQuestion}
//         className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }
// interface CreateQuestionCardProps {
//   questionFields: Array<any>;
//   activeQuestionIndex: number | null;
//   onActivateQuestion: (index: number) => void;
//   onAddNewQuestion: (index: number) => void;
//   onMoveQuestion: (oldIndex: number, newIndex: number) => void;
// }
// export default function CreateQuestionCard({
//   questionFields,
//   activeQuestionIndex,
//   onActivateQuestion,
//   onAddNewQuestion,
//   onMoveQuestion
// }: CreateQuestionCardProps) {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = questionFields.findIndex(field => field.id === active.id);
//       const newIndex = questionFields.findIndex(field => field.id === over.id);
//       onMoveQuestion(oldIndex, newIndex);
//     }
//   };
//   return (
//     <div className="max-w-full mx-auto">
//       {questionFields.length > 0 && (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={questionFields.map(field => field.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questionFields.map((field, index) => (
//               <SortableQuestionCard
//                 key={field.id}
//                 id={field.id}
//                 index={index}
//                 type={field.type}
//                 content={field.content} // Pass content here!
//                 isActive={index === activeQuestionIndex}
//                 onActivate={() => onActivateQuestion(index)}
//                 onAddQuestion={() => onAddNewQuestion(index + 1)}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}
//     </div>
//   );
// }
// 'use client';
// import { GripVertical, Plus } from 'lucide-react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { QuestionType } from './types';
// interface SortableQuestionCardProps {
//   id: string;
//   index: number;
//   type: QuestionType;
//   content: any;
//   isActive: boolean;
//   onActivate: () => void;
//   onAddQuestion: () => void;
// }
// function SortableQuestionCard({
//   id,
//   index,
//   type,
//   content,
//   isActive,
//   onActivate,
//   onAddQuestion,
// }: SortableQuestionCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`max-w-full border border-gray-200 rounded-lg bg-white mb-8 relative ${isActive ? 'ring-2 ring-teal-500' : ''}`}
//     >
//       <div className="p-4 flex items-start gap-4">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
//         >
//           <GripVertical className="h-6 w-6" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm mr-2">
//                 {index + 1}
//               </span>
//               <h3 className="font-medium">{type}</h3>
//             </div>
//             <button
//               type="button"
//               onClick={onActivate}
//               className="text-sm text-teal-600 hover:text-teal-800"
//             >
//               Edit
//             </button>
//           </div>
//           <div className="pl-8">
//             {/* Render actual question content */}
//             {type === 'Flashcard' && content && (
//               <div>
//                 <div className="font-semibold">Front:</div>
//                 <div>{content.front}</div>
//                 <div className="font-semibold mt-2">Back:</div>
//                 <div>{content.back}</div>
//               </div>
//             )}
//             {type === 'Multiple Choice Question (MCQ)' && content && (
//               <div>
//                 <div className="font-semibold">Q:</div>
//                 <div>{content.question}</div>
//                 <div className="font-semibold mt-2">Options:</div>
//                 <ul className="list-disc ml-5">
//                   {content.options?.map?.((opt: string, i: number) => (
//                     <li key={i} className={content.correct === i ? "text-teal-600 font-bold" : ""}>
//                       {String.fromCharCode(65 + i)}. {opt}
//                       {content.correct === i && <span className="ml-2 text-xs">(Correct)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {type === 'Fill-In' && content && (
//               <div>
//                 <div className="font-semibold">Q: {content.question}</div>
//                 {/* <div>{content.question}</div> */}
//                 <div className="font-semibold mt-2">Answer:</div>
//                 <div>{content.answer}</div>
//               </div>
//             )}
//             {/* Fallback if no content */}
//             {!content && (
//               <p className="text-gray-500 text-sm">Question content will appear here</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Add button in center bottom */}
//       <button
//         type="button"
//         onClick={onAddQuestion}
//         className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }
// interface CreateQuestionCardProps {
//   questionFields: Array<any>;
//   activeQuestionIndex: number | null;
//   onActivateQuestion: (index: number) => void;
//   onAddNewQuestion: (index: number) => void;
//   onMoveQuestion: (oldIndex: number, newIndex: number) => void;
// }
// export default function CreateQuestionCard({
//   questionFields,
//   activeQuestionIndex,
//   onActivateQuestion,
//   onAddNewQuestion,
//   onMoveQuestion
// }: CreateQuestionCardProps) {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = questionFields.findIndex(field => field.id === active.id);
//       const newIndex = questionFields.findIndex(field => field.id === over.id);
//       onMoveQuestion(oldIndex, newIndex);
//     }
//   };
//   return (
//     <div className="max-w-full mx-auto">
//       {questionFields.length > 0 && (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={questionFields.map(field => field.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questionFields.map((field, index) => (
//               <SortableQuestionCard
//                 key={field.id}
//                 id={field.id}
//                 index={index}
//                 type={field.type}
//                 content={field.content} // Pass content here!
//                 isActive={index === activeQuestionIndex}
//                 onActivate={() => onActivateQuestion(index)}
//                 onAddQuestion={() => onAddNewQuestion(index + 1)}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}
//     </div>
//   );
// }
// 'use client';
// import { GripVertical, Plus } from 'lucide-react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { QuestionType } from './types';
// interface SortableQuestionCardProps {
//   id: string;
//   index: number;
//   type: QuestionType;
//   content: any;
//   isActive: boolean;
//   onActivate: () => void;
//   onAddQuestion: () => void;
// }
// function SortableQuestionCard({
//   id,
//   index,
//   type,
//   content,
//   isActive,
//   onActivate,
//   onAddQuestion,
// }: SortableQuestionCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`max-w-full border border-gray-200 rounded-lg bg-white mb-8 relative ${isActive ? 'ring-2 ring-teal-500' : ''}`}
//     >
//       <div className="p-4 flex items-start gap-4">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
//         >
//           <GripVertical className="h-6 w-6" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm mr-2">
//                 {index + 1}
//               </span>
//               <h3 className="font-medium">{type}</h3>
//             </div>
//             <button
//               type="button"
//               onClick={onActivate}
//               className="text-sm text-teal-600 hover:text-teal-800"
//             >
//               Edit
//             </button>
//           </div>
//           <div className="pl-8">
//             {/* Render actual question content */}
//             {type === 'Flashcard' && content && (
//               <div>
//                 <div className="font-semibold">Front:</div>
//                 <div>{content.front}</div>
//                 <div className="font-semibold mt-2">Back:</div>
//                 <div>{content.back}</div>
//               </div>
//             )}
//             {type === 'Multiple Choice Question (MCQ)' && content && (
//               <div>
//                 <div className="font-semibold">Q:</div>
//                 <div>{content.question}</div>
//                 <div className="font-semibold mt-2">Options:</div>
//                 <ul className="list-disc ml-5">
//                   {content.options?.map?.((opt: string, i: number) => (
//                     <li key={i} className={content.correct === i ? "text-teal-600 font-bold" : ""}>
//                       {String.fromCharCode(65 + i)}. {opt}
//                       {content.correct === i && <span className="ml-2 text-xs">(Correct)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {type === 'Fill-In' && content && (
//               <div>
//                 <div className="font-semibold">Q: {content.question}</div>
//                 {/* <div>{content.question}</div> */}
//                 <div className="font-semibold mt-2">Answer:</div>
//                 <div>{content.answer}</div>
//               </div>
//             )}
//             {/* Fallback if no content */}
//             {!content && (
//               <p className="text-gray-500 text-sm">Question content will appear here</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Add button in center bottom */}
//       <button
//         type="button"
//         onClick={onAddQuestion}
//         className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }
// interface CreateQuestionCardProps {
//   questionFields: Array<any>;
//   activeQuestionIndex: number | null;
//   onActivateQuestion: (index: number) => void;
//   onAddNewQuestion: (index: number) => void;
//   onMoveQuestion: (oldIndex: number, newIndex: number) => void;
// }
// export default function CreateQuestionCard({
//   questionFields,
//   activeQuestionIndex,
//   onActivateQuestion,
//   onAddNewQuestion,
//   onMoveQuestion
// }: CreateQuestionCardProps) {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = questionFields.findIndex(field => field.id === active.id);
//       const newIndex = questionFields.findIndex(field => field.id === over.id);
//       onMoveQuestion(oldIndex, newIndex);
//     }
//   };
//   return (
//     <div className="max-w-full mx-auto">
//       {questionFields.length > 0 && (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={questionFields.map(field => field.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questionFields.map((field, index) => (
//               <SortableQuestionCard
//                 key={field.id}
//                 id={field.id}
//                 index={index}
//                 type={field.type}
//                 content={field.content} // Pass content here!
//                 isActive={index === activeQuestionIndex}
//                 onActivate={() => onActivateQuestion(index)}
//                 onAddQuestion={() => onAddNewQuestion(index + 1)}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}
//     </div>
//   );
// }
// 'use client';
// import { GripVertical, Plus } from 'lucide-react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { QuestionType } from './types';
// interface SortableQuestionCardProps {
//   id: string;
//   index: number;
//   type: QuestionType;
//   content: any;
//   isActive: boolean;
//   onActivate: () => void;
//   onAddQuestion: () => void;
// }
// function SortableQuestionCard({
//   id,
//   index,
//   type,
//   content,
//   isActive,
//   onActivate,
//   onAddQuestion,
// }: SortableQuestionCardProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`max-w-full border border-gray-200 rounded-lg bg-white mb-8 relative ${isActive ? 'ring-2 ring-teal-500' : ''}`}
//     >
//       <div className="p-4 flex items-start gap-4">
//         <div
//           {...attributes}
//           {...listeners}
//           className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600"
//         >
//           <GripVertical className="h-6 w-6" />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm mr-2">
//                 {index + 1}
//               </span>
//               <h3 className="font-medium">{type}</h3>
//             </div>
//             <button
//               type="button"
//               onClick={onActivate}
//               className="text-sm text-teal-600 hover:text-teal-800"
//             >
//               Edit
//             </button>
//           </div>
//           <div className="pl-8">
//             {/* Render actual question content */}
//             {type === 'Flashcard' && content && (
//               <div>
//                 <div className="font-semibold">Front:</div>
//                 <div>{content.front}</div>
//                 <div className="font-semibold mt-2">Back:</div>
//                 <div>{content.back}</div>
//               </div>
//             )}
//             {type === 'Multiple Choice Question (MCQ)' && content && (
//               <div>
//                 <div className="font-semibold">Q:</div>
//                 <div>{content.question}</div>
//                 <div className="font-semibold mt-2">Options:</div>
//                 <ul className="list-disc ml-5">
//                   {content.options?.map?.((opt: string, i: number) => (
//                     <li key={i} className={content.correct === i ? "text-teal-600 font-bold" : ""}>
//                       {String.fromCharCode(65 + i)}. {opt}
//                       {content.correct === i && <span className="ml-2 text-xs">(Correct)</span>}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {type === 'Fill-In' && content && (
//               <div>
//                 <div className="font-semibold">Q: {content.question}</div>
//                 {/* <div>{content.question}</div> */}
//                 <div className="font-semibold mt-2">Answer:</div>
//                 <div>{content.answer}</div>
//               </div>
//             )}
//             {/* Fallback if no content */}
//             {!content && (
//               <p className="text-gray-500 text-sm">Question content will appear here</p>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Add button in center bottom */}
//       <button
//         type="button"
//         onClick={onAddQuestion}
//         className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }
// interface CreateQuestionCardProps {
//   questionFields: Array<any>;
//   activeQuestionIndex: number | null;
//   onActivateQuestion: (index: number) => void;
//   onAddNewQuestion: (index: number) => void;
//   onMoveQuestion: (oldIndex: number, newIndex: number) => void;
// }
// export default function CreateQuestionCard({
//   questionFields,
//   activeQuestionIndex,
//   onActivateQuestion,
//   onAddNewQuestion,
//   onMoveQuestion
// }: CreateQuestionCardProps) {
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );
//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = questionFields.findIndex(field => field.id === active.id);
//       const newIndex = questionFields.findIndex(field => field.id === over.id);
//       onMoveQuestion(oldIndex, newIndex);
//     }
//   };
//   return (
//     <div className="max-w-full mx-auto">
//       {questionFields.length > 0 && (
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={questionFields.map(field => field.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             {questionFields.map((field, index) => (
//               <SortableQuestionCard
//                 key={field.id}
//                 id={field.id}
//                 index={index}
//                 type={field.type}
//                 content={field.content} // Pass content here!
//                 isActive={index === activeQuestionIndex}
//                 onActivate={() => onActivateQuestion(index)}
//                 onAddQuestion={() => onAddNewQuestion(index + 1)}
//               />
//             ))}
//           </SortableContext>
//         </DndContext>
//       )}
//     </div>
//   );
// }
import { Control, useController } from 'react-hook-form';
import { RiDeleteBin6Line } from 'react-icons/ri';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { GripVertical } from 'lucide-react';

import { QuestionType, QuizSetData } from './types';

interface CreateQuestionCardProps {
  control: Control<QuizSetData>;
  questionFields: any[];
  activeQuestionIndex: number | null;
  onAddNewQuestion: (index: number) => void;
  onMoveQuestion: (oldIndex: number, newIndex: number) => void;
  removeQuestion: (index: number) => void;
}

export default function CreateQuestionCard({
  control,
  questionFields,
  activeQuestionIndex,
  onAddNewQuestion,
  onMoveQuestion,
  removeQuestion,
}: CreateQuestionCardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questionFields.findIndex((f) => f.id === active.id);
    const newIndex = questionFields.findIndex((f) => f.id === over.id);
    onMoveQuestion(oldIndex, newIndex);
  };

  return (
    <div className="max-w-full mx-auto">
      {questionFields.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questionFields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {questionFields.map((field, index) => (
              <SortableQuestionCard
                key={field.id}
                id={field.id}
                index={index}
                type={field.type}
                control={control}
                name={`questions.${index}.content`}
                onAddQuestion={() => onAddNewQuestion(index + 1)}
                onDeleteQuestion={() => removeQuestion(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

interface SortableQuestionCardProps {
  id: string;
  index: number;
  type: string; // "Flashcard" | "Multiple Choice Question (MCQ)" | "Fill-In"
  control: Control<QuizSetData>;
  name: string;
  onAddQuestion: () => void;
  onDeleteQuestion: () => void;
}

function SortableQuestionCard({
  id,
  index,
  type,
  control,
  name,
  onAddQuestion,
  onDeleteQuestion,
}: SortableQuestionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const { field } = useController({
    name: `questions.${index}.content` as const,
    control,
  });

  const content = field.value || {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="max-w-full mb-8 relative text-gray-500"
    >
      <div className="flex items-center">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-6 w-6" />
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-5 relative">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-black mr-2">
                {index + 1}.
              </span>
            </div>
            <button
              type="button"
              onClick={onDeleteQuestion}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              <RiDeleteBin6Line className="w-5 h-5" />
            </button>
          </div>

          {/* Question content */}
          <div>
            {type === 'Flashcard' && (
              <div className="my-5 flex gap-5">
                {/* Front */}
                <div className="flex flex-col flex-1">
                  <label className="font-semibold mb-1">Front</label>
                  <input
                    {...field}
                    value={content.front || ''}
                    onChange={(e) =>
                      field.onChange({ ...content, front: e.target.value })
                    }
                    placeholder="Enter text here."
                    className="w-full border p-2 rounded-lg"
                  />
                </div>

                {/* Back */}
                <div className="flex flex-col flex-1">
                  <label className="font-semibold mb-1">Back</label>
                  <input
                    value={content.back || ''}
                    onChange={(e) =>
                      field.onChange({ ...content, back: e.target.value })
                    }
                    placeholder="Enter text here."
                    className="w-full border p-2 rounded-lg"
                  />
                </div>
              </div>
            )}

            {type === 'Multiple Choice Question (MCQ)' && (
              <>
                <div className="mb-4">
                  <label className="font-semibold block mb-2">Question</label>
                  <input
                    value={content.question || ''}
                    onChange={(e) =>
                      field.onChange({ ...content, question: e.target.value })
                    }
                    placeholder="Enter text here"
                    className="w-full mb-2 border p-2 rounded-lg focus:outline-gray-500"
                  />
                </div>

                {/* Options */}
                <div className="flex flex-col gap-4">
                  <h1>Options</h1>
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex w-1/2 items-center gap-2">
                        <label className="font-semibold mb-1 block text-gray-500">
                          {String.fromCharCode(65 + i)}
                        </label>
                        <input
                          value={content.options?.[i] || ''}
                          onChange={(e) => {
                            const newOptions = [...(content.options || [])];
                            newOptions[i] = e.target.value;
                            field.onChange({ ...content, options: newOptions });
                          }}
                          placeholder="Enter text here. If blank, the option won't display."
                          className="w-full border p-2 rounded-lg focus:outline-gray-500"
                        />
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
                              field.onChange({ ...content, correct: i });
                            }
                          }}
                          className={`border transition rounded-full flex items-center justify-center w-6 h-6 ${
                            content.correct === i
                              ? 'bg-blue-500 text-white border-blue-500 cursor-pointer'
                              : isDisabled
                                ? 'bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed'
                                : 'bg-gray-100 hover:bg-gray-200 border-gray-300 cursor-pointer'
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

            {type === 'Fill-In' && (
              <div className="my-10">
                <input
                  value={content.question || ''}
                  onChange={(e) =>
                    field.onChange({ ...content, question: e.target.value })
                  }
                  placeholder="Question"
                  className="w-full mb-2 border p-2 rounded"
                />
                <input
                  value={content.answer || ''}
                  onChange={(e) =>
                    field.onChange({ ...content, answer: e.target.value })
                  }
                  placeholder="Answer"
                  className="w-full mb-2 border p-2 rounded"
                />
              </div>
            )}
          </div>

          {/* ✅ Dynamic bottom-right badge */}
          <p className="absolute bottom-0 right-0 bg-green-500 text-white text-sm px-3 py-2 rounded-t-xl rounded-br-lg rounded-r-none">
            {type === 'Multiple Choice Question (MCQ)'
              ? 'MCQ'
              : type === 'Fill-In'
                ? 'Fill-In'
                : type === 'Flashcard'
                  ? 'Flashcard'
                  : ''}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddQuestion}
        className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 shadow-md"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
