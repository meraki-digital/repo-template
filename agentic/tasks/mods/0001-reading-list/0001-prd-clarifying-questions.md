# PRD Clarifying Questions
## Reading List Tracker

**Mod:** 0001-reading-list
**Date:** 2025-11-03
**Status:** 🚧 Awaiting Completion
**Based on:** 0001-srs-executive-reading-list.md, 0001-srs-technical-reading-list.md

---

## Instructions

I've reviewed your SRS documents. Before creating the detailed Product Requirements Document (PRD), I need to clarify a few specifics about features, priorities, and acceptance criteria for this localhost/localStorage application.

**When you're done answering, reply with "Complete" and I'll generate your PRD.**

---

## 1. Feature Priorities & Scope

### 1.1 Duplicate Detection
The SRS mentions preventing duplicate books. How should this work?

**Options:**
a) Block duplicates (same title + author = error)
b) Warn but allow (show warning, let user decide)
c) No duplicate detection for V1

**Answer:**
A

### 1.2 Delete Confirmations
Should deletions require confirmation?

**Answer:**
Yes

### 1.3 Multiple "Currently Reading" Books
Can you have multiple books marked as "Currently Reading" at once?

**Answer:**
Yes

---

## 2. Notes Functionality

### 2.1 Note Character Limit
What's the maximum length for a note?

**Options:**
a) 500 characters (tweet-length)
b) 1,000 characters (short paragraph)
c) 10,000 characters (multiple paragraphs)
d) Unlimited

**Answer:**
C

### 2.2 Multiple Notes Per Book
Can a book have multiple notes?

**Answer:**
Yes

### 2.3 Note Editing
Should you be able to edit notes after creation?

**Answer:**
Yes

### 2.4 Note Timestamps
Should notes show when they were created/edited?

**Answer:**
Yes

---

## 3. Book List & Filtering

### 3.1 Default Sort Order
When viewing the book list, what should the default sort be?

**Options:**
a) Alphabetical by title
b) Alphabetical by author
c) Most recently added first
d) Most recently updated first

**Answer:**
B

### 3.2 Filter Persistence
When you filter the list (e.g., shows only "Finished" books), should that filter stay active when you navigate away and come back?

**Answer:**
Yes

### 3.3 Empty States
What should you see when:
- The list is empty (no books added yet)?
- A filter returns no results?

**Answer:**
The list is empty (no books added yet)?
(Prepopulate with 5 sample books for me. Be whimsical.)
---

## 4. Form Validation & Errors

### 4.1 Required Fields
Which fields are required when adding a book?

**Answer:**
You decide

### 4.2 Validation Rules
Any specific validation rules for title and author?

**Answer:**
You decide.

### 4.3 Error Messages
What style of error messages do you prefer?

**Options:**
a) Technical ("Title field is required")
b) Friendly ("Please enter a book title")
c) Very friendly ("Oops! We need a title for this book")

**Answer:**
C

---

## 5. User Experience Details

### 5.1 Book Status Change
How should you change a book's status?

**Options:**
a) Dropdown/select menu
b) Button group (three buttons, highlight active one)
c) Click the status badge to cycle through options

**Answer:**
A

### 5.2 Adding Notes - Where?
Where should the "Add Note" functionality live?

**Options:**
a) From the book list (quick add)
b) Only in book detail view
c) Both places

**Answer:**
C

### 5.3 Edit Book Details
How should you edit a book's title or author?

**Options:**
a) Click title/author to edit inline
b) Dedicated "Edit" button that opens a form/modal
c) Always editable (no save button needed)

**Answer:**
You decide
---

## 6. localStorage Specific Questions

### 6.1 Storage Warnings
Should the app warn you when localStorage is getting full?

**Options:**
a) No warnings (handle it when it breaks)
b) Warn at 80% capacity
c) Show storage usage indicator always visible

**Answer:**
B

### 6.2 Data Export/Import Priority
How important is export/import functionality?

**Options:**
a) Must have for V1 (backup is critical)
b) Nice to have for V1
c) Defer to V2

**Answer:**
C

### 6.3 Data Loss Handling
What should happen if localStorage data gets corrupted or cleared?

**Answer:**
Is it possible to save to a text file periodically for disaster recovery?
---

## 7. Performance & Scale

### 7.1 Expected Data Volume
How many books do you expect to track?

**Answer:**
100

### 7.2 Performance Targets
What response times are acceptable?

**Answer:**
You decide

---

## 8. Success Criteria

### 8.1 MVP Definition
What's the minimum you'd consider a working MVP?

**Answer:**
I can track my reading more easily than I do now.

### 8.2 Acceptance Criteria
How will you test that each feature works?

**Answer:**
Manually

---

## 9. Localhost Development

### 9.1 Development Server
How do you prefer to run the app during development?

**Options:**
a) npm run dev (Vite dev server)
b) Open index.html directly in browser
c) Simple http-server or similar

**Answer:**
A

### 9.2 Production Build
Do you want a production build, or just run the dev server?

**Options:**
a) Production build (optimized, minified files)
b) Dev mode is fine (simpler, easier to debug)

**Answer:**
B

---

## 10. Future Considerations

### 10.1 Features You Might Add Later
What's on your wishlist for V2?

**Answer:**
Don't have one

### 10.2 Moving to Cloud Later?
Any chance you'd want to move this to a cloud/hosted version in the future?

**Answer:**
Unlikely

---

## Additional Context

**Any other clarifications needed before creating the PRD?**

**Answer:**
I think this covers it.

---

**Status:** Complete

**Next step:** Fill out answers above and reply "Complete"
