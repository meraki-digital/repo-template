# Technical Software Requirements Specification (SRS)
## Mod 0003: Admin CRUD Interface for Supporting Tables

**Version:** 1.0
**Date:** October 31, 2025
**Project:** Superscapes Financial Intelligence Dashboard
**Module:** 0003 - Admin Data Management Interface

---

## 1. Introduction

### 1.1 Purpose

This Technical Software Requirements Specification (SRS) defines the detailed technical requirements for building a comprehensive CRUD (Create, Read, Update, Delete) interface for seven supporting tables in the Superscapes Financial Intelligence Dashboard. This document serves as the foundation for creating the Product Requirements Document (PRD) and subsequent implementation tasks.

### 1.2 Scope

This module will enhance the existing POC/MVP by adding a complete admin interface for managing reference data.

**In Scope:**
- Frontend CRUD interfaces for 7 tables (5 full CRUD, 2 view/edit only)
- Backend API routes for all tables (following Mod 0001 patterns)
- Form validation and error handling
- Search, filter, sort, and pagination
- Export to CSV/Excel functionality
- Delete confirmation modals with referential integrity checks
- Responsive design optimized for desktop (1024px+)

**Out of Scope:**
- User authentication/authorization (addressed in future modules)
- Audit logging/change history
- Bulk import from CSV/Excel
- Advanced analytics or reporting
- Real-time collaboration features
- Mobile-optimized UI (functional but not optimized)

### 1.3 Definitions, Acronyms, and Abbreviations

- **CRUD**: Create, Read, Update, Delete operations
- **POC**: Proof of Concept
- **MVP**: Minimum Viable Product
- **UI**: User Interface
- **API**: Application Programming Interface
- **FK**: Foreign Key
- **PK**: Primary Key
- **ORM**: Object-Relational Mapping (SQLAlchemy)
- **Referential Integrity**: Ensuring FK relationships remain valid
- **Soft Delete**: Marking record inactive rather than removing from database

### 1.4 References

- Mod 0001: AI Question Library Implementation (`/tasks/mods/0001/`)
- Mod 0002: Date Range Picker & Admin Navigation (`/tasks/mods/0002/`)
- Executive SRS: `0003-srs-executive-admin-crud-interface.md`
- Database Schema: `/poc/database/schema.sql`
- Existing Backend Models: `/poc/backend/models/`
- Existing API Routes: `/poc/backend/api_routes/`

---

## 2. Overall Description

### 2.1 Product Perspective

This module extends the existing admin section initiated in Mod 0002 (Admin Navigation Button). The admin interface currently leads to a placeholder page. This module will:

1. Replace the placeholder with a functional multi-table admin interface
2. Provide self-service data management for 7 critical supporting tables
3. Follow established patterns from Mod 0001 (AI Questions API) for consistency
4. Integrate seamlessly with existing dashboard navigation and design system

**System Context:**

```
┌─────────────────────────────────────────────────────┐
│  Superscapes Financial Intelligence Dashboard        │
│                                                      │
│  ┌────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │            │  │              │  │            │  │
│  │ Dashboard  │  │   Ask AI     │  │   Admin    │◄─── This Module
│  │   (KPIs)   │  │   (Queries)  │  │  (Data     │  │
│  │            │  │              │  │  Management)  │  │
│  └────────────┘  └──────────────┘  └────────────┘  │
│         │               │                  │        │
│         └───────────────┼──────────────────┘        │
│                         │                           │
│              ┌──────────▼──────────┐                │
│              │   Backend API        │                │
│              │   (FastAPI)          │                │
│              └──────────┬──────────┘                │
│                         │                           │
│              ┌──────────▼──────────┐                │
│              │   PostgreSQL RDS     │                │
│              │   (7 Admin Tables)   │                │
│              └─────────────────────┘                │
└─────────────────────────────────────────────────────┘
```

### 2.2 Product Functions

**F1: Multi-Table Navigation**
- Tabbed interface for switching between 7 data tables
- Breadcrumb navigation showing current location
- Persistent state (remembers last-viewed table)

**F2: Data Display & Interaction**
- Sortable data tables with column headers
- Text search across all columns
- Column-specific filters (dropdown for categoricals, text for strings)
- Pagination (configurable page size: 50, 100, 200 records)
- Row actions: View, Edit, Delete (where applicable)

**F3: Record Creation**
- "Add New" button opens form modal or dedicated page
- Form fields match database schema
- Dropdown selects for foreign keys (display names, not IDs)
- Required field indicators (*)
- Inline validation with error messages
- Cancel and Save buttons

**F4: Record Editing**
- Edit button/icon on each table row
- Form pre-populated with current values
- Same validation as create
- Optimistic UI updates (immediate feedback)

**F5: Record Deletion**
- Delete button/icon on each row
- Confirmation modal: "Are you sure you want to delete [Record Name]?"
- Referential integrity check:
  - If record is referenced: Block with error message
  - If record is not referenced: Allow deletion
- For AI Questions: Option to soft delete (mark inactive) instead of hard delete

**F6: Data Export**
- "Export" button on each table view
- Export current filtered/sorted view to CSV or Excel
- Include all columns with properly formatted values
- Filename pattern: `[table_name]_export_[YYYY-MM-DD].csv`

**F7: Metadata Display**
- Show created_at, updated_at timestamps where available
- Display usage_count and last_used_at for AI questions
- Show updated_by for system_variables

### 2.3 User Characteristics

**Primary Users:**
- **Tech-Savvy Administrators:** Comfortable with web applications, understand data management concepts
- **No Auth:** All users with access are considered administrators (no role-based permissions)

**Technical Proficiency:**
- Can navigate multi-tab interfaces
- Understand relational data (e.g., "This manager is assigned to this region")
- Comfortable with form validation feedback

**Usage Patterns:**
- Primarily desktop (1024px+ screens)
- Occasional edits (not high-frequency data entry)
- Expect professional, polished UI matching dashboard standards

### 2.4 Constraints

**Technical Constraints:**
- Must work with existing React 19 + TypeScript frontend
- Must integrate with FastAPI + SQLAlchemy backend
- PostgreSQL database on AWS RDS
- No breaking changes to existing APIs or database schema
- Must follow existing Tailwind CSS design system
- No new stack additions without approval

**Business Constraints:**
- Accounts and Jobs tables: View and Edit only (no Create/Delete)
- Must prevent deletion of records referenced by other tables
- Must maintain data integrity (unique constraints, foreign keys, required fields)

**UI/UX Constraints:**
- Desktop-optimized (mobile functional but not prioritized)
- Consistent with existing dashboard design language
- Accessible (WCAG 2.1 AA preferred)

### 2.5 Assumptions and Dependencies

**Assumptions:**
- Backend API patterns from Mod 0001 can be replicated for other tables
- Users understand basic data management concepts
- Tables contain < 10,000 records (pagination handles larger sets)
- No concurrent editing conflicts (single-user admin workflows)

**Dependencies:**
- React 19 + TypeScript frontend framework
- FastAPI backend with SQLAlchemy ORM
- PostgreSQL database with existing schema
- Existing authentication (or lack thereof) continues
- Tailwind CSS 4.x for styling
- Headless UI for accessible components
- React Hook Form for form management
- Axios for HTTP requests
- TanStack Table for data tables (if not already in use, consider adding)

---

## 3. System Features

### 3.1 Feature: AI Example Questions Management

**Description:**
Full CRUD interface for managing AI example questions that appear below the "Ask AI" input.

**Functional Requirements:**

**FR-1.1**: The interface SHALL display a data table with columns:
- Question Text
- Category (name, not ID)
- Description
- Response Type
- Sort Order
- Is Active
- Usage Count
- Last Used At
- Created At
- Actions (Edit, Delete)

**FR-1.2**: The table SHALL support:
- Sorting by any column (click header to toggle asc/desc)
- Text search across question_text and description
- Filter by category (dropdown)
- Filter by is_active (All, Active, Inactive)
- Pagination (50 records per page default, adjustable to 100 or 200)

**FR-1.3**: The "Add New Question" button SHALL open a form with fields:
- Question Text (required, text area, max 500 chars)
- Category (required, dropdown of active categories)
- Description (optional, text area, max 1000 chars)
- Expected Response Type (required, dropdown: Table, Chart, Text, Mixed)
- Sort Order (required, number input, default to max+1)
- Is Active (required, checkbox, default true)

**FR-1.4**: Form validation SHALL enforce:
- Required fields must be filled
- Question text must be unique (check against existing)
- Sort order must be positive integer
- Category must exist in ai_question_categories

**FR-1.5**: The Edit form SHALL pre-populate all fields with current values

