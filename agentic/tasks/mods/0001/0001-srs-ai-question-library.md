# Software Requirements Specification (SRS)
## AI Question Library & Response Format Enhancement

**Version:** 1.0  
**Date:** October 29, 2025  
**Project Code:** 0001  
**Parent Project:** Module 0010 - Superscapes Financial Intelligence Dashboard

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the AI Question Library & Response Format Enhancement - a feature enhancement to the AI Financial Analyst interface within the Superscapes Financial Intelligence Dashboard (Module 0010).

This enhancement improves AI discoverability through a database-driven question library and implements intelligent response formatting that adapts to query result types.

### 1.2 Scope

**In Scope:**
- Database-driven example question library with categories and sorting
- Modal UI for browsing 20-30 categorized example questions
- Intelligent response formatting with 6 distinct display patterns
- Aggregate statistics tables for multi-row query results
- Collapsible SQL display modal with syntax highlighting
- Admin UI for managing question library
- Usage analytics tracking (which questions users click and ask)
- Auto-detection of time series data for chart rendering
- Enhanced error handling with helpful suggestions

**Out of Scope:**
- Parameterized/templated questions with variable inputs (Phase 2)
- User-saved favorite questions (Phase 2)
- Role-based question filtering (Phase 2)
- Natural language query refinement suggestions
- Query performance optimization (covered in Module 0010)
- New AI models or embedding improvements

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CFO | Chief Financial Officer |
| KPI | Key Performance Indicator |
| MVP | Minimum Viable Product |
| SRS | Software Requirements Specification |
| SQL | Structured Query Language |
| UI | User Interface |
| UX | User Experience |

### 1.4 References

- Seed Document: `tasks/mods/0001/seed.md`
- Parent Project SRS: `tasks/mods/0010/0010-srs-superscapes-financial.md`
- Parent Project PRD: `tasks/mods/0010/0010-prd-superscapes-financial-mvp.md`
- Discovery Interview Responses (October 29, 2025)

---

## 2. Overall Description

### 2.1 Product Perspective

This is a feature enhancement to the existing AI Financial Analyst component within Module 0010 (Superscapes Financial Intelligence Dashboard). It is not a standalone system but rather an improvement to an existing interface.

**System Context:**
- **Parent System:** Module 0010 (Financial Intelligence Dashboard)
- **Component Enhanced:** AI Financial Analyst page
- **Integration Points:** Existing AI query endpoint, frontend AI chat interface, PostgreSQL database
- **Dependencies:** Module 0010 core infrastructure (database, backend API, frontend foundation)

The enhancement adds two new database tables and modifies frontend response rendering logic without breaking existing functionality.

### 2.2 Product Functions

High-level capabilities added by this enhancement:

1. **Question Discovery:** Modal-based browsable library of 20-30 categorized example questions helping users understand AI capabilities
2. **Smart Response Formatting:** Automatic detection of result shape and rendering appropriate format (narrative, table, chart, or combination)
3. **Aggregate Statistics:** Automatic calculation and display of summary statistics (SUM, AVG, COUNT, MIN/MAX) for tabular results
4. **SQL Transparency:** Role-based, on-demand SQL display in modal with syntax highlighting and copy functionality
5. **Usage Analytics:** Tracking which questions users browse and ask to inform question library curation
6. **Admin Question Management:** UI for adding, editing, disabling, and reordering example questions

### 2.3 User Characteristics

This enhancement serves the same users as Module 0010:

| User Role | Enhanced Capabilities | Primary Benefit |
|-----------|----------------------|-----------------|
| **CFO / Controller** | Browse curated questions, cleaner responses without SQL clutter | Faster onboarding, less intimidating interface |
| **Finance Analysts** | SQL transparency, aggregate stats, question library management | Technical transparency, better data analysis |
| **Regional Managers** | Guided question examples, visual chart responses | Easier to ask relevant questions, clearer answers |
| **Executives** | Simple narrative responses, no SQL distraction | Quick insights without technical complexity |
| **Admin** | Manage question library through UI | Curate questions without code deployment |

**Expected Users:** Same 20-30 concurrent users from Module 0010

### 2.4 Constraints

1. **Technical Constraints:**
   - Must integrate with existing Module 0010 AI query endpoint without breaking changes
   - Must use existing tech stack (React, FastAPI, PostgreSQL from Module 0010)
   - Response formatting must handle variable result shapes (1 row to 10,000+ rows)
   - SQL highlighting library must support PostgreSQL syntax

