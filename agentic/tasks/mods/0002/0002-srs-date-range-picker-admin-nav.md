# Software Requirements Specification (SRS)
## Mod 0002: Global Date Range Picker & Admin UI Navigation

**Version:** 1.3
**Date:** October 30, 2025
**Last Updated:** October 30, 2025 (Replaced expense sign handling with data transformation at load time)
**Project:** Superscapes Financial Intelligence Dashboard
**Module:** 0002 - Date Range Picker & Admin Navigation

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the requirements for adding a global date range picker and admin UI navigation to the Superscapes Financial Intelligence Dashboard. The document serves as the foundation for creating the Product Requirements Document (PRD) and subsequent implementation tasks.

### 1.2 Scope

This module will enhance the existing POC/MVP by adding:

**In Scope:**
- Global date range picker with 10 predefined time period options
- Persistent date range selection across sessions using localStorage
- Date range filtering applied to all dashboards and AI queries
- Query-level override capability when users specify fiscal year/period constraints
- Navigation mechanism to access the Admin UI (AI Question Library)
- System variables table for storing dynamic configuration values
- Automatic tracking of data inception date
- Updated example question pills below Ask AI input (4 new hardcoded questions)
- Date range indicators on all result areas (dashboards, AI responses, charts)
- Data transformation utilities to correct COGS and Other Operating Expense sign conventions

**Out of Scope:**
- Custom date range picker (user-defined start/end dates)
- User authentication/authorization systems (assumes existing auth from 0001)
- New admin features beyond navigation to existing Admin UI
- Multi-user date range preferences (each user maintains their own via localStorage)
- Historical date range selections/favorites

### 1.3 Definitions, Acronyms, and Abbreviations

- **FY**: Fiscal Year (January-December for Superscapes, configurable for future)
- **POC**: Proof of Concept
- **MVP**: Minimum Viable Product
- **UI**: User Interface
- **API**: Application Programming Interface
- **localStorage**: Browser-based client-side storage mechanism
- **Inception Date**: The earliest transaction date in the database
- **Global Date Range**: A user-selected time period that applies to all queries and visualizations
- **Query Override**: When a user's specific query mentions FY/Period constraints that supersede the global date range

### 1.4 References

- Mod 0000: POC Documentation (`/tasks/mods/0000/`)
- Mod 0001: AI Question Library Implementation (`/tasks/mods/0001/`)
- Existing Codebase: `/poc/frontend/` and `/poc/backend/`
- Database Schema: `/poc/database/schema.sql`

---

## 2. Overall Description

### 2.1 Product Perspective

This module is an enhancement to the existing Superscapes Financial Intelligence Dashboard (POC/MVP phase). It addresses two critical usability gaps:

1. **No Date Range Control**: Users currently cannot filter financial data by time period without manually typing date constraints into AI queries or viewing all historical data in dashboards.

2. **Hidden Admin Features**: The AI Question Library admin interface exists (implemented in mod 0001) but lacks a navigation path, making it accessible only via direct URL entry.

The date range picker will be a **global application state** that influences:
- Dashboard KPI calculations
- Chart/visualization data queries
- AI-generated SQL queries
- Canned question results

### 2.2 Product Functions

**F1: Global Date Range Selection**
- Provide a dropdown picker with 10 predefined date range options
- Display currently selected range prominently in the UI
- Persist selection across browser sessions
- Apply selected range to all data queries by default

**F2: Smart Date Range Application**
- Automatically inject date filters into dashboard API calls
- Augment AI prompts with date context
- Detect and respect query-specific date overrides (FY/Period mentions)
- Show visual indicators when overrides are active

**F3: Fiscal Period Calculation**
- Calculate date ranges for "This Quarter", "Last Quarter", "This Year", "Last Year" based on fiscal calendar (Jan-Dec)
- Store fiscal year configuration in database for future flexibility
- Handle edge cases (first day of quarter, mid-year selection changes)

**F4: System Configuration Management**
- Create `system_variables` table for key-value configuration storage
- Automatically track and update data inception date during data loads
- Provide API endpoints for reading system variables

**F5: Admin UI Navigation**
- Add navigation control in application header
- Route to existing `/admin/ai-questions` page
- Show/hide based on user presence (no role-based hiding in POC)

**F6: Example Question Pills**
- Replace existing example questions with 4 new hardcoded questions
- Questions automatically respect the global date range
- No visual date range indicator on the pills themselves
- Questions do not re-render when date range changes

**F7: Result Area Date Range Indicators**
- Display active date range on all dashboard KPI cards and charts
- Show date range context in AI response headers
- Indicate when query override has occurred (user-specified dates vs global range)
- Provide clear visual feedback about what data is being displayed

### 2.3 User Characteristics

**Primary Users:**
- **CFO & Finance Team**: Need to analyze data for specific fiscal periods (quarterly reviews, year-end analysis)
- **Regional Managers**: Want to compare "This Month vs Last Month" performance quickly
- **Executives**: Require YTD and trailing 12-month views for board presentations

**Secondary Users:**
- **System Administrators**: Need access to AI Question Library to manage canned questions

**User Skill Levels:**
- Financial expertise: High
- Technical expertise: Low to Medium
- Expectation: Consumer-app simplicity (like Google Analytics date pickers)

