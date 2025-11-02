# Product Requirements Document (PRD)
## Superscapes Financial Intelligence Dashboard - MVP

**Version:** 1.0
**Date:** October 25, 2025
**Project Code:** 0001
**Phase:** MVP (Phase 1)
**Target Timeline:** 18 weeks from project kickoff

---

## 1. Introduction / Overview

The Superscapes Financial Intelligence Dashboard MVP is a greenfield web-based analytics platform that will establish Superscapes' first structured financial analysis capability. The system will automate data extraction from Sage, provide interactive visualizations, and enable natural language queries through an AI-powered financial analyst.

**Problem Statement:**
Superscapes currently lacks a systematic financial analysis process. Finance and operations teams rely on ad-hoc manual Sage exports with no consistent methodology for understanding business performance. This absence of formal financial intelligence capabilities causes:
- Delayed insights for decision-making (primary pain point)
- No structured monthly reporting process
- Limited visibility into profitability and cost trends
- No capability to identify anomalies or emerging patterns

**Solution:**
A centralized dashboard that integrates Sage (including payroll) and operational system data into a PostgreSQL data warehouse, delivering:
- Automated daily ETL with reconciliation
- Interactive financial performance dashboards
- AI-powered Q&A and proactive insight generation
- Role-based secure access for CFO, finance analysts, regional managers, and executives

**MVP Scope:**
The MVP establishes core financial intelligence capabilities with dashboards and basic AI analyst functionality, providing structured financial reporting for a 5-10 user pilot group (CFO + finance analysts).

---

## 2. Goals

### Primary Goals

1. **Enable Rapid Decision-Making:** Provide answers to financial questions in minutes rather than days
2. **Automate Data Integration:** Implement automated daily ETL from Sage (GL, AP, AR, Payroll) and operational systems
3. **Deliver Financial Visibility:** Provide CFO and finance team with up-to-date financial performance data refreshed daily
4. **Enable AI-Assisted Analysis:** Allow users to ask financial questions in natural language and receive accurate answers (≥80% accuracy for MVP)
5. **Ensure Data Accuracy:** Maintain automated reconciliation ensuring warehouse data matches Sage totals within 0.1% variance

### Secondary Goals

6. Establish structured financial reporting where ad-hoc manual processes currently exist
7. Finance analysts gain ≥5 hours per month through automated data access and analysis capabilities
8. Achieve 90%+ adoption among pilot user group (CFO + finance analysts) within 90 days
9. Establish foundation for Phase 2 enhancements (additional data sources, predictive analytics)

---

## 3. User Stories

### CFO / Controller Stories

**US-001:** As a CFO, I want to see a consolidated dashboard of revenue, expenses, and margins when I log in each morning, so that I can quickly understand current financial performance without requesting custom reports.

**US-002:** As a CFO, I want to drill down from total revenue to regional and division-level detail, so that I can identify which areas are performing well or need attention.

**US-003:** As a CFO, I want to ask the AI analyst questions like "What caused our margin decline in Q3?" and receive a narrative explanation with supporting data, so that I can make informed decisions quickly.

**US-004:** As a Controller, I want to see a data freshness indicator showing when the data was last updated, so that I know whether I'm looking at current or stale information.

**US-005:** As a Controller, I want to be alerted when reconciliation fails between Sage and the warehouse, so that I can investigate discrepancies before making decisions on potentially incorrect data.

### Finance Analyst Stories

**US-006:** As a Finance Analyst, I want to view detailed transaction-level data by account, region, and job, so that I can perform variance analysis and reconciliation.

**US-007:** As a Finance Analyst, I want to export dashboard data to Excel or CSV, so that I can perform additional ad-hoc analysis or share data with stakeholders.

**US-008:** As a Finance Analyst, I want to see 12-month trend charts for key metrics (revenue, expenses, margins), so that I can identify seasonal patterns and year-over-year changes.

**US-009:** As a Finance Analyst, I want to filter dashboard views by date range, region, and division, so that I can focus on specific time periods or business units.

**US-010:** As a Finance Analyst, I want the AI to show me the SQL it generated for my question, so that I can verify the logic and learn how to query the data myself.

### Regional Manager Stories

**US-011:** As a Regional Manager, I want to view job-level profitability for projects in my region, so that I can identify which jobs are performing well and which are over budget.

**US-012:** As a Regional Manager, I want to see labor cost trends for my region over time, so that I can manage staffing and scheduling more effectively.

**US-013:** As a Regional Manager, I want to compare my region's performance to other regions (aggregate only), so that I can understand relative performance without seeing sensitive details from other regions.

### Executive Stories

**US-014:** As an Executive, I want to see high-level KPIs (total revenue, gross margin %, net profit) at a glance, so that I can quickly assess overall business health.

**US-015:** As an Executive, I want to receive proactive insights from the AI when it detects significant anomalies or trends, so that I'm alerted to potential issues without having to ask.

**US-016:** As an Executive, I want to generate PDF reports summarizing key financial metrics, so that I can share insights with the board or other stakeholders.

### System Administrator Stories

**US-017:** As a System Administrator, I want to monitor ETL job execution status and receive alerts on failures, so that I can ensure data is loading correctly each day.

**US-018:** As a System Administrator, I want to view audit logs of all user activity and AI queries, so that I can maintain security compliance and troubleshoot issues.

**US-019:** As a System Administrator, I want to manage user roles and permissions, so that I can control who has access to sensitive financial data.

---

## 4. Functional Requirements

### 4.1 Data Integration & ETL

**FR-101:** The system must extract data from Sage (GL, AP, AR, Payroll modules) via ODBC or Sage API on a daily schedule (overnight batch).

**FR-102:** The system must extract data from time tracking, equipment/fleet management, and Aspire systems via API or file export on a daily schedule.

**FR-104:** The system must transform extracted data into a dimensional model with the following tables:
- Dimension tables: `dim_account`, `dim_job`, `dim_region`, `dim_division`, `dim_employee`, `dim_date`, `dim_customer`
- Fact tables: `fact_transaction`, `fact_payroll`, `fact_job_cost`

**FR-105:** The system must load 3 years of historical data from Sage during initial implementation.

**FR-106:** The system must execute daily incremental loads to update the warehouse with new transactions.

**FR-107:** The system must validate data completeness after each ETL run (row counts, null checks, referential integrity).

**FR-108:** The system must reconcile Sage GL totals against warehouse `fact_transaction` totals daily and flag discrepancies exceeding 0.1% variance.

**FR-109:** The system must reconcile Sage Payroll totals against warehouse `fact_payroll` totals daily.

**FR-110:** The system must log all ETL job executions with timestamps, row counts, and error messages.

**FR-111:** The system must send email alerts to designated administrators when ETL jobs fail or reconciliation discrepancies are detected.

**FR-112:** The system must prevent dashboards and AI queries from accessing unreconciled data (show last successfully reconciled data instead).

**FR-113:** The system must support manual ETL re-runs for specific date ranges via admin interface.

### 4.2 Authentication & Authorization

**FR-201:** The system must require users to authenticate with username and password before accessing any features.

**FR-202:** The system must support integration with Superscapes' existing SSO/Active Directory (if available) or implement secure local authentication.

**FR-203:** The system must enforce password complexity requirements: minimum 12 characters, uppercase, lowercase, number, special character.

**FR-204:** The system must implement role-based access control (RBAC) with the following roles:
- **Admin:** Full access including user management, ETL monitoring, audit logs
- **CFO:** Full read access to all financial data, export permissions, AI query access
- **Finance Analyst:** Full read access to all financial data, export permissions, AI query access, SQL preview access
- **Regional Manager:** Read access to financial data (no regional restrictions in MVP), limited export permissions
- **Executive:** Read-only access to dashboards and AI, PDF report generation

**FR-205:** The system must automatically log users out after 30 minutes of inactivity.

**FR-206:** The system must maintain active session state for up to 8 hours if user is actively using the application.

**FR-207:** The system must log all login attempts (successful and failed) with username, timestamp, and IP address.

### 4.3 Dashboard - Core Financial Performance

**FR-301:** The system must display a "Financial Overview" dashboard as the default landing page showing:
- Total Revenue (current month, YTD)
- Total Expenses (current month, YTD)
- Gross Margin % (current month, YTD)
- Operating Expenses (current month, YTD)
- Net Profit (current month, YTD)

**FR-302:** The system must display trend charts for the following metrics over a 12-month rolling period:
- Revenue by month (line chart)
- Expenses by month (line chart)
- Gross Margin % by month (line chart)

**FR-303:** The system must provide drill-down capability on all metrics by opening a modal dialog showing:
- Breakdown by Region (bar chart)
- Breakdown by Division (bar chart)
- Breakdown by top 10 Jobs (table)
- Option to export drill-down data

