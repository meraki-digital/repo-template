# Tech Stack Document
## Reading List Tracker

**Project:** Reading List Tracker  
**Version:** 1.0  
**Date:** 2025-11-03  
**Status:** Approved

---

## Overview

This document outlines the complete technology stack for the Reading List Tracker - a localhost-only, frontend web application using browser localStorage for data persistence. No backend server, no database, no hosting complexity.

---

## Architecture Pattern

**Frontend-Only Single Page Application (SPA)**

```
┌─────────────────────────────────────┐
│    User (Desktop Browser)           │
│      http://localhost:5173          │
└──────────────┬──────────────────────┘
               │
               │ Loads static files
               │
┌──────────────▼──────────────────────┐
│   Frontend Application              │
│    React + TypeScript               │
│    Vite Dev Server                  │
└──────────────┬──────────────────────┘
               │
               │ Read/Write (JSON)
               │
┌──────────────▼──────────────────────┐
│   Browser localStorage              │
│   (5-10MB Key-Value Store)          │
└─────────────────────────────────────┘
```

**Pattern:** Client-side SPA with localStorage persistence  
**Communication:** Direct localStorage API calls  
**Data Flow:** Component → Hook → Service → localStorage API

---

## Frontend Stack

### Core Framework: React 18

**Why React:**
- Component-based architecture perfect for book cards, forms, and modals
- Strong TypeScript support
- Hooks provide clean state management without Redux
- Fast development with hot module replacement
- Familiar to most developers
- Massive ecosystem for any future needs

**Alternatives Considered:**
- Vanilla JavaScript: Too much boilerplate for interactive UI
- Vue: Good option, but React's TypeScript integration is better
- Svelte: Interesting but smaller ecosystem

**Decision:** React's maturity, TypeScript support, and developer experience make it the clear choice.

### Language: TypeScript 5

**Why TypeScript:**
- Catch bugs at compile time (especially important with localStorage data)
- Excellent autocomplete and IDE support
- Type-safe localStorage operations prevent runtime errors
- Self-documenting code through type definitions
- Makes refactoring safer

**Example benefit:**
```typescript
// TypeScript catches this at compile time
const book: Book = {
  title: "The Hobbit",
  author: "Tolkien",
  status: "Reading" // ❌ Error: not a valid ReadingStatus
};

// Correct
const book: Book = {
  title: "The Hobbit", 
  author: "Tolkien",
  status: "Currently Reading" // ✅ Valid
};
```

**Alternative:**
- JavaScript: Simpler to start, but localStorage data bugs are painful

**Decision:** TypeScript's safety is worth the learning curve.

### Build Tool: Vite

**Why Vite:**
- Lightning-fast dev server with instant HMR
- No build needed for development (dev mode only for this project)
- Excellent TypeScript support out of the box
- Modern, actively maintained
- Simple configuration
- Fast enough that we don't need a production build

**Alternatives:**
- Create React App: Deprecated, slow
- Webpack: Overkill for a simple SPA
- Parcel: Good but less popular

**Decision:** Vite provides the best developer experience. Since we're staying in dev mode, we get instant updates without build steps.

### Styling: Tailwind CSS 3

**Why Tailwind:**
- Utility-first approach = fast development
- No CSS file juggling
- Built-in responsive design utilities
- Consistent spacing and colors
- Easy to create whimsical, friendly UI
- Purges unused styles automatically

**Example:**
```tsx
// Instead of writing CSS
<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">

// vs custom CSS
<div className="book-card">
  .book-card {
    max-width: 56rem;
    margin: 0 auto;
    padding: 1.5rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
```

**Alternatives:**
- CSS Modules: More setup, harder to maintain consistency
- Styled Components: Runtime overhead
- Plain CSS: Too much custom code

**Decision:** Tailwind is the fastest path to a polished, friendly UI.

### Routing: React Router v6

**Why React Router:**
- De facto standard for React routing
- Clean, declarative route configuration
- Excellent TypeScript support
- Handles browser history and navigation
- URL parameters for book detail pages

