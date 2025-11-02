# Product Requirements Document (PRD)
## Global Date Range Picker & Admin UI Navigation

**Version:** 1.2
**Date:** October 30, 2025
**Last Updated:** October 30, 2025 (Updated to align with revised SRS - enhanced data transformation context and goals)
**Project:** Superscapes Financial Intelligence Dashboard
**Module:** 0002 - Date Range Picker & Admin Navigation
**Status:** Ready for Development

---

## 1. Introduction/Overview

### The Problem

Users of the Superscapes Financial Intelligence Dashboard currently have no way to control the time period for their financial data analysis. They must either view all historical data or manually type date constraints into AI queries. Additionally, the Admin UI for managing AI questions (built in mod 0001) exists but is hidden - accessible only by typing the URL directly.

A separate data quality issue also exists: COGS and Other Operating Expense amounts are stored as negative values due to how Sage formatted its export reports. This creates complexity in queries and violates standard database practices where all amounts are stored as positive values.

### The Solution

We will add a **global date range picker** in the application header that allows users to select from 10 common time periods (This Month, Last Month, This Quarter, etc.). The selected date range will automatically filter all dashboard data, charts, and AI query results. We'll also add visible navigation to the Admin UI, and display clear date range indicators on all result areas so users always know what time period they're viewing.

Additionally, we will correct the COGS and Other Operating Expense sign convention by transforming existing data and updating data loaders to ensure all future imports follow standard database practices (all amounts stored as positive, with account type determining additive vs subtractive behavior in calculations).

### Why This Matters

Financial analysis is inherently time-bound. CFOs need quarterly reports, managers need month-over-month comparisons, and executives need YTD summaries. Without a date range selector, users must either:
- Dig through all historical data to find relevant periods
- Manually type date constraints into every AI query (error-prone and tedious)
- Remember specific fiscal year/period codes

This feature transforms the dashboard from a static data viewer into a dynamic analysis tool where users can switch between time periods with a single click.

---

## 2. Goals

### Primary Goals

1. **Enable Time-Based Analysis**: Users can view financial data for any predefined time period in ≤ 2 clicks
2. **Improve Data Clarity**: Users always know what date range their data represents via clear visual indicators
3. **Streamline Workflows**: Eliminate manual date entry in AI queries for common time periods
4. **Make Admin Accessible**: Provide obvious navigation to AI Question Library management
5. **Fix Data Foundation**: Correct COGS and Other Operating Expense sign conventions to align with industry-standard database practices

### Secondary Goals

6. **Maintain Performance**: Dashboard loads with date filtering in < 2 seconds
7. **Ensure Consistency**: Date range applies uniformly across all UI components (dashboards, charts, AI)
8. **Future-Proof Fiscal Calendar**: Store fiscal year configuration in database for easy updates

### Success Criteria

- ✅ Users can switch date ranges and see updated data within 2 seconds
- ✅ 100% of dashboard KPIs, charts, and AI queries respect the selected date range
- ✅ Date range indicators are visible on all result areas
- ✅ Admin UI is accessible from main navigation
- ✅ Query overrides (when user specifies FY/Period) work correctly and show visual warnings
- ✅ Date range selection persists across browser sessions
- ✅ All COGS and Other Operating Expense amounts are stored as positive values
- ✅ Financial calculations work correctly with standard arithmetic (Revenue - COGS - OpEx)

---

## 3. User Stories

### Primary User Stories

**US-1: Finance Manager - Quick Period Comparison**
> As a Finance Manager, I want to quickly switch between "This Month" and "Last Month" views so that I can compare current performance to the previous period without typing date filters into each query.

**US-2: CFO - Quarterly Review**
> As a CFO, I want to select "This Quarter" from a date picker so that I can review all Q4 financial data in dashboards and AI queries without manually specifying dates.

**US-3: Executive - Year-to-Date Analysis**
> As an Executive, I want to see Year-To-Date financial summaries by default so that I can quickly assess our current fiscal year performance.

