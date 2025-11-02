# AI Question Library & Response Format Enhancement

## Project Context

**Parent Project:** Superscapes Financial Intelligence Dashboard (Module 0010)  
**Module:** 0001  
**Type:** Feature Enhancement  
**Status:** Planning - Awaiting Real Data

---

## Problem Statement

The AI Financial Analyst interface in the main dashboard (Module 0010) currently has limited discoverability and basic response formatting:

**Current Limitations:**
1. **Limited Example Questions:** Only 3-4 sample questions displayed as pills below the input box - not enough to help users understand the AI's capabilities
2. **Basic Response Format:** All responses displayed the same way regardless of data type (single value vs. table vs. time series)
3. **SQL Always Visible:** Finance analysts want SQL transparency, but executives find it distracting
4. **No Aggregate Statistics:** Tables show raw data but no totals, averages, or summaries
5. **Static Question List:** Questions hardcoded in frontend - can't be updated without deployment

**Impact:**
- Users don't know what questions to ask
- Responses aren't optimized for the data being displayed
- Interface feels cluttered for non-technical users
- No way to track which questions are most useful

---

## Proposed Solution

Create an intelligent, database-driven question library and response formatting system that adapts to the data being returned.

### Solution Components

**1. Database-Driven Question Library**
- Store example questions in database tables (not hardcoded)
- Organize into categories (Simple Metrics, Trends, Variance Analysis, etc.)
- Track usage analytics (which questions users actually ask)
- Allow administrators to add/edit questions without code deployment

**2. Adaptive Response Formatting**
- Smart formatting based on result shape (rows, columns, data types)
- Different display patterns for different query types
- Automatic aggregates for tabular data
- Auto-chart rendering for time series data

**3. Enhanced UI Interactions**
- Modal-based question browser (not limiting pills)
- Collapsible SQL display (hidden by default)
- Syntax-highlighted SQL with copy button
- Summary statistics tables for multi-row results

---

## Detailed Requirements

### Response Formatting Rules

**Rule 1: Single Row, ≤3 Columns → Narrative Only**
- **Example:** "What was our total revenue last month?" → Returns 1 row: `$8.5M`
- **Display:** Show value in conversational narrative only, no table
- **Rationale:** Simple answers don't need tabular formatting

**Rule 2: Multiple Rows, 1-5 Columns → Table + Narrative + Aggregates**
- **Example:** "Show revenue by region for Q3" → Returns 4 rows with Region, Revenue
- **Display:**
  - Data table with all rows
  - Narrative explanation above/below table
  - Separate aggregate statistics table showing:
    - COUNT (total rows)
    - SUM (for currency columns)
    - AVG (for currency and percentage columns)
    - MIN/MAX (for date ranges if present)
- **Rationale:** Tables need context (narrative) and summary statistics for quick insights

**Rule 3: SQL Hidden by Default, Modal on Click**
- **Display:** "Show SQL" button/icon in response header
- **On Click:** Opens modal with:
  - Syntax-highlighted SQL (formatted, readable)
  - Copy to clipboard button
  - Data sources list (which tables were queried)
  - Optional: "Explain this query" button (AI explains SQL in plain English)
- **Role-Based:** Only show to Finance Analyst and Admin roles (not Executive/Regional Manager)
- **Rationale:** Transparency for technical users, clean interface for business users

**Rule 4: Time Series Data → Auto-Chart**
- **Detection:** If query results contain date/time column + numeric column(s)
- **Display:**
  - Line chart or bar chart (auto-selected based on data density)
  - Data table below chart (collapsible)
  - Narrative explanation
  - Aggregates table
- **Rationale:** Trends are visual - chart tells the story better than table

**Rule 5: Empty Results → Helpful Narrative**
- **Example:** "Which jobs lost money last month?" → 0 rows returned
- **Display:**
  - Positive spin: "Great news! No jobs operated at a loss last month."
  - Context: "All 45 active jobs were profitable."
  - Proactive suggestion: "Would you like to see the top 3 jobs with lowest margins?"
- **Rationale:** Empty table feels like failure; helpful narrative provides value

**Rule 6: Error Handling → Transparent & Helpful**
- **Display:**
  - Which step failed (SQL generation / SQL execution / Result interpretation)
  - User-friendly error message (no technical jargon)
  - Suggested alternative questions that will work
  - "Ask a human analyst" escalation button
- **Example:** "I couldn't find data for 'Q5' - did you mean Q3 2024 or Q1 2025?"
- **Rationale:** Failures should educate and redirect, not frustrate

### Database Schema

