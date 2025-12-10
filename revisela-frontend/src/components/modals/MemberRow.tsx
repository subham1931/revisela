import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { ActionDropdown } from '@/components/ui';
import { useUser } from '@/services/features/users';

export interface AccessUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: 'owner' | 'collaborator' | 'member';
    key?: string;
}

interface MemberRowProps {
    user: AccessUser;
    currentUserId: string;
    onRoleChange: (userId: string, newRole: 'collaborator' | 'member') => void;
    onRemoveAccess: (userId: string) => void;
    allRoles: Array<'collaborator' | 'member'>;
}

export const MemberRow: React.FC<MemberRowProps> = ({
    user,
    currentUserId,
    onRoleChange,
    onRemoveAccess,
    allRoles,
}) => {
    // If name is 'Unknown', try to fetch user details
    const shouldFetch = user.name === 'Unknown' || !user.name;
    const { data: fetchedUser, isLoading } = useUser(shouldFetch ? user._id : undefined);

    // Use fetched data if available, otherwise fallback to prop data
    const name = fetchedUser?.name || user.name;
    const email = fetchedUser?.email || user.email;
    const avatar = fetchedUser?.profileImage || user.avatar;
    const role = user.role;

    const initials = (name || 'U')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const displayRole =
        role === 'owner'
            ? 'Admin'
            : role
                ? role.charAt(0).toUpperCase() + role.slice(1)
                : 'Member';

    const roleDropdownItems = [
        ...allRoles.map((r) => ({
            label: r.charAt(0).toUpperCase() + r.slice(1),
            className: role === r ? 'text-[#0890A8] font-semibold' : '',
            onClick: () => onRoleChange(user._id, r),
        })),
        {
            label: 'Remove Access',
            className: 'text-red-500',
            onClick: () => onRemoveAccess(user._id),
        },
    ];

    if (isLoading && shouldFetch) {
        return (
            <div className="flex items-center justify-between py-2 px-2 mb-1 rounded">
                <div className="flex items-center gap-2 w-full animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between py-2 px-2 mb-1 rounded">
            <div className="flex items-center gap-2 w-full">
                {avatar ? (
                    <Image
                        src={avatar}
                        alt={name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover relative"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-white">
                        {initials}
                    </div>
                )}

                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {name}{' '}
                        {user._id === currentUserId && (
                            <span className="text-gray-400">(You)</span>
                        )}
                    </p>
                    <p className="text-xs text-gray-500">{email}</p>
                </div>

                <div className="ml-auto flex items-center">
                    {role === 'owner' ? (
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
};