2. **Design Constraints:**
   - Must maintain consistent UI/UX with Module 0010 dashboard
   - Modal must be responsive (desktop primary, tablet/mobile usable)
   - Cannot slow down existing AI query response time

3. **Data Constraints:**
   - Example questions must work with real Sage data structure (awaiting Questions.md clarifications)
   - Question library must be updateable without code deployment

### 2.5 Assumptions and Dependencies

**Assumptions:**
- Module 0010 core infrastructure will be in place before this enhancement is implemented
- Real Sage data structure will be clarified through Questions.md responses within 1-2 weeks
- Users have modern web browsers supporting CSS Grid and modal patterns
- Backend can return result metadata (row count, column types) along with query results

**Dependencies:**
- Module 0010 AI query endpoint (`POST /ai/query`) must be functional
- Module 0010 database schema (core, semantic layers) must be deployed
- Real Sage data must be loaded (or realistic mocks in place)
- Client responses to `/poc/database/data/Questions.md`
- Admin panel infrastructure from Module 0010 (authentication, routing)

---

## 3. System Features

### Feature 1: Database-Driven Question Library

**Description:**  
Store example questions and categories in PostgreSQL database tables, enabling dynamic question management without code deployment.

**Functional Requirements:**

1. Create database table `core.ai_question_categories` storing category metadata (code, name, icon, description, sort order, active status)
2. Create database table `core.ai_example_questions` storing questions with category relationships, display order, usage tracking, and active status
3. Support 20-30 initial example questions organized across 5 categories: Simple Metrics, Trends & Comparisons, Variance Analysis, Job Performance, Regional & Division Analysis
4. Track usage analytics: increment `usage_count` when example question clicked, update `last_used_at` timestamp
5. Support category sorting via `sort_order` integer field (10, 20, 30... for easy reordering)
6. Support question sorting within categories via `sort_order` integer field
7. Support soft-delete via `is_active` boolean flag (don't delete, just hide)
8. Store optional question descriptions for tooltips
9. Store expected response type hint ('narrative', 'table', 'chart') to guide UI presentation

### Feature 2: Question Library Modal UI

**Description:**  
Modal interface for browsing and selecting example questions, replacing limited pill-based suggestions.

**Functional Requirements:**

1. Display "Example Questions" or "Browse Questions" button/icon prominently near AI input box
2. On button click, open modal displaying all active questions grouped by category
3. Display categories in sort_order sequence with category icon and name
4. Display questions within each category in sort_order sequence
5. Include search/filter input at top of modal allowing real-time filtering of questions by text match
6. On question click: close modal, populate question text into input box, wait for user to click "Ask" button (don't auto-submit)
7. Modal must be responsive: centered overlay on desktop (600-800px width), full-screen on mobile
8. Modal must be keyboard accessible (ESC to close, arrow keys to navigate, Enter to select)
9. Display question count per category (e.g., "Simple Metrics (8)")
10. User must manually click button to open modal (no auto-show on first visit)

### Feature 3: Intelligent Response Formatting

**Description:**  
Automatically detect query result shape and apply appropriate formatting pattern for optimal readability.

**Functional Requirements:**

**Rule 1: Single Row, ≤3 Columns → Narrative Only**
1. Detect when query returns exactly 1 row with 3 or fewer columns
2. Display result value(s) embedded in AI narrative response only
3. Do not render table UI
4. Format values appropriately (currency, percentage, count) in narrative

**Rule 2: Multiple Rows, 1-5 Columns → Table + Narrative + Aggregates**
5. Detect when query returns 2+ rows with 1-5 columns
6. Display data in table format with all rows visible (or paginated if >100 rows)
7. Display AI narrative explanation above or below table providing context
8. Calculate and display aggregate statistics in separate summary table below data table:
   - COUNT: Total number of rows
   - SUM: Sum of all numeric currency columns
   - AVG: Average of all numeric currency and percentage columns
   - MIN/MAX: Minimum and maximum values for date and numeric columns
9. Style aggregate table distinctly from data table (visual differentiation as summary section)
10. Include appropriate headers and labels for aggregate values

**Rule 3: SQL Hidden by Default, Modal on Click**
11. Display "Show SQL" icon or button in response header for all AI responses
12. Show SQL button only to Finance Analyst and Admin roles (hide from Executive and Regional Manager)
13. SQL button always visible for permitted roles (not conditional on query complexity)
14. On SQL button click, open modal displaying:
    - Syntax-highlighted SQL query (PostgreSQL syntax)
    - "Copy to Clipboard" button
    - List of data sources queried (schema.table names)
    - Formatted/indented SQL for readability
15. SQL modal must allow user to close and return to conversation without losing context
16. Consider optional "Explain This Query" button generating plain English explanation of SQL (nice-to-have)

**Rule 4: Time Series Auto-Chart**
17. Detect when query results contain date/time column plus one or more numeric columns
18. Auto-select chart type: line chart for trends over time (>5 data points), bar chart for comparisons (<5 data points)
19. Display chart above data table
20. Allow data table below chart to be collapsible/expandable (starts collapsed for clean view)
21. Include narrative explanation and aggregate statistics table alongside chart

**Rule 5: Empty Results Handling**
22. Detect when query returns 0 rows
23. Generate positive/helpful narrative instead of empty table
24. Provide context explaining why no results (e.g., "All jobs were profitable")
25. Suggest related alternative questions user might ask
26. Maintain conversational, non-error tone

**Rule 6: Error Handling**
27. When AI query fails, identify which step failed (SQL generation, SQL execution, or result interpretation)
28. Display user-friendly error message without technical jargon
29. Suggest 2-3 alternative questions that will work
30. Provide "Ask a Human Analyst" escalation button triggering email to finance team
31. Log error details to backend for debugging without exposing to user

### Feature 4: Admin Question Management UI

**Description:**  
Admin panel interface allowing administrators to manage the question library without code deployment.

**Functional Requirements:**

1. Add "AI Question Library" menu item to admin panel navigation
2. Display table of all categories with columns: Icon, Name, Sort Order, Question Count, Active Status, Actions
3. Support category actions: Add New, Edit, Reorder (drag-drop or up/down arrows), Activate/Deactivate
4. Display table of all questions with columns: Category, Question Text, Expected Type, Sort Order, Usage Count, Last Used, Active Status, Actions
5. Support question actions: Add New, Edit, Delete, Reorder, Activate/Deactivate
6. Provide form for adding/editing questions with fields: Category (dropdown), Question Text (textarea), Description (optional), Expected Response Type (dropdown), Sort Order (number)
7. Validate question text is not empty and is unique within category
8. Display usage analytics: most-clicked questions, least-used questions, questions never clicked
9. Allow bulk operations: activate/deactivate multiple questions, change category for multiple questions
10. Log all admin changes to audit log (who changed what when)

### Feature 5: Usage Analytics & Tracking

**Description:**  
Track how users interact with example questions and all AI queries for product improvement insights.

**Functional Requirements:**

1. Increment `usage_count` in `ai_example_questions` table when user clicks an example question
2. Update `last_used_at` timestamp when example question clicked
3. Track all AI queries (both example and user-written) in existing audit log with question text
4. Create new table or view aggregating question usage statistics: total questions asked, unique users asking, average questions per session, most common question patterns
5. Provide admin dashboard showing: Top 10 most-clicked example questions, Top 10 most-asked user questions (not from library), Unused example questions (usage_count = 0 after 30 days), Question usage trend over time
6. Support filtering analytics by date range, user role, question category
7. Store question text (anonymized if needed) to identify common patterns for new example questions

### Feature 6: Enhanced Export Functionality for Tables

**Description:**  
Add quick "Export to Excel" button for table responses with more than 10 rows.

**Functional Requirements:**

1. Display "Export to Excel" button for table responses containing more than 10 rows
2. Export includes: data table rows, aggregate statistics table, question asked, timestamp, user who asked
3. Excel file includes two worksheets: "Data" and "Summary Statistics"
4. Generate unique filename: `ai-query-{date}-{time}.xlsx`
5. Download triggers immediately without navigating away from conversation
6. Log export action to audit log
7. Limit export to 10,000 rows (use main dashboard export for larger datasets)

---

## 4. External Interface Requirements

### 4.1 User Interfaces

**Question Library Modal:**
- Modal overlay centered on desktop (700px width, max-height 80vh, scrollable content)
- Full-screen on mobile devices (<768px)
- Header: "Example Questions" title, search input, close button (X)
- Body: Category sections with icons and question lists
- Footer: "Close" button
- Dark overlay backdrop (semi-transparent) with click-to-close
- Smooth open/close animations (fade + slide)

**SQL Display Modal:**
- Modal overlay centered on desktop (800px width, auto height up to 90vh)
- Header: "Generated SQL Query" title, close button
- Body: Syntax-highlighted SQL code block, data sources list
- Footer: "Copy SQL" button, optional "Explain This Query" button, "Close" button
- Monospace font for SQL code
- Copy button provides visual feedback on click ("Copied!")

**Response Display Enhancements:**
- Data tables with consistent styling (alternating row colors, sortable headers if >20 rows)
- Aggregate statistics table with distinct styling (bold headers, summary background color)
- Chart integration using existing Recharts library from Module 0010
- Export button styled consistently with main dashboard export buttons

**Admin Question Management UI:**
- Integrated into existing admin panel from Module 0010
- Two-tab interface: "Categories" and "Questions"
- Standard CRUD forms with validation
- Drag-drop reordering UI or up/down arrow buttons for sort order
- Usage statistics dashboard with charts showing question popularity

### 4.2 Hardware Interfaces

Not applicable - web-based feature using existing Module 0010 infrastructure.

### 4.3 Software Interfaces

**Database Tables (New):**
- `core.ai_question_categories` - Category master data
- `core.ai_example_questions` - Question library
- Integration with existing `core.audit_log` table for change tracking

**Backend API Endpoints (New or Modified):**
- `GET /ai/example-questions` - Retrieve active questions grouped by category
- `POST /admin/ai-questions` - Create new question (Admin only)
- `PATCH /admin/ai-questions/{question_id}` - Update question (Admin only)
- `DELETE /admin/ai-questions/{question_id}` - Soft-delete question (Admin only)
- `POST /admin/ai-categories` - Create new category (Admin only)
- `PATCH /admin/ai-categories/{category_id}` - Update category (Admin only)
- `GET /admin/ai-question-analytics` - Usage statistics (Admin only)
- `POST /ai/query` (Modified) - Include result metadata in response (row count, column types)
- `POST /ai/question-clicked` - Track example question usage

**Frontend Integration:**
- Modify existing AI Analyst page component
- Use existing Recharts library for chart rendering
- Use existing modal/dialog components or create reusable modal component
- Integrate with existing auth context for role-based UI

### 4.4 Communications Interfaces

- HTTPS for all API communications
- JSON for API request/response format
- WebSocket not required (HTTP polling acceptable for this feature)

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

1. **Question Library Load Time:** Retrieve and display all example questions in <500ms
2. **Modal Open Time:** Modal must appear within 200ms of button click
3. **Search/Filter Responsiveness:** Filter results must update within 100ms of typing
4. **Aggregate Calculation Time:** Calculate aggregates for up to 1,000 rows in <100ms (client-side)
5. **SQL Modal Rendering:** Syntax highlighting must complete in <300ms
6. **No Impact on Query Time:** Response formatting logic must add <100ms to total AI query response time

### 5.2 Security Requirements

1. **Role-Based SQL Display:** SQL modal only shown to Finance Analyst and Admin roles - enforced on frontend and backend
2. **Admin-Only Management:** Question library CRUD operations require Admin role with validation on backend
3. **XSS Prevention:** Sanitize question text and descriptions to prevent script injection
4. **Audit Logging:** All question library changes logged with user ID, timestamp, action, old/new values
5. **Query Validation:** Example questions validated to only contain safe SELECT queries

### 5.3 Usability Requirements

1. **Discoverability:** 80%+ of new users should discover example questions within first session
2. **Learnability:** Users can browse and select questions without training
3. **Efficiency:** Clicking example question is faster than typing (reduce cognitive load)
4. **Error Prevention:** Search shows "no results" message if filter returns empty
5. **Accessibility:** Modals keyboard-navigable, screen-reader compatible labels, proper focus management

### 5.4 Reliability Requirements

1. **Graceful Degradation:** If question library fails to load, show static fallback questions hardcoded in frontend
2. **Analytics Failure Handling:** If usage tracking fails, don't block question selection
3. **Aggregate Calculation Resilience:** If aggregate calculation fails, show table without aggregates (don't block response)

### 5.5 Other Non-Functional Requirements

**Maintainability:**
- Question library updates via admin UI (no code deployment required)
- Response formatting rules centralized in single service/utility module
- Clear separation between formatting logic and display components

**Scalability:**
- Support up to 100 categories and 500 questions (well beyond initial 5 categories, 30 questions)
- Efficient querying with database indexes on category_id, sort_order, is_active

---

## 6. System Architecture

### 6.1 Technology Stack

This feature uses the existing Module 0010 tech stack:

- **Frontend:** React 18+ (TypeScript), Tailwind CSS, Recharts
- **Backend:** FastAPI (Python), SQLAlchemy
- **Database:** PostgreSQL (RDS) - add 2 new tables
- **Syntax Highlighting:** Prism.js or react-syntax-highlighter
- **Copy to Clipboard:** navigator.clipboard API or clipboard.js

### 6.2 Data Storage

**New Tables:**

```sql
-- Category table
CREATE TABLE core.ai_question_categories (
    category_id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    category_icon VARCHAR(50),
    category_description TEXT,
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_sort ON core.ai_question_categories(sort_order);
CREATE INDEX idx_categories_active ON core.ai_question_categories(is_active);

-- Questions table
CREATE TABLE core.ai_example_questions (
    question_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES core.ai_question_categories(category_id),
    question_text TEXT NOT NULL,
    question_description TEXT,
    expected_response_type VARCHAR(50),
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system'
);

CREATE INDEX idx_questions_category ON core.ai_example_questions(category_id);
CREATE INDEX idx_questions_sort ON core.ai_example_questions(sort_order);
CREATE INDEX idx_questions_active ON core.ai_example_questions(is_active);
CREATE INDEX idx_questions_usage ON core.ai_example_questions(usage_count DESC);
```

**Seed Data:** 5 categories, 20-30 initial questions (to be finalized after Questions.md responses)

### 6.3 High-Level Architecture

**Component Architecture:**

```
Frontend (React)
├── AIAnalystPage (existing - modified)
│   ├── QuestionLibraryButton (new)
│   ├── QuestionLibraryModal (new)
│   ├── ChatInterface (existing)
│   └── ResponseRenderer (new - smart formatting)
│       ├── NarrativeResponse (single row ≤3 cols)
│       ├── TableWithAggregates (multi-row, 1-5 cols)
│       ├── ChartWithTable (time series)
│       ├── EmptyResultsMessage (0 rows)
│       └── ErrorResponse (failures)
├── SQLDisplayModal (new)
└── AggregateStatsTable (new)

Backend (FastAPI)
├── /ai/example-questions (new endpoint)
├── /ai/question-clicked (new endpoint)
├── /ai/query (modified - return metadata)
├── /admin/ai-questions/* (new endpoints)
└── services/response_formatter.py (new)
    ├── detect_result_type()
    ├── calculate_aggregates()
    ├── format_for_display()

Database (PostgreSQL)
├── core.ai_question_categories (new)
├── core.ai_example_questions (new)
└── core.audit_log (existing - log question management)
```

**Data Flow:**

1. User clicks "Example Questions" → Frontend calls `GET /ai/example-questions`
2. Backend queries database, returns categorized questions
3. User clicks question → Frontend calls `POST /ai/question-clicked` (async, non-blocking)
4. Frontend populates input box, user clicks "Ask"
5. Existing AI query flow executes → Backend returns results + metadata (row count, column types)
6. Frontend ResponseRenderer detects result shape → Applies formatting rules
7. If table: Calculate aggregates client-side, render table + aggregates
8. If time series: Render chart using Recharts
9. If user clicks "Show SQL" → Display SQL modal

---

## 7. Appendix

### 7.1 Discovery Interview Recap

**Q1:** Of the 6 response formatting rules proposed, are there any modifications needed or additional patterns?  
**A:** All 6 rules are good as-is.

**Q2:** For the "Show SQL" modal - when should it appear?  
**A:** SQL button should always appear (for permitted roles), but modal only opens when user clicks the button.

**Q3:** Is 20-30 example questions across 5 categories the right scope?  
**A:** Yes, 20-30 is good.

**Q4:** Should the modal auto-show on first visit or require user click?  
**A:** User must click "Example Questions" button to open modal (no auto-show).

**Q5:** When user clicks an example question, should it auto-submit?  
**A:** Populate input and wait for user to click "Ask" button (don't auto-submit).

**Q6:** Should admin UI for managing questions be built now or later?  
**A:** Build admin UI now (include in this module).

**Q7:** What question usage should be tracked?  
**A:** Track both example question clicks and all custom questions asked by users.

**Q8:** Should parameterized questions with dropdowns be included?  
**A:** Phase 2 (not in this module).

**Q9:** Which aggregate calculations are must-haves?  
**A:** SUM, AVG, COUNT, MIN/MAX (not MEDIAN).

**Q10:** Should table responses include "Export to Excel" button?  
**A:** Yes, but only for tables with more than 10 rows.

### 7.2 Example Question Library (Initial Seed)

**Category: Simple Metrics (📊)**
1. What was our total revenue last month?
2. What is our current gross margin percentage?
3. How many active jobs do we have right now?
4. What was our total revenue last quarter?
5. What are our total operating expenses this month?

**Category: Trends & Comparisons (📈)**
6. Show monthly revenue trend for the last 12 months
7. Compare Q3 revenue to Q2
8. How has our margin changed quarter over quarter this year?
9. Show revenue growth year-over-year
10. Compare this month's expenses to last month

**Category: Variance Analysis (🔍)**
11. Why did our expenses increase in September?
12. What drove our margin decline in Q3?
13. Which accounts had the biggest changes last month?
14. What caused labor costs to increase?
15. Show largest revenue variances this quarter

**Category: Job Performance (💼)**
16. Show top 10 most profitable jobs this year
17. Which jobs are over budget and by how much?
18. What's the average margin for commercial projects?
19. Show jobs with margins below 20%
20. Which jobs generated the most revenue this quarter?

**Category: Regional & Division Analysis (🏢)**
21. Compare revenue across all regions
22. Which division has the highest labor costs?
23. Show profitability by region for Q3
24. Which region has the best margin percentage?
25. Compare division performance year-to-date

**Note:** Final question list will be refined based on real Sage data structure after Questions.md responses received.

### 7.3 Response Formatting Examples

**Example 1: Narrative Response (Rule 1)**
```
User: "What was our total revenue last month?"

AI Response:
Total revenue for September 2025 was $8.5M, representing a 12.3% 
increase compared to August 2025 ($7.6M).

[No table displayed - clean narrative only]
```

**Example 2: Table with Aggregates (Rule 2)**
```
User: "Show revenue by region for Q3"

AI Response:
Here's the revenue breakdown by region for Q3 2025:

┌──────────────┬────────────┐
│ Region       │ Revenue    │
├──────────────┼────────────┤
│ Dallas       │ $12.5M     │
│ Houston      │ $8.3M      │
│ Austin       │ $4.2M      │
└──────────────┴────────────┘

Summary Statistics:
┌──────────────┬────────────┐
│ Total        │ $25.0M     │
│ Average      │ $8.3M      │
│ Regions      │ 3          │
└──────────────┴────────────┘

Dallas led regional performance with $12.5M in revenue, representing 
50% of total Q3 revenue.
```

**Example 3: Time Series with Chart (Rule 4)**
```
User: "Show monthly revenue trend for last 12 months"

AI Response:
[Line chart displays showing revenue trend Oct 2024 - Sep 2025]

▼ View Data Table (click to expand)

Revenue has grown consistently over the past 12 months, increasing 
from $7.2M in October 2024 to $8.5M in September 2025, a 18% increase.
Peak revenue occurred in June 2025 at $9.1M.

Summary Statistics:
- Total (12 months): $98.4M
- Average: $8.2M/month
- Peak: $9.1M (June 2025)
- Low: $7.2M (October 2024)
```

### 7.4 Glossary

| Term | Definition |
|------|------------|
| **Aggregate Statistics** | Summary calculations (sum, average, count) performed on a set of data |
| **Auto-Chart** | Automatic detection and rendering of chart visualization for time-series data |
| **Example Questions** | Pre-written questions in the library that users can browse and select |
| **Response Formatting Rule** | Logic determining how AI response is displayed based on result structure |
| **Semantic Layer** | Database views providing business-friendly data access for AI queries |
| **SQL Modal** | Popup dialog displaying the generated SQL query with syntax highlighting |
| **Syntax Highlighting** | Color-coding SQL keywords, functions, and identifiers for readability |
| **Usage Analytics** | Tracking data about which questions are clicked and asked most frequently |

---

**Document Control:**
- **Created:** October 29, 2025
- **Author:** AI Assistant (based on seed document and discovery interview)
- **Reviewers:** Project stakeholders (pending)
- **Status:** Draft - Awaiting Questions.md responses from client
- **Next Steps:** Review and approval → Generate PRD using `02-create-prd.md` workflow
