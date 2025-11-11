'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import {
  ChevronDown,
  Info,
  Link as LinkIcon,
  LockKeyholeOpen,
} from 'lucide-react';
import { boolean, string } from 'zod';

import {
  useAddClassMembers,
  useRemoveClassMember,
  useUpdateMemberAccess,
  useUpdateClassPublicAccess,
} from '@/services/features/classes';

import { ActionDropdown, Button, Input, Modal } from '@/components/ui';
import { Tooltip } from '@/components/ui/Tooltip';
import { useToast } from '@/components/ui/toast/index';

export interface AccessUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'owner' | 'collaborator' | 'member';
  key?: string;
}

interface ManageAccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // userRole: 'owner' | 'collaborator' | 'member';
  owner: AccessUser;
  members: any[];
  currentUserId: string;
  classId: string;
  classLink: string;
  publicAccess: 'restricted' | 'edit' | 'view_only' | 'none';
  userAccessLevel?: 'owner' | 'collaborator' | 'member' | 'none' | 'admin';
}

const ManageAccesssModal: React.FC<ManageAccessModalProps> = ({
  isOpen,
  onOpenChange,
  // userRole,
  owner,
  members,
  currentUserId,
  classId,
  classLink,
  userAccessLevel,
  publicAccess,
}) => {
  const [peopleWithAccess, setPeopleWithAccess] = useState<AccessUser[]>([]);
  const [emailsInput, setEmailsInput] = useState('');
  const { toast } = useToast();

  const removeMemberMutation = useRemoveClassMember();
  const addMembersMutation = useAddClassMembers();
  const updateMemberAccessMutation = useUpdateMemberAccess();
  const updatePublicAccessMutation = useUpdateClassPublicAccess();

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
    removeMemberMutation.mutate(
      { classId, userId },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Member removed successfully.',
            type: 'success',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to remove member.',
            type: 'error',
          });
        },
      }
    );
  };

  const handleRoleChange = (userId: string, newRole: 'collaborator' | 'member') => {
    updateMemberAccessMutation.mutate(
      { classId, userId, accessLevel: newRole },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Member role updated successfully.',
            type: 'success',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to update member role.',
            type: 'error',
          });
        },
      }
    );
  };

  const handlePublicAccessChange = (newAccess: 'restricted' | 'edit') => {
    updatePublicAccessMutation.mutate(
      { classId, publicAccess: newAccess },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Public access updated successfully.',
            type: 'success',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to update public access.',
            type: 'error',
          });
        },
      }
    );
  };

  const handleAddMembers = () => {
    const emails = emailsInput
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (!emails.length) {
      toast({
        title: 'Error',
        description: 'Please enter at least one valid email address.',
        type: 'error',
      });
      return;
    }

    addMembersMutation.mutate(
      { classId, data: { emails, accessLevel: 'member' } },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Members added successfully.',
            type: 'success',
          });
          setEmailsInput('');
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to add members.',
            type: 'error',
          });
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Manage Access"
      icon={<LockKeyholeOpen size={20} />}
      contentClassName="max-w-md"
    >
      {userAccessLevel === 'owner' ? (
        <>
          {/* Share Access */}
          <div className="space-y-2 my-4">
            <p className="text-sm font-semibold">Share Access</p>
            <p className="text-xs text-gray-500">
              Enter usernames or emails (separate by commas or line breaks). By
              default, users will be added as “Member”.
            </p>
            <Input
              placeholder="Enter usernames or emails"
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
                      <strong>Admin:</strong> manage class & access
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
                    <div
                      key={user.key}
                      className="flex items-center justify-between py-2 px-2 mb-1  rounded"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-white">
                            {initials}
                          </div>
                        )}

                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {user.name}{' '}
                            {user._id === currentUserId && (
                              <span className="text-gray-400">(You)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>

                        <div className="ml-auto flex items-center">
                          {user.role === 'owner' ? (
                            <span className="capitalize text-sm text-[#ACACAC] font-medium p-2">
                              {displayRole}
                            </span>
                          ) : (
                            <ActionDropdown
                              triggerName={displayRole}
                              triggerIcon={<ChevronDown size={16} />}
                              items={roleDropdownItems}
                            />
                          )}
                        </div>
                      </div>
                    </div>
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
                      publicAccess.charAt(0).toUpperCase() +
                      publicAccess.slice(1)
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
                          publicAccess === 'edit'
                            ? 'text-[#0890A8] font-semibold'
                            : '',
                        onClick: () => handlePublicAccessChange('edit'),
                      },
                      // { label: 'Private', className: publicAccess === 'private' ? 'text-[#0890A8] font-semibold' : '', onClick: () => onManage?.('publicAccess', 'private') },
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
                onClick={() => navigator.clipboard.writeText(classLink)}
              >
                <LinkIcon size={16} />
                Copy Link
              </Button>
              <Button
                variant="solid"
                className="bg-[#0890A8]"
                onClick={handleAddMembers}
                disabled={addMembersMutation.isPending}
              >
                {addMembersMutation.isPending ? 'Adding...' : 'Done'}
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

export default ManageAccesssModal;
