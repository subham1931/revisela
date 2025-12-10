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
import { MemberRow, AccessUser } from './MemberRow';

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
    if (!emailInput.trim()) {
      onOpenChange(false);
      return;
    }

    const emails = emailInput
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email);

    if (emails.length === 0) {
      onOpenChange(false);
      return;
    }

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

  const allUsers = [{ ...owner, role: 'owner' } as AccessUser, ...members];



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
      contentClassName="max-w-md"
    >
      <div className="flex flex-col gap-4 my-4">
        {/* Share Access */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Share Access</p>
          <p className="text-xs text-gray-500">
            {resourceType === 'folder'
              ? 'Enter email addresses (separate by commas or line breaks).'
              : 'Enter usernames or emails (separate by commas or line breaks).'}
            {' '}
            By default, users will be added as “Member”.
          </p>
          <Input
            placeholder={resourceType === 'folder' ? 'Enter email addresses' : 'Enter usernames or emails'}
            className="rounded-xl"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              setEmailError('');
            }}
          />
          {emailError && (
            <p className="text-sm text-red-500 mt-1">{emailError}</p>
          )}
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

          {allUsers.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No one has access yet.
            </p>
          ) : (
            <div
              className={`rounded-lg ${allUsers.length > 5 ? 'max-h-70 overflow-y-auto' : ''} `}
            >
              {allUsers.map((user) => {
                const allRoles: Array<'collaborator' | 'member'> = ['collaborator', 'member'];
                // Ensure user has a key for React list
                const key = user.key || user._id;

                return (
                  <MemberRow
                    key={key}
                    user={user}
                    currentUserId={currentUserId}
                    onRoleChange={handleRoleChange}
                    onRemoveAccess={handleRemoveMember}
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
              <ActionDropdown
                triggerName={
                  publicAccess === 'restricted' ? 'Restricted' : 'Anyone can access'
                }
                triggerIcon={<ChevronDown size={16} />}
                items={publicAccessDropdownItems}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="border-[#0890A8] flex items-center gap-1"
              onClick={handleCopyLink}
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
      </div>
    </Modal>
  );
};

export default GenericManageAccessModal;