**Alternatives:**
- TanStack Router: Newer, type-safe but less mature
- Wouter: Minimal but lacks features
- No router: Multi-page would require full reloads

**Decision:** React Router is proven and has everything we need.

---

## Data Storage

### Browser localStorage API

**Why localStorage:**
- Built into every modern browser
- Persistent (survives browser restarts)
- Simple key-value API
- Synchronous (no async complexity)
- 5-10MB capacity (plenty for 100+ books)
- No server or database setup needed
- Perfect for single-user, localhost apps

**How it works:**
```typescript
// Save data
localStorage.setItem('books', JSON.stringify(booksArray));

// Load data
const data = localStorage.getItem('books');
const books = data ? JSON.parse(data) : [];

// Delete data
localStorage.removeItem('books');
```

**Limitations & Mitigations:**
- **5-10MB limit:** Monitor usage, warn at 80%, provide auto-backup
- **String-only storage:** Use JSON.stringify/parse
- **Synchronous blocking:** Not an issue for our data size
- **Per-origin isolation:** Different browsers = different storage (solved with export/import)

**Alternatives Considered:**
- IndexedDB: Overkill for simple key-value data
- sessionStorage: Doesn't persist across browser restarts
- PostgreSQL: Way too complex for localhost-only app
- File system: Requires backend server

**Decision:** localStorage is perfect for this use case. Simple, reliable, built-in.

---

## Development Tools

### Package Manager: npm

**Why npm:**
- Comes with Node.js (no extra install)
- Largest package registry
- Simple, well-understood
- `npm run dev` is intuitive

**Alternatives:**
- yarn: Faster but npm is simpler
- pnpm: Efficient but less common

**Decision:** npm is default and sufficient.

### Version Control: Git

**Why Git:**
- Industry standard
- Tracks all changes
- Easy to experiment with branches
- Works offline

### Code Quality: ESLint + Prettier (Optional)

**If added:**
- ESLint catches common mistakes
- Prettier auto-formats code
- TypeScript already catches most errors

**Decision:** Optional for this project. TypeScript does heavy lifting.

---

## Key Libraries & Dependencies

### Production Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  }
}
```

**That's it!** No backend libraries, no database drivers, no API clients.

### Development Dependencies

```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

**Minimal dependencies = faster installs, fewer vulnerabilities, easier maintenance.**

---

## Development Environment

### How to Run

```bash
# Install dependencies (once)
npm install

# Run development server
npm run dev

# Opens at http://localhost:5173
# Auto-reloads on file changes
```

**That's it!** No database to set up, no backend to configure, no environment variables needed.

### Project Structure

```
reading-list/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components (List, Detail)
│   ├── hooks/           # Custom hooks (useBooks, useNotes)
│   ├── services/        # localStorage services
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Main app + routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind imports
├── public/              # Static assets
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── tailwind.config.js   # Tailwind config
└── README.md            # How to run
```

---

## Data Persistence Strategy

### localStorage Schema

**Keys:**
- `books` - JSON array of Book objects
- `notes` - JSON array of Note objects  
- `appState` - JSON object with app settings (active filter, version)

**Data Formats:**

```typescript
// Book object
interface Book {
  id: string;              // UUID
  title: string;           
  author: string;          
  status: ReadingStatus;   
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

// Note object
interface Note {
  id: string;              // UUID
  bookId: string;          // Foreign key to Book
  content: string;         
  createdAt: string;       
  updatedAt: string;       
}

// App state
interface AppState {
  activeFilter: string;    // 'All' | 'Want to Read' | etc.
  version: string;         // '1.0'
}
```

### Auto-Backup System

**Why we need it:**
- localStorage can be cleared by user
- Browser updates might corrupt data
- Moving to new computer requires data transfer
- Peace of mind

**How it works:**
1. Track number of changes (create/update/delete)
2. Every 10 changes → trigger auto-backup
3. Every 60 minutes (if changes exist) → trigger auto-backup
4. Download JSON file to Downloads folder
5. Show friendly toast: "Auto-backup saved to your downloads!"