### 2.4 Constraints

**Technical Constraints:**
- Must work with existing React 19 + TypeScript frontend
- Must integrate with FastAPI + SQLAlchemy backend
- PostgreSQL database for configuration storage
- No breaking changes to existing APIs or components
- Must maintain current performance (<2s dashboard load)

**Business Constraints:**
- Fiscal year currently Jan-Dec (may change in future to Apr-Mar or Jul-Jun)
- Must support historical data from inception (earliest transaction in database)
- POC environment has ~3 months of data; MVP will have 3+ years

**UI/UX Constraints:**
- Mobile-responsive design (works on phone, tablet, desktop)
- Accessible (WCAG 2.1 AA compliance preferred)
- Consistent with existing Tailwind CSS design system

### 2.5 Assumptions and Dependencies

**Assumptions:**
- Users understand fiscal calendar concepts (quarters, YTD, etc.)
- Browser localStorage is available and enabled
- Existing `transactions` table has consistent `fy` and `period` columns
- AI Question Library admin pages are fully functional (from mod 0001)
- Users will not need to select custom date ranges in this version

**Dependencies:**
- React Context API or similar state management for global state
- Backend API endpoints can accept `start_date` and `end_date` parameters
- OpenAI API integration can incorporate date context into prompts
- Database has sufficient indices on `fy` and `period` columns for performance

---

## 3. System Features

### 3.1 Feature: Date Range Picker Component

**Description:**
A dropdown selector in the application header allowing users to choose from 10 predefined date ranges. The selected range is visually displayed and persists across sessions.

**Functional Requirements:**

**FR-1.1**: The date picker SHALL display the following 10 options:
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

**FR-1.2**: The date picker SHALL be positioned in the top-right area of the application header, visible on all pages.

**FR-1.3**: The default selection SHALL be "Year To Date" unless a previous selection exists in localStorage.

**FR-1.4**: The selected date range SHALL be stored in browser localStorage with key `selectedDateRange`.

**FR-1.5**: The picker SHALL display as a modern dropdown/select component (recommendation: Headless UI Listbox for consistency with design system).

**FR-1.6**: A visual indicator SHALL display the currently active date range (e.g., "Showing: Q3 2025 (Jul 1 - Sep 30)").

**FR-1.7**: The component SHALL be responsive, collapsing to a compact icon/button on mobile devices (<640px width).

**FR-1.8**: Date ranges based on fiscal periods ("This Quarter", "Last Quarter", "This Year", "Last Year") SHALL use fiscal quarters/years (Jan-Dec).

---

### 3.2 Feature: Date Range Calculation Engine

**Description:**
A TypeScript utility module that converts user-friendly date range selections into `start_date` and `end_date` values, respecting fiscal calendar rules.

**Functional Requirements:**

**FR-2.1**: The calculation engine SHALL support fiscal year definition stored in `system_variables` table (default: Jan-Dec).

**FR-2.2**: "This Month" SHALL return the first and last day of the current calendar month.

**FR-2.3**: "Last Month" SHALL return the first and last day of the previous calendar month.

**FR-2.4**: "This Quarter" SHALL return the first day and last day of the current fiscal quarter.
- Q1: Jan 1 - Mar 31
- Q2: Apr 1 - Jun 30
- Q3: Jul 1 - Sep 30
- Q4: Oct 1 - Dec 31

**FR-2.5**: "Last Quarter" SHALL return the fiscal quarter immediately preceding the current quarter.

**FR-2.6**: "This Year" SHALL return Jan 1 - Dec 31 of the current fiscal year.

**FR-2.7**: "Last Year" SHALL return Jan 1 - Dec 31 of the previous fiscal year.

**FR-2.8**: "Last 12 Months" SHALL return the date 12 months ago from today through yesterday.

**FR-2.9**: "Last 6 Months" SHALL return the date 6 months ago from today through yesterday.

**FR-2.10**: "Year To Date" SHALL return Jan 1 of current fiscal year through yesterday.

**FR-2.11**: "Inception to Date" SHALL return the `data_inception_date` from `system_variables` table through yesterday.

**FR-2.12**: All date calculations SHALL use server time zone (UTC or configured time zone) to ensure consistency between frontend and backend.

**FR-2.13**: Edge case handling: If a date range produces a future end date, it SHALL be capped at yesterday's date.

---

### 3.3 Feature: Global Date Range State Management

**Description:**
Application-level state management that makes the selected date range accessible to all components and API calls.

**Functional Requirements:**

**FR-3.1**: A React Context (`DateRangeContext`) SHALL provide the following state:
- `selectedRange`: The user-selected option (e.g., "This Quarter")
- `startDate`: Calculated start date (ISO 8601 format)
- `endDate`: Calculated end date (ISO 8601 format)
- `isOverridden`: Boolean indicating if current query overrides global range
- `setDateRange()`: Function to update the selection

**FR-3.2**: The context SHALL initialize from localStorage on app mount.

**FR-3.3**: The context SHALL recalculate `startDate` and `endDate` whenever `selectedRange` changes.

