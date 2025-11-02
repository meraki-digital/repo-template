# Product Requirements Document (PRD)
## AI Question Library & Response Format Enhancement

**Version:** 1.0  
**Date:** October 29, 2025  
**Project Code:** 0001  
**Parent Project:** Module 0010 - Superscapes Financial Intelligence Dashboard  
**Target Timeline:** 4 weeks

---

## 1. Introduction / Overview

The AI Question Library & Response Format Enhancement is a feature addition to the AI Financial Analyst interface in the Superscapes Financial Intelligence Dashboard (Module 0010). This enhancement improves user experience through intelligent response formatting and a discoverable, database-driven question library.

**Problem Statement:**  
The current AI interface has limited discoverability (only 3-4 hardcoded example questions) and basic response formatting (all queries displayed the same way regardless of data type). This causes:
- Users struggle to understand what questions they can ask
- Simple answers and complex tables both displayed identically
- SQL visibility distracts non-technical users
- No summary statistics for tabular data
- Cannot update example questions without code deployment

**Solution:**  
Implement smart response formatting (6 distinct patterns), a browsable modal library of 20-30 categorized questions stored in database, aggregate statistics for tables, collapsible SQL display, and admin UI for question management.

---

## 2. Goals

### Primary Goals

1. **Improve AI Discoverability:** Enable 80%+ of users to discover relevant example questions within first session
2. **Optimize Response Presentation:** Display 90%+ of AI responses in the most appropriate format (narrative, table, chart) based on data shape
3. **Enhance Technical Transparency:** Provide SQL visibility for Finance Analysts while keeping interface clean for Executives
4. **Enable Self-Service Question Management:** Allow admins to add/edit example questions without code deployment

### Secondary Goals

5. Reduce time to first successful AI query (user finds relevant example faster)
6. Increase AI feature adoption through better onboarding
7. Track question usage patterns to continuously improve question library
8. Provide export capability for ad-hoc query results

---

## 3. User Stories

### All User Stories

**US-001:** As a new user, I want to browse example questions organized by category, so that I can quickly understand what the AI can help me with.

**US-002:** As a CFO, I want simple metric queries to display as clean narrative answers without unnecessary tables, so that I get quick insights without visual clutter.

**US-003:** As a Finance Analyst, I want to see aggregate statistics (total, average, count) when viewing tabular data, so that I don't have to manually calculate summaries.

**US-004:** As a Finance Analyst, I want to view the SQL query the AI generated, so that I can verify the logic and learn how to query the data myself.

**US-005:** As an Executive, I want SQL hidden by default, so that I see only business insights without technical details.

**US-006:** As a Regional Manager, I want time series data to automatically display as charts, so that I can quickly visualize trends without interpreting tables.

**US-007:** As a Finance Analyst, I want to export table results to Excel directly from the AI response, so that I can perform additional analysis.

**US-008:** As a user, when my query returns no results, I want a helpful explanation and suggested alternatives, so that I'm not stuck with an empty screen.

**US-009:** As an Admin, I want to add new example questions through the admin panel, so that I can update the library based on user needs without waiting for a code deployment.

**US-010:** As an Admin, I want to see which example questions are most popular, so that I can prioritize the most useful questions and remove unused ones.

**US-011:** As a user, I want to search/filter the example questions, so that I can quickly find relevant questions without scrolling through all categories.

**US-012:** As a user, when I click an example question, I want it to populate the input box so I can review before submitting, so that I maintain control over what gets asked.

---

## 4. Functional Requirements

### 4.1 Database Schema

**FR-101:** The system must create table `core.ai_question_categories` with columns: category_id (PK), category_code (unique), category_name, category_icon, category_description, sort_order, is_active, created_at.

**FR-102:** The system must create table `core.ai_example_questions` with columns: question_id (PK), category_id (FK), question_text, question_description, expected_response_type, sort_order, is_active, usage_count, last_used_at, created_at, created_by.

**FR-103:** The system must create indexes on: category sort_order, category is_active, question category_id, question sort_order, question is_active, question usage_count.

