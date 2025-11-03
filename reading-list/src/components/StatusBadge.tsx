/**
 * StatusBadge component
 * Displays reading status with color coding
 */

import type { ReadingStatus } from '../types/types.ts';

interface StatusBadgeProps {
  status: ReadingStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colorClasses = 
    status === 'Finished' ? 'bg-green-100 text-green-800 border-green-300' :
    status === 'Currently Reading' ? 'bg-blue-100 text-blue-800 border-blue-300' :
    'bg-gray-100 text-gray-800 border-gray-300';

  const sizeClasses =
    size === 'sm' ? 'text-xs px-2 py-1' :
    size === 'lg' ? 'text-base px-4 py-2' :
    'text-sm px-3 py-1';

  return (
    <span className={`inline-block rounded-full border font-medium ${colorClasses} ${sizeClasses}`}>
      {status}
    </span>
  );
}