**FR-304:** The system must display a data freshness indicator in the top bar showing:
- For CFO/Finance Analyst roles: "Last updated: [timestamp]" + ETL job status (success/warning/error icon)
- For Regional Manager/Executive roles: "Last updated: [timestamp]" only
- Alert indicator (red badge) if data is stale (>24 hours old)

**FR-305:** The system must display revenue composition charts:
- Revenue by Division (pie chart)
- Revenue by Region (bar chart)
- Top 10 Jobs by Revenue (horizontal bar chart)

**FR-306:** The system must display expense composition charts:
- Expenses by Category/Account (pie chart)
- Labor vs. Materials vs. Overhead (stacked bar chart by month)

**FR-307:** The system must support dynamic filtering on all dashboard views:
- Date range selector (preset options: This Month, Last Month, This Quarter, Last Quarter, YTD, Last 12 Months, Custom Range)
- Region multi-select dropdown
- Division multi-select dropdown
- Job search/select (autocomplete)

**FR-308:** The system must apply filters across all charts and metrics on the current dashboard view.

**FR-309:** The system must persist user filter selections in browser session (cleared on logout).

**FR-310:** The system must render dashboard views within 3 seconds for standard queries (95th percentile).

**FR-311:** The system must display loading indicators for any chart or metric taking longer than 500ms to render.

**FR-312:** The system must support concurrent access for up to 30 users without performance degradation.

### 4.4 Dashboard - Detailed Views

**FR-401:** The system must provide a "Revenue Detail" dashboard showing:
- Revenue by Region over time (multi-line chart)
- Revenue by Division over time (stacked area chart)
- Top 20 Jobs by Revenue (sortable table with columns: Job Name, Region, Division, Revenue, Margin %)
- Month-over-month revenue change (bar chart)
- Year-over-year revenue comparison (grouped bar chart)

**FR-402:** The system must provide an "Expense Detail" dashboard showing:
- Expense by Account/Category over time (stacked area chart)
- Labor costs by Region (bar chart)
- Material costs by Division (bar chart)
- Top 20 Expense Accounts (table with variance vs. budget if available)

**FR-403:** The system must provide a "Job Profitability" dashboard showing:
- All active jobs in a sortable, filterable data table with columns: Job Name, Region, Division, Revenue, Total Cost, Margin $, Margin %, Status
- Pagination (50 rows per page)
- Search by job name
- Sort by any column
- Filter by Region, Division, Margin % range

**FR-404:** The system must provide a "Regional Performance" dashboard showing:
- Revenue by Region (current month, YTD) - comparison table
- Margin % by Region (current month, YTD) - comparison table
- Regional trend charts (one chart per region showing revenue over 12 months)

**FR-405:** The system must provide a "Division Performance" dashboard showing similar breakdowns as Regional Performance but by Division (Maintenance, Design-Build, Seasonal).

### 4.5 Export Functionality

**FR-501:** The system must allow users with appropriate permissions (CFO, Finance Analyst, Regional Manager) to export dashboard data.

**FR-502:** The system must support exporting data in the following formats:
- Excel (.xlsx)
- CSV (.csv)
- PDF report (for charts and summary views)

**FR-503:** The system must include applied filters and date ranges in exported data.

**FR-504:** The system must include metadata in exports: export date/time, exported by (username), data as-of date.

**FR-505:** The system must limit export result sets to 100,000 rows per export to prevent performance issues.

**FR-506:** The system must complete exports within 30 seconds for datasets up to 100,000 rows.

**FR-507:** The system must log all export actions with username, timestamp, dashboard/view exported, row count, and file format.

**FR-508:** The system must allow users to export individual charts as PNG images.

**FR-509:** The system must generate PDF reports that include:
- Report title and date range
- User-selected charts and KPIs
- Data freshness timestamp
- Footer with export metadata

### 4.6 AI Financial Analyst - Chat Interface

**FR-601:** The system must provide a dedicated "AI Analyst" page accessible from the main navigation menu.

**FR-602:** The system must display a chat-style interface with:
- Message history panel showing past questions and answers
- Text input box for entering questions
- "Ask" button to submit questions
- "Clear conversation" button to start fresh
- Sample/suggested questions for new users

**FR-603:** The system must accept natural language questions related to financial performance, such as:
- "What was our total revenue in Q3?"
- "Why did our margin decline in September?"
- "Show me labor costs by region for the last 6 months"
- "Which jobs are over budget?"
- "What are our top 5 revenue drivers this year?"

**FR-604:** The system must translate natural language questions into SQL queries against the semantic data layer (not raw transaction tables).

**FR-605:** The system must execute AI-generated SQL queries with a 30-second timeout limit.

**FR-606:** The system must limit AI query result sets to 10,000 rows.

**FR-607:** The system must display AI responses in the chat interface including:
- Narrative text explanation
- Data visualizations (charts) when appropriate
- Data tables when appropriate
- Citations/data sources

**FR-608:** The system must provide a "Show SQL" toggle for Finance Analyst and Admin roles to display the generated SQL query.

**FR-609:** The system must maintain conversation context allowing users to ask follow-up questions (e.g., "How does that compare to Q2?" after asking about Q3 revenue).

**FR-610:** The system must preserve conversation history for the duration of the user session (cleared on logout).

**FR-611:** The system must implement query guardrails to prevent:
- Access to raw employee PII (SSN, salary details beyond aggregated costs)
- SQL injection attacks
- Queries attempting to modify data (INSERT, UPDATE, DELETE)
- Queries accessing system tables or metadata

**FR-612:** The system must handle questions outside the AI's capability by:
- Acknowledging the limitation ("I don't have enough data to answer that question accurately")
- Suggesting alternative related questions the AI can answer
- Offering option to "Ask a human analyst" (email alert to finance team)

**FR-613:** The system must log all AI interactions including:
- User ID and timestamp
- Original question text
- Generated SQL query
- Query execution time
- Result row count
- Success/failure status

**FR-614:** The system must achieve ≥80% accuracy on a predefined set of 30 standard financial questions during MVP testing.

### 4.7 AI Financial Analyst - Proactive Insights

**FR-701:** The system must generate proactive insights when a user loads the dashboard home page.

**FR-702:** The system must analyze recent data (last 7 days) and identify up to 5 notable insights such as:
- Significant revenue or expense changes (>10% variance from prior period)
- Margin % changes exceeding threshold (>2% change)
- Top performing and underperforming jobs
- Unusual trends or patterns

**FR-703:** The system must display proactive insights in a dedicated "Insights" panel on the dashboard home page.

**FR-704:** The system must present each insight with:
- Headline (e.g., "Labor costs increased 15% in Northeast region")
- Brief narrative explanation
- Supporting data point or metric
- Link to relevant dashboard view for deeper analysis

**FR-705:** The system must allow users to dismiss insights individually.

**FR-706:** The system must refresh proactive insights daily (not real-time).

**FR-707:** The system must tailor insights based on user role:
- CFO/Executive: Company-wide insights
- Regional Manager: Region-specific insights (future enhancement - show all in MVP)
- Finance Analyst: All insights

### 4.8 Data Quality & Reconciliation

**FR-801:** The system must display a "Reconciliation Status" dashboard accessible to Admin and Finance Analyst roles.

**FR-802:** The system must show reconciliation results for each data source (Sage GL, Sage Payroll) including:
- Last reconciliation timestamp
- Source system total
- Warehouse total
- Variance amount and %
- Status: Pass (green), Warning (yellow <0.1%), Fail (red ≥0.1%)

**FR-803:** The system must allow administrators to manually mark reconciliation discrepancies as "Reviewed" or "Approved" with explanatory notes.

**FR-804:** The system must maintain reconciliation history for 90 days (viewable in Reconciliation Status dashboard).

**FR-805:** When reconciliation fails, the system must:
- Display a warning banner at the top of all dashboard pages for Admin and Finance Analyst roles: "Data reconciliation failed. Showing last verified data as of [date]."
- Continue to display the last successfully reconciled dataset
- Block AI queries from using unreconciled data
- Send email alert to designated administrators

**FR-806:** The system must provide a "Data Quality Metrics" view showing:
- Completeness: % of expected records loaded
- Timeliness: ETL job execution time and duration
- Consistency: Referential integrity check results

### 4.9 User Interface - Navigation & Layout

**FR-901:** The system must provide a responsive web interface supporting desktop browsers (Chrome, Edge, Safari, Firefox - latest 2 versions).

**FR-902:** The system must use a consistent layout across all pages:
- Top navigation bar: Logo, data freshness indicator, user profile menu, help/support icon
- Left sidebar: Main navigation menu (Home/Dashboard, Revenue Detail, Expense Detail, Job Profitability, Regional Performance, Division Performance, AI Analyst, Admin [if role permits])
- Main content area: Dashboard charts, tables, or AI interface
- Footer: Version info, last login timestamp

**FR-903:** The system must collapse the left sidebar to icons-only on smaller screens or via user toggle.

