# Task List: Global Date Range Picker & Admin UI Navigation
## Mod 0002

**Based on**: 0002-prd-date-range-picker-admin-nav.md (v1.2)
**Created**: October 30, 2025
**Last Reviewed**: October 30, 2025
**Estimated Duration**: 9 days (1.8 weeks)
**Target Completion**: November 8, 2025

---

## Relevant Files

### Backend Files
- `poc/backend/models/system_variables.py` - New model for system_variables table (fiscal year config, inception date)
- `poc/backend/migrations/versions/[timestamp]_create_system_variables.py` - Alembic migration for system_variables table
- `poc/backend/api_routes/system_variables.py` - New API routes for GET /api/system-variables and /api/system-variables/{key}
- `poc/backend/api_routes/dashboard.py` - Modified to accept start_date and end_date query parameters
- `poc/backend/api_routes/ask.py` - Modified to augment AI prompts with date range context
- `poc/database/seeds/seed_system_variables.py` - Seed script for initial system_variables data
- `poc/database/fix_account_signs.py` - ✅ One-time utility to correct COGS and Other Operating Expense signs (with dry-run mode, safety checks, and transaction rollback)
- `poc/database/batch_load.py` - Modified to update data_inception_date during loads AND transform COGS/OpEx amounts
- `poc/database/fast_load.py` - Modified to update data_inception_date during loads AND transform COGS/OpEx amounts
- `poc/backend/tests/test_system_variables.py` - Unit tests for system variables API
- `poc/backend/tests/test_dashboard_date_filtering.py` - Unit tests for dashboard date filtering
- `poc/backend/tests/test_ask_date_filtering.py` - Unit tests for AI query date filtering

### Frontend Files
- `poc/frontend/src/contexts/DateRangeContext.tsx` - New React Context for global date range state
- `poc/frontend/src/components/DateRangePicker.tsx` - New dropdown component for date range selection
- `poc/frontend/src/components/DateRangeIndicator.tsx` - New component to display active date range
- `poc/frontend/src/components/AdminNavButton.tsx` - New navigation button for Admin UI
- `poc/frontend/src/components/QueryOverrideBadge.tsx` - New component for override warnings
- `poc/frontend/src/utils/dateRangeCalculator.ts` - Utility to calculate start/end dates from selections
- `poc/frontend/src/utils/queryOverrideDetector.ts` - Utility to detect date overrides in queries
- `poc/frontend/src/types/dateRange.ts` - TypeScript types for date range functionality
- `poc/frontend/src/api/systemVariables.ts` - API client functions for system variables
- `poc/frontend/src/App.tsx` - Modified to wrap app in DateRangeProvider and update header
- `poc/frontend/src/components/Dashboard.tsx` - Modified to use date range context and show indicators
- `poc/frontend/src/components/KPICard.tsx` - Modified to display date range indicator
- `poc/frontend/src/components/AskAI.tsx` - Modified to use date range, show indicators, update example pills
- `poc/frontend/src/components/AI/ResponseRenderer.tsx` - Modified to show date range context and override warnings
- `poc/frontend/src/main.tsx` - Modified to add React Router for admin navigation (if needed)

### Notes

- Task 0.0 creates the git branch for this feature work
- **Task 0.4-0.10 handle one-time data transformation** - must be completed BEFORE implementing date range picker to ensure clean data foundation
- Backend changes should be completed first to provide APIs for frontend
- Unit tests should be written alongside implementation (not as a separate final step)
- Use existing patterns from the codebase (FastAPI, SQLAlchemy, React Query patterns)
- The Admin UI already exists from mod 0001; we only need to add navigation
- Date calculations should handle fiscal year configuration from database
- All date filtering should be optional (backward compatible)
- **Data transformation rationale**: Sage exports use negative values for COGS/OpEx (presentation format); we're correcting to industry-standard positive values (data format)

---

## Tasks

