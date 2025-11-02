# Rule: Generating Project Status Recap Document

## Goal

To guide an AI assistant in creating a client-ready status recap document that summarizes all development modules, their purpose, and current status. This document should be professional, concise, and suitable for emailing to stakeholders.

## Process

1. **Scan Mods Directory:** Review all `/tasks/mods/[n]/` folders
2. **Analyze Each Mod:** For each mod folder, read:
- Executive SRS (if exists): `[n]-srs-executive-*.md`
- Technical SRS (if exists): `[n]-srs-technical-*.md`  
- PRD (if exists): `[n]-prd-*.md`
- Task list (if exists): `[n]-tasks-*.md`
3. **Determine Status:** Based on task list and deployment:
- **Completed**: Tasks complete, code merged to poc-prod and deployed
- **In Progress**: Some tasks complete, active development
- **Proposed**: Only seed/SRS/PRD exist, no implementation started
4. **Generate Recap Document:** Create a single markdown document with executive summaries
5. **Determine Next Number:** Check `/correspondence/` folder for existing recaps, use next number
6. **Save Document:** Save as `/correspondence/Project-Status-Recap-[NN].md` (e.g., Project-Status-Recap-01.md, Project-Status-Recap-02.md)

## Document Structure

### Header
```markdown
# Project Status Recap
**Project:** [Project Name]
**Generated:** [Current Date]
**Report Period:** [Start Date] - [Current Date]

---
```

### Executive Summary
Brief 2-3 paragraph overview of:
- Overall project goals
- Total modules completed vs in progress vs proposed
- Key achievements this period
- Upcoming priorities

### Module Summaries
For each module (sorted by mod number):

```markdown
## Module [N]: [Feature Name]

**Status:** [Completed | In Progress | Proposed]
**Completion:** [X%] ([Y] of [Z] tasks complete)

### What It Does
[2-3 sentence executive summary in business terms, avoid technical jargon]

### Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

### Status Details
[If Completed]: Deployed to [production/staging] on [date]
[If In Progress]: Currently implementing [current task phase], estimated completion [date]
[If Proposed]: Planned for [estimated start date], pending [prerequisites or dependencies]

---
```

### Summary Statistics
```markdown
## Project Metrics

| Status | Count | Modules |
|--------|-------|---------|
| ✅ Completed | [N] | [List of mod numbers] |
| 🔄 In Progress | [N] | [List of mod numbers] |
| 📋 Proposed | [N] | [List of mod numbers] |

**Total Progress:** [X]% of planned features complete
```

## Writing Guidelines

### Tone
- Professional and business-focused
- Client-facing language (avoid technical jargon)
- Positive and progress-oriented
- Honest about challenges without being negative

### Executive Summary Translation
When summarizing from Technical SRS/PRD:
- ❌ "Implemented React Router with BrowserRouter and dynamic routes"
- ✅ "Added navigation system allowing users to access different parts of the application"

- ❌ "Created DateRangeContext with fiscal calendar calculations and UTC timezone handling"
- ✅ "Built flexible date filtering that allows viewing financial data for any time period"

- ❌ "Modified batch_load.py to multiply COGS amounts by -1 during ETL"
- ✅ "Corrected data foundation to ensure accurate financial calculations"

### Status Determination Logic
```
IF all tasks in [n]-tasks-*.md are [x]:
  Status = "Completed"
  Look for git commits or deployment records for completion date

ELSE IF some tasks are [x]:
  Status = "In Progress"
  Calculate completion percentage
  Identify current task/phase from first unchecked task

ELSE IF only seed/SRS/PRD files exist:
  Status = "Proposed"
  Extract estimated timeline from PRD/SRS if present
```

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/correspondence/` directory
- **Filename:** `Project-Status-Recap-[NN].md` (numbered sequentially: 01, 02, 03...)
- **Update Frequency:** Regenerate weekly or after major milestones
- **Numbering:** Check existing files in `/correspondence/` to determine next number

## Usage

User invokes: "Do Step 6" or "Generate status recap"

AI should:
1. Scan all mods (excluding specified ones)
2. Analyze completion status
3. Write executive-friendly summaries
4. Generate the recap document
5. Present summary of findings to user

## Example Module Summary

```markdown
## Module 0002: Global Date Range Picker & Admin Navigation

**Status:** ✅ Completed
**Completion:** 100% (48 of 48 tasks complete)

### What It Does
Enables users to filter all financial data by different time periods (This Month, Last Quarter, Year to Date, etc.) using a simple dropdown menu. The system automatically adjusts all reports and AI queries to show only data within the selected date range.

### Key Features
- 10 preset date range options (This Month, Last Quarter, YTD, etc.)
- Fiscal calendar awareness (respects company's fiscal year start date)
- Persistent selection (remembers choice across sessions)
- Visual date range indicator on all views
- Admin navigation for system management

### Status Details
Deployed to production on October 31, 2025. All features tested and verified. Database synchronized with corrected financial data.

---
```

## Exclusions

- Exclude any mods specified by user (e.g., "except 0010")
- Exclude internal/abandoned mods
- Focus on user-facing functionality

## Final Instructions

1. Be thorough in scanning all mod directories
2. Translate technical details into business value
3. Be honest about status (don't inflate completion)
4. Keep summaries concise (3-4 sentences per mod)
5. Use visual indicators (✅ 🔄 📋) for quick scanning
6. Include realistic completion estimates for in-progress work
