import { useState, useMemo, useEffect, useContext } from 'react';
import type { ReadingStatus } from '../types/types';
import { useBooks } from '../hooks/useBooks';
import { useNotes } from '../hooks/useNotes';
import { useToast } from '../hooks/useToast';
import { BookCard } from '../components/BookCard';
import { FilterControls } from '../components/FilterControls';
import { BookForm } from '../components/BookForm';
import { QuickAddNote } from '../components/QuickAddNote';
import { AutoBackupContext } from '../App';

const FILTER_STORAGE_KEY = 'readingList_activeFilter';

export function BookList() {
  const { recordChange } = useContext(AutoBackupContext);
  const { books, createBook } = useBooks(recordChange);
  const { createNote } = useNotes(undefined, recordChange);
  const { showToast } = useToast();
  
  const [activeFilter, setActiveFilter] = useState<'all' | ReadingStatus>(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    return (saved as 'all' | ReadingStatus) || 'all';
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [quickNoteBookId, setQuickNoteBookId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, activeFilter);
  }, [activeFilter]);

  const filteredBooks = useMemo(() => {
    const filtered =
      activeFilter === 'all'
        ? books
        : books.filter((book) => book.status === activeFilter);
    
    return filtered.sort((a, b) => a.author.localeCompare(b.author));
  }, [books, activeFilter]);

  const handleQuickNote = (bookId: string) => {
    setQuickNoteBookId(bookId);
  };

  const handleAddBook = (data: { title: string; author: string; status: ReadingStatus }) => {
    createBook(data);
    setShowAddForm(false);
    showToast('Book added successfully! Happy reading! 📚', 'success');
  };

  const handleQuickNoteSubmit = (content: string) => {
    if (quickNoteBookId) {
      createNote({ bookId: quickNoteBookId, content });
      setQuickNoteBookId(null);
      showToast('Note added! Great insight! 💡', 'success');
    }
  };

  const quickNoteBook = quickNoteBookId ? books.find((b) => b.id === quickNoteBookId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">My Reading List</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <FilterControls
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              + Add Book
            </button>
          </div>
        </header>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {activeFilter === 'all'
                ? 'No books yet! Add your first book to get started.'
                : `No books with status "${activeFilter}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onQuickNote={handleQuickNote}
              />
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => setShowAddForm(false)}
          existingBooks={books}
        />
      )}

      {quickNoteBookId && quickNoteBook && (
        <QuickAddNote
          bookId={quickNoteBookId}
          bookTitle={quickNoteBook.title}
          onSubmit={handleQuickNoteSubmit}
          onClose={() => setQuickNoteBookId(null)}
        />
      )}
    </div>
  );
}
