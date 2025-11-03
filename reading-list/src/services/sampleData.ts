/**
 * Sample data initialization
 * Creates 5 whimsical sample books with notes on first load
 */

import { Book, Note } from '../types/index.ts';
import { loadBooks, saveBooks } from './books.ts';
import { loadNotes, saveNotes } from './notes.ts';

export function initializeSampleData(): void {
  // Only initialize if localStorage is empty
  const existingBooks = loadBooks();
  const existingNotes = loadNotes();
  
  if (existingBooks.length > 0 || existingNotes.length > 0) {
    return; // Already have data, don't overwrite
  }
  
  const now = new Date().toISOString();
  
  // Create 5 whimsical sample books
  const sampleBooks: Book[] = [
    {
      id: crypto.randomUUID(),
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      status: "Finished",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Where's Waldo in the Quantum Realm?",
      author: "Schrödinger's Cat",
      status: "Want to Read",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Cooking with Chaos: A Dragon's Guide to BBQ",
      author: "Smaug the Magnificent",
      status: "Currently Reading",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "101 Uses for a Dead Laptop",
      author: "Marie Kondo",
      status: "Finished",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Procrastination for Dummies (Coming Soon)",
      author: "Anonymous",
      status: "Want to Read",
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  // Create sample notes for each book
  const sampleNotes: Note[] = [
    {
      id: crypto.randomUUID(),
      bookId: sampleBooks[0].id,
      content: "The answer to life, the universe, and everything is 42. Mind-bending and hilarious!",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      bookId: sampleBooks[1].id,
      content: "He's both there and not there until you observe him. This is going to be confusing...",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      bookId: sampleBooks[2].id,
      content: "The flamethrower technique is revolutionary. My neighbors are concerned.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      bookId: sampleBooks[3].id,
      content: "Spoiler: throwing it away sparks the most joy.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      bookId: sampleBooks[4].id,
      content: "Will read this later. Definitely later.",
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  // Save to localStorage
  saveBooks(sampleBooks);
  saveNotes(sampleNotes);
  
  console.log('✨ Initialized with 5 whimsical sample books!');
}
