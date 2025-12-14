'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { FolderExplorer, FolderProvider } from '@/components/ui/folder';
import ContentSection from '@/components/ui/folder/ContentSection';
import { ROUTES } from '@/constants/routes';
import { useClass } from '@/services/features/classes';
import { useAppSelector } from '@/store';

export default function ClassFolderPage() {
    const params = useParams();
    const classId = Array.isArray(params.classId) ? params.classId[0] : params.classId;
    const folderId = Array.isArray(params.folderId) ? params.folderId[0] : params.folderId;

    const { data: classData, isLoading } = useClass(classId || '');

    if (!classId) return null;

    const { user } = useAppSelector((state) => state.auth);
    const currentUserId = user?.id || '';

    // Root path for this specific class's folder hierarchy
    const rootPath = `${ROUTES.DASHBOARD.CLASSES.ROOT}/${classId}/folders`;

    // Calculate permissions robustly
    const ownerId = typeof classData?.owner === 'object' ? classData?.owner?._id : classData?.owner;

    // Check ownership
    const isOwner =
        classData?.userAccessLevel === 'owner' ||
        (ownerId && currentUserId && ownerId.toString() === currentUserId.toString());

    // Check collaborator
    const isCollaborator =
        classData?.userAccessLevel === 'collaborator' ||
        (classData?.members?.some((m: any) => {
            const mId = m.user?._id || m.user || '';
            return mId.toString() === currentUserId.toString() && m.accessLevel === 'collaborator';
        }));

    const canManage = isOwner || isCollaborator;

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
                isClass={!canManage} // ✅ Only restrict for members
                renderContent={(currentFolderId) => (
                    <ContentSection
                        currentFolderId={currentFolderId}
                        parentRoute={`${ROUTES.DASHBOARD.CLASSES.ROOT}/${classId}/quizzes`}
                        isClass={!canManage} // ✅ Only restrict for members
                    />
                )}
            />
        </FolderProvider>
    );
}
