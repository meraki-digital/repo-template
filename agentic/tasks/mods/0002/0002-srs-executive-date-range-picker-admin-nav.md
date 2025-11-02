# Executive Software Requirements Specification
## Global Date Range Picker & Admin UI Navigation

**Project:** Superscapes Financial Intelligence Dashboard
**Module:** 0002 - Date Range Picker & Admin Navigation
**Version:** 1.0
**Date:** October 30, 2025
**Target Delivery:** November 8, 2025

**Related Document:** [Technical SRS](./0002-srs-date-range-picker-admin-nav.md)

---

## 1. Executive Summary

### The Problem

Users of the Superscapes Financial Intelligence Dashboard currently lack a fundamental control mechanism: the ability to easily select which time period they want to analyze. Without this capability, users must either view all historical data at once or manually type date constraints into every AI query—a tedious and error-prone process that reduces system usability and creates friction in daily workflows.

Additionally, the Admin UI for managing AI questions (built in the previous module) exists but is hidden from view, accessible only by directly typing the URL. This creates unnecessary support burden and limits the utility of an already-completed feature.

### The Solution

We will add a **global date range picker** prominently displayed in the application header, offering 10 common time period selections (This Month, Last Month, This Quarter, Last Quarter, This Year, Last Year, Last 12 Months, Last 6 Months, Year To Date, and Inception to Date). The selected date range will automatically filter all dashboard data, charts, and AI query results—eliminating repetitive manual date entry.

We will also add visible navigation to the Admin UI and display clear date range indicators throughout the interface so users always understand what time period their data represents.

Finally, we will correct a data quality issue where certain account types (COGS and Other Operating Expenses) are stored with incorrect signs due to a Sage export formatting quirk, ensuring all future analysis works with clean, properly formatted data.

### Key Benefits

1. **Consistency & Clarity:** Users always know exactly which time period they're viewing through persistent visual indicators
2. **Improved User Experience:** Switch between time periods with a single click instead of typing date constraints repeatedly
3. **Reduced Friction:** AI queries automatically respect the selected date range, eliminating manual date entry for routine analysis
4. **Professional Polish:** The dashboard behaves like modern analytics tools users expect (similar to Google Analytics or Tableau)
5. **Enhanced Accessibility:** Admin features are discoverable and easily accessible without requiring URL knowledge

### Timeline & Milestones

- **Target Completion:** November 8, 2025
- **Estimated Duration:** 9 days (1.8 weeks)
- **Phasing:** Single release with all features
- **Validation:** User feedback and adoption metrics post-launch

---

## 2. Business Requirements

### 2.1 Problem Statement

**Current State Challenges:**

Users have requested better time period controls because the current system creates several pain points:

1. **No Time Context:** When viewing dashboard KPIs or charts, users don't immediately know if they're seeing this month's data, this year's data, or all historical data combined
2. **Repetitive Manual Work:** To analyze a specific quarter, users must type date constraints into every single AI query (e.g., "Show revenue for Q3 2025")
3. **Hidden Administrative Features:** The AI Question Library management interface exists but requires users to know and type `/admin/ai-questions` directly into the URL bar
4. **Inconsistent Experience:** The dashboard feels less polished compared to commercial analytics tools that offer intuitive date filtering
5. **Data Quality Issue:** COGS and Other Operating Expense amounts are stored as negative values due to how Sage formatted its export reports—this violates standard database practices and requires special handling in every query

**Impact:**

While this doesn't directly save money, it creates user frustration and reduces the perceived professionalism of the system. Users expect modern dashboard applications to have time period controls—the absence of this capability signals an incomplete product.

The data quality issue is more subtle but important: storing COGS and operating expenses as negative numbers is a byproduct of how Sage formatted its export reports for presentation purposes. Standard database practice stores all amounts as positive values, with the account type determining whether they're additive (Revenue) or subtractive (COGS, Expenses) in calculations. The current approach requires special handling in every query, complicates integration with business intelligence tools, and creates a maintenance burden.