- [x] 0.0 Create Git Branch and Setup
  - [x] 0.1 Create new git branch from `poc-dev`: `git checkout -b feature/mod-0002-date-range-picker`
  - [x] 0.2 Verify branch is active: `git branch --show-current`
  - [x] 0.3 Review PRD and SRS documents in `/tasks/mods/0002/` to understand requirements
  - [x] 0.4 Create database backup before running data transformation: `pg_dump -U postgres -d superscapes > backup_before_sign_fix.sql` (SKIPPED - test database on RDS)
  - [x] 0.5 Create one-time utility: write `poc/database/fix_account_signs.py` to multiply COGS and Other Operating Expense amounts by -1
  - [x] 0.6 Implement dry-run mode in utility: show count of records that would be updated without committing changes
  - [x] 0.7 Add safety checks: transaction rollback on errors, summary report (records scanned/updated/accounts affected)
  - [x] 0.8 Run utility in dry-run mode: `python poc/database/fix_account_signs.py --dry-run` and review output (982,156 transactions to update: 32,212 COGS + 949,944 Other Operating Expense)
  - [x] 0.9 Run utility for real: `python poc/database/fix_account_signs.py` to fix existing data (982,156 records updated successfully)
    - [x] 0.10 Verify transformation: run test queries to confirm COGS and Other Operating Expense amounts are now positive; test a sample profit calculation (e.g., SELECT revenue - cogs - opex WHERE all amounts should be positive) (verified by utility: all amounts now positive)

- [ ] 1.0 Backend: Database Schema and System Variables
  - [x] 1.1 Create SQLAlchemy model: write `poc/backend/models/system_variables.py` with `SystemVariable` class (columns: key VARCHAR(100) PK, value TEXT, description TEXT, updated_at TIMESTAMP, updated_by VARCHAR(100))
  - [x] 1.2 Create Alembic migration: run `cd poc/backend && alembic revision -m "create_system_variables_table"` and implement upgrade/downgrade functions in generated migration file
  - [x] 1.3 Run migration: `alembic upgrade head` to create system_variables table in database
  - [x] 1.4 Create seed script: write `poc/database/seeds/seed_system_variables.py` to insert initial values (fiscal_year_start_month=1, fiscal_year_start_day=1, data_inception_date=calculated from MIN transactions)
  - [x] 1.5 Run seed script: `python poc/database/seeds/seed_system_variables.py` to populate initial data
  - [x] 1.6 Create API routes file: write `poc/backend/api_routes/system_variables.py` with router setup
  - [x] 1.7 Implement GET /api/system-variables endpoint: return all system variables as JSON array
  - [x] 1.8 Implement GET /api/system-variables/{key} endpoint: return single variable value by key, 404 if not found
  - [x] 1.9 Register router in main.py: add `app.include_router(system_variables.router)` to `poc/backend/main.py`
  - [x] 1.10 Update batch_load.py: add transformation logic to multiply COGS and Other Operating Expense amounts by -1 during import, include explanatory comments about Sage export quirk
  - [x] 1.11 Update fast_load.py: add same transformation logic as batch_load.py for consistency
  - [x] 1.12 Update data loaders to track inception date: modify batch_load.py and fast_load.py to update data_inception_date after loading data (query MIN date, compare with current value, update if earlier)
  - [x] 1.13 Write unit tests: create `poc/backend/tests/test_system_variables.py` with tests for GET endpoints, verify data structure, test 404 handling
  - [x] 1.14 Run backend tests: `cd poc/backend && pytest tests/test_system_variables.py -v`

- [x] 2.0 Backend: Date Filtering API Enhancement
- [x] 2.1 Update dashboard KPIs endpoint: modify `get_dashboard()` in `poc/backend/api_routes/dashboard.py` to accept optional `start_date` and `end_date` query params (type: str, format: YYYY-MM-DD)
- [x] 2.2 Implement date filtering logic in dashboard: add WHERE clause to filter transactions based on `fy || '-' || LPAD(period::TEXT, 2, '0') || '-01' BETWEEN start_date AND end_date` when params provided
- [x] 2.3 Add date validation: create utility function to validate YYYY-MM-DD format and return 400 error with clear message if invalid
  - [x] 2.4 Test dashboard date filtering: verify queries return correct filtered results for different date ranges
  - [x] 2.5 Update Ask AI endpoint: modify `ask_question()` in `poc/backend/api_routes/ask.py` to accept `start_date` and `end_date` in request body
  - [x] 2.6 Augment AI prompts with date context: when start_date/end_date provided, add to system prompt: "The user has selected the date range: {start_date} to {end_date}. Unless the user's question explicitly mentions a fiscal year or period, restrict all queries to this date range."
  - [x] 2.7 Add override detection instructions to AI prompt: include logic to detect FY/Period mentions and use those instead of global range
  - [x] 2.8 Write unit tests: create `poc/backend/tests/test_dashboard_date_filtering.py` testing various date ranges, invalid dates, no dates (all data), edge cases
  - [x] 2.9 Write AI date filtering tests: create `poc/backend/tests/test_ask_date_filtering.py` testing prompt augmentation, date context inclusion
  - [x] 2.10 Run all backend tests: `cd poc/backend && pytest -v` to ensure no regressions

