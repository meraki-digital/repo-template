# Changelog

All notable changes between project versions are documented in this file.

## [reorg] - 2025-11-02

### Major Structural Changes
Complete reorganization of project structure with introduction of comprehensive `agentic/` directory hierarchy.

### Added

#### Documentation & Project Management
- **AGENTS.md**: Comprehensive AI agent configuration and workflow documentation (408 additions)
- **agentic/checkpoints/**: Project checkpoint tracking system
  - 8 financial checkpoint versions (v01-v08)
  - INDEX.md for checkpoint navigation
- **agentic/correspondence/**: Client communication records
  - Project status recap documents (2 versions)
  - PDF export of status recap
- **agentic/docs/**: Deployment and operational documentation
  - deployment-steps.md

#### Task Management & Planning
- **agentic/tasks/**: Complete task workflow system
  - 01-discover-requirements.md
  - 02-create-prd.md (moved from root)
  - 03-generate-tasks.md (moved from root)
  - 04-explainer.md
  - 05-process-task-list.md
  - 06-generate-status-recap.md
  - sample_commands.md

#### Technology Explainers (127 files)
Comprehensive technology documentation covering:
- **Cloud & Infrastructure**: AWS services (API Gateway, CloudWatch, DynamoDB, ECS, EventBridge, IAM, Lambda, RDS, X-Ray), Vercel
- **Backend**: FastAPI, Python 3.11, Pydantic v2, SQLAlchemy, Uvicorn, Starlette
- **Frontend**: React 18/19, TypeScript 5, Vite, Tailwind CSS 3, Headless UI
- **Data & Analytics**: PostgreSQL, dbt, Prefect, Airbyte, pgVector, Star Schema, Data Warehouse concepts
- **Development Tools**: Git, GitHub, ESLint, Prettier, Husky, Black, Ruff, MyPy
- **Testing**: Pytest, Vitest, Playwright, React Testing Library, K6
- **Authentication**: JWT, bcrypt, custom JWT implementation, RBAC, invite-only registration
- **Data Science**: NumPy, scikit-learn, Prophet, statsmodels
- **Documentation**: Markdown, JSDoc, TypeDoc, Swagger UI
- **Utilities**: Axios, date-fns, Faker, Zod
- And many more...

#### Project Modules (mods/0000-0100)
Detailed specifications and documentation for project iterations:
- **0000**: Superscapes POC (PRD, SRS, tasks, tech stack, seed)
- **0001**: AI Question Library (PRD, SRS, tasks, tech stack, seed)
- **0002**: Date Range Picker & Admin Nav (PRD, SRS with executive version, tasks, tech stack)
- **0003**: Admin CRUD Interface (seed, executive/technical SRS)
- **0004-0006**: Seed documents for upcoming features
- **0007**: Authentication & RDS Management (complete documentation suite)
- **0008**: SS Financial (PRD, SRS, tasks - processed and standard)
- **0100**: Superscapes Financial MVP (PRD, SRS, tasks, comprehensive tech stack, seed)

#### Scripts & Automation
- **agentic/scripts/**: Operational shell scripts
  - pre-push-check.sh: Pre-commit validation
  - restore-prod.sh: Production restoration procedures
  - sync-dev-to-prod.sh: Environment synchronization
  - test-local.sh: Local testing automation

#### Notes & Communication
- **agentic/notes/**: Team communication records
  - discord.md: Discord channel notes
  - steven.md: Stakeholder notes
- **agentic/agents.d/**: Agent-specific configurations
  - discord.md: Discord bot configuration

### Changed
- **LICENSE**: Updated/modified (222 changes)
- **readme.md**: Significant updates to project documentation (158 changes)
- **agentic/tasks/03-generate-tasks.md**: Minor refinements (11 changes)

### Removed
- **create-prd.md**: Removed from root (56 deletions) - integrated into agentic/tasks/
- **generate-tasks.md**: Removed from root - moved to agentic structure

### Statistics
- **171 files changed**
- **43,483 insertions**
- **365 deletions**
- Net addition of **43,118 lines**

---

## [carson] - 2025-11-02

### Initial Version
Early version of the repository template project.

### Structure
- Root-level task files (create-prd.md, generate-tasks.md)
- Basic LICENSE and readme.md
- Simple tasks directory structure
- AGENTS.md configuration

### Characteristics
- Minimal organizational structure
- Task files at root level
- Basic documentation
- Foundation for future expansion