### 2.2 Data Quality: The Sage Export Issue

**Background:**

The source data for this system comes from Sage accounting software exports. Sage does not provide direct database access, so we export reports that have already been formatted for presentation. In Sage's Profit & Loss reports, expenses are displayed as negative numbers (e.g., -$50,000 for COGS) to make the math visually clear: $100,000 revenue - $50,000 expenses = $50,000 profit.

However, Sage's internal database almost certainly stores all amounts as positive values—the negative sign is applied during report formatting. When we imported these pre-formatted reports, we inadvertently captured the presentation layer (negative expenses) rather than the data layer (positive amounts).

**The Problem:**

Storing COGS and Other Operating Expenses as negative values creates several issues:

1. **Non-Standard Data Model:** Industry-standard databases store all transaction amounts as positive numbers. Account type (Revenue, COGS, Operating Expense) determines whether amounts add or subtract in calculations.
2. **Query Complexity:** Every query must account for negative signs—"Show me the highest expense" returns incorrect results without special handling (ABS() functions or reversed sorting).
3. **BI Tool Incompatibility:** If we later connect Tableau, Power BI, or Excel pivot tables, they'll struggle with negative expense amounts without custom configurations.
4. **Maintenance Burden:** Every new report or analysis feature must remember to handle the sign quirk, increasing development time and error risk.

**The Solution:**

We will transform the data to align with industry standards:

1. **One-Time Correction:** Run a utility script to multiply all existing COGS and Other Operating Expense amounts by -1 (converting -$50,000 to $50,000)
2. **Ongoing Transformation:** Update data loading scripts to automatically apply this correction to all future imports
3. **Standard Calculations:** After transformation, profit = Revenue - COGS - OpEx works naturally with all positive numbers

**Business Benefits:**

- **Future-Proof:** Any tool or integration will work with standard data conventions
- **Simpler Maintenance:** No special handling required in queries or reports
- **Reduced Errors:** Eliminates a common source of calculation mistakes
- **Professional Standard:** Aligns with how enterprise financial systems store data

This is a foundational fix that ensures the system behaves correctly as it scales and integrates with other tools.

### 2.3 Goals & Objectives

**Primary Objectives:**

1. **Add Time Period Control:** Enable users to select from 10 predefined date ranges in ≤2 clicks
2. **Ensure Data Clarity:** Users always understand what time period they're viewing through clear visual indicators
3. **Streamline Workflows:** Eliminate repetitive date typing in AI queries for common time periods
4. **Improve Discoverability:** Make Admin UI navigation obvious and accessible
5. **Fix Data Foundation:** Correct COGS and Other Operating Expense sign conventions to align with industry standards

**Success Criteria:**

- Users can switch between date ranges and see updated data within 2 seconds
- All dashboards, charts, and AI responses clearly display the active date range
- Admin UI is accessible without documentation or support requests
- User feedback confirms improved clarity and ease of use
- All financial data stored with correct sign conventions (positive amounts)

### 2.4 Target Users

**Primary Users:**

- **CFO & Finance Team:** Need to analyze data for specific fiscal periods (quarterly reviews, year-end summaries, board presentations)
- **Regional Managers:** Want to compare "This Month vs Last Month" performance quickly without manual date entry
- **Executives:** Require Year-To-Date and trailing 12-month views for strategic decision-making

**Secondary Users:**

- **System Administrators:** Need easy access to AI Question Library to manage canned questions

**User Characteristics:**

- High financial expertise, low to medium technical expertise
- Expect consumer-app simplicity (similar to Google Analytics date pickers)
- Value consistency and clarity over advanced customization

### 2.5 Success Metrics

**Adoption & Usage:**

- Track frequency of date range changes (indicates active use)
- Monitor AI query patterns (fewer manual date specifications = success)
- Measure Admin UI access rates (confirms discoverability)

**User Satisfaction:**