**FR-1.6**: Delete operation SHALL:
- Show confirmation modal: "Delete question: [question_text]?"
- Soft delete option: "Mark Inactive Instead?" checkbox
- If soft delete: Set is_active=false, preserve record
- If hard delete: Remove record from database
- No referential integrity checks needed (questions aren't referenced)

**FR-1.7**: Export SHALL generate CSV with all columns, respecting current filters/sort

**API Endpoints (Existing from Mod 0001):**
- `GET /api/admin/ai-questions` - List all questions
- `POST /api/admin/ai-questions` - Create new question
- `GET /api/admin/ai-questions/{id}` - Get single question
- `PUT /api/admin/ai-questions/{id}` - Update question
- `DELETE /api/admin/ai-questions/{id}` - Delete question

---

### 3.2 Feature: AI Question Categories Management

**Description:**
Full CRUD interface for managing question categories that organize AI example questions.

**Functional Requirements:**

**FR-2.1**: The interface SHALL display a data table with columns:
- Category Code (unique identifier)
- Category Name
- Icon (emoji or icon class)
- Description
- Sort Order
- Is Active
- Question Count (calculated: how many questions in this category)
- Created At
- Actions (Edit, Delete)

**FR-2.2**: The table SHALL support:
- Sorting by any column
- Text search across code, name, description
- Filter by is_active
- Pagination (50 per page default)

**FR-2.3**: The "Add New Category" form SHALL include:
- Category Code (required, unique, alphanumeric+underscore, max 50 chars)
- Category Name (required, max 100 chars)
- Icon (required, single emoji or icon class, max 10 chars)
- Description (optional, text area, max 500 chars)
- Sort Order (required, number, default to max+1)
- Is Active (required, checkbox, default true)

**FR-2.4**: Form validation SHALL enforce:
- Category code must be unique
- Category code must match pattern: `^[a-zA-Z0-9_]+$`
- Category name must be unique
- Sort order must be positive integer

**FR-2.5**: Delete operation SHALL:
- Check if category has questions (COUNT query)
- If has questions: Block deletion with message: "Cannot delete. This category contains [X] questions. Please reassign or delete them first."
- If no questions: Allow deletion after confirmation

**FR-2.6**: Export SHALL include question_count as calculated column

**API Endpoints (New):**
- `GET /api/admin/ai-question-categories` - List all categories with question counts
- `POST /api/admin/ai-question-categories` - Create new category
- `GET /api/admin/ai-question-categories/{id}` - Get single category
- `PUT /api/admin/ai-question-categories/{id}` - Update category
- `DELETE /api/admin/ai-question-categories/{id}` - Delete category (with ref check)

---

### 3.3 Feature: Managers Management

**Description:**
Full CRUD interface for managing regional managers who oversee projects.

**Functional Requirements:**

**FR-3.1**: The interface SHALL display a data table with columns:
- Manager ID
- Manager Name
- Region (name, not ID)
- Job Count (calculated: how many jobs assigned to this manager)
- Actions (Edit, Delete)

**FR-3.2**: The table SHALL support:
- Sorting by any column
- Text search on manager name
- Filter by region (dropdown)
- Pagination

**FR-3.3**: The "Add New Manager" form SHALL include:
- Manager ID (required, integer, must not exist)
- Manager Name (required, max 100 chars)
- Region (required, dropdown of active regions)

**FR-3.4**: Form validation SHALL enforce:
- Manager ID must be unique
- Manager ID must be positive integer
- Manager name required
- Region must exist in regions table

**FR-3.5**: Delete operation SHALL:
- Check if manager has jobs assigned (COUNT WHERE manager_id = X)
- If has jobs: Block with message: "Cannot delete. This manager is assigned to [X] jobs. Please reassign them first."
- If no jobs: Allow deletion after confirmation

**FR-3.6**: Export SHALL include job_count

**API Endpoints (New):**
- `GET /api/admin/managers` - List all managers with job counts
- `POST /api/admin/managers` - Create new manager
- `GET /api/admin/managers/{id}` - Get single manager
- `PUT /api/admin/managers/{id}` - Update manager
- `DELETE /api/admin/managers/{id}` - Delete manager (with ref check)

---

### 3.4 Feature: Regions Management

**Description:**
Full CRUD interface for managing geographic regions.

**Functional Requirements:**

**FR-4.1**: The interface SHALL display a data table with columns:
- Region ID
- Region Code (unique identifier)
- Region Name
- Manager Count (how many managers in this region)
- Job Count (how many jobs in this region, via managers)
- Actions (Edit, Delete)

**FR-4.2**: The table SHALL support:
- Sorting by any column
- Text search on code and name
- Pagination

**FR-4.3**: The "Add New Region" form SHALL include:
- Region Code (required, unique, alphanumeric, max 20 chars)
- Region Name (required, max 100 chars)

**FR-4.4**: Form validation SHALL enforce:
- Region code must be unique
- Region code must match pattern: `^[A-Z0-9_-]+$` (uppercase, numbers, underscore, hyphen)
- Region name required

**FR-4.5**: Delete operation SHALL:
- Check if region has managers (COUNT WHERE region_id = X)
- If has managers: Block with message: "Cannot delete. This region has [X] managers. Please reassign them first."
- If no managers: Allow deletion after confirmation

**FR-4.6**: Export SHALL include manager_count and job_count

**API Endpoints (New):**
- `GET /api/admin/regions` - List all regions with counts
- `POST /api/admin/regions` - Create new region
- `GET /api/admin/regions/{id}` - Get single region
- `PUT /api/admin/regions/{id}` - Update region
- `DELETE /api/admin/regions/{id}` - Delete region (with ref check)

---

### 3.5 Feature: Accounts Management (View & Edit Only)

**Description:**
View and edit interface for chart of accounts. No create or delete to protect transaction integrity.

**Functional Requirements:**

**FR-5.1**: The interface SHALL display a data table with columns:
- Account Number (unique identifier)
- Account Name
- Account Type (Asset, Liability, Equity, Revenue, Expense, COGS, Other Operating Expense)
- Normal Balance (Debit, Credit)
- Category
- Subcategory
- Transaction Count (how many transactions use this account)
- Actions (Edit only, no Delete)

**FR-5.2**: The table SHALL support:
- Sorting by any column
- Text search on number, name, category, subcategory
- Filter by account_type (dropdown)
- Filter by normal_balance (dropdown)
- Pagination (100 per page default due to larger dataset)

**FR-5.3**: There SHALL be NO "Add New Account" button

**FR-5.4**: The Edit form SHALL allow modification of:
- Account Name (required, max 255 chars)
- Account Type (dropdown, required)
- Normal Balance (dropdown: Debit or Credit, required)
- Category (optional, max 100 chars)
- Subcategory (optional, max 100 chars)

**FR-5.5**: The Edit form SHALL NOT allow modification of:
- Account Number (read-only, displayed but disabled)
- Account ID (internal, not shown)

**FR-5.6**: There SHALL be NO delete functionality (no delete button/icon)

**FR-5.7**: Export SHALL include transaction_count

**API Endpoints (New):**
- `GET /api/admin/accounts` - List all accounts with transaction counts
- `GET /api/admin/accounts/{id}` - Get single account
- `PUT /api/admin/accounts/{id}` - Update account (name, type, balance, category, subcategory only)

---

### 3.6 Feature: Jobs Management (View & Edit Only)

**Description:**
View and edit interface for jobs/projects. No create or delete to protect transaction integrity.

**Functional Requirements:**

**FR-6.1**: The interface SHALL display a data table with columns:
- Job ID
- Job Name
- Customer ID
- Class (Commercial, Maintenance, Multi Family, Residential, Commercial Landscape)
- Status (Active, Completed, In Progress, Unknown)
- Manager (name, not ID)
- Parent Job (job_name, not ID, if applicable)
- Category
- Transaction Count
- Actions (Edit only, no Delete)

**FR-6.2**: The table SHALL support:
- Sorting by any column
- Text search on job_id, job_name, customer_id
- Filter by class (dropdown)
- Filter by status (dropdown)
- Filter by manager (dropdown)
- Pagination (100 per page)

**FR-6.3**: There SHALL be NO "Add New Job" button

**FR-6.4**: The Edit form SHALL allow modification of:
- Job Name (optional, max 255 chars)
- Customer ID (optional, max 50 chars)
- Class (dropdown: Commercial, Maintenance, Multi Family, Residential, Commercial Landscape)
- Status (dropdown: Active, Completed, In Progress, Unknown)
- Manager (dropdown of active managers, nullable)
- Parent Job (dropdown of other jobs, nullable, cannot select self)
- Category (optional, max 50 chars)

**FR-6.5**: The Edit form SHALL NOT allow modification of:
- Job ID (read-only, primary key)

**FR-6.6**: There SHALL be NO delete functionality

**FR-6.7**: Export SHALL include transaction_count and manager_name

**API Endpoints (New):**
- `GET /api/admin/jobs` - List all jobs with transaction counts and related names
- `GET /api/admin/jobs/{id}` - Get single job
- `PUT /api/admin/jobs/{id}` - Update job (all fields except job_id)

---

### 3.7 Feature: System Variables Management

**Description:**
Full CRUD interface for system configuration variables (fiscal year settings, inception date, etc.).

**Functional Requirements:**

**FR-7.1**: The interface SHALL display a data table with columns:
- Key (unique identifier)
- Value
- Description
- Updated At
- Updated By
- Actions (Edit, Delete)

**FR-7.2**: The table SHALL support:
- Sorting by any column
- Text search on key, value, description
- Pagination

**FR-7.3**: The "Add New Variable" form SHALL include:
- Key (required, unique, alphanumeric+underscore, max 100 chars)
- Value (required, text area for flexibility, max 10,000 chars)
- Description (optional, text area, max 500 chars)

**FR-7.4**: Form validation SHALL enforce:
- Key must be unique
- Key must match pattern: `^[a-z0-9_]+$` (lowercase, numbers, underscore)
- Value required

**FR-7.5**: The Edit form SHALL:
- Pre-populate all fields
- Automatically set updated_at to current timestamp on save
- Set updated_by to current user (or "system" if no user context)

**FR-7.6**: Delete operation SHALL:
- Show confirmation modal
- Allow deletion (no referential integrity checks needed)
- Warning message: "Are you sure? Deleting critical system variables may cause application errors."

**FR-7.7**: Export SHALL include all columns

**API Endpoints (Existing from Mod 0002):**
- `GET /api/system-variables` - List all variables
- `GET /api/system-variables/{key}` - Get single variable
- `POST /api/system-variables` - Create new variable
- `PUT /api/system-variables/{key}` - Update variable
- `DELETE /api/system-variables/{key}` - Delete variable

---

## 4. External Interface Requirements

### 4.1 User Interfaces

**UI-1: Admin Page Layout**

```
┌──────────────────────────────────────────────────────────┐
│ Superscapes Financial Dashboard           [User] [Logout] │
├──────────────────────────────────────────────────────────┤
│ Dashboard │ Ask AI │ Admin                               │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ Admin / Data Management                                  │
├──────────────────────────────────────────────────────────┤
│ [AI Questions] [Categories] [Managers] [Regions]         │
│ [Accounts] [Jobs] [System Variables]                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  AI Example Questions                      [Export] [+ Add]│
│  ┌─Search: [_______________] Category: [All ▼]          │
│  │                                                       │
│  ├─Question Text───┬─Category─┬─Type──┬─Usage─┬─Active─┬─Actions─┐
│  │ Show revenue by│ Revenue  │ Table │  142  │   ✓   │ ✏️ 🗑️  │
│  │ month          │ Analysis │       │       │       │        │
│  ├───────────────┼──────────┼───────┼───────┼───────┼────────┤
│  │ Show expense by│ Expense  │ Chart │   89  │   ✓   │ ✏️ 🗑️  │
│  │ project        │ Tracking │       │       │       │        │
│  ├───────────────┼──────────┼───────┼───────┼───────┼────────┤
│  │ ...            │ ...      │ ...   │ ...   │ ...   │ ...    │
│  └───────────────┴──────────┴───────┴───────┴───────┴────────┘
│                                                          │
│  Showing 1-50 of 142  [< Prev] [Next >]  [50 ▼] per page│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**UI-2: Create/Edit Form Modal**

```
┌─────────────────────────────────────────┐
│ Add New AI Example Question        [×] │
├─────────────────────────────────────────┤
│                                         │
│ Question Text *                         │
│ ┌─────────────────────────────────────┐ │
│ │ Show revenue by month               │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Category *                              │
│ [Revenue Analysis            ▼]        │
│                                         │
│ Description                             │
│ ┌─────────────────────────────────────┐ │
│ │ Displays monthly revenue trends      │ │
│ │                                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Response Type *                         │
│ [Table                       ▼]        │
│                                         │
│ Sort Order *                            │
│ [10                          ]         │
│                                         │
│ ☑ Active                                │
│                                         │
├─────────────────────────────────────────┤
│              [Cancel] [Save]            │
└─────────────────────────────────────────┘
```

**UI-3: Delete Confirmation Modal**

```
┌─────────────────────────────────────────┐
│ Confirm Deletion                   [×] │
├─────────────────────────────────────────┤
│                                         │
│ Are you sure you want to delete this   │
│ question?                               │
│                                         │
│ "Show revenue by month"                 │
│                                         │
│ ☐ Mark Inactive Instead                │
│   (Recommended - preserves history)     │
│                                         │
├─────────────────────────────────────────┤
│              [Cancel] [Delete]          │
└─────────────────────────────────────────┘
```

**UI Design Requirements:**

- Follow existing Tailwind CSS design system
- Use Headless UI components for dropdowns, modals, tabs
- Consistent spacing, colors, fonts with main dashboard
- Accessible (keyboard navigation, ARIA labels, focus states)
- Loading states (skeleton screens or spinners during fetch)
- Success/error toasts for user feedback

### 4.2 Software Interfaces

**Backend API:**

All APIs SHALL follow REST conventions and return JSON responses.

**Standard Response Format:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-10-31T12:00:00Z"
}
```

**Error Response Format:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Category code must be unique",
    "field": "category_code"
  },
  "timestamp": "2025-10-31T12:00:00Z"
}
```

**API Conventions:**

- `GET /api/admin/{resource}` - List all records (with pagination, filters)
- `GET /api/admin/{resource}/{id}` - Get single record
- `POST /api/admin/{resource}` - Create new record
- `PUT /api/admin/{resource}/{id}` - Update existing record
- `DELETE /api/admin/{resource}/{id}` - Delete record

**Query Parameters (List Endpoints):**

- `page` (int, default 1)
- `page_size` (int, default 50, max 200)
- `sort_by` (string, column name)
- `sort_order` (string, "asc" or "desc")
- `search` (string, text search across searchable columns)
- `filter_{column}` (string, column-specific filter)

**Database Interface:**

- PostgreSQL 14+ on AWS RDS
- SQLAlchemy 2.0 ORM for database access
- Alembic for schema migrations (if needed)
- Connection pooling via SQLAlchemy engine

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**NFR-1.1**: List endpoints SHALL return results in < 500ms for datasets up to 10,000 records

**NFR-1.2**: Create/Update operations SHALL complete in < 300ms

**NFR-1.3**: Delete operations (including referential integrity checks) SHALL complete in < 500ms

**NFR-1.4**: Export operations SHALL complete in < 2 seconds for datasets up to 1,000 records

**NFR-1.5**: UI SHALL render initial page load in < 1 second on desktop (excluding network latency)

**NFR-1.6**: Table sorting/filtering SHALL update UI in < 200ms (client-side operations)

### 5.2 Security Requirements

**NFR-2.1**: All API endpoints SHALL require authentication (once auth is implemented)

**NFR-2.2**: SQL injection protection via parameterized queries (SQLAlchemy handles this)

**NFR-2.3**: XSS protection via React's built-in escaping

**NFR-2.4**: CSRF protection via same-origin policy

**NFR-2.5**: Sensitive data (if any) SHALL be transmitted over HTTPS only

**NFR-2.6**: Database credentials SHALL be stored in environment variables, not hardcoded

### 5.3 Usability Requirements

**NFR-3.1**: Common operations (add, edit, search) SHALL be completable in ≤ 3 clicks

**NFR-3.2**: Error messages SHALL be user-friendly, not technical database errors

**NFR-3.3**: Forms SHALL provide inline validation feedback within 500ms of field blur

**NFR-3.4**: Required fields SHALL be clearly marked with (*) or visual indicator

**NFR-3.5**: Help text SHALL be available for non-obvious fields (tooltip or inline)

**NFR-3.6**: Confirmation SHALL be required for destructive actions (delete)

### 5.4 Reliability Requirements

**NFR-4.1**: System SHALL prevent data corruption through validation and constraints

**NFR-4.2**: Failed operations SHALL rollback completely (no partial updates)

**NFR-4.3**: Referential integrity checks SHALL prevent orphaned records

**NFR-4.4**: Concurrent edits SHALL use optimistic locking (last write wins, with conflict detection)

### 5.5 Scalability & Maintainability

**NFR-5.1**: Code SHALL follow existing project patterns for consistency

**NFR-5.2**: Components SHALL be reusable across different tables where possible

**NFR-5.3**: API routes SHALL follow DRY principle (shared base classes for CRUD operations)

**NFR-5.4**: Database queries SHALL use pagination to handle table growth

**NFR-5.5**: Frontend SHALL use lazy loading for dropdown options with > 100 items

---

## 6. System Architecture

### 6.1 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS 4.x for styling
- Headless UI for accessible components (dropdowns, modals, tabs)
- React Hook Form for form management and validation
- Zod for schema validation
- Axios for HTTP requests
- TanStack Table (React Table v8) for data tables (recommend adding if not present)
- React Router v6 for navigation
- date-fns for date formatting

**Backend:**
- Python 3.11+
- FastAPI framework
- SQLAlchemy 2.0 ORM
- Pydantic v2 for request/response validation
- PostgreSQL 14+ database (AWS RDS)

**Development Tools:**
- ESLint + Prettier (frontend code quality)
- Black + isort (backend code quality)
- pytest (backend testing)
- React Testing Library (frontend testing)

### 6.2 Data Storage

**Database Tables (Existing):**

```sql
-- AI Question Categories (core schema)
CREATE TABLE core.ai_question_categories (
    category_id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    category_icon VARCHAR(10) NOT NULL,
    category_description TEXT,
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- AI Example Questions (core schema)
CREATE TABLE core.ai_example_questions (
    question_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES core.ai_question_categories(category_id),
    question_text TEXT NOT NULL,
    question_description TEXT,
    expected_response_type VARCHAR(20) NOT NULL,
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100)
);