**US-4: Regional Manager - Trailing 12 Months**
> As a Regional Manager, I want to view "Last 12 Months" data so that I can analyze annual trends without being constrained by calendar or fiscal year boundaries.

**US-5: Any User - Understand Data Context**
> As any user viewing dashboard data or AI responses, I want to clearly see what date range is being displayed so that I don't misinterpret the numbers.

**US-6: Power User - Query Override**
> As a power user, when I ask "What was revenue in FY2024?", I want the AI to use FY2024 dates instead of my global date range selection, with a clear indicator showing the override occurred.

**US-7: Admin - Manage AI Questions**
> As an Admin, I want to easily navigate to the AI Question Library management page so that I can add, edit, or remove canned questions without typing URLs.

### Secondary User Stories

**US-8: New User - Discover Example Questions**
> As a new user, I want to see example questions that work with my selected date range so that I can quickly get useful insights without learning query syntax.

**US-9: Data Analyst - Historical Analysis**
> As a Data Analyst, I want to select "Inception to Date" to see all historical data so that I can perform comprehensive trend analysis.

**US-10: Finance Team - Consistent Reporting**
> As a Finance Team member, I want my date range selection to persist when I close and reopen the browser so that I can continue my work without reconfiguring the view.

---

## 4. Functional Requirements

### 4.1 Date Range Picker Component

**FR-1**: The system MUST display a date range picker dropdown in the top-right area of the application header, visible on all pages.

**FR-2**: The picker MUST offer exactly 10 predefined options:
1. This Month
2. Last Month
3. This Quarter
4. Last Quarter
5. This Year
6. Last Year
7. Last 12 Months
8. Last 6 Months
9. Year To Date
10. Inception to Date

**FR-3**: The picker MUST display the currently selected option (e.g., "YTD" or "This Quarter") when closed.

**FR-4**: The default selection MUST be "Year To Date" for first-time users.

**FR-5**: The picker MUST use Headless UI Listbox component for accessibility and consistency with the existing Tailwind design system.

**FR-6**: On mobile devices (< 640px width), the picker MUST display in a compact format while maintaining full functionality.

### 4.2 Date Range Calculation

**FR-7**: The system MUST calculate date ranges based on fiscal calendar configuration stored in the `system_variables` database table.

**FR-8**: For Superscapes, the fiscal year MUST be January 1 - December 31 (configurable for future changes).

**FR-9**: Fiscal quarters MUST be calculated as:
- Q1: January 1 - March 31
- Q2: April 1 - June 30
- Q3: July 1 - September 30
- Q4: October 1 - December 31

**FR-10**: "This Month" MUST return the first day through the last day of the current calendar month.

**FR-11**: "Last Month" MUST return the first day through the last day of the previous calendar month.

**FR-12**: "This Quarter" MUST return the first day of the current fiscal quarter through the last day of the quarter.

**FR-13**: "Last Quarter" MUST return the fiscal quarter immediately preceding the current quarter.

**FR-14**: "This Year" MUST return January 1 through December 31 of the current fiscal year.

**FR-15**: "Last Year" MUST return January 1 through December 31 of the previous fiscal year.

**FR-16**: "Last 12 Months" MUST return the date 12 months ago from today through yesterday.

**FR-17**: "Last 6 Months" MUST return the date 6 months ago from today through yesterday.

**FR-18**: "Year To Date" MUST return January 1 of the current fiscal year through yesterday.

**FR-19**: "Inception to Date" MUST return the earliest transaction date in the database (from `system_variables.data_inception_date`) through yesterday.

**FR-20**: If a calculated end date is in the future, the system MUST cap it at yesterday's date (data is typically not real-time).

### 4.3 State Management & Persistence

**FR-21**: The system MUST store the selected date range in browser localStorage with key `selectedDateRange`.

**FR-22**: When the app loads, the system MUST check localStorage for a saved selection and use it if found; otherwise, use "Year To Date".

