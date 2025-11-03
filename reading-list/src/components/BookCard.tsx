import { Link } from 'react-router-dom';
import type { Book } from '../types/types';
import { StatusBadge } from './StatusBadge';

interface BookCardProps {
  book: Book;
  onQuickNote?: (bookId: string) => void;
}

export function BookCard({ book, onQuickNote }: BookCardProps) {
  const handleQuickNoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickNote?.(book.id);
  };

  return (
    <Link
      to={`/books/${book.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 mb-4">{book.author}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <StatusBadge status={book.status} />
          {onQuickNote && (
            <button
              onClick={handleQuickNoteClick}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              + Quick Note
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
