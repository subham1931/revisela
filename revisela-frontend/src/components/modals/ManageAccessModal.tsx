'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import {
  Link as LinkIcon,
  LockKeyholeOpen,
  Check,
  X,
  ArrowLeft,
  ChevronDown,
  Info,
} from 'lucide-react';

import {
  useAddClassMembers,
  useRemoveClassMember,
  useUpdateMemberAccess,
  useUpdateClassPublicAccess,
  useApproveJoinRequest,
  useRejectJoinRequest,
} from '@/services/features/classes';

import {
  useShareFolder,
  useRemoveFolderMember,
  useUpdateFolderMemberAccess,
  useUpdateFolderPublicAccess,
} from '@/services/features/folders';

import { useUser } from '@/services/features/users';

import { ActionDropdown, Button, Input, Modal } from '@/components/ui';
import { Tooltip } from '@/components/ui/Tooltip';
import { useToast } from '@/components/ui/toast/index';
import { MemberRow, AccessUser } from './MemberRow';


interface ManageAccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  owner: AccessUser;
  members: any[];
  currentUserId: string;
  resourceId: string;
  resourceLink: string;
  publicAccess?: 'restricted' | 'edit' | 'view_only' | 'none' | 'public'; // Combined types
  userAccessLevel?: 'owner' | 'collaborator' | 'member' | 'none' | 'admin';
  resourceType: 'class' | 'folder';
  joinRequests?: any[]; // Re-added
}

