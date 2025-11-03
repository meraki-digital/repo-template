export type ReadingStatus = 'Want to Read' | 'Currently Reading' | 'Finished';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: ReadingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  bookId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  activeFilter: string;
  version: string;
}

export type CreateBookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookInput = Partial<Omit<Book, 'id'>> & { id: string };
export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNoteInput = Partial<Omit<Note, 'id'>> & { id: string };