**Table 1: ai_question_categories**
```sql
CREATE TABLE core.ai_question_categories (
    category_id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    category_icon VARCHAR(50),              -- Emoji or icon class
    category_description TEXT,
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Seed Categories:**
- Simple Metrics (📊) - Basic KPI questions
- Trends & Comparisons (📈) - Time-based analysis
- Variance Analysis (🔍) - Why did X change?
- Job Performance (💼) - Job-level profitability
- Regional & Division Analysis (🏢) - Geographic comparisons
- Custom/Favorites (⭐) - User-saved questions (Phase 2)

**Table 2: ai_example_questions**
```sql
CREATE TABLE core.ai_example_questions (
    question_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES core.ai_question_categories(category_id),
    question_text TEXT NOT NULL,
    question_description TEXT,              -- Optional tooltip
    expected_response_type VARCHAR(50),     -- 'narrative', 'table', 'chart'
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,          -- Track popularity
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system'
);
```

**Example Questions (20-30 curated, categorized)**

*Simple Metrics:*
- What was our total revenue last month?
- What is our current gross margin percentage?
- How many active jobs do we have right now?

*Trends & Comparisons:*
- Show monthly revenue trend for the last 12 months
- Compare Q3 revenue to Q2
- How has our margin changed quarter over quarter?

*Variance Analysis:*
- Why did our expenses increase in September?
- What drove our margin decline in Q3?
- Which accounts had the biggest changes last month?

*Job Performance:*
- Show top 10 most profitable jobs this year
- Which jobs are over budget and by how much?
- What's the average margin for commercial projects?

*Regional & Division Analysis:*
- Compare revenue across all regions
- Which division has the highest labor costs?
- Show profitability by region for Q3

### UI Components

**Question Library Modal:**
- Searchable categorized question list
- Click question → populates input → auto-submits or waits for user
- Tracks which questions users click (usage_count)
- Responsive: full screen on mobile, centered modal on desktop

**SQL Display Modal:**
- Syntax-highlighted SQL
- Copy button
- Data sources listed
- Optional "Explain this query" feature
- Close returns to conversation

**Aggregate Statistics Table:**
- Appears below data table when multiple rows returned
- Shows: Total, Average, Count, Min/Max as appropriate
- Styled differently (summary appearance vs data table)

---

## Dependencies & Integration

**Depends On:**
- Module 0010 core infrastructure (database, backend API, frontend foundation)
- Real Sage data structure (awaiting client responses to Questions.md)
- Customer master, Manager master, Region mapping data

**Integrates With:**
- AI query endpoint (`POST /ai/query`)
- Dashboard frontend (AI Analyst page)
- Semantic layer (query generation context)

---

## Success Metrics

**Discoverability:**
- 80%+ of users browse example questions on first visit
- Average 3-5 example questions clicked before users write their own

**Response Quality:**
- 90%+ of responses use appropriate formatting (narrative vs table vs chart)
- Users rate responses "helpful" 80%+ of the time

**SQL Transparency:**
- Finance Analysts use "Show SQL" on 50%+ of queries
- Executives rarely/never click "Show SQL" (verify it's not cluttering their experience)

**Question Library Usage:**
- Track top 10 most-clicked questions monthly
- Use insights to refine question library
- User-created questions tracked for Phase 2 feature (save favorites)

---

## Timeline

**Prerequisite:** Await client responses to Questions.md (estimated 1-2 weeks)

**Implementation:**
1. Week 1: Create database tables, seed initial questions, API endpoints
2. Week 2: Build response formatting logic (6 rules), aggregate calculations
3. Week 3: Frontend Modal UI, response rendering components
4. Week 4: Testing, refinement, integrate with Module 0010

**Estimated:** 4 weeks implementation after real data structure confirmed

---

## Open Questions

**Q1:** Should Finance Analysts be able to save their own questions to the library? (Phase 1 or Phase 2?)

**Q2:** Should question library be role-filtered? (Show different examples to CFO vs Regional Manager)

**Q3:** Auto-chart detection - should user be able to toggle between table and chart view?

**Q4:** Aggregate statistics - which calculations are most important? (Total, Average, Count, Min, Max, Median?)

**Q5:** Should responses include a "Download as Excel" button for tables?

**Q6:** How should we handle queries that return >100 rows? (Pagination, limit display + export option?)

---

## Notes

**Real Data Pending:**
- Awaiting client answers to `/poc/database/data/Questions.md`
- Answers will clarify: region structure, manager data, customer data, account categories
- Real data files: `ss_accounts.csv`, `ss_jobs.csv`, `ss_tran_detail.csv`
- May need mock data for managers, customers, regions until client provides master files

**This module enhances Module 0010 but is separable:**
- Can be developed and deployed independently
- Non-breaking addition (doesn't modify existing features)
- Progressive enhancement approach

---

## Next Steps

1. Wait for Questions.md responses from client
2. Review responses and adjust database schema if needed
3. Run discovery interview using `01-discover-requirements.md`
4. Generate SRS for this feature module
5. Generate PRD and task list
6. Implement after Module 0010 core infrastructure is in place
