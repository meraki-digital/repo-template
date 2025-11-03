/**
 * useNotes hook
 * Manages notes state and CRUD operations
 */

import { useState, useEffect } from 'react';
import type { Note, CreateNoteInput } from '../types/types.ts';
import * as noteService from '../services/notes.ts';

export function useNotes(bookId?: string, onChangeCallback?: () => void) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes on mount and when bookId changes
  useEffect(() => {
    if (bookId) {
      const loadedNotes = noteService.findNotesByBookId(bookId);
      setNotes(loadedNotes);
    } else {
      const loadedNotes = noteService.loadNotes();
      setNotes(loadedNotes);
    }
    setLoading(false);
  }, [bookId]);

  const createNote = (input: CreateNoteInput): Note => {
    const newNote = noteService.createNote(input);
    setNotes([...notes, newNote]);
    onChangeCallback?.();
    return newNote;
  };

  const updateNote = (id: string, content: string): Note | null => {
    const updatedNote = noteService.updateNote(id, content);
    if (updatedNote) {
      setNotes(notes.map(n => n.id === id ? updatedNote : n));
      onChangeCallback?.();
    }
    return updatedNote;
  };

  const deleteNote = (id: string): boolean => {
    const success = noteService.deleteNote(id);
    if (success) {
      setNotes(notes.filter(n => n.id !== id));
      onChangeCallback?.();
    }
    return success;
  };

  const getNotesByBook = (targetBookId: string): Note[] => {
    return notes.filter(n => n.bookId === targetBookId);
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    getNotesByBook,
  };
}
