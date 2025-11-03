# Software Requirements Specification (Technical)
## Reading List Tracker

**Project:** Reading List Tracker  
**Version:** 1.0  
**Date:** 2025-11-03  
**Document Type:** Technical SRS

---

## 1. System Overview

The Reading List Tracker is a web-based application that allows users to maintain a personal database of books they've read, are reading, or want to read, along with personal notes about each book.

### 1.1 System Context

```
┌─────────┐
│  User   │
│(Browser)│
└────┬────┘
     │
     ├─ HTTP/HTTPS
     │
┌────▼────────────┐
│   Web Server    │
│  (Frontend App) │
└────┬────────────┘
     │
     ├─ REST API
     │
┌────▼────────────┐
│   API Server    │
│   (Backend)     │
└────┬────────────┘
     │
     ├─ SQL Queries
     │
┌────▼────────────┐
│   Database      │
│  (PostgreSQL)   │
└─────────────────┘
```

---

## 2. Functional Requirements

### 2.1 Book Management

**FR-1: Add Book**
- System SHALL accept book title (required, max 255 chars)
- System SHALL accept author name (required, max 255 chars)
- System SHALL assign unique identifier to each book
- System SHALL set default status to "Want to Read"
- System SHALL record creation timestamp

**FR-2: Edit Book**
- System SHALL allow modification of title and author
- System SHALL prevent empty values
- System SHALL record last modified timestamp

**FR-3: Delete Book**
- System SHALL allow book deletion
- System SHALL prompt for confirmation before deletion
- System SHALL cascade delete associated notes

**FR-4: View Books**
- System SHALL display all books in a list view
- System SHALL show title, author, and status for each book
- System SHALL support sorting by title, author, or date added
- System SHALL support filtering by status

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

### 2.3 Notes Management

**FR-7: Add Notes**
- System SHALL allow users to add notes to any book
- System SHALL accept notes up to 10,000 characters
- System SHALL support plain text input
- System SHALL record note creation timestamp

**FR-8: Edit Notes**
- System SHALL allow modification of existing notes
- System SHALL record last modified timestamp
- System SHALL preserve note history (optional for V1)

**FR-9: Delete Notes**
- System SHALL allow note deletion
- System SHALL prompt for confirmation
- System SHALL not delete the associated book

**FR-10: View Notes**
- System SHALL display all notes for a selected book
- System SHALL show creation and modification timestamps
- System SHALL display notes in reverse chronological order

---

## 3. Data Model

### 3.1 Entity Relationship Diagram

```
┌─────────────────────┐
│       Books         │
├─────────────────────┤
│ id (PK)             │
│ title               │
│ author              │
│ status              │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│       Notes         │
├─────────────────────┤
│ id (PK)             │
│ book_id (FK)        │
│ content             │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

### 3.2 Database Schema

#### Books Table

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Want to Read',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('Want to Read', 'Currently Reading', 'Finished'))
);

CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_created_at ON books(created_at DESC);
```

