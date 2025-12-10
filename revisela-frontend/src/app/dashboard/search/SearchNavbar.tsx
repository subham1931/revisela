import React from 'react';
import { cn } from '@/lib/utils';
import { Dropdown } from '@/components/ui/Dropdown';
import { ChevronDown } from 'lucide-react';

interface SearchNavbarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { value: 'all', label: 'All Results' },
    { value: 'folders', label: 'Folders' },
    { value: 'quizzes', label: 'Quiz Sets' },
    { value: 'classes', label: 'Classes' },
    { value: 'users', label: 'Users' },
];

export const SearchNavbar: React.FC<SearchNavbarProps> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 mb-6">
            {/* Tabs */}
            <div className="flex space-x-6 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => onTabChange(tab.value)}
                            className={cn(
                                'pb-3 text-base font-semibold transition-colors whitespace-nowrap',
                                isActive
                                    ? 'text-[#0890A8] border-b-2 border-[#0890A8]'
                                    : 'text-[#444444] hover:text-black'
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Filter Dropdown */}
            <div className="mt-4 sm:mt-0">
                <Dropdown
                    trigger={
                        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition">
                            <span>Filtered by: None</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    }
                    items={[
                        { label: 'None', onClick: () => { } },
                        { label: 'Date', onClick: () => { } },
                        { label: 'Name', onClick: () => { } },
                    ]}
                />
            </div>
        </div>
    );
};
