'use client';

import Image from 'next/image';
import React from 'react';

import { ChevronDown, Users } from 'lucide-react';

import { ActionDropdown } from '@/components/ui';

export interface ClassMember {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    username?: string;
    profileImage?: string;
  };
  accessLevel: 'owner' | 'admin' | 'collaborator' | 'member';
  joinedAt: string;
}

interface MemberGridProps {
  members: ClassMember[];
  owner: ClassMember;
  isOwner?: boolean; // Is current user the owner
  columns?: number;
  className?: string;
  gridClassName?: string;
  userAccessLevel?: 'owner' | 'collaborator' | 'member' | 'none' | 'admin';
  onManage?: (memberId: string, action: string) => void; // callback when changing role
}

const MemberGrid: React.FC<MemberGridProps> = ({
  members,
  owner,
  isOwner = false,
  columns = 3,
  className = '',
  gridClassName = '',
  userAccessLevel,
  onManage,
}) => {
  const colsClass = `grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-4`;

  const allMembers = [owner, ...members.filter((m) => m._id !== owner._id)];

  if (!allMembers.length) {
    return (
      <div className="text-gray-500 text-center py-4">No members found.</div>
    );
  }

  // Helper to check if the current user can manage the member
  const canManage = (member: ClassMember) => {
    if (!userAccessLevel) return false;
    if (member.accessLevel === 'owner') return false; // nobody manages owner
    if (userAccessLevel === 'owner') return true; // owner can manage anyone
    if (userAccessLevel === 'collaborator') {
      return member.accessLevel === 'member'; // collaborator can manage only members
    }
    return false;
  };

  // Get dropdown options for the current user
  const getDropdownItems = (member: ClassMember) => {
    if (!canManage(member)) return [];

    const items: { label: string; onClick: () => void; className?: string }[] =
      [];

    const memberRoleLower = member.accessLevel.toLowerCase();

    if (userAccessLevel === 'owner') {
      ['collaborator', 'member', 'Remove Access', 'Transfer ownership'].forEach(
        (role) => {
          items.push({
            label: role.charAt(0).toUpperCase() + role.slice(1),
            className:
              role.toLowerCase() === memberRoleLower
                ? 'text-[#0890A8] font-semibold'
                : '',
            onClick: () => onManage?.(member._id, role),
          });
        }
      );
    } else if (userAccessLevel === 'collaborator') {
      ['collaborator', 'member', 'Remove Access'].forEach((role) => {
        items.push({
          label: role.charAt(0).toUpperCase() + role.slice(1),
          className:
            role.toLowerCase() === memberRoleLower
              ? 'text-[#0890A8] font-semibold'
              : '',
          onClick: () => onManage?.(member._id, role),
        });
      });
    }

    return items;
  };

  return (
    <div className={className}>
      <div className={`grid ${colsClass} ${gridClassName}`}>
        {allMembers.map((m) => {
          const initials = m.user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

          const effectiveRole =
            m.accessLevel === 'owner' ? 'admin' : m.accessLevel;
          const displayRole =
            effectiveRole.charAt(0).toUpperCase() + effectiveRole.slice(1);

          const dropdownItems = getDropdownItems(m);

          return (
            <div
              key={m._id}
              className="p-2 border-2 border-[#ACACAC] rounded-lg flex flex-col items-center justify-between text-center hover:border-[#0890A8]"
            >
              <div className="flex justify-start items-center w-full gap-3">
                {/* Avatar */}
                {m.user.profileImage ? (
                  <Image
                    src={m.user.profileImage}
                    alt={m.user.name}
                    className="w-14 h-14 rounded-full object-cover"
                    width={56}
                    height={56}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-white">
                    {initials}
                  </div>
                )}

                {/* Name & Role */}
                <div className="flex flex-col justify-center items-start">
                  <span className="font-medium">{m.user.name}</span>
                  <span className="text-sm text-gray-400 mt-1">
                    {displayRole}
                  </span>
                </div>

                {/* Action Dropdown */}
                <div className="ml-auto flex items-center gap-2">
                  <Users
                    size={24}
                    className="text-[#058F3A] hover:text-gray-800 cursor-pointer"
                  />
                  {dropdownItems.length > 0 && (
                    <ActionDropdown items={dropdownItems} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberGrid;