- Positive user feedback on ease of use and clarity
- Reduced support requests about "how do I filter by time period"
- No reports of data misinterpretation due to unclear date context

**Performance:**

- Dashboard data loads in <2 seconds after date range change
- No degradation in system responsiveness

---

## 3. Solution Overview

### 3.1 Core Capabilities

Users will be able to:

1. **Select Time Periods:** Choose from 10 common date ranges via a dropdown in the application header
2. **Automatic Data Filtering:** All dashboards, charts, and AI queries automatically reflect the selected time period
3. **Persistent Selection:** The chosen date range persists across browser sessions (saved locally)
4. **Override When Needed:** Type specific date references in AI queries (e.g., "FY2024") to override the global selection
5. **Navigate to Admin:** Click a visible Admin button to access the AI Question Library management interface
6. **Understand Data Context:** See clear indicators showing which date range is active on all result areas

### 3.2 User Experience

**Typical User Journey:**

1. User opens the dashboard (default view: Year To Date)
2. User sees a date range picker in the top-right corner showing "YTD"
3. User clicks the picker and selects "This Quarter" from a dropdown
4. Dashboard KPIs, charts, and all data refresh to show Q4 2025 data only
5. Clear indicators on each KPI card and chart confirm: "This Quarter (Oct 1 - Dec 31, 2025)"
6. User clicks an example question pill: "Show revenue by month"
7. AI returns monthly revenue for Q4 2025 only, with a banner confirming the date range
8. User closes the browser and returns the next day—"This Quarter" is still selected
9. If needed, user types "What was revenue in FY2024?" and the system intelligently uses FY2024 dates instead, with a clear override warning

**Administrative Journey:**

1. Admin notices the Admin button (⚙️) in the header
2. Clicks it and navigates to the AI Question Library management page
3. Manages canned questions and categories without needing to remember URLs

### 3.3 Key Features

**F1: Global Date Range Selector**
- Dropdown with 10 predefined options (This/Last Month, This/Last Quarter, This/Last Year, Last 6/12 Months, YTD, Inception)
- Displayed in application header, visible on all pages
- Selection persists across sessions

**F2: Automatic Data Filtering**
- Selected date range applies to all dashboards, charts, and AI queries
- No manual date entry required for routine analysis
- System intelligently detects and respects query-specific date overrides

**F3: Clear Date Range Indicators**
- Every KPI card, chart, and AI response displays the active date range
- Override warnings appear when user-specified dates differ from global selection
- Mobile-responsive formatting (full on desktop, compact on mobile)

**F4: Admin UI Navigation**
- Visible Admin button in header
- One-click access to AI Question Library management
- Tooltip on hover for discoverability

**F5: Updated Example Questions**
- 4 new example question pills tailored to common financial queries
- Questions automatically work with selected date range
- "Show revenue by month", "Show expense by month", "Show top 5 projects by revenue/profitability"

**F6: Data Quality Correction (Sage Export Transformation)**
- Corrects a data formatting issue inherited from Sage accounting system exports
- One-time utility to fix existing COGS and Other Operating Expense amounts (currently stored as negative values)
- Updates data loading processes to automatically correct future imports
- Ensures all financial calculations work with industry-standard data conventions (all amounts stored as positive values)
- Eliminates the need for special handling in queries and reports

**F7: System Configuration Management**
- Database-stored fiscal year settings (currently Jan-Dec, future-proofed for changes)
- Automatic tracking of data inception date
- Flexible configuration without code deployment

---

## 4. Scope & Boundaries

### 4.1 What's Included

**In Scope for November 8 Delivery:**

✅ Global date range picker with 10 predefined options

✅ Persistent selection across browser sessions

✅ Automatic filtering of all dashboard data, charts, and AI queries

✅ Query-level override detection (user can specify "FY2024" and system adapts)

✅ Admin UI navigation button

✅ Date range indicators on all result areas (KPIs, charts, AI responses)

✅ One-time data correction utility for COGS/OpEx signs

