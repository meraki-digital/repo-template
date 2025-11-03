import { useState, useEffect } from 'react';
import type { Book, ReadingStatus, CreateBookInput } from '../types/types';
import { StatusDropdown } from './StatusDropdown';
import { validateBookTitle, validateBookAuthor } from '../utils/validation';

interface BookFormProps {
  book?: Book;
  onSubmit: (data: CreateBookInput) => void;
  onCancel: () => void;
  existingBooks?: Book[];
}

export function BookForm({ book, onSubmit, onCancel, existingBooks = [] }: BookFormProps) {
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [status, setStatus] = useState<ReadingStatus>(book?.status || 'Want to Read');
  const [errors, setErrors] = useState<{ title?: string; author?: string; duplicate?: string }>({});

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setStatus(book.status);
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const titleValidation = validateBookTitle(title);
    const authorValidation = validateBookAuthor(author);
    
    if (!titleValidation.valid || !authorValidation.valid) {
      setErrors({
        title: titleValidation.error,
        author: authorValidation.error,
      });
      return;
    }

    const isDuplicate = existingBooks.some(
      (b) =>
        b.id !== book?.id &&
        b.title.toLowerCase().trim() === title.toLowerCase().trim() &&
        b.author.toLowerCase().trim() === author.toLowerCase().trim()
    );

    if (isDuplicate) {
      setErrors({
        duplicate: "Oops! Looks like you already have this book in your list!",
      });
      return;
    }

    onSubmit({ title: title.trim(), author: author.trim(), status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {book ? 'Edit Book' : 'Add New Book'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.duplicate && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.duplicate}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter book title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <StatusDropdown value={status} onChange={setStatus} />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {book ? 'Save Changes' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