- [x] 3.0 Frontend: Date Range Infrastructure
  - [x] 3.1 Create TypeScript types: write `poc/frontend/src/types/dateRange.ts` defining DateRangeOption type (union of 10 range names), DateRangeState interface (selectedRange, startDate, endDate, isOverridden), and DateRangeContextValue interface
  - [x] 3.2 Create date calculation utility: write `poc/frontend/src/utils/dateRangeCalculator.ts` with `calculateDateRange()` function accepting DateRangeOption and fiscal config, returning {startDate: string, endDate: string} in YYYY-MM-DD format
  - [x] 3.3 Implement fiscal calendar logic: add functions for calculating This/Last Month, This/Last Quarter, This/Last Year, Last 6/12 Months, YTD, Inception to Date
  - [x] 3.4 Handle edge cases in calculations: cap future dates at yesterday, handle first day of quarter/year scenarios
  - [x] 3.5 Create override detection utility: write `poc/frontend/src/utils/queryOverrideDetector.ts` with `detectDateOverride()` function using regex patterns for FY\d{4}, Q[1-4], Period\s?\d{1,2}, month-year patterns
  - [x] 3.6 Create system variables API client: write `poc/frontend/src/api/systemVariables.ts` with functions `getSystemVariables()` and `getSystemVariable(key)` using existing apiClient pattern
  - [x] 3.7 Create DateRangeContext: write `poc/frontend/src/contexts/DateRangeContext.tsx` with React Context, Provider component, and custom hook `useDateRange()`
  - [x] 3.8 Implement context state management: Provider should manage selectedRange, startDate, endDate, isOverridden state; load from localStorage on mount; recalculate dates when range changes
  - [x] 3.9 Add localStorage persistence: save selectedRange to localStorage on change (key: 'selectedDateRange'); read on initialization; default to 'Year To Date' if empty
  - [x] 3.10 Fetch fiscal config on mount: Provider should fetch fiscal_year_start_month and data_inception_date from system variables API and use in calculations
  - [x] 3.11 Write utility tests: create test files for dateRangeCalculator and queryOverrideDetector utilities (if testing infrastructure exists)

