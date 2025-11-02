# Task List: AI Question Library & Response Format Enhancement

**Based on:** `0001-prd-ai-question-library.md`  
**Project Code:** 0001  
**Parent Project:** Module 0010  
**Target Timeline:** 4 weeks  
**Created:** October 29, 2025

---

## Relevant Files

### Backend (FastAPI)
- `backend/api/ai_questions.py` - API endpoints for example questions
- `backend/api/admin/ai_questions.py` - Admin CRUD endpoints
- `backend/services/response_formatter.py` - Response formatting logic
- `backend/services/aggregate_calculator.py` - Aggregate statistics calculations
- `backend/models/ai_questions.py` - SQLAlchemy models for question tables
- `backend/schemas/ai_questions.py` - Pydantic schemas for API requests/responses
- `backend/tests/test_response_formatter.py` - Response formatter tests
- `backend/tests/test_ai_questions_api.py` - API endpoint tests

### Database
- `database/migrations/versions/005_ai_question_library.py` - Migration for new tables
- `database/seeds/seed_ai_questions.sql` - Seed data for categories and questions

### Frontend (React)
- `frontend/src/components/AI/QuestionLibraryModal.tsx` - Question browser modal
- `frontend/src/components/AI/QuestionLibraryModal.test.tsx` - Modal tests
- `frontend/src/components/AI/QuestionCategorySection.tsx` - Category display
- `frontend/src/components/AI/QuestionListItem.tsx` - Individual question item
- `frontend/src/components/AI/SQLDisplayModal.tsx` - SQL viewer modal
- `frontend/src/components/AI/SQLDisplayModal.test.tsx` - SQL modal tests
- `frontend/src/components/AI/ResponseRenderer.tsx` - Smart response formatter
- `frontend/src/components/AI/ResponseRenderer.test.tsx` - Formatter tests
- `frontend/src/components/AI/NarrativeResponse.tsx` - Single value display
- `frontend/src/components/AI/TableWithAggregates.tsx` - Table + stats display
- `frontend/src/components/AI/ChartResponse.tsx` - Auto-chart rendering
- `frontend/src/components/AI/AggregateStatsTable.tsx` - Summary statistics
- `frontend/src/components/AI/AggregateStatsTable.test.tsx` - Aggregates tests
- `frontend/src/components/AI/ExportButton.tsx` - Excel export button
- `frontend/src/components/Dashboard/ExportButton.tsx` - Reusable export component
- `frontend/src/pages/admin/AIQuestionLibrary.tsx` - Admin management UI
- `frontend/src/api/ai_questions.ts` - API client for question endpoints
- `frontend/src/utils/sqlFormatter.ts` - SQL formatting utilities
- `frontend/src/utils/aggregateCalculator.ts` - Client-side aggregate helper

### Notes

- Task 0.0 creates a dedicated Git branch for this feature work
- This is a feature enhancement to existing Module 0010 codebase
- Depends on Module 0010 core infrastructure (database, backend API, frontend foundation)
- Tech stack inherited from Module 0010: React 18+ (TypeScript), FastAPI (Python), PostgreSQL
- See `../0010/0010-tech-stack.md` for complete technology decisions
- Unit tests should be placed alongside code files
- Backend tests use pytest; Frontend tests use Vitest
- Use `pytest` to run backend tests, `npm run test` to run frontend tests

---

## Tasks

- [x] **0.0 Create Feature Branch**
  - [x] 0.1 Create a new Git branch named `feature/ai-question-library` from poc-dev branch
  - [x] 0.2 Push the empty branch to remote repository
  - [x] 0.3 Set up branch to merge into Module 0010 development when complete

