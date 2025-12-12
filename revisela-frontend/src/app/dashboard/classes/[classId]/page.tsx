'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
  Bookmark,
  Folder,
  Link,
  Lock,
  LogOut,
  Pen,
  SlidersHorizontal,
  Trash2,
  University,
} from 'lucide-react';

import {
  useClass,
  useDeleteClass,
  useLeaveClass,
  useRemoveClassMember,
  useUpdateMemberAccess,
} from '@/services/features/classes';

import { ConfirmationModal, ManageAccessModal } from '@/components/modals';
import { ActionDropdown, Button } from '@/components/ui';
import { FolderItem } from '@/components/ui/folder';
import { ContentLoader } from '@/components/ui/loaders';
import QuizCard from '@/components/ui/quiz/QuizCard';
import { useToast } from '@/components/ui/toast/index';

import { ROUTES } from '@/constants/routes';

import MemberGrid from '../components/MemberGrid';

export default function ClassPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const classId = params.classId as string;
  const deleteClassMutation = useDeleteClass();
  const removeMemberMutation = useRemoveClassMember();
  const { mutate: updateAccess } = useUpdateMemberAccess();
  const { mutate: leaveClass, isPending: isLeaving } = useLeaveClass();

  const [activeTab, setActiveTab] = useState<'Resources' | 'Members'>(
    'Resources'
  );
  const [folders, setFolders] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [isManageAccessModalOpen, setIsManageAccessModalOpen] = useState(false);

  const {
    data: classData,
    isLoading: loadingClass,
    error: classError,
  } = useClass(classId);

  // 🔥 updated — now use `classData?.userAccessLevel` directly
  const userAccessLevel = classData?.userAccessLevel as
    | 'owner'
    | 'collaborator'
    | 'member'
    | 'none'
    | undefined; // 🔥 updated

  const isOwner = userAccessLevel === 'owner'; // 🔥 updated
  const isCollaborator = userAccessLevel === 'collaborator'; // 🔥 updated
  const isMember = userAccessLevel === 'member'; // 🔥 updated

  const currentUserId = classData?.currentUserId || 'current-user-id';
  const classLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard/classes/${classId}`
      : ''; // 🔥 updated (safe SSR guard)

  useEffect(() => {
    if (classData) {
      setFolders(classData.folders || []);
      setQuizzes(classData.quizzes || []);
    }
  }, [classData]);

  const handleBack = () => router.push(ROUTES.DASHBOARD.CLASSES.ROOT);

  const handleDeleteClass = () => {
    console.log('Delete button clicked');
    setDeleteModalOpen(true);
  };

  const handleLeaveClass = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLeaveModalOpen(true);
  };

  const handleRemoveMember = (userId: string) => {
    removeMemberMutation.mutate(
      { classId, userId },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Member removed successfully',
            type: 'success',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to remove member',
            type: 'error',
          });
        },
      }
    );
  };

  const handleManageAccess = (userId: string, action: string) => {
    const normalized = action.toLowerCase();

    if (normalized === 'remove access') {
      handleRemoveMember(userId);
    } else if (normalized === 'transfer ownership') {
      updateAccess({ classId, userId, accessLevel: 'owner' }); // 🔥 updated (use correct access level)
      toast({
        title: 'Ownership Transferred',
        description: 'Member is now owner',
        type: 'success',
      });
    } else {
      updateAccess({
        classId,
        userId,
        accessLevel: normalized as 'collaborator' | 'member',
      });
      toast({
        title: 'Role Updated',
        description: `Member role changed to ${action}`,
        type: 'success',
      });
    }
  };

  if (loadingClass) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ContentLoader
          message="Loading class details..."
          size="lg"
          variant="primary"
        />
      </div>
    );
  }

  if (classError || !classData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load class</p>
          <p className="text-sm text-gray-500">
            Class not found or you don't have access
          </p>
          <Button onClick={handleBack} className="mt-4" variant="outline">
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between p-4 rounded">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-[#058F3A]">
              {classData.name}
            </h1>
            {classData.orgName && (
              <div className="flex items-center gap-2 mt-2">
                <University size={20} />
                <span className="text-gray-700">{classData.orgName}</span>
              </div>
            )}
            {classData.description && (
              <p className="text-gray-600 mt-2">{classData.description}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {classData.classCode && (
              <span
                className="text-[#444444] px-3 py-1 rounded-full cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(classData.classCode);
                  toast({
                    title: 'Copied to clipboard!',
                    description: classData.classCode,
                  });
                }}
              >
                #{classData.classCode}
              </span>
            )}

            {/* 🔥 updated: show “Manage Access” only if owner or collaborator */}
            <ActionDropdown
              items={[
                // Only owners or collaborators can edit or manage access
                ...(isOwner || isCollaborator
                  ? [
                    {
                      label: 'Edit Class',
                      icon: <Pen size={16} />,
                      onClick: () => {
                        // TODO: Implement edit class functionality
                        toast({
                          title: 'Edit Class',
                          description: 'Edit class functionality coming soon',
                          type: 'info',
                        });
                      },
                    },
                    {
                      label: 'Manage Access',
                      icon: <Lock size={16} />,
                      onClick: () => setIsManageAccessModalOpen(true),
                    },
                  ]
                  : []),

                // Only non-owners can leave
                ...(!isOwner && !isCollaborator
                  ? [
                    {
                      label: 'Copy Class Link',
                      icon: <Link size={16} />,
                      // onClick: handleCopyClassLink,
                    },
                  ]
                  : []),

                {
                  label: 'Leave Class',
                  icon: <LogOut size={16} />,
                  className: 'text-red-500',
                  onClick: handleLeaveClass,
                },

                // Only owner can delete class
                ...(isOwner
                  ? [
                    {
                      label: 'Delete Class',
                      icon: <Trash2 size={16} />,
                      className: 'text-red-500',
                      onClick: handleDeleteClass,
                    },
                  ]
                  : []),
              ]}
              triggerIcon={<SlidersHorizontal size={20} />}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex space-x-8">
          {['Resources', 'Members'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-semibold text-md ${activeTab === tab
                ? 'border-[#0890A8] text-[#0890A8]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'Resources' && (
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Folders</h3>
              {folders.length === 0 ? (
                <p className="text-gray-500">No folders found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {folders.map((folder: any) => (
                    <FolderItem
                      key={folder._id}
                      id={folder._id}
                      name={folder.name}
                      isBookmarked={true}
                      onClick={() => router.push(`/dashboard/classes/${classId}/folders/${folder._id}`)}
                      isClass={true}
                      hideActions={!isOwner && !isCollaborator}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Quiz Set</h3>
              {quizzes.length === 0 ? (
                <p className="text-gray-500">No quizzes found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {quizzes.map((quiz: any) => (
                    <QuizCard
                      key={quiz._id || quiz.id}
                      id={quiz._id || quiz.id}
                      title={quiz.title}
                      description={quiz.description || ''}
                      tags={quiz.tags || []}
                      creator={{
                        name: quiz.createdBy?.name || 'Unknown',
                        isCurrentUser: false,
                      }}
                      isClass={true}
                      parentRoute={`dashboard/classes/${classId}/quizzes`}
                      hideActions={!isOwner && !isCollaborator}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Members' && (
          <MemberGrid
            owner={{
              _id: classData.owner._id,
              user: {
                _id: classData.owner._id,
                name: classData.owner.name,
                email: classData.owner.email,
                username: classData.owner.username,
                profileImage: (classData.owner as any).profileImage,
              },
              accessLevel: 'owner',
              joinedAt: classData.createdAt,
            }}
            members={classData.members || []}
            isOwner={isOwner}
            columns={3}
            userAccessLevel={userAccessLevel} // 🔥 updated
            onManage={(userId, action) => handleManageAccess(userId, action)}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Class"
        icon={<Trash2 size={20} className="text-red-500" />}
        titleColor="text-red-600"
        subHeading="Are you sure you want to delete this class?"
        description="This action cannot be undone. All resources and member access will be lost."
        centerDescription
        confirmText="Delete Class"
        confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
        onConfirm={() => {
          deleteClassMutation.mutate(classId, {
            onSuccess: () => {
              toast({
                title: 'Class deleted successfully',
                description: 'The class has been permanently deleted.',
                type: 'success',
              });
              router.push('/dashboard');
            },
            onError: (error: any) => {
              toast({
                title: 'Failed to delete class',
                description: error.message || 'Something went wrong.',
                type: 'error',
              });
            },
          });
          setDeleteModalOpen(false);
        }}
      />

      <ConfirmationModal
        isOpen={leaveModalOpen}
        onOpenChange={setLeaveModalOpen}
        title="Leave Class"
        icon={<LogOut size={20} className="text-red-500" />}
        titleColor="text-red-600"
        subHeading="Are you sure you want to leave this class?"
        description="You will no longer have access to this class."
        centerDescription
        confirmText="Leave"
        confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
        onConfirm={() => {
          if (!classId) return;
          leaveClass(classId, {
            onSuccess: () => {
              toast({
                title: 'Left class successfully',
                description: 'You have been removed from the class.',
              });
              router.push('/dashboard');
            },
            onError: (error: any) => {
              console.log(error.message);
              toast({
                title: 'Failed to leave class',
                description: error?.message || 'Something went wrong.',
                variant: 'destructive',
              });
            },
          });
          setLeaveModalOpen(false);
        }}
      />

      {/* 🔥 updated: pass userAccessLevel directly, removed normalizedUserRole */}
      <ManageAccessModal
        isOpen={isManageAccessModalOpen}
        onOpenChange={setIsManageAccessModalOpen}
        resourceType="class"
        resourceId={classId}
        resourceLink={classLink}
        owner={classData.owner}
        members={classData.members || []}
        currentUserId={currentUserId}
        publicAccess={classData?.publicAccess}
        userAccessLevel={userAccessLevel}
      />
    </div>
  );
}
