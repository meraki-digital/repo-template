/**
 * Notes service
 * Handles all CRUD operations for notes in localStorage
 */

import { Note, CreateNoteInput } from '../types/index.ts';
import { loadFromStorage, saveToStorage } from './storage.ts';

const NOTES_KEY = 'notes';

export function loadNotes(): Note[] {
  return loadFromStorage<Note[]>(NOTES_KEY, []);
}

export function saveNotes(notes: Note[]): void {
  saveToStorage(NOTES_KEY, notes);
}

export function createNote(input: CreateNoteInput): Note {
  const newNote: Note = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const notes = loadNotes();
  notes.push(newNote);
  saveNotes(notes);
  
  return newNote;
}

export function updateNote(id: string, content: string): Note | null {
  const notes = loadNotes();
  const index = notes.findIndex(n => n.id === id);
  
  if (index === -1) {
    return null;
  }
  
  notes[index] = {
    ...notes[index],
    content,
    updatedAt: new Date().toISOString(),
  };
  
  saveNotes(notes);
  return notes[index];
}

export function deleteNote(id: string): boolean {
  const notes = loadNotes();
  const filtered = notes.filter(n => n.id !== id);
  
  if (filtered.length === notes.length) {
    return false; // Note not found
  }
  
  saveNotes(filtered);
  return true;
}

export function findNotesByBookId(bookId: string): Note[] {
  const notes = loadNotes();
  return notes
    .filter(n => n.bookId === bookId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function deleteNotesByBookId(bookId: string): void {
  const notes = loadNotes();
  const filtered = notes.filter(n => n.bookId !== bookId);
  saveNotes(filtered);
}
