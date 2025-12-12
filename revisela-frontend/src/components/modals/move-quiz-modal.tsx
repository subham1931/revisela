'use client';

import React, { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Folder, FolderClosed, FolderSymlink, Users } from 'lucide-react';

import { useMoveQuiz } from '@/services/features/quizzes';
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
}: {
    onFolderClick: (id: string, name: string) => void;
    className?: string;
    quizTitle: string;
}) => {
    const {
        currentFolderId,
        folders,
        subFolders,
        isLoading,
        folderDetailsLoading,
        breadcrumbs,
        navigateToFolder,
    } = useFolderSystem();

    const handleFolderClick = useCallback(
        (id: string, name: string) => {
            onFolderClick(id, name);
            navigateToFolder(id, name);
        },
        [navigateToFolder, onFolderClick]
    );

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
                        onClick={() => navigateToFolder(undefined, 'My Library')}
                        className={`hover:text-teal-600 ${breadcrumbs.length === 0 ? 'font-medium text-teal-700' : ''}`}
                    >
                        My Library
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
   MOVE QUIZ CONTENT
   -------------------------------------------------------------------------- */
const MoveQuizContent = ({
    quizId,
    quizTitle,
    onOpenChange,
    onSuccess,
}: {
    quizId: string;
    quizTitle: string;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}) => {
    const { toast } = useToast();
    const moveQuiz = useMoveQuiz();
    // We can track the current folder from explorer if needed, but we rely on selection

    const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
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

        // console.log('Moving quiz to folder:', selectedFolderId);
    };

    return (
        <div className="py-3">
            <div className="mb-4 p-4">
                <QuizMoveFolderExplorer
                    onFolderClick={handleFolderClick}
                    className="h-[350px] overflow-y-auto"
                    quizTitle={quizTitle}
                />

                <div className="mt-2 text-sm text-gray-500">
                    <p>Navigate to and click the folder you want to move this quiz into.</p>
                </div>
            </div>

            <div className="flex justify-end w-full mt-4">
                <Button
                    disabled={!selectedFolderId}
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
        const [mode, setMode] = useState<'selectRoot' | 'library'>('selectRoot');

        const handleOpenChange = (open: boolean) => {
            if (!open) setMode('selectRoot');
            onOpenChange(open);
        };

        if (mode === 'selectRoot') {
            return (
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

                        <div className="flex flex-col ">
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
                        </div>
                    </div>
                </Modal>
            );
        }

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
                        />
                    </FolderProvider>
                </Modal>
            );
        }

        return null;
    };