- [x] **1.0 Database Schema & Question Library Setup**
  - [x] 1.1 Create database migration `005_ai_question_library.py`: create `core.ai_question_categories` table with columns (category_id, category_code, category_name, category_icon, category_description, sort_order, is_active, created_at)
  - [x] 1.2 Add indexes to categories table: index on sort_order, index on is_active
  - [x] 1.3 Create `core.ai_example_questions` table with columns (question_id, category_id FK, question_text, question_description, expected_response_type, sort_order, is_active, usage_count, last_used_at, created_at, created_by)
  - [x] 1.4 Add indexes to questions table: index on category_id, index on sort_order, index on is_active, index on usage_count DESC
  - [x] 1.5 Create seed data file `seed_ai_questions.sql` inserting 5 categories: Simple Metrics (📊, sort 10), Trends & Comparisons (📈, sort 20), Variance Analysis (🔍, sort 30), Job Performance (💼, sort 40), Regional & Division Analysis (🏢, sort 50)
  - [x] 1.6 Create seed questions for Simple Metrics category (5 questions): "What was our total revenue last month?", "What is our current gross margin percentage?", "How many active jobs do we have right now?", etc. with sort orders 10, 20, 30, 40, 50
  - [x] 1.7 Create seed questions for Trends & Comparisons (5 questions), Variance Analysis (5 questions), Job Performance (5 questions), Regional & Division (5 questions) - total 25 questions
  - [x] 1.8 Run migration locally on Module 0010 dev database: `alembic upgrade head`, verify tables created with `\dt core.ai_*`
  - [x] 1.9 Load seed data: execute `seed_ai_questions.sql`, verify 5 categories and 25 questions inserted, query to confirm data
  - [x] 1.10 Document question library structure in Module 0010 `docs/database.md` with table descriptions and seeding process

- [x] **2.0 Backend API Development**
  - [x] 2.1 Create SQLAlchemy models: write `backend/models/ai_questions.py` with `QuestionCategory` and `ExampleQuestion` models matching table schema
  - [x] 2.2 Create Pydantic schemas: write `backend/schemas/ai_questions.py` with `CategoryResponse`, `QuestionResponse`, `QuestionLibraryResponse` (categories with nested questions), `CreateQuestionRequest`, `UpdateQuestionRequest`, `QuestionAnalytics` schemas
  - [x] 2.3 Create example questions API: write `backend/api/ai_questions.py` with `GET /ai/example-questions` endpoint querying active categories and questions ordered by sort_order, returning grouped structure
  - [x] 2.4 Create question tracking endpoint: in `backend/api/ai_questions.py` add `POST /ai/question-clicked` endpoint accepting question_id, incrementing usage_count, updating last_used_at, returning success (non-blocking, fire-and-forget)
  - [x] 2.5 Create response formatter service: write `backend/services/response_formatter.py` with functions: `detect_result_type(rows: List[dict], columns: List[str])` returning 'narrative', 'table', 'chart', 'empty', or 'error', `should_show_aggregates(row_count: int)` returning True if >3 rows
  - [x] 2.6 Implement aggregate calculator: write `backend/services/aggregate_calculator.py` with function `calculate_aggregates(df: DataFrame)` detecting column types (currency, percentage, date) and calculating SUM, AVG, COUNT, MIN, MAX for appropriate columns, returning dict with aggregate values
  - [x] 2.7 Implement time series detector: in `response_formatter.py` add function `detect_time_series(columns: List[dict])` checking for date/time column plus numeric column(s), returning boolean and recommended chart type ('line' or 'bar')
  - [x] 2.8 Modify AI query endpoint: update `backend/api/ai.py` `POST /ai/query` response to include metadata object with fields: row_count, column_count, column_types (array of {name, type}), is_time_series, recommended_display_type, call response_formatter to detect and include in response
  - [x] 2.9 Create admin question endpoints: write `backend/api/admin/ai_questions.py` with `GET /admin/ai-questions` (list all with usage stats), `POST /admin/ai-questions` (create new), `PATCH /admin/ai-questions/{id}` (update), `DELETE /admin/ai-questions/{id}` (soft delete), all requiring Admin role
  - [x] 2.10 Create admin category endpoints: in `backend/api/admin/ai_questions.py` add `GET /admin/ai-categories`, `POST /admin/ai-categories`, `PATCH /admin/ai-categories/{id}` endpoints for category management
  - [x] 2.11 Create analytics endpoint: add `GET /admin/ai-question-analytics` returning: top 10 clicked questions, least used questions (usage_count=0), total questions asked last 7/30/90 days, usage trend data
  - [x] 2.12 Track all AI queries: update `POST /ai/query` to log full question text to audit_log or new tracking table for pattern analysis
  - [x] 2.13 Write backend tests: create `backend/tests/test_response_formatter.py` testing detect_result_type with various inputs, test aggregate calculator with sample DataFrames, test time series detection logic
  - [x] 2.14 Write API tests: create `backend/tests/test_ai_questions_api.py` testing GET example-questions returns correct structure, POST question-clicked increments count, admin endpoints require Admin role and perform CRUD correctly