**FR-23**: The system MUST provide a React Context (`DateRangeContext`) that exposes:
- `selectedRange`: The user's selection (e.g., "This Quarter")
- `startDate`: Calculated start date in ISO 8601 format (YYYY-MM-DD)
- `endDate`: Calculated end date in ISO 8601 format (YYYY-MM-DD)
- `isOverridden`: Boolean indicating if current query overrides the global range
- `setDateRange()`: Function to update the selection

**FR-24**: The system MUST make the context accessible via a custom hook: `useDateRange()`.

**FR-25**: When the user changes the date range, the system MUST:
1. Update localStorage immediately
2. Recalculate startDate and endDate
3. Update the context state
4. Trigger re-fetch of dashboard data

### 4.4 API Integration & Data Filtering

**FR-26**: All dashboard API endpoints (`/api/dashboard/kpis`, `/api/dashboard/monthly-trend`, etc.) MUST accept optional query parameters:
- `start_date` (YYYY-MM-DD format)
- `end_date` (YYYY-MM-DD format)

**FR-27**: When `start_date` and `end_date` are provided, backend queries MUST filter the `transactions` table to include only records within that date range.

**FR-28**: The filtering logic MUST convert `transactions.fy` and `transactions.period` columns into date values for comparison.

**FR-29**: The `/api/ask` endpoint MUST augment the AI prompt with date context when a global date range is active:
```
The user has selected the date range: {selectedRange} ({start_date} to {end_date}).
Unless the user's question explicitly mentions a fiscal year or period,
restrict all queries to this date range.
```

**FR-30**: If no date range parameters are provided to APIs, the system MUST return all historical data (backward compatibility).

**FR-31**: Backend MUST validate date formats and return HTTP 400 Bad Request for invalid dates with a clear error message.

### 4.5 Query Override Detection

**FR-32**: The system MUST detect when a user's AI query contains date-specific keywords:
- Fiscal year patterns: `FY\s?\d{4}` (e.g., "FY2024", "FY 2023")
- Quarter patterns: `Q[1-4]` (e.g., "Q1", "Q2")
- Period patterns: `Period\s?\d{1,2}` (e.g., "Period 3")
- Month-year patterns: Month names followed by year (e.g., "January 2024")

**FR-33**: When an override is detected, the AI prompt MUST include instructions to use the query-specified dates instead of the global range.

**FR-34**: When an override occurs, the system MUST display a visual indicator (badge/banner) in the AI response area:
```
⚠️ This query specified [detected constraint] and ignored the global [global range] filter
```

**FR-35**: The override indicator MUST be visually distinct using an amber/orange color scheme.

**FR-36**: The override indicator MUST be dismissible by the user but reappear for subsequent override queries.

**FR-37**: The AI response text MUST acknowledge the date range used in natural language (e.g., "Based on FY2024 data...").

### 4.6 System Variables Table

