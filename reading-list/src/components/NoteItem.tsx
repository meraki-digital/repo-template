import { useState } from 'react';
import type { Note } from '../types/types';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  const isLong = note.content.length > maxLength;
  const displayContent = isExpanded ? note.content : note.content.slice(0, maxLength);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <p className="text-gray-800 whitespace-pre-wrap">
        {displayContent}
        {isLong && !isExpanded && '...'}
      </p>
      
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 mt-2"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          {formatDate(note.createdAt)}
          {note.updatedAt !== note.createdAt && ' (edited)'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