**FR-904:** The system must display user profile menu with options:
- User name and role
- Settings (future)
- Logout

**FR-905:** The system must display contextual help tooltips on hover for all KPI metrics and chart elements.

**FR-906:** The system must provide a "Help" icon linking to user documentation (placeholder in MVP).

**FR-907:** The system must use a professional, data-dense design aesthetic with:
- Consistent color scheme (to be defined based on Superscapes branding)
- Clear visual hierarchy
- Adequate white space for readability
- Accessible color contrast ratios

**FR-908:** The system must display loading indicators (spinners) for any operation taking longer than 500ms.

**FR-909:** The system must display user-friendly error messages when operations fail, with options to retry or contact support.

### 4.10 Administration & Monitoring

**FR-1001:** The system must provide an "Admin Panel" accessible only to users with Admin role.

**FR-1002:** The system must display an "ETL Job Monitor" showing:
- List of all scheduled ETL jobs (Sage GL, Sage Payroll, Time Tracking, Equipment/Fleet, Aspire)
- Last run timestamp
- Status (Success, Failed, Running, Pending)
- Duration
- Row counts (extracted, loaded)
- Error messages (if failed)

**FR-1003:** The system must allow administrators to manually trigger ETL jobs for specific date ranges.

**FR-1004:** The system must provide a "User Management" interface allowing admins to:
- View all users (list with columns: Username, Email, Role, Last Login, Status)
- Add new users (create username, assign role, set temporary password)
- Edit user roles
- Deactivate/activate users (soft delete - don't remove records)
- Reset user passwords

**FR-1005:** The system must provide an "Audit Log Viewer" showing:
- All user login/logout events
- All AI queries (user, question, timestamp)
- All data exports (user, dashboard, timestamp, row count)
- All administrative actions (user management, ETL triggers)
- Filters: Date range, user, action type

**FR-1006:** The system must retain audit logs for 7 years.

**FR-1007:** The system must allow administrators to export audit logs to CSV for compliance reporting.

---

## 5. Non-Goals (Out of Scope for MVP)

**NG-001:** Integration with Time Tracking, Equipment/Fleet Management, or Aspire systems (deferred to Phase 2)

**NG-002:** Predictive analytics and forecasting (cash flow, labor costs) (deferred to Phase 2)

**NG-003:** Anomaly detection and automated alerting (deferred to Phase 2 - basic proactive insights only in MVP)

**NG-004:** Scenario modeling and "what-if" analysis (deferred to Phase 2+)

**NG-005:** Regional data access restrictions (RBAC will support roles but all roles see all regions in MVP)

**NG-006:** Mobile native applications (iOS, Android) - web interface only in MVP

**NG-007:** Offline capability - requires internet connection

**NG-008:** Real-time data integration (daily batch ETL only)

**NG-009:** Write-back to Sage or transactional capabilities (read-only analytics platform)

**NG-010:** Custom report builder (users can export data but not create custom saved reports in MVP)

**NG-011:** Multi-language support (English only in MVP)

**NG-012:** Advanced data visualization types (heat maps, Sankey diagrams, etc. - standard charts only in MVP)

**NG-013:** Integration with external BI tools (Tableau, Power BI) (deferred to Phase 2+)

**NG-014:** Automated scheduled reports via email (export on-demand only in MVP)

**NG-015:** Comprehensive onboarding flow and in-app tutorials (basic tooltips and help documentation only)

---

## 6. Design Considerations

### 6.1 UI/UX Design Principles

**Professional & Data-Dense Aesthetic:**
- Clean, modern interface prioritizing data visibility over decorative elements
- Consistent spacing and alignment across all views
- Professional color palette (blues, grays, accent colors for alerts/warnings)
- Data tables with alternating row colors for readability
- Clear typography hierarchy (headers, sub-headers, body text, metrics)

**Dashboard Layout Standards:**
- Grid-based responsive layout (12-column grid system)
- KPI cards at top of dashboards (4 cards per row on desktop, stacking on mobile)
- Charts below KPIs (typically 2 charts per row, full-width for detailed views)
- Consistent card/panel design with subtle shadows and borders
- Sticky top navigation and filter bar when scrolling

**Chart Design Guidelines:**
- Use Plotly.js or Recharts for interactive, responsive charts
- Standard chart types for MVP:
  - Line charts: Trends over time
  - Bar charts: Comparisons across categories
  - Stacked bar charts: Composition comparisons over time
  - Pie/donut charts: Composition at a point in time (use sparingly)
  - Data tables: Detailed transaction/job-level data
- Color consistency: Same metric should use same color across all charts
- Interactive tooltips showing exact values on hover
- Legends positioned consistently (bottom for horizontal charts, right for others)
- Axis labels must be clear and include units ($, %, count)

**Color System (Recommended):**
- Primary: #1E3A8A (Dark Blue) - for main actions, navigation highlights
- Secondary: #10B981 (Green) - for positive metrics, success states
- Warning: #F59E0B (Amber) - for warnings, caution states
- Error: #EF4444 (Red) - for errors, negative trends, critical alerts
- Neutral: #6B7280 (Gray) - for text, borders, inactive states
- Background: #F9FAFB (Light Gray) - for page backgrounds
- Surface: #FFFFFF (White) - for cards, panels, modals

**Accessibility Considerations:**
- Color contrast ratios meet WCAG 2.1 Level AA standards (4.5:1 for normal text, 3:1 for large text)
- Keyboard navigation support for all interactive elements
- Focus indicators visible for keyboard users
- Alt text for all charts (describe the data presented)
- Screen reader compatible labels for form inputs and buttons

### 6.2 Dashboard Wireframes (Text Descriptions)

**Financial Overview Dashboard (Home Page):**

```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo] Financial Intelligence Dashboard    [Freshness] [User ▼]   │
├────────────────────────────────────────────────────────────────────┤
│ [≡] │  [Filters: Date Range ▼] [Region ▼] [Division ▼] [Apply]    │
│ Nav │                                                               │
│     │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────┐│
│ • Home  │ Total Revenue│ │Total Expenses│ │ Gross Margin │ │ Net ││
│ Revenue │    $8.5M     │ │    $6.2M     │ │    27.1%     │ │$2.3M││
│ Expense │   ↑ 12.3%   │ │   ↑ 8.5%    │ │   ↑ 2.1%    │ │  ↑  ││
│ Jobs    └──────────────┘ └──────────────┘ └──────────────┘ └─────┘│
│ Regional│                                                           │
│ Division│  ┌─────────────────────────────┐ ┌────────────────────┐ │
│         │  │ Revenue Trend (12 months)   │ │ Margin % Trend     │ │
│ AI Chat │  │ [Line Chart]                │ │ [Line Chart]       │ │
│         │  │                             │ │                    │ │
│ ─────   │  └─────────────────────────────┘ └────────────────────┘ │
│ Admin   │                                                           │
│ Logout  │  ┌─────────────────────────────┐ ┌────────────────────┐ │
│         │  │ Revenue by Division         │ │ Expense Breakdown  │ │
│         │  │ [Pie Chart]                 │ │ [Stacked Bar]      │ │
│         │  │                             │ │                    │ │
│         │  └─────────────────────────────┘ └────────────────────┘ │
│         │                                                           │
│         │  ┌───────────────────────────────────────────────────┐   │
│         │  │ Proactive Insights                                │   │
│         │  │ • Labor costs increased 15% in Northeast [→]  [×] │   │
│         │  │ • Top performing job: Project Alpha +42%  [→]  [×] │   │
│         │  └───────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

**AI Analyst Interface:**

```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo] AI Financial Analyst                 [Freshness] [User ▼]  │
├────────────────────────────────────────────────────────────────────┤
│ [≡] │  AI Financial Analyst                                        │
│ Nav │                                                               │
│     │  ┌──────────────────────────────────────────────────────┐    │
│ • Home  │ Conversation History                                 │    │
│ Revenue │                                                       │    │
│ Expense │ You: What was our total revenue in Q3?              │    │
│ Jobs    │                                                       │    │
│ Regional│ AI: Total revenue in Q3 2025 was $25.8M,            │    │
│ Division│     an increase of 12.3% compared to Q2...          │    │
│         │     [Chart showing Q3 revenue breakdown]             │    │
│ AI Chat │     [Show SQL ▼]                                     │    │
│ ← Back  │                                                       │    │
│         │ You: How does that compare to Q3 last year?         │    │
│ ─────   │                                                       │    │
│ Admin   │ AI: Q3 2025 revenue of $25.8M represents a          │    │
│ Logout  │     15.6% increase over Q3 2024 ($22.3M)...         │    │
│         │     [Chart showing YoY comparison]                   │    │
│         │                                                       │    │
│         │ ─────────────────────────────────────────────────    │    │
│         │ (scroll for more conversation history)               │    │
│         └──────────────────────────────────────────────────────┘    │
│         │                                                            │
│         │  ┌────────────────────────────────────────────────┐       │
│         │  │ Ask a question...                              │       │
│         │  └────────────────────────────────────────────────┘ [Ask] │
│         │                                                            │
│         │  Suggested questions:                                     │
│         │  • What drove our margin decline in Q3?                   │
│         │  • Show me labor costs by region                          │
│         │  • Which jobs are over budget?                            │
│         │  [Clear Conversation]                                     │
└────────────────────────────────────────────────────────────────────┘
```

**Admin Panel - ETL Job Monitor:**

```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo] Admin Panel - ETL Jobs              [Freshness] [User ▼]   │
├────────────────────────────────────────────────────────────────────┤
│ [≡] │  ETL Job Monitor                        [Refresh] [Manual Run]│
│ Nav │                                                               │
│     │  ┌──────────────────────────────────────────────────────────┐│
│ • Home  │ Job Name      │Last Run   │Status │Duration│Rows  │     ││
│ Revenue ├───────────────┼───────────┼───────┼────────┼──────┼─────┤│
│ Expense │ Sage GL       │10/25 2:15a│  ✓    │ 12m 3s │45,823│[Run]││
│ Jobs    │ Sage Payroll  │10/25 2:28a│  ✓    │  4m 12s│ 8,945│[Run]││
│ Regional│ Time Tracking │10/25 2:33a│  ⚠   │  2m 45s│12,034│[Run]││
│ Division│ Equipment/Flt │10/25 2:36a│  ✓    │  3m 18s│ 9,123│[Run]││
│         │ Reconciliation│10/25 2:40a│  ✗    │   45s  │  N/A │[Run]││
│ AI Chat └──────────────────────────────────────────────────────────┘│
│         │                                                           │
│ ─────   │  ┌──────────────────────────────────────────────────────┐│
│ Admin   │  │ Recent Errors                                        ││
│ • ETL   │  │ 10/25 2:40a - Reconciliation: Sage GL variance 0.2% ││
│ • Users │  │   Source: $8,542,123  Warehouse: $8,559,045          ││
│ • Audit │  │   Difference: $16,922                                ││
│ • Recon │  │   [Mark as Reviewed] [View Details]                  ││
│ Logout  │  └──────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

