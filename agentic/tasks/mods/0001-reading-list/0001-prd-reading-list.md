# Product Requirements Document
## Reading List Tracker

**Version:** 1.0  
**Date:** 2025-11-03  
**Status:** Approved  
**Owner:** You

---

## 1. Introduction

### 1.1 Purpose

This PRD defines the detailed requirements for the Reading List Tracker application - a localhost-only, localStorage-based web app for tracking your personal reading list. It translates the high-level vision from the SRS documents into specific, actionable feature requirements suitable for implementation.

### 1.2 Scope

This document covers the Minimum Viable Product (MVP) release of the Reading List Tracker, focusing on:
- Core book tracking and note-taking functionality
- Single-user, localhost operation
- Browser localStorage for all data persistence
- No backend server or external database

---

## 2. Goals

### 2.1 Primary Goals

1. **Effortless Tracking:** Enable you to record books in under 30 seconds
2. **Easy Recall:** Allow you to find and view notes about any book quickly
3. **Organized Reading Life:** Provide a single source of truth for all reading history
4. **Zero Infrastructure:** No setup beyond opening the app in your browser

### 2.2 Success Metrics

- You can track reading more easily than you do now
- Data persists reliably in localStorage
- App runs smoothly on localhost with no configuration
- 100 books stored without performance issues

---

## 3. User Stories

### 3.1 Core Stories (Must Have)

**US-1: Add a Book**
```
As a reader
I want to add a book to my list
So that I can track what I've read or want to read
```
**Acceptance Criteria:**
- Can enter book title and author
- Can optionally set reading status
- Book appears in list immediately after adding
- System prevents duplicate entries (same title + author)
- Shows friendly error if duplicate detected

**US-2: Update Reading Status**
```
As a reader
I want to mark a book with a reading status
So that I can track my reading progress
```
**Acceptance Criteria:**
- Can change status via dropdown menu
- Status changes persist in localStorage
- Can have multiple books as "Currently Reading"
- Visual indication shows current status clearly

**US-3: Add Notes to a Book**
```
As a reader
I want to add notes about a book
So that I can remember my thoughts and reactions
```
**Acceptance Criteria:**
- Can add notes from book list (quick add) or detail view
- Can add multiple notes to one book
- Notes support up to 10,000 characters
- Notes save immediately to localStorage
- Notes show timestamps (created and updated)

**US-4: View My Reading List**
```
As a reader
I want to see all my books at a glance
So that I can browse my reading history
```
**Acceptance Criteria:**
- All books display in scannable card/grid format
- List shows title, author, and status for each book
- Default sort: Alphabetical by author
- Books load from localStorage on page load

**US-5: Filter by Reading Status**
```
As a reader
I want to filter my list by reading status
So that I can see only books in a specific category
```
**Acceptance Criteria:**
- Can filter for "Want to Read", "Currently Reading", or "Finished"
- Can view "All" books (no filter)
- Filter persists when navigating between views
- Filtered view clearly indicates active filter

**US-6: Edit Book and Notes**
```
As a reader
I want to edit book details and notes
So that I can correct mistakes or update information
```
**Acceptance Criteria:**
- Can edit book title, author, and status
- Can edit note content
- Changes save immediately to localStorage
- Timestamps update when edited

**US-7: Delete Books and Notes**
```
As a reader
I want to remove books or notes I no longer need
So that I can keep my list curated
```
**Acceptance Criteria:**
- Deletion requires confirmation (friendly message)
- Deleting a book deletes all associated notes
- Deleting a note doesn't delete the book
- Changes save immediately to localStorage

---

## 4. Functional Requirements

### 4.1 Initial Data State

**FR-1: Sample Data**
- System SHALL prepopulate localStorage with 5 whimsical sample books on first load
- Sample books SHALL include:
  - "The Hitchhiker's Guide to the Galaxy" by Douglas Adams (Finished)
  - "Where's Waldo in the Quantum Realm?" by Schrödinger's Cat (Want to Read)
  - "Cooking with Chaos: A Dragon's Guide to BBQ" by Smaug the Magnificent (Currently Reading)
  - "101 Uses for a Dead Laptop" by Marie Kondo (Finished)
  - "Procrastination for Dummies (Coming Soon)" by Anonymous (Want to Read)
- Each sample book SHALL have at least one note
- System SHALL NOT add samples if any books already exist in localStorage

### 4.2 Book Management

**FR-2: Create Book**
- System MUST accept title (required, 1-255 characters, cannot be only whitespace)
- System MUST accept author (required, 1-255 characters, cannot be only whitespace)
- System MUST accept optional status selection (defaults to "Want to Read")
- System MUST block duplicates (matching title AND author, case-insensitive)
- System MUST show friendly error: "Oops! Looks like you already have this book in your list!"
- System MUST assign UUID to each book
- System MUST save to localStorage immediately
- System MUST display very friendly success message

