'use client';

import React, { useCallback, useState, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Folder, FolderClosed, FolderSymlink, GraduationCap, Users, Loader2 } from 'lucide-react';

import { useMoveQuiz } from '@/services/features/quizzes';
import { useMyClasses, useClass, useAddQuizToClass } from '@/services/features/classes';
import { Button, Modal } from '@/components/ui';
import { FolderProvider, useFolderSystem } from '@/components/ui/folder';
import { useToast } from '@/components/ui/toast/index';

/* --------------------------------------------------------------------------
   FILTERED FOLDER EXPLORER (Adapted for Quiz)
   -------------------------------------------------------------------------- */
const QuizMoveFolderExplorer = ({
    onFolderClick,
    className,
    quizTitle,
    onNavigateToRoot,
}: {
    onFolderClick: (id: string, name: string) => void;
    className?: string;
    quizTitle: string;
    onNavigateToRoot?: () => void;
}) => {
    const {
        currentFolderId,
        folders,
        subFolders,
        isLoading,
        folderDetailsLoading,
        breadcrumbs,
        navigateToFolder,
        rootName
    } = useFolderSystem();

    const handleFolderClick = useCallback(
        (id: string, name: string) => {
            onFolderClick(id, name);
            navigateToFolder(id, name);
        },
        [navigateToFolder, onFolderClick]
    );

    const handleRootClick = () => {
        if (onNavigateToRoot) {
            onNavigateToRoot();
        } else {
            navigateToFolder(undefined, rootName);
        }
    }

    // For quizzes, we don't need to filter out the quizId (unlike folders moving into themselves).
    const displayedFolders = currentFolderId ? subFolders : folders;
    const isLoadingFolders = currentFolderId ? folderDetailsLoading : isLoading;

    return (
        <div className={className}>

            {/* ---------- Title + Breadcrumbs ---------- */}
            <div className="flex flex-col mb-4">

                {/* Title */}
                <div className="flex items-center text-sm text-gray-600">
                    <p className="text-md font-bold text-black mr-2">
                        Move “{quizTitle}” to:
                    </p>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center mt-2 text-sm text-gray-600">
                    <button
                        onClick={handleRootClick}
                        className={`hover:text-teal-600 ${breadcrumbs.length === 0 ? 'font-medium text-teal-700' : ''}`}
                    >
                        {rootName}
                    </button>

                    {breadcrumbs.length > 0 && <span className="mx-1 text-gray-400">{'>'}</span>}

                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <span className="mx-1 text-gray-400">{'>'}</span>}
                            <button
                                onClick={() =>
                                    navigateToFolder(crumb.id || undefined, crumb.name)
                                }
                                className={`hover:text-teal-600 ${index === breadcrumbs.length - 1
                                    ? 'font-medium text-teal-700'
                                    : ''
                                    }`}
                            >
                                {crumb.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ---------- Folder List ---------- */}
            <div className="overflow-hidden">
                {isLoadingFolders ? (
                    <div className="p-6 text-center text-gray-500">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                        </div>
                    </div>
                ) : displayedFolders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
                        {displayedFolders.map((folder) => (
                            <div
                                key={folder._id}
                                className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer border rounded-md min-w-[200px]"
                                onClick={() => handleFolderClick(folder._id, folder.name)}
                            >
                                <div className="flex items-center gap-2">
                                    <Folder size={20} className="text-teal-500" />
                                    <span className="font-medium truncate">{folder.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        <p className="text-sm">
                            {currentFolderId ? 'This folder is empty' : 'No folders available'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


/* --------------------------------------------------------------------------
   CLASS EXPLORER
   -------------------------------------------------------------------------- */
const ClassExplorer = ({
    onClassClick,
    className,
}: {
    onClassClick: (id: string, name: string) => void;
    className?: string;
}) => {
    const { data: classes, isLoading } = useMyClasses();

    return (
        <div className={className}>
            <div className="flex flex-col mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <p className="text-md font-bold text-black mr-2">
                        Select a Class:
                    </p>
                </div>
            </div>

            <div className="overflow-hidden">
                {isLoading ? (
                    <div className="p-6 text-center text-gray-500">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                        </div>
                    </div>
                ) : (classes?.length ?? 0) > 0 ? (
                    <div className="flex flex-col gap-2 p-2">
                        {classes?.map((cls) => (
                            <div
                                key={cls._id}
                                className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer border rounded-md"
                                onClick={() => onClassClick(cls._id, cls.name)}
                            >
                                <div className="flex items-center gap-2">
                                    <GraduationCap size={20} className="text-teal-500" />
                                    <span className="font-medium truncate">{cls.name}</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-400" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        <p className="text-sm">No classes found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* --------------------------------------------------------------------------
   CLASS CONTENT (Display folders in a class)
   -------------------------------------------------------------------------- */
const ClassContent = ({
    quizId,
    quizTitle,
    classId,
    className,
    classNameString,
    onOpenChange,
    onSuccess,
    onNavigateToFolder
}: {
    quizId: string;
    quizTitle: string;
    classId: string;
    className?: string; // CSS className
    classNameString: string; // The Name of the class
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    onNavigateToFolder: (folderId: string, folderName: string) => void;
}) => {
    // 1. Fetch class details to get folders
    const { data: classData, isLoading } = useClass(classId);
    const { toast } = useToast();
    const addQuizToClass = useAddQuizToClass();

    // The folders at the class root
    const rootFolders = classData?.folders || [];

    const handleMoveToClassRoot = () => {
        addQuizToClass.mutate({ classId, quizId }, {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: `Quiz moved to class "${classNameString}"`,
                    type: 'success',
                });
                onOpenChange(false);
                onSuccess?.();
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to move quiz to class',
                    type: 'error',
                });
            }
        })
    }

    return (
        <div className="py-3">
            <div className="mb-4 p-4">
                <div className={className}>
                    {/* Title + Breadcrumbs */}
                    <div className="flex flex-col mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                            <p className="text-md font-bold text-black mr-2">
                                Move “{quizTitle}” to:
                            </p>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                            <span className="font-medium text-teal-700">{classNameString}</span>
                        </div>
                    </div>

                    {/* Folder List */}
                    <div className="overflow-hidden h-[300px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-6 text-center text-gray-500">Loading class details...</div>
                        ) : rootFolders.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
                                {rootFolders.map((folder: any) => (
                                    <div
                                        key={folder._id}
                                        className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer border rounded-md min-w-[200px]"
                                        onClick={() => onNavigateToFolder(folder._id, folder.name)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Folder size={20} className="text-teal-500" />
                                            <span className="font-medium truncate">{folder.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                <p className="text-sm">No folders in this class</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    <p>Click "Move Here" to add to the class root, or select a folder.</p>
                </div>
            </div>

            <div className="flex justify-end w-full mt-4">
                <Button
                    onClick={handleMoveToClassRoot}
                    disabled={addQuizToClass.isPending}
                    className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1"
                >
                    {addQuizToClass.isPending ? 'Moving...' : 'Move Here'}
                </Button>
            </div>
        </div>
    )
}


/* --------------------------------------------------------------------------
   MOVE QUIZ CONTENT (Using Folder Provider)
   -------------------------------------------------------------------------- */
const MoveQuizContent = ({
    quizId,
    quizTitle,
    onOpenChange,
    onSuccess,
    initialFolderId, // Optional: if provided, starts at this folder (e.g. inside a class)
    contextName, // e.g. "My Library" or "Math Class"
    onNavigateToRoot,
}: {
    quizId: string;
    quizTitle: string;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    initialFolderId?: string;
    contextName?: string;
    onNavigateToRoot?: () => void;
}) => {
    const { toast } = useToast();
    const moveQuiz = useMoveQuiz();

    const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(initialFolderId);
    const [selectedFolderName, setSelectedFolderName] = useState<string>('');

    const handleFolderClick = useCallback(
        (id: string, name: string) => {
            setSelectedFolderId(id);
            setSelectedFolderName(name);
        },
        []
    );

    const handleMove = () => {
        if (!selectedFolderId) return;

        moveQuiz.mutate(
            { quizId, targetFolderId: selectedFolderId },
            {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: `Quiz moved to "${selectedFolderName}"`,
                        type: 'success',
                    });
                    onOpenChange(false);
                    onSuccess?.();
                },
            }
        );
    };

    return (
        <div className="py-3">
            <div className="mb-4 p-4">
                <QuizMoveFolderExplorer
                    onFolderClick={handleFolderClick}
                    className="h-[350px] overflow-y-auto"
                    quizTitle={quizTitle}
                    onNavigateToRoot={onNavigateToRoot}
                />

                <div className="mt-2 text-sm text-gray-500">
                    <p>Navigate to and click the folder you want to move this quiz into.</p>
                </div>
            </div>

            <div className="flex justify-end w-full mt-4">
                <Button
                    disabled={!selectedFolderId || selectedFolderId === initialFolderId} // If inside folder, wait for explicit selection or logic TBD (for now allow move if clicked)
                    onClick={handleMove}
                    className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1"
                >
                    Move Here
                </Button>
            </div>
        </div>
    );
};


/* --------------------------------------------------------------------------
   OUTER TWO‑STEP MODAL
   -------------------------------------------------------------------------- */
import { useQuiz } from '@/services/features/quizzes';
import { useAppSelector } from '@/store';
import { selectUser } from '@/store/slices/authSlice';

export const MoveQuizModal: React.FC<{
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    quizId: string;
    quizTitle?: string;
    onSuccess?: () => void;
}> = ({
    isOpen,
    onOpenChange,
    quizId,
    quizTitle = 'Quiz',
    onSuccess,
}) => {
        // Modes: root -> library | (removed classes intermediate) -> class-detail (root folders) -> class-folder (deep drill)
        // We removed 'classes' mode as we list them directly
        const [mode, setMode] = useState<'selectRoot' | 'library' | 'class-detail' | 'class-folder'>('selectRoot');

        // State for Class Navigation
        const [selectedClass, setSelectedClass] = useState<{ id: string; name: string } | null>(null);
        const [selectedClassFolder, setSelectedClassFolder] = useState<{ id: string; name: string } | null>(null);

        // Fetch classes for the root view
        const { data: classes, isLoading: isLoadingClasses } = useMyClasses(); // Still fetch, but conditionally show

        // RBAC Checks
        const user = useAppSelector(selectUser);
        const userId = user?.id || user?._id;
        const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId);

        // Handle both 'owner' (folders/some quizzes) and 'createdBy' (quizzes)
        const effectiveOwnerId = quiz?.owner
            ? (typeof quiz.owner === 'object' ? (quiz.owner as any)._id : quiz.owner)
            : (quiz?.createdBy && typeof quiz.createdBy === 'object' ? quiz.createdBy._id : quiz?.createdBy);

        const isOwner = effectiveOwnerId === userId;

        const sharedEntry = (quiz?.sharedWith as any[])?.find((member: any) =>
            (typeof member.user === 'string' ? member.user === userId : member.user?._id === userId)
        );
        const accessLevel = isOwner ? 'admin' : (sharedEntry?.accessLevel as string || 'viewer');
        const canShareToClass = ['admin', 'collaborator'].includes(accessLevel);

        const handleOpenChange = (open: boolean) => {
            if (!open) {
                // Reset state on close
                setTimeout(() => {
                    setMode('selectRoot');
                    setSelectedClass(null);
                    setSelectedClassFolder(null);
                }, 200);
            }
            onOpenChange(open);
        };

        const handleNavigateToClassFolder = (folderId: string, folderName: string) => {
            setSelectedClassFolder({ id: folderId, name: folderName });
            setMode('class-folder');
        };

        /* ----------------------- RENDER HELPERS ----------------------- */
        const renderSelectRoot = () => (
            <Modal
                isOpen={isOpen}
                onOpenChange={handleOpenChange}
                title="Move Quiz"
                icon={<FolderSymlink size={20} />}
                contentClassName="max-w-sm"
                showCloseButton
            >
                <div className="my-2">
                    <p className="text-md font-bold text-black mb-3">
                        Move “{quizTitle}” to:
                    </p>

                    <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
                        {/* My Library */}
                        <button
                            onClick={() => setMode('library')}
                            className="group flex items-center justify-between px-3 py-3 hover:bg-[#ACACAC33]/20 rounded transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <FolderClosed
                                    size={18}
                                    className="text-black group-hover:text-[#0890A8] transition-colors"
                                />
                                <span className="font-medium text-black group-hover:text-[#0890A8] transition-colors">
                                    My Library
                                </span>
                            </div>
                            <ArrowRight
                                size={18}
                                className="text-gray-400 group-hover:text-[#0890A8] transition-colors"
                            />
                        </button>

                        {/* Shared With Me (disabled) */}
                        <button
                            disabled
                            className="group flex items-center justify-between px-3 py-3 text-black rounded hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-2">
                                <Users
                                    size={18}
                                    className="text-black group-hover:text-[#0890A8] transition-colors"
                                />
                                <span className="font-medium text-black group-hover:text-[#0890A8] transition-colors">
                                    Shared With Me
                                </span>
                            </div>
                            <ArrowRight
                                size={18}
                                className="text-gray-400 group-hover:text-[#0890A8] transition-colors"
                            />
                        </button>

                        {/* Permission Check / Loading State */}
                        {isLoadingQuiz && (
                            <div className="p-4 text-center text-xs text-gray-400">
                                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                Checking permissions...
                            </div>
                        )}

                        {!isLoadingQuiz && !canShareToClass && (
                            <div className="px-3 py-2 text-xs text-red-400 italic text-center">
                                You need Admin or Collaborator access to move this to a class.
                            </div>
                        )}

                        {canShareToClass && !isLoadingClasses && classes?.map(cls => (
                            <button
                                key={cls._id}
                                onClick={() => {
                                    setSelectedClass({ id: cls._id, name: cls.name });
                                    setMode('class-detail');
                                }}
                                className="group flex items-center justify-between px-3 py-3 hover:bg-[#ACACAC33]/20 rounded transition-colors disabled:opacity-50"
                            >
                                <div className="flex items-center gap-2">
                                    <GraduationCap
                                        size={18}
                                        className="text-black group-hover:text-[#0890A8] transition-colors"
                                    />
                                    <span className="font-medium text-black group-hover:text-[#0890A8] transition-colors truncate max-w-[200px]">
                                        {cls.name}
                                    </span>
                                </div>
                                <ArrowRight
                                    size={18}
                                    className="text-gray-400 group-hover:text-[#0890A8] transition-colors"
                                />
                            </button>
                        ))}

                        {canShareToClass && isLoadingClasses && <div className="p-4 text-center text-xs text-gray-400">Loading classes...</div>}
                        {canShareToClass && !isLoadingClasses && (!classes || classes.length === 0) && (
                            <div className="px-3 py-2 text-sm text-gray-400 italic">No classes found</div>
                        )}




                    </div>
                </div>
            </Modal>
        );

        if (mode === 'selectRoot') return renderSelectRoot();

        if (mode === 'library') {
            return (
                <Modal
                    isOpen={isOpen}
                    onOpenChange={handleOpenChange}
                    title="Move Quiz"
                    icon={<FolderSymlink size={20} />}
                    contentClassName="max-w-3xl"
                    showCloseButton
                >
                    <FolderProvider rootName="My Library" rootPath="/folders" enableRouting={false}>
                        <MoveQuizContent
                            quizId={quizId}
                            quizTitle={quizTitle}
                            onOpenChange={onOpenChange}
                            onSuccess={onSuccess}
                            contextName="My Library"
                        />
                    </FolderProvider>
                </Modal>
            );
        }

        if (mode === 'class-detail' && selectedClass) {
            return (
                <Modal
                    isOpen={isOpen}
                    onOpenChange={handleOpenChange}
                    title="Move Quiz"
                    icon={<FolderSymlink size={20} />}
                    contentClassName="max-w-3xl"
                    showCloseButton
                >
                    <ClassContent
                        quizId={quizId}
                        quizTitle={quizTitle}
                        classId={selectedClass.id}
                        classNameString={selectedClass.name}
                        onOpenChange={onOpenChange}
                        onSuccess={onSuccess}
                        onNavigateToFolder={handleNavigateToClassFolder}
                    />
                </Modal>
            )
        }

        if (mode === 'class-folder' && selectedClass && selectedClassFolder) {
            return (
                <Modal
                    isOpen={isOpen}
                    onOpenChange={handleOpenChange}
                    title="Move Quiz"
                    icon={<FolderSymlink size={20} />}
                    contentClassName="max-w-3xl"
                    showCloseButton
                >
                    {/* We provide the 'Root' as the Class Name, but we initialize with the specific Root Folder of that class or the subfolder selected */}
                    {/* Note: `rootPath` is arbitrary here since we disabled routing */}
                    <FolderProvider
                        rootName={selectedClass.name}
                        rootPath={`/classes/${selectedClass.id}`}
                        initialFolderId={selectedClassFolder.id}
                        enableRouting={false}
                    >
                        <MoveQuizContent
                            quizId={quizId}
                            quizTitle={quizTitle}
                            onOpenChange={onOpenChange}
                            onSuccess={onSuccess}
                            contextName={selectedClass.name}
                            initialFolderId={selectedClassFolder.id}
                            onNavigateToRoot={() => setMode('class-detail')}
                        />
                    </FolderProvider>
                </Modal>
            )
        }

        return null;
    };

