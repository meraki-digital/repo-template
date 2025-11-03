import { useState, useEffect } from 'react';
import type { Note } from '../types/types';

interface NoteFormProps {
  note?: Note;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

const MAX_LENGTH = 10000;

export function NoteForm({ note, onSubmit, onCancel }: NoteFormProps) {
  const [content, setContent] = useState(note?.content || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedContent = content.trim();
    
    if (!trimmedContent) {
      setError("Oops! Your note is empty. Add some thoughts!");
      return;
    }

    if (trimmedContent.length > MAX_LENGTH) {
      setError(`Your note is too long! Please keep it under ${MAX_LENGTH} characters.`);
      return;
    }

    onSubmit(trimmedContent);
  };

  const remainingChars = MAX_LENGTH - content.length;
  const isNearLimit = remainingChars < 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {note ? 'Edit Note' : 'Add Note'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Your thoughts
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="What are you thinking about this book?"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Share your insights, favorite quotes, or reactions
              </p>
              <p className={`text-sm ${isNearLimit ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                {remainingChars.toLocaleString()} characters remaining
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {note ? 'Save Changes' : 'Add Note'}
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