**Backup format:**
```json
{
  "version": "1.0",
  "exportedAt": "2025-11-03T15:30:00.000Z",
  "books": [...],
  "notes": [...]
}
```

**Manual export/import (deferred to V2):**
- User can manually export anytime
- User can import from backup file
- Validates structure before importing

---

## Browser Compatibility

### Supported Browsers

- **Chrome** 90+ (latest 2 versions)
- **Firefox** 88+ (latest 2 versions)
- **Safari** 14+ (latest 2 versions)
- **Edge** 90+ (latest 2 versions)

### Required Browser Features

- ✅ localStorage API
- ✅ ES2020+ JavaScript support
- ✅ CSS Grid and Flexbox
- ✅ crypto.randomUUID() for IDs

**No Internet Explorer support.** Modern browsers only.

---

## Performance Considerations

### localStorage Performance

**Characteristics:**
- Synchronous API (blocks main thread)
- ~5ms read/write for typical data
- ~50ms for large JSON parse/stringify

**Our usage:**
- 100 books + 500 notes = ~200KB JSON
- Parse time: < 10ms
- No performance issues expected

**Optimization strategies:**
- Load data once on mount
- Keep in React state during session
- Only save to localStorage on changes
- Debounce rapid saves if needed (unlikely)

### React Performance

**Not an issue for this app:**
- < 100 book cards rendered
- Simple component tree
- No complex calculations
- No large lists needing virtualization

**If performance becomes an issue (unlikely):**
- Add React.memo() to BookCard
- Virtualize long lists with react-window
- Debounce filter/search

---

## Security Considerations

### Current Security Posture

**localStorage security:**
- Data stored in plain text (visible in DevTools)
- Isolated per origin (localhost:5173)
- Not accessible to other websites
- Cleared if user clears browser data

**For this personal, localhost app:**
- ✅ No sensitive data (just book titles and notes)
- ✅ Single user (no authentication needed)
- ✅ Localhost only (not exposed to internet)
- ✅ No XSS risk (we control all inputs)

**If this were production:**
- Encrypt localStorage data
- Add user authentication
- Use HTTPS
- Sanitize all inputs
- Add CSRF protection

**Decision:** Security is appropriate for personal, localhost use case.

---

## Deployment Model

### Development (Primary Usage)

```bash
npm run dev
# Runs on http://localhost:5173
# Hot module replacement enabled
# No build step needed
```

**This is how you'll use the app.** No production deployment needed.

### "Production" Build (Optional, Not Required)

If you ever want to distribute the app:

```bash
npm run build
# Creates dist/ folder
# Can open dist/index.html in any browser
# Or serve with simple http server
```

**But for V1:** Just use `npm run dev`. It's simple and works great.

---

## Technology Decision Matrix

| Category | Technology | Complexity | Learning Curve | Performance | Rationale |
|----------|-----------|------------|----------------|-------------|-----------|
| Framework | React 18 | Medium | Medium | High | Best ecosystem |
| Language | TypeScript | Medium | Medium | High | Type safety |
| Build Tool | Vite | Low | Low | Very High | Fast dev server |
| Styling | Tailwind | Low | Low | High | Rapid development |
| Routing | React Router | Low | Low | High | Standard solution |
| Storage | localStorage | Very Low | Very Low | High | Built-in, simple |
| Dev Server | Vite | Very Low | Very Low | Very High | No build needed |

**Overall Complexity:** Medium-Low (simpler than full-stack apps)

---

## What We're NOT Using (and Why)

### No Backend

❌ **Express/Node.js:** Not needed for localStorage  
❌ **API endpoints:** localStorage is the API  
❌ **Authentication:** Single-user, localhost only  
❌ **Session management:** No users to manage  

### No Database

❌ **PostgreSQL:** Overkill for 100 books  
❌ **MongoDB:** localStorage is simpler  
❌ **SQLite:** Would require backend  
❌ **IndexedDB:** More complex than localStorage for our needs  

### No State Management Library

