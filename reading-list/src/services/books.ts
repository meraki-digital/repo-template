/**
 * Books service
 * Handles all CRUD operations for books in localStorage
 */

import { Book, CreateBookInput } from '../types';
import { loadFromStorage, saveToStorage } from './storage';

const BOOKS_KEY = 'books';

export function loadBooks(): Book[] {
  return loadFromStorage<Book[]>(BOOKS_KEY, []);
}

export function saveBooks(books: Book[]): void {
  saveToStorage(BOOKS_KEY, books);
}

export function createBook(input: CreateBookInput): Book {
  const newBook: Book = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const books = loadBooks();
  books.push(newBook);
  saveBooks(books);
  
  return newBook;
}

export function updateBook(id: string, updates: Partial<Omit<Book, 'id' | 'createdAt'>>): Book | null {
  const books = loadBooks();
  const index = books.findIndex(b => b.id === id);
  
  if (index === -1) {
    return null;
  }
  
  books[index] = {
    ...books[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveBooks(books);
  return books[index];
}

export function deleteBook(id: string): boolean {
  const books = loadBooks();
  const filtered = books.filter(b => b.id !== id);
  
  if (filtered.length === books.length) {
    return false; // Book not found
  }
  
  saveBooks(filtered);
  return true;
}

export function findBookById(id: string): Book | null {
  const books = loadBooks();
  return books.find(b => b.id === id) || null;
}

export function checkDuplicate(title: string, author: string, excludeId?: string): boolean {
  const books = loadBooks();
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedAuthor = author.trim().toLowerCase();
  
  return books.some(book => {
    if (excludeId && book.id === excludeId) {
      return false;
    }
    
    return (
      book.title.toLowerCase() === normalizedTitle &&
      book.author.toLowerCase() === normalizedAuthor
    );
  });
}