const ManageAccessModal: React.FC<ManageAccessModalProps> = ({
  isOpen,
  onOpenChange,
  owner,
  members,
  currentUserId,
  resourceId,
  resourceLink,
  userAccessLevel,
  publicAccess,
  resourceType,
  joinRequests = [],
}) => {
  const [peopleWithAccess, setPeopleWithAccess] = useState<AccessUser[]>([]);
  const [emailsInput, setEmailsInput] = useState('');
  const [view, setView] = useState<'main' | 'review'>('main');
  const { toast } = useToast();

  const approveRequestMutation = useApproveJoinRequest();
  const rejectRequestMutation = useRejectJoinRequest();

  const handleApprove = (requestingUserId: string) => {
    approveRequestMutation.mutate({ classId: resourceId, userId: requestingUserId }, {
      onSuccess: () => toast({ title: 'Success', description: 'Request approved', type: 'success' }),
      onError: () => toast({ title: 'Error', description: 'Failed to approve', type: 'error' })
    });
  }

  const handleReject = (requestingUserId: string) => {
    rejectRequestMutation.mutate({ classId: resourceId, userId: requestingUserId }, {
      onSuccess: () => toast({ title: 'Success', description: 'Request rejected', type: 'success' }),
      onError: () => toast({ title: 'Error', description: 'Failed to reject', type: 'error' })
    });
  }

  // Class Mutations
  const removeClassMemberMutation = useRemoveClassMember();
  const addClassMembersMutation = useAddClassMembers();
  const updateClassMemberAccessMutation = useUpdateMemberAccess();
  const updateClassPublicAccessMutation = useUpdateClassPublicAccess();

  // Folder Mutations
  const shareFolderMutation = useShareFolder();
  const removeFolderMemberMutation = useRemoveFolderMember();
  const updateFolderMemberAccessMutation = useUpdateFolderMemberAccess();
  const updateFolderPublicAccessMutation = useUpdateFolderPublicAccess();

  const isFolder = resourceType === 'folder';

  useEffect(() => {
    const normalizedMembers: AccessUser[] = members
      .filter((m) => ('user' in m ? m.user._id : m._id) !== owner._id)
      .map((m, idx) => {
        const role =
          (('accessLevel' in m ? m.accessLevel : m.role) as
            | 'owner'
            | 'collaborator'
            | 'member'
            | undefined) || 'member';
        const userObj = 'user' in m ? { ...m.user, role } : { ...m, role };
        return { ...userObj, key: `${userObj._id}-${idx}` };
      });

    setPeopleWithAccess([
      { ...owner, role: 'owner', key: owner._id },
      ...normalizedMembers,
    ]);
  }, [owner, members]);

  const allRoles: Array<'collaborator' | 'member'> = ['collaborator', 'member'];

  const handleRemoveAccess = (userId: string) => {
    if (isFolder) {
      removeFolderMemberMutation.mutate(
        { folderId: resourceId, userId },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Member removed successfully.', type: 'success' });
          },
          onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to remove member.', type: 'error' });
          },
        }
      );
    } else {
      removeClassMemberMutation.mutate(
        { classId: resourceId, userId },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Member removed successfully.', type: 'success' });
          },
          onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to remove member.', type: 'error' });
          },
        }
      );
    }
  };

  const handleRoleChange = (userId: string, newRole: 'collaborator' | 'member') => {
    if (isFolder) {
      updateFolderMemberAccessMutation.mutate(
        { folderId: resourceId, userId, accessLevel: newRole },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Member role updated successfully.', type: 'success' });
          },
          onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to update member role.', type: 'error' });
          },
        }
      );
    } else {
      updateClassMemberAccessMutation.mutate(
        { classId: resourceId, userId, accessLevel: newRole },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Member role updated successfully.', type: 'success' });
          },
          onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to update member role.', type: 'error' });
          },
        }
      );
    }
  };

  const handlePublicAccessChange = (newAccess: string) => {
    if (isFolder) {
      updateFolderPublicAccessMutation.mutate(
        { folderId: resourceId, publicAccess: newAccess as 'restricted' | 'public' },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Public access updated successfully.', type: 'success' });
          },
          onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to update public access.', type: 'error' });
          },
        }
      );
    } else {
      updateClassPublicAccessMutation.mutate(
        { classId: resourceId, publicAccess: newAccess as 'restricted' | 'edit' },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Public access updated successfully.', type: 'success' });
          },
          onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to update public access.', type: 'error' });
          },
        }
      );
    }
  };

  const handleAddMembers = () => {
    if (!emailsInput.trim()) {
      onOpenChange(false);
      return;
    }

    const emails = emailsInput
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (!emails.length) {
      // This case might be reached if input was just commas/newlines
      onOpenChange(false);
      return;
    }

    if (isFolder) {
      // Validate emails for folders as backend likely only supports emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter((e) => !emailRegex.test(e));

      if (invalidEmails.length > 0) {
        toast({
          title: 'Invalid Email(s)',
          description: `Folder sharing only supports emails. Invalid: ${invalidEmails.join(', ')}`,
          type: 'error'
        });
        return;
      }
    }

    if (isFolder) {
      shareFolderMutation.mutate(
        { folderId: resourceId, emails, accessLevel: 'member' },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Members added successfully.', type: 'success' });
            setEmailsInput('');
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to add members.', type: 'error' });
          },
        }
      );
    } else {
      addClassMembersMutation.mutate(
        { classId: resourceId, data: { emails, accessLevel: 'member' } },
        {
          onSuccess: () => {
            toast({ title: 'Success', description: 'Members added successfully.', type: 'success' });
            setEmailsInput('');
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to add members.', type: 'error' });
          },
        }
      );
    }
  };

  const isLoading = isFolder
    ? shareFolderMutation.isPending || removeFolderMemberMutation.isPending || updateFolderMemberAccessMutation.isPending || updateFolderPublicAccessMutation.isPending
    : addClassMembersMutation.isPending || removeClassMemberMutation.isPending || updateClassMemberAccessMutation.isPending || updateClassPublicAccessMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Manage Access"
      icon={<LockKeyholeOpen size={20} />}
      contentClassName="max-w-md"
    >
      {view === 'review' ? (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-800">Review Class Requests</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {joinRequests.map((req) => (
              <div key={req.user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                    {req.user.profileImage ? (
                      <Image src={req.user.profileImage} fill className="object-cover" alt={req.user.name} />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-sm font-bold text-gray-500">
                        {req.user.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{req.user.name}</p>
                    <p className="text-xs text-gray-500">{req.user.email}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleReject(req.user._id)} className="p-2 hover:bg-gray-200 rounded-full text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                  <button onClick={() => handleApprove(req.user._id)} className="p-2 hover:bg-gray-200 rounded-full bg-gray-200/50 text-green-600 transition-colors">
                    <Check size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 pt-2 border-t border-gray-100">
            <Button variant="outline" onClick={() => setView('main')} className="flex items-center gap-2 border-gray-300">
              <ArrowLeft size={16} /> Go Back
            </Button>
            <Button onClick={() => onOpenChange(false)} className="bg-[#0890A8] text-white hover:bg-[#077d92]">
              Done
            </Button>
          </div>
        </div>
      ) : userAccessLevel === 'owner' ? (
        <>
          {resourceType === 'class' && joinRequests.length > 0 && (
            <div className="flex flex-col gap-2 my-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800">Review Class Requests</h3>
                <Button variant="outline" className="border-gray-300 h-8 text-xs font-semibold" onClick={() => setView('review')}>
                  Review
                </Button>
              </div>
              <p className="text-sm text-gray-500">{joinRequests.length} users have requested to join this class.</p>
            </div>
          )}
          {/* Share Access */}
          <div className="space-y-2 my-4">
            <p className="text-sm font-semibold">Share Access</p>
            <p className="text-xs text-gray-500">
              {isFolder
                ? 'Enter email addresses (separate by commas or line breaks).'
                : 'Enter usernames or emails (separate by commas or line breaks).'}
              {' '}
              By default, users will be added as “Member”.
            </p>
            <Input
              placeholder={isFolder ? 'Enter email addresses' : 'Enter usernames or emails'}
              className="rounded-xl"
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
            />
          </div>

          {/* People with Access */}
          <div>
            <div className="flex gap-2 items-center my-2">
              <h3 className="text-sm font-semibold">People with Access</h3>
              <Tooltip
                position="bottom"
                content={
                  <div className="space-y-1 text-xs">
                    <p>
                      <strong>Admin:</strong> manage {resourceType} & access
                    </p>
                    <p>
                      <strong>Collaborator:</strong> manage resources & access
                    </p>
                    <p>
                      <strong>Member:</strong> can access resources only
                    </p>
                  </div>
                }
              >
                <Info size={18} className="text-gray-600 cursor-pointer" />
              </Tooltip>
            </div>

            {peopleWithAccess.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No one has access yet.
              </p>
            ) : (
              <div
                className={`rounded-lg ${peopleWithAccess.length > 5 ? 'max-h-70 overflow-y-auto' : ''} `}
              >
                {peopleWithAccess.map((user) => {
                  const initials = user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();
                  const displayRole =
                    user.role === 'owner'
                      ? 'Admin'
                      : user.role
                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                        : 'Member';

                  const roleDropdownItems = [
                    ...allRoles.map((role) => ({
                      label: role.charAt(0).toUpperCase() + role.slice(1),
                      className:
                        user.role === role
                          ? 'text-[#0890A8] font-semibold'
                          : '',
                      onClick: () => handleRoleChange(user._id, role),
                    })),
                    {
                      label: 'Remove Access',
                      className: 'text-red-500',
                      onClick: () => handleRemoveAccess(user._id),
                    },
                  ];

                  return (
                    <MemberRow
                      key={user.key}
                      user={user}
                      currentUserId={currentUserId}
                      onRoleChange={handleRoleChange}
                      onRemoveAccess={handleRemoveAccess}
                      allRoles={allRoles}
                    />
                  );
                })}
              </div>
            )}

            {/* Public Access */}
            <div className="w-full flex justify-between items-center mt-4">
              <div className="flex gap-2 items-center">
                <h3 className="text-sm font-semibold">
                  Public Access To Resources
                </h3>
                <Tooltip
                  position="bottom"
                  content={
                    <div className="space-y-1 text-xs">
                      <p>
                        <strong>Restricted:</strong> only users with approved
                        access
                      </p>
                      <p>
                        <strong>Anyone can access:</strong> access without any
                        approval
                      </p>
                    </div>
                  }
                >
                  <Info size={18} className="text-gray-600 cursor-pointer" />
                </Tooltip>
              </div>

              <div className="ml-auto">
                {userAccessLevel === 'owner' ? (
                  <ActionDropdown
                    triggerName={
                      publicAccess === 'public' || publicAccess === 'edit'
                        ? 'Anyone can access'
                        : 'Restricted'
                    }
                    triggerIcon={<ChevronDown size={16} />}
                    items={[
                      {
                        label: 'Restricted',
                        className:
                          publicAccess === 'restricted'
                            ? 'text-[#0890A8] font-semibold'
                            : '',
                        onClick: () => handlePublicAccessChange('restricted'),
                      },
                      {
                        label: 'Anyone can access',
                        className:
                          publicAccess === 'edit' || publicAccess === 'public'
                            ? 'text-[#0890A8] font-semibold'
                            : '',
                        onClick: () => handlePublicAccessChange(isFolder ? 'public' : 'edit'),
                      },
                    ]}
                  />
                ) : (
                  <span className="capitalize text-sm text-[#ACACAC] font-medium p-2">
                    {publicAccess}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                className="border-[#0890A8] flex items-center gap-1"
                onClick={() => navigator.clipboard.writeText(resourceLink)}
              >
                <LinkIcon size={16} />
                Copy Link
              </Button>
              <Button
                variant="solid"
                className="bg-[#0890A8]"
                onClick={handleAddMembers}
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Done'}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">You cannot manage access.</p>
      )}
    </Modal>
  );
};



export default ManageAccessModal;
