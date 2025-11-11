'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';

interface DateValues {
  month: string;
  day: string;
  year: string;
}

interface DateInputProps {
  label?: string;
  name?: string;
  className?: string;
  onChange?: (values: DateValues) => void;
  error?: string;
  value?: DateValues;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  className,
  onChange,
  error,
  value,
}) => {
  const [selectedValues, setSelectedValues] = useState({
    month: '',
    day: '',
    year: '',
  });

  const months = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
  ];

  const days = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return {
      value: day < 10 ? `0${day}` : `${day}`,
      label: day < 10 ? `0${day}` : `${day}`,
    };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = currentYear - i;
    return { value: `${year}`, label: `${year}` };
  });

  const handleChange = (field: 'month' | 'day' | 'year', value: string) => {
    const newValues = {
      ...selectedValues,
      [field]: value,
    };

    setSelectedValues(newValues);

    if (onChange) {
      onChange(newValues);
    }
  };

  const selectWrapperClass = 'relative w-full';
  const selectClass = cn(
    'appearance-none w-full px-3 py-2 border rounded-[10px] focus:outline-none focus:ring bg-white',
    'pr-10', // Add padding for the icon
    error ? 'border-red-500' : 'border-[#ACACAC]',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block mb-[5px] text-[18px] text-[#444444]">
          {label}
        </label>
      )}
      <div className="grid grid-cols-3 gap-2">
        <div className={selectWrapperClass}>
          <select
            name={`${name}-month`}
            value={selectedValues.month}
            onChange={(e) => handleChange('month', e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>
              Month
            </option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        <div className={selectWrapperClass}>
          <select
            name={`${name}-day`}
            value={selectedValues.day}
            onChange={(e) => handleChange('day', e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>
              Day
            </option>
            {days.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        <div className={selectWrapperClass}>
          <select
            name={`${name}-year`}
            value={selectedValues.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>
              Year
            </option>
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