### 6.3 Responsive Design

**Desktop (≥1024px):**
- Full sidebar navigation visible
- 4 KPI cards per row
- 2 charts per row (side-by-side)
- Data tables full width with all columns visible

**Tablet (768px - 1023px):**
- Collapsible sidebar (icons only by default)
- 2 KPI cards per row
- 1-2 charts per row depending on complexity
- Data tables with horizontal scroll if needed

**Mobile (< 768px):**
- Top navigation bar with hamburger menu
- 1 KPI card per row (stacked)
- 1 chart per row (full width)
- Data tables simplified or replaced with card views
- Note: Mobile is not primary target for MVP but should be usable

### 6.4 Component Library Recommendations

**Frontend Framework:** React 18+ with TypeScript

**UI Component Libraries (choose one):**
- **Option A:** Material-UI (MUI) - Comprehensive, professional, well-documented
- **Option B:** Tailwind CSS + Headless UI - More customizable, lighter weight
- **Recommendation:** Tailwind CSS + Headless UI for flexibility and modern dev experience

**Chart Library:**
- **Primary:** Recharts (React-native charting library, good for standard charts)
- **Alternative:** Plotly.js (more advanced interactivity, larger bundle size)
- **Recommendation:** Recharts for MVP (simpler integration, smaller bundle)

**Data Table:**
- **TanStack Table (React Table v8)** - Powerful, headless table library with sorting, filtering, pagination

**Form Management:**
- **React Hook Form** - Lightweight form validation and state management

**Date Picker:**
- **react-datepicker** - Simple, accessible date range picker for filters

---

## 7. Technical Considerations

### 7.1 Architecture Overview

**Application Layers:**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  React 18 + TypeScript + Tailwind CSS                       │
│  Components: Dashboards, Charts, AI Chat, Admin UI          │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS / REST API
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  FastAPI (Python 3.11+)                                     │
│  Services: Auth, Dashboard API, AI Service, Admin API       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       AI LAYER                              │
│  OpenAI GPT-4 API + pgvector                                │
│  Query Generator, SQL Validator, Insight Generator          │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                            │
│  PostgreSQL 14+ Data Warehouse                              │
│  Schemas: raw (staging), core (dimensional), semantic (AI)  │
└─────────────────────────────────────────────────────────────┘
                            ↑
┌─────────────────────────────────────────────────────────────┐
│                       ETL LAYER                             │
│  Apache Airflow or Prefect                                  │
│  Airbyte (connectors) + dbt (transformations)               │
└─────────────────────────────────────────────────────────────┘
                            ↑
┌─────────────────────────────────────────────────────────────┐
│                    SOURCE SYSTEMS                           │
│  Sage (incl. Payroll), Time Tracking, Equipment, Aspire    │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Technology Stack (Detailed)

**Frontend:**
- **Framework:** React 18.2+ with TypeScript 5.0+
- **Build Tool:** Vite (faster than Create React App)
- **Styling:** Tailwind CSS 3.3+
- **Charts:** Recharts 2.5+
- **State Management:** React Context API + TanStack Query (React Query) for server state
- **Routing:** React Router v6
- **HTTP Client:** Axios with interceptors for auth token handling
- **Forms:** React Hook Form + Zod (validation)
- **Testing:** Vitest + React Testing Library

**Backend API:**
- **Framework:** FastAPI 0.100+ (Python 3.11+)
- **ORM:** SQLAlchemy 2.0+ (for database queries)
- **Auth:** python-jose (JWT tokens) + passlib (password hashing)
- **Validation:** Pydantic v2 (request/response models)
- **CORS:** fastapi-cors-middleware
- **API Documentation:** Auto-generated OpenAPI (Swagger UI)
- **Testing:** pytest + pytest-asyncio

**AI Services:**
- **LLM API:** OpenAI GPT-4 API (latest stable version)
- **Vector Database:** pgvector (PostgreSQL extension)
- **Embeddings:** OpenAI text-embedding-ada-002
- **SQL Validation:** sqlglot or sqlparse (prevent SQL injection)
- **Context Management:** Custom context store in PostgreSQL

**Data Warehouse:**
- **Database:** PostgreSQL 14.9+ or 15+
- **Extensions:** pgvector (for embeddings), pg_cron (for scheduled jobs)
- **Connection Pooling:** PgBouncer (if needed for high concurrency)

**ETL Orchestration:**
- **Orchestrator:** Apache Airflow 2.7+ or Prefect 2.10+
  - **Recommendation:** Prefect (simpler setup, better UI, Python-native)
- **Data Ingestion:** Airbyte 0.50+ for Sage and operational system connectors
- **Transformations:** dbt (data build tool) 1.5+
- **Scheduling:** AWS EventBridge for triggering scheduled ECS tasks

**Infrastructure & Deployment:**
- **Cloud Provider:** AWS (backend/data), Vercel (frontend)
- **Backend Compute:** AWS ECS Fargate for API and ETL jobs
- **Frontend Hosting:** Vercel (static site with global CDN)
- **Database Hosting:** AWS RDS for PostgreSQL (dev, staging, production)
- **Object Storage:** AWS S3 (for exported files, backups)
- **Load Balancing:** AWS Application Load Balancer (ALB) for backend API
- **Secrets Management:** AWS Secrets Manager
- **Monitoring:** AWS CloudWatch
- **CI/CD:** GitHub Actions
- **IaC:** Terraform or AWS CDK
- **Docker:** Minimal - 2 Dockerfiles for production ECS deployment only

**Development Tools:**
- **Version Control:** Git + GitHub
- **Code Quality:** ESLint, Prettier (frontend), Black, Ruff (backend)
- **Pre-commit Hooks:** Husky + lint-staged
- **API Testing:** Postman or Bruno collections

**Local Development Setup:**
- **Frontend:** Run Vite dev server natively (`npm run dev` on port 5173)
- **Backend:** Run FastAPI natively with uvicorn (`uvicorn backend.main:app --reload` on port 8000)
- **Database:** Connect to AWS RDS dev instance (shared or per-developer)
- **ETL:** Run Prefect flows natively with Python (`python etl/flows/daily_etl.py`)
- **No Docker Required:** Developers install Python 3.11+, Node.js 18+, and connect to RDS

### 7.3 Database Schema (Dimensional Model)

**Schema Organization:**
- `raw` schema: Staging tables for extracted data (temporary, truncated after load)
- `core` schema: Dimensional model (fact and dimension tables)
- `semantic` schema: Aggregated views and materialized views for AI and dashboards

**Core Dimension Tables:**

