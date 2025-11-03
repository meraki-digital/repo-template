# Task List: Reading List Tracker

**Generated From:** [0001-prd-reading-list.md](0001-prd-reading-list.md)  
**Date:** 2025-11-03  
**Status:** Ready for Implementation

---

## Relevant Files

### Core Application Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main app component and routing
- `src/vite-env.d.ts` - TypeScript declarations for Vite

### Type Definitions
- `src/types/index.ts` - TypeScript interfaces (Book, Note, ReadingStatus, AppState)

### localStorage Service
- `src/services/storage.ts` - localStorage wrapper service
- `src/services/books.ts` - Book CRUD operations
- `src/services/notes.ts` - Note CRUD operations
- `src/services/backup.ts` - Auto-backup functionality
- `src/services/sampleData.ts` - Initial whimsical sample books

### Components - Pages
- `src/pages/BookList.tsx` - Main book list view
- `src/pages/BookDetail.tsx` - Book detail and notes view

### Components - UI
- `src/components/BookCard.tsx` - Individual book card
- `src/components/BookForm.tsx` - Add/edit book form
- `src/components/NoteItem.tsx` - Individual note display
- `src/components/NoteForm.tsx` - Add/edit note form
- `src/components/QuickAddNote.tsx` - Quick note add from list view
- `src/components/StatusBadge.tsx` - Reading status visual indicator
- `src/components/StatusDropdown.tsx` - Status change dropdown
- `src/components/FilterControls.tsx` - Status filter buttons
- `src/components/Toast.tsx` - Notification/message component
- `src/components/ConfirmDialog.tsx` - Confirmation dialog for deletes
- `src/components/StorageWarning.tsx` - localStorage capacity warning

### Hooks
- `src/hooks/useBooks.ts` - Custom hook for book operations
- `src/hooks/useNotes.ts` - Custom hook for note operations
- `src/hooks/useToast.ts` - Custom hook for toast notifications
- `src/hooks/useLocalStorage.ts` - Custom hook for localStorage access
- `src/hooks/useAutoBackup.ts` - Custom hook for auto-backup triggering

