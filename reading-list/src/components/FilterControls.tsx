import type { ReadingStatus } from '../types/types';

interface FilterControlsProps {
  activeFilter: 'all' | ReadingStatus;
  onFilterChange: (filter: 'all' | ReadingStatus) => void;
}

export function FilterControls({ activeFilter, onFilterChange }: FilterControlsProps) {
  const filters: Array<{ value: 'all' | ReadingStatus; label: string }> = [
    { value: 'all', label: 'All Books' },
    { value: 'Want to Read', label: 'Want to Read' },
    { value: 'Currently Reading', label: 'Currently Reading' },
    { value: 'Finished', label: 'Finished' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeFilter === value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