- [x] 4.0 Frontend: UI Components and Integration
  - [x] 4.1 Create DateRangePicker component: write `poc/frontend/src/components/DateRangePicker.tsx` using Headless UI Listbox with all 10 date range options
  - [x] 4.2 Style DateRangePicker: implement Tailwind styling consistent with existing design system, responsive (compact on mobile)
  - [x] 4.3 Connect picker to context: use `useDateRange()` hook to get/set selectedRange
  - [x] 4.4 Create DateRangeIndicator component: write `poc/frontend/src/components/DateRangeIndicator.tsx` to display "📅 Showing: [range name] ([start] - [end])"
  - [x] 4.5 Make indicator responsive: full format on desktop, compact on mobile (use Tailwind responsive classes)
  - [x] 4.6 Create AdminNavButton component: write `poc/frontend/src/components/AdminNavButton.tsx` with gear icon (⚙️) or "Admin" text, tooltip on hover
  - [x] 4.7 Install React Router: `npm install react-router-dom` in poc/frontend
  - [x] 4.8 Setup React Router in App.tsx: wrap app with BrowserRouter, create Routes for / (main dashboard) and /admin/ai-questions
  - [x] 4.9 Create AdminPage component: write `poc/frontend/src/pages/AdminPage.tsx` to display AI questions management UI
  - [x] 4.10 Implement admin navigation: update AdminNavButton to use React Router Link component to navigate to `/admin/ai-questions`
  - [x] 4.8 Create QueryOverrideBadge component: write `poc/frontend/src/components/QueryOverrideBadge.tsx` to display override warning with amber/orange styling and warning icon
  - [x] 4.9 Make badge dismissible: add close button, manage dismissed state in component
  - [x] 4.10 Update App.tsx header: modify `poc/frontend/src/App.tsx` to add DateRangePicker and AdminNavButton to header (top-right area), ensure responsive layout
  - [x] 4.11 Wrap App with DateRangeProvider: in `poc/frontend/src/App.tsx` (or main.tsx), wrap the app component tree with `<DateRangeProvider>`
  - [x] 4.12 Update Dashboard component: modify `poc/frontend/src/components/Dashboard.tsx` to use `useDateRange()` hook and pass start_date/end_date to API calls
  - [x] 4.13 Add loading state to Dashboard: show LoadingSpinner when date range changes and data is refetching
  - [x] 4.14 Add date indicators to Dashboard KPIs: modify `poc/frontend/src/components/KPICard.tsx` to accept and display date range prop (subtitle or inline)
  - [x] 4.15 Add date indicators to Dashboard charts: update chart titles in Dashboard.tsx to include date range (e.g., "Monthly Trends (Q4 2025)")
  - [x] 4.16 Update AskAI component: modify `poc/frontend/src/components/AskAI.tsx` to use `useDateRange()` and include start_date/end_date in API request body
  - [x] 4.17 Replace example question pills: update `exampleQuestions` array in AskAI.tsx with the 4 new questions: "Show revenue by month", "Show expense by month", "Show top 5 projects by revenue", "Show top 5 projects by profitability"
  - [x] 4.18 Implement override detection in AskAI: use `detectDateOverride()` on user query before submission, set isOverridden flag in context or local state
  - [x] 4.19 Update ResponseRenderer: modify `poc/frontend/src/components/AI/ResponseRenderer.tsx` to display DateRangeIndicator and QueryOverrideBadge above response content
  - [x] 4.20 Pass override info to ResponseRenderer: include detected override information (if any) when rendering AI responses
  - [x] 4.21 Test all UI interactions: manually test date picker selection, verify dashboard updates, test AI queries with/without overrides, verify admin navigation
  - [x] 4.22 Verify responsive behavior: test on mobile viewport (< 640px), tablet (640-1023px), desktop (>= 1024px)
  - [x] 4.23 Test accessibility: keyboard navigation of date picker, screen reader labels, focus states

- [x] 5.0 Testing, Polish, and Documentation
  - [x] 5.1 Verify data transformation results: run queries to confirm all COGS and Other Operating Expense amounts are positive, test profit calculations (Revenue - COGS - OpEx) return correct results
  - [x] 5.2 Comprehensive integration testing: test all user flows from PRD appendix (switching ranges, using example pills, query overrides, admin access, persistence)
  - [x] 5.3 Test edge cases: localStorage disabled, invalid dates, no data for range, first day of period, future dates
  - [x] 5.4 Performance testing: verify dashboard loads < 2s with date filtering, test rapid date range switching (debouncing)
  - [x] 5.5 Cross-browser testing: test in Chrome, Firefox, Safari (if applicable)
  - [x] 5.6 Verify data persistence: select range, close browser, reopen, verify selection restored
  - [x] 5.7 Test all 10 date range options: verify correct date calculations for each option on various current dates
  - [x] 5.8 Test query override scenarios: queries with "FY2024", "Q1", "Period 3", "January 2024" - verify override badge appears and correct dates used
  - [x] 5.9 Visual polish: ensure consistent spacing, colors, fonts, icons across all new components
  - [x] 5.10 Error handling review: verify user-friendly error messages, graceful degradation, no console errors
  - [x] 5.11 Code review and cleanup: remove console.logs, unused imports, commented code; ensure consistent code style
  - [x] 5.12 Update README (if needed): document new date range feature, API changes, environment variables (if any)
  - [x] 5.13 Git commit and push: `git add .`, `git commit -m "feat(mod-0002): add global date range picker and admin navigation"`, `git push origin feature/mod-0002-date-range-picker`
  - [x] 5.14 Create pull request: open PR from feature branch to `poc-dev` with description referencing PRD and SRS documents
  - [x] 5.15 Demo and user acceptance: walk through feature with stakeholder, gather feedback, make adjustments if needed

---

**Status**: ✅ Complete task list with sub-tasks generated. Ready for development!