**FR-3.4**: All API calls in `Dashboard.tsx` and `AskAI.tsx` SHALL automatically include `start_date` and `end_date` query parameters derived from context.

**FR-3.5**: The context SHALL be accessible via a custom hook: `useDateRange()`.

---

### 3.4 Feature: API Date Filtering

**Description:**
Backend API endpoints will accept and apply date range filters to all data queries.

**Functional Requirements:**

**FR-4.1**: All dashboard API endpoints (`/api/dashboard/*`) SHALL accept optional query parameters:
- `start_date` (YYYY-MM-DD format)
- `end_date` (YYYY-MM-DD format)

**FR-4.2**: When `start_date` and `end_date` are provided, SQL queries SHALL filter `transactions` table using:
```sql
WHERE t.fy || '-' || LPAD(t.period::TEXT, 2, '0') || '-01'
  BETWEEN :start_date AND :end_date
```

**FR-4.3**: The `/api/ask` endpoint SHALL augment the AI prompt with date context:
```
The user has selected the date range: {start_date} to {end_date}.
Unless the user's question explicitly mentions a fiscal year or period,
restrict all queries to this date range.
```

**FR-4.4**: If no date range parameters are provided, APIs SHALL return all historical data (backward compatibility).

**FR-4.5**: Backend SHALL validate date format and return `400 Bad Request` for invalid dates.

---

### 3.5 Feature: Query Override Detection

**Description:**
Intelligent detection of when a user's AI query specifies its own date constraints, allowing those to supersede the global date range.

**Functional Requirements:**

**FR-5.1**: The AI prompt augmentation SHALL include override instructions:
```
IMPORTANT: If the user's question contains specific fiscal year mentions
(e.g., "FY2024", "FY 2023", "fiscal year 2025") or period mentions
(e.g., "Q1", "Period 3", "January 2024"), you MUST use those constraints
instead of the global date range.
```

**FR-5.2**: The frontend SHALL detect override keywords in user queries using regex patterns:
- `FY\s?\d{4}` (FY2024, FY 2023)
- `Q[1-4]` (Q1, Q2, etc.)
- `Period\s?\d{1,2}` (Period 3, Period 12)
- Month names + year (January 2024)

**FR-5.3**: When an override is detected, a visual badge SHALL appear above the AI response:
```
ℹ️ This query used specific date constraints and ignored the global date range (YTD)
```

**FR-5.4**: The override indicator SHALL be dismissible but reappear for new queries with overrides.

**FR-5.5**: The AI response SHALL include a note acknowledging the date range used:
```
"Based on your request for FY2024 data, I queried transactions from
January 1, 2024 to December 31, 2024 (ignoring the global YTD filter)."
```

---

### 3.6 Feature: System Variables Table

**Description:**
A database table for storing application-wide configuration values that may change without code deployment.

**Functional Requirements:**

**FR-6.1**: A new table `system_variables` SHALL be created with schema:
```sql
CREATE TABLE system_variables (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);
```

**FR-6.2**: The table SHALL be seeded with initial values:
- `fiscal_year_start_month`: `1` (January)
- `fiscal_year_start_day`: `1`
- `data_inception_date`: Calculated from `MIN(fy || '-' || LPAD(period::TEXT, 2, '0') || '-01')` in `transactions` table

**FR-6.3**: A backend API endpoint `GET /api/system-variables/{key}` SHALL return a single variable value.

**FR-6.4**: An endpoint `GET /api/system-variables` SHALL return all variables (for admin use).

**FR-6.5**: During data load operations (batch_load.py, fast_load.py), the system SHALL:
- Query the current `data_inception_date`
- Compare with earliest date in new data
- Update `data_inception_date` if new data has an earlier date

**FR-6.6**: Write operations to `system_variables` SHALL be restricted to admin endpoints only (future enhancement).

---

### 3.7 Feature: Admin UI Navigation

**Description:**
A navigation link or menu item that allows users to access the AI Question Library admin interface.

**Functional Requirements:**

**FR-7.1**: A navigation control SHALL be added to the application header near the date picker.

**FR-7.2**: The control SHALL be labeled "Admin" or use a settings gear icon (⚙️).

**FR-7.3**: Clicking the control SHALL navigate to `/admin/ai-questions` route.

**FR-7.4**: The control SHALL be visible to all users (no role-based hiding in POC; authentication will be handled in MVP).

**FR-7.5**: On mobile devices, the Admin link SHALL be accessible via a hamburger menu or collapsed navigation.

**FR-7.6**: The Admin page SHALL be added to React Router configuration if not already present.

**FR-7.7**: Hovering over the Admin control SHALL display a tooltip: "Manage AI Question Library".

---

### 3.8 Feature: Updated Example Question Pills

**Description:**
The 4 example question pills displayed below the Ask AI input box will be replaced with new hardcoded questions that automatically respect the global date range selection.

**Functional Requirements:**

**FR-8.1**: The example question pills SHALL be replaced with the following 4 questions:
1. "Show revenue by month"
2. "Show expense by month"
3. "Show top 5 projects by revenue"
4. "Show top 5 projects by profitability"

**FR-8.2**: The pills SHALL be hardcoded in the UI component (not pulled from database).

**FR-8.3**: The pills SHALL display exactly as specified above with no date range information appended to the text.