**FR-104:** The system must seed 5 initial categories: Simple Metrics, Trends & Comparisons, Variance Analysis, Job Performance, Regional & Division Analysis.

**FR-105:** The system must seed 20-30 initial example questions distributed across the 5 categories.

### 4.2 Question Library API Endpoints

**FR-201:** The system must provide endpoint `GET /ai/example-questions` returning all active questions grouped by active categories, ordered by category sort_order then question sort_order.

**FR-202:** The system must provide endpoint `POST /ai/question-clicked` accepting question_id, incrementing usage_count, and updating last_used_at timestamp.

**FR-203:** The system must provide endpoint `GET /admin/ai-questions` returning all questions with analytics (usage_count, last_used_at) for admin management (Admin role required).

**FR-204:** The system must provide endpoint `POST /admin/ai-questions` creating new questions (Admin role required).

**FR-205:** The system must provide endpoint `PATCH /admin/ai-questions/{question_id}` updating question text, description, category, sort_order, or is_active status (Admin role required).

**FR-206:** The system must provide endpoint `DELETE /admin/ai-questions/{question_id}` soft-deleting question by setting is_active=false (Admin role required).

**FR-207:** The system must provide endpoint `GET /admin/ai-question-analytics` returning usage statistics: top 10 clicked questions, least used questions, total questions asked, usage trends (Admin role required).

**FR-208:** The system must provide similar endpoints for category management: GET, POST, PATCH with Admin role requirement.

### 4.3 Question Library Modal UI

**FR-301:** The system must display "Example Questions" or "Browse Questions" button prominently on AI Analyst page near the input box.

**FR-302:** The system must open modal overlay when button clicked, displaying all active questions grouped by category.

**FR-303:** The system must NOT auto-show the modal on first visit (user must click button to open).

**FR-304:** The system must display categories in sort_order sequence with category icon (emoji), category name, and question count in parentheses.

**FR-305:** The system must display questions within each category in sort_order sequence as clickable list items.

**FR-306:** The system must include search input at top of modal filtering questions in real-time by text match (searches question_text and question_description fields).

**FR-307:** The system must close modal and populate question text into input box when user clicks a question (do not auto-submit).

