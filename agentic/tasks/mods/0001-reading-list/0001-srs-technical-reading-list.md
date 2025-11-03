# Software Requirements Specification (Technical)
## Reading List Tracker

**Project:** Reading List Tracker  
**Version:** 1.0  
**Date:** 2025-11-03  
**Document Type:** Technical SRS

---

## 1. System Overview

The Reading List Tracker is a localhost-based, frontend-only web application that allows you to maintain a personal database of books using browser localStorage for persistence.

### 1.1 System Architecture

```
┌─────────────────────────────────────┐
│    User (Desktop Browser)           │
│         localhost:XXXX              │
└──────────────┬──────────────────────┘
               │
               │ Loads static files
               │
┌──────────────▼──────────────────────┐
│   Frontend Application              │
│  (HTML + CSS + JavaScript)          │
│         React + Vite                │
└──────────────┬──────────────────────┘
               │
               │ Read/Write
               │
┌──────────────▼──────────────────────┐
│   Browser localStorage              │
│   (Key-Value Store, ~5-10MB)        │
└─────────────────────────────────────┘
```

**Pattern:** Single-page application (SPA) with client-side storage  
**Communication:** Direct localStorage API calls  
**Data Flow:** Component → localStorage Service → localStorage API

---

## 2. Functional Requirements

### 2.1 Book Management

**FR-1: Add Book**
- System SHALL accept book title (required, max 255 chars)
- System SHALL accept author name (required, max 255 chars)
- System SHALL assign unique identifier (UUID) to each book
- System SHALL set default status to "Want to Read"
- System SHALL record creation timestamp
- System SHALL save to localStorage immediately

**FR-2: Edit Book**
- System SHALL allow modification of title and author
- System SHALL prevent empty values
- System SHALL record last modified timestamp
- System SHALL save changes to localStorage immediately

**FR-3: Delete Book**
- System SHALL allow book deletion
- System SHALL prompt for confirmation before deletion
- System SHALL cascade delete associated notes
- System SHALL remove from localStorage immediately

**FR-4: View Books**
- System SHALL display all books in a list/grid view
- System SHALL show title, author, and status for each book
- System SHALL support sorting by title, author, or date added
- System SHALL support filtering by status
- System SHALL load all books from localStorage on page load

### 2.2 Reading Status Management

**FR-5: Status Values**
- System SHALL support three status values:
  - "Want to Read" (default)
  - "Currently Reading"
  - "Finished"

**FR-6: Update Status**
- System SHALL allow status changes for any book
- System SHALL record timestamp of status changes
- System SHALL allow only one status per book at a time
- System SHALL save status change to localStorage immediately

### 2.3 Notes Management

**FR-7: Add Notes**
- System SHALL allow you to add notes to any book
- System SHALL accept notes up to 10,000 characters
- System SHALL support plain text input
- System SHALL record note creation timestamp
- System SHALL save to localStorage immediately

**FR-8: Edit Notes**
- System SHALL allow modification of existing notes
- System SHALL record last modified timestamp
- System SHALL save to localStorage immediately

**FR-9: Delete Notes**
- System SHALL allow note deletion
- System SHALL prompt for confirmation
- System SHALL not delete the associated book
- System SHALL remove from localStorage immediately

**FR-10: View Notes**
- System SHALL display all notes for a selected book
- System SHALL show creation and modification timestamps
- System SHALL display notes in reverse chronological order

---

## 3. Data Model

### 3.1 localStorage Structure

Data will be stored as JSON strings in localStorage with these keys:

```javascript
// Main data keys
localStorage.setItem('books', JSON.stringify(booksArray));
localStorage.setItem('notes', JSON.stringify(notesArray));
localStorage.setItem('appVersion', '1.0');
```

### 3.2 Data Schemas

#### Book Object Schema

```typescript
interface Book {
  id: string;              // UUID v4
  title: string;           // 1-255 characters
  author: string;          // 1-255 characters
  status: ReadingStatus;   // 'Want to Read' | 'Currently Reading' | 'Finished'
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

type ReadingStatus = 'Want to Read' | 'Currently Reading' | 'Finished';
```