**FR-8.4**: The pills SHALL NOT re-render or change text when the user changes the global date range selection.

**FR-8.5**: When a user clicks a pill, the question SHALL be submitted to the AI service with the current global date range applied automatically (via backend date filtering).

**FR-8.6**: The pills SHALL maintain existing styling and click behavior from the current implementation.

**FR-8.7**: Override detection rules SHALL apply: If these questions are processed in a way that explicitly mentions a fiscal year or period in the AI's SQL generation, that SHALL be treated as an override (though unlikely given the generic wording).

---

### 3.9 Feature: Result Area Date Range Indicators

**Description:**
All result areas (dashboard KPIs, charts, AI responses) will display clear indicators showing what date range was used to generate the displayed data.

**Functional Requirements:**

**FR-9.1**: Dashboard KPI cards SHALL include a date range indicator showing the active global date range.
- Example: "Revenue (YTD: Jan 1 - Oct 29, 2025): $1,234,567"
- Or as a subtitle: "Year To Date (Jan 1 - Oct 29)"

**FR-9.2**: Dashboard charts SHALL display the date range in the chart title or subtitle.
- Example: "Monthly Revenue Trend (Q4 2025)"

**FR-9.3**: AI response areas SHALL include a header/banner showing the date range context:
- Example: "📅 Results for: This Quarter (Oct 1 - Dec 31, 2025)"

**FR-9.4**: When a query override occurs (user mentions FY/Period), the indicator SHALL show:
- Example: "📅 Results for: FY2024 (Jan 1 - Dec 31, 2024) ⚠️ Query specified dates - global range ignored"

**FR-9.5**: The override warning SHALL be visually distinct (different color, icon, or badge).
- Recommendation: Orange/amber badge with warning icon (⚠️)

**FR-9.6**: Date range indicators SHALL be responsive and adjust formatting for mobile displays:
- Desktop: Full format "Year To Date (Jan 1 - Oct 29, 2025)"
- Mobile: Compact format "YTD (1/1 - 10/29/25)"

**FR-9.7**: The indicators SHALL use consistent formatting across all result areas:
- Date format: "MMM D, YYYY" (e.g., "Oct 29, 2025")
- Range separator: " - " (space-dash-space)
- Label style: Range name followed by dates in parentheses

**FR-9.8**: Empty result states SHALL still show the date range indicator:
- Example: "No transactions found for Last Month (Sep 1 - Sep 30, 2025)"

**FR-9.9**: Export functionality (if applicable) SHALL include the date range in exported filenames:
- Example: "revenue_by_month_YTD_2025-10-30.xlsx"

**FR-9.10**: The date range indicator SHALL be visually subtle but discoverable - not dominating the UI but clearly visible when users look for it.

---

### 3.10 Feature: Data Transformation for Account Type Sign Conventions

**Description:**
Correct the sign convention for COGS and Other Operating Expense account types in the database. The source data (Sage export) stored these amounts as negative values due to report presentation formatting, but standard database practice is to store all amounts as positive and handle the arithmetic in calculations.

**Functional Requirements:**

**FR-10.1**: A one-time data correction utility SHALL be created to fix existing data in the database:
- Script name: `poc/database/fix_account_signs.py`
- Target account types: 'COGS' and 'Other Operating Expense'
- Operation: Multiply all transaction amounts by -1 for these account types
- Verification: Log count of affected records before and after transformation

**FR-10.2**: The correction utility SHALL include safety checks:
- Dry-run mode to preview changes without committing
- Backup recommendation message before execution
- Transaction rollback capability if errors occur
- Summary report showing: total records scanned, records updated, accounts affected

**FR-10.3**: The `batch_load.py` data loader SHALL be modified to transform COGS and Other Operating Expense amounts during import:
```python
# After determining account_type from account lookup
if account_type in ['COGS', 'Other Operating Expense']:
    amount = amount * -1  # Convert from negative (Sage report format) to positive (db standard)
```

**FR-10.4**: The `fast_load.py` data loader SHALL implement the same transformation logic as batch_load.py for consistency.

**FR-10.5**: The transformation logic SHALL include inline comments explaining:
- Why the transformation is necessary (Sage export quirk)
- That Revenue accounts are already positive and require no transformation
- That standard accounting databases store all amounts as positive
- Example: Revenue $100 - COGS $90 = Gross Profit $10

**FR-10.6**: After transformation, all financial calculations SHALL use standard arithmetic:
- Gross Profit = Revenue - COGS (both positive, subtraction gives correct result)
- Net Income = Revenue - COGS - Other Operating Expense (all positive)
- No need for ABS(), sign flipping, or special SQL handling

**FR-10.7**: The system documentation SHALL include a data conventions section noting:
- All transaction amounts are stored as positive values
- Account type determines whether amounts are additive (Revenue) or subtractive (COGS, OpEx)
- This aligns with standard BI tool expectations and simplifies all queries

**FR-10.8**: The one-time correction utility SHALL be executed before implementing the date range picker feature to ensure clean data foundation.

---

## 4. External Interface Requirements

### 4.1 User Interfaces