**FR-308:** The system must call `POST /ai/question-clicked` asynchronously when question clicked (non-blocking, failure doesn't affect UX).

**FR-309:** The system must close modal when user clicks close button (X), clicks backdrop overlay, or presses ESC key.

**FR-310:** The system must render modal as centered overlay on desktop (700px width, max-height 80vh, scrollable), full-screen on mobile (<768px).

**FR-311:** The system must support keyboard navigation: Tab between questions, Enter to select, ESC to close.

### 4.4 Response Formatting - Rule 1 (Narrative Only)

**FR-401:** The system must detect when AI query returns exactly 1 row with 3 or fewer columns.

**FR-402:** The system must display result embedded in narrative text only (no table rendering).

**FR-403:** The system must format values appropriately in narrative: currency with $ and M/K suffixes, percentages with % symbol, dates in readable format.

### 4.5 Response Formatting - Rule 2 (Table with Aggregates)

**FR-501:** The system must detect when AI query returns 2 or more rows with 1-5 columns.

**FR-502:** The system must display results in data table with all rows visible (subject to pagination if >50 rows).

**FR-503:** The system must display AI narrative explanation above or below the data table.

**FR-504:** The system must display aggregate statistics table below data table ONLY when data table has more than 3 rows.

**FR-505:** The system must calculate and display aggregate statistics:
- COUNT: Total number of rows
- SUM: Sum of all currency/numeric columns
- AVG: Average of all currency/numeric columns  
- MIN: Minimum value for numeric and date columns
- MAX: Maximum value for numeric and date columns

**FR-506:** The system must style aggregate table distinctly from data table (different background color, bold headers, "Summary Statistics" or "Totals" label).

**FR-507:** The system must handle null values in aggregates gracefully (exclude from SUM/AVG calculations, show "N/A" if entire column is null).

### 4.6 Response Formatting - Rule 3 (SQL Modal)

**FR-601:** The system must display "Show SQL" icon or button in the response header for all AI responses.

**FR-602:** The system must show SQL button ONLY to users with Finance Analyst or Admin roles (hide from Executive and Regional Manager roles).

**FR-603:** The system must display SQL button for all queries regardless of complexity (always available for permitted roles).

**FR-604:** The system must open SQL modal when SQL button clicked, displaying formatted SQL query.

**FR-605:** The system must apply syntax highlighting to SQL in modal using PostgreSQL syntax rules (keywords, functions, identifiers color-coded).

**FR-606:** The system must display "Copy to Clipboard" button in SQL modal copying formatted SQL to clipboard with visual feedback ("Copied!").

**FR-607:** The system must list data sources queried in SQL modal (schema.table names extracted from SQL).

**FR-608:** The system must include "Explain This Query" button in SQL modal generating plain English explanation of what the SQL does.

**FR-609:** The system must close SQL modal when user clicks close button, backdrop, or ESC key without affecting conversation context.

**FR-610:** The system must format SQL for readability (indentation, line breaks, aligned keywords).

### 4.7 Response Formatting - Rule 4 (Time Series Auto-Chart)

**FR-701:** The system must detect when query results contain at least one date/time column and at least one numeric column.

**FR-702:** The system must auto-select chart type: line chart for ≥5 data points showing trend, bar chart for <5 data points showing comparison.

**FR-703:** The system must render chart above data table using existing Recharts library from Module 0010.

**FR-704:** The system must make data table collapsible/expandable with "View Data Table ▼" toggle (starts collapsed to prioritize chart visualization).

**FR-705:** The system must include narrative explanation and aggregate statistics table alongside chart.

**FR-706:** The system must label chart axes clearly: X-axis with date labels, Y-axis with metric name and units.

**FR-707:** The system must display chart tooltips on hover showing exact values for each data point.

**FR-708:** The system must handle multiple numeric columns by rendering multi-series chart (multiple lines or grouped bars).

### 4.8 Response Formatting - Rule 5 (Empty Results)

**FR-801:** The system must detect when query returns 0 rows.

**FR-802:** The system must display helpful narrative instead of empty table, using positive/neutral tone.

**FR-803:** The system must provide context explaining why no results (e.g., "All jobs were profitable" for "Which jobs lost money?").

**FR-804:** The system must suggest 2-3 related alternative questions user might ask.

**FR-805:** The system must format empty results as conversational response (not error message).

### 4.9 Response Formatting - Rule 6 (Error Handling)

**FR-901:** The system must detect and categorize failures: SQL generation failure, SQL execution error, or result interpretation error.

**FR-902:** The system must display user-friendly error messages without technical jargon or stack traces.

**FR-903:** The system must suggest 2-3 alternative questions that will work when a query fails.

**FR-904:** The system must provide "Ask a Human Analyst" button in error responses triggering email to finance team with failed question and user context.

**FR-905:** The system must log detailed error information to backend (for debugging) without exposing to user.

**FR-906:** The system must provide specific helpful messages for common errors:
- Date/period not found: "Did you mean Q3 2024 or Q1 2025?"
- Ambiguous terms: "Did you mean 'revenue' or 'net profit'?"
- No data for filter: "No data available for specified date range. Try last month?"

### 4.10 Admin Question Management UI

**FR-1001:** The system must add "AI Question Library" menu item to admin panel navigation (Admin role required).

**FR-1002:** The system must display "Categories" tab showing table with columns: Icon, Name, Code, Sort Order, Question Count, Status (Active/Inactive), Actions.

**FR-1003:** The system must support category actions: Add New, Edit, Reorder (up/down arrows or drag-drop), Activate/Deactivate.

**FR-1004:** The system must display "Questions" tab showing table with columns: Category, Question Text, Expected Type, Sort Order, Usage Count, Last Used, Status, Actions.

**FR-1005:** The system must support question actions: Add New, Edit, Delete (soft), Reorder, Activate/Deactivate.

**FR-1006:** The system must provide form for adding/editing questions with fields:
- Category (dropdown of active categories)
- Question Text (textarea, required)
- Description (textarea, optional for tooltips)
- Expected Response Type (dropdown: narrative, table, chart)
- Sort Order (number input)
- Status (Active/Inactive checkbox)

**FR-1007:** The system must validate question text is not empty and does not exceed 500 characters.

**FR-1008:** The system must publish question changes immediately (no approval workflow).

**FR-1009:** The system must display usage analytics dashboard showing: top 10 most-clicked example questions with usage counts, bottom 10 least-used questions, total questions asked (all users), usage trend chart (questions per week over last 3 months).

**FR-1010:** The system must log all question library changes to audit_log table with user_id, timestamp, action (create/update/delete), old/new values.

### 4.11 Pagination and Large Result Sets

**FR-1101:** The system must display first 50 rows of query results when results contain more than 50 rows.

**FR-1102:** The system must display pagination controls below table: "Previous", page numbers, "Next", "Rows per page" dropdown (25/50/100).

**FR-1103:** The system must show total row count in table header (e.g., "Showing 1-50 of 247 results").

**FR-1104:** The system must calculate aggregates on all rows returned (not just displayed page).

**FR-1105:** The system must limit AI query results to maximum 10,000 rows to prevent performance issues.

**FR-1106:** The system must display message when results exceed 10,000 rows: "Results limited to first 10,000 rows. Use filters to narrow your query or use main dashboard export feature."

### 4.12 Export Functionality

**FR-1201:** The system must display "Export to Excel" button for table responses containing more than 10 rows.

**FR-1202:** The system must export Excel file containing: worksheet "Data" with table rows, question text asked in cell A1, timestamp in cell A2.

**FR-1203:** The system must NOT include aggregate statistics in Excel export (just data table).

**FR-1204:** The system must NOT include narrative explanation in Excel export.

**FR-1205:** The system must generate filename format: `ai-query-{YYYY-MM-DD}-{HHmm}.xlsx`.

**FR-1206:** The system must trigger download without navigating away from AI conversation.

**FR-1207:** The system must log export action to audit_log with user_id, timestamp, question asked, row count exported.

### 4.13 Question Usage Analytics

**FR-1301:** The system must track all AI questions asked (both example and user-written) in database or audit log.

**FR-1302:** The system must store full question text for all queries (not anonymized) to enable pattern analysis.

**FR-1303:** The system must associate tracked questions with user_id, timestamp, response success/failure, result row count.

**FR-1304:** The system must provide analytics query capability to identify: most common question patterns, frequently asked questions not in example library, questions that frequently fail or return empty results.

**FR-1305:** The system must display analytics in admin panel showing: total questions asked (last 7/30/90 days), unique users asking questions, average questions per session, success rate (% of queries returning results).

### 4.14 Smart Chart Detection and Rendering

**FR-1401:** The system must detect time series data by checking for date/time column plus numeric column(s) in query results.

**FR-1402:** The system must apply smart default display based on data characteristics:
- If date column + trend data (≥5 data points): Default to line chart with table collapsed
- If date column + comparison data (<5 data points): Default to bar chart with table collapsed
- If categorical column + numeric column (no dates): Default to table, offer chart toggle

**FR-1403:** The system must allow user to toggle between chart view and table view using tab controls or toggle button.

**FR-1404:** The system must render charts using Recharts library (consistent with Module 0010 dashboard charts).

**FR-1405:** The system must apply consistent color scheme from Module 0010 (Primary: #1E3A8A, Secondary: #10B981, etc.).

### 4.15 Modal Behavior and Accessibility

**FR-1501:** The system must remember last-viewed category in question library modal within browser session (reopen to same category).

**FR-1502:** The system must clear category memory on logout.

**FR-1503:** The system must support keyboard navigation in question library modal: Tab/Shift-Tab between questions, Arrow keys within category, Enter to select question, ESC to close.

**FR-1504:** The system must trap focus within modal when open (prevent tabbing to background elements).

**FR-1505:** The system must restore focus to trigger button when modal closes.

**FR-1506:** The system must provide screen-reader accessible labels for modal elements, buttons, and interactive components.

**FR-1507:** The system must announce modal open/close state to screen readers.

---

## 5. Non-Goals (Out of Scope)

**NG-001:** Parameterized questions with dropdown variable selection (e.g., "Show revenue for {region}") - deferred to Phase 2

**NG-002:** User-saved favorite questions or personal question libraries - deferred to Phase 2

**NG-003:** Role-based question filtering (different examples for CFO vs Regional Manager) - deferred to Phase 2

**NG-004:** Natural language query refinement or auto-complete suggestions

**NG-005:** AI query performance optimization (already covered in Module 0010)

**NG-006:** Question approval workflow (admin changes are immediate) - not needed for MVP

**NG-007:** Median calculation in aggregate statistics (SUM, AVG, COUNT, MIN/MAX only)

**NG-008:** Custom chart types beyond line and bar charts (pie charts, scatter plots, etc.)

**NG-009:** Collaborative features (sharing queries, commenting on results)

**NG-010:** Export formats other than Excel (CSV, PDF covered by main dashboard export)

**NG-011:** Offline question library caching

**NG-012:** Question recommendations based on user behavior or role

---

## 6. Design Considerations

### 6.1 Question Library Modal Design

**Modal Structure:**
```
┌──────────────────────────────────────────────────────────┐
│  Example Questions                     [Search...] [×]   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  📊 Simple Metrics (5)                                   │
│    • What was our total revenue last month?             │
│    • What is our current gross margin percentage?        │
│    • How many active jobs do we have right now?          │
│    • What was our total revenue last quarter?            │
│    • What are our total operating expenses this month?   │
│                                                           │
│  📈 Trends & Comparisons (5)                             │
│    • Show monthly revenue trend for the last 12 months  │
│    • Compare Q3 revenue to Q2                            │
│    • How has our margin changed quarter over quarter?    │
│    • Show revenue growth year-over-year                  │
│    • Compare this month's expenses to last month         │
│                                                           │
│  🔍 Variance Analysis (5)                                │
│  💼 Job Performance (5)                                  │
│  🏢 Regional & Division Analysis (5)                     │
│                                                           │
│  [Close]                                                  │
└──────────────────────────────────────────────────────────┘
```

**Interaction:**
- Hover over question: subtle background highlight
- Click question: modal closes, input populates, focus moves to input box
- Search: filters visible questions in all categories, hides empty categories

### 6.2 Response Display Patterns

**Pattern: Narrative Only (Single Row)**
```
User: What was our total revenue last month?

─────────────────────────────────────
AI Response:

Total revenue for September 2025 was $8.5M, representing a 12.3% 
increase compared to August 2025 ($7.6M).

[Show SQL] button visible for Finance Analyst role →
─────────────────────────────────────
```

**Pattern: Table with Aggregates (Multiple Rows)**
```
User: Show revenue by region for Q3

─────────────────────────────────────
AI Response:

Here's the revenue breakdown by region for Q3 2025:

┌──────────────┬────────────┐
│ Region       │ Revenue    │
├──────────────┼────────────┤
│ Dallas       │ $12.5M     │
│ Houston      │ $8.3M      │
│ Austin       │ $4.2M      │
│ San Antonio  │ $3.1M      │
└──────────────┴────────────┘

Summary Statistics:
┌──────────────┬────────────┐
│ Total        │ $28.1M     │
│ Average      │ $7.0M      │
│ Regions      │ 4          │
└──────────────┴────────────┘

Dallas led regional performance with $12.5M in Q3 revenue,
representing 44% of the total.

[Show SQL] [Export to Excel]
─────────────────────────────────────
```

**Pattern: Chart with Collapsible Table**
```
User: Show monthly revenue trend for last 12 months

─────────────────────────────────────
AI Response:

[Line chart rendering revenue Oct 2024 - Sep 2025]

▼ View Data Table

Revenue has grown consistently over the past 12 months,
increasing from $7.2M in October 2024 to $8.5M in 
September 2025 (18% growth).

Summary Statistics:
- Total (12 months): $98.4M
- Average: $8.2M/month  
- Peak: $9.1M (June 2025)
- Lowest: $7.2M (October 2024)

[Show SQL] [Export to Excel]
─────────────────────────────────────
```

### 6.3 SQL Modal Design

```
┌─────────────────────────────────────────────────┐
│  Generated SQL Query                      [×]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  SELECT                                         │
│      r.region_name,                            │
│      SUM(m.total_revenue) as revenue           │
│  FROM semantic.monthly_financials m            │
│  JOIN core.dim_region r                        │
│      ON m.region_name = r.region_name         │
│  WHERE m.year = 2025                           │
│      AND m.month BETWEEN 7 AND 9               │
│  GROUP BY r.region_name                        │
│  ORDER BY revenue DESC;                        │
│                                                 │
│  Data Sources:                                  │
│  • semantic.monthly_financials                  │
│  • core.dim_region                             │
│                                                 │
│  [Copy SQL] [Explain This Query] [Close]      │
└─────────────────────────────────────────────────┘
```

**Syntax Highlighting Colors:**
- Keywords (SELECT, FROM, WHERE): Blue (#1E40AF)
- Functions (SUM, COUNT): Purple (#7C3AED)
- Strings: Green (#059669)
- Numbers: Orange (#EA580C)
- Comments: Gray (#6B7280)

### 6.4 Admin Question Management UI

**Categories Tab:**
```
┌──────────────────────────────────────────────────────────┐
│  AI Question Library - Categories          [+ Add New]   │
├──────────────────────────────────────────────────────────┤
│  Icon │ Name                    │ Code  │ Sort │ Qs │    │
├───────┼─────────────────────────┼───────┼──────┼────┼────┤
│  📊   │ Simple Metrics          │ simple│  10  │ 5  │[↑↓]│
│  📈   │ Trends & Comparisons    │ trends│  20  │ 5  │[↑↓]│
│  🔍   │ Variance Analysis       │ varia │  30  │ 5  │[↑↓]│
│  💼   │ Job Performance         │ jobs  │  40  │ 5  │[↑↓]│
│  🏢   │ Regional & Division     │ region│  50  │ 5  │[↑↓]│
└──────────────────────────────────────────────────────────┘
```

**Questions Tab:**
```
┌──────────────────────────────────────────────────────────────────────┐
│  AI Question Library - Questions                   [+ Add Question]  │
├──────────────────────────────────────────────────────────────────────┤
│  Category       │ Question                      │ Used │ Status │    │
├─────────────────┼───────────────────────────────┼──────┼────────┼────┤
│  Simple Metrics │ What was our total revenue... │ 142  │ Active │[Ed]│
│  Simple Metrics │ What is our current margin... │  89  │ Active │[Ed]│
│  Trends         │ Show monthly revenue trend... │  67  │ Active │[Ed]│
│  (scroll for more...)                                                │
└──────────────────────────────────────────────────────────────────────┘

[Usage Analytics] tab showing:
- Top 10 Most Clicked Questions (bar chart)
- Questions Never Used (list)
- Questions Asked Per Week (line chart)
```

---

## 7. Technical Considerations

### 7.1 Frontend Components (React)

**New Components:**
- `QuestionLibraryModal.tsx` - Main modal component
- `QuestionCategorySection.tsx` - Category with question list
- `QuestionListItem.tsx` - Individual question item
- `SQLDisplayModal.tsx` - SQL viewer modal
- `ResponseRenderer.tsx` - Smart response formatter
- `NarrativeResponse.tsx` - Single value display
- `TableWithAggregates.tsx` - Table + summary stats
- `ChartResponse.tsx` - Auto-chart rendering
- `AggregateStatsTable.tsx` - Reusable aggregates table
- `ExportButton.tsx` - Excel export for tables
- `AdminQuestionLibrary.tsx` - Admin management UI

**Modified Components:**
- `AIAnalystPage.tsx` - Add QuestionLibraryButton, integrate ResponseRenderer
- `AIResponse.tsx` - Replace basic rendering with ResponseRenderer

### 7.2 Backend Services (Python)

**New Services:**
- `backend/services/response_formatter.py`:
  - `detect_result_type(rows, columns)` - Apply 6 formatting rules
  - `should_show_aggregates(row_count)` - Returns True if >3 rows
  - `calculate_aggregates(df, column_types)` - Compute SUM, AVG, COUNT, MIN, MAX
  - `detect_time_series(columns)` - Check for date + numeric columns
  - `format_for_chart(df)` - Transform data for Recharts format

**New API Routes:**
- `backend/api/ai_questions.py` - Example question CRUD endpoints
- `backend/api/admin/ai_questions.py` - Admin management endpoints

**Modified Services:**
- `backend/api/ai.py` - Modify `POST /ai/query` response to include metadata (row_count, column_types, is_time_series)

### 7.3 Database Migrations

**New Migration:** `database/migrations/versions/005_ai_question_library.py`

Creates:
- `core.ai_question_categories` table
- `core.ai_example_questions` table
- Indexes for performance
- Seed data for 5 categories and 20-30 questions

### 7.4 Dependencies

**NPM Packages (Frontend):**
- `react-syntax-highlighter` or `prismjs` - SQL syntax highlighting
- `clipboard` or use native `navigator.clipboard` API
- Existing: `recharts`, `axios`, `react-hook-form`

**Python Packages (Backend):**
- `openpyxl` - Excel generation (already in Module 0010)
- `sqlparse` or `sqlglot` - SQL formatting for display
- Existing: `pandas`, `fastapi`, `sqlalchemy`

### 7.5 Integration Points

**Module 0010 Dependencies:**
- Auth context (role-based UI rendering)
- API client (axios instance with auth)
- Color scheme and styling (Tailwind config)
- Chart library (Recharts)
- Admin panel layout and routing
- Audit logging service

**No Breaking Changes:**
- All enhancements are additive
- Existing AI query flow continues to work
- Graceful degradation if question library unavailable

---

## 8. Success Metrics

### 8.1 Discoverability Metrics

**Target:** 80%+ of users browse example questions on first visit

**Measurement:**
- Track "Example Questions" button clicks in first session
- Track modal open rate within first 5 minutes of first AI page visit
- Survey: "How did you learn what questions to ask?" (Options: Example library, trial and error, training, documentation)

### 8.2 Response Quality Metrics

**Target:** 90%+ of responses use appropriate formatting

**Measurement:**
- Audit responses to classify formatting applied (narrative, table, chart, etc.)
- Verify Rule 1 applied to single-row results: target 95%+
- Verify Rule 2 applied to multi-row results: target 90%+
- Verify Rule 4 applied to time series: target 85%+ (some edge cases)

### 8.3 User Satisfaction Metrics

**Target:** 80%+ responses rated helpful

**Measurement:**
- Add thumbs-up/thumbs-down rating to each AI response
- Track rating percentage by response type (narrative vs table vs chart)
- Optional comment field for negative ratings
- Target: Narrative responses 85%+ helpful, Table responses 80%+ helpful, Chart responses 85%+ helpful

### 8.4 SQL Transparency Metrics

**Target:** Finance Analysts use SQL feature, Executives don't

**Measurement:**
- Track "Show SQL" button clicks by user role
- Finance Analysts: 50%+ of queries (verify transparency value)
- Executives: <5% of queries (verify clean interface)
- Admin: 30%+ of queries (moderate technical interest)

### 8.5 Question Library Usage Metrics

**Target:** Example questions drive 40%+ of AI queries

**Measurement:**
- Track questions asked: Example question clicked vs User-written
- Week 1: 60%+ example questions (heavy reliance while learning)
- Week 4: 40%+ example questions (users comfortable writing own)
- Track which categories are most used
- Identify unused questions for removal

### 8.6 Admin Efficiency Metrics

**Target:** Admin can update questions in <2 minutes

**Measurement:**
- Time from "Add Question" click to published (should be <2 min for simple add)
- Number of questions added/updated per month (indicates active curation)
- Feedback from admin users on ease of use

---

## 9. Open Questions

**Q1:** Should the "Explain This Query" button in SQL modal call GPT-4 (adds API cost per click) or use rule-based explanation?
- **Impact:** AI cost vs explanation quality
- **Owner:** Technical lead
- **Needed By:** Week 2 (before SQL modal implementation)

**Q2:** For chart rendering - should we support multiple Y-axes for different metric scales (revenue vs margin %)?
- **Impact:** Chart component complexity
- **Owner:** Frontend developer + stakeholder review
- **Needed By:** Week 3 (before chart implementation)

**Q3:** Should aggregate statistics include MEDIAN calculation?
- **Impact:** Requires sorting entire dataset (performance impact for large results)
- **Owner:** CFO input
- **Needed By:** Week 2
- **Current Decision:** No (just SUM, AVG, COUNT, MIN, MAX)

**Q4:** How should we handle queries returning >5 columns (wide tables)?
- **Impact:** Responsive table rendering strategy
- **Owner:** UX decision
- **Needed By:** Week 2
- **Options:** Horizontal scroll, column selection, responsive stacking

**Q5:** Should chart type be user-overridable (let user switch line→bar) or AI-selected only?
- **Impact:** UI complexity vs flexibility
- **Owner:** Stakeholder preference
- **Needed By:** Week 3

**Q6:** For parameterized questions (Phase 2), what's the priority and desired timeline?
- **Impact:** Phase 2 planning
- **Owner:** Product owner
- **Needed By:** End of Phase 1 for Phase 2 roadmap

---

## 10. Appendix

### 10.1 Clarifying Questions and Answers Recap

**Q1:** Of the 6 response formatting rules proposed, any modifications needed?  
**A:** All 6 rules are good as-is.

**Q2:** Should SQL modal only appear for certain query types or always available?  
**A:** SQL button should always appear (for permitted roles), modal opens only when user clicks button.

**Q3:** Is 20-30 example questions the right scope?  
**A:** Yes, 20-30 is good.

**Q4:** Should modal auto-show on first visit?  
**A:** No, user must click button to open modal.

**Q5:** When user clicks example question, auto-submit or wait?  
**A:** Populate input and wait for user to click "Ask" button.

**Q6:** Build admin UI now or later?  
**A:** Build admin UI now (include in this module).

**Q7:** What question usage should be tracked?  
**A:** Track both example question clicks and all custom questions asked.

**Q8:** Include parameterized questions now or Phase 2?  
**A:** Phase 2.

**Q9:** Which aggregate calculations are must-haves?  
**A:** SUM, AVG, COUNT, MIN/MAX (not MEDIAN).

**Q10:** Export button for all tables or only large ones?  
**A:** Only for tables with more than 10 rows.

**Additional Clarifications:**

**Q-A1:** When should aggregate statistics table appear?  
**A:*** Only when data table has more than 3 rows (avoid clutter for small result sets).

**Q-A2:** How to handle results with >100 rows?  
**A:** Show first 50 rows with pagination controls (25/50/100 rows per page).

**Q-A3:** Smart chart default behavior?  
**A:*** Apply intelligent default based on data characteristics: trends default to line chart, comparisons to bar chart, allow user toggle.

**Q-A4:** Should modal remember last-viewed category?  
**A:*** Yes, remember within browser session for better UX (reopen to same category user was browsing).

**Q-A5:** Excel export should include?  
**A:** Data table + question asked (not aggregates or narrative).

*Note: Asterisk (*) indicates answer was AI-recommended based on UX best practices.*

### 10.2 Related Documentation

- **`0001-srs-ai-question-library.md`** - Software Requirements Specification (this feature)
- **`../0010/0010-srs-superscapes-financial.md`** - Parent project SRS
- **`../0010/0010-prd-superscapes-financial-mvp.md`** - Parent project PRD
- **`../0010/0010-tech-stack.md`** - Technology stack (applies to this feature)
- **`seed.md`** - Original feature concept

---

## Document Control

**Prepared By:** AI Assistant  
**Review Status:** Draft - Pending stakeholder review  
**Dependencies:** Awaiting Questions.md responses from client (Module 0010)  

**Next Steps:**
1. Review PRD with project stakeholders
2. Generate implementation task list using `03-generate-tasks.md` workflow
3. Begin implementation after Module 0010 core infrastructure is in place

**Change Log:**
- 2025-10-29: Initial PRD creation (v1.0)

---

*End of Product Requirements Document*