-- Regions (public schema)
CREATE TABLE public.regions (
    region_id SERIAL PRIMARY KEY,
    region_code VARCHAR(20) NOT NULL UNIQUE,
    region_name VARCHAR(100) NOT NULL
);

-- Managers (public schema)
CREATE TABLE public.managers (
    manager_id INTEGER PRIMARY KEY,
    manager_name VARCHAR(100) NOT NULL,
    region_id INTEGER REFERENCES regions(region_id)
);

-- Accounts (public schema)
CREATE TABLE public.accounts (
    account_id SERIAL PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50),
    normal_balance VARCHAR(10),
    category VARCHAR(100),
    subcategory VARCHAR(100)
);

-- Jobs (public schema)
CREATE TABLE public.jobs (
    job_id VARCHAR(50) PRIMARY KEY,
    job_name VARCHAR(255),
    customer_id VARCHAR(50),
    class VARCHAR(50),
    status VARCHAR(50),
    manager_id INTEGER REFERENCES managers(manager_id),
    parent_job_id VARCHAR(50) REFERENCES jobs(job_id),
    category VARCHAR(50)
);

-- System Variables (public schema)
CREATE TABLE public.system_variables (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by VARCHAR(100)
);
```

**Referential Integrity Rules:**

- ai_example_questions.category_id → ai_question_categories.category_id (ON DELETE RESTRICT)
- managers.region_id → regions.region_id (ON DELETE RESTRICT)
- jobs.manager_id → managers.manager_id (ON DELETE SET NULL)
- jobs.parent_job_id → jobs.job_id (ON DELETE SET NULL)
- transactions.account_number → accounts.account_number (existing, not modified)
- transactions.job_id → jobs.job_id (existing, not enforced)

### 6.3 Component Architecture

**Frontend Component Hierarchy:**

```
App.tsx
├── Header (with Admin navigation)
├── Router
    ├── Dashboard (existing)
    ├── AskAI (existing)
    └── AdminLayout (NEW)
        ├── AdminTabs (NEW)
        │   ├── AIQuestionsTab
        │   ├── CategoriesTab
        │   ├── ManagersTab
        │   ├── RegionsTab
        │   ├── AccountsTab
        │   ├── JobsTab
        │   └── SystemVariablesTab
        └── [Selected Tab Content] (NEW)
            ├── DataTable (reusable)
            │   ├── TableHeader (sort controls)
            │   ├── TableFilters (search, dropdowns)
            │   ├── TableBody (rows)
            │   └── TablePagination
            ├── CreateEditModal (reusable)
            │   ├── Form (React Hook Form)
            │   ├── FormFields (dynamic per table)
            │   └── FormActions (Cancel, Save)
            └── DeleteConfirmModal (reusable)
