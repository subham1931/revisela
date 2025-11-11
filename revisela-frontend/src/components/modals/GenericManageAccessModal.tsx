'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import {
  ChevronDown,
  Info,
  Link as LinkIcon,
  LockKeyholeOpen,
} from 'lucide-react';

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

interface GenericManageAccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  owner: AccessUser;
  members: any[];
  currentUserId: string;
  resourceId: string;
  resourceLink: string;
  publicAccess: 'restricted' | 'public';
  userAccessLevel?: 'owner' | 'collaborator' | 'member' | 'none' | 'admin';
  resourceType: 'class' | 'folder' | 'quiz';
  // Hook functions
  onAddMembers: (emails: string[], accessLevel: string) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
  onUpdateMemberAccess: (userId: string, accessLevel: string) => Promise<void>;
  onUpdatePublicAccess: (publicAccess: string) => Promise<void>;
  onGetShareLink: () => Promise<string>;
}

const GenericManageAccessModal: React.FC<GenericManageAccessModalProps> = ({
  isOpen,
  onOpenChange,
  owner,
  members,
  currentUserId,
  resourceId,
  resourceLink,
  publicAccess,
  userAccessLevel,
  resourceType,
  onAddMembers,
  onRemoveMember,
  onUpdateMemberAccess,
  onUpdatePublicAccess,
  onGetShareLink,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState(resourceLink);
  const [emailError, setEmailError] = useState('');
  const { toast } = useToast();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmailInput('');
      setShareLink(resourceLink);
      setEmailError('');
    }
  }, [isOpen, resourceLink]);

  const validateEmails = (emailList: string[]): boolean => {
    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      setEmailError(
        `Invalid email${invalidEmails.length > 1 ? 's' : ''}: ${invalidEmails.join(', ')}`,
      );
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleAddMembers = async () => {
    if (!emailInput.trim()) return;

    const emails = emailInput
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email);

    if (emails.length === 0) return;

    // Validate emails
    if (!validateEmails(emails)) {
      return;
    }

    setIsLoading(true);
    try {
      await onAddMembers(emails, 'member');
      setEmailInput('');
      toast({
        title: 'Success',
        description: 'Members added successfully.',
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add members.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    setIsLoading(true);
    try {
      await onRemoveMember(userId);
      toast({
        title: 'Success',
        description: 'Member removed successfully.',
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove member.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'collaborator' | 'member') => {
    setIsLoading(true);
    try {
      await onUpdateMemberAccess(userId, newRole);
      toast({
        title: 'Success',
        description: 'Member role updated successfully.',
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update member role.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublicAccessChange = async (newAccess: 'restricted' | 'public') => {
    setIsLoading(true);
    try {
      await onUpdatePublicAccess(newAccess);
      toast({
        title: 'Success',
        description: 'Public access updated successfully.',
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update public access.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const link = await onGetShareLink();
      await navigator.clipboard.writeText(link);
      toast({
        title: 'Success',
        description: 'Link copied to clipboard.',
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to copy link.',
        type: 'error',
      });
    }
  };

  const allUsers = [owner, ...members];

  const roleDropdownItems = (user: AccessUser) => [
    {
      label: 'Collaborator',
      onClick: () => handleRoleChange(user._id, 'collaborator'),
    },
    {
      label: 'Member',
      onClick: () => handleRoleChange(user._id, 'member'),
    },
    {
      label: 'Remove Access',
      onClick: () => handleRemoveMember(user._id),
      className: 'text-red-500',
    },
  ];

  const publicAccessDropdownItems = [
    {
      label: 'Restricted',
      onClick: () => handlePublicAccessChange('restricted'),
    },
    {
      label: 'Anyone can access',
      onClick: () => handlePublicAccessChange('public'),
    },
  ];

  const getResourceTypeLabel = () => {
    switch (resourceType) {
      case 'class':
        return 'Class';
      case 'folder':
        return 'Folder';
      case 'quiz':
        return 'Quiz';
      default:
        return 'Resource';
    }
  };

  return (
    <Modal
      title={`Manage ${getResourceTypeLabel()} Access`}
      icon={<LockKeyholeOpen size={20} className="text-gray-500" />}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-6 my-5">
        {/* Add Members Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Add people
            </h3>
            <Tooltip content="Enter email addresses separated by commas">
              <Info size={16} className="text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter email addresses..."
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailError('');
                  }}
                  className={emailError ? 'border-red-500' : ''}
                />
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>
              <Button
                onClick={handleAddMembers}
                disabled={!emailInput.trim() || isLoading}
                className="bg-[#0890A8] text-white"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            People with access
          </h3>
          <div className="space-y-3">
            {allUsers.map((user) => {
              const displayRole = user.role === 'owner' ? 'Admin' : user.role;
              const isOwner = user.role === 'owner';
              const isCurrentUser = user._id === currentUserId;

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.name}
                        {isCurrentUser && (
                          <span className="text-sm text-gray-500 ml-2">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwner ? (
                      <span className="capitalize text-sm text-[#ACACAC] font-medium p-2">
                        {displayRole}
                      </span>
                    ) : (
                      <ActionDropdown
                        triggerName={displayRole}
                        triggerIcon={<ChevronDown size={16} />}
                        items={roleDropdownItems(user)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Public Access Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Public access
            </h3>
            <Tooltip content="Control who can access this resource via public link">
              <Info size={16} className="text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Link sharing</p>
              <p className="text-sm text-gray-500">
                {publicAccess === 'restricted'
                  ? 'Only people with access can view'
                  : 'Anyone with the link can view'}
              </p>
            </div>
            <ActionDropdown
              triggerName={
                publicAccess === 'restricted' ? 'Restricted' : 'Anyone can access'
              }
              triggerIcon={<ChevronDown size={16} />}
              items={publicAccessDropdownItems}
            />
          </div>
        </div>

        {/* Share Link Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Share link
          </h3>
          <div className="flex gap-2">
            <Input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1"
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LinkIcon size={16} />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GenericManageAccessModal;
