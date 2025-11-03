/**
 * StatusDropdown component
 * Dropdown for changing book reading status
 */

import type { ReadingStatus } from '../types/types.ts';

interface StatusDropdownProps {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
  disabled?: boolean;
}

const statusOptions: ReadingStatus[] = ['Want to Read', 'Currently Reading', 'Finished'];

export function StatusDropdown({ value, onChange, disabled = false }: StatusDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ReadingStatus)}
      disabled={disabled}
      className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {statusOptions.map(status => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