**Header Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│ Superscapes Financial Intelligence          [YTD ▼] [⚙️ Admin] │
│ Proof of Concept                                                │
└────────────────────────────────────────────────────────────────┘
```

**Date Picker Dropdown (Desktop):**
```
┌─────────────────────────┐
│ ◉ This Month            │
│ ○ Last Month            │
│ ○ This Quarter          │
│ ○ Last Quarter          │
│ ○ This Year             │
│ ○ Last Year             │
│ ○ Last 12 Months        │
│ ○ Last 6 Months         │
│ ◉ Year To Date          │ ← Selected
│ ○ Inception to Date     │
└─────────────────────────┘
```

**Date Range Indicator (Below Header):**
```
┌────────────────────────────────────────────────────────────────┐
│ 📅 Showing: Jan 1, 2025 - Oct 29, 2025 (Year To Date)          │
└────────────────────────────────────────────────────────────────┘
```

**Override Badge (In AI Response Area):**
```
┌────────────────────────────────────────────────────────────────┐
│ ℹ️ This query specified "FY2024" and ignored the global YTD    │
│    date range filter.                                     [✕]   │
└────────────────────────────────────────────────────────────────┘
```

**Mobile Header (< 640px):**
```
┌─────────────────────────────────┐
│ ☰  Superscapes FI      [Q4 ▼]  │
└─────────────────────────────────┘
```

**Example Question Pills (Below Ask AI Input):**
```
┌────────────────────────────────────────────────────────────────┐
│ Ask AI:                                                         │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ What would you like to know about your financial data?     │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Example questions:                                              │
│ ┌──────────────────────┐ ┌──────────────────────┐             │
│ │ Show revenue by month│ │ Show expense by month│             │
│ └──────────────────────┘ └──────────────────────┘             │
│ ┌────────────────────────────────┐ ┌──────────────────────────┐│
│ │ Show top 5 projects by revenue │ │ Show top 5 projects by   ││
│ │                                │ │ profitability            ││
│ └────────────────────────────────┘ └──────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

**Dashboard KPI with Date Range Indicator:**
```
┌────────────────────────────────────────────────────────────────┐
│ Total Revenue                                                   │
│ Year To Date (Jan 1 - Oct 29, 2025)                           │
│                                                                 │
│ $1,234,567.89                                                  │
│ ↑ 12.5% vs prior period                                        │
└────────────────────────────────────────────────────────────────┘
```

**AI Response with Date Range Context:**
```
┌────────────────────────────────────────────────────────────────┐
│ 📅 Results for: Year To Date (Jan 1 - Oct 29, 2025)           │
├────────────────────────────────────────────────────────────────┤
│ Here's the revenue by month for the selected period:           │
│                                                                 │
│ [Chart/Table showing monthly revenue]                          │
└────────────────────────────────────────────────────────────────┘
```

