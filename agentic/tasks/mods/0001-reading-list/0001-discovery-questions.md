# Discovery Questions
## Reading List Tracker

**Mod:** 0001-reading-list  
**Date:** 2025-11-03  
**Status:** ✅ Completed  

---

## Instructions

Please answer the following questions to help define the requirements for your project. Be as detailed as possible. Your answers will be used to generate the Software Requirements Specification (SRS) documents.

**When you're done, reply with "Complete" and I'll generate your SRS documents.**

---

## 1. Problem & Goals

### 1.1 What problem does this feature/project solve for you?
**Answer:** I keep forgetting which books I've read and what I thought about them. My notes are scattered across emails, text files, and my memory. I need a single place to track my reading and my reactions.

### 1.2 What is the main goal you want to achieve with this project?
**Answer:** Have a simple app where I can see my complete reading history, track what I'm currently reading, and remember my thoughts about each book without hunting through old notes.

### 1.3 How will you know when this is successful?
**Answer:** When I can look at my reading list and immediately remember what I've read and what I thought about it, without searching through emails or other apps.

---

## 2. Target User

### 2.1 Who is the primary user of this feature/project?
**Answer:** Me, but potentially friends who want similar functionality.

### 2.2 What is their technical comfort level?
**Answer:** Basic to intermediate. Should work without instructions.

### 2.3 What devices will they use?
**Answer:** Mainly laptop/desktop, but should work on phone too for when I'm at the bookstore or library.

---

## 3. Core Functionality

### 3.1 What are the key actions a user should be able to perform?
**Answer:** 
- Add books I've read or want to read
- Mark books as "want to read," "currently reading," or "finished"
- Add notes about my thoughts/reactions to books
- Browse my complete reading list
- Filter by reading status

### 3.2 Can you describe a typical user journey? (Step by step)
**Answer:**
1. I finish reading a book
2. I open the app
3. I add the book (title and author)
4. I mark it as "Finished"
5. I add notes about what I thought - key themes, my reactions, memorable quotes
6. Later, someone asks me "have you read X?" and I can check my list
7. Or I'm deciding what to read next and browse my "Want to Read" list

### 3.3 Are there any specific features that are must-haves vs. nice-to-haves?
**Answer:**

**Must-haves:**
- Add/edit/delete books
- Track reading status
- Add/edit notes
- View all books in a list
- Filter by status

**Nice-to-haves (but not for first version):**
- Book cover images
- Search functionality
- Reading statistics
- Share lists with friends
- Import from Goodreads

---

## 4. User Stories

### 4.1 Can you provide a few user stories?
**Format:** "As a [type of user], I want to [perform an action] so that [benefit]."

**Answer:**
1. As a reader, I want to add a book to my list so that I can track what I've read or want to read
2. As a reader, I want to mark a book as "Currently Reading" so that I remember which book I'm working on
3. As a reader, I want to add notes about a book so that I can remember my thoughts and reactions
4. As a reader, I want to see all my finished books so that I can remember my reading history
5. As a reader, I want to filter by status so that I can see just my "Want to Read" list when choosing my next book

---

## 5. Data & Content

### 5.1 What kind of data does this feature need to display or store?
**Answer:**
- Book title
- Author name
- Reading status (Want to Read, Currently Reading, Finished)
- Notes/thoughts about the book
- Date added (would be nice to have)

### 5.2 Where does this data come from?
**Answer:** I'll enter it manually. Not importing from anywhere for now.

### 5.3 Does any data need to persist across sessions?
**Answer:** Yes! Everything needs to save. I need to be able to close the app and come back days later with all my books and notes still there.

---

## 6. Design & User Experience

### 6.1 Are there any existing design mockups or UI guidelines to follow?
**Answer:** No mockups. Just keep it clean and simple. I like minimalist designs.

### 6.2 Can you describe the desired look and feel?
**Answer:** 
- Clean, lots of white space
- Not cluttered
- Easy to scan the list visually
- Color-coded status would be nice (like green for finished, blue for reading)
- Should feel fast and responsive

### 6.3 Any specific UI patterns or examples you like?
**Answer:** I like how Notion keeps things simple. Cards or a clean table would work. Mobile should feel natural, not cramped.

---

## 7. Scope & Boundaries

### 7.1 What should this feature/project NOT do? (Non-goals)
**Answer:**
- No social features (reviews, ratings, following friends) - at least not yet
- No integration with Goodreads or other services
- No recommendation engine
- No book cover image search - that's extra complexity
- Not trying to be a full reading tracker with dates, pages read, etc. - keep it simple

### 7.2 Are there any technical constraints or requirements?
**Answer:** 
- Should work on modern browsers (Chrome, Firefox, Safari)
- Should be responsive (work on phone and desktop)
- Doesn't need to support Internet Explorer
- I can host it myself, so no special hosting requirements

### 7.3 Any budget or timeline constraints?
**Answer:** Just a personal project. Would like to finish in a week or two. Should cost nothing or very little to host.

---

## 8. Edge Cases & Error Handling

### 8.1 What potential edge cases should we consider?
**Answer:**
- What if I accidentally add the same book twice? (Maybe warn me)
- What if the title or author is really long? (Should wrap, not break layout)
- What if I have hundreds of books? (Should still be fast)
- What if I try to add a book with no title? (Shouldn't let me)

### 8.2 How should errors be handled?
**Answer:** 
- Clear, friendly messages (not technical jargon)
- If something fails to save, tell me immediately
- Confirmation before deleting books or notes

---

## 9. Success Metrics

### 9.1 How will you measure if this is working?
**Answer:**
- Can I add a book in under 30 seconds?
- Can I find notes about a book in under 15 seconds?
- Do I actually use it consistently?
- Have I stopped forgetting what I've read?

---

## 10. Open Questions

### 10.1 What questions do you still have?
**Answer:** None right now. I think we've covered it!

### 10.2 What are you most uncertain about?
**Answer:** Not sure if I should organize by genre/category or just keep it simple with status only. Leaning toward simple for V1.

---

## Additional Notes

**Any other context or requirements?**

I'd rather ship something simple and working than wait for all the bells and whistles. I can always add features later. The core need is: track books, track status, remember my thoughts.

---

**Status:** ✅ Questions completed on 2025-11-03

**Next step:** Generate SRS documents using these answers