**FR-38**: The system MUST create a new database table `system_variables` with the schema:
```sql
CREATE TABLE system_variables (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

**FR-39**: The table MUST be seeded with initial values:
- `fiscal_year_start_month`: `1` (January)
- `fiscal_year_start_day`: `1`
- `data_inception_date`: Earliest date from `transactions` table

**FR-40**: The system MUST provide a backend API endpoint `GET /api/system-variables/{key}` to retrieve individual variable values.

**FR-41**: The system MUST provide a backend API endpoint `GET /api/system-variables` to retrieve all variables.

**FR-42**: During data load operations, the system MUST automatically update `data_inception_date` if new data contains earlier dates.

### 4.7 Admin UI Navigation

**FR-43**: The system MUST add an Admin navigation button in the application header near the date range picker.

**FR-44**: The button MUST display either the text "Admin" or a settings gear icon (⚙️).

**FR-45**: Clicking the Admin button MUST navigate to `/admin/ai-questions`.

**FR-46**: The Admin button MUST be visible to all users (POC phase; role-based hiding will be implemented in MVP).

**FR-47**: On mobile devices, the Admin link MUST be accessible via a hamburger menu or collapsed navigation.

**FR-48**: Hovering over the Admin button MUST display a tooltip: "Manage AI Question Library".

**FR-49**: The system MUST ensure the `/admin/ai-questions` route is properly configured in React Router (if not already present).

### 4.8 Example Question Pills

**FR-50**: The system MUST replace the existing 4 example question pills below the Ask AI input with:
1. "Show revenue by month"
2. "Show expense by month"
3. "Show top 5 projects by revenue"
4. "Show top 5 projects by profitability"

**FR-51**: The pills MUST be hardcoded in the UI component (not pulled from the database).

**FR-52**: The pills MUST display exactly as specified above with no date range information appended to the text.

**FR-53**: The pills MUST NOT re-render or change text when the user changes the global date range.

**FR-54**: When a user clicks a pill, the question MUST be submitted to the AI service with the current global date range applied automatically.

**FR-55**: The pills MUST maintain the existing visual styling and click behavior.

### 4.9 Data Transformation for Account Types

**FR-56**: The system MUST provide a one-time data correction utility (`poc/database/fix_account_signs.py`) to correct existing COGS and Other Operating Expense amounts in the database.

**FR-57**: The correction utility MUST multiply all transaction amounts by -1 for account types 'COGS' and 'Other Operating Expense'.

**FR-58**: The correction utility MUST include:
- Dry-run mode to preview changes without committing
- Safety message recommending database backup
- Transaction rollback on errors
- Summary report showing records scanned, updated, and accounts affected

**FR-59**: The `batch_load.py` data loader MUST transform COGS and Other Operating Expense amounts during import by multiplying by -1.

**FR-60**: The `fast_load.py` data loader MUST implement the same transformation logic as batch_load.py.

**FR-61**: The transformation code MUST include inline comments explaining:
- This corrects Sage export formatting (negative expenses) to database standard (positive amounts)
- Revenue accounts are already positive and need no transformation
- After transformation, calculations use standard arithmetic (Revenue - COGS - OpEx)

**FR-62**: After transformation, all transaction amounts MUST be positive values, with account type determining additive (Revenue) vs subtractive (COGS, OpEx) behavior in calculations.

### 4.10 Result Area Date Range Indicators

**FR-63**: Every dashboard KPI card MUST display a date range indicator showing the active global date range.
- Format: "Year To Date (Jan 1 - Oct 29, 2025)" or as a subtitle below the KPI title

**FR-64**: Every dashboard chart MUST display the date range in the chart title or subtitle.
- Format: "Monthly Revenue Trend (Q4 2025)"

**FR-65**: Every AI response area MUST include a header/banner showing the date range context.
- Format: "📅 Results for: This Quarter (Oct 1 - Dec 31, 2025)"

**FR-66**: When a query override occurs, the indicator MUST show:
- Format: "📅 Results for: FY2024 (Jan 1 - Dec 31, 2024) ⚠️ Query specified dates - global range ignored"

**FR-67**: Date range indicators MUST be responsive:
- Desktop: Full format "Year To Date (Jan 1 - Oct 29, 2025)"
- Mobile: Compact format "YTD (1/1 - 10/29/25)"

**FR-68**: All date range indicators MUST use consistent formatting:
- Date format: "MMM D, YYYY" (e.g., "Oct 29, 2025")
- Range separator: " - " (space-dash-space)
- Label style: Range name followed by dates in parentheses

**FR-62**: Empty result states MUST still show the date range indicator.
- Example: "No transactions found for Last Month (Sep 1 - Sep 30, 2025)"

**FR-63**: If the system supports data export, exported filenames MUST include the date range.
- Example: "revenue_by_month_YTD_2025-10-30.xlsx"

### 4.10 Visual Feedback & UX

**FR-64**: When a user changes the date range, the system MUST display a loading spinner or skeleton UI while data is being fetched.

**FR-65**: The date range indicator MUST be visually subtle but discoverable - not dominating the UI but clearly visible.

**FR-66**: The system MUST provide visual confirmation when the date range changes (e.g., brief highlight animation on the indicator).

**FR-67**: If an API call fails while fetching date-filtered data, the system MUST display a user-friendly error message that includes the attempted date range.

---

## 5. Non-Goals (Out of Scope)

The following features are **explicitly excluded** from this module to manage scope:

**NG-1**: Custom date range picker where users can select arbitrary start/end dates (future enhancement)

**NG-2**: Date range comparison mode (e.g., "This Quarter vs Last Quarter" side-by-side)

**NG-3**: Saving multiple favorite date ranges per user

**NG-4**: User authentication or role-based access control for the Admin UI (assumes existing auth from mod 0001)

**NG-5**: Editing system variables through the UI (requires direct database access initially)

**NG-6**: Multi-user date range preferences (each user's selection is stored locally in their browser)

**NG-7**: Historical tracking of which date ranges a user has selected

**NG-8**: Date range presets per dashboard type (same global range for all dashboards)

**NG-9**: Automatically adjusting fiscal year configuration through the UI

**NG-10**: Real-time data updates that would require "today" as an end date instead of "yesterday"

---

## 6. Design Considerations

### 6.1 Visual Design

**Component Style**: The date range picker should match the existing Tailwind design system used throughout the application.

**Header Layout**:
```
┌────────────────────────────────────────────────────────────────┐
│ Superscapes Financial Intelligence          [YTD ▼] [⚙️ Admin] │
│ Proof of Concept                                                │
└────────────────────────────────────────────────────────────────┘
```

**Date Range Indicator** (displayed below header or in result areas):
```
📅 Showing: Jan 1, 2025 - Oct 29, 2025 (Year To Date)
```

**Example Question Pills**:
```
Example questions:
┌──────────────────────┐ ┌──────────────────────┐
│ Show revenue by month│ │ Show expense by month│
└──────────────────────┘ └──────────────────────┘
┌────────────────────────────────┐ ┌──────────────────────────┐
│ Show top 5 projects by revenue │ │ Show top 5 projects by   │
│                                │ │ profitability            │
└────────────────────────────────┘ └──────────────────────────┘
```

### 6.2 Accessibility

- The date range picker MUST be keyboard navigable (arrow keys, Enter to select)
- The picker MUST have proper ARIA labels for screen readers
- The Admin button MUST have a descriptive aria-label
- Focus states MUST be clearly visible
- Color alone MUST NOT be used to convey information (override warnings should have icons + color)

### 6.3 Responsive Behavior

**Desktop (≥ 1024px)**:
- Full date range picker with complete option names
- Date indicators show full format

**Tablet (640px - 1023px)**:
- Slightly condensed picker, full functionality maintained
- Date indicators may wrap to multiple lines

**Mobile (< 640px)**:
- Compact picker (abbreviated labels like "YTD", "Q4")
- Admin link moves to hamburger menu
- Date indicators use short format

---

## 7. Technical Considerations

### 7.1 Frontend Architecture

**State Management**:
- Use React Context API for global date range state
- Custom hook `useDateRange()` for consuming context
- localStorage for persistence across sessions

**Date Library**:
- Consider using `date-fns` for date calculations (lightweight, tree-shakable)
- Alternative: Native JavaScript Date objects (no dependency)

**Component Structure**:
```typescript
// DateRangeContext.tsx
export const DateRangeProvider: React.FC