Example:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "status": "Finished",
  "createdAt": "2025-11-03T10:30:00.000Z",
  "updatedAt": "2025-11-03T14:45:00.000Z"
}
```

#### Note Object Schema

```typescript
interface Note {
  id: string;              // UUID v4
  bookId: string;          // Foreign key to Book.id
  content: string;         // 1-10,000 characters
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

Example:
```json
{
  "id": "b2c3d4e5-f6g7-8901-bcde-f12345678901",
  "bookId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "content": "A wonderful adventure story. Loved Bilbo's transformation from comfortable hobbit to brave adventurer.",
  "createdAt": "2025-11-03T10:35:00.000Z",
  "updatedAt": "2025-11-03T10:35:00.000Z"
}
```

### 3.3 Data Relationships

Books and Notes are related through `bookId`:
- One book can have many notes (1:N relationship)
- Notes reference books via `bookId`
- Deleting a book deletes all associated notes
- Client-side code enforces referential integrity

---

## 4. localStorage Operations

### 4.1 Core Operations

**Load Data:**
```typescript
function loadBooks(): Book[] {
  const data = localStorage.getItem('books');
  return data ? JSON.parse(data) : [];
}

function loadNotes(): Note[] {
  const data = localStorage.getItem('notes');
  return data ? JSON.parse(data) : [];
}
```

**Save Data:**
```typescript
function saveBooks(books: Book[]): void {
  localStorage.setItem('books', JSON.stringify(books));
}

function saveNotes(notes: Note[]): void {
  localStorage.setItem('notes', JSON.stringify(notes));
}
```

**CRUD Helpers:**
```typescript
// Create
function createBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book {
  const newBook: Book = {
    ...book,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const books = loadBooks();
  books.push(newBook);
  saveBooks(books);
  return newBook;
}

// Update
function updateBook(id: string, updates: Partial<Book>): Book | null {
  const books = loadBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return null;
  
  books[index] = {
    ...books[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveBooks(books);
  return books[index];
}

// Delete
function deleteBook(id: string): boolean {
  const books = loadBooks();
  const filtered = books.filter(b => b.id !== id);
  if (filtered.length === books.length) return false;
  
  saveBooks(filtered);
  
  // Cascade delete notes
  const notes = loadNotes();
  const filteredNotes = notes.filter(n => n.bookId !== id);
  saveNotes(filteredNotes);
  
  return true;
}
```

---

## 5. User Interface Requirements

### 5.1 Views

**UI-1: Book List View**
- SHALL display all books in card or grid format
- SHALL show title, author, and status badge
- SHALL provide filter controls for status
- SHALL provide sort controls (optional for V1)
- SHALL include "Add Book" button
- SHALL provide click/tap access to book details

**UI-2: Book Detail View**
- SHALL display book title and author
- SHALL display current status with edit capability
- SHALL display all notes for the book
- SHALL provide "Add Note" functionality
- SHALL provide edit/delete controls for book
- SHALL provide "Back to List" navigation

**UI-3: Add/Edit Book Form**
- SHALL provide input fields for title and author
- SHALL provide dropdown/select for status
- SHALL validate required fields
- SHALL show clear error messages
- SHALL include Save and Cancel buttons

**UI-4: Add/Edit Note Form**
- SHALL provide textarea for note content
- SHALL show character count
- SHALL include Save and Cancel buttons
- SHALL validate non-empty content

### 5.2 Responsive Design

**UI-5: Breakpoints** (Nice to have, not required)
- Desktop: >= 1024px (multi-column layout)
- Tablet: 768px - 1023px (two-column layout)
- Mobile: < 768px (single-column layout)

**Note:** Since this is laptop-only, mobile optimization is optional. Responsive is nice but not critical.

---

## 6. Non-Functional Requirements

### 6.1 Performance

**NFR-1: Response Time**
- Page load time SHALL be < 2 seconds
- Data operations SHALL complete < 100ms (localStorage is synchronous)
- Filter/search operations SHALL complete < 500ms

**NFR-2: Scalability**
- System SHALL support up to 1,000 books
- System SHALL support up to 100 notes per book
- System SHALL handle localStorage size limit (~5-10MB)
- System SHALL warn when approaching storage limits

### 6.2 Data Persistence

**NFR-3: localStorage Reliability**
- System SHALL use localStorage API for all data
- System SHALL handle localStorage quota exceeded errors
- System SHALL validate data on load (catch corrupt JSON)
- System SHALL provide export feature for backup

**NFR-4: Data Integrity**
- System SHALL validate all data before saving
- System SHALL enforce referential integrity (notes → books)
- System SHALL use UUID for all IDs (prevent collisions)
- System SHALL include data version for future migrations

### 6.3 Usability

**NFR-5: User Experience**
- System SHALL require zero training for basic operations
- System SHALL provide clear visual feedback for all actions
- System SHALL use consistent UI patterns throughout
- System SHALL be accessible via keyboard navigation

### 6.4 Maintainability

**NFR-6: Code Quality**
- Code SHALL follow standard style guidelines
- Code SHALL include TypeScript for type safety
- Code SHALL include comments for complex logic
- Code SHALL be organized into clear modules/components

---

## 7. Technical Constraints

### 7.1 Technology Stack

**Frontend:**
- Framework: React 18+
- Language: TypeScript 5+
- Build Tool: Vite
- Styling: Tailwind CSS

**Storage:**
- Browser localStorage API
- JSON serialization
- No backend server
- No database

**Development:**
- Vite dev server for localhost development
- Production: Static files that can be opened in browser

**Browser Support:**
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### 7.2 localStorage Limitations

**Storage Limits:**
- Most browsers: 5-10MB per origin
- Synchronous API (blocks main thread for large operations)
- String-only storage (must serialize objects)

**Workarounds:**
- Monitor data size
- Provide export/import functionality
- Warn user when approaching limits
- Use efficient JSON structure

### 7.3 Deployment Model

**How to Run:**
```bash
# Development
npm install
npm run dev
# Opens at http://localhost:5173

# Production build (optional)
npm run build
# Creates dist/ folder with static files
# Can open dist/index.html directly in browser
```

---

## 8. Acceptance Criteria

### 8.1 Functional Acceptance

The system is acceptable when:

✅ You can add a book with title and author  
✅ You can view list of all books  
✅ You can filter books by reading status  
✅ You can change a book's reading status  
✅ You can add notes to a book  
✅ You can edit existing notes  
✅ You can delete books and notes  
✅ All data persists in localStorage across sessions  
✅ UI is clean and usable on laptop  
✅ No internet connection required after initial setup  

### 8.2 Technical Acceptance

✅ All data operations use localStorage API  
✅ Data validates on load (handles corrupt data)  
✅ localStorage quota is monitored  
✅ Code passes linting standards  
✅ Application runs on localhost  
✅ Can be moved to different computer via export/import  

---

## 9. Data Export/Import (Future Enhancement)

### 9.1 Export Feature

User can export all data to JSON file:

```typescript
function exportData(): void {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    books: loadBooks(),
    notes: loadNotes()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reading-list-backup-${Date.now()}.json`;
  a.click();
}
```

### 9.2 Import Feature

User can import previously exported data:

```typescript
function importData(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Validate structure
        if (!data.books || !data.notes) throw new Error('Invalid format');
        
        // Overwrite localStorage
        saveBooks(data.books);
        saveNotes(data.notes);
        
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}
```

---

## 10. Open Questions

1. **localStorage size monitoring:**  
   **Decision:** Add warning at 80% capacity, export feature to mitigate

2. **What if user clears browser data?**  
   **Decision:** Accept data loss, encourage regular exports

3. **Moving to new computer?**  
   **Decision:** Export/import feature handles this

4. **Multiple browsers on same laptop?**  
   **Decision:** Each browser has separate localStorage - user can export/import to sync

---

## 11. Dependencies

### 11.1 External Dependencies

- Modern web browser with localStorage support
- Node.js for development (not required for running production build)

### 11.2 Development Dependencies

- Vite (dev server and build tool)
- React (UI framework)
- TypeScript (type safety)
- Tailwind CSS (styling)

---

## 12. Assumptions

1. User has modern web browser (2023+)
2. User's browser has localStorage enabled
3. Single user on single device (no collaboration)
4. Data volume will remain under 5MB (~1000 books + notes)
5. User is comfortable with localStorage limitations

---

## Appendix

**Related Documents:**
- [Executive SRS](0001-srs-executive-reading-list.md) - High-level overview
- [Product Requirements Document](0001-prd-reading-list.md) - Detailed feature requirements (Step 2)
- [Task List](0001-tasks-reading-list.md) - Implementation tasks (Step 3)
- [Tech Stack](0001-tech-stack.md) - Technology decisions (Step 4)

**Glossary:**
- **localStorage:** Browser API for storing key-value pairs persistently
- **SPA:** Single-Page Application
- **UUID:** Universally Unique Identifier
- **ISO 8601:** International date/time format standard

---

**Document History:**
- v1.0 (2025-11-03): Initial technical specification created via discovery interview process (localhost/localStorage version)
