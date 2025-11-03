# PRD Clarifying Questions
## Reading List Tracker

**Mod:** 0001-reading-list  
**Date:** 2025-11-03  
**Status:** ✅ Completed  
**Based on:** 0001-srs-executive-reading-list.md, 0001-srs-technical-reading-list.md

---

## Instructions

I've reviewed your SRS documents. Before creating the detailed Product Requirements Document (PRD), I need to clarify a few specifics about features, priorities, and acceptance criteria.

**When you're done answering, reply with "Complete" and I'll generate your PRD.**

---

## 1. Feature Priorities & Scope

### 1.1 Duplicate Detection
The SRS mentions preventing duplicate books. How should this work?

**Options:**
a) Block duplicates (same title + author = error)  
b) Warn but allow (show warning, let user decide)  
c) No duplicate detection for V1

**Answer:** b) Warn but allow. Sometimes I might want to track reading the same book twice in different years.

### 1.2 Delete Confirmations
Should deletions require confirmation?

**Answer:** Yes, always. For both books and notes. I don't want to accidentally lose data.

### 1.3 Multiple "Currently Reading" Books
Can a user have multiple books marked as "Currently Reading" at once?

**Answer:** Yes! I often read multiple books at the same time (fiction, non-fiction, etc.)

---

## 2. Notes Functionality

### 2.1 Note Character Limit
What's the maximum length for a note?

**Options:**
a) 500 characters (tweet-length)  
b) 1,000 characters (short paragraph)  
c) 10,000 characters (multiple paragraphs)  
d) Unlimited

**Answer:** c) 10,000 characters. I sometimes write long reflections.

### 2.2 Multiple Notes Per Book
Can a book have multiple notes?

**Answer:** Yes! I might add notes as I'm reading, then more notes after I finish.

### 2.3 Note Editing
Should users be able to edit notes after creation?

**Answer:** Yes, definitely. I often want to refine my thoughts.

### 2.4 Note Timestamps
Should notes show when they were created/edited?

**Answer:** Yes, that would be helpful context.

---

## 3. Book List & Filtering

### 3.1 Default Sort Order
When viewing the book list, what should the default sort be?

**Options:**
a) Alphabetical by title  
b) Alphabetical by author  
c) Most recently added first  
d) Most recently updated first

**Answer:** c) Most recently added first. I want to see new books at the top.

### 3.2 Filter Persistence
When a user filters the list (e.g., shows only "Finished" books), should that filter stay active when they navigate away and come back?

**Answer:** Not critical, but nice to have. If easy, yes. If not, don't worry about it for V1.

### 3.3 Empty States
What should the user see when:
- The list is empty (no books added yet)?
- A filter returns no results?

**Answer:** 
- Empty list: Friendly message like "No books yet. Add your first book!" with prominent Add button
- No filter results: "No books found with this status. Try another filter."

---

## 4. Form Validation & Errors

### 4.1 Required Fields
Which fields are required when adding a book?

**Answer:** 
- Title: Required
- Author: Required
- Status: Optional (default to "Want to Read" if not specified)

### 4.2 Validation Rules
Any specific validation rules?

**Answer:**
- Title: 1-255 characters, can't be empty/whitespace only
- Author: 1-255 characters, can't be empty/whitespace only
- Status: Must be one of the three valid values

### 4.3 Error Messages
What style of error messages do you prefer?

**Options:**
a) Technical ("Title field is required")  
b) Friendly ("Please enter a book title")  
c) Very friendly ("Oops! We need a title for this book")

**Answer:** b) Friendly but clear. Not too cutesy.

---

## 5. User Experience Details

### 5.1 Book Status Change
How should users change a book's status?

**Options:**
a) Dropdown/select menu  
b) Button group (three buttons, highlight active one)  
c) Click the status badge to cycle through options  

**Answer:** b) Button group sounds most intuitive, especially on mobile.

### 5.2 Adding Notes - Where?
Where should the "Add Note" functionality live?

**Options:**
a) From the book list (quick add)  
b) Only in book detail view  
c) Both places

**Answer:** b) Only in book detail view. Keep the list clean and simple.

### 5.3 Edit Book Details
How should users edit a book's title or author?

**Options:**
a) Click title/author to edit inline  
b) Dedicated "Edit" button that opens a form/modal  
c) Always editable (no save button needed)

**Answer:** b) Dedicated Edit button with a form. Prevents accidental changes.

---

## 6. Mobile Responsiveness

### 6.1 Mobile Layout Priorities
On small screens, what's most important?

**Answer:**
- Book list should be scannable (card layout, not cramped)
- Status filters should be easy to tap (big buttons)
- Forms should have large input fields
- Reading notes should be comfortable (readable font size)

### 6.2 Minimum Screen Size
What's the smallest screen you need to support?

**Answer:** iPhone SE size (320px width). Should work on all modern smartphones.

---

## 7. Performance & Scale

### 7.1 Expected Data Volume
How many books do you expect to track?

**Answer:** Maybe 50-100 in the first year. Could grow to 500+ over time.

### 7.2 Performance Targets
What response times are acceptable?

**Answer:**
- Page load: Under 2 seconds
- Adding/editing a book: Under 1 second
- Filtering: Instant (or feels instant)

---

## 8. Success Criteria

### 8.1 MVP Definition
What's the minimum you'd consider a working MVP?

**Answer:** 
- Can add books ✓
- Can change status ✓
- Can add/edit notes ✓
- Can filter by status ✓
- Works on phone and desktop ✓
- Data persists ✓

Everything else is nice-to-have.

### 8.2 Acceptance Criteria
How will you test that each feature works?

**Answer:**
- Add a book: Book appears in list immediately
- Change status: Status updates and filter shows/hides appropriately
- Add note: Note appears with book, persists after page refresh
- Delete book: Prompts for confirmation, book and notes removed
- Mobile: Can complete all tasks on phone without zooming

---

## 9. Future Considerations

### 9.1 Features You Might Add Later
What's on your wishlist for V2?

**Answer:**
- Search books by title/author
- Book cover images
- Export data (CSV or JSON)
- Reading statistics (books per month, etc.)
- Tags or categories
- Share lists with friends

### 9.2 Technical Considerations for V2
Anything we should design now to make V2 easier?

**Answer:** 
- Don't hard-code the three status values - make them easy to extend
- Database schema should support multiple users (even if V1 is single-user)
- API design should be RESTful so it's easy to add endpoints later

---

## 10. Open Questions

### 10.1 Anything Else We Should Clarify?

**Answer:** 

One thing: For now, this is just for me (single user). No login, no authentication. But design it so we could add user accounts later without rebuilding everything.

Also, prefer keeping it simple over adding features. If you're unsure whether to include something, leave it out. I'd rather have a clean, working core than a feature-bloated mess.

---

## Additional Context

**Technology Preferences:**

I'm comfortable with JavaScript/TypeScript. Don't have a strong preference between React/Vue/Svelte - whatever makes sense for this use case.

For hosting, I'm thinking Vercel or similar (free tier). Database could be PostgreSQL, but if there's something simpler for a single-user app, I'm open to it.

---

**Status:** ✅ Questions completed on 2025-11-03

**Next step:** Generate PRD using SRS documents and these clarifications