✅ Updated data loaders to maintain clean data

✅ System variables database table for configuration storage

✅ Updated example question pills (4 new financial queries)

### 4.2 What's Not Included

**Explicitly Out of Scope:**

❌ Custom date range picker (user-defined start/end dates)

❌ Date range comparison mode ("This Quarter vs Last Quarter" side-by-side)

❌ Saved/favorite date ranges per user

❌ Role-based Admin UI visibility (everyone sees Admin button in POC)

❌ Fiscal year configuration UI (requires database edit for now)

❌ Multi-user date range preferences (each user maintains their own via browser storage)

### 4.3 Future Considerations

**Potential Next Phase Enhancements:**

- Custom date range picker (user selects specific start/end dates)
- Comparative analysis (show this period vs prior period side-by-side)
- Saved date range presets per user profile
- Fiscal year configuration admin interface
- Date range-specific bookmarks or shareable links
- Export data with date range in filename

These are not committed for November 8 delivery but represent logical evolution of the feature based on user adoption and feedback.

---

## 5. Project Approach

### 5.1 Development Phases

**Single Phase Delivery** (all features together):

- **Phase 1 (Days 1-3):** Backend infrastructure
  - Database schema (system_variables table)
  - API endpoints for system configuration
  - Data quality correction (one-time utility + data loader updates)
  - Date filtering logic in dashboard and AI APIs

- **Phase 2 (Days 4-6):** Frontend components
  - Date range picker UI component
  - Date range state management (React Context)
  - Date calculation utilities
  - Admin navigation button
  - Date range indicators on all result areas

- **Phase 3 (Days 7-9):** Integration, testing, and polish
  - Connect all UI components to backend APIs
  - Comprehensive testing (all 10 date ranges, override scenarios)
  - Performance validation (<2s dashboard loads)
  - Visual polish and responsive design
  - User acceptance testing

### 5.2 Timeline & Milestones

- **Start Date:** October 31, 2025 (estimated)
- **Target Completion:** November 8, 2025
- **Duration:** 9 business days (1.8 weeks)

**Key Milestones:**

- Day 3: Backend APIs functional, data quality corrected
- Day 6: All UI components built and styled
- Day 8: Full integration complete, testing underway
- Day 9: Polish, deployment, user acceptance

### 5.3 Key Assumptions

1. **User Adoption:** Users will naturally discover and use the date picker without extensive training
2. **Fiscal Calendar:** Jan-Dec fiscal year is acceptable for initial release (can be changed later in database)
3. **Browser Compatibility:** Users have modern browsers with localStorage support
4. **Data Volume:** Current POC data (~3 months) and future MVP data (3+ years) will perform adequately with date filtering
5. **Override Detection:** Keyword-based detection (FY, Q1, Period, etc.) will catch most user-specified date references
6. **Performance:** <2 second dashboard reload is achievable with current database indices and query optimization

### 5.4 Risks & Mitigations

**Risk: Users might misinterpret data if they don't notice the active date range**

- **Likelihood:** Low to Medium
- **Impact:** Medium (incorrect business decisions based on wrong data context)
- **Mitigation:**
  - Clear, persistent date range indicators on every KPI, chart, and AI response
  - Visual distinction for override scenarios (amber warning badge)
  - Default to "Year To Date" (most commonly useful view)
  - User testing before launch to validate clarity

**Risk: Users might ignore the feature and continue typing dates manually**

- **Likelihood:** Low
- **Impact:** Low (feature doesn't provide value but doesn't harm)
- **Mitigation:**
  - Feature is opt-in for AI queries (user can still type dates)
  - Spec explicitly allows user-typed dates to override global selection
  - Example question pills demonstrate the feature's convenience
  - Monitor usage metrics to understand adoption patterns

**Risk: Training/adoption concerns**