**FR-3: Read Books**
- System MUST display all books in card/grid format
- System MUST show title, author, and status badge for each book
- System MUST sort by author name (alphabetically) by default
- System MUST load books from localStorage on page load
- System MUST handle empty state with sample books (see FR-1)

**FR-4: Update Book**
- System MUST allow editing title and author via dedicated edit mechanism (modal or form)
- System MUST allow changing reading status via dropdown
- System MUST validate that title and author are not empty
- System MUST show friendly error: "Oops! We need both a title and author!"
- System MUST update timestamp when modified
- System MUST save to localStorage immediately

**FR-5: Delete Book**
- System MUST prompt for confirmation with friendly message: "Are you sure you want to delete this book? All your notes will be removed too!"
- System MUST cascade delete all associated notes
- System MUST save changes to localStorage immediately
- System MUST show success message: "Book deleted! We'll miss it."

### 4.3 Reading Status Management

**FR-6: Status Options**
- System MUST support exactly three status values:
  - "Want to Read"
  - "Currently Reading"
  - "Finished"

**FR-7: Status Updates**
- System MUST use dropdown/select menu for status changes
- System MUST allow multiple books with "Currently Reading" status
- System MUST persist status in localStorage immediately
- System MUST show visual indicator of current status (color-coded badge)
- System MUST record timestamp of status change

**FR-8: Status Filtering**
- System MUST allow filtering list by any status value
- System MUST allow viewing "All" books (no filter)
- System MUST persist active filter in localStorage
- System MUST restore filter on page reload
- System MUST clearly indicate when filter is active

### 4.4 Notes Management

**FR-9: Create Note**
- System MUST allow adding notes from book list view (quick add button)
- System MUST allow adding notes from book detail view
- System MUST accept note content (1-10,000 characters)
- System MUST validate content is not empty
- System MUST show friendly error: "Oops! Your note is empty. Add some thoughts!"
- System MUST associate note with correct book (via bookId)
- System MUST record creation timestamp
- System MUST save to localStorage immediately

**FR-10: Read Notes**
- System MUST display all notes for a selected book
- System MUST show notes in reverse chronological order (newest first)
- System MUST display creation and update timestamps
- System MUST format timestamps in friendly way (e.g., "2 hours ago", "Nov 3, 2025")
- System MUST clearly associate notes with their book

**FR-11: Update Note**
- System MUST allow editing note content
- System MUST validate content is not empty
- System MUST record last modified timestamp
- System MUST save to localStorage immediately

**FR-12: Delete Note**
- System MUST prompt for confirmation: "Delete this note? This can't be undone!"
- System MUST NOT delete the associated book
- System MUST save changes to localStorage immediately

### 4.5 localStorage Management

**FR-13: Data Persistence**
- System MUST use localStorage API for all data storage
- System MUST save data as JSON strings under keys: 'books', 'notes', 'appState'
- System MUST validate JSON on load (handle corrupt data gracefully)
- System MUST initialize with sample data if localStorage is empty (first run)

**FR-14: Storage Monitoring**
- System MUST estimate localStorage usage
- System MUST warn when usage exceeds 80% of typical browser limit (~4MB)
- System MUST show friendly warning: "Heads up! Your reading list is getting pretty full. Consider exporting a backup."
- System MUST handle quota exceeded errors gracefully

**FR-15: Auto-Backup to Text File**
- System MUST automatically save data to downloadable text file periodically
- System MUST save backup every 10 book/note changes or every hour (whichever comes first)
- System MUST format backup as JSON for easy reimport
- System MUST include timestamp in filename: `reading-list-backup-YYYY-MM-DD-HHMM.json`
- System MUST trigger download to user's default downloads folder
- System MUST show friendly notification: "Auto-backup saved to your downloads!"

**FR-16: Data Recovery**
- System MUST provide manual "Export Data" button
- System MUST export all books and notes as JSON file
- System MUST provide manual "Import Data" button
- System MUST validate imported JSON structure
- System MUST show friendly error if import fails: "Oops! That file doesn't look right. Make sure it's a backup from this app."
- System MUST confirm before overwriting existing data: "This will replace all your current books and notes. Continue?"

### 4.6 User Interface

**FR-17: Navigation**
- System MUST provide clear navigation between:
  - Book list view
  - Book detail view (with notes)
  - Add/Edit book forms
- System MUST include "Back" navigation from all detail views
- System MUST use browser routing (URL changes with navigation)

**FR-18: Responsive Design** (Nice to have)
- System SHOULD adapt layout for different screen sizes
- System SHOULD work on laptop/desktop screens (primary target)
- System MAY work on tablets (bonus, not required)
- System does NOT need mobile phone optimization

