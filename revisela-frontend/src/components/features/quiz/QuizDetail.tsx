'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useQuiz, useUpdateQuiz, useBookmarkQuiz, useDeleteQuiz } from '@/services/features/quizzes';
import { useToast } from '@/components/ui/toast/index';
import RichTextEditor from '@/app/dashboard/create-set/_components/RichTextEditor';
// import MediaDisplay from '@/components/ui/quiz/MediaDisplay';
import { ArrowLeft, Bookmark, Copy, FolderSymlink, LockKeyholeOpen, Merge, Pencil, SlidersHorizontal, Trash2 } from 'lucide-react';
import { ActionDropdown } from '@/components/ui';
import { MoveQuizModal } from '@/components/modals/move-quiz-modal';
import { DuplicateQuizModal, ConfirmationModal, QuizManageAccessModal } from '@/components/modals';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

interface QuizDetailProps {
    quizId: string;
    initialEditMode?: boolean;
}

const QuizDetail: React.FC<QuizDetailProps> = ({ quizId, initialEditMode = false }) => {
    const router = useRouter();
    const { toast } = useToast();
    const user = useAppSelector(selectUser);

    const { data: quiz, isLoading, error } = useQuiz(quizId);
    const { mutate: updateQuiz, isPending: isUpdating } = useUpdateQuiz();
    const bookmarkQuiz = useBookmarkQuiz();
    const deleteQuiz = useDeleteQuiz();

    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [isManageAccessModalOpen, setIsManageAccessModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        questions: [] as any[],
    });

    // Initialize form data when quiz loads
    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.title || '',
                description: quiz.description || '',
                tags: quiz.tags?.join(', ') || '',
                questions: quiz.questions ? JSON.parse(JSON.stringify(quiz.questions)) : [],
            });
        }
    }, [quiz]);

    useEffect(() => {
        setIsEditing(initialEditMode);
    }, [initialEditMode]);

    const handleSave = () => {
        updateQuiz(
            {
                quizId,
                data: {
                    title: formData.title,
                    description: formData.description,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                    questions: formData.questions,
                },
            },
            {
                onSuccess: () => {
                    if (!initialEditMode) setIsEditing(false);
                    if (initialEditMode) {
                        router.replace(`/dashboard/${quizId}`);
                    } else {
                        setIsEditing(false);
                    }

                    toast({
                        title: 'Success',
                        description: 'Quiz updated successfully',
                        type: 'success',
                    });
                },
                onError: () => {
                    toast({
                        title: 'Error',
                        description: 'Failed to update quiz',
                        type: 'error',
                    });
                },
            }
        );
    };

    const handleCancel = () => {
        if (quiz) {
            setFormData({
                title: quiz.title || '',
                description: quiz.description || '',
                tags: quiz.tags?.join(', ') || '',
                questions: quiz.questions ? JSON.parse(JSON.stringify(quiz.questions)) : [],
            });
        }
        if (initialEditMode) {
            router.back();
        } else {
            setIsEditing(false);
        }
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updatedQuestions = [...formData.questions];
        const updatedOptions = [...updatedQuestions[qIndex].options];
        updatedOptions[oIndex] = { ...updatedOptions[oIndex], label: value, value: value };
        updatedQuestions[qIndex].options = updatedOptions;

        setFormData({ ...formData, questions: updatedQuestions });
    };

    const pathname = usePathname();
    const handleGoBack = () => router.back();
    const handleRevise = () => {
        if (quizId) router.push(`${pathname}/revise`);
    };

    const handleDelete = () => {
        deleteQuiz.mutate(quizId, {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Quiz deleted successfully',
                    type: 'success',
                });
                router.replace('/dashboard/library');
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to delete quiz',
                    type: 'error',
                });
            }
        });
    };

    if (isLoading)
        return (
            <div className="text-center py-10 text-gray-500">
                Loading quiz details...
            </div>
        );

    if (error || !quiz)
        return (
            <div className="text-center text-red-600 bg-red-50 p-6 rounded-md border border-red-200">
                <p className="font-semibold">Something went wrong.</p>
                <p className="text-sm mt-1">Could not load quiz details.</p>
            </div>
        );

    // Determine access level
    const isOwner = quiz.owner === user?._id || (typeof quiz.owner === 'object' && (quiz.owner as any)?._id === user?._id);

    // Check sharedWith for current user's access level
    // Assuming sharedWith contains objects like { user: string | User, accessLevel: string }
    // Cast to any[] because the interface defines it as string[] but we get populated objects
    const sharedEntry = (quiz.sharedWith as any[])?.find((member: any) =>
        (typeof member.user === 'string' ? member.user === user?._id : member.user?._id === user?._id)
    );
    const accessLevel = isOwner ? 'admin' : (sharedEntry?.accessLevel as string || 'viewer');

    // Define items
    const allItems = [
        {
            label: 'Edit',
            icon: <Pencil size={16} />,
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                setIsEditing(true);
            },
            show: ['admin', 'collaborator'],
        },
        {
            label: 'Duplicate',
            icon: <Copy size={16} />,
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                setIsDuplicateModalOpen(true);
            },
            show: ['admin', 'collaborator', 'member'],
        },
        {
            label: quiz.isBookmarked ? 'Undo Bookmark' : 'Bookmark',
            icon: (
                <Bookmark
                    size={16}
                    className={quiz.isBookmarked ? 'fill-[#444444] text-[#444444]' : 'text-[#444444]'}
                />
            ),
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                bookmarkQuiz.mutate({ quizId, bookmarked: !quiz.isBookmarked });
            },
            show: ['admin', 'collaborator', 'member', 'viewer'],
        },
        {
            label: 'Manage Access',
            icon: <LockKeyholeOpen size={16} />,
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                setIsManageAccessModalOpen(true);
            },
            show: ['admin', 'collaborator'],
        },
        {
            label: 'Move',
            icon: <FolderSymlink size={16} />,
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                setIsMoveModalOpen(true);
            },
            show: ['admin', 'collaborator', 'member'],
        },
        // {
        //     label: 'Merge',
        //     icon: <Merge size={16} />,
        //     onClick: (e: React.MouseEvent) => {
        //         e.stopPropagation();
        //     },
        //     show: ['admin', 'collaborator', 'member'],
        // },
        {
            label: 'Delete',
            icon: <Trash2 size={16} />,
            className: 'text-red-500 font-medium',
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
            },
            show: ['admin', 'collaborator'],
        },
    ];

    const dropdownItems = allItems.filter(item => item.show.includes(accessLevel));

    return (
        <div className="w-full pr-15">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4 ">
                <button
                    onClick={handleGoBack}
                    className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-[#0890A8] text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Go Back
                </button>

                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isUpdating}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isUpdating}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#0890A8] rounded-md hover:bg-teal-600 disabled:opacity-50"
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                className="border border-gray-300 rounded-md h-10 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-[#0890A8]"
                            >
                                <ActionDropdown items={dropdownItems} triggerIcon={<SlidersHorizontal className="h-4 w-4" />} />
                            </button>

                            <button
                                onClick={handleRevise}
                                className="bg-[#0890A8] hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium"
                            >
                                Revise
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quiz Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 ">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        value={isEditing ? formData.title : quiz.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-[#0890A8] bg-white' : 'border-gray-300 bg-gray-50'
                            }`}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={isEditing ? formData.description : quiz.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-[#0890A8] bg-white' : 'border-gray-300 bg-gray-50'
                            }`}
                        rows={3}
                    />
                </div>

                {(quiz?.tags?.length ?? 0) > 0 || isEditing ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags {isEditing && <span className="text-gray-500 font-normal text-xs">(comma separated)</span>}
                        </label>
                        <input
                            type="text"
                            value={isEditing ? formData.tags : quiz.tags?.join(', ') ?? ''}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-[#0890A8] bg-white' : 'border-gray-300 bg-gray-50'
                                }`}
                        />
                    </div>
                ) : null}
            </div>

            {/* Questions */}
            <div className="space-y-4">
                {(isEditing ? formData.questions : quiz.questions)?.length > 0 ? (
                    (isEditing ? formData.questions : quiz.questions).map((q: any, idx: number) => {
                        const type = q.type?.toLowerCase() || 'mcq';
                        const typeLabel =
                            type === 'mcq'
                                ? 'MCQ'
                                : type === 'fillin'
                                    ? 'Fill-In'
                                    : type === 'flashcard'
                                        ? 'Flashcard'
                                        : '';

                        return (
                            <div
                                key={q._id || q.id || idx}
                                className="px-4 py-10 border border-gray-200 rounded-lg bg-white relative"
                            >
                                {/* Question number */}
                                <p className="font-medium mb-2">{idx + 1}.</p>

                                {/* Flashcard */}
                                {type === 'flashcard' && (
                                    <div className="my-8 flex gap-5">
                                        <div className="flex flex-col flex-1 ">
                                            <label className="font-semibold mb-1">Front</label>
                                            <div className="flex items-center justify-center gap-2">
                                                {isEditing ? (
                                                    <RichTextEditor
                                                        value={q.question || ''}
                                                        onChange={(val) => handleQuestionChange(idx, 'question', val)}
                                                        className="w-full rounded-lg bg-white min-h-[42px] p-3"
                                                    />
                                                ) : (
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: q.question || 'No content' }}
                                                        className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 cursor-not-allowed min-h-[42px]"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <label className="font-semibold mb-1">Back</label>
                                            {isEditing ? (
                                                <RichTextEditor
                                                    value={q.answer || ''}
                                                    onChange={(val) => handleQuestionChange(idx, 'answer', val)}
                                                    className="w-full rounded-lg bg-white min-h-[42px] p-3"
                                                />
                                            ) : (
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: q.answer || 'No content' }}
                                                    className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 cursor-not-allowed min-h-[42px]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* MCQ */}
                                {type === 'mcq' && (
                                    <div className="my-4">
                                        <div className="mb-4">
                                            <label className="block mb-2 font-semibold">
                                                Question
                                            </label>
                                            <div className="my-2 flex gap-2">
                                                {isEditing ? (
                                                    <RichTextEditor
                                                        value={q.question || ''}
                                                        onChange={(val) => handleQuestionChange(idx, 'question', val)}
                                                        className="w-full rounded-lg bg-white min-h-[42px] p-3"
                                                    />
                                                ) : (
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: q.question || 'Enter text here' }}
                                                        className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 cursor-not-allowed min-h-[42px]"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <h1 className="mb-2 font-semibold">Options</h1>
                                            {q.options?.map((option: any, i: number) => (
                                                <div
                                                    key={option._id || i}
                                                    className="flex items-start gap-2 w-full " // same width for all options
                                                >
                                                    {/* Option input */}
                                                    <div className="w-full max-w-md ">
                                                        <div className="flex items-center gap-2">
                                                            <label className="mb-1 block text-gray-500">
                                                                {String.fromCharCode(65 + i)}.
                                                            </label>
                                                            <input
                                                                value={option.label || ''}
                                                                onChange={(e) => isEditing && handleOptionChange(idx, i, e.target.value)}
                                                                readOnly={!isEditing}
                                                                className={`w-full border border-gray-300 p-2 rounded-lg ${isEditing ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'} text-gray-700`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Correct answer visually */}
                                        <div className="my-4 flex gap-2 items-center">
                                            <p className="mb-0 font-medium">Correct Option:</p>
                                            <div className="flex gap-2">
                                                {q.options?.map((option: any, i: number) => {
                                                    const isCorrect = option.value === q.answer;
                                                    const label = String.fromCharCode(65 + i);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`transition rounded-full flex items-center justify-center w-6 h-6 ${isCorrect
                                                                ? 'border-2 border-green-500'
                                                                : 'border border-gray-300 text-gray-500'
                                                                }`}
                                                            style={{ aspectRatio: '1 / 1' }}
                                                        // For now not editing correct answer selection to avoid complexity
                                                        >
                                                            {label}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fill-In */}
                                {type === 'fillin' && (
                                    <div className="my-2 flex flex-col gap-2">
                                        <label className="font-medium">Question</label>
                                        <div className="my-2 flex gap-2">
                                            {isEditing ? (
                                                <RichTextEditor
                                                    value={q.question || ''}
                                                    onChange={(val) => handleQuestionChange(idx, 'question', val)}
                                                    className="w-full rounded-lg bg-white min-h-[42px] p-3"
                                                />
                                            ) : (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: q.question
                                                            ? q.question.replace(/_+/g, `??${q.answer}??`) + ' ?'
                                                            : 'No question'
                                                    }}
                                                    className="w-full border border-gray-300 p-2 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed min-h-[42px]"
                                                />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Note: To create the blank, wrap the word with 2 question
                                            marks without leaving any spaces. Eg: ??WORD?? You can
                                            only create one fill-in per question
                                        </p>
                                    </div>
                                )}

                                {/* Type badge */}
                                <p
                                    className={`absolute bottom-0 right-0 text-black text-sm px-3 py-2 rounded-t-xl rounded-br-lg rounded-r-none ${type === 'mcq'
                                        ? 'bg-[#ADF5C6]'
                                        : type === 'fillin'
                                            ? 'bg-[#FFCDFD]'
                                            : type === 'flashcard'
                                                ? 'bg-[#FFCE94]'
                                                : 'bg-gray-500'
                                        }`}
                                >
                                    {typeLabel}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg text-gray-500">
                        <p>No questions have been added to this quiz yet.</p>
                    </div>
                )}
            </div>

            <div className="w-full flex justify-around items-center my-10">
                <button
                    onClick={handleRevise}
                    className="bg-[#0890A8] hover:bg-teal-600 text-white rounded-md px-4 py-2 text-sm font-medium"
                >
                    Revise
                </button>
            </div>

            {/* Modals */}
            <MoveQuizModal
                isOpen={isMoveModalOpen}
                onOpenChange={setIsMoveModalOpen}
                quizId={quizId}
                quizTitle={quiz.title}
                onSuccess={() => {
                    router.replace('/dashboard/library');
                }}
            />

            <DuplicateQuizModal
                isOpen={isDuplicateModalOpen}
                onOpenChange={setIsDuplicateModalOpen}
                quizId={quizId}
                quizTitle={quiz.title}
                onSuccess={() => {
                    // refresh logic handled by mutation invalidation
                }}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="Delete Quiz"
                description="Are you sure you want to delete this quiz? This action cannot be undone."
                confirmText="Delete"
                confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
                onConfirm={handleDelete}
                isLoading={deleteQuiz.isPending}
            />

            {user && (
                <QuizManageAccessModal
                    isOpen={isManageAccessModalOpen}
                    onOpenChange={setIsManageAccessModalOpen}
                    quizId={quizId}
                    currentUserId={user._id || ''}
                    owner={
                        isOwner
                            ? {
                                _id: user._id,
                                name: user.name || 'Me',
                                email: user.email,
                                avatar: user.profileImage,
                            }
                            : {
                                _id: typeof quiz.owner === 'object' ? (quiz.owner as any)._id : quiz.owner,
                                name: typeof quiz.owner === 'object' ? (quiz.owner as any).name : 'Unknown',
                                email: typeof quiz.owner === 'object' ? (quiz.owner as any).email : '',
                                avatar: typeof quiz.owner === 'object' ? (quiz.owner as any).profileImage : undefined,
                            }
                    }
                    members={(quiz.sharedWith || []).map((share: any) => {
                        const memberUser = typeof share.user === 'object' ? share.user : {};
                        return {
                            _id: memberUser._id || share.user, // Fallback to ID if not populated
                            name: memberUser.name || 'Unknown',
                            email: memberUser.email || '',
                            avatar: memberUser.profileImage,
                            role: share.accessLevel === 'admin' ? 'collaborator' : share.accessLevel
                        };
                    })}
                    publicAccess={quiz.publicAccess === 'public' ? 'public' : 'restricted'}
                    userAccessLevel={accessLevel as any}
                />
            )}
        </div>
    );
};

export default QuizDetail;