❌ **Redux:** React hooks + context are sufficient  
❌ **Zustand:** Not needed for this scale  
❌ **Jotai:** Too simple to justify library  

### No Backend-as-a-Service

❌ **Firebase:** Adds complexity, requires internet  
❌ **Supabase:** Overkill for localhost app  
❌ **AWS Amplify:** Way too complex  

### No Testing Framework (For V1)

❌ **Jest:** Manual testing is sufficient  
❌ **Vitest:** Not needed for personal project  
❌ **React Testing Library:** Manual testing works  

**V2 consideration:** If app grows, add automated tests.

### No Production Build

❌ **Optimized bundles:** Dev mode is fast enough  
❌ **Code splitting:** Entire app is < 100KB  
❌ **Minification:** Not deployed anywhere  

---

## Sample Implementation

### localStorage Service Example

```typescript
// src/services/books.ts
import { Book } from '../types';

const BOOKS_KEY = 'books';

export function loadBooks(): Book[] {
  const data = localStorage.getItem(BOOKS_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    console.error('Failed to parse books from localStorage');
    return [];
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Storage full! Export a backup and delete old books.');
    }
    throw error;
  }
}

export function createBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book {
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
```

### Custom Hook Example

```typescript
// src/hooks/useBooks.ts
import { useState, useEffect } from 'react';
import { Book } from '../types';
import * as bookService from '../services/books';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(bookService.loadBooks());
  }, []);

  const createBook = (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBook = bookService.createBook(book);
    setBooks([...books, newBook]);
    return newBook;
  };

  // ... other CRUD operations

  return { books, createBook, updateBook, deleteBook };
}
```

---

## Maintenance & Updates

### Dependency Updates

**Strategy:** Update quarterly for security patches

- **React:** Update within 6 months of new releases
- **TypeScript:** Stay on latest stable
- **Vite:** Update for performance improvements
- **Tailwind:** Update for new utilities

**How to update:**
```bash
npm outdated          # See what's outdated
npm update            # Update minor versions
npm install pkg@latest  # Update major versions manually
```

### localStorage Version Management

**Current approach:**
- Store version in appState: `{ version: '1.0' }`
- Check on load, migrate if needed

**Future migrations:**
```typescript
function migrateData(version: string) {
  if (version === '1.0') {
    // Migrate to 2.0 if needed
    // Add new fields, rename keys, etc.
  }
}
```

---

## Summary

### The Stack in One Sentence

A TypeScript-powered React SPA with Tailwind styling and localStorage persistence, running on Vite dev server for localhost-only use.

### Why This Stack Works

- **Zero Infrastructure:** No servers, no databases, no deployment
- **Fast Development:** Vite + React + Tailwind = rapid iteration
- **Type Safe:** TypeScript catches bugs before they happen
- **Simple:** Just `npm run dev` and you're coding
- **Reliable:** localStorage is built-in and battle-tested
- **Personal:** Perfect for single-user, localhost apps

### What Makes This Different

Most web apps require:
- Backend server (Express, Django, etc.)
- Database (PostgreSQL, MongoDB, etc.)
- Hosting (Vercel, Heroku, AWS, etc.)
- Environment variables
- CORS configuration
- Deployment pipelines

**We have none of that.** Just browser, localStorage, and localhost. Simple wins.

---

## Approval & Sign-off

| Aspect | Technology | Status | Date |
|--------|-----------|--------|------|
| Framework | React 18 + TypeScript | ✅ Approved | 2025-11-03 |
| Build Tool | Vite (dev mode only) | ✅ Approved | 2025-11-03 |
| Styling | Tailwind CSS 3 | ✅ Approved | 2025-11-03 |
| Routing | React Router v6 | ✅ Approved | 2025-11-03 |
| Storage | Browser localStorage | ✅ Approved | 2025-11-03 |
| Deployment | Dev server only | ✅ Approved | 2025-11-03 |

**Next Step:** Begin implementation using task list (Step 5)

---

**Document History:**
- v1.0 (2025-11-03): Initial tech stack defined for localhost/localStorage version
