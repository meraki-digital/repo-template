# Task List: Reading List Tracker

**Generated From:** [0001-prd-reading-list.md](0001-prd-reading-list.md)  
**Date:** 2025-11-03  
**Status:** Ready for Implementation

---

## Relevant Files

### Backend Files
- `server/src/db/schema.sql` - Database schema definitions
- `server/src/db/migrations/001_initial_schema.sql` - Initial migration
- `server/src/models/Book.ts` - Book model and database operations
- `server/src/models/Note.ts` - Note model and database operations
- `server/src/routes/books.ts` - Book API endpoints
- `server/src/routes/notes.ts` - Note API endpoints
- `server/src/middleware/errorHandler.ts` - Error handling middleware
- `server/src/middleware/validator.ts` - Request validation middleware
- `server/src/server.ts` - Express server setup
- `server/src/config/database.ts` - Database connection configuration

### Frontend Files
- `client/src/App.tsx` - Main app component and routing
- `client/src/pages/BookList.tsx` - Book list view
- `client/src/pages/BookDetail.tsx` - Book detail and notes view
- `client/src/components/BookCard.tsx` - Individual book card component
- `client/src/components/BookForm.tsx` - Add/edit book form
- `client/src/components/NoteForm.tsx` - Add/edit note form
- `client/src/components/NoteItem.tsx` - Individual note display
- `client/src/components/FilterControls.tsx` - Status filter controls
- `client/src/components/StatusBadge.tsx` - Reading status visual indicator
- `client/src/services/api.ts` - API client service
- `client/src/types/index.ts` - TypeScript type definitions
- `client/src/hooks/useBooks.ts` - Custom hook for book operations
- `client/src/hooks/useNotes.ts` - Custom hook for note operations

### Configuration Files
- `.env.example` - Environment variable template
- `client/vite.config.ts` - Vite configuration
- `client/tailwind.config.js` - Tailwind CSS configuration
- `server/tsconfig.json` - TypeScript configuration for backend
- `client/tsconfig.json` - TypeScript configuration for frontend

### Notes
- This is a monorepo structure with `client/` and `server/` directories
- TypeScript is used throughout for type safety
- Tailwind CSS is used for styling
- Database migrations are managed manually for this small project

---

## Tasks

### 1.0 Project Setup & Infrastructure

- [ ] 1.1 Initialize project structure
  - Create root directory with `client/` and `server/` subdirectories
  - Initialize Git repository
  - Create `.gitignore` for Node.js projects
  - Set up package.json in root, client, and server directories

- [ ] 1.2 Setup backend project
  - Initialize Node.js/TypeScript project in `server/`
  - Install dependencies: express, pg, typescript, @types/node, @types/express
  - Configure TypeScript (tsconfig.json)
  - Create basic folder structure (src/routes, src/models, src/middleware, src/config)
  - Add dev script using nodemon or ts-node-dev

- [ ] 1.3 Setup frontend project
  - Initialize Vite + React + TypeScript project in `client/`
  - Install dependencies: react-router-dom, tailwindcss
  - Configure Tailwind CSS
  - Create basic folder structure (src/pages, src/components, src/services, src/hooks, src/types)
  - Configure Vite proxy for backend API

- [ ] 1.4 Setup database
  - Install PostgreSQL locally or provision cloud instance
  - Create database named `reading_list`
  - Create database connection configuration file
  - Test database connection from backend

### 2.0 Database Schema & Models

- [ ] 2.1 Create database schema
  - Write SQL schema for `books` table (id, title, author, status, created_at, updated_at)
  - Write SQL schema for `notes` table (id, book_id, content, created_at, updated_at)
  - Add indexes for performance (book_id, status, created_at)
  - Add foreign key constraint (notes.book_id references books.id)

- [ ] 2.2 Create initial migration
  - Write migration script in `server/src/db/migrations/001_initial_schema.sql`
  - Run migration to create tables
  - Verify tables exist with correct structure

- [ ] 2.3 Implement Book model
  - Create `server/src/models/Book.ts`
  - Implement `findAll(statusFilter?)` method
  - Implement `findById(id)` method
  - Implement `create(title, author, status)` method
  - Implement `update(id, data)` method
  - Implement `delete(id)` method
  - Add TypeScript types for Book entity

- [ ] 2.4 Implement Note model
  - Create `server/src/models/Note.ts`
  - Implement `findByBookId(bookId)` method
  - Implement `findById(id)` method
  - Implement `create(bookId, content)` method
  - Implement `update(id, content)` method
  - Implement `delete(id)` method
  - Add TypeScript types for Note entity

### 3.0 Backend API Development

- [ ] 3.1 Setup Express server
  - Create `server/src/server.ts`
  - Configure Express app with JSON middleware
  - Setup CORS middleware
  - Add error handling middleware
  - Configure routes
  - Add server startup on port 3001 (or from environment)