```

**Shared Components (Reusable):**

- `<DataTable>` - Generic table with sort, filter, pagination
- `<CreateEditModal>` - Generic modal for create/edit forms
- `<DeleteConfirmModal>` - Generic delete confirmation
- `<FormField>` - Individual form field with validation
- `<DropdownSelect>` - Select component with search
- `<TextInput>` - Text input with validation feedback
- `<Checkbox>` - Checkbox component
- `<Button>` - Button with loading states
- `<Toast>` - Success/error notification

**Backend API Structure:**

```
/api/admin/
├── ai-questions (existing from Mod 0001)
│   ├── GET / (list)
│   ├── POST / (create)
│   ├── GET /{id} (read)
│   ├── PUT /{id} (update)
│   └── DELETE /{id} (delete)
├── ai-question-categories (NEW)
│   ├── GET / (list with question counts)
│   ├── POST /
│   ├── GET /{id}
│   ├── PUT /{id}
│   └── DELETE /{id} (with ref check)
├── managers (NEW)
│   ├── GET / (list with job counts)
│   ├── POST /
│   ├── GET /{id}
│   ├── PUT /{id}
│   └── DELETE /{id} (with ref check)
├── regions (NEW)
│   ├── GET / (list with manager/job counts)
│   ├── POST /
│   ├── GET /{id}
│   ├── PUT /{id}
│   └── DELETE /{id} (with ref check)
├── accounts (NEW - view/edit only)
│   ├── GET / (list with transaction counts)
│   ├── GET /{id}
│   └── PUT /{id} (name, type, balance, category, subcategory only)
├── jobs (NEW - view/edit only)
│   ├── GET / (list with transaction counts)
│   ├── GET /{id}
│   └── PUT /{id} (all fields except job_id)
└── system-variables (existing from Mod 0002)
    ├── GET / (list)
    ├── POST /
    ├── GET /{key}
    ├── PUT /{key}
    └── DELETE /{key}
```

---

## 7. Data Requirements

### 7.1 Data Models

**TypeScript Interfaces (Frontend):**

```typescript
// AI Example Questions
interface AIExampleQuestion {
  question_id: number;
  category_id: number;
  category_name: string; // Joined from category
  question_text: string;
  question_description: string | null;
  expected_response_type: 'Table' | 'Chart' | 'Text' | 'Mixed';
  sort_order: number;
  is_active: boolean;
  usage_count: number;
  last_used_at: string | null; // ISO timestamp
  created_at: string; // ISO timestamp
  created_by: string | null;
}

// AI Question Categories
interface AIQuestionCategory {
  category_id: number;
  category_code: string;
  category_name: string;
  category_icon: string;
  category_description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  question_count: number; // Calculated
}

// Managers
interface Manager {
  manager_id: number;
  manager_name: string;
  region_id: number;
  region_name: string; // Joined from region
  job_count: number; // Calculated
}

// Regions
interface Region {
  region_id: number;
  region_code: string;
  region_name: string;
  manager_count: number; // Calculated
  job_count: number; // Calculated (via managers)
}

// Accounts
interface Account {
  account_id: number;
  account_number: string;
  account_name: string;
  account_type: string;
  normal_balance: 'Debit' | 'Credit';
  category: string | null;
  subcategory: string | null;
  transaction_count: number; // Calculated
}

// Jobs
interface Job {
  job_id: string;
  job_name: string | null;
  customer_id: string | null;
  class: 'Commercial' | 'Maintenance' | 'Multi Family' | 'Residential' | 'Commercial Landscape' | null;
  status: 'Active' | 'Completed' | 'In Progress' | 'Unknown' | null;
  manager_id: number | null;
  manager_name: string | null; // Joined from manager
  parent_job_id: string | null;
  parent_job_name: string | null; // Joined from parent job
  category: string | null;
  transaction_count: number; // Calculated
}

// System Variables
interface SystemVariable {
  key: string;
  value: string;
  description: string | null;
  updated_at: string; // ISO timestamp
  updated_by: string | null;
}
```

**Pydantic Models (Backend):**

```python
# AI Example Questions
class AIExampleQuestionBase(BaseModel):
    question_text: str
    category_id: int
    question_description: Optional[str] = None
    expected_response_type: Literal['Table', 'Chart', 'Text', 'Mixed']
    sort_order: int
    is_active: bool = True

class AIExampleQuestionCreate(AIExampleQuestionBase):
    pass

class AIExampleQuestionUpdate(AIExampleQuestionBase):
    pass

class AIExampleQuestionResponse(AIExampleQuestionBase):
    question_id: int
    category_name: str  # Joined
    usage_count: int
    last_used_at: Optional[datetime]
    created_at: datetime
    created_by: Optional[str]

    class Config:
        from_attributes = True

