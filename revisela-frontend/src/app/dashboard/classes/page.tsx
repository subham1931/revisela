'use client';

import React, { useState } from 'react';

import { Plus, Users } from 'lucide-react';

import { useMyClasses } from '@/services/features/classes';

import { ClassModal } from '@/components/modals';
import { Button } from '@/components/ui';
import { ContentLoader } from '@/components/ui/loaders';

import { ROUTES } from '@/constants/routes';

export default function ClassesPage() {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classModalType, setClassModalType] = useState<'create' | 'join'>(
    'create'
  );

  const { data: classes, isLoading, error } = useMyClasses();

  const handleCreateClass = () => {
    setClassModalType('create');
    setIsClassModalOpen(true);
  };

  const handleJoinClass = () => {
    setClassModalType('join');
    setIsClassModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ContentLoader
          message="Loading your classes..."
          size="lg"
          variant="primary"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load classes</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  const hasClasses = classes && classes.length > 0;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">My Classes</h1>
          <p className="text-[#444444]">
            Manage your classes and collaborate with others
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateClass}
            className="bg-[#0890A8] text-white flex items-center gap-2"
          >
            <Plus size={16} />
            Create Class
          </Button>
          <Button
            onClick={handleJoinClass}
            className="bg-[#058F3A] text-white flex items-center gap-2"
          >
            <Users size={16} />
            Join Class
          </Button>
        </div>
      </div>

      {hasClasses ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                (window.location.href = `${ROUTES.DASHBOARD.CLASSES.ROOT}/${classItem._id}`)
              }
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-[#444444] mb-1">
                    {classItem.name}
                  </h3>
                  {classItem.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {classItem.description}
                    </p>
                  )}
                  {classItem.classCode && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Code: {classItem.classCode}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {classItem.memberCount || 0} member
                  {(classItem.memberCount || 0) !== 1 ? 's' : ''}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${classItem.publicAccess === 'edit' ||
                    classItem.publicAccess === 'view_only'
                    ? 'bg-green-100 text-green-800'
                    : classItem.publicAccess === 'restricted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {classItem.publicAccess === 'edit' ||
                    classItem.publicAccess === 'view_only'
                    ? 'Public'
                    : classItem.publicAccess === 'restricted'
                      ? 'Restricted'
                      : 'Private'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 ">
          <div className="mb-6">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-[#444444] mb-2">
              No classes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first class or join an existing one to get started
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={handleCreateClass}
              className="bg-[#0890A8] text-white flex items-center gap-2"
            >
              <Plus size={16} />
              Create Your First Class
            </Button>
            <Button
              onClick={handleJoinClass}
              className="bg-[#058F3A] text-white flex items-center gap-2"
            >
              <Users size={16} />
              Join a Class
            </Button>
          </div>
        </div>
      )}

      <ClassModal
        isOpen={isClassModalOpen}
        onOpenChange={setIsClassModalOpen}
        type={classModalType}
        onSuccess={() => {
          // Classes will be refetched automatically due to React Query
        }}
      />

    </div>
  );
}