- [ ] 3.2 Implement Book API endpoints
  - Create `server/src/routes/books.ts`
  - Implement GET `/api/books` (with optional status query param)
  - Implement POST `/api/books` (create new book)
  - Implement GET `/api/books/:id` (get single book)
  - Implement PUT `/api/books/:id` (update book)
  - Implement DELETE `/api/books/:id` (delete book)
  - Add request validation for required fields
  - Add error handling for all endpoints

- [ ] 3.3 Implement Note API endpoints
  - Create `server/src/routes/notes.ts`
  - Implement GET `/api/books/:bookId/notes` (get notes for book)
  - Implement POST `/api/books/:bookId/notes` (create note)
  - Implement PUT `/api/notes/:id` (update note)
  - Implement DELETE `/api/notes/:id` (delete note)
  - Add request validation for required fields
  - Add error handling for all endpoints

- [ ] 3.4 Add validation middleware
  - Create `server/src/middleware/validator.ts`
  - Implement validation for book creation (title, author required)
  - Implement validation for note creation (content required)
  - Add validation for status enum values
  - Return clear error messages for validation failures

### 4.0 Frontend Foundation

- [ ] 4.1 Setup TypeScript types
  - Create `client/src/types/index.ts`
  - Define `Book` interface
  - Define `Note` interface
  - Define `ReadingStatus` type
  - Export all types

- [ ] 4.2 Create API client service
  - Create `client/src/services/api.ts`
  - Implement fetchBooks(statusFilter?) function
  - Implement fetchBook(id) function
  - Implement createBook(data) function
  - Implement updateBook(id, data) function
  - Implement deleteBook(id) function
  - Implement fetchNotes(bookId) function
  - Implement createNote(bookId, content) function
  - Implement updateNote(id, content) function
  - Implement deleteNote(id) function
  - Add error handling for all API calls

- [ ] 4.3 Setup routing
  - Create `client/src/App.tsx` with React Router
  - Define route for `/` (BookList)
  - Define route for `/books/:id` (BookDetail)
  - Add basic layout wrapper
  - Add navigation header

- [ ] 4.4 Create custom hooks
  - Create `client/src/hooks/useBooks.ts` for book operations
  - Create `client/src/hooks/useNotes.ts` for note operations
  - Handle loading states
  - Handle error states
  - Provide methods for CRUD operations

### 5.0 Book List Feature

- [ ] 5.1 Create BookCard component
  - Create `client/src/components/BookCard.tsx`
  - Display title, author, and status
  - Make card clickable to navigate to book detail
  - Add hover effects
  - Make responsive for mobile/desktop

- [ ] 5.2 Create FilterControls component
  - Create `client/src/components/FilterControls.tsx`
  - Add buttons/select for "All", "Want to Read", "Currently Reading", "Finished"
  - Highlight active filter
  - Emit filter change events to parent

- [ ] 5.3 Create StatusBadge component
  - Create `client/src/components/StatusBadge.tsx`
  - Display reading status with color coding
  - Want to Read: gray
  - Currently Reading: blue
  - Finished: green

- [ ] 5.4 Implement BookList page
  - Create `client/src/pages/BookList.tsx`
  - Fetch books using useBooks hook
  - Render FilterControls component
  - Render grid/list of BookCard components
  - Show loading state while fetching
  - Show empty state when no books
  - Add "Add Book" button
  - Implement filter functionality

### 6.0 Book Detail & Notes Feature

- [ ] 6.1 Create NoteItem component
  - Create `client/src/components/NoteItem.tsx`
  - Display note content
  - Display created/updated timestamps
  - Add Edit and Delete buttons
  - Make responsive

- [ ] 6.2 Create NoteForm component
  - Create `client/src/components/NoteForm.tsx`
  - Add textarea for note content
  - Show character count
  - Add Save and Cancel buttons
  - Support create and edit modes
  - Validate non-empty content

- [ ] 6.3 Implement BookDetail page
  - Create `client/src/pages/BookDetail.tsx`
  - Fetch book and notes using hooks
  - Display book title, author, and status
  - Add status change controls (dropdown or buttons)
  - Display list of NoteItem components
  - Add "Add Note" button
  - Add "Edit Book" and "Delete Book" buttons
  - Add "Back to List" navigation
  - Handle loading and error states

- [ ] 6.4 Implement note CRUD in BookDetail
  - Show NoteForm when "Add Note" clicked
  - Handle note creation
  - Support editing existing notes
  - Prompt for confirmation before deleting notes
  - Refresh notes list after changes

### 7.0 Book CRUD Forms

- [ ] 7.1 Create BookForm component
  - Create `client/src/components/BookForm.tsx`
  - Add input for title
  - Add input for author
  - Add select/dropdown for status
  - Support create and edit modes
  - Show validation errors inline
  - Add Save and Cancel buttons

