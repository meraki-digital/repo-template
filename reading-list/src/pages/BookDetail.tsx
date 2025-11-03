import { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { ReadingStatus, Note } from '../types/types';
import { useBooks } from '../hooks/useBooks';
import { useNotes } from '../hooks/useNotes';
import { useToast } from '../hooks/useToast';
import { StatusDropdown } from '../components/StatusDropdown';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { BookForm } from '../components/BookForm';
import { NoteItem } from '../components/NoteItem';
import { NoteForm } from '../components/NoteForm';
import { AutoBackupContext } from '../App';

export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recordChange } = useContext(AutoBackupContext);
  const { books, updateBook, deleteBook } = useBooks(recordChange);
  const { createNote, updateNote, deleteNote, getNotesByBook } = useNotes(undefined, recordChange);
  const { showToast } = useToast();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const book = books.find((b) => b.id === id);
  const bookNotes = id ? getNotesByBook(id).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) : [];

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to list
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ReadingStatus) => {
    updateBook(book.id, { status: newStatus });
    showToast('Status updated! 📖', 'success');
  };

  const handleEditBook = (data: { title: string; author: string; status: ReadingStatus }) => {
    updateBook(book.id, data);
    setShowEditForm(false);
    showToast('Book updated successfully! ✨', 'success');
  };

  const handleDeleteBook = () => {
    deleteBook(book.id);
    setShowDeleteDialog(false);
    showToast("Book deleted! We'll miss it. 👋", 'success');
    navigate('/');
  };

  const handleAddNote = (content: string) => {
    createNote({ bookId: book.id, content });
    setShowNoteForm(false);
    showToast('Note added! Great insight! 💡', 'success');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleUpdateNote = (content: string) => {
    if (editingNote) {
      updateNote(editingNote.id, content);
      setEditingNote(null);
      showToast('Note updated! 📝', 'success');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    setNoteToDelete(null);
    showToast('Note deleted! 🗑️', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to list
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <StatusDropdown value={book.status} onChange={handleStatusChange} />
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Notes ({bookNotes.length})
              </h2>
              <button
                onClick={() => setShowNoteForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                + Add Note
              </button>
            </div>

            {bookNotes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No notes yet. Add your first note to capture your thoughts!
              </p>
            ) : (
              <div className="space-y-4">
                {bookNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={(noteId) => setNoteToDelete(noteId)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this book? All your notes will be removed too!"
          onConfirm={handleDeleteBook}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      {showEditForm && (
        <BookForm
          book={book}
          onSubmit={handleEditBook}
          onCancel={() => setShowEditForm(false)}
          existingBooks={books}
        />
      )}

      {showNoteForm && (
        <NoteForm
          onSubmit={handleAddNote}
          onCancel={() => setShowNoteForm(false)}
        />
      )}

      {editingNote && (
        <NoteForm
          note={editingNote}
          onSubmit={handleUpdateNote}
          onCancel={() => setEditingNote(null)}
        />
      )}

      {noteToDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this note?"
          onConfirm={() => handleDeleteNote(noteToDelete)}
          onCancel={() => setNoteToDelete(null)}
        />
      )}
    </div>
  );
}