// components/DateRangePicker.tsx
export const DateRangePicker: React.FC

// components/DateRangeIndicator.tsx
export const DateRangeIndicator: React.FC<{ compact?: boolean }>

// components/AdminNavButton.tsx
export const AdminNavButton: React.FC

// utils/dateRangeCalculator.ts
export function calculateDateRange(
  option: DateRangeOption,
  fiscalYearStart: { month: number, day: number },
  inceptionDate: Date
): { startDate: string, endDate: string }

// utils/queryOverrideDetector.ts
export function detectDateOverride(query: string): boolean
```

### 7.2 Backend Architecture

**Database Migration**:
- Create migration script for `system_variables` table
- Seed initial values
- Update data loading scripts to maintain `data_inception_date`

**API Endpoints**:
```python
# New endpoints
GET /api/system-variables
GET /api/system-variables/{key}

# Modified endpoints (accept start_date and end_date params)
GET /api/dashboard/kpis?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
GET /api/dashboard/monthly-trend?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
POST /api/ask (date context in request body)
```

**Date Filtering Logic** (example):
```python
# Convert fy + period to date for filtering
# fy=2024, period=3 → "2024-03-01"
date_value = f"{fy}-{str(period).zfill(2)}-01"

# Filter transactions
WHERE date_value BETWEEN :start_date AND :end_date
```

**Data Transformation Logic** (for COGS/OpEx):
```python
# In batch_load.py and fast_load.py
# After determining account_type from accounts table
if account_type in ['COGS', 'Other Operating Expense']:
    amount = amount * -1  # Convert from Sage export format (negative) to DB standard (positive)