- [x] **3.0 Frontend Response Rendering Components**
- [x] 3.1 Create response formatter utility: write `frontend/src/utils/aggregateCalculator.ts` with function `calculateAggregates(data: any[], columns: string[])` performing client-side SUM, AVG, COUNT, MIN, MAX calculations, detecting currency vs percentage vs date columns by column name patterns or data format
- [x] 3.2 Create ResponseRenderer component: write `frontend/src/components/AI/ResponseRenderer.tsx` accepting props (queryResult, metadata), implementing switch logic based on metadata.recommended_display_type, rendering appropriate child component (Narrative, Table, Chart)
- [x] 3.3 Create NarrativeResponse component: write `frontend/src/components/AI/NarrativeResponse.tsx` displaying AI narrative with embedded formatted values, no table rendering
- [x] 3.4 Create TableWithAggregates component: write `frontend/src/components/AI/TableWithAggregates.tsx` rendering data table using TanStack Table with sorting, conditionally showing AggregateStatsTable below if row count >3, displaying narrative above or below table
- [x] 3.5 Create AggregateStatsTable component: write `frontend/src/components/AI/AggregateStatsTable.tsx` accepting aggregates object, rendering summary table with distinct styling (bold headers, light background), formatting values (currency, percentages), labeling clearly ("Summary Statistics" or "Totals")
- [x] 3.6 Create unit tests for aggregates: write `frontend/src/components/AI/AggregateStatsTable.test.tsx` testing rendering with various aggregate inputs, null handling, formatting
- [x] 3.7 Create ChartResponse component: write `frontend/src/components/AI/ChartResponse.tsx` rendering Recharts line or bar chart based on metadata.chart_type, including collapsible data table below (▼ View Data Table toggle starting collapsed), displaying narrative and aggregates
- [x] 3.8 Implement chart configuration: in ChartResponse configure Recharts with consistent colors from Module 0010 (Primary: #1E3A8A, Secondary: #10B981), labeled axes (X=date, Y=metric+units), tooltips on hover, responsive sizing
- [x] 3.9 Create ExportButton component: write `frontend/src/components/AI/ExportButton.tsx` (or extend existing export component) with button showing for tables >10 rows, on click calling Excel client-side using SheetJS/xlsx library, including question text and data table only
- [x] 3.10 Create EmptyResultsResponse component: write `frontend/src/components/AI/EmptyResultsResponse.tsx` displaying helpful message, suggested alternative questions (clickable to populate input), positive/neutral tone
- [x] 3.11 Create ErrorResponse component: write `frontend/src/components/AI/ErrorResponse.tsx` displaying user-friendly error, which step failed, suggested alternatives, "Ask a Human" escalation button
- [x] 3.12 Modify AI Analyst page: update `frontend/src/pages/AIAnalyst.tsx` to use ResponseRenderer instead of basic response display, pass query metadata to ResponseRenderer, handle different response types
- [x] 3.13 Write component tests: create `frontend/src/components/AI/ResponseRenderer.test.tsx` testing each formatting rule applied correctly based on metadata, edge cases (empty, errors, large results)

- [x] **4.0 Question Library Modal UI**
- [x] 4.1 Create API client: write `frontend/src/api/ai_questions.ts` with functions: `getExampleQuestions()` calling `GET /ai/example-questions`, `trackQuestionClick(questionId)` calling `POST /ai/question-clicked`
- [x] 4.2 Create QuestionLibraryModal component: write `frontend/src/components/AI/QuestionLibraryModal.tsx` with modal overlay, header with title and close button, search input, scrollable body with categories, close on backdrop/ESC, responsive (700px centered on desktop, fullscreen on mobile)
- [x] 4.3 Create QuestionCategorySection component: write `frontend/src/components/AI/QuestionCategorySection.tsx` displaying category icon, name, question count in parentheses, list of questions from category ordered by sort_order
- [x] 4.4 Create QuestionListItem component: write `frontend/src/components/AI/QuestionListItem.tsx` rendering clickable question text, hover effect, onClick handler emitting question text to parent
- [x] 4.5 Implement search functionality: add search input filtering questions by text match (searches question_text and description), hide categories with no matching questions, debounce search input (300ms delay)
- [x] 4.6 Implement modal behavior in AI Analyst page: add "Example Questions" button near input box, onClick open QuestionLibraryModal, on question selected close modal + populate input + focus input (don't auto-submit), call trackQuestionClick asynchronously
- [x] 4.7 Implement session memory: store last-viewed category_id in sessionStorage, reopen modal to same category, clear on logout
- [x] 4.8 Implement keyboard navigation: Tab between questions, Enter to select, ESC to close, Arrow keys within category, trap focus within modal, restore focus to trigger button on close
- [x] 4.9 Add accessibility attributes: aria-labels, aria-describedby for questions with descriptions, role="dialog", aria-modal="true", focus management, screen reader announcements
- [x] 4.10 Style modal: use Tailwind CSS consistent with Module 0010, category sections with spacing, question hover states, search input styling, responsive breakpoints
- [x] 4.11 Write modal tests: create `frontend/src/components/AI/QuestionLibraryModal.test.tsx` testing modal opens/closes, questions filtered by search, question selection populates input, keyboard navigation works

- [x] **5.0 SQL Display Modal & Advanced Features**
- [x] 5.1 Create SQL modal component: write `frontend/src/components/AI/SQLDisplayModal.tsx` with modal overlay, header ("Generated SQL Query"), close button, scrollable SQL code block, footer with buttons
- [x] 5.2 Install syntax highlighting: add `react-syntax-highlighter` package, import PostgreSQL language definition, configure theme matching Module 0010 color scheme (keywords blue, functions purple, strings green)
- [x] 5.3 Implement SQL formatting: write `frontend/src/utils/sqlFormatter.ts` with function `formatSQL(sql: string)` adding indentation, line breaks, aligned keywords using sqlparse or manual formatting rules, return formatted string
- [x] 5.4 Implement copy to clipboard: add "Copy SQL" button calling `navigator.clipboard.writeText(formattedSQL)`, show "Copied!" feedback for 2 seconds, handle clipboard permission errors gracefully
- [x] 5.5 Display data sources: extract table names from SQL using regex or parse metadata from backend, display as bulleted list below SQL code ("Data Sources: • semantic.monthly_financials • core.dim_region")
- [x] 5.6 Implement "Explain This Query" feature: add button calling `POST /ai/explain-sql` endpoint (create in backend) passing SQL, returning plain English explanation, display explanation in modal below SQL or in expandable section
- [x] 5.7 Create SQL explanation endpoint: write `backend/api/ai.py` `POST /ai/explain-sql` accepting SQL string, building prompt for GPT-4 "Explain this SQL query in plain English for a non-technical user", returning explanation text
- [x] 5.8 Implement role-based SQL button visibility: in ResponseRenderer conditionally render "Show SQL" button only if user.role in ['Finance Analyst', 'Admin'], hide completely for Executive and Regional Manager roles
- [x] 5.9 Create pagination controls: write `frontend/src/components/AI/PaginationControls.tsx` for tables >50 rows, showing "Previous", page numbers, "Next", rows-per-page selector (25/50/100), "Showing X-Y of Z results" text
- [x] 5.10 Integrate pagination with TableWithAggregates: add pagination state (currentPage, rowsPerPage), slice data for display, calculate aggregates on full dataset (not just current page)
- [x] 5.11 Write SQL modal tests: create `frontend/src/components/AI/SQLDisplayModal.test.tsx` testing modal opens with SQL, copy button works, explain button calls API, role-based visibility

- [x] **6.0 Admin Question Management UI**
  - [x] 6.1 Create admin page: write `frontend/src/pages/admin/AIQuestionLibrary.tsx` with tab navigation (Categories, Questions, Analytics), integrate into admin panel routing and navigation menu
  - [x] 6.2 Create Categories tab: display table of all categories with columns (Icon, Name, Code, Sort Order, Question Count, Status, Actions), add "Add Category" button, edit/reorder/activate-deactivate actions per row
  - [x] 6.3 Create Questions tab: display table of all questions with columns (Category, Question Text excerpt, Expected Type, Sort Order, Usage Count, Last Used, Status, Actions), add "Add Question" button, edit/delete/reorder/toggle actions
  - [x] 6.4 Create category form modal: form with fields (Category Code, Category Name, Category Icon - text or emoji picker, Description, Sort Order, Active checkbox), validation (required fields, unique code), save calling `POST /admin/ai-categories` or `PATCH /admin/ai-categories/{id}`
  - [x] 6.5 Create question form modal: form with fields (Category dropdown, Question Text textarea with 500 char limit, Description textarea optional, Expected Response Type dropdown (narrative/table/chart), Sort Order number input, Active checkbox), validation (required fields), save calling `POST /admin/ai-questions` or `PATCH /admin/ai-questions/{id}`
  - [x] 6.6 Implement reordering UI: add up/down arrow buttons adjusting sort_order (swap values with adjacent item), or drag-drop using react-beautiful-dnd library, save new sort order calling PATCH endpoint
  - [x] 6.7 Create Analytics tab: fetch data from `GET /admin/ai-question-analytics`, display "Top 10 Most Clicked" bar chart, "Least Used Questions" table, "Questions Asked Per Week" line chart (last 12 weeks), total questions asked metric
  - [x] 6.8 Implement soft delete: "Delete" action sets is_active=false (doesn't remove from database), show confirmation dialog before delete, audit log records deletion
  - [x] 6.9 Add bulk operations: checkboxes for multi-select, "Bulk Actions" dropdown (Activate, Deactivate, Change Category), apply to selected questions
  - [x] 6.10 Integrate with audit logging: all create/update/delete actions call audit service logging user_id, action, old/new values
  - [x] 6.11 Write admin UI tests: create component tests for forms (validation works, save calls API), table interactions (sort, filter, actions), analytics display

- [x] **7.0 Testing & Integration**
- [x] 7.1 Write response formatter unit tests: test `detect_result_type()` with: 1 row 2 cols → 'narrative', 10 rows 3 cols → 'table', time series data → 'chart', 0 rows → 'empty'
- [x] 7.2 Write aggregate calculator tests: test SUM/AVG/COUNT/MIN/MAX with sample data, test null handling, test column type detection (currency vs percentage)
- [x] 7.3 Write API integration tests: test full flow GET example-questions → click question → POST question-clicked → usage_count increments, test admin CRUD operations, test role-based access (non-admin gets 403)
- [x] 7.4 Write frontend component integration tests: test QuestionLibraryModal displays questions grouped by category, search filters correctly, question click populates input, test ResponseRenderer renders narrative for single row, table for multi-row, chart for time series
- [x] 7.5 Test all 6 formatting rules with real/realistic data: create test dataset covering each rule, verify correct rendering, verify aggregates calculated correctly, verify charts render with proper data
- [x] 7.6 Test pagination with large datasets: test with 100, 500, 1000 row results, verify pagination works, aggregates calculated on full dataset, export works
- [x] 7.7 Test role-based features: verify SQL button hidden for Executives, visible for Finance Analysts, verify admin endpoints accessible only to Admins
- [x] 7.8 Test edge cases: empty categories, single category with 50 questions, questions with special characters in text, SQL with very long queries, results with null values in aggregate columns
- [x] 7.9 Perform browser compatibility testing: test modals and components in Chrome, Firefox, Safari, Edge (latest 2 versions)
- [x] 7.10 Perform accessibility testing: keyboard navigation through modals, screen reader compatibility, focus management, color contrast ratios
- [x] 7.11 Integration test with Module 0010: deploy feature to Module 0010 dev environment, test AI Analyst page with enhancements, verify no breaking changes to existing functionality, test admin panel integration
- [x] 7.12 Create feature documentation: document in Module 0010 `docs/ai-service.md` the response formatting rules, question library management process, adding new example questions guide

---

**Status:** Complete task list generated (0.0 - 7.0) with detailed sub-tasks

**Task Summary:**
- **0.0 Git Branch** - 3 sub-tasks
- **1.0 Database Schema** - 10 sub-tasks
- **2.0 Backend API** - 14 sub-tasks
- **3.0 Frontend Response Rendering** - 13 sub-tasks
- **4.0 Question Library Modal** - 11 sub-tasks
- **5.0 SQL Modal & Pagination** - 11 sub-tasks
- **6.0 Admin Management UI** - 11 sub-tasks
- **7.0 Testing & Integration** - 12 sub-tasks

**Total:** 85 detailed, actionable sub-tasks covering the complete feature enhancement

**Next Steps:**
1. Review task list for completeness
2. Begin implementation starting with Task 0.0 (create branch)
3. Track progress by checking off completed tasks
4. Refer to PRD for detailed requirements when implementing each task

---

*Task list follows the structure defined in `03-generate-tasks.md`*
