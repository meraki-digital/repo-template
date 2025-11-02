# Technology Stack - Module 0001
## AI Question Library & Response Format Enhancement

**Project Code:** 0001  
**Parent Project:** Module 0010  
**Last Updated:** October 29, 2025

---

## Overview

This document lists technologies required for Module 0001. Most technologies are inherited from Module 0010.

**For Module 0010 complete tech stack**, see: `../0010/0010-tech-stack.md`

---

## New Technologies (Not in Module 0010)

### Frontend Libraries

- **react-syntax-highlighter** [📚](../../../agentic/tasks/explainers/react-syntax-highlighter.md) - React component for syntax highlighting SQL code in modals

### Backend Libraries

- **sqlparse** [📚](../../../agentic/tasks/explainers/sqlparse.md) - Python library for parsing and formatting SQL queries for display

---

## Inherited Technologies (From Module 0010)

**Frontend:**
- React 18+, TypeScript 5.0+, Vite
- Tailwind CSS, Headless UI
- Recharts (for chart rendering)
- TanStack Table (for data tables)
- TanStack Query (React Query)
- Axios, React Router v6
- React Hook Form, Zod
- Vitest, React Testing Library, Playwright

**Backend:**
- FastAPI, Python 3.11+, Uvicorn
- SQLAlchemy, Alembic, Pydantic
- python-jose (JWT), passlib (passwords)
- pytest, openpyxl (Excel export)

**Database:**
- PostgreSQL 14+, pgvector
- AWS RDS

**Infrastructure:**
- AWS ECS Fargate, Vercel
- AWS ALB, S3, Secrets Manager, CloudWatch
- Terraform, GitHub Actions

**Communication:**
- Microsoft Teams API

---

## Optional New Technologies (Decisions Pending)

### Frontend (Optional)

- **SheetJS (xlsx)** - Client-side Excel generation (alternative to backend openpyxl)
  - Decision: Use Module 0010 backend export vs add client-side library
  - Recommendation: Reuse Module 0010 backend export (no new dependency)

- **@dnd-kit** or **react-beautiful-dnd** - Drag-and-drop for question reordering
  - Decision: Drag-drop vs up/down arrow buttons  
  - Recommendation: Start with arrow buttons (no new dependency)

---

## New Database Tables

- **core.ai_question_categories** - Question category master data
- **core.ai_example_questions** - Example question library

---

## New API Endpoints

- `GET /ai/example-questions` - Retrieve question library
- `POST /ai/question-clicked` - Track question usage
- `POST /ai/explain-sql` - Generate plain English SQL explanation
- `GET /admin/ai-questions` - Admin: List all questions
- `POST /admin/ai-questions` - Admin: Create question
- `PATCH /admin/ai-questions/{id}` - Admin: Update question
- `DELETE /admin/ai-questions/{id}` - Admin: Soft delete question
- `GET /admin/ai-categories` - Admin: List categories
- `POST /admin/ai-categories` - Admin: Create category
- `PATCH /admin/ai-categories/{id}` - Admin: Update category
- `GET /admin/ai-question-analytics` - Admin: Usage statistics

**Modified Endpoints:**
- `POST /ai/query` - Enhanced to return metadata (row_count, column_types, recommended_display_type)

---

## Recommended Technology Decisions

**Syntax Highlighting:** react-syntax-highlighter ✅ (required)

**SQL Formatting:** sqlparse ✅ (required)

**Excel Export:** Reuse Module 0010 backend (openpyxl) - no new dependency ✅

**Drag-Drop:** Use arrow buttons initially - no new dependency ✅

**Total New Dependencies:** 2 libraries only

---

## Summary

**New Technologies:** 2 libraries (react-syntax-highlighter, sqlparse)  
**Reused from Module 0010:** 95% of tech stack  
**Total New Dependencies:** Minimal - maximizes existing infrastructure leverage  

This focused feature enhancement requires only syntax highlighting and SQL formatting libraries, keeping the tech footprint lean.