# Similar patterns for other tables...
```

### 7.2 Data Validation Rules

**AI Example Questions:**
- question_text: Required, 1-500 chars, unique
- category_id: Required, must exist in categories table
- expected_response_type: Required, enum ['Table', 'Chart', 'Text', 'Mixed']
- sort_order: Required, positive integer
- is_active: Required, boolean

**AI Question Categories:**
- category_code: Required, unique, pattern `^[a-zA-Z0-9_]+$`, max 50 chars
- category_name: Required, unique, max 100 chars
- category_icon: Required, max 10 chars
- sort_order: Required, positive integer
- is_active: Required, boolean

**Managers:**
- manager_id: Required, unique, positive integer
- manager_name: Required, max 100 chars
- region_id: Required, must exist in regions table

**Regions:**
- region_code: Required, unique, pattern `^[A-Z0-9_-]+$`, max 20 chars
- region_name: Required, max 100 chars

**Accounts (Edit Only):**
- account_name: Required, max 255 chars
- account_type: Required, max 50 chars
- normal_balance: Required, enum ['Debit', 'Credit']
- category: Optional, max 100 chars
- subcategory: Optional, max 100 chars

**Jobs (Edit Only):**
- job_name: Optional, max 255 chars
- customer_id: Optional, max 50 chars
- class: Optional, enum ['Commercial', 'Maintenance', 'Multi Family', 'Residential', 'Commercial Landscape']
- status: Optional, enum ['Active', 'Completed', 'In Progress', 'Unknown']
- manager_id: Optional, must exist in managers table if provided
- parent_job_id: Optional, must exist in jobs table, cannot be self-referential

**System Variables:**
- key: Required, unique, pattern `^[a-z0-9_]+$`, max 100 chars
- value: Required, max 10,000 chars
- description: Optional, max 500 chars

### 7.3 Referential Integrity Checks

**Before Deleting:**

- **Category:** Check `COUNT(question_id) FROM ai_example_questions WHERE category_id = X`
- **Manager:** Check `COUNT(job_id) FROM jobs WHERE manager_id = X`
- **Region:** Check `COUNT(manager_id) FROM managers WHERE region_id = X`

**Error Messages:**

- "Cannot delete category '[name]'. It contains [X] questions. Please reassign or delete them first."
- "Cannot delete manager '[name]'. They are assigned to [X] jobs. Please reassign them first."
- "Cannot delete region '[name]'. It has [X] managers. Please reassign them first."

---

## 8. Implementation Guidelines

### 8.1 Code Organization

**Frontend:**

```
poc/frontend/src/
├── pages/
│   └── Admin/
│       ├── AdminLayout.tsx
│       ├── AIQuestionsTab.tsx
│       ├── CategoriesTab.tsx
│       ├── ManagersTab.tsx
│       ├── RegionsTab.tsx
│       ├── AccountsTab.tsx
│       ├── JobsTab.tsx
│       └── SystemVariablesTab.tsx
├── components/
│   └── Admin/
│       ├── DataTable.tsx
│       ├── CreateEditModal.tsx
│       ├── DeleteConfirmModal.tsx
│       ├── FormField.tsx
│       ├── DropdownSelect.tsx
│       └── ExportButton.tsx
├── hooks/
│   └── useAdminData.ts (custom hook for API calls)
├── api/
│   └── adminClient.ts (API functions)
└── types/
    └── admin.ts (TypeScript interfaces)
```

**Backend:**

```
poc/backend/
├── api_routes/
│   └── admin/
│       ├── ai_questions.py (existing)
│       ├── ai_question_categories.py (new)
│       ├── managers.py (new)
│       ├── regions.py (new)
│       ├── accounts.py (new)
│       ├── jobs.py (new)
│       └── system_variables.py (existing)
├── models/
│   ├── ai_questions.py (existing)
│   ├── accounts.py (existing or new)
│   ├── jobs.py (existing or new)
│   ├── managers.py (existing or new)
│   ├── regions.py (existing or new)
│   └── system_variables.py (existing)
├── schemas/
│   └── admin/
│       ├── ai_questions.py (existing)
│       ├── categories.py (new)
│       ├── managers.py (new)
│       ├── regions.py (new)
│       ├── accounts.py (new)
│       ├── jobs.py (new)
│       └── system_variables.py (new)
└── tests/
    └── test_admin_*.py (unit tests for each endpoint)