**FR-19: Feedback & Messaging**
- System MUST provide visual feedback for all user actions
- System MUST use very friendly, whimsical error messages
- System MUST show success confirmations for create/update/delete
- System MUST display loading indicators for operations > 100ms (rare with localStorage)
- System MUST use toast/notification style for non-blocking messages

---

## 5. Non-Goals (Out of Scope for V1)

The following are explicitly **NOT** included in this release:

❌ **Data Export/Import:** Deferred to V2 (auto-backup only for V1)  
❌ **User Authentication:** Single-user application, no login  
❌ **Cloud Sync:** Localhost only, no multi-device support  
❌ **Book Cover Images:** Text-only for V1  
❌ **Advanced Search:** Filter-only for V1  
❌ **Reading Statistics:** No charts or analytics  
❌ **Goodreads Integration:** Standalone system  
❌ **Mobile Apps:** Browser-based only  
❌ **Markdown Support:** Plain text notes only  
❌ **Production Build:** Dev mode only (simpler, easier to debug)  
❌ **Backend Server:** Frontend-only architecture  
❌ **Database:** localStorage only  

These features may be considered for future releases if needed.

---

## 6. Design Considerations

### 6.1 UI/UX Guidelines

**Visual Design:**
- Clean, minimal interface inspired by Notion
- Generous whitespace, not cluttered
- High contrast for readability
- Color-coded status badges:
  - Want to Read: Gray
  - Currently Reading: Blue
  - Finished: Green
- Whimsical, friendly tone throughout

**Interaction Design:**
- Zero training required for basic operations
- Very friendly error messages and confirmations
- Consistent button placement and terminology
- Clear visual hierarchy
- Immediate feedback for all actions

**Information Architecture:**
```
Home / Book List
├─ Filter Controls (persistent)
├─ Quick Add Note (from list)
├─ Add Book Button
└─ Book Cards/Grid (sorted by author)
    └─ Click → Book Detail
        ├─ Book Info (title, author, status dropdown)
        ├─ Edit/Delete Book
        └─ Notes Section
            ├─ Existing Notes (with timestamps)
            └─ Add Note Button
```

### 6.2 Error Handling

**User-Facing Errors (Very Friendly Style):**
- "Oops! Looks like you already have this book in your list!"
- "Oops! We need both a title and author!"
- "Oops! Your note is empty. Add some thoughts!"
- "Heads up! Your reading list is getting pretty full."
- "Oops! That file doesn't look right."

**Technical Errors (Still Friendly):**
- localStorage quota exceeded: "Your browser storage is full! Try exporting a backup and clearing some old books."
- Corrupt data: "Hmm, something went wrong loading your data. Try importing from a backup file."
- Import validation failed: "That backup file didn't work. Make sure it's from this app!"

---

## 7. Technical Considerations

### 7.1 Technology Stack

**Frontend:**
- React 18 with TypeScript 5
- Vite for dev server (no production build)
- Tailwind CSS for styling
- React Router for navigation

**Storage:**
- Browser localStorage API
- JSON serialization
- UUID for all IDs (crypto.randomUUID())

**Development:**
- Run with `npm run dev` (Vite dev server)
- Opens at `http://localhost:5173`
- Dev mode only (no build step needed)

### 7.2 Data Persistence

**localStorage Keys:**
```typescript
// Data storage
localStorage.setItem('books', JSON.stringify(booksArray));
localStorage.setItem('notes', JSON.stringify(notesArray));

// App state
localStorage.setItem('appState', JSON.stringify({
  activeFilter: 'All',
  version: '1.0'
}));
```

**Data Validation:**
- Validate JSON structure on load
- Provide default empty arrays if corrupt
- Log errors to console for debugging

### 7.3 Auto-Backup Strategy

**Trigger Conditions:**
- Every 10 book/note changes (create, update, delete)
- Every 60 minutes (if changes made)
- Manual export button always available

**Backup Format:**
```json
{
  "version": "1.0",
  "exportedAt": "2025-11-03T15:30:00.000Z",
  "books": [...],
  "notes": [...]
}
```

**Download Mechanism:**
```typescript
function autoBackup() {
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
  a.download = `reading-list-backup-${new Date().toISOString().slice(0,16).replace(/:/g, '')}.json`;
  a.click();
  
  // Show notification
  showToast("Auto-backup saved to your downloads!");
}
```

### 7.4 Sample Data

Initial sample books to prepopulate:

