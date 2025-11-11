'use client';

import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button, Input, Modal } from '@/components/ui';

interface EditFieldModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  field: string;
  label: string;
  type?: string;
  initialValue: string;
  onSave: (value: string, password: string) => Promise<void> | void; // UPDATED
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const EditFieldModal: React.FC<EditFieldModalProps> = ({
  isOpen,
  onOpenChange,
  field,
  label,
  type = 'text',
  initialValue,
  onSave,
}) => {
  const [value, setValue] = useState('');
  const [password, setPassword] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setPassword('');
      setDay('');
      setMonth('');
      setYear('');
      setError('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    let saveValue = value;

    if (field === 'birthday') {
      if (!day || !month || !year) {
        setError('Please select day, month, and year');
        return;
      }
      saveValue = `${day}-${month}-${year}`;
    }

    if (field !== 'birthday' && value.trim() === '') {
      setError(`${label} cannot be empty`);
      return;
    }

    if (password.trim() === '') {
      setError('Please enter your password to confirm changes');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(saveValue, password); // PASS password to parent
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || `Failed to update ${label.toLowerCase()}`);
    } finally {
      setIsSaving(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) =>
    String(currentYear - i)
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Edit ${label}`}
      icon={<Pencil size={18} className="text-[#0890A8]" />}
      titleColor="text-[#0890A8]"
      contentClassName="max-w-md"
      showCloseButton
    >
      <div className="space-y-4">
        {field === 'birthday' ? (
          <div className="w-full flex flex-col gap-3 relative">
            <p className="text-center text-gray-400 text-sm">
              You can only change this once
            </p>
            <div className="flex flex-col gap-2 items-start justify-around relative">
              <p className="text-gray-400 text-center">Birthday</p>
              <div className="w-full flex gap-3 items-center justify-around">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="border border-gray-400 rounded px-4 py-3 w-full"
                >
                  <option value="">DD</option>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="border border-gray-400 rounded px-4 py-3 w-full"
                >
                  <option value="">MMM</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="border border-gray-400 rounded px-4 py-3 w-full"
                >
                  <option value="">YYYY</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <Input
            label={label}
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={error}
            placeholder={`Enter your new ${label.toLowerCase()}`}
            className="border border-gray-400 rounded px-4 py-3 w-full"
          />
        )}

        {/* 🔒 Password confirmation field */}
        <Input
          label="Current Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password to confirm"
          className="border border-gray-400 rounded px-4 py-3 w-full"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1 border-none text-secondary-black hover:text-[#0890A8]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 border border-[#0890A8] text-[#0890A8]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditFieldModal;