```sql
-- dim_date: Date dimension (pre-populated for 10 years)
CREATE TABLE core.dim_date (
    date_key INTEGER PRIMARY KEY,  -- YYYYMMDD format
    date_actual DATE NOT NULL,
    day_of_week INTEGER,
    day_name VARCHAR(10),
    month INTEGER,
    month_name VARCHAR(10),
    quarter INTEGER,
    year INTEGER,
    is_weekend BOOLEAN,
    fiscal_year INTEGER,
    fiscal_quarter INTEGER
);

-- dim_account: Chart of accounts from Sage
CREATE TABLE core.dim_account (
    account_key SERIAL PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50),  -- Asset, Liability, Revenue, Expense, Equity
    account_category VARCHAR(100),  -- Labor, Materials, Overhead, etc.
    parent_account_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- dim_region: Geographic regions
CREATE TABLE core.dim_region (
    region_key SERIAL PRIMARY KEY,
    region_code VARCHAR(20) NOT NULL UNIQUE,
    region_name VARCHAR(100) NOT NULL,
    region_manager VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- dim_division: Business divisions
CREATE TABLE core.dim_division (
    division_key SERIAL PRIMARY KEY,
    division_code VARCHAR(20) NOT NULL UNIQUE,
    division_name VARCHAR(100) NOT NULL,  -- Maintenance, Design-Build, Seasonal
    is_active BOOLEAN DEFAULT TRUE
);

-- dim_customer: Customer master data
CREATE TABLE core.dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50),  -- Commercial, Municipal, etc.
    region_key INTEGER REFERENCES core.dim_region(region_key),
    is_active BOOLEAN DEFAULT TRUE
);

-- dim_job: Job/Project master data
CREATE TABLE core.dim_job (
    job_key SERIAL PRIMARY KEY,
    job_number VARCHAR(50) NOT NULL UNIQUE,
    job_name VARCHAR(255) NOT NULL,
    customer_key INTEGER REFERENCES core.dim_customer(customer_key),
    region_key INTEGER REFERENCES core.dim_region(region_key),
    division_key INTEGER REFERENCES core.dim_division(division_key),
    start_date DATE,
    end_date DATE,
    budget_amount DECIMAL(15,2),
    status VARCHAR(50),  -- Active, Completed, On Hold, Cancelled
    is_active BOOLEAN DEFAULT TRUE
);

-- dim_employee: Employee master data (aggregated only - no PII in semantic views)
CREATE TABLE core.dim_employee (
    employee_key SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    employee_name VARCHAR(255),  -- May be masked in semantic layer
    region_key INTEGER REFERENCES core.dim_region(region_key),
    division_key INTEGER REFERENCES core.dim_division(division_key),
    job_title VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);
```

**Core Fact Tables:**

```sql
-- fact_transaction: General ledger transactions
CREATE TABLE core.fact_transaction (
    transaction_key BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) NOT NULL,  -- Source system transaction ID
    transaction_date DATE NOT NULL,
    date_key INTEGER NOT NULL REFERENCES core.dim_date(date_key),
    account_key INTEGER NOT NULL REFERENCES core.dim_account(account_key),
    job_key INTEGER REFERENCES core.dim_job(job_key),
    region_key INTEGER REFERENCES core.dim_region(region_key),
    division_key INTEGER REFERENCES core.dim_division(division_key),
    customer_key INTEGER REFERENCES core.dim_customer(customer_key),
    transaction_type VARCHAR(20),  -- Debit, Credit
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    source_system VARCHAR(50) DEFAULT 'Sage',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(transaction_id, source_system)
);

-- Indexes for performance
CREATE INDEX idx_fact_transaction_date ON core.fact_transaction(transaction_date);
CREATE INDEX idx_fact_transaction_account ON core.fact_transaction(account_key);
CREATE INDEX idx_fact_transaction_job ON core.fact_transaction(job_key);
CREATE INDEX idx_fact_transaction_region ON core.fact_transaction(region_key);

-- fact_payroll: Payroll expenses by employee and job
CREATE TABLE core.fact_payroll (
    payroll_key BIGSERIAL PRIMARY KEY,
    payroll_id VARCHAR(100) NOT NULL,
    pay_date DATE NOT NULL,
    date_key INTEGER NOT NULL REFERENCES core.dim_date(date_key),
    employee_key INTEGER NOT NULL REFERENCES core.dim_employee(employee_key),
    job_key INTEGER REFERENCES core.dim_job(job_key),
    region_key INTEGER REFERENCES core.dim_region(region_key),
    division_key INTEGER REFERENCES core.dim_division(division_key),
    hours_regular DECIMAL(8,2),
    hours_overtime DECIMAL(8,2),
    gross_pay DECIMAL(12,2) NOT NULL,
    benefits DECIMAL(12,2),
    taxes DECIMAL(12,2),
    total_cost DECIMAL(12,2) NOT NULL,
    source_system VARCHAR(50) DEFAULT 'Payroll',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(payroll_id, source_system)
);

CREATE INDEX idx_fact_payroll_date ON core.fact_payroll(pay_date);
CREATE INDEX idx_fact_payroll_employee ON core.fact_payroll(employee_key);
CREATE INDEX idx_fact_payroll_job ON core.fact_payroll(job_key);

-- fact_job_cost: Job-level cost summary (aggregated daily)
CREATE TABLE core.fact_job_cost (
    job_cost_key BIGSERIAL PRIMARY KEY,
    job_key INTEGER NOT NULL REFERENCES core.dim_job(job_key),
    date_key INTEGER NOT NULL REFERENCES core.dim_date(date_key),
    cost_date DATE NOT NULL,
    labor_cost DECIMAL(12,2) DEFAULT 0,
    material_cost DECIMAL(12,2) DEFAULT 0,
    equipment_cost DECIMAL(12,2) DEFAULT 0,
    overhead_cost DECIMAL(12,2) DEFAULT 0,
    total_cost DECIMAL(12,2) NOT NULL,
    revenue DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_key, date_key)
);

CREATE INDEX idx_fact_job_cost_job ON core.fact_job_cost(job_key);
CREATE INDEX idx_fact_job_cost_date ON core.fact_job_cost(cost_date);
```

**Semantic Layer Views (AI-Accessible):**

```sql
-- semantic.monthly_financials: Aggregated monthly P&L
CREATE MATERIALIZED VIEW semantic.monthly_financials AS
SELECT
    d.year,
    d.month,
    d.month_name,
    r.region_name,
    div.division_name,
    SUM(CASE WHEN a.account_type = 'Revenue' THEN t.amount ELSE 0 END) AS total_revenue,
    SUM(CASE WHEN a.account_type = 'Expense' THEN t.amount ELSE 0 END) AS total_expenses,
    SUM(CASE WHEN a.account_category = 'Labor' THEN t.amount ELSE 0 END) AS labor_costs,
    SUM(CASE WHEN a.account_category = 'Materials' THEN t.amount ELSE 0 END) AS material_costs,
    COUNT(DISTINCT t.job_key) AS active_jobs
FROM core.fact_transaction t
JOIN core.dim_date d ON t.date_key = d.date_key
JOIN core.dim_account a ON t.account_key = a.account_key
LEFT JOIN core.dim_region r ON t.region_key = r.region_key
LEFT JOIN core.dim_division div ON t.division_key = div.division_key
GROUP BY d.year, d.month, d.month_name, r.region_name, div.division_name;

CREATE INDEX ON semantic.monthly_financials(year, month);

-- Refresh daily after ETL completes
-- (Airflow/Prefect task will execute: REFRESH MATERIALIZED VIEW semantic.monthly_financials)

-- semantic.job_profitability: Current job profitability summary
CREATE MATERIALIZED VIEW semantic.job_profitability AS
SELECT
    j.job_number,
    j.job_name,
    r.region_name,
    div.division_name,
    c.customer_name,
    j.budget_amount,
    SUM(jc.total_cost) AS actual_cost,
    SUM(jc.revenue) AS actual_revenue,
    SUM(jc.revenue) - SUM(jc.total_cost) AS margin_dollars,
    CASE
        WHEN SUM(jc.revenue) > 0
        THEN ((SUM(jc.revenue) - SUM(jc.total_cost)) / SUM(jc.revenue)) * 100
        ELSE 0
    END AS margin_percent,
    j.status
FROM core.dim_job j
LEFT JOIN core.fact_job_cost jc ON j.job_key = jc.job_key
LEFT JOIN core.dim_region r ON j.region_key = r.region_key
LEFT JOIN core.dim_division div ON j.division_key = div.division_key
LEFT JOIN core.dim_customer c ON j.customer_key = c.customer_key
GROUP BY j.job_number, j.job_name, r.region_name, div.division_name, c.customer_name, j.budget_amount, j.status;

CREATE INDEX ON semantic.job_profitability(region_name);
CREATE INDEX ON semantic.job_profitability(division_name);
```

### 7.4 API Specifications

