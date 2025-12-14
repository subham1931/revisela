'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { z } from 'zod';

import { useCreateClass, useJoinClass } from '@/services/features/classes';
import { Button, Input, Modal, OtpInput, TabSwitch } from '@/components/ui';
import { useToast } from '@/components/ui/toast/index';

// ------------------ VALIDATION SCHEMA ------------------
const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  schoolName: z.string().min(1, 'School/University/Group name is required'),
});

type CreateClassFormData = z.infer<typeof createClassSchema>;

// ------------------ COMPONENT ------------------
interface ClassModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'create' | 'join';
  onSuccess?: () => void;
}

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onOpenChange,
  type = 'create',
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>(type);
  const [classCode, setClassCode] = useState('');
  const [classLink, setClassLink] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createClass, isPending: isCreating } = useCreateClass();
  const { mutate: joinClass, isPending: isJoining } = useJoinClass();

  // Sync tab with prop
  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  // ------------------ FORM SETUP ------------------
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: { name: '', schoolName: '' },
    mode: 'onChange',
  });

  // ------------------ HANDLERS ------------------
  const handleClose = () => {
    reset();
    setClassCode('');
    setClassLink('');
    onOpenChange(false);
  };

  const onCreateClass = (data: CreateClassFormData) => {
    createClass(
      {
        name: data.name,
        orgName: data.schoolName,
        publicAccess: 'restricted',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['classes'] });
          queryClient.invalidateQueries({ queryKey: ['my-classes'] });
          toast({
            title: 'Success',
            description: 'Class created successfully',
            type: 'success',
          });
          handleClose();
          onSuccess?.();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to create class',
            type: 'error',
          });
        },
      }
    );
  };

  const handleJoinClass = () => {
    // 1. Check if it's a link
    if (classLink) {
      try {
        const url = new URL(classLink);
        // Check if it matches our class route structure
        if (url.pathname.includes('/dashboard/classes/')) {
          const pathId = url.pathname.split('/classes/')[1]?.split('/')[0];
          if (pathId) {
            // Redirect to class page -> User will see "Request to Join"
            handleClose();
            window.location.href = url.toString(); // or router.push(url.pathname) if available
            return;
          }
        }
      } catch (e) {
        // Invalid URL, fall through
      }
    }

    // 2. Check if it's a code
    const code =
      classCode ||
      (classLink && classLink.trim().length === 6 ? classLink.trim() : '') ||
      '';

    if (!code || code.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 6-digit class code or a valid class link',
        type: 'error',
      });
      return;
    }

    joinClass(code, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['my-classes'] });
        toast({
          title: 'Success',
          description: 'Successfully joined the class',
          type: 'success',
        });
        handleClose();
        onSuccess?.();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to join class',
          type: 'error',
        });
      },
    });
  };

  // ------------------ UI ------------------
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      headingIcon={<Users size={50} color="#058F3A" />}
      subtitle="Why study solo when you can have a squad?"
      contentClassName="max-w-md"
    >
      {/* Tabs */}
      <TabSwitch
        options={[
          { value: 'create', label: 'Create A Class' },
          { value: 'join', label: 'Join A Class' },
        ]}
        value={activeTab}
        onChange={(value) => setActiveTab(value as 'create' | 'join')}
        className="mb-8 w-3/4 mx-auto"
      />

      {activeTab === 'create' ? (
        /* ------------------ CREATE CLASS ------------------ */
        <form onSubmit={handleSubmit(onCreateClass)} className="space-y-4">
          <Input
            placeholder="Enter class name"
            {...register('name')}
            error={errors.name?.message}
            className="rounded-xl"
            required
          />
          <Input
            placeholder="Enter school/university/group name"
            {...register('schoolName')}
            error={errors.schoolName?.message}
            className="rounded-xl"
            required
          />
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-[#058F3A] text-white rounded-xl px-6"
              disabled={isCreating || !isValid}
              loading={isCreating}
              loadingText="Creating..."
            >
              Create
            </Button>
          </div>
        </form>
      ) : (
        /* ------------------ JOIN CLASS ------------------ */
        <div className="space-y-4">
          {/* Code Input */}
          <p className="text-center text-sm text-[#0890A8]">Enter Class Code</p>
          <OtpInput
            length={6}
            onComplete={(code) => setClassCode(code)}
            className="flex justify-center items-center"
          />

          {/* OR Divider */}
          <div className="flex items-center gap-2 pt-2">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Link Input */}
          <div className="pt-2 space-y-3">
            <p className="text-center text-sm text-[#0890A8]">Enter Class Link</p>
            <input
              type="text"
              placeholder="Paste class link here"
              value={classLink}
              onChange={(e) => setClassLink(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#0890A8]"
            />
          </div>

          {/* Join Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              onClick={handleJoinClass}
              className="bg-[#058F3A] text-white rounded-xl px-6"
              disabled={isJoining}
              loading={isJoining}
              loadingText="Joining..."
            >
              Join
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ClassModal;