- [ ] 7.2 Integrate BookForm for creating books
  - Add modal or dedicated page for new book form
  - Trigger from "Add Book" button in BookList
  - Handle form submission
  - Redirect to BookList after creation
  - Show success message

- [ ] 7.3 Integrate BookForm for editing books
  - Add Edit button in BookDetail
  - Load existing book data into form
  - Handle form submission
  - Update book in UI after save
  - Show success message

- [ ] 7.4 Implement book deletion
  - Add Delete button in BookDetail
  - Show confirmation dialog before deletion
  - Call deleteBook API
  - Redirect to BookList after deletion
  - Show success message

### 8.0 UI Polish & Responsive Design

- [ ] 8.1 Implement responsive layouts
  - Test BookList on mobile, tablet, desktop
  - Test BookDetail on mobile, tablet, desktop
  - Adjust grid columns for different screen sizes
  - Ensure forms work well on mobile
  - Test navigation on small screens

- [ ] 8.2 Add loading states
  - Show spinner while fetching books
  - Show spinner while fetching book details
  - Show spinner while fetching notes
  - Disable buttons during save/delete operations
  - Add skeleton loaders for better UX

- [ ] 8.3 Add error handling
  - Display error messages from API calls
  - Style error states clearly
  - Provide retry options where appropriate
  - Add form validation error displays
  - Test error scenarios (network failure, etc.)

- [ ] 8.4 Polish visual design
  - Ensure consistent spacing throughout
  - Apply color scheme consistently
  - Add hover states to interactive elements
  - Ensure sufficient color contrast for accessibility
  - Add smooth transitions where appropriate

### 9.0 Testing & Quality Assurance

- [ ] 9.1 Manual testing - Happy paths
  - Test adding a new book
  - Test updating book details
  - Test changing book status
  - Test adding notes to a book
  - Test editing notes
  - Test deleting notes
  - Test deleting a book
  - Test filtering by status

- [ ] 9.2 Manual testing - Edge cases
  - Test with empty database
  - Test with very long book titles
  - Test with very long notes (10,000 chars)
  - Test with special characters in inputs
  - Test rapid clicking/submitting
  - Test browser back/forward buttons

- [ ] 9.3 Cross-browser testing
  - Test on Chrome
  - Test on Firefox
  - Test on Safari
  - Test on Edge
  - Document any browser-specific issues

- [ ] 9.4 Mobile testing
  - Test on iOS Safari
  - Test on Android Chrome
  - Test touch interactions
  - Test responsive breakpoints
  - Ensure text is readable on small screens

### 10.0 Deployment Preparation

- [ ] 10.1 Environment configuration
  - Create `.env.example` files for client and server
  - Document required environment variables
  - Set up environment variables for production
  - Ensure sensitive data not committed to Git

- [ ] 10.2 Build optimization
  - Run production build for frontend
  - Ensure build succeeds without errors
  - Check bundle size
  - Test production build locally

- [ ] 10.3 Deploy backend
  - Choose hosting platform (Railway, Heroku, etc.)
  - Set up database on hosting platform
  - Deploy backend application
  - Run database migrations on production
  - Test API endpoints in production

- [ ] 10.4 Deploy frontend
  - Choose hosting platform (Vercel recommended)
  - Configure environment variables (API URL)
  - Deploy frontend application
  - Test production deployment
  - Verify all features work in production

---

## Notes on Implementation

### Development Workflow
1. Start with database and models (Tasks 1-2) - this is your foundation
2. Build backend API (Task 3) - can be tested with Postman/curl
3. Build frontend infrastructure (Task 4) - sets up tooling
4. Build features incrementally (Tasks 5-7) - one feature at a time
5. Polish and test (Tasks 8-9) - don't skip this!
6. Deploy (Task 10) - get it live

### Key Decisions
- **Monorepo vs separate repos:** Using monorepo for simplicity
- **CSS approach:** Tailwind for utility-first styling
- **State management:** React hooks + context (no Redux needed for this scale)
- **Form handling:** Controlled components, no form library needed
- **Validation:** Backend validation required, frontend validation for UX

### Testing Approach
- Manual testing is sufficient for MVP
- Focus on cross-browser and cross-device testing
- Document bugs in separate bug fix documents as encountered

### When to Checkpoint
- After completing each major task group (1.0, 2.0, etc.)
- Before switching contexts (e.g., leaving for the day)
- After fixing complex bugs

---

**Ready to Start?**

Begin with Task 1.1. Once the project structure is set up, you can work through tasks sequentially or jump to specific features. The task list is designed to minimize dependencies, but following the order will provide the smoothest experience.

Use the command **"Do Step 5: tasks 1.1 through 1.4"** to work on the setup phase, then continue incrementally from there.