**Base URL:** `https://api.superscapes-fi.com/v1` (production) or `http://localhost:8000/v1` (development)

**Authentication:** All endpoints except `/auth/login` require JWT Bearer token in Authorization header.

#### 7.4.1 Authentication Endpoints

**POST /auth/login**
```json
Request:
{
  "username": "string",
  "password": "string"
}

Response (200 OK):
{
  "access_token": "string (JWT)",
  "token_type": "bearer",
  "expires_in": 28800,  // seconds (8 hours)
  "user": {
    "user_id": "string",
    "username": "string",
    "email": "string",
    "role": "CFO|Finance Analyst|Regional Manager|Executive|Admin",
    "full_name": "string"
  }
}

Response (401 Unauthorized):
{
  "detail": "Incorrect username or password"
}
```

**POST /auth/logout**
```json
Request: (JWT in header, no body)

Response (200 OK):
{
  "message": "Successfully logged out"
}
```

**GET /auth/me**
```json
Request: (JWT in header)

Response (200 OK):
{
  "user_id": "string",
  "username": "string",
  "email": "string",
  "role": "string",
  "full_name": "string",
  "last_login": "ISO 8601 timestamp"
}
```

#### 7.4.2 Dashboard Data Endpoints

**GET /dashboard/overview**
```json
Request Query Parameters:
- date_from: ISO date (default: first day of current month)
- date_to: ISO date (default: today)
- region_ids: comma-separated region keys (optional)
- division_ids: comma-separated division keys (optional)

Response (200 OK):
{
  "kpis": {
    "total_revenue": {
      "current_period": 8500000.00,
      "prior_period": 7500000.00,
      "change_percent": 13.33,
      "change_direction": "up"
    },
    "total_expenses": { /* same structure */ },
    "gross_margin_percent": { /* same structure */ },
    "net_profit": { /* same structure */ }
  },
  "revenue_trend": [
    {
      "month": "2024-11",
      "revenue": 2850000.00
    },
    // ... 12 months
  ],
  "margin_trend": [ /* similar structure */ ],
  "revenue_by_division": [
    {
      "division_name": "Maintenance",
      "revenue": 4500000.00,
      "percent_of_total": 52.94
    },
    // ...
  ],
  "expense_breakdown": [ /* similar structure */ ],
  "data_as_of": "2025-10-25T02:45:00Z",
  "reconciliation_status": "success|warning|error"
}
```

**GET /dashboard/revenue-detail**
```json
Request Query Parameters: (same as overview)

Response (200 OK):
{
  "revenue_by_region_trend": [
    {
      "month": "2024-11",
      "regions": {
        "Northeast": 1200000.00,
        "Southeast": 950000.00,
        // ...
      }
    },
    // ... 12 months
  ],
  "revenue_by_division_trend": [ /* similar */ ],
  "top_jobs": [
    {
      "job_number": "J-2025-001",
      "job_name": "City Park Renovation",
      "region": "Northeast",
      "division": "Design-Build",
      "revenue": 1250000.00,
      "margin_percent": 28.5
    },
    // ... top 20
  ],
  "mom_change": [ /* month-over-month changes */ ],
  "yoy_comparison": [ /* year-over-year comparison */ ]
}
```

**GET /dashboard/jobs**
```json
Request Query Parameters:
- page: integer (default: 1)
- page_size: integer (default: 50, max: 100)
- sort_by: string (job_number|job_name|revenue|margin_percent)
- sort_order: asc|desc
- region_ids: comma-separated (optional)
- division_ids: comma-separated (optional)
- margin_min: decimal (optional, filter by minimum margin %)
- margin_max: decimal (optional, filter by maximum margin %)
- search: string (optional, search job name/number)

Response (200 OK):
{
  "jobs": [
    {
      "job_number": "string",
      "job_name": "string",
      "region": "string",
      "division": "string",
      "customer": "string",
      "budget": 500000.00,
      "actual_cost": 385000.00,
      "actual_revenue": 525000.00,
      "margin_dollars": 140000.00,
      "margin_percent": 26.67,
      "status": "Active|Completed|On Hold"
    },
    // ...
  ],
  "pagination": {
    "total_records": 1523,
    "total_pages": 31,
    "current_page": 1,
    "page_size": 50
  }
}
```

#### 7.4.3 AI Analyst Endpoints

**POST /ai/query**
```json
Request:
{
  "question": "string (natural language question)",
  "conversation_id": "string (optional, for follow-up context)",
  "include_sql": boolean (default: false, only for Finance Analyst+ roles)
}

Response (200 OK):
{
  "conversation_id": "string (UUID)",
  "answer": {
    "narrative": "string (AI-generated explanation)",
    "data": {
      "type": "table|chart|metric",
      "chart_type": "line|bar|pie|null (if type=table or metric)",
      "values": [ /* array of data objects */ ]
    },
    "sql_query": "string (only if include_sql=true and user has permission)",
    "data_sources": ["semantic.monthly_financials", "core.dim_region"],
    "confidence": "high|medium|low"
  },
  "generated_at": "ISO 8601 timestamp"
}

Response (422 Unprocessable Entity - question not understood):
{
  "detail": "I don't have enough information to answer that question accurately.",
  "suggestions": [
    "What was our total revenue in Q3?",
    "Show me labor costs by region"
  ],
  "escalate_option": true
}

Response (429 Too Many Requests):
{
  "detail": "AI query rate limit exceeded. Please try again in 60 seconds."
}
```

**GET /ai/insights**
```json
Request Query Parameters:
- date_from: ISO date (default: 7 days ago)
- date_to: ISO date (default: today)

Response (200 OK):
{
  "insights": [
    {
      "insight_id": "string (UUID)",
      "headline": "Labor costs increased 15% in Northeast region",
      "narrative": "Labor costs in the Northeast region increased from $1.2M...",
      "metric": {
        "label": "Labor Cost Change",
        "value": "+15.3%",
        "severity": "warning"
      },
      "related_dashboard": "/dashboard/expense-detail?region=2",
      "generated_at": "ISO 8601 timestamp"
    },
    // ... up to 5 insights
  ],
  "generated_at": "ISO 8601 timestamp"
}
```

#### 7.4.4 Export Endpoints

**POST /export/dashboard**
```json
Request:
{
  "dashboard": "overview|revenue-detail|expense-detail|jobs",
  "format": "excel|csv|pdf",
  "filters": {
    "date_from": "ISO date",
    "date_to": "ISO date",
    "region_ids": [1, 2, 3],
    "division_ids": [1, 2]
  },
  "include_charts": boolean (for PDF only, default: true)
}

Response (200 OK):
{
  "export_id": "string (UUID)",
  "download_url": "string (pre-signed S3 URL, expires in 1 hour)",
  "filename": "string",
  "file_size_bytes": integer,
  "expires_at": "ISO 8601 timestamp"
}

Response (400 Bad Request):
{
  "detail": "Export exceeds maximum row limit (100,000 rows)"
}
```

#### 7.4.5 Admin Endpoints

**GET /admin/etl-jobs**
```json
Request: (Admin role required)

Response (200 OK):
{
  "jobs": [
    {
      "job_id": "string",
      "job_name": "Sage GL Extract",
      "last_run": "ISO 8601 timestamp",
      "status": "success|failed|running|pending",
      "duration_seconds": 723,
      "rows_extracted": 45823,
      "rows_loaded": 45823,
      "error_message": "string (null if successful)"
    },
    // ...
  ]
}
```

**POST /admin/etl-jobs/{job_id}/run**
```json
Request: (Admin role required)
{
  "date_from": "ISO date (optional, for backfill)",
  "date_to": "ISO date (optional, for backfill)"
}

Response (202 Accepted):
{
  "job_execution_id": "string (UUID)",
  "message": "Job queued for execution",
  "estimated_duration_seconds": 600
}
```

**GET /admin/users**
```json
Request Query Parameters: (Admin role required)
- page: integer
- page_size: integer
- role: filter by role (optional)
- status: active|inactive (optional)

Response (200 OK):
{
  "users": [
    {
      "user_id": "string",
      "username": "string",
      "email": "string",
      "full_name": "string",
      "role": "string",
      "status": "active|inactive",
      "last_login": "ISO 8601 timestamp",
      "created_at": "ISO 8601 timestamp"
    },
    // ...
  ],
  "pagination": { /* ... */ }
}
```

**POST /admin/users**
```json
Request: (Admin role required)
{
  "username": "string",
  "email": "string",
  "full_name": "string",
  "role": "CFO|Finance Analyst|Regional Manager|Executive|Admin",
  "temporary_password": "string (optional, auto-generated if not provided)"
}

Response (201 Created):
{
  "user_id": "string",
  "username": "string",
  "email": "string",
  "temporary_password": "string (if auto-generated)",
  "message": "User created successfully. Temporary password must be changed on first login."
}
```

