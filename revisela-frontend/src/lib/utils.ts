import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to "DD-MMM-YYYY" format (e.g., "01-Jan-2001")
 * @param dateString - Date string in any valid format (ISO, etc.)
 * @returns Formatted date string or empty string if invalid
 */
export function formatToDDMMMYYYY(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }

    const day = date.getDate().toString().padStart(2, '0');

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = months[date.getMonth()];

    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Parses a date string in "DD-MMM-YYYY" format back to ISO format
 * @param formattedDate - Date string in "DD-MMM-YYYY" format
 * @returns ISO date string or empty string if invalid
 */
export function parseDDMMMYYYYToISO(formattedDate: string): string {
  if (!formattedDate) return '';

  try {
    const [day, monthStr, year] = formattedDate.split('-');

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthIndex = months.findIndex((m) => m === monthStr);
    if (monthIndex === -1) return '';

    const date = new Date(Number(year), monthIndex, Number(day));

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString();
  } catch (error) {
    console.error('Error parsing formatted date:', error);
    return '';
  }
}

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};