```typescript
const sampleBooks = [
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    status: "Finished",
    notes: ["The answer to life, the universe, and everything is 42. Mind-bending and hilarious!"]
  },
  {
    title: "Where's Waldo in the Quantum Realm?",
    author: "Schrödinger's Cat",
    status: "Want to Read",
    notes: ["He's both there and not there until you observe him. This is going to be confusing..."]
  },
  {
    title: "Cooking with Chaos: A Dragon's Guide to BBQ",
    author: "Smaug the Magnificent",
    status: "Currently Reading",
    notes: ["The flamethrower technique is revolutionary. My neighbors are concerned."]
  },
  {
    title: "101 Uses for a Dead Laptop",
    author: "Marie Kondo",
    status: "Finished",
    notes: ["Spoiler: throwing it away sparks the most joy."]
  },
  {
    title: "Procrastination for Dummies (Coming Soon)",
    author: "Anonymous",
    status: "Want to Read",
    notes: ["Will read this later. Definitely later."]
  }
];
```

### 7.5 Performance Targets

- Page load: < 1 second (localStorage is fast)
- Add/edit/delete operations: < 100ms (synchronous localStorage)
- Filter/search: < 200ms (client-side array operations)
- Support 100+ books without performance degradation

---

## 8. Success Criteria

The MVP is considered complete and successful when:

### 8.1 Functional Completeness

✅ All "Must Have" user stories implemented  
✅ All functional requirements (FR-1 through FR-19) working  
✅ Sample books prepopulate on first load  
✅ Data persists correctly in localStorage  
✅ Auto-backup triggers periodically  
✅ No critical bugs in core flows  

### 8.2 Quality Standards

✅ Application works on Chrome, Firefox, Safari (latest versions)  
✅ Runs successfully on `npm run dev`  
✅ No console errors in normal usage  
✅ All error messages are friendly and whimsical  
✅ Manual testing confirms all features work  

### 8.3 Usability Standards

✅ You can track reading more easily than before  
✅ Adding a book takes < 30 seconds  
✅ Finding notes is quick and intuitive  
✅ All primary actions work without confusion  
✅ No training or documentation needed to use  

---

## 9. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| localStorage cleared by user | Medium | High | Auto-backup feature saves periodic backups |
| localStorage quota exceeded | Low | Medium | Monitor at 80%, warn user, suggest cleanup |
| Browser compatibility issues | Low | Low | Use modern browsers only, test on Chrome/Firefox/Safari |
| Data corruption | Low | Medium | Validate JSON on load, provide manual import/export |

---

## 10. Open Questions & Decisions

### 10.1 Resolved

**Q: How to handle duplicates?**  
A: Block duplicates completely (same title + author)

**Q: Where can you add notes?**  
A: Both from book list (quick add) and book detail view

**Q: What error message style?**  
A: Very friendly, whimsical ("Oops! ...")

**Q: Production build needed?**  
A: No, dev mode is fine (simpler, easier to debug)

**Q: Storage warnings?**  
A: Warn at 80% capacity

**Q: Auto-backup?**  
A: Yes, periodic JSON downloads for disaster recovery

---

## 11. Timeline & Milestones

**Total Estimated Duration:** 5-7 days

### Phase 1: Setup & Foundation (1 day)
- Project scaffolding (Vite + React + TypeScript)
- localStorage service setup
- Basic routing

### Phase 2: Core Features (2-3 days)
- Book CRUD operations
- Reading status management
- Notes CRUD operations
- Sample data initialization

### Phase 3: Polish & UX (1-2 days)
- Friendly error messages
- Status filtering with persistence
- Auto-backup implementation
- Storage monitoring
- Visual polish (Tailwind styling)

### Phase 4: Testing (1 day)
- Manual testing of all flows
- Cross-browser testing
- Edge case testing
- Verify auto-backup works

---

## 12. Approvals

| Role | Name | Status | Date |
|------|------|--------|------|
| Product Owner | You | ✅ Approved | 2025-11-03 |
| Developer | You | ✅ Approved | 2025-11-03 |

---

## Appendix

### Related Documents
- [Executive SRS](0001-srs-executive-reading-list.md)
- [Technical SRS](0001-srs-technical-reading-list.md)
- [Clarifying Questions](0001-prd-clarifying-questions.md)
- [Task List](0001-tasks-reading-list.md) - Generated in Step 3
- [Tech Stack](0001-tech-stack.md) - Generated in Step 4

### Glossary
- **localStorage:** Browser API for storing key-value pairs persistently (5-10MB limit)
- **UUID:** Universally Unique Identifier (for book/note IDs)
- **SPA:** Single-Page Application
- **Localhost:** Application runs on your local computer only
- **Whimsical:** Playfully quaint or fanciful (our error message style!)

---

**Document History:**
- v1.0 (2025-11-03): Initial PRD created from SRS documents and clarifying questions (localhost/localStorage version with auto-backup)