**GET /admin/audit-logs**
```json
Request Query Parameters: (Admin role required)
- date_from: ISO date
- date_to: ISO date
- user_id: filter by user (optional)
- action_type: login|logout|export|ai_query|admin_action (optional)
- page: integer
- page_size: integer

Response (200 OK):
{
  "logs": [
    {
      "log_id": "string",
      "timestamp": "ISO 8601 timestamp",
      "user_id": "string",
      "username": "string",
      "action_type": "string",
      "action_detail": "string",
      "ip_address": "string",
      "user_agent": "string"
    },
    // ...
  ],
  "pagination": { /* ... */ }
}
```

**GET /admin/reconciliation-status**
```json
Request: (Admin or Finance Analyst role required)

Response (200 OK):
{
  "reconciliations": [
    {
      "source_system": "Sage GL",
      "last_reconciliation": "ISO 8601 timestamp",
      "source_total": 8542123.45,
      "warehouse_total": 8559045.12,
      "variance_dollars": 16921.67,
      "variance_percent": 0.198,
      "status": "pass|warning|fail",
      "reviewed_by": "string (null if not reviewed)",
      "reviewed_at": "ISO 8601 timestamp (null if not reviewed)",
      "notes": "string (null if no notes)"
    },
    // ... one per source system
  ],
  "last_successful_load": "ISO 8601 timestamp"
}
```

### 7.5 Security Considerations

**Authentication & Authorization:**
- JWT tokens with 8-hour expiration
- Refresh token mechanism (optional for MVP, recommended for Phase 2)
- Role-based access control enforced at API layer and database views
- Password hashing using bcrypt with appropriate work factor (12+ rounds)
- Account lockout after 5 failed login attempts (15-minute lockout)

**Data Security:**
- All API endpoints use HTTPS/TLS 1.2+
- Database connections encrypted
- Sensitive environment variables stored in AWS Secrets Manager
- No PII in logs or error messages
- SQL injection prevention through parameterized queries and ORM
- AI-generated SQL validated and sanitized before execution
- Rate limiting on AI endpoints (10 queries per minute per user)

**Infrastructure Security:**
- Security groups limiting inbound traffic
- Private subnets for database (no public access)
- Bastion host or Systems Manager for admin database access
- Regular security patches and updates
- Secrets rotation policy (90 days)

**Compliance:**
- Audit logs retained for 7 years
- Data lineage tracking from source to dashboard
- Encryption at rest (RDS encryption enabled)
- Backup retention (30 days)

### 7.6 Performance Optimization

**Database:**
- Appropriate indexes on fact table foreign keys and date columns
- Materialized views for common aggregations (refreshed daily)
- Partitioning fact tables by date if volume exceeds 100M rows (future)
- Query timeout limits (30 seconds for API queries)
- Connection pooling (PgBouncer if needed)

**API:**
- Response caching for dashboard data (5-minute cache)
- Pagination for large result sets (default 50 rows, max 100)
- Async API endpoints for long-running operations (ETL triggers, exports)
- Rate limiting to prevent abuse

**Frontend:**
- Code splitting and lazy loading for routes
- Chart data sampling for large datasets (show 1000 points max, aggregate if more)
- Debouncing on filter changes (500ms delay)
- Virtual scrolling for large tables (TanStack Table supports this)
- Service worker for static asset caching (optional)

### 7.7 Testing Strategy

**Unit Tests:**
- Backend: pytest for all service functions, API endpoint logic
- Frontend: Vitest for utility functions, hooks, component logic
- Target: 70%+ code coverage

**Integration Tests:**
- API endpoint tests with test database
- ETL pipeline tests with sample data
- AI query generation tests with known questions

**End-to-End Tests:**
- Playwright or Cypress for critical user flows:
  - Login → View dashboard → Apply filters → Export data
  - Login → Ask AI question → View response
  - Admin login → Trigger ETL job → Verify status

**Performance Tests:**
- Load testing with 30 concurrent users (k6 or Locust)
- Query performance benchmarks (all dashboard queries <3 seconds)

**Security Tests:**
- OWASP ZAP automated scans
- SQL injection testing on AI-generated queries
- Auth/authorization verification (role-based access)

### 7.8 Deployment & DevOps

**CI/CD Pipeline (GitHub Actions):**
1. On pull request:
   - Run linters (ESLint, Black)
   - Run unit tests (frontend: Vitest, backend: pytest)
   - Build and test Docker images for backend/ETL
2. On merge to `main`:
   - Run full test suite
   - Build production Docker images for backend/ETL
   - Push to AWS ECR
   - Deploy backend/ETL to staging ECS
   - Vercel auto-deploys frontend (via Vercel GitHub integration)
3. Manual approval for production deployment

**Environments:**
- **Local:** Native development (Python + Node.js) with RDS dev instance (no Docker)
- **Staging:** AWS ECS Fargate (backend/ETL) + Vercel (frontend preview)
- **Production:** AWS ECS Fargate (backend/ETL) + Vercel (frontend)

**Infrastructure as Code:**
- Terraform or AWS CDK for infrastructure provisioning
- Version controlled infrastructure definitions
- Separate state files for staging and production

**Monitoring & Alerting:**
- CloudWatch dashboards for API latency, error rates, database performance, ECS task health
- Vercel Analytics for frontend performance and errors
- CloudWatch alarms for:
  - API error rate >5%
  - Database CPU >80%
  - ETL job failures
  - Reconciliation failures
  - ECS task failures or restarts
- Microsoft Teams and email notifications for critical alerts

---

## 8. Success Metrics

### 8.1 User Adoption Metrics

**Target:** 90%+ adoption among pilot group (CFO + finance analysts) within 90 days

**Measurement:**
- **Active Users:** % of licensed users who log in at least once per week
  - Week 4: ≥50%
  - Week 8: ≥75%
  - Week 12: ≥90%
- **Feature Usage:** % of users who use each core feature monthly
  - Dashboard views: ≥90%
  - AI analyst: ≥60%
  - Data export: ≥40%
- **User Satisfaction:** NPS (Net Promoter Score) ≥40 by end of pilot

### 8.2 Efficiency Metrics

**Target:** Reduce time to insight by 75%

**Measurement:**
- **Time to Generate Monthly Report:**
  - Baseline: N/A (no formal process exists)
  - Target: Establish capability to generate reports within 1 day of month-end
  - Measure: Track time from month-end to completed executive summary
- **Time Saved Per Finance Analyst:** ≥5 hours per month
  - Survey analysts monthly
  - Track time spent on manual data extraction/reconciliation tasks
- **Ad-hoc Question Response Time:**
  - Baseline: 2-4 hours (manual analysis)
  - Target: <5 minutes (dashboard or AI query)

### 8.3 Data Quality Metrics

**Target:** Maintain data accuracy with automated reconciliation

**Measurement:**
- **ETL Success Rate:** ≥98% of daily ETL jobs complete successfully
- **Reconciliation Pass Rate:** ≥95% of daily reconciliations within 0.1% variance
- **Mean Time to Reconcile Discrepancies:** <4 hours (when discrepancies occur)
- **Data Freshness:** 100% of business days have data updated by 6 AM

### 8.4 AI Performance Metrics

**Target:** ≥80% accuracy for AI financial analyst

**Measurement:**
- **AI Query Accuracy:** % of AI responses that are factually correct
  - Test with 30 predefined financial questions weekly
  - Manual verification by finance analyst
  - Target: ≥80% accuracy rate
- **AI Query Success Rate:** % of questions AI can answer (vs. "I don't know")
  - Target: ≥70% of user questions answered successfully
- **AI Response Time:** Median time to respond to questions
  - Target: ≤10 seconds for 90th percentile
- **User Satisfaction with AI:** % of AI responses rated "helpful" by users
  - Target: ≥75% rated helpful (thumbs up/down rating)

### 8.5 System Performance Metrics

**Target:** Fast, reliable system performance

**Measurement:**
- **Dashboard Load Time:** 95th percentile <3 seconds
- **API Response Time:** 95th percentile <500ms (excluding AI queries)
- **System Uptime:** ≥99% during business hours (6 AM - 8 PM Mon-Fri)
- **Concurrent User Capacity:** Support 30 concurrent users without degradation

### 8.6 Business Impact Metrics

**Target:** Measurable improvement in financial decision-making

**Measurement:**
- **Structured Reporting Established:** Create ≥3 standard financial reports where none formally existed
- **Forecast Accuracy Improvement:** 10% reduction in forecast variance QoQ
  - Baseline: Current forecast variance % (to be measured)
  - Target: 10% relative improvement by end of Q2 post-launch
- **Decision Latency:** Time from "insight needed" to "decision made"
  - Survey executives on decision-making speed improvement
  - Target: 50%+ report faster decision-making
- **Cost Avoidance:** Eliminate X hours of analyst time per month
  - Calculate: (Hours saved × analyst hourly rate) × 12 months
  - Target: $50K+ annual value from time savings

