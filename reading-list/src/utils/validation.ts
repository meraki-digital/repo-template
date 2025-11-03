import type { Book, Note, ReadingStatus } from '../types/types.ts';

// Validate book title
export function validateBookTitle(title: string): { valid: boolean; error?: string } {
  const trimmed = title.trim();
  
  if (!trimmed) {
    return { 
      valid: false, 
      error: "Oops! We need a title for this book!" 
    };
  }
  
  if (trimmed.length > 255) {
    return { 
      valid: false, 
      error: "Oops! That title is too long. Keep it under 255 characters!" 
    };
  }
  
  return { valid: true };
}

// Validate book author
export function validateBookAuthor(author: string): { valid: boolean; error?: string } {
  const trimmed = author.trim();
  
  if (!trimmed) {
    return { 
      valid: false, 
      error: "Oops! We need an author for this book!" 
    };
  }
  
  if (trimmed.length > 255) {
    return { 
      valid: false, 
      error: "Oops! That author name is too long. Keep it under 255 characters!" 
    };
  }
  
  return { valid: true };
}

// Validate reading status
export function validateReadingStatus(status: string): { valid: boolean; error?: string } {
  const validStatuses: ReadingStatus[] = ['Want to Read', 'Currently Reading', 'Finished'];
  
  if (!validStatuses.includes(status as ReadingStatus)) {
    return { 
      valid: false, 
      error: "Oops! That's not a valid reading status!" 
    };
  }
  
  return { valid: true };
}

// Check for duplicate book (case-insensitive title and author match)
export function isDuplicate(title: string, author: string, books: Book[], excludeId?: string): boolean {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedAuthor = author.trim().toLowerCase();
  
  return books.some(book => {
    // Skip the book we're editing
    if (excludeId && book.id === excludeId) {
      return false;
    }
    
    return (
      book.title.toLowerCase() === normalizedTitle &&
      book.author.toLowerCase() === normalizedAuthor
    );
  });
}

// Validate complete book object
export function validateBook(
  title: string, 
  author: string, 
  status: string,
  books: Book[],
  excludeId?: string
): { valid: boolean; error?: string } {
  // Validate title
  const titleValidation = validateBookTitle(title);
  if (!titleValidation.valid) {
    return titleValidation;
  }
  
  // Validate author
  const authorValidation = validateBookAuthor(author);
  if (!authorValidation.valid) {
    return authorValidation;
  }
  
  // Validate status
  const statusValidation = validateReadingStatus(status);
  if (!statusValidation.valid) {
    return statusValidation;
  }
  
  // Check for duplicates
  if (isDuplicate(title, author, books, excludeId)) {
    return { 
      valid: false, 
      error: "Oops! Looks like you already have this book in your list!" 
    };
  }
  
  return { valid: true };
}

// Validate note content
export function validateNoteContent(content: string): { valid: boolean; error?: string } {
  const trimmed = content.trim();
  
  if (!trimmed) {
    return { 
      valid: false, 
      error: "Oops! Your note is empty. Add some thoughts!" 
    };
  }
  
  if (trimmed.length > 10000) {
    return { 
      valid: false, 
      error: "Oops! That note is too long. Keep it under 10,000 characters!" 
    };
  }
  
  return { valid: true };
}

// Validate complete note object
export function validateNote(content: string, bookId: string): { valid: boolean; error?: string } {
  // Validate content
  const contentValidation = validateNoteContent(content);
  if (!contentValidation.valid) {
    return contentValidation;
  }
  
  // Validate bookId exists
  if (!bookId || bookId.trim() === '') {
    return { 
      valid: false, 
      error: "Oops! This note isn't connected to a book!" 
    };
  }
  
  return { valid: true };
}
