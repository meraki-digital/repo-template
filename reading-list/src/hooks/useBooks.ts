/**
 * useBooks hook
 * Manages books state and CRUD operations
 */

import { useState, useEffect } from 'react';
import type { Book, CreateBookInput } from '../types/types.ts';
import * as bookService from '../services/books.ts';

export function useBooks(onChangeCallback?: () => void) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Load books on mount
  useEffect(() => {
    const loadedBooks = bookService.loadBooks();
    setBooks(loadedBooks);
    setLoading(false);
  }, []);

  const createBook = (input: CreateBookInput): Book => {
    const newBook = bookService.createBook(input);
    setBooks([...books, newBook]);
    onChangeCallback?.();
    return newBook;
  };

  const updateBook = (id: string, updates: Partial<Omit<Book, 'id' | 'createdAt'>>): Book | null => {
    const updatedBook = bookService.updateBook(id, updates);
    if (updatedBook) {
      setBooks(books.map(b => b.id === id ? updatedBook : b));
      onChangeCallback?.();
    }
    return updatedBook;
  };

  const deleteBook = (id: string): boolean => {
    const success = bookService.deleteBook(id);
    if (success) {
      setBooks(books.filter(b => b.id !== id));
      onChangeCallback?.();
    }
    return success;
  };

  const findBook = (id: string): Book | null => {
    return books.find(b => b.id === id) || null;
  };

  const checkDuplicate = (title: string, author: string, excludeId?: string): boolean => {
    return bookService.checkDuplicate(title, author, excludeId);
  };

  return {
    books,
    loading,
    createBook,
    updateBook,
    deleteBook,
    findBook,
    checkDuplicate,
  };
}