#### Notes Table

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_book_id ON notes(book_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
```

---

## 4. API Specifications

### 4.1 Book Endpoints

**GET /api/books**
- Description: Retrieve all books
- Query Parameters:
  - `status` (optional): Filter by reading status
  - `sort` (optional): Sort order (title, author, created_at)
- Response: Array of book objects

**POST /api/books**
- Description: Create new book
- Request Body:
  ```json
  {
    "title": "string (required)",
    "author": "string (required)",
    "status": "string (optional, default: Want to Read)"
  }
  ```
- Response: Created book object with ID

**PUT /api/books/:id**
- Description: Update existing book
- Request Body:
  ```json
  {
    "title": "string (optional)",
    "author": "string (optional)",
    "status": "string (optional)"
  }
  ```
- Response: Updated book object

**DELETE /api/books/:id**
- Description: Delete book and associated notes
- Response: 204 No Content

### 4.2 Notes Endpoints

**GET /api/books/:bookId/notes**
- Description: Retrieve all notes for a book
- Response: Array of note objects

**POST /api/books/:bookId/notes**
- Description: Create new note for a book
- Request Body:
  ```json
  {
    "content": "string (required)"
  }
  ```
- Response: Created note object with ID

**PUT /api/notes/:id**
- Description: Update existing note
- Request Body:
  ```json
  {
    "content": "string (required)"
  }
  ```
- Response: Updated note object

**DELETE /api/notes/:id**
- Description: Delete note
- Response: 204 No Content

---

## 5. User Interface Requirements

### 5.1 Views

**UI-1: Book List View**
- SHALL display all books in card or table format
- SHALL show title, author, and status
- SHALL provide filter controls for status
- SHALL provide sort controls
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

**UI-5: Breakpoints**
- Desktop: >= 1024px (multi-column layout)
- Tablet: 768px - 1023px (two-column layout)
- Mobile: < 768px (single-column layout)

---

## 6. Non-Functional Requirements

### 6.1 Performance

**NFR-1: Response Time**
- Page load time SHALL be < 2 seconds
- API response time SHALL be < 500ms for standard queries
- Search/filter operations SHALL complete < 1 second

**NFR-2: Scalability**
- System SHALL support up to 1,000 books per user
- System SHALL support up to 100 notes per book
- System SHALL handle concurrent requests from single user

### 6.2 Security

**NFR-3: Data Protection**
- System SHALL store passwords using bcrypt hashing (when auth is added)
- System SHALL use HTTPS for all communications
- System SHALL implement CORS protection
- System SHALL sanitize all user inputs

**NFR-4: Authentication (Future)**
- System architecture SHALL support adding authentication later
- Database schema SHALL support user association

### 6.3 Reliability

**NFR-5: Availability**
- System SHALL have 99% uptime during business hours
- System SHALL gracefully handle database connection failures
- System SHALL provide meaningful error messages

**NFR-6: Data Integrity**
- System SHALL enforce foreign key constraints
- System SHALL use database transactions for multi-step operations
- System SHALL validate data before persistence

### 6.4 Usability

**NFR-7: User Experience**
- System SHALL require zero training for basic operations
- System SHALL provide clear visual feedback for all actions
- System SHALL use consistent UI patterns throughout
- System SHALL be accessible via keyboard navigation

### 6.5 Maintainability

**NFR-8: Code Quality**
- Code SHALL follow standard style guidelines
- Code SHALL include unit tests for business logic
- Code SHALL include comments for complex logic
- Code SHALL use TypeScript for type safety

---

## 7. Technical Constraints

### 7.1 Technology Stack

**Frontend:**
- Framework: React 18+
- Language: TypeScript 5+
- Build Tool: Vite
- Styling: Tailwind CSS

**Backend:**
- Runtime: Node.js 18+
- Framework: Express
- Language: TypeScript 5+
- ORM: To be determined (Prisma or raw SQL)

**Database:**
- PostgreSQL 14+

**Deployment:**
- Frontend: Vercel or similar
- Backend: Heroku, Railway, or similar
- Database: Managed PostgreSQL service

### 7.2 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

## 8. Acceptance Criteria

### 8.1 Functional Acceptance

The system is acceptable when:

✅ User can add a book with title and author  
✅ User can view list of all books  
✅ User can filter books by reading status  
✅ User can change a book's reading status  
✅ User can add notes to a book  
✅ User can edit existing notes  
✅ User can delete books and notes  
✅ All data persists across sessions  
✅ UI is responsive on mobile and desktop  

### 8.2 Technical Acceptance

✅ All API endpoints return expected responses  
✅ Database schema supports all operations  
✅ No SQL injection vulnerabilities  
✅ No XSS vulnerabilities  
✅ Code passes linting standards  
✅ Unit tests cover critical paths  
✅ Application deploys successfully  

---

## 9. Open Questions

1. Should we support multiple users from the start or add later?  
   **Decision: Add later (out of scope for V1)**

2. Do we need book cover images?  
   **Decision: Nice to have, not MVP**

3. Should notes support markdown formatting?  
   **Decision: Plain text for MVP, markdown in V2**

4. Import from Goodreads or similar?  
   **Decision: Out of scope for V1**

---

## 10. Dependencies

### 10.1 External Dependencies

- Node.js runtime
- PostgreSQL database
- Web hosting service
- Domain name (optional)

### 10.2 Development Dependencies

- Git for version control
- Code editor (VS Code recommended)
- PostgreSQL client (pgAdmin or similar)
- Postman or similar for API testing

---

## 11. Assumptions

1. User has modern web browser
2. User has stable internet connection
3. Single user usage (no concurrent access by multiple users)
4. Data volume will remain under 10,000 records total
5. User is comfortable with English-language interface

---

## Appendix

**Related Documents:**
- [Executive SRS](0001-srs-executive-reading-list.md) - High-level overview
- [Product Requirements Document](0001-prd-reading-list.md) - Detailed feature requirements (Step 2)
- [Task List](0001-tasks-reading-list.md) - Implementation tasks (Step 3)
- [Tech Stack](0001-tech-stack.md) - Technology decisions (Step 4)

**Glossary:**
- **Book:** A literary work tracked in the system
- **Note:** User-generated text associated with a book
- **Status:** Current reading state (Want to Read, Currently Reading, Finished)
- **MVP:** Minimum Viable Product - smallest feature set for launch

---

**Document History:**
- v1.0 (2025-11-03): Initial technical specification created via discovery interview process