# One-time fix utility: fix_account_signs.py
UPDATE transactions
SET amount = amount * -1
WHERE account_id IN (
    SELECT account_id FROM accounts
    WHERE account_type IN ('COGS', 'Other Operating Expense')
)
```

### 7.3 Dependencies

**Frontend**:
- React 19 (existing)
- TypeScript (existing)
- Tailwind CSS (existing)
- Headless UI (existing)
- date-fns (new - optional)

**Backend**:
- FastAPI (existing)
- SQLAlchemy 2.0 (existing)
- PostgreSQL 14+ (existing)
- Pydantic v2 (existing)

### 7.4 Performance Considerations

**Optimization Strategies**:
- Cache date range calculations (fiscal quarters don't change often)
- Debounce rapid date range switches (500ms delay before API calls)
- Use React Query for caching API responses by date range
- Index `transactions.fy` and `transactions.period` columns for fast filtering

**Expected Performance**:
- Date range calculation: < 10ms
- Dashboard reload with new filter: < 2 seconds (for up to 100K transactions)
- localStorage read/write: negligible

---

## 8. Success Metrics

### 8.1 Adoption Metrics

**M-1**: % of users who interact with the date range picker within their first session (Target: > 60%)

**M-2**: Average number of date range changes per user per session (Target: 2-3)

**M-3**: % of AI queries that respect the global date range without overrides (Target: > 80%)

### 8.2 Performance Metrics

**M-4**: Dashboard load time with date filtering (Target: < 2 seconds at p95)

**M-5**: Date range picker interaction to data display (Target: < 2 seconds)

**M-6**: API error rate for date-filtered requests (Target: < 1%)

### 8.3 Usability Metrics

**M-7**: % of users who can successfully change date ranges without assistance (Target: 100%)

**M-8**: % of users who successfully access Admin UI via navigation (Target: 100% of admins)

**M-9**: User satisfaction with date range feature (Target: > 4/5 in user testing)

### 8.4 Quality Metrics

**M-10**: Date range indicator visibility rate (Target: 100% of result areas show indicator)

**M-11**: Query override detection accuracy (Target: > 95%)

**M-12**: Date range persistence success rate (Target: 100% across browser sessions)

---

## 9. Open Questions

### Resolved (From SRS Discovery)

~~Q1: What fiscal year should Superscapes use?~~
**A1**: January-December (Jan 1 - Dec 31), configurable in database for future changes.

~~Q2: Should date range selection be shared across users or per-user?~~
**A2**: Per-user via localStorage (each user maintains their own selection).

~~Q3: What should happen if no data exists for a selected date range?~~
**A3**: Display empty state with date range indicator: "No data found for Last Month (Sep 1 - Sep 30, 2025)"

### Still Open

**Q4**: Should we add analytics tracking for date range usage patterns to inform future enhancements?

**Q5**: Should the system support keyboard shortcuts for common date ranges? (e.g., Ctrl+T for "This Month")

**Q6**: Should there be a "Reset to Default" option to quickly return to Year To Date?

**Q7**: For export functionality, should date range be in the filename, file metadata, or both?

---

## 10. Appendix

### 10.1 Related Documents

- **SRS Document**: `/tasks/mods/0002/0002-srs-date-range-picker-admin-nav.md`
- **Mod 0000 (POC)**: `/tasks/mods/0000/`
- **Mod 0001 (AI Question Library)**: `/tasks/mods/0001/`
- **Database Schema**: `/poc/database/schema.sql`
- **Frontend Codebase**: `/poc/frontend/src/`
- **Backend Codebase**: `/poc/backend/`

### 10.2 User Flow Examples

**Flow 1: New User First Visit**
1. User opens dashboard
2. Default "Year To Date" is selected
3. Date indicator shows: "📅 Showing: Jan 1 - Oct 29, 2025 (Year To Date)"
4. Dashboard shows YTD KPIs and charts
5. User sees example question pills below Ask AI input

**Flow 2: Switching to Quarterly View**
1. User clicks date picker (currently "YTD")
2. Dropdown opens with 10 options
3. User selects "This Quarter"
4. Loading spinner appears
5. Dashboard refreshes with Q4 2025 data
6. Date indicator updates: "📅 Showing: Oct 1 - Dec 31, 2025 (This Quarter)"
7. Selection saved to localStorage

**Flow 3: Using Example Question with Date Range**
1. User has "Last 12 Months" selected
2. User clicks "Show revenue by month" pill
3. Question submitted to AI
4. AI response includes: "📅 Results for: Last 12 Months (Oct 30, 2024 - Oct 29, 2025)"
5. Monthly revenue chart displays 12 data points

**Flow 4: Query Override Scenario**
1. User has "This Quarter" selected (Q4 2025)
2. User types: "What was total revenue in FY2024?"
3. System detects "FY2024" keyword
4. AI query uses Jan 1 - Dec 31, 2024 instead of Q4 2025
5. Response header shows: "📅 Results for: FY2024 (Jan 1 - Dec 31, 2024) ⚠️ Query specified FY2024 - global Q4 range ignored"
6. AI response acknowledges: "Based on your request for FY2024 data..."

**Flow 5: Accessing Admin UI**
1. User clicks ⚙️ Admin button in header
2. Tooltip shows "Manage AI Question Library"
3. Browser navigates to `/admin/ai-questions`
4. AI Question Library management page loads
5. User can manage categories and questions

**Flow 6: Returning User**
1. User closes browser with "Last Month" selected
2. User reopens browser next day
3. System reads localStorage
4. "Last Month" is pre-selected
5. Dashboard loads with last month's data
6. User continues analysis where they left off

### 10.3 Edge Cases & Error Handling

**EC-1: localStorage Unavailable**
- Fallback to "Year To Date"
- Show info message: "Date range selection won't persist (browser storage disabled)"

**EC-2: Invalid Date Range from API**
- Display user-friendly error: "Unable to load data for the selected period. Please try a different date range."
- Log error details for debugging

**EC-3: Future End Date**
- Cap end date at yesterday
- Example: If today is Oct 30 and "This Month" would end Oct 31, use Oct 29 instead

**EC-4: No Data in Selected Range**
- Show empty state with date range
- Suggest trying a different period
- Don't hide the date range indicator

**EC-5: System Variables Missing**
- Use hardcoded defaults (Jan 1 fiscal start, query DB for earliest transaction)
- Log warning for admin attention

**EC-6: First Day of New Quarter**
- "This Quarter" shows Q4 (even though only Oct 1 exists)
- "Last Quarter" shows completed Q3

**EC-7: Malformed Query in Override Detection**
- If regex fails, treat as no override
- Apply global date range as normal
- Log the issue for analysis

**EC-8: Admin Route Not Found**
- Show 404 error with helpful message
- Link back to main dashboard
- Log issue for tech team

### 10.4 Testing Scenarios

**Test Scenario 1: Date Range Selection**
- Select each of the 10 date range options
- Verify correct start and end dates are calculated
- Verify dashboard data updates correctly
- Verify selection persists in localStorage

**Test Scenario 2: Fiscal Period Calculations**
- Test all fiscal quarters (Q1-Q4)
- Test "This Year" and "Last Year"
- Test on edge dates (first/last day of quarter/year)
- Verify dates align with Jan-Dec fiscal calendar

**Test Scenario 3: Date Range Indicators**
- Check all dashboard KPIs show date range
- Check all charts show date range
- Check AI responses show date range
- Verify responsive formatting (desktop vs mobile)

**Test Scenario 4: Query Override Detection**
- Test queries with "FY2024", "FY 2023", "FY2025"
- Test queries with "Q1", "Q2", "Q3", "Q4"
- Test queries with "Period 3", "Period 12"
- Test queries with "January 2024", "March 2023"
- Verify override indicator appears
- Verify AI uses query-specified dates

**Test Scenario 5: Example Question Pills**
- Click each of the 4 pills
- Verify questions are submitted correctly
- Verify global date range is applied
- Verify date range indicator shows in response

**Test Scenario 6: Admin Navigation**
- Click Admin button in header
- Verify navigation to `/admin/ai-questions`
- Verify tooltip appears on hover
- Test on mobile (hamburger menu)

**Test Scenario 7: Persistence**
- Select "This Quarter", close browser
- Reopen browser
- Verify "This Quarter" is still selected
- Repeat for all 10 options

**Test Scenario 8: Performance**
- Select date range with large dataset
- Verify load time < 2 seconds
- Rapidly switch between ranges
- Verify debouncing prevents excessive API calls

**Test Scenario 9: Error Handling**
- Disable localStorage
- Provide invalid date range to API
- Disconnect from database
- Verify graceful degradation in all cases

**Test Scenario 10: Accessibility**
- Navigate date picker with keyboard only
- Test with screen reader
- Verify all interactive elements have aria-labels
- Test focus states

### 10.5 Development Phases

**Phase 1: Foundation (Backend & Database)**
- Create `system_variables` table and migration
- Seed initial values
- Create system variables API endpoints
- Update data loading scripts to maintain `data_inception_date`
- Estimated: 1 day

**Phase 2: Date Range Picker UI**
- Create `DateRangeContext` and provider
- Build `DateRangePicker` component
- Implement date calculation utility
- Add localStorage persistence
- Estimated: 2 days

**Phase 3: Dashboard Integration**
- Update all dashboard API calls to include date params
- Add date range indicators to KPIs and charts
- Implement loading states
- Estimated: 2 days

**Phase 4: AI Query Integration**
- Update Ask AI to use date range context
- Implement query override detection
- Add override indicator UI
- Update example question pills
- Estimated: 2 days

**Phase 5: Admin Navigation**
- Add Admin button to header
- Configure routing
- Test navigation flow
- Estimated: 0.5 days

**Phase 6: Testing & Polish**
- Comprehensive testing of all scenarios
- Responsive design refinement
- Accessibility audit
- Performance optimization
- Estimated: 1.5 days

**Total Estimated Development Time**: 9 days (1.8 weeks)

---

## 11. Glossary

**Date Range**: A specified time period defined by a start date and end date

**Fiscal Year (FY)**: A 12-month accounting period (for Superscapes: Jan 1 - Dec 31)

**Fiscal Quarter**: A 3-month period within a fiscal year (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec)

**Global Date Range**: The user-selected date range that applies to all dashboards and queries by default

**Inception Date**: The earliest date of financial data in the system (first transaction)

**localStorage**: Browser-based client-side storage for persisting data across sessions

**Override**: When a user's specific query contains date constraints that supersede the global date range

**System Variables**: Configurable application settings stored in the database

**YTD (Year To Date)**: From the start of the fiscal year through yesterday

**Period**: A monthly accounting period (1-12) within a fiscal year

---

**End of PRD**

**Prepared by**: AI Agent
**Based on**: SRS v1.1 and discovery interview from Step 1
**Ready for**: Step 3 (Task Generation)