```

### 8.2 Reusable Patterns

**Generic CRUD Router (Backend):**

Create a base class for CRUD operations to reduce code duplication:

```python
class CRUDRouter(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model
        self.router = APIRouter()

    def list(self, db: Session, skip: int = 0, limit: int = 50):
        return db.query(self.model).offset(skip).limit(limit).all()

    def get(self, db: Session, id: Any):
        return db.query(self.model).filter(self.model.id == id).first()

    def create(self, db: Session, obj_in: CreateSchemaType):
        obj = self.model(**obj_in.dict())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def update(self, db: Session, id: Any, obj_in: UpdateSchemaType):
        obj = self.get(db, id)
        for field, value in obj_in.dict(exclude_unset=True).items():
            setattr(obj, field, value)
        db.commit()
        db.refresh(obj)
        return obj

    def delete(self, db: Session, id: Any):
        obj = self.get(db, id)
        db.delete(obj)
        db.commit()
        return obj
```

**Generic Data Table (Frontend):**

Create a reusable `<DataTable>` component that accepts:
- Column definitions
- Data array
- Sort handler
- Filter handler
- Pagination controls
- Row action renderers

This component can be reused across all 7 tables with different configurations.

### 8.3 API Response Standardization

All endpoints SHALL return consistent response format:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 142,
    "page": 1,
    "page_size": 50,
    "total_pages": 3
  },
  "message": "Retrieved 50 records",
  "timestamp": "2025-10-31T12:00:00Z"
}
```

---

## 9. Testing Requirements

### 9.1 Unit Tests (Backend)

**Test Coverage Requirements:**

- Each API endpoint (list, get, create, update, delete)
- Validation rules (required fields, unique constraints, foreign keys)
- Referential integrity checks (delete prevention)
- Error handling (404, 400, 500 responses)

**Example Test Cases:**

```python
def test_create_category_success():
    """Test successful category creation"""

def test_create_category_duplicate_code():
    """Test that duplicate category_code returns 400"""

def test_delete_category_with_questions():
    """Test that category with questions cannot be deleted"""

def test_update_manager_invalid_region():
    """Test that invalid region_id returns 400"""
```

### 9.2 Integration Tests (Frontend)

**Test Coverage Requirements:**

- Table rendering with mock data
- Sorting, filtering, pagination
- Form submission (create, edit)
- Delete confirmation flow
- Error display
- Loading states

**Example Test Cases:**

```typescript
test('renders AI questions table with data', () => {
  // Render component with mock data
  // Assert table rows appear
})

test('opens create modal on Add button click', () => {
  // Click Add button
  // Assert modal is visible
})

test('displays error message for invalid form submission', () => {
  // Submit form with empty required field
  // Assert error message appears
})

test('prevents deletion of category with questions', () => {
  // Mock API response indicating category has questions
  // Click delete button
  // Assert error message appears
  // Assert modal doesn't close
})
```

### 9.3 Manual Testing Checklist

- [ ] All 7 tables load with data
- [ ] Sorting works on all columns (asc/desc toggle)
- [ ] Text search filters results correctly
- [ ] Dropdown filters work
- [ ] Pagination controls work (prev, next, page size)
- [ ] Create form opens and validates correctly
- [ ] Edit form pre-populates and saves changes
- [ ] Delete confirmation prevents accidental deletion
- [ ] Referential integrity checks block invalid deletes
- [ ] Export generates correct CSV/Excel file
- [ ] Error messages are user-friendly
- [ ] Success toasts appear after operations
- [ ] Responsive layout works on desktop (1024px+)
- [ ] Keyboard navigation works in forms and modals
- [ ] Focus management works (modal open/close)

---

## 10. Deployment Considerations

### 10.1 Database Migrations

**No schema changes required** - all tables already exist in the database.

**Potential Data Seeding:**

If test environment needs sample data, create seed scripts for:
- AI Question Categories (sample categories)
- AI Example Questions (sample questions)
- Regions (sample regions)
- Managers (sample managers)

### 10.2 Environment Variables

No new environment variables required. Uses existing:
- `DATABASE_URL` - PostgreSQL connection string
- `ENVIRONMENT` - dev/staging/production

### 10.3 Build & Deploy

**Frontend:**
- Build: `npm run build`
- Deploy: Copy `dist/` to hosting (Vercel, Netlify, S3+CloudFront)

**Backend:**
- No changes to deployment (FastAPI already deployed)
- New API routes automatically available

---

## 11. Appendix

### 11.1 Discovery Interview Summary

(See Executive SRS for full interview summary)

**Key Technical Takeaways:**

- Frontend-only development (backend APIs follow existing patterns)
- Must prevent deletion of referenced records
- Accounts and Jobs: view/edit only (no create/delete)
- Desktop-optimized UI (mobile functional but not priority)
- Export functionality required, import later
- No auth/audit logging in this module

### 11.2 Database Schema Details

(Full schema provided in Section 6.2)

### 11.3 API Endpoint Specifications

(Full endpoint list provided in Section 6.3)

### 11.4 Related Documents

- **Executive SRS:** `0003-srs-executive-admin-crud-interface.md`
- **Mod 0001 Documentation:** AI Question Library (backend reference)
- **Mod 0002 Documentation:** Admin Navigation & System Variables
- **Database Schema:** `/poc/database/schema.sql`

---

**Document Control:**
- **Author:** AI Assistant (based on discovery interview and system analysis)
- **Reviewer:** [Development Team Lead]
- **Approval Date:** [Pending Review]
- **Next Review:** Pre-implementation (before Step 2: PRD generation)

---

## 12. NAYSAYER REVIEW: Technical Concerns & Implementation Challenges

**Review Date:** October 31, 2025
**Reviewer Role:** Senior Technical Architect / Critical Analyst
**Purpose:** Identify technical risks, challenge implementation assumptions, and expose potential issues before development begins.

---

### 12.1 Database & Performance Concerns

#### CONCERN #1: Transaction Count Joins Will Kill Performance

**The Issue:**
Multiple features require calculating transaction counts via JOINs:

```sql
-- FR-5.7: Accounts with transaction counts
SELECT a.*, COUNT(t.transaction_id) as transaction_count
FROM accounts a
LEFT JOIN transactions t ON a.account_number = t.account_number
GROUP BY a.account_id;

-- FR-6.7: Jobs with transaction counts
SELECT j.*, COUNT(t.transaction_id) as transaction_count
FROM jobs j
LEFT JOIN transactions t ON j.job_id = t.job_id
GROUP BY j.job_id;
```

**Why This Is Problematic:**

| Current State | 1 Year | 3 Years |
|--------------|--------|---------|
| ~1M transactions | ~4M | ~12M |
| Query time: 200ms | 800ms | 2.5s |
| Acceptable | Sluggish | Unusable |

**Impact on User Experience:**
- Every page load of Accounts tab = full table scan of 1M+ transactions
- Pagination doesn't help (need total count for all accounts, not just page)
- Sorting by transaction_count = entire query must complete before sorting
- Users will complain: "Admin page is so slow!"

**Database Load:**
- If 3 admins browse tables simultaneously, that's 3 full table scans
- During business hours, could see 10-20 of these expensive queries per hour
- RDS instance may need upsizing just to handle admin interface

**Mitigation Strategies:**

**Option 1: Materialized View (RECOMMENDED)**
```sql
CREATE MATERIALIZED VIEW admin_account_counts AS
SELECT account_id, account_number, COUNT(transaction_id) as transaction_count
FROM transactions
GROUP BY account_id, account_number;

-- Refresh nightly or on-demand
REFRESH MATERIALIZED VIEW admin_account_counts;
```
✅ Pros: Fast queries (pre-computed), minimal code changes
❌ Cons: Counts may be stale (up to 24 hours), requires database migration

**Option 2: Denormalized Count Columns**
```sql
ALTER TABLE accounts ADD COLUMN transaction_count INTEGER DEFAULT 0;
-- Update via trigger on transactions INSERT/UPDATE/DELETE
```
✅ Pros: Always accurate, fastest queries
❌ Cons: Requires schema change, trigger maintenance, backfilling

**Option 3: Application-Level Caching**
```python
@cache(ttl=3600)  # Cache for 1 hour
def get_account_transaction_counts():
    return db.query(...).all()
```
✅ Pros: No schema changes, easy to implement
❌ Cons: First request still slow, cache invalidation complexity

**Option 4: Lazy Loading**
```typescript
// Only fetch count when user expands row or hovers
const onRowExpand = (accountId) => {
  fetchTransactionCount(accountId);  // Single account, fast
}
```
✅ Pros: No heavy lifting upfront, progressive disclosure
❌ Cons: UX may feel incomplete, many small requests

**RECOMMENDATION:** Start with Option 3 (caching), migrate to Option 1 (materialized view) if data staleness is acceptable.

---

#### CONCERN #2: Referential Integrity Checks Have Race Conditions

**The Issue:**
FR-2.5, FR-3.5, FR-4.5 specify checking for dependent records before deletion:

```python
# Pseudo-code for deleting a category
def delete_category(category_id):
    question_count = db.query(AIQuestion).filter_by(category_id=category_id).count()
    if question_count > 0:
        raise ValueError(f"Cannot delete. Contains {question_count} questions.")
    db.delete(category)
    db.commit()
```

**Race Condition Scenario:**

| Time | Admin User A | Admin User B |
|------|-------------|-------------|
| T0 | Clicks delete on Category X | - |
| T1 | CHECK: 0 questions found | - |
| T2 | - | Creates new question in Category X |
| T3 | DELETE category (succeeds) | - |
| T4 | Database constraint violation! | Question now orphaned |

**What Actually Happens:**
1. PostgreSQL FK constraint `RESTRICT` will prevent the deletion at T3
2. User A sees: `ForeignKeyViolation: update or delete on table "ai_question_categories" violates foreign key constraint`
3. User-friendly message says "no questions," but deletion still fails
4. User confusion: "But you said there were 0 questions!"

**Additional Complexity:**
Multi-level dependencies (Region → Manager → Jobs):
```python
# What the code needs to do:
region_managers = db.query(Manager).filter_by(region_id=region_id).all()
for manager in region_managers:
    job_count = db.query(Job).filter_by(manager_id=manager.manager_id).count()
    total_jobs += job_count

if len(region_managers) > 0 or total_jobs > 0:
    raise ValueError(f"Cannot delete. Has {len(region_managers)} managers, {total_jobs} jobs.")
```

**Performance Impact:**
Deleting a region requires:
1. Query all managers in region
2. For each manager, query all jobs
3. If region has 10 managers × 50 jobs each = 500 job records examined
4. Just to show "Cannot delete" message

**Mitigation Strategies:**

**Option 1: Database-Level Constraints Only (SIMPLEST)**
```python
def delete_category(category_id):
    try:
        db.delete(category)
        db.commit()
    except IntegrityError as e:
        if "foreign key" in str(e):
            raise ValueError("Cannot delete. This record is referenced by other data.")
        raise
```
✅ Pros: No race conditions, database guarantees correctness
❌ Cons: Error message is generic, doesn't show specific counts

**Option 2: Pessimistic Locking**
```python
def delete_category(category_id):
    with db.begin():  # Transaction
        category = db.query(Category).with_for_update().filter_by(id=category_id).one()
        question_count = db.query(AIQuestion).filter_by(category_id=category_id).count()
        if question_count > 0:
            raise ValueError(f"Cannot delete. Contains {question_count} questions.")
        db.delete(category)
```
✅ Pros: Accurate counts, no race conditions
❌ Cons: Locks table rows, may cause contention

**Option 3: Check + Cascade Preview**
```python
def get_deletion_impact(region_id):
    # Read-only query, no transaction needed
    managers = db.query(Manager).filter_by(region_id=region_id).all()
    jobs = db.query(Job).filter(Job.manager_id.in_([m.id for m in managers])).all()
    return {
        "managers": len(managers),
        "jobs": len(jobs),
        "can_delete": len(managers) == 0
    }
```
✅ Pros: Shows full impact tree, helps user understand dependencies
❌ Cons: Still has race condition, but at least shows accurate preview

**RECOMMENDATION:** Combine Option 1 (database constraints as fallback) + Option 3 (impact preview for UX).

---

#### CONCERN #3: No Database Schema Migrations Planned — But You'll Need Them

**The Claim:**
Section 10.1 states: "**No schema changes required** - all tables already exist in the database."

**The Reality:**
Based on Naysayer Review recommendations and likely future requests:

**Probable Schema Changes:**

| Change | Reason | Tables Affected |
|--------|--------|----------------|
| Add `is_active` / `deleted_at` | Soft delete for all tables | 7 tables |
| Add `created_by`, `updated_by` | Audit logging | 5 tables (2 already have) |
| Add `version` / `updated_at` | Optimistic locking | 7 tables |
| Add `transaction_count` column | Performance optimization | accounts, jobs |
| Add indexes on FKs | Referential integrity query speed | managers, jobs, questions |

**Why "No Schema Changes" Is Wishful Thinking:**
1. Current spec already shows `updated_at`, `updated_by` in system_variables — that's a schema requirement
2. Soft delete for AI questions (`is_active`) exists, but not for other tables → inconsistency will drive future changes
3. Performance issues with transaction counts will require materialized views or denormalized columns
4. Audit logging (highly likely to be requested) requires schema additions

**Consequences of Not Planning for Migrations:**
- Scrambling to write Alembic migrations mid-development
- Downtime to add columns to production database
- Risk of data loss if migrations aren't tested
- Backfilling `updated_by` fields with "unknown" for existing records

**Mitigation:**

**Recommended Schema Changes (Do Upfront):**

```sql
-- Add audit/lifecycle fields to all tables lacking them
ALTER TABLE regions ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE regions ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE regions ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

ALTER TABLE managers ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE managers ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE managers ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Add indexes for FK lookups (referential integrity checks)
CREATE INDEX idx_managers_region_id ON managers(region_id);
CREATE INDEX idx_jobs_manager_id ON jobs(manager_id);
CREATE INDEX idx_ai_questions_category_id ON ai_example_questions(category_id);

-- Add trigger for updated_at auto-update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**RECOMMENDATION:** Create Alembic migration for these changes BEFORE starting frontend work.

---

### 12.2 API Design & Backend Concerns

#### CONCERN #4: "Replicating Mod 0001 Patterns" — But Those Patterns May Be Flawed

**The Assumption:**
Section 2.1 states: "Follow established patterns from Mod 0001 (AI Questions API) for consistency."

**The Question:**
What if Mod 0001's API design has issues? Should we replicate them?

**Potential Issues to Examine:**

1. **Error Handling:** Does Mod 0001 return consistent error codes (400, 404, 409, 500)?
2. **Pagination:** Does it use offset/limit or cursor-based? (Offset can skip records under heavy writes)
3. **Response Format:** Is it consistent across all endpoints? Documented?
4. **Validation:** Does it validate at Pydantic layer, service layer, or both?
5. **Performance:** Does it have N+1 query issues when loading related entities?

**Example N+1 Problem:**
```python
# Mod 0001 might do this:
questions = db.query(AIQuestion).all()  # 1 query
for question in questions:
    category = db.query(Category).filter_by(id=question.category_id).first()  # N queries!
    question.category_name = category.name
```

If Mod 0001 has 100 questions, that's 101 queries instead of 1 JOIN query.

**Mitigation:**

**Before Replicating:**
1. ✅ Review Mod 0001 API code (`/poc/backend/api_routes/admin/ai_questions.py`)
2. ✅ Test performance under load (100+ records)
3. ✅ Check for N+1 query issues (use SQLAlchemy `joinedload` or `selectinload`)
4. ✅ Document any issues found, fix them in new APIs

**Better Pattern:**
```python
# Use eager loading to avoid N+1
questions = db.query(AIQuestion).options(joinedload(AIQuestion.category)).all()
```

**RECOMMENDATION:** Audit Mod 0001 API before treating it as the gold standard.

---

#### CONCERN #5: API Pagination — Offset/Limit vs. Cursor-Based

**Current Spec:**
Section 4.2 (External Interfaces) specifies:
```
Query Parameters:
- page (int, default 1)
- page_size (int, default 50, max 200)
```

This implies **offset/limit pagination**:
```sql
SELECT * FROM accounts ORDER BY account_id LIMIT 50 OFFSET 100;
```

**Why This Is Problematic:**

**Scenario: Admin User Browsing Page 3**
1. T0: User loads page 3 (records 101-150)
2. T1: Another user deletes record #50
3. T2: User clicks "Next" to page 4 (expects records 151-200)
4. T3: Due to deletion, offset is now off by 1 → sees record #150 again (duplicate)

**Performance Issues:**
- `OFFSET 10000` means database scans and discards 10,000 rows
- As users paginate deeper, queries get slower
- `OFFSET 50000` on 1M row table = very slow

**Alternative: Cursor-Based Pagination**
```sql
SELECT * FROM accounts WHERE account_id > :last_seen_id ORDER BY account_id LIMIT 50;
```
✅ Pros: Consistent results, fast at any depth
❌ Cons: Can't jump to arbitrary page numbers, slightly more complex API

**Real-World Decision:**
- **Offset/Limit:** Fine for small tables (< 10k records), acceptable for admin interfaces
- **Cursor:** Better for large tables, required for infinite scroll UIs

**RECOMMENDATION:** Use offset/limit for simplicity, document the limitation, consider cursor pagination if tables exceed 50k records.

---

#### CONCERN #6: No API Versioning Strategy

**The Gap:**
API endpoints are defined as `/api/admin/managers`, `/api/admin/accounts`, etc., but there's no versioning (e.g., `/api/v1/admin/managers`).

**Why This Matters:**

**Scenario: Breaking Change Needed**
1. Initial API returns: `{"manager_id": 123, "manager_name": "John Doe"}`
2. Later, you realize you need to split name: `{"manager_id": 123, "first_name": "John", "last_name": "Doe"}`
3. This breaks existing frontend code
4. Without versioning, you have two choices:
   - **Break the frontend** (requires simultaneous deploy)
   - **Support both formats** in same endpoint (messy)

**With Versioning:**
- Deploy `/api/v2/admin/managers` with new format
- Keep `/api/v1/admin/managers` working
- Migrate frontend at your own pace
- Deprecate v1 after migration

**Counterargument:**
"This is an internal admin tool, not a public API. We can just update frontend and backend together."

**Rebuttal:**
- What if backend deploys first, frontend second? 30-minute window of broken UI.
- What if frontend is cached in user's browser? They see old JS hitting new API.
- What if you want to A/B test a new UI against old API?

**Mitigation:**

**Option 1: Version from Day 1**
```
/api/v1/admin/managers
/api/v1/admin/accounts
```
✅ Pros: Future-proof, industry standard
❌ Cons: Extra URL complexity, might never need it

**Option 2: No Versioning, Strict Backward Compatibility**
```
Never remove fields, only add
Use feature flags for breaking changes
Deprecation warnings in responses
```
✅ Pros: Simpler URLs
❌ Cons: Requires discipline, still can't handle some changes

**RECOMMENDATION:** For internal admin tool, Option 2 is acceptable. Document policy: "All API changes must be backward compatible for 90 days."

---

### 12.3 Frontend & UX Concerns

#### CONCERN #7: "Reusable Components" — The Configuration Hell Problem

**The Ideal:**
Section 6.3 proposes:
```typescript
<DataTable
  columns={columns}
  data={data}
  onSort={handleSort}
  onFilter={handleFilter}
  onPageChange={handlePageChange}
/>
```

**The Reality After Building 7 Tables:**

```typescript
<DataTable
  columns={columns}
  data={data}
  onSort={handleSort}
  onFilter={handleFilter}
  onPageChange={handlePageChange}
  enableCreate={table !== 'accounts' && table !== 'jobs'}
  enableDelete={table !== 'accounts' && table !== 'jobs'}
  softDeleteOption={table === 'ai_questions'}
  showTransactionCount={table === 'accounts' || table === 'jobs'}
  foreignKeyFields={getForeignKeyConfig(table)}
  validationRules={getValidationRules(table)}
  customActions={getCustomActions(table)}
  modalSize={table === 'system_variables' ? 'large' : 'medium'}
  exportFilename={`${table}_export_${date}.csv`}
  ... // 20 more props
/>
```

**The Problem:**
Generic components become:
- **Hard to understand:** New developer must learn 25 props
- **Hard to test:** Combinatorial explosion of prop combinations
- **Hard to modify:** Change one prop behavior, risk breaking 7 tables
- **Not actually reusable:** Each table has unique config object anyway

**Better Approach: Composition**

```typescript
// Small, truly reusable primitives
<Table>
  <TableHeader sortable onSort={handleSort}>
    <TableColumn>Manager Name</TableColumn>
    <TableColumn>Region</TableColumn>
  </TableHeader>
  <TableBody>
    {managers.map(manager => (
      <TableRow key={manager.id}>
        <TableCell>{manager.name}</TableCell>
        <TableCell>{manager.region_name}</TableCell>
        <TableCell>
          <EditButton onClick={() => edit(manager)} />
          <DeleteButton onClick={() => delete(manager)} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TablePagination page={page} onPageChange={handlePageChange} />
</Table>
```

✅ Pros: Explicit, flexible, easy to customize per table
❌ Cons: More code per table (but clearer code)

**RECOMMENDATION:** Start with composition, extract shared logic (not components) into hooks:

```typescript
// Reusable logic, not components
const { data, loading, error } = useAdminTable('managers', { page, filters });
const { handleSort, handleFilter } = useTableControls();
const { showDeleteModal, confirmDelete } = useDeleteConfirmation();
```

---

#### CONCERN #8: Form Validation — Client vs. Server

**The Spec:**
Section 7.2 (Data Validation Rules) lists validation rules (required fields, max length, regex patterns).

**The Question:**
Where does validation happen? Client-side only? Server-side only? Both?

**Scenario Matrix:**

| Validation | Client Only | Server Only | Both |
|-----------|------------|-------------|------|
| **User Experience** | Instant feedback | Slow (round-trip) | Best of both |
| **Security** | Bypassable | Secure | Secure |
| **Code Duplication** | No | No | Yes |
| **Maintenance** | Easy | Easy | Hard (keep in sync) |

**Real-World Example:**

**Client Validation (Zod schema):**
```typescript
const managerSchema = z.object({
  manager_name: z.string().min(1).max(100),
  region_id: z.number().positive(),
});
```

**Server Validation (Pydantic model):**
```python
class ManagerCreate(BaseModel):
    manager_name: str = Field(..., min_length=1, max_length=100)
    region_id: int = Field(..., gt=0)
```

**The Problem:**
- Rules defined twice (TypeScript + Python)
- If you change max length to 200, must update both
- Easy to forget one, leading to mismatch

**Advanced Validation That Can't Be Client-Side:**
- Uniqueness checks (e.g., category_code must be unique) → requires database query
- Foreign key validation (e.g., region_id must exist) → requires database query
- Business logic (e.g., fiscal_year_start_month must be 1-12) → could be client or server

**Mitigation Strategies:**

**Option 1: Duplicate Validation (RECOMMENDED for this project)**
- Client-side for UX (instant feedback)
- Server-side for security (can't be bypassed)
- Accept duplication as cost of good UX + security

**Option 2: Server-Side Only**
- Simpler (single source of truth)
- Slower UX (must wait for server response)
- Acceptable for admin tools (not customer-facing)

**Option 3: Generate Client Schemas from Server**
- Use tools like `openapi-typescript` to generate Zod schemas from Pydantic models
- Complex setup, may not cover all cases

**RECOMMENDATION:** Option 1 (duplicate validation). Test both layers independently. Document validation rules in one place (Technical SRS), ensure both implementations match.

---

#### CONCERN #9: Dropdown Selects with Large Option Lists

**The Spec:**
FR-6.4 (Jobs Edit Form) specifies:
```
Manager (dropdown of active managers, nullable)
Parent Job (dropdown of other jobs, nullable, cannot select self)
```

**Scenario: Large Datasets**

| Table | Estimated Records | Dropdown Impact |
|-------|------------------|----------------|
| Managers | 50 | Fine |
| Jobs | 2,000 | Slow to render, hard to find |
| Accounts | 5,000 | Unusable |

**User Experience:**
- User opens "Edit Job" form
- Parent Job dropdown loads... 2,000 options
- Browser freezes for 2 seconds rendering `<option>` elements
- User scrolls through 2,000 options to find "Project ABC"
- Painful

**Solutions:**

**Option 1: Autocomplete/Typeahead**
```typescript
<Autocomplete
  onSearch={(query) => fetchJobs({ search: query, limit: 20 })}
  placeholder="Type to search jobs..."
  renderOption={(job) => `${job.job_id} - ${job.job_name}`}
/>
```
✅ Pros: Fast, handles unlimited options, better UX
❌ Cons: More complex component, requires backend search API

**Option 2: Lazy-Loaded Dropdown**
```typescript
<Select
  options={visibleOptions}  // Only first 100
  onScrollToBottom={() => loadMore()}
  isLoading={loading}
/>
```
✅ Pros: Still familiar dropdown UI, handles large lists
❌ Cons: User must scroll to load more (awkward)

**Option 3: Modal Picker**
```typescript
<Button onClick={openJobPickerModal}>Select Parent Job</Button>
<JobPickerModal
  onSelect={(job) => setParentJob(job)}
  filters={['Active', 'Commercial']}
  search={true}
/>
```
✅ Pros: Full search/filter UI, best for large datasets
❌ Cons: More clicks (opens modal), different interaction pattern

**RECOMMENDATION:**
- Managers dropdown: Plain `<select>` (< 100 options)
- Parent Job dropdown: Autocomplete/typeahead (2,000+ options)
- Categories dropdown: Plain `<select>` (< 50 options)

Add NFR: "Dropdowns with > 100 options SHALL use autocomplete component."

---

### 12.4 Testing & Quality Concerns

#### CONCERN #10: "Example Test Cases" — But No Coverage Targets

**The Spec:**
Section 9 (Testing Requirements) provides example test cases:
```python
def test_create_category_success():
def test_create_category_duplicate_code():
def test_delete_category_with_questions():
```

**What's Missing:**
- How many tests are enough?
- What coverage percentage is required?
- What happens if tests fail in CI/CD?

**Coverage Gaps:**

| Test Type | Mentioned in Spec? | Critical? |
|-----------|-------------------|-----------|
| Happy path CRUD | ✅ Yes | ✅ |
| Validation errors | ✅ Yes | ✅ |
| Referential integrity | ✅ Yes | ✅ |
| Concurrent edits | ❌ No | ✅ |
| SQL injection | ❌ No | ✅ |
| XSS in text fields | ❌ No | ✅ |
| Performance (load testing) | ❌ No | ⚠️ |
| Accessibility (WCAG) | ❌ No | ⚠️ |

**Real-World Risks:**

**SQL Injection (even with ORM):**
```python
# BAD (if someone did this):
db.execute(f"SELECT * FROM managers WHERE name = '{user_input}'")

# GOOD (SQLAlchemy handles escaping):
db.query(Manager).filter(Manager.name == user_input).all()
```

**XSS in React:**
React escapes by default, but:
```typescript
// DANGEROUS:
<div dangerouslySetInnerHTML={{__html: question.question_text}} />

// SAFE:
<div>{question.question_text}</div>
```

**Concurrent Edit Example:**
```python
# Two users edit same manager simultaneously:
# User A: Loads manager, sees region=1
# User B: Loads manager, sees region=1
# User A: Updates to region=2, saves
# User B: Updates to region=3, saves (overwrites A's change!)
```

**Mitigation:**

**Test Coverage Requirements:**
- **Backend:** 80% code coverage (pytest-cov)
- **Frontend:** 70% code coverage (Jest + React Testing Library)
- **Integration Tests:** All CRUD happy paths + error cases
- **Security Tests:** Test for SQL injection, XSS, CSRF
- **Performance Tests:** Pagination with 10k records, concurrent user simulation

**CI/CD Enforcement:**
```yaml
# GitHub Actions example
- name: Run tests
  run: pytest --cov=. --cov-fail-under=80
```

**RECOMMENDATION:** Add specific coverage targets and security test requirements to Section 9.

---

### 12.5 Summary: Critical Implementation Risks

| Risk Area | Primary Concern | Impact | Recommended Action |
|-----------|----------------|--------|-------------------|
| **Performance** | Transaction count queries will degrade | High | Add materialized views or caching |
| **Data Integrity** | Race conditions in ref integrity checks | Medium | Use database constraints + pessimistic locking |
| **Schema** | "No migrations needed" is unrealistic | Medium | Plan Alembic migrations for audit fields |
| **API Design** | Replicating Mod 0001 without audit | Medium | Review Mod 0001 for N+1 queries, performance |
| **Frontend** | Dropdown with 2,000 options unusable | High | Use autocomplete for large option lists |
| **Testing** | No coverage targets, security tests missing | High | Require 80% backend, 70% frontend coverage |
| **Component Reuse** | Generic components become config hell | Low | Use composition over configuration |
| **Validation** | Client/server duplication | Low | Accept duplication, document carefully |

---

### 12.6 Revised Non-Functional Requirements

Based on concerns raised, **add these NFRs:**

**NFR-6: Database Performance**
- Transaction count queries SHALL use caching or materialized views
- Pagination queries SHALL complete in < 300ms at any offset
- Referential integrity checks SHALL use database indexes

**NFR-7: Dropdown Usability**
- Dropdowns with > 100 options SHALL use autocomplete/typeahead
- Autocomplete SHALL return results in < 500ms
- Dropdown searches SHALL support partial matching

**NFR-8: Test Coverage**
- Backend code coverage SHALL be ≥ 80%
- Frontend code coverage SHALL be ≥ 70%
- All CRUD endpoints SHALL have integration tests
- Security tests SHALL cover SQL injection, XSS, CSRF

**NFR-9: Concurrent Edit Handling**
- Update operations SHALL use optimistic locking (check `updated_at`)
- Stale edit attempts SHALL return 409 Conflict with clear error
- User SHALL be prompted to reload and retry

**NFR-10: Error Recovery**
- Failed operations SHALL rollback completely (database transactions)
- Network errors SHALL be retryable (exponential backoff, max 3 attempts)
- User SHALL see clear error messages with suggested actions

---

### 12.7 Recommended Scope Additions

**MUST ADD (Before Development Starts):**

1. **Alembic Migration Script**
   - Add `is_active`, `created_at`, `updated_at` to tables lacking them
   - Add indexes on all foreign keys
   - Add triggers for auto-updating `updated_at`

2. **Performance Optimization Strategy**
   - Implement caching for transaction counts (Redis or in-memory)
   - Create materialized view for account/job counts
   - Document refresh strategy (nightly cron job)

3. **Autocomplete Component**
   - Reusable autocomplete for Jobs, Parent Jobs
   - Backend API: `GET /api/admin/jobs?search=query&limit=20`
   - Debounced search (300ms delay)

4. **Optimistic Locking**
   - Add `version` or use `updated_at` for conflict detection
   - Return 409 Conflict on stale updates
   - Frontend retry logic with user confirmation

**SHOULD ADD (Phase 1):**

5. **Basic Audit Logging**
   - Log all CRUD operations to file: `{timestamp, table, record_id, action, user}`
   - Rotate logs daily, retain for 90 days
   - Use Python `logging` library (minimal overhead)

6. **Soft Delete for All Tables**
   - Add `is_active` column to all tables
   - Default to soft delete, hard delete as admin option
   - Filter inactive records from dropdowns

7. **Improved Error Messages**
   - Map database constraint violations to user-friendly messages
   - Show dependency tree before delete: "This will affect X managers, Y jobs"

---

**Naysayer Technical Review Complete.**

The Technical SRS is thorough and well-structured, but underestimates several implementation challenges:
- Performance degradation from expensive JOIN queries
- Race conditions in referential integrity checks
- Usability issues with large dropdown lists
- Missing test coverage targets and security tests

Addressing the MUST ADD recommendations will prevent costly refactoring and performance issues post-launch.

**End of Naysayer Technical Review**
