// Reading status options
export type ReadingStatus = 'Want to Read' | 'Currently Reading' | 'Finished';

// Book interface
export interface Book {
  id: string;              // UUID
  title: string;           // 1-255 characters
  author: string;          // 1-255 characters
  status: ReadingStatus;   // Current reading status
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

// Note interface
export interface Note {
  id: string;              // UUID
  bookId: string;          // Foreign key to Book.id
  content: string;         // 1-10,000 characters
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

// App state interface (stored in localStorage)
export interface AppState {
  activeFilter: string;    // Current filter selection
  version: string;         // App version for future migrations
}

// Type for creating a new book (omits auto-generated fields)
export type CreateBookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating a book (all fields optional except id)
export type UpdateBookInput = Partial<Omit<Book, 'id'>> & { id: string };

// Type for creating a new note (omits auto-generated fields)
export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating a note (all fields optional except id)
export type UpdateNoteInput = Partial<Omit<Note, 'id'>> & { id: string };
