'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { FolderExplorer, FolderProvider } from '@/components/ui/folder';
import ContentSection from '@/components/ui/folder/ContentSection';
import { ROUTES } from '@/constants/routes';
import { useClass } from '@/services/features/classes';

export default function ClassFolderPage() {
    const params = useParams();
    const classId = Array.isArray(params.classId) ? params.classId[0] : params.classId;
    const folderId = Array.isArray(params.folderId) ? params.folderId[0] : params.folderId;

    const { data: classData, isLoading } = useClass(classId || '');

    if (!classId) return null;

    // Root path for this specific class's folder hierarchy
    const rootPath = `${ROUTES.DASHBOARD.CLASSES.ROOT}/${classId}/folders`;

    return (
        <FolderProvider
            initialFolderId={folderId}
            rootName="Class Folders"
            rootPath={rootPath}
            rootRedirectPath={`${ROUTES.DASHBOARD.CLASSES.ROOT}/${classId}`}
            usePathRouting={true} // Enable path-based routing
            customFolders={classData?.folders || []}
            customIsLoading={isLoading}
        >
            <FolderExplorer
                title="Folders"
                renderContent={(currentFolderId) => (
                    <ContentSection
                        currentFolderId={currentFolderId}
                        parentRoute={`${ROUTES.DASHBOARD.CLASSES.ROOT}/${classId}/quizzes`}
                    />
                )}
            />
        </FolderProvider>
    );
}