### 8.7 Measurement Approach

**Weekly Metrics Review:**
- Monitor adoption, usage, system performance
- Review in team standup

**Monthly Metrics Review:**
- Full metrics dashboard review
- User feedback sessions
- Identify improvement opportunities

**Quarterly Business Review:**
- Present metrics to stakeholders (CFO, executives)
- Assess ROI and business impact
- Plan Phase 2 enhancements based on data

**Metrics Dashboard:**
- Internal admin dashboard showing all key metrics
- Automated tracking where possible (usage analytics, system performance)
- Manual surveys for user satisfaction and time savings

---

## 9. Open Questions

### 9.1 Business & User Questions

**Q1:** What are the specific 3 Excel reports the CFO wants to replace in MVP?
- **Impact:** Prioritization of dashboard views and features
- **Owner:** CFO
- **Needed By:** Week 2 (requirements finalization)

**Q2:** What is the CFO's typical morning workflow? What are the first 3 things they want to see?
- **Impact:** Dashboard home page design and default views
- **Owner:** CFO
- **Needed By:** Week 6-7 (before UI design finalization)
- **Status:** Interview not yet scheduled

**Q3:** Are there existing Superscapes brand guidelines (colors, fonts, logo) for the UI?
- **Impact:** UI design consistency with company branding
- **Owner:** Marketing/Brand team
- **Needed By:** Week 7 (before frontend development)

**Q4:** What are the specific notification preferences for ETL failures and reconciliation issues?
- **Impact:** Alert configuration and notification routing
- **Owner:** Controller + System Admin
- **Needed By:** Week 10 (before ETL development completion)

**Q5:** Who should receive AI query failure escalations ("Ask a human analyst")?
- **Impact:** Email routing for AI escalation feature
- **Owner:** Finance team lead
- **Needed By:** Week 12 (before AI development completion)

### 9.2 Technical & Integration Questions

**Q6:** What is the preferred method for Sage integration: ODBC or Sage API?
- **Impact:** ETL architecture and connector selection
- **Owner:** IT/Sage administrator
- **Needed By:** Week 1 (infrastructure setup)
- **Blocker:** Cannot start ETL development without this decision

**Q7:** Are Sage API credentials and documentation available? What version of Sage is in use?
- **Impact:** ETL connector compatibility
- **Owner:** IT/Sage administrator
- **Needed By:** Week 1
- **Blocker:** Critical for ETL development

**Q8:** What are the Time Tracking, Equipment/Fleet Management, and Aspire system APIs? Are they available or will file exports be required?
- **Impact:** ETL connector selection and development effort
- **Owner:** IT team
- **Needed By:** Week 2

**Q9:** Does Superscapes have an existing SSO/Active Directory system for authentication?
- **Impact:** Auth implementation approach (integrate vs. build)
- **Owner:** IT Security team
- **Needed By:** Week 3 (before auth development)

**Q10:** What is the AWS account structure and environment setup process?
- **Impact:** Infrastructure provisioning timeline
- **Owner:** DevOps/Cloud team
- **Needed By:** Week 1
- **Blocker:** Cannot deploy development environment without AWS access

### 9.3 Data & Analytics Questions

**Q11:** What is the current Sage chart of accounts structure? Can we get a sample export?
- **Impact:** Dimension model design for `dim_account`
- **Owner:** Controller
- **Needed By:** Week 3 (before dbt model development)

**Q12:** How are jobs/projects tracked in Sage? Is there a job number convention?
- **Impact:** Job dimension design and integration
- **Owner:** Finance Analyst
- **Needed By:** Week 3

**Q13:** What are the specific regional and division structures? Are there plans to reorganize?
- **Impact:** Dimension model design and UI filters
- **Owner:** CFO/Operations team
- **Needed By:** Week 3

**Q14:** What forecasting methods are currently used? Are there specific algorithms preferred?
- **Impact:** AI forecasting implementation approach (deferred to Phase 2, but good to know early)
- **Owner:** Finance Analysts
- **Needed By:** Phase 2 planning (Month 4)

**Q15:** What budget data is available in Sage? Should budget vs. actual variance be included in MVP?
- **Impact:** Dashboard features and data model
- **Owner:** Controller
- **Needed By:** Week 4
- **Note:** Currently not in functional requirements - confirm if needed

### 9.4 Compliance & Security Questions

**Q16:** What are Superscapes' specific accounting audit requirements?
- **Impact:** Audit log design and retention policies
- **Owner:** Controller + External Auditor
- **Needed By:** Week 4 (before audit logging implementation)

**Q17:** Are there any data residency or compliance requirements (SOC 2, GDPR, etc.)?
- **Impact:** AWS region selection and data handling practices
- **Owner:** Legal/Compliance team
- **Needed By:** Week 1 (infrastructure setup)

**Q18:** What is the password policy and account lockout policy?
- **Impact:** Auth implementation details
- **Owner:** IT Security
- **Needed By:** Week 4

**Q19:** Who should have access to raw audit logs? Should logs be exportable?
- **Impact:** Audit log access controls and export functionality
- **Owner:** IT Security + Controller
- **Needed By:** Week 8

### 9.5 Testing & Rollout Questions

**Q20:** Who will participate in User Acceptance Testing (UAT)? What is their availability?
- **Impact:** UAT planning and schedule
- **Owner:** CFO + Project Sponsor
- **Needed By:** Week 14 (2 weeks before UAT)

**Q21:** What is the communication plan for rollout to pilot users?
- **Impact:** Change management and training approach
- **Owner:** Project Manager + CFO
- **Needed By:** Week 16

**Q22:** What training materials are needed? Who will conduct training?
- **Impact:** Documentation and training development effort
- **Owner:** Project Manager
- **Needed By:** Week 15

**Q23:** What is the criteria for declaring MVP successful and proceeding to Phase 2?
- **Impact:** Success definition and go/no-go decision
- **Owner:** CFO + Executive Sponsor
- **Needed By:** Week 8 (mid-project checkpoint)

---

## 10. Appendix

### 10.1 Clarifying Questions and Answers Recap

The following clarifying questions were asked during PRD development:

**Q1:** Should this PRD cover the full MVP (all Phase 1 features together), a specific feature, or multiple separate PRDs?
**A:** The full MVP (all Phase 1 features together)

**Q2:** Should it include detailed UI specifications for all dashboard views and AI interface, or just core features?
**A:** All dashboard views and AI interface

**Q3:** For the AI Financial Analyst feature, how should it handle questions it cannot answer?
**A:*** Suggest alternative questions, explain limitations, and offer human escalation option

**Q4:** Dashboard drill-down behavior - when a user clicks a metric, should it open a modal, navigate to a new page, expand inline, or be configurable?
**A:*** Open a modal with details (provides quick access without losing context)

**Q5:** For data freshness indicator, should it show timestamp only, timestamp + ETL job status, timestamp + alert if stale, or all of the above with different detail levels by role?
**A:** All of the above with different detail levels by role (D)

**Q6:** When reconciliation fails (Sage vs warehouse mismatch), should the system block all queries, show data with warning banner, show last valid data, or role-dependent behavior?
**A:*** Role-dependent: admins see current data with warning banner, regular users see last successfully reconciled data (prevents decisions on potentially incorrect data)

**Q7:** User onboarding - should the PRD include detailed first-time user experience flow, just mention tooltips/help, or defer to separate onboarding PRD?
**A:** Defer to separate onboarding PRD (C)

**Q8:** For forecast accuracy targets, should the PRD specify exact algorithm, multiple algorithm options for testing, or leave algorithm selection to technical implementation?
**A:*** Leave algorithm selection to technical implementation (use best practices for time-series forecasting with seasonal data)

**Q9:** Export functionality - what formats are required?
**A:** Excel + CSV + PDF reports (C)

**Q10:** Should the PRD include detailed API specifications for the backend, or focus on user-facing functionality only?
**A:** Detailed API specs (included in Technical Considerations section)

*Note: Asterisk (*) indicates answer was AI-recommended based on best practices and PRD requirements.*

### 10.2 Related Documentation

- **`0001-srs-superscapes-financial.md`** - Software Requirements Specification (parent document)
- **`0001-tech-stack.md`** - Complete technology stack inventory and architectural decisions
- **`seed.md`** - Original project concept and problem statement

---

## Document Control

**Prepared By:** AI Assistant
**Review Status:** Draft - Pending stakeholder review
**Next Steps:**
1. Review PRD with CFO and project sponsor
2. Resolve open questions (prioritize blockers: Q6, Q7, Q10)
3. Obtain approval to proceed with detailed task planning
4. Generate implementation task list using `03-generate-tasks.md` workflow

**Change Log:**
- 2025-10-25: Initial PRD creation (v1.0)

---

*End of Product Requirements Document*