**AI Response with Override Warning:**
```
┌────────────────────────────────────────────────────────────────┐
│ 📅 Results for: FY2024 (Jan 1 - Dec 31, 2024)                 │
│ ⚠️ Query specified FY2024 - global YTD range was ignored      │
├────────────────────────────────────────────────────────────────┤
│ Here's the revenue data for fiscal year 2024:                  │
│                                                                 │
│ [Chart/Table showing FY2024 data]                              │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Hardware Interfaces

Not applicable. This is a web-based application.

### 4.3 Software Interfaces

**Frontend APIs:**
- `GET /api/system-variables/data_inception_date` - Retrieve inception date
- `GET /api/system-variables/fiscal_year_start_month` - Retrieve fiscal year config
- `GET /api/dashboard/kpis?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Filtered KPIs
- `GET /api/dashboard/monthly-trend?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Filtered chart data
- `POST /api/ask` - Submit AI query with date context in payload

**Database Interface:**
- PostgreSQL 14+ with SQLAlchemy ORM
- New table: `system_variables`
- Existing tables: `transactions`, `accounts`, `jobs`, `managers`, `regions`

**Third-Party Services:**
- OpenAI GPT-4 API - AI queries with date context augmentation

### 4.4 Communications Interfaces

**HTTP/REST API:**
- Protocol: HTTPS
- Data Format: JSON
- Error Codes: Standard HTTP status codes (200, 400, 404, 500)

**Browser Storage:**
- localStorage API for persisting date range selection
- Key: `selectedDateRange`
- Value: String (one of the 10 predefined options)

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**NFR-1.1**: Date range calculation SHALL complete in < 10ms on the frontend.

**NFR-1.2**: Dashboard API responses with date filtering SHALL return in < 2 seconds for datasets up to 100,000 transactions.

**NFR-1.3**: Switching date ranges SHALL reload dashboard data within 2 seconds (perceived as "instant" by users).

**NFR-1.4**: System variables API SHALL respond in < 100ms (cache-friendly endpoint).

**NFR-1.5**: The date picker component SHALL render without noticeable lag on page load.

### 5.2 Security Requirements

**NFR-2.1**: Date range parameters SHALL be validated on the backend to prevent SQL injection.

**NFR-2.2**: System variables write operations SHALL be restricted to authenticated admin users (future: implement in MVP).

**NFR-2.3**: localStorage SHALL NOT store sensitive data (only the selected range name).

**NFR-2.4**: API endpoints SHALL use parameterized queries to prevent date-based injection attacks.

### 5.3 Usability Requirements

**NFR-3.1**: Users SHALL be able to change the date range in ≤ 2 clicks.

**NFR-3.2**: The currently selected date range SHALL be visible without needing to open the picker.

**NFR-3.3**: Date range labels SHALL use business-friendly language ("This Quarter" not "Q{current_quarter}").

**NFR-3.4**: The UI SHALL provide visual feedback when data is loading after a date range change (loading spinner or skeleton UI).

**NFR-3.5**: Error messages for invalid date ranges SHALL be user-friendly (e.g., "No data available for this period" not "SQL query returned 0 rows").

**NFR-3.6**: The Admin navigation SHALL be discoverable without requiring documentation or training.

### 5.4 Reliability Requirements

**NFR-4.1**: If localStorage is unavailable, the system SHALL fall back to the default "Year To Date" selection.

**NFR-4.2**: If the `system_variables` table is missing or corrupted, the system SHALL use hardcoded defaults (Jan 1 fiscal start, earliest transaction from query).

**NFR-4.3**: Date calculation errors SHALL NOT crash the application; instead, log errors and fall back to "All Time" (no filtering).

**NFR-4.4**: Backend SHALL handle edge cases gracefully:
- Start date after end date → Return 400 error with clear message
- Date range with no data → Return empty result set with 200 status
- Future dates → Cap at current date

### 5.5 Maintainability Requirements

**NFR-5.1**: Fiscal year configuration SHALL be stored in the database (not hardcoded) to allow future changes without code deployment.

**NFR-5.2**: Date range options SHALL be defined in a single configuration file/constant for easy modification.

**NFR-5.3**: The date calculation logic SHALL be unit-tested with ≥90% code coverage.

**NFR-5.4**: API documentation SHALL include examples of date filtering for all endpoints.

---

## 6. System Architecture

### 6.1 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS 4.x for styling
- Headless UI for accessible dropdown component
- React Context API for global state management
- date-fns library for date calculations (recommended)

**Backend:**
- Python 3.11+
- FastAPI framework
- SQLAlchemy 2.0 ORM
- Pydantic v2 for request/response validation
- PostgreSQL 14+ database

**Existing Dependencies:**
- OpenAI API (GPT-4) for AI queries
- Axios for HTTP requests
- React Query for API state management

### 6.2 Data Storage

**New Database Objects:**

```sql
-- System configuration table
CREATE TABLE system_variables (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Initial seed data
INSERT INTO system_variables (key, value, description) VALUES
('fiscal_year_start_month', '1', 'Fiscal year start month (1=Jan, 4=Apr, 7=Jul)'),
('fiscal_year_start_day', '1', 'Fiscal year start day of month'),
('data_inception_date', '2024-07-01', 'Earliest transaction date in database');
```

**Browser Storage:**
```javascript
// localStorage structure
{
  "selectedDateRange": "Year To Date"  // One of the 10 predefined options
}
```

### 6.3 Component Architecture

**Frontend Component Hierarchy:**
```
App.tsx
├── DateRangeProvider (Context)
│   ├── Header
│   │   ├── DateRangePicker
│   │   ├── DateRangeIndicator
│   │   └── AdminNavButton
│   ├── Dashboard (consumes useDateRange())
│   └── AskAI (consumes useDateRange())
```

**Backend API Structure:**
```
/api
├── /system-variables
│   ├── GET / (all variables)
│   └── GET /{key} (single variable)
├── /dashboard
│   ├── GET /kpis?start_date&end_date
│   └── GET /monthly-trend?start_date&end_date
└── /ask
    └── POST (with date context in prompt)
```

**Utility Modules:**
```typescript
// frontend/src/utils/dateRangeCalculator.ts
export function calculateDateRange(
  option: DateRangeOption,
  fiscalYearStart: { month: number, day: number },
  inceptionDate: Date
): { startDate: Date, endDate: Date }

// frontend/src/utils/queryOverrideDetector.ts
export function detectDateOverride(query: string): boolean
```

---

## 7. Appendix

### 7.1 Discovery Interview Recap

**Initial Concept:**
User wants a date range picker at the top right of the main screen with 10 predefined options (This Month, Last Month, This Quarter, Last Quarter, This Year, Last Year, Last 12 Months, Last 6 Months, Year To Date, Inception to Date). The selected range should govern all queries unless specifically overridden by FY/Period mentions in the query. Also needs navigation to the existing Admin UI.

**User Responses:**

1. **Problem & Vision:**
   - ✅ Confirmed: Users currently have no date control; Admin UI exists but has no navigation
   - ✅ Vision: Persistent date range selector + easy Admin access

2. **Date Range Scope:**
   - Response: **3a & 3d** - Apply globally to all dashboards AND persist across sessions (localStorage)
   - *AI Decision: Use React Context for runtime state + localStorage for persistence*

3. **Visual Feedback:**
   - Response: **User deferred to AI**
   - *AI Decision: Show indicator below header ("📅 Showing: Jan 1 - Oct 29, 2025 (YTD)") for clarity*

4. **Default Selection:**
   - Response: **5c** - Year To Date (unless localStorage has a value)
   - *AI Decision: Check localStorage first, fall back to YTD if empty*

5. **Query Override Behavior:**
   - Response: **6a** - Detect via keywords (FY, Period, Q1, dates)
   - Response: **6b** - Yes, show visual indicator
   - Response: **6c** - Yes, AI should acknowledge in response
   - *AI Decision: Use regex to detect overrides + show dismissible badge above AI response*

6. **Fiscal Year Alignment:**
   - Response: **7a** - Jan-Dec (may change later)
   - Response: **7b** - Fiscal quarters
   - Response: **7c** - Fiscal year
   - *AI Decision: Store fiscal_year_start_month in system_variables for future flexibility*

7. **Admin UI Access:**
   - Response: **8a** - Not sure where Admin UI exists
   - Response: **8b** - Show to everyone (no role filtering)
   - *AI Decision: Add visible nav button; URL is /admin/ai-questions based on codebase analysis*

8. **Admin Menu Placement:**
   - Response: **User deferred to AI**
   - *AI Decision: Top nav bar next to date picker (desktop); hamburger menu (mobile)*

9. **Admin Features:**
   - Response: **10a** - Scoped in 0001 but not tested yet
   - Response: **10b** - See 10a
   - *AI Decision: Link to existing `/admin/ai-questions` page (AIQuestionLibrary.tsx)*

10. **Picker Design:**
    - Response: **User deferred to AI**
    - *AI Decision: Headless UI Listbox (consistent with Tailwind design system, accessible)*

11. **Picker Position:**
    - Response: **User deferred to AI**
    - *AI Decision: Fixed in header (top right), visible on all pages*

12. **Mobile/Responsive:**
    - Response: **User deferred to AI**
    - *AI Decision: Compact dropdown on mobile; hamburger menu for Admin link*

13. **Date Calculation:**
    - Response: **User deferred to AI**
    - *AI Decision: Frontend calculates (date-fns), passes ISO strings to backend*

14. **API Integration:**
    - Response: **User deferred to AI**
    - *AI Decision: Pass as query params (?start_date=...&end_date=...) for cacheability*

15. **Inception Date:**
    - Response: **16a** - Earliest data in transactions table
    - Response: **16b** - Store in DB (system_variables table), update during data loads
    - *AI Decision: Query `MIN(fy || '-' || LPAD(period, 2, '0') || '-01')`, store in system_variables*

16. **Performance:**
    - Response: **User deferred to AI**
    - *AI Decision: Show loading spinner; debounce rapid switches (500ms); cache previous range data*

17. **State Management:**
    - Response: **User deferred to AI**
    - *AI Decision: React Context + localStorage (not URL params, to avoid cluttering URLs)*

18. **Success Metrics:**
    - Response: **User deferred to AI**
    - *AI Decision: ≤2 clicks to change range, <2s data reload, all queries respect range, Admin accessible*

19. **Edge Cases:**
    - Response: **User deferred to AI**
    - *AI Decisions:*
      - No data → Show "No data for this period" message
      - First day of quarter → Use completed prior quarter for "Last Quarter"
      - Too much data → Backend handles with pagination (existing pattern)

### 7.1.1 Additional Requirements (Added After Initial Interview)

**Example Question Pills Update:**
User requested to replace the 4 existing example question pills with new hardcoded questions:

1. **New Questions:**
   - "Show revenue by month"
   - "Show expense by month"
   - "Show top 5 projects by revenue"
   - "Show top 5 projects by profitability"

2. **Behavior Specifications:**
   - Questions are hardcoded in UI (not from database)
   - Pills display exactly as typed (no date range text appended)
   - Pills do not re-render when date range changes
   - Date range is applied behind the scenes when questions are submitted
   - Questions do NOT filter results; they show all data for selected range
   - Override detection applies: "Show me YTD Revenue" would override global range

**Result Area Date Range Indicators:**
User requested that all result areas show clear indication of what date range was used:

1. **Dashboard KPIs and Charts:**
   - Include date range in title or subtitle
   - Show both range name and actual dates

2. **AI Response Areas:**
   - Display date range context in header/banner
   - Show override warning when user's query specifies different dates
   - Use visual distinction (color, icon) for overrides

3. **Consistent Formatting:**
   - Desktop: Full format with range name and dates
   - Mobile: Compact format
   - Apply to all result areas (KPIs, charts, tables, AI responses)

**Account Type Sign Correction:**
User identified that COGS and Other Operating Expense account amounts are stored as negative values in the database due to the Sage export being a formatted report, not raw data. Standard database practice is to store all amounts as positive values.

1. **Root Cause:**
   - Source data is a Sage report export (not direct database access)
   - Sage presented expenses as negative for P&L formatting
   - Export captured presentation layer, not data layer
   - Sage likely stores everything as positive internally

2. **Solution Requirements:**
   - Create one-time utility to fix existing data: multiply COGS and Other Operating Expense amounts by -1
   - Update batch_load.py and fast_load.py to transform these account types during import
   - Document that this is correcting a Sage report quirk, not changing accounting logic
   - After transformation, all calculations use standard arithmetic (Revenue - COGS - OpEx)

3. **Benefits:**
   - Clean data layer aligns with database best practices
   - Simpler SQL queries (no ABS() or sign handling needed)
   - Compatible with all BI tools without special logic
   - Financial calculations are intuitive: $100 - $90 = $10

### 7.2 AI Recommendations Summary

These decisions were made by AI to fill gaps where user deferred to best practices:

| Decision Area | AI Recommendation | Rationale |
|---------------|-------------------|-----------|
| **Visual Indicator** | Show below header ("📅 Showing: ...") | Clear, persistent, doesn't clutter header |
| **Override Detection** | Regex + dismissible badge | Balances automation with user control |
| **Fiscal Year Storage** | `system_variables` table | Future-proof for fiscal calendar changes |
| **Admin Placement** | Top nav (desktop), hamburger (mobile) | Standard web app pattern, discoverable |
| **Picker Component** | Headless UI Listbox | Accessible, matches existing Tailwind design |
| **Date Calculation** | Frontend (date-fns) → Backend (ISO strings) | Reduces server load, improves UX responsiveness |
| **API Integration** | Query parameters (?start_date&end_date) | RESTful, cacheable, debuggable |
| **State Management** | React Context + localStorage | Simple, no URL pollution, session persistence |
| **Performance** | Loading spinner + 500ms debounce | Prevents UI thrash, clear feedback |
| **Edge Cases** | Graceful fallbacks + user-friendly messages | Reliability without crashes |
| **Example Pills** | Hardcoded in component, no date in text | Clean UI, dates applied transparently |
| **Result Indicators** | Show on all KPIs, charts, AI responses | User always knows what data they're viewing |
| **Override Warning** | Amber badge with ⚠️ icon | Clear visual distinction when override occurs |
| **Account Sign Correction** | Transform at data load + one-time fix utility | Clean data layer, standard DB practice, simpler queries |

### 7.3 Data Model (system_variables)

```sql
-- Example data in system_variables table
┌────────────────────────────┬─────────┬──────────────────────────────────────┐
│ key                        │ value   │ description                           │
├────────────────────────────┼─────────┼──────────────────────────────────────┤
│ fiscal_year_start_month    │ 1       │ Fiscal year start month (1=Jan)      │
│ fiscal_year_start_day      │ 1       │ Fiscal year start day of month       │
│ data_inception_date        │ 2024-07-01 │ Earliest transaction in database  │
└────────────────────────────┴─────────┴──────────────────────────────────────┘
```

### 7.4 Example User Flows

**Flow 1: Switching Date Range**
1. User clicks date picker dropdown (currently "YTD")
2. Selects "This Quarter"
3. Date range indicator updates: "📅 Showing: Oct 1 - Oct 29, 2025 (This Quarter)"
4. Dashboard KPIs refresh with loading spinner
5. Charts update to show Q4 data only
6. Selection saved to localStorage

**Flow 2: Query with Override**
1. User has "YTD" selected (Jan 1 - Oct 29, 2025)
2. User types in Ask AI: "What was revenue in FY2024?"
3. System detects "FY2024" keyword
4. AI response includes: "Based on FY2024 data (Jan 1 - Dec 31, 2024)..."
5. Orange badge appears: "ℹ️ This query specified FY2024 and ignored YTD filter"
6. User can dismiss badge

**Flow 3: Accessing Admin UI**
1. User clicks ⚙️ Admin button in header
2. Browser navigates to `/admin/ai-questions`
3. AI Question Library page loads (existing component)
4. User manages canned questions and categories

**Flow 4: Using Example Question Pills**
1. User lands on main page with "YTD" selected (Jan 1 - Oct 29, 2025)
2. User sees 4 example question pills below Ask AI input
3. User clicks "Show revenue by month"
4. Question is submitted to AI service with YTD date range applied automatically
5. AI response appears with header: "📅 Results for: Year To Date (Jan 1 - Oct 29, 2025)"
6. Monthly revenue chart/table displays data for Jan-Oct 2025 only

**Flow 5: Date Range Indicator on Dashboard**
1. User changes date picker from "YTD" to "This Quarter"
2. Dashboard KPIs reload with loading spinner
3. Each KPI card now shows: "Total Revenue - This Quarter (Oct 1 - Dec 31, 2025)"
4. Charts update with subtitle: "Q4 2025"
5. User clearly sees what time period is being displayed

**Flow 6: Example Question with Different Date Range**
1. User selects "Last 12 Months" from date picker
2. Pills remain unchanged: "Show revenue by month", "Show expense by month", etc.
3. User clicks "Show top 5 projects by revenue"
4. AI processes query with Last 12 Months range (Oct 2024 - Oct 2025)
5. Response shows: "📅 Results for: Last 12 Months (Oct 30, 2024 - Oct 29, 2025)"
6. Top 5 projects ranked by revenue over that trailing 12-month period

### 7.5 Future Enhancements (Out of Scope)

- Custom date range picker (user selects specific start/end dates)
- Date range comparison mode ("This Quarter vs Last Quarter")
- Saved/favorite date ranges per user
- Role-based Admin UI visibility (hide for non-admins)
- Fiscal year configuration UI (currently requires DB edit)
- Date range presets per dashboard type
- Export data with selected date range in filename

---

**End of SRS Document**