### Utilities
- `src/utils/validation.ts` - Input validation helpers
- `src/utils/formatting.ts` - Date/time formatting helpers
- `src/utils/storage-monitor.ts` - localStorage usage monitoring

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.gitignore` - Git ignore rules

### Notes
- This is a frontend-only app with no backend
- All data persistence uses browser localStorage
- Development runs on Vite dev server (`npm run dev`)
- No production build needed (dev mode only)

---

## Tasks

### 1.0 Project Setup & Infrastructure

- [x] 1.1 Initialize Vite + React + TypeScript project
  - Run `npm create vite@latest reading-list -- --template react-ts`
  - Navigate to project directory
  - Run `npm install`
  - Verify dev server runs (`npm run dev`)
  
- [x] 1.2 Install and configure Tailwind CSS
  - Install tailwindcss, postcss, autoprefixer, @tailwindcss/postcss
  - Generate `tailwind.config.js` and `postcss.config.js`
  - Add Tailwind directives to `src/index.css`
  - Test Tailwind classes work in App.tsx

- [x] 1.3 Install React Router
  - Install `react-router-dom`
  - Set up basic routing in App.tsx
  - Test navigation works

- [x] 1.4 Setup project structure
  - Create folders: `src/components`, `src/pages`, `src/services`, `src/hooks`, `src/utils`, `src/types`
  - Create index files for barrel exports where needed
  - Update imports to use new structure

### 2.0 Type Definitions & Data Models

- [x] 2.1 Define TypeScript interfaces
  - Create `src/types/index.ts`
  - Define `Book` interface (id, title, author, status, createdAt, updatedAt)
  - Define `Note` interface (id, bookId, content, createdAt, updatedAt)
  - Define `ReadingStatus` type ('Want to Read' | 'Currently Reading' | 'Finished')
  - Define `AppState` interface (activeFilter, version)
  - Export all types

- [x] 2.2 Create validation schemas
  - Create `src/utils/validation.ts`
  - Add `validateBook(book)` function
  - Add `validateNote(note)` function
  - Add `validateBookTitle(title)` function
  - Add `validateBookAuthor(author)` function
  - Add `isDuplicate(title, author, books)` function

### 3.0 localStorage Service Layer

- [x] 3.1 Create base storage service
  - Create `src/services/storage.ts`
  - Implement `loadFromStorage<T>(key: string, defaultValue: T)` function
  - Implement `saveToStorage<T>(key: string, value: T)` function
  - Add error handling for quota exceeded
  - Add JSON validation on load

- [x] 3.2 Implement Books service
  - Create `src/services/books.ts`
  - Implement `loadBooks(): Book[]`
  - Implement `saveBooks(books: Book[]): void`
  - Implement `createBook(book): Book`
  - Implement `updateBook(id, updates): Book | null`
  - Implement `deleteBook(id): boolean`
  - Implement `findBookById(id): Book | null`
  - Implement `checkDuplicate(title, author): boolean`

- [x] 3.3 Implement Notes service
  - Create `src/services/notes.ts`
  - Implement `loadNotes(): Note[]`
  - Implement `saveNotes(notes: Note[]): void`
  - Implement `createNote(note): Note`
  - Implement `updateNote(id, content): Note | null`
  - Implement `deleteNote(id): boolean`
  - Implement `findNotesByBookId(bookId): Note[]`
  - Implement cascade delete when book is deleted

- [x] 3.4 Create sample data
  - Create `src/services/sampleData.ts`
  - Define 5 whimsical sample books with notes:
    - "The Hitchhiker's Guide to the Galaxy" by Douglas Adams (Finished)
    - "Where's Waldo in the Quantum Realm?" by Schrödinger's Cat (Want to Read)
    - "Cooking with Chaos: A Dragon's Guide to BBQ" by Smaug the Magnificent (Currently Reading)
    - "101 Uses for a Dead Laptop" by Marie Kondo (Finished)
    - "Procrastination for Dummies (Coming Soon)" by Anonymous (Want to Read)
  - Implement `initializeSampleData()` function
  - Only add samples if localStorage is empty

### 4.0 Auto-Backup System

- [x] 4.1 Create backup service
  - Create `src/services/backup.ts`
  - Implement `exportToJSON(): string` function
  - Implement `downloadBackup(data, filename)` function
  - Implement `importFromJSON(json): {books, notes}` function
  - Add timestamp to backup filename format

- [x] 4.2 Implement auto-backup hook
  - Create `src/hooks/useAutoBackup.ts`
  - Track number of changes (books + notes created/updated/deleted)
  - Trigger backup every 10 changes
  - Trigger backup every 60 minutes if changes exist
  - Show toast notification when backup completes

- [x] 4.3 Add manual export/import (optional for V1)
  - Add "Export Data" button in UI
  - Add "Import Data" button with file picker
  - Validate imported data structure
  - Show confirmation before overwriting data

### 5.0 Storage Monitoring

- [x] 5.1 Create storage monitor utility
  - Create `src/utils/storage-monitor.ts`
  - Implement `estimateStorageUsage(): number` (returns bytes)
  - Implement `getStoragePercentage(): number` (returns 0-100)
  - Implement `isNearCapacity(): boolean` (checks if > 80%)

- [x] 5.2 Create storage warning component
  - Create `src/components/StorageWarning.tsx`
  - Show warning banner when > 80% capacity
  - Display friendly message: "Heads up! Your reading list is getting pretty full..."
  - Include suggestion to export backup
  - Allow dismissing warning

### 6.0 Custom Hooks

- [x] 6.1 Create useLocalStorage hook
  - Create `src/hooks/useLocalStorage.ts`
  - Implement hook that syncs state with localStorage
  - Return [value, setValue] tuple
  - Auto-save on value change

- [x] 6.2 Create useBooks hook
  - Create `src/hooks/useBooks.ts`
  - Manage books state and CRUD operations
  - Load books from localStorage on mount
  - Provide: books, createBook, updateBook, deleteBook, findBook
  - Integrate with auto-backup (increment change counter)

- [x] 6.3 Create useNotes hook
  - Create `src/hooks/useNotes.ts`
  - Manage notes state and CRUD operations
  - Load notes from localStorage on mount
  - Provide: notes, createNote, updateNote, deleteNote, getNotesByBook
  - Integrate with auto-backup (increment change counter)

- [x] 6.4 Create useToast hook
  - Create `src/hooks/useToast.ts`
  - Manage toast notifications
  - Provide: showToast(message, type)
  - Support types: success, error, info
  - Auto-dismiss after 3 seconds

### 7.0 UI Components - Core

- [x] 7.1 Create Toast notification component
  - Create `src/components/Toast.tsx`
  - Display friendly messages at top/bottom of screen
  - Support success (green), error (red), info (blue) styles
  - Auto-fade out after 3 seconds
  - Show whimsical messages from PRD

- [x] 7.2 Create ConfirmDialog component
  - Create `src/components/ConfirmDialog.tsx`
  - Modal dialog with message and Yes/No buttons
  - Accept custom message prop
  - Return promise that resolves on user choice
  - Use for delete confirmations

- [x] 7.3 Create StatusBadge component
  - Create `src/components/StatusBadge.tsx`
  - Display reading status with color coding:
    - "Want to Read": Gray
    - "Currently Reading": Blue
    - "Finished": Green
  - Small, pill-shaped design

- [x] 7.4 Create StatusDropdown component
  - Create `src/components/StatusDropdown.tsx`
  - Dropdown/select with 3 status options
  - Show current status as selected
  - Emit onChange event when status changes
  - Style to match design system

### 8.0 Book Management UI

- [ ] 8.1 Create BookCard component
  - Create `src/components/BookCard.tsx`
  - Display title, author, and StatusBadge
  - Click card to navigate to detail view
  - Add "Quick Note" button (opens QuickAddNote)
  - Responsive card layout with Tailwind

- [ ] 8.2 Create FilterControls component
  - Create `src/components/FilterControls.tsx`
  - Buttons for: All, Want to Read, Currently Reading, Finished
  - Highlight active filter
  - Emit filter change events
  - Persist selection to localStorage via appState

- [ ] 8.3 Create BookList page
  - Create `src/pages/BookList.tsx`
  - Display grid of BookCard components
  - Show FilterControls at top
  - Sort books by author (alphabetically)
  - Apply active filter
  - Show "Add Book" button
  - Handle empty state (should show sample books)

- [ ] 8.4 Create BookForm component
  - Create `src/components/BookForm.tsx`
  - Input fields for title and author
  - StatusDropdown for status
  - Validate required fields (title, author)
  - Check for duplicates (show friendly error)
  - Show friendly validation errors
  - Support both create and edit modes
  - Save and Cancel buttons

- [ ] 8.5 Integrate BookForm into BookList
  - Add modal or dedicated section for new book form
  - Trigger from "Add Book" button
  - Handle form submission (create book)
  - Show success toast
  - Refresh book list after creation

### 9.0 Book Detail & Notes UI

- [ ] 9.1 Create BookDetail page
  - Create `src/pages/BookDetail.tsx`
  - Load book by ID from URL params
  - Display book title and author
  - Show StatusDropdown (allow changing status)
  - Add Edit and Delete buttons for book
  - Include "Back to List" button
  - Handle book not found error

- [ ] 9.2 Create NoteItem component
  - Create `src/components/NoteItem.tsx`
  - Display note content
  - Show created/updated timestamps (friendly format: "2 hours ago")
  - Add Edit and Delete buttons
  - Support expand/collapse for long notes

- [ ] 9.3 Create NoteForm component
  - Create `src/components/NoteForm.tsx`
  - Textarea for note content (up to 10,000 chars)
  - Character counter
  - Validate non-empty content
  - Show friendly error if empty
  - Support both create and edit modes
  - Save and Cancel buttons

- [ ] 9.4 Integrate notes into BookDetail
  - Display list of NoteItem components
  - Show notes in reverse chronological order
  - Add "Add Note" button (shows NoteForm)
  - Handle note creation
  - Handle note editing (inline or modal)
  - Handle note deletion (with confirmation)

- [ ] 9.5 Create QuickAddNote component
  - Create `src/components/QuickAddNote.tsx`
  - Small modal/popover that opens from BookCard
  - Simple textarea and Save button
  - Creates note associated with book
  - Shows success toast
  - Closes automatically on save

### 10.0 Data Operations & Integration

- [ ] 10.1 Implement book CRUD in BookList
  - Wire up createBook from BookForm
  - Show duplicate error with friendly message
  - Show success toast on creation
  - Refresh list after changes

- [ ] 10.2 Implement book edit in BookDetail
  - Add Edit button that shows BookForm in edit mode
  - Load existing book data into form
  - Save updates to book
  - Show success toast
  - Update view after save

- [ ] 10.3 Implement book delete in BookDetail
  - Add Delete button
  - Show ConfirmDialog: "Are you sure you want to delete this book? All your notes will be removed too!"
  - Delete book and cascade delete notes
  - Show success toast: "Book deleted! We'll miss it."
  - Redirect to BookList

- [ ] 10.4 Implement note CRUD in BookDetail
  - Create note from NoteForm
  - Update note inline or via modal
  - Delete note with ConfirmDialog
  - Show success toasts for all operations

- [ ] 10.5 Implement QuickAddNote from BookList
  - Wire up QuickAddNote component to BookCard
  - Create note associated with correct book
  - Show success toast
  - Close popover/modal after save

### 11.0 Filter Persistence & Routing

- [ ] 11.1 Implement filter persistence
  - Save active filter to localStorage in appState
  - Load filter on app mount
  - Apply filter to book list
  - Update filter in appState when changed

- [ ] 11.2 Setup React Router
  - Configure routes in App.tsx:
    - `/` - BookList
    - `/books/:id` - BookDetail
  - Test navigation between views
  - Ensure browser back button works

### 12.0 Error Handling & Validation

- [ ] 12.1 Add form validation
  - Validate title not empty (trim whitespace)
  - Validate author not empty (trim whitespace)
  - Check for duplicates (case-insensitive)
  - Show friendly errors in forms

- [ ] 12.2 Add localStorage error handling
  - Catch quota exceeded errors
  - Show friendly error: "Your browser storage is full! Try exporting a backup..."
  - Handle corrupt JSON gracefully
  - Provide default empty state if data corrupted

- [ ] 12.3 Add friendly error messages everywhere
  - Duplicate book: "Oops! Looks like you already have this book in your list!"
  - Empty title/author: "Oops! We need both a title and author!"
  - Empty note: "Oops! Your note is empty. Add some thoughts!"
  - Import failed: "Oops! That file doesn't look right..."
  - All delete confirmations use friendly language

### 13.0 UI Polish & Styling

- [ ] 13.1 Apply Tailwind styling throughout
  - Style BookList page (grid layout, spacing)
  - Style BookDetail page (readable layout)
  - Style forms (clean inputs, clear labels)
  - Style buttons (consistent colors and sizes)
  - Style cards (shadows, hover effects)

- [ ] 13.2 Add loading states (optional)
  - Show spinner while initializing data
  - Show loading state during operations (rare with localStorage)

- [ ] 13.3 Polish interactions
  - Add hover effects to cards and buttons
  - Add smooth transitions (fade in/out)
  - Ensure keyboard navigation works
  - Test tab order makes sense

- [ ] 13.4 Responsive design (nice to have)
  - Test on laptop/desktop screens
  - Ensure readable on different resolutions
  - Cards adapt to screen width
  - Forms are usable on all screen sizes

### 14.0 Testing & Quality Assurance

- [ ] 14.1 Manual testing - Happy paths
  - Add a new book (verify appears in list)
  - Edit book title/author (verify changes save)
  - Change book status (verify updates)
  - Add note to book (verify appears with timestamp)
  - Edit note (verify changes save)
  - Delete note (verify removed, book remains)
  - Delete book (verify book and notes removed)
  - Filter by status (verify list updates)
  - Navigate between list and detail (verify routing)

- [ ] 14.2 Manual testing - Edge cases
  - Try to add duplicate book (verify friendly error)
  - Try to add book with empty title (verify friendly error)
  - Try to add note with no content (verify friendly error)
  - Add 100+ books (verify performance)
  - Refresh page (verify data persists)
  - Clear localStorage and reload (verify sample data appears)

- [ ] 14.3 Manual testing - Auto-backup
  - Make 10 changes (verify backup downloads)
  - Wait 60 minutes with changes (verify backup downloads)
  - Check Downloads folder for backup files
  - Verify backup JSON format is correct

- [ ] 14.4 Manual testing - Storage monitoring
  - Add many books to approach 80% capacity
  - Verify warning appears
  - Verify warning is helpful and friendly

- [ ] 14.5 Cross-browser testing
  - Test on Chrome
  - Test on Firefox  
  - Test on Safari
  - Verify localStorage works on all

### 15.0 Final Polish

- [ ] 15.1 Add README
  - Document how to run: `npm install && npm run dev`
  - List features
  - Mention localStorage dependency
  - Note about auto-backup

- [ ] 15.2 Code cleanup
  - Remove console.logs (or add proper logging)
  - Remove unused imports
  - Format code consistently
  - Add comments for complex logic

- [ ] 15.3 Verify all friendly messages
  - Check all error messages use "Oops!" style
  - Check all confirmations are friendly
  - Check all success toasts are encouraging

- [ ] 15.4 Final verification
  - Sample books appear on first load
  - All CRUD operations work
  - Filter persists across sessions
  - Auto-backup triggers correctly
  - Storage warning appears at 80%
  - App runs on `npm run dev`

---

## Notes on Implementation

### Development Workflow
1. Start with infrastructure (Tasks 1-2) - foundation
2. Build storage layer (Tasks 3-5) - data persistence
3. Create hooks (Task 6) - state management
4. Build UI components (Tasks 7-9) - visual layer
5. Wire up interactions (Task 10-11) - make it work
6. Polish and test (Tasks 12-15) - make it great

### Key Decisions Made
- **No backend:** Frontend-only, localStorage for all data
- **Dev mode only:** No production build needed
- **React Router:** Client-side routing for navigation
- **Very friendly errors:** Whimsical, encouraging tone
- **Auto-backup:** Periodic JSON downloads for safety
- **Sample data:** 5 whimsical books on first load

### Testing Approach
- Manual testing is sufficient for this personal project
- Focus on cross-browser compatibility
- Verify localStorage persists correctly
- Test auto-backup triggers appropriately

### When to Use Toast vs Dialog
- **Toast:** Success confirmations, info messages, auto-backup notifications
- **Dialog:** Delete confirmations, data import warnings

---

**Ready to Start?**

Begin with Task 1.1. The project scaffolding sets everything up. From there, work through tasks sequentially or jump to specific features.

Use **"Do Step 5: tasks 1.1 through 1.4"** to work on the setup phase, then continue from there.

Total estimated time: 5-7 days for complete implementation.
