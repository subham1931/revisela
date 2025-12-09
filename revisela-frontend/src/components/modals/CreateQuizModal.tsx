'use client';

import React from 'react';
import { Modal } from '@/components/ui';
import CreateQuizForm from '@/app/dashboard/create-set/_components/CreateQuizForm';
import { FileDocumentIcon } from '@/components/icons';

interface CreateQuizModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    folderId?: string;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
    isOpen,
    onOpenChange,
    folderId,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Create Quiz Set"
            icon={<FileDocumentIcon size={24} />}
            contentClassName="max-w-4xl w-full h-[90vh] overflow-y-auto"
            showCloseButton
        >
            <div className="mt-4">
                <CreateQuizForm
                    folderId={folderId}
                    onSuccess={() => onOpenChange(false)}
                    onCancel={() => onOpenChange(false)}
                />
            </div>
        </Modal>
    );
};