- **Likelihood:** Very Low
- **Impact:** Low
- **Mitigation:**
  - Date pickers are a familiar UI pattern (users have seen them in Google Analytics, Excel, etc.)
  - Minimal training required—interface is self-explanatory
  - Tooltips and clear labels guide discovery
  - Default selection ("Year To Date") provides immediate value

**Risk: November 8 deadline cannot be met**

- **Likelihood:** Low
- **Impact:** Medium (delays user benefit and polish improvements)
- **Mitigation:**
  - 9-day estimate includes buffer for unexpected issues
  - Scope is clearly defined (no feature creep)
  - Backend-first approach allows early risk identification
  - Testing is integrated throughout, not left to the end

---

## 6. Appendix

### 6.1 Glossary

**Date Range Picker:** A dropdown UI component that allows users to select from predefined time periods

**Global Date Range:** A user-selected time period that applies to all queries and visualizations across the application

**Query Override:** When a user's AI query explicitly mentions a fiscal year or period (e.g., "FY2024"), overriding the global date range selection

**System Variables:** Database-stored configuration values that can change without code deployment (e.g., fiscal year start month, data inception date)

**Fiscal Year:** The 12-month period used for financial reporting (currently Jan-Dec for Superscapes)

**Fiscal Quarter:** One of four 3-month periods within a fiscal year (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec)

**Inception Date:** The earliest transaction date in the database, used for "Inception to Date" date range option

**COGS:** Cost of Goods Sold—direct costs attributable to production

**Other Operating Expense:** Indirect business expenses not directly tied to production

### 6.2 Related Documents

- **Technical SRS:** [0002-srs-date-range-picker-admin-nav.md](./0002-srs-date-range-picker-admin-nav.md) - Comprehensive technical specifications for development team
- **Product Requirements Document:** To be generated in Step 2 based on Technical SRS
- **Task List:** To be generated in Step 3 for implementation tracking

### 6.3 Discovery Interview Summary

**Question 1: Business Impact & ROI**
- **Response:** "Ensures consistency. Makes it more user friendly. Doesn't save money, just adds polish. No specific event."
- **Interpretation:** This is a quality-of-life improvement focused on user experience and professional polish, not cost reduction.

**Question 2: User Success Metrics**
- **Response:** "Users have requested this. When this is functioning properly, their positive feedback will be the success signal."
- **Interpretation:** Success is measured by user satisfaction and feedback, not quantitative KPIs. Users have explicitly asked for this feature.

**Question 3: Stakeholder Benefits**
- **Response:** "It just makes the system more clear and easier to use."
- **Interpretation:** Universal benefit across all user types—clarity and ease of use improvements.

**Question 4A: Business Risks**
- **Response:** "Small, acceptable risk"
- **Interpretation:** Risk of data misinterpretation is acknowledged but considered manageable with proper UI indicators.

**Question 4B: Training/Adoption Concerns**
- **Response:** "Minimal"
- **Interpretation:** Date pickers are familiar UI patterns; minimal training burden expected.

**Question 4C: Users Ignoring Feature**
- **Response:** "Spec is that user entered dates will override"
- **Interpretation:** Feature is designed to coexist with manual date entry, not replace it entirely. Users retain full control.

**Question 5A: Next Logical Enhancement**
- **Response:** "Unclear as of now"
- **Interpretation:** Focus is on delivering this feature well; future enhancements will be driven by user feedback.

**Question 5B: Stepping Stone to Something Bigger**
- **Response:** "All 3 are possible future enhancements" (custom ranges, saved presets, comparative analysis)
- **Interpretation:** Current feature is foundational; natural evolution paths exist but aren't committed.

**Question 6: Timeline & Deadlines**
- **Response:** "Deadline is November 8"
- **Interpretation:** Clear business deadline of November 8, 2025 (9 days from project start).

---

**Document Control:**
- **Author:** AI Assistant (based on user discovery interview)
- **Reviewer:** [Project Stakeholder]
- **Approval Date:** [Pending Review]
- **Next Review:** Post-implementation (after November 8, 2025)

**End of Executive SRS**
