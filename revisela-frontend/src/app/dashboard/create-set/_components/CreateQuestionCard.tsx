// CreateQuestionCard.tsx
import { Control } from 'react-hook-form';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { QuizSetData } from './types';
import SortableQuestionCard from './SortableQuestionCard';

interface CreateQuestionCardProps {
  control: Control<QuizSetData>;
  questionFields: any[];
  activeQuestionIndex: number | null;
  onAddNewQuestion: (index: number) => void;
  onMoveQuestion: (oldIndex: number, newIndex: number) => void;
  removeQuestion: (index: number) => void;
  selectorCount: number;
  onTypeSelected: () => void;
}

export default function CreateQuestionCard({
  control,
  questionFields,
  activeQuestionIndex,
  onAddNewQuestion,
  onMoveQuestion,
  removeQuestion,
  selectorCount,
  onTypeSelected,
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
                onAddQuestion={() => onAddNewQuestion(index + 1)}
                onDeleteQuestion={() => removeQuestion(index)}
                totalQuestions={questionFields.length}
                selectorCount={selectorCount}
                onTypeSelected={onTypeSelected}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
