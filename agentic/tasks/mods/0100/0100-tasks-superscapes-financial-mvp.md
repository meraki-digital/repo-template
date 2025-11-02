# Task List: Superscapes Financial Intelligence Dashboard - MVP

**Based on:** `0001-prd-superscapes-financial-mvp.md`
**Project Code:** 0001
**Target Timeline:** 18 weeks
**Created:** October 25, 2025

---

## Relevant Files

### Infrastructure & Configuration
- `.env.dev` - Development environment variables (RDS connection)
- `mvp/infrastructure/terraform/main.tf` - AWS infrastructure definition
- `mvp/infrastructure/terraform/variables.tf` - Terraform variables
- `mvp/infrastructure/terraform/outputs.tf` - Terraform outputs
- `.github/workflows/ci.yml` - CI/CD pipeline for testing and building
- `.github/workflows/deploy-staging.yml` - Staging deployment automation
- `.github/workflows/deploy-production.yml` - Production deployment automation
- `.env.example` - Environment variable template
- `.env.local` - Local development environment variables (git-ignored)

### Backend (FastAPI)
- `mvp/backend/Dockerfile` - Backend container definition
- `mvp/backend/requirements.txt` - Python dependencies
- `mvp/backend/requirements-dev.txt` - Development dependencies
- `mvp/backend/main.py` - FastAPI application entry point
- `mvp/backend/config.py` - Application configuration and settings
- `mvp/backend/database.py` - Database connection and session management
- `mvp/backend/models/` - SQLAlchemy ORM models directory
- `mvp/backend/models/__init__.py` - Models module initialization
- `mvp/backend/models/user.py` - User model for authentication
- `mvp/backend/models/audit_log.py` - Audit log model
- `mvp/backend/schemas/` - Pydantic request/response schemas
- `mvp/backend/schemas/auth.py` - Authentication schemas
- `mvp/backend/schemas/dashboard.py` - Dashboard data schemas
- `mvp/backend/api/` - API route handlers directory
- `mvp/backend/api/__init__.py` - API module initialization
- `mvp/backend/api/auth.py` - Authentication endpoints
- `mvp/backend/api/dashboard.py` - Dashboard data endpoints
- `mvp/backend/api/admin.py` - Admin endpoints
- `mvp/backend/services/` - Business logic services
- `mvp/backend/services/auth_service.py` - Authentication service
- `mvp/backend/services/audit_service.py` - Audit logging service
- `mvp/backend/middleware/` - Custom middleware
- `mvp/backend/middleware/auth.py` - JWT authentication middleware
- `mvp/backend/middleware/rate_limit.py` - Rate limiting middleware
- `mvp/backend/tests/` - Backend test directory
- `mvp/backend/tests/conftest.py` - Pytest configuration and fixtures
- `mvp/backend/tests/test_auth.py` - Authentication tests
- `mvp/backend/tests/test_dashboard.py` - Dashboard endpoint tests

### Database
- `mvp/database/migrations/` - Alembic migration scripts directory
- `mvp/database/migrations/env.py` - Alembic environment configuration
- `mvp/database/migrations/versions/001_initial_schema.py` - Initial schema migration
- `mvp/database/migrations/versions/002_create_dimensions.py` - Dimension tables migration
- `mvp/database/migrations/versions/003_create_facts.py` - Fact tables migration
- `mvp/database/migrations/versions/004_create_semantic_views.py` - Semantic layer views
- `mvp/database/seeds/` - Seed data for testing
- `mvp/database/seeds/seed_dimensions.sql` - Seed dimension table data
- `mvp/database/seeds/seed_facts.sql` - Seed fact table data
- `mvp/database/scripts/backup.sh` - Database backup script
- `mvp/database/scripts/restore.sh` - Database restore script

### ETL Pipeline
- `mvp/etl/Dockerfile` - ETL container definition
- `mvp/etl/requirements.txt` - Python ETL dependencies
- `mvp/etl/prefect_config.py` - Prefect orchestration configuration
- `mvp/etl/flows/` - Prefect flow definitions
- `mvp/etl/flows/sage_extract.py` - Sage data extraction flow
- `mvp/etl/flows/time_tracking_extract.py` - Time tracking data extraction flow
- `mvp/etl/flows/equipment_extract.py` - Equipment/fleet data extraction flow
- `mvp/etl/flows/aspire_extract.py` - Aspire system data extraction flow
- `mvp/etl/flows/reconciliation.py` - Data reconciliation flow
- `mvp/etl/connectors/` - Data source connectors
- `mvp/etl/connectors/sage_connector.py` - Sage ODBC/API connector (includes payroll from Sage)
- `mvp/etl/connectors/time_tracking_connector.py` - Time tracking system connector
- `mvp/etl/connectors/equipment_connector.py` - Equipment/fleet management connector
- `mvp/etl/connectors/aspire_connector.py` - Aspire system connector
- `mvp/etl/dbt_project/` - dbt transformation project
- `mvp/etl/dbt_project/dbt_project.yml` - dbt project configuration
- `mvp/etl/dbt_project/models/staging/` - Staging models
- `mvp/etl/dbt_project/models/core/` - Core dimensional models
- `mvp/etl/dbt_project/models/semantic/` - Semantic layer models
- `mvp/etl/dbt_project/tests/` - dbt data quality tests
- `mvp/etl/tests/` - ETL pipeline tests
- `mvp/etl/tests/test_sage_extract.py` - Sage extraction tests
- `mvp/etl/tests/test_reconciliation.py` - Reconciliation logic tests

### Frontend (React)
- `mvp/frontend/Dockerfile` - Frontend container definition
- `mvp/frontend/package.json` - Node.js dependencies
- `mvp/frontend/vite.config.ts` - Vite build configuration
- `mvp/frontend/tsconfig.json` - TypeScript configuration
- `mvp/frontend/tailwind.config.js` - Tailwind CSS configuration
- `mvp/frontend/src/main.tsx` - React application entry point
- `mvp/frontend/src/App.tsx` - Main App component
- `mvp/frontend/src/router.tsx` - React Router configuration
- `mvp/frontend/src/api/` - API client directory
- `mvp/frontend/src/api/client.ts` - Axios HTTP client with auth interceptors
- `mvp/frontend/src/api/auth.ts` - Authentication API calls
- `mvp/frontend/src/api/dashboard.ts` - Dashboard API calls
- `mvp/frontend/src/contexts/` - React Context providers
- `mvp/frontend/src/contexts/AuthContext.tsx` - Authentication context
- `mvp/frontend/src/hooks/` - Custom React hooks
- `mvp/frontend/src/hooks/useAuth.ts` - Authentication hook
- `mvp/frontend/src/components/` - Reusable UI components
- `mvp/frontend/src/components/Layout/` - Layout components
- `mvp/frontend/src/components/Layout/Navbar.tsx` - Top navigation bar
- `mvp/frontend/src/components/Layout/Sidebar.tsx` - Left sidebar navigation
- `mvp/frontend/src/components/Dashboard/` - Dashboard components
- `mvp/frontend/src/components/Dashboard/KPICard.tsx` - KPI metric card
- `mvp/frontend/src/components/Dashboard/KPICard.test.tsx` - KPI card tests
- `mvp/frontend/src/pages/` - Page components
- `mvp/frontend/src/pages/Login.tsx` - Login page
- `mvp/frontend/src/pages/Dashboard.tsx` - Main dashboard page
- `mvp/frontend/src/utils/` - Utility functions
- `mvp/frontend/src/utils/formatters.ts` - Data formatting utilities
- `mvp/frontend/src/utils/formatters.test.ts` - Formatter tests
- `mvp/frontend/src/types/` - TypeScript type definitions
- `mvp/frontend/src/types/api.ts` - API response types
- `mvp/frontend/tests/` - Frontend test directory
- `mvp/frontend/tests/setup.ts` - Vitest test setup

### Documentation
- `mvp/docs/README.md` - Project documentation home
- `mvp/docs/setup.md` - Local development setup guide
- `mvp/docs/deployment.md` - Deployment guide
- `mvp/docs/api.md` - API documentation
- `mvp/docs/architecture.md` - System architecture documentation

### Notes

- **Monorepo approach:** MVP development happens in `mvp/` subdirectory of this repository (alongside POC in `poc/`)
- Task 0.0 creates a dedicated Git branch for all MVP development work
- This builds upon the POC foundation - leverage working components from `poc/` where possible
- Tech stack: React 18+ (TypeScript), FastAPI (Python), PostgreSQL, AWS ECS Fargate, Vercel
- See `0001-tech-stack.md` for complete technology decisions and rationale
- Unit tests should be placed alongside code files (e.g., `component.tsx` and `component.test.tsx`)
- Backend tests use pytest; Frontend tests use Vitest
- All development follows the phased approach defined in the PRD
- Use `pytest` to run backend tests, `npm run test` to run frontend tests
- **Local development:** No Docker required - run Python/Node.js natively with RDS dev instance
- **Production deployment:** Vercel (frontend), ECS Fargate (backend/ETL), RDS (database)

---

## Tasks

- [ ] **0.0 Create Development Branch**
  - [ ] 0.1 Create a new Git branch named `feature/mvp-superscapes-financial-dashboard` from `main`
  - [ ] 0.2 Push the empty branch to remote repository
  - [ ] 0.3 Set up branch protection rules (require PR reviews, passing CI before merge)

- [ ] **1.0 Project Setup & Infrastructure Foundation**
  - [ ] 1.1 Create MVP project structure within this repository: `mvp/backend/`, `mvp/frontend/`, `mvp/etl/`, `mvp/database/`, `mvp/infrastructure/`, `mvp/docs/`
  - [ ] 1.2 Initialize backend Python project: create `mvp/backend/` directory, set up virtual environment, create `mvp/backend/requirements.txt` with FastAPI, SQLAlchemy, Pydantic, python-jose, passlib, pytest, and `mvp/backend/requirements-dev.txt` with development tools
  - [ ] 1.3 Initialize frontend React project: use Vite to scaffold React + TypeScript project in `mvp/frontend/`, install dependencies (React Router, Axios, TanStack Query, Tailwind CSS, Recharts, React Hook Form, Zod), configure `mvp/frontend/vite.config.ts` and `mvp/frontend/tsconfig.json`
  - [ ] 1.4 Create Docker configuration for production: write `mvp/backend/Dockerfile` (Python 3.11 base image, install dependencies, expose port 8000), `mvp/etl/Dockerfile` (Python 3.11 for ETL jobs) - no frontend Dockerfile needed (Vercel handles deployment)
  - [ ] 1.5 Set up AWS RDS dev instance: provision RDS PostgreSQL 14+ instance for development, enable pgvector extension, configure security groups for developer access, create database credentials in Secrets Manager, document connection details for team
  - [ ] 1.6 Create environment variable templates: `.env.example` with placeholders for DATABASE_URL (RDS connection), JWT_SECRET_KEY, OPENAI_API_KEY, AWS credentials, Sage credentials, and create `.env.dev` for local development (git-ignored)
  - [ ] 1.7 Set up Terraform infrastructure-as-code: create `mvp/infrastructure/terraform/` directory, write `mvp/infrastructure/terraform/main.tf` defining AWS VPC, RDS PostgreSQL instance, ECS Fargate cluster, S3 buckets, Secrets Manager, create `mvp/infrastructure/terraform/variables.tf` and `mvp/infrastructure/terraform/outputs.tf`
  - [ ] 1.8 Create GitHub Actions CI/CD workflows: `.github/workflows/ci.yml` for linting and testing on PR, `.github/workflows/deploy-staging.yml` for staging deployment on merge to main, `.github/workflows/deploy-production.yml` for manual production deployment
  - [ ] 1.9 Initialize documentation: create `mvp/docs/` directory with `mvp/docs/README.md`, `mvp/docs/setup.md` (local development guide), `mvp/docs/deployment.md` (AWS deployment instructions), `mvp/docs/architecture.md` (system architecture overview)
  - [ ] 1.10 Configure code quality tools: create `.eslintrc.js` and `.prettierrc` for frontend, create `pyproject.toml` with Black and Ruff configuration for backend, set up pre-commit hooks with Husky
  - [ ] 1.11 Create root `README.md` with project overview, quick start instructions (install Python 3.11+, Node.js 18+, connect to RDS dev instance), links to detailed docs, and tech stack summary
  - [ ] 1.12 Set up Vercel project: create Vercel account/project, connect GitHub repository, configure build settings (build command: `npm run build`, output directory: `dist`), add environment variables (API URL), enable automatic deployments from main branch
  - [ ] 1.13 Verify local development environment: connect to RDS dev instance with psql, run backend with `uvicorn backend.main:app --reload` (port 8000), run frontend with `npm run dev` (port 5173), create basic health check endpoint `/health` in backend returning `{"status": "ok"}`, verify frontend can call backend API

- [ ] **2.0 Database & Data Model Implementation**
  - [ ] 2.1 Set up Alembic for database migrations: install Alembic, create `database/migrations/` directory, initialize Alembic with `alembic init`, configure `env.py` to use SQLAlchemy models and connection string from environment
  - [ ] 2.2 Create initial schema migration: write `database/migrations/versions/001_initial_schema.py` to create core, raw, and semantic schemas, create audit_log table, create users table with columns (user_id, username, email, hashed_password, role, status, created_at, last_login)
  - [ ] 2.3 Create dimension tables migration: write `database/migrations/versions/002_create_dimensions.py` to create `core.dim_date` (pre-populated with 10 years of dates), `core.dim_account`, `core.dim_region`, `core.dim_division`, `core.dim_customer`, `core.dim_job`, `core.dim_employee` with appropriate columns, indexes, and foreign key constraints per PRD section 7.3
  - [ ] 2.4 Create fact tables migration: write `database/migrations/versions/003_create_facts.py` to create `core.fact_transaction`, `core.fact_payroll`, `core.fact_job_cost` with appropriate columns, indexes on foreign keys and date columns, unique constraints on transaction_id/source_system combinations
  - [ ] 2.5 Create semantic layer views migration: write `database/migrations/versions/004_create_semantic_views.py` to create materialized views `semantic.monthly_financials` and `semantic.job_profitability` with SQL definitions from PRD section 7.3, create indexes on year/month and region/division columns
  - [ ] 2.6 Install and configure pgvector extension: add pgvector installation to PostgreSQL Docker image or RDS setup, create migration to enable pgvector extension, create embeddings table for AI context storage with columns (embedding_id, content_type, content_text, embedding vector(1536), created_at)
  - [ ] 2.7 Create database seed data scripts: write `database/seeds/seed_dimensions.sql` with sample regions (Northeast, Southeast, Midwest, West), divisions (Maintenance, Design-Build, Seasonal), accounts (Revenue, Labor, Materials, Overhead categories), write `database/seeds/seed_facts.sql` with sample transactions for testing (1 month of data)
  - [ ] 2.8 Write database backup script: create `database/scripts/backup.sh` using `pg_dump` to backup to S3 with timestamp, include retention policy (keep 30 daily backups)
  - [ ] 2.9 Write database restore script: create `database/scripts/restore.sh` to restore from S3 backup by timestamp
  - [ ] 2.10 Run migrations locally: execute `alembic upgrade head` to create all tables and views, verify schema in PostgreSQL using `\dt core.*`, `\dt semantic.*`, verify materialized views created
  - [ ] 2.11 Load seed data: run seed scripts to populate dimension and fact tables, verify data with SELECT queries, refresh materialized views manually
  - [ ] 2.12 Create database documentation: document schema in `docs/database.md` with ER diagram (text-based), table descriptions, column definitions, indexing strategy

- [ ] **3.0 ETL Pipeline Development**
  - [ ] 3.1 Set up Prefect orchestration framework: install Prefect in `etl/requirements.txt`, create `etl/prefect_config.py` with Prefect server connection settings, work pool configuration, storage settings (use local for MVP, S3 for production)
  - [ ] 3.2 Create Sage data connector: write `etl/connectors/sage_connector.py` with class `SageConnector` implementing methods: `connect()` using ODBC or Sage API credentials from environment, `extract_gl_transactions(start_date, end_date)` returning DataFrame, `extract_payroll(start_date, end_date)` (from Sage payroll module), `get_chart_of_accounts()`, include error handling and connection retry logic
  - [ ] 3.3 Create Time Tracking connector: write `etl/connectors/time_tracking_connector.py` with class `TimeTrackingConnector` implementing methods: `connect()`, `extract_time_entries(start_date, end_date)` returning DataFrame with employee hours and job allocations, handle API pagination and rate limiting
  - [ ] 3.4 Create Equipment/Fleet connector: write `etl/connectors/equipment_connector.py` with class `EquipmentConnector` implementing methods: `connect()`, `extract_equipment_usage(start_date, end_date)` returning DataFrame with equipment usage, costs, maintenance
  - [ ] 3.5 Create Aspire connector: write `etl/connectors/aspire_connector.py` with class `AspireConnector` implementing methods: `connect()`, `extract_job_data(start_date, end_date)` returning DataFrame with job tracking data, resource allocation
  - [ ] 3.6 Write Sage extraction Prefect flow: create `etl/flows/sage_extract.py` with `@flow` decorator, implement tasks: extract GL transactions, extract payroll (from Sage), load to raw schema staging tables (`raw.stg_sage_gl`, `raw.stg_sage_payroll`), log row counts and execution time, handle errors with retries (3 attempts, exponential backoff)
  - [ ] 3.7 Write Time Tracking extraction Prefect flow: create `etl/flows/time_tracking_extract.py` with extraction logic loading to `raw.stg_time_tracking`, similar error handling
  - [ ] 3.8 Write Equipment extraction Prefect flow: create `etl/flows/equipment_extract.py` with extraction logic loading to `raw.stg_equipment`, similar error handling
  - [ ] 3.9 Write Aspire extraction Prefect flow: create `etl/flows/aspire_extract.py` with extraction logic loading to `raw.stg_aspire`, similar error handling
  - [ ] 3.10 Set up dbt project: create `etl/dbt_project/` directory, initialize with `dbt init`, configure `dbt_project.yml` with project name, profile (PostgreSQL connection), model paths, create `profiles.yml` for RDS database connections (dev and production)
  - [ ] 3.11 Create dbt staging models: write `etl/dbt_project/models/staging/stg_sage_transactions.sql` selecting from `raw.stg_sage_gl` with data type casting and null handling, create similar staging models for Sage payroll, time tracking, equipment, and Aspire data, add schema tests (not_null, unique) in `schema.yml`
  - [ ] 3.12 Create dbt core dimensional models: write `etl/dbt_project/models/core/dim_account.sql` transforming staging data into dimension table with SCD Type 1 logic (upsert based on account_number), create similar models for dim_region, dim_division, dim_customer, dim_job, dim_employee
  - [ ] 3.13 Create dbt fact models: write `etl/dbt_project/models/core/fact_transaction.sql` joining staging data with dimensions to get foreign keys, implementing incremental model (only new transactions since last run), create similar models for fact_payroll, fact_job_cost, fact_time_entry, fact_equipment_usage
  - [ ] 3.14 Create dbt semantic models: write `etl/dbt_project/models/semantic/monthly_financials.sql` as incremental materialized view, write `job_profitability.sql` similarly
  - [ ] 3.15 Write reconciliation flow: create `etl/flows/reconciliation.py` with `@flow` decorator, implement tasks: query Sage totals via connector, query warehouse totals from fact tables, calculate variance %, determine status (pass/warning/fail), write results to `core.reconciliation_log` table (source_system, reconciliation_date, source_total, warehouse_total, variance_pct, status), send Teams alert (via Microsoft Teams API) and email if status is fail
  - [ ] 3.16 Create master daily ETL flow: write `etl/flows/daily_etl.py` orchestrating sequence: run Sage extraction → run Time Tracking extraction → run Equipment extraction → run Aspire extraction → run dbt transformations (`dbt run --models core`) → run reconciliation → refresh semantic materialized views, configure to run at 2 AM daily via EventBridge, include success/failure notifications to Teams
  - [ ] 3.17 Create initial historical load script: write `etl/flows/historical_load.py` for one-time 3-year backfill, extract data in monthly chunks to avoid memory issues, disable reconciliation checks during historical load (reconcile at end), log progress after each month, send Teams notification on completion
  - [ ] 3.18 Write ETL tests: create `etl/tests/test_sage_extract.py` with pytest fixtures mocking Sage connector, test extraction logic returns correct DataFrame shape and columns, test error handling when connection fails, create `etl/tests/test_reconciliation.py` testing variance calculation logic and status determination
  - [ ] 3.19 Set up ETL monitoring: configure Prefect dashboard, create Teams alerts for flow failures, create monitoring dashboard showing last run status for each flow in CloudWatch
  - [ ] 3.20 Run and test ETL pipeline locally: connect to RDS dev instance, execute historical load for 1 month of sample data, verify staging tables populated, run dbt transformations and verify dimension/fact tables populated, run reconciliation and verify results, test daily incremental flow with new sample data

- [ ] **4.0 Backend API Development**
  - [ ] 4.1 Create FastAPI application structure: write `backend/main.py` with FastAPI app initialization, CORS middleware configuration (allow frontend origin), include routers for auth, dashboard, admin, add exception handlers for common errors (404, 500, validation errors), create `/health` endpoint
  - [ ] 4.2 Create database session management: write `backend/database.py` with SQLAlchemy engine creation using DATABASE_URL from environment, session factory, `get_db()` dependency for FastAPI routes yielding database sessions
  - [ ] 4.3 Create SQLAlchemy ORM models: write `backend/models/user.py` with `User` model matching users table schema, write `backend/models/audit_log.py` with `AuditLog` model, create `backend/models/__init__.py` importing all models
  - [ ] 4.4 Create Pydantic schemas: write `backend/schemas/auth.py` with `LoginRequest`, `LoginResponse`, `UserResponse` schemas, write `backend/schemas/dashboard.py` with `KPIMetric`, `DashboardOverviewResponse`, `RevenueDetailResponse` schemas matching API spec in PRD section 7.4, create `backend/schemas/__init__.py`
  - [ ] 4.5 Implement authentication service: write `backend/services/auth_service.py` with functions: `hash_password(password: str)` using passlib bcrypt, `verify_password(plain_password: str, hashed_password: str)`, `create_access_token(data: dict, expires_delta: timedelta)` generating JWT with python-jose, `decode_access_token(token: str)` validating and returning payload, `get_current_user(token: str, db: Session)` looking up user from token
  - [ ] 4.6 Implement audit logging service: write `backend/services/audit_service.py` with function `log_action(db: Session, user_id: str, action_type: str, action_detail: str, ip_address: str)` inserting into audit_log table
  - [ ] 4.7 Create authentication middleware: write `backend/middleware/auth.py` with JWT token verification middleware, attach current user to request state, write dependency `get_current_user()` for protected routes, write `require_role(allowed_roles: List[str])` dependency for RBAC
  - [ ] 4.8 Create rate limiting middleware: write `backend/middleware/rate_limit.py` using slowapi or simple in-memory counter, limit AI queries to 10 per minute per user, limit general API to 100 requests per minute per user
  - [ ] 4.9 Implement authentication endpoints: write `backend/api/auth.py` with `POST /auth/login` validating credentials, returning JWT token and user info, `POST /auth/logout` (placeholder - JWT is stateless), `GET /auth/me` returning current user info, include error responses for invalid credentials (401)
  - [ ] 4.10 Implement dashboard overview endpoint: write `backend/api/dashboard.py` with `GET /dashboard/overview` querying semantic.monthly_financials for current month and YTD KPIs, calculating prior period for comparison, formatting response per PRD section 7.4.2, apply filters from query parameters (date_from, date_to, region_ids, division_ids), include data_as_of timestamp from last ETL run
  - [ ] 4.11 Implement dashboard detail endpoints: in `backend/api/dashboard.py` create `GET /dashboard/revenue-detail` querying semantic views for revenue trends by region and division, create `GET /dashboard/jobs` querying semantic.job_profitability with pagination, sorting, filtering per PRD FR-403 and API spec
  - [ ] 4.12 Implement export endpoint: in `backend/api/dashboard.py` create `POST /export/dashboard` generating Excel/CSV/PDF files using openpyxl or pandas for Excel, built-in csv for CSV, reportlab or weasyprint for PDF, save to S3 with pre-signed URL, return download URL valid for 1 hour, include export metadata
  - [ ] 4.13 Implement admin ETL monitoring endpoints: write `backend/api/admin.py` with `GET /admin/etl-jobs` querying Prefect API for flow run history, `POST /admin/etl-jobs/{job_id}/run` triggering manual Prefect flow run, require Admin role
  - [ ] 4.14 Implement admin user management endpoints: in `backend/api/admin.py` create `GET /admin/users` with pagination, `POST /admin/users` creating new user with temporary password, `PATCH /admin/users/{user_id}` updating role or status, `POST /admin/users/{user_id}/reset-password`, all require Admin role
  - [ ] 4.15 Implement admin audit log endpoint: in `backend/api/admin.py` create `GET /admin/audit-logs` querying audit_log table with filters (date range, user, action type), pagination, `GET /admin/audit-logs/export` generating CSV download
  - [ ] 4.16 Implement reconciliation status endpoint: in `backend/api/admin.py` create `GET /admin/reconciliation-status` querying reconciliation_log table for latest status per source system, require Admin or Finance Analyst role
  - [ ] 4.17 Write backend tests: create `backend/tests/conftest.py` with pytest fixtures: test database session, test client, authenticated user tokens, write `backend/tests/test_auth.py` testing login success, login failure, token validation, role-based access, write `backend/tests/test_dashboard.py` testing overview endpoint returns correct schema, filters work correctly, pagination works
  - [ ] 4.18 Document API: FastAPI auto-generates OpenAPI spec at `/docs`, customize with descriptions and examples in route decorators, export OpenAPI JSON to `docs/api-spec.json`, write `docs/api.md` with endpoint descriptions and example requests/responses
  - [ ] 4.19 Run backend locally: start backend with `uvicorn backend.main:app --reload`, test `/health` endpoint returns 200, test Swagger UI at `http://localhost:8000/docs` shows all endpoints, test login endpoint with seed user data
  - [ ] 4.20 Run backend tests: execute `pytest backend/tests/` and verify all tests pass, check code coverage with `pytest --cov=backend`, aim for 70%+ coverage

- [ ] **5.0 Frontend Development**
  - [ ] 5.1 Set up frontend API client: write `frontend/src/api/client.ts` with Axios instance configured with base URL from environment, request interceptor to attach JWT token from localStorage to Authorization header, response interceptor to handle 401 (redirect to login) and other errors, export configured axios instance
  - [ ] 5.2 Create TypeScript types: write `frontend/src/types/api.ts` with interfaces matching backend Pydantic schemas: `User`, `LoginResponse`, `KPIMetric`, `DashboardOverviewResponse`, `RevenueDetailResponse`, `JobProfitabilityRow`, `PaginationResponse`, etc.
  - [ ] 5.3 Create authentication API module: write `frontend/src/api/auth.ts` with functions: `login(username: string, password: string)` calling `POST /auth/login`, `logout()` calling `POST /auth/logout`, `getCurrentUser()` calling `GET /auth/me`, each returning properly typed responses
  - [ ] 5.4 Create dashboard API module: write `frontend/src/api/dashboard.ts` with functions: `getDashboardOverview(filters)` calling `GET /dashboard/overview`, `getRevenueDetail(filters)`, `getJobs(params)`, `exportDashboard(config)`, all properly typed
  - [ ] 5.5 Create Authentication Context: write `frontend/src/contexts/AuthContext.tsx` with React Context providing: `user` state, `login(username, password)` function saving token to localStorage, `logout()` function clearing token, `isAuthenticated` computed value, wrap with TanStack Query for API calls
  - [ ] 5.6 Create custom hooks: write `frontend/src/hooks/useAuth.ts` consuming AuthContext, write `frontend/src/hooks/useDashboardData.ts` using TanStack Query to fetch dashboard data with caching and refetching
  - [ ] 5.7 Set up React Router: write `frontend/src/router.tsx` with routes: `/login` (public), `/` redirects to `/dashboard`, `/dashboard` (protected), `/dashboard/revenue`, `/dashboard/expenses`, `/dashboard/jobs`, `/dashboard/regional`, `/dashboard/divisional`, `/ai-analyst` (protected), `/admin/*` (protected, Admin only), create `ProtectedRoute` component checking authentication
  - [ ] 5.8 Create Login page: write `frontend/src/pages/Login.tsx` with form (username, password fields), using React Hook Form + Zod validation, call `login()` from AuthContext on submit, show error message on failure, redirect to dashboard on success, use Tailwind for styling
  - [ ] 5.9 Create Layout components: write `frontend/src/components/Layout/Navbar.tsx` with logo, data freshness indicator (fetch from API), user profile dropdown (show username, role, logout button), write `frontend/src/components/Layout/Sidebar.tsx` with navigation menu items conditionally showing Admin link based on role, collapsible on mobile
  - [ ] 5.10 Create reusable KPI Card component: write `frontend/src/components/Dashboard/KPICard.tsx` accepting props (title, value, changePercent, changeDirection), display formatted value, up/down arrow icon, percentage change with color (green for up, red for down), write unit test `KPICard.test.tsx` testing rendering with different props
  - [ ] 5.11 Create reusable Chart components: write `frontend/src/components/Dashboard/LineChart.tsx` wrapper around Recharts LineChart with consistent styling (colors, tooltips, axes), write `frontend/src/components/Dashboard/BarChart.tsx`, `PieChart.tsx` similarly, make data prop generic/typed
  - [ ] 5.12 Create utility formatters: write `frontend/src/utils/formatters.ts` with functions: `formatCurrency(value: number)` returning $X.XM format, `formatPercent(value: number)`, `formatDate(date: string)`, write unit tests in `formatters.test.ts`
  - [ ] 5.13 Create Dashboard Overview page: write `frontend/src/pages/Dashboard.tsx` using Layout (Navbar + Sidebar), fetch data with `useDashboardData()` hook, display 4 KPI cards (Revenue, Expenses, Margin, Profit), display Revenue Trend LineChart (12 months), Margin Trend LineChart, Revenue by Division PieChart, Expense Breakdown stacked BarChart, add filter bar (date range, region, division selectors) calling API with filter params on change
  - [ ] 5.14 Create Revenue Detail page: write `frontend/src/pages/RevenueDetail.tsx` fetching from `/dashboard/revenue-detail`, display multi-line chart (revenue by region over time), stacked area chart (revenue by division), data table (top 20 jobs), month-over-month bar chart, year-over-year comparison chart
  - [ ] 5.15 Create Job Profitability page: write `frontend/src/pages/JobProfitability.tsx` with TanStack Table displaying jobs with columns (Job Name, Region, Division, Revenue, Cost, Margin $, Margin %, Status), implement sorting by clicking column headers, implement pagination (50 rows per page, prev/next buttons), implement search input filtering by job name, implement filter dropdowns (region, division, margin range)
  - [ ] 5.16 Create Regional Performance page: write `frontend/src/pages/RegionalPerformance.tsx` with comparison table showing revenue and margin by region (current month vs YTD), individual trend charts for each region (small multiples layout)
  - [ ] 5.17 Create Division Performance page: write `frontend/src/pages/DivisionPerformance.tsx` similar structure to Regional Performance but for divisions
  - [ ] 5.18 Create AI Analyst page: write `frontend/src/pages/AIAnalyst.tsx` with chat interface: conversation history panel showing user questions and AI responses (scrollable), text input and "Ask" button at bottom, "Clear Conversation" button, display AI responses with narrative text, embedded charts (render using Chart components), SQL preview (collapsible, only show for Finance Analyst+ roles), suggested questions for new users, handle loading state while waiting for AI response
  - [ ] 5.19 Create Proactive Insights component: write `frontend/src/components/Dashboard/InsightsPanel.tsx` fetching from `/ai/insights`, display up to 5 insight cards with headline, brief narrative, supporting metric, link to related dashboard, dismiss button (X icon) to hide individual insights
  - [ ] 5.20 Create Admin pages: write `frontend/src/pages/admin/ETLMonitor.tsx` displaying job list table (name, last run, status, duration, rows, actions), "Refresh" button, "Manual Run" button triggering modal for date range selection, write `frontend/src/pages/admin/UserManagement.tsx` with user list table, "Add User" button opening modal form, edit/deactivate actions per row, write `frontend/src/pages/admin/AuditLogs.tsx` with filterable log table, export button
  - [ ] 5.21 Implement export functionality: create `frontend/src/components/Dashboard/ExportButton.tsx` component with dropdown (Excel, CSV, PDF options), on click call `exportDashboard()` API, show loading state, download file from returned pre-signed URL
  - [ ] 5.22 Add loading and error states: create `frontend/src/components/common/LoadingSpinner.tsx` component, create `frontend/src/components/common/ErrorMessage.tsx` component, use in pages when data is loading or errors occur
  - [ ] 5.23 Implement responsive design: ensure all pages work on tablet (768px+) with adjusted layouts (2 KPI cards per row, 1 chart per row), ensure basic mobile usability (stacked layouts), test sidebar collapses to hamburger menu on mobile
  - [ ] 5.24 Configure Tailwind CSS: customize `tailwind.config.js` with color palette from PRD section 6.1 (Primary #1E3A8A, Secondary #10B981, Warning #F59E0B, Error #EF4444, etc.), add custom spacing and typography if needed
  - [ ] 5.25 Write frontend tests: create `frontend/tests/setup.ts` with Vitest configuration, create `frontend/src/components/Dashboard/KPICard.test.tsx` testing component renders correctly, create `frontend/src/utils/formatters.test.ts` testing formatter functions, create integration test for Login flow (render login page, fill form, submit, verify redirect)
  - [ ] 5.26 Run frontend locally: start dev server with `npm run dev`, navigate to `http://localhost:5173`, verify login page loads, test login with seed user credentials, verify dashboard loads with charts, test navigation between pages, verify all pages render without errors
  - [ ] 5.27 Run frontend tests: execute `npm run test` and verify all tests pass, check component tests and utility tests succeed

- [ ] **6.0 AI Services Integration**
  - [ ] 6.1 Set up OpenAI API client: create `backend/services/ai/` directory, write `backend/services/ai/openai_client.py` with OpenAI client initialization using API key from environment, functions: `generate_completion(prompt: str, max_tokens: int)` calling GPT-4 API, `generate_embeddings(text: str)` calling embeddings API
  - [ ] 6.2 Create SQL query generator: write `backend/services/ai/query_generator.py` with function `generate_sql_from_question(question: str, schema_context: str)` building prompt with semantic layer schema documentation, calling GPT-4 to generate SQL, returning SQL string, include examples of financial questions and expected SQL in prompt (few-shot learning)
  - [ ] 6.3 Create SQL validator: write `backend/services/ai/sql_validator.py` with function `validate_sql(sql: str)` using sqlglot or sqlparse to: parse SQL and check syntax, verify only SELECT statements (block INSERT/UPDATE/DELETE), verify only allowed tables (semantic.* schema), verify no access to raw tables or system tables, raise exception if validation fails
  - [ ] 6.4 Create query executor: write `backend/services/ai/query_executor.py` with function `execute_ai_query(sql: str, db: Session)` executing validated SQL with timeout (30 seconds), limiting result set to 10,000 rows, returning DataFrame or dict, catching database errors and returning user-friendly messages
  - [ ] 6.5 Create narrative generator: write `backend/services/ai/narrative_generator.py` with function `generate_narrative(question: str, query_results: dict)` building prompt with question and data, calling GPT-4 to generate explanation, returning narrative text, format for readability (paragraphs, bullet points)
  - [ ] 6.6 Create chart recommendation engine: write `backend/services/ai/chart_recommender.py` with function `recommend_chart_type(query_results: dict)` analyzing result structure (number of rows, columns, data types), returning chart recommendation (line, bar, pie, table), include configuration for chart (x-axis, y-axis, grouping)
  - [ ] 6.7 Implement conversation context management: create `backend/models/conversation.py` SQLAlchemy model with columns (conversation_id, user_id, created_at), create `backend/models/conversation_message.py` with columns (message_id, conversation_id, role: user|assistant, content, sql_generated, created_at), write functions to save and retrieve conversation history
  - [ ] 6.8 Create AI query orchestration service: write `backend/services/ai/ai_service.py` with main function `process_ai_query(question: str, conversation_id: Optional[str], user: User, db: Session)` orchestrating: retrieve conversation context if conversation_id provided, generate SQL from question with context, validate SQL, execute query, recommend chart type, generate narrative, save to conversation history, return structured response
  - [ ] 6.9 Implement proactive insights generator: write `backend/services/ai/insights_generator.py` with function `generate_daily_insights(db: Session)` querying recent data (last 7 days), identifying: significant variance (>10% changes), top/bottom performers, unusual patterns, generating 3-5 insight objects with headline and narrative, caching results (refresh daily)
  - [ ] 6.10 Create AI query endpoint: write `backend/api/ai.py` with `POST /ai/query` endpoint calling `ai_service.process_ai_query()`, implementing rate limiting (10 queries/minute/user), logging all queries to audit_log, returning response matching API spec (conversation_id, narrative, data, sql_query if permitted, data_sources, confidence), handle errors gracefully (return 422 with suggestions when AI can't answer)
  - [ ] 6.11 Create AI insights endpoint: in `backend/api/ai.py` create `GET /ai/insights` endpoint calling `insights_generator.generate_daily_insights()`, filtering by user role (executives see company-wide, managers see regional in future - all for MVP), returning insights array
  - [ ] 6.12 Implement embedding storage: create migration adding `ai_embeddings` table with pgvector column, write script to generate embeddings for: semantic layer schema documentation, sample query/answer pairs, financial term glossary, store embeddings in database
  - [ ] 6.13 Implement semantic search: write `backend/services/ai/semantic_search.py` with function `find_similar_queries(question: str, db: Session)` generating embedding for question, querying pgvector for similar previous questions, returning relevant context to improve query generation
  - [ ] 6.14 Create AI testing dataset: write `backend/tests/data/ai_test_questions.json` with 30 financial questions covering: basic metrics (revenue, expenses), time comparisons (Q3 vs Q2), variance analysis, job profitability, regional performance, include expected SQL patterns for validation
  - [ ] 6.15 Write AI service tests: create `backend/tests/test_ai_service.py` testing: SQL generation for sample questions, SQL validation rejects INSERT/UPDATE/DELETE, SQL validation allows only semantic schema, query execution returns correct data format, narrative generation produces text output, create `backend/tests/test_query_accuracy.py` running 30 test questions and measuring accuracy (execute SQL, verify results are reasonable)
  - [ ] 6.16 Test AI endpoints: use test client to call `POST /ai/query` with sample questions, verify responses match schema, verify SQL is included for Finance Analyst role but not Executive role, verify rate limiting works (exceed limit and get 429), verify conversation context works (ask follow-up question referencing previous)
  - [ ] 6.17 Optimize AI performance: implement caching for common queries (cache SQL for identical questions for 1 hour), implement prompt optimization (reduce token usage while maintaining quality), monitor OpenAI API costs and usage
  - [ ] 6.18 Create AI service documentation: write `docs/ai-service.md` documenting: how query generation works, semantic layer schema used, prompt engineering approach, accuracy metrics, limitations and edge cases, troubleshooting guide

- [ ] **7.0 Testing & Quality Assurance**
  - [ ] 7.1 Create end-to-end test setup: install Playwright in `frontend/`, create `frontend/e2e/` directory, write `playwright.config.ts` with base URL and browser configurations (Chrome, Firefox), create `frontend/e2e/fixtures/` with test database seed data
  - [ ] 7.2 Write authentication E2E tests: create `frontend/e2e/auth.spec.ts` testing: user can log in with valid credentials, login fails with invalid credentials, user is redirected to login when accessing protected route without auth, logout clears session and redirects to login
  - [ ] 7.3 Write dashboard E2E tests: create `frontend/e2e/dashboard.spec.ts` testing: user logs in and sees dashboard with KPI cards, revenue trend chart displays, filters can be applied (select date range, region), filtered data updates charts, export button downloads file
  - [ ] 7.4 Write AI analyst E2E tests: create `frontend/e2e/ai-analyst.spec.ts` testing: user can ask question and receive response, conversation history displays correctly, follow-up questions use context, SQL preview shows for Finance Analyst role
  - [ ] 7.5 Write admin E2E tests: create `frontend/e2e/admin.spec.ts` testing: Admin user can view ETL job status, Admin can manually trigger ETL job, Admin can create new user, Admin can view audit logs, non-Admin user cannot access admin pages (gets 403)
  - [ ] 7.6 Create integration test suite: write `backend/tests/integration/` directory with `test_etl_to_api.py` testing full flow: seed raw data → run dbt transformation → query dashboard API → verify correct data returned, verify reconciliation detects discrepancies
  - [ ] 7.7 Write API integration tests: create `backend/tests/integration/test_api_flows.py` testing: login → get dashboard data → apply filters → export to Excel (verify file generated), login → ask AI query → verify SQL executed → verify results returned
  - [ ] 7.8 Create performance test suite: install k6 or Locust, write `tests/performance/dashboard_load.js` simulating 30 concurrent users viewing dashboard, measuring response times (target: <3 seconds for 95th percentile), write `tests/performance/ai_queries.js` simulating AI query load
  - [ ] 7.9 Run performance tests: execute performance tests against staging environment with full dataset (1 month of transactions), collect metrics (response times, error rates, database CPU), verify all dashboard endpoints meet <3 second target, verify database handles concurrent load
  - [ ] 7.10 Create security test checklist: document manual security testing: SQL injection attempts on API endpoints, XSS attempts in dashboard inputs, CSRF protection verification, JWT token tampering, role-based access enforcement (Finance Analyst cannot access Admin endpoints), run OWASP ZAP automated scan against API
  - [ ] 7.11 Write data quality tests: create `etl/dbt_project/tests/` with custom dbt tests: test fact_transaction totals match expected ranges, test no negative values in revenue/expense, test referential integrity (all foreign keys exist in dimension tables), test no duplicate transactions, run with `dbt test`
  - [ ] 7.12 Create smoke test suite: write `tests/smoke/` with quick tests verifying: backend health endpoint responds, database is accessible, Prefect server is running, frontend loads, login works, one dashboard loads, document in `docs/testing.md`
  - [ ] 7.13 Set up test data management: create `tests/fixtures/generate_test_data.py` script generating realistic test data: 3 years of transactions (varying by season), multiple regions and divisions, jobs with varying profitability, employees and payroll records, script outputs SQL insert statements for seed database
  - [ ] 7.14 Implement CI test pipeline: update `.github/workflows/ci.yml` to run on every PR: backend unit tests (pytest), frontend unit tests (vitest), linting (eslint, black, ruff), type checking (mypy for Python, tsc for TypeScript), fail PR if any tests fail or coverage drops below 70%
  - [ ] 7.15 Create QA test plan document: write `docs/qa-test-plan.md` with: feature test matrix (all FR requirements mapped to test cases), UAT test scenarios for CFO and Finance Analysts, regression test checklist, performance acceptance criteria, security test procedures
  - [ ] 7.16 Execute manual QA round: manually test all functional requirements from PRD sections 4.1-4.10, verify UI matches wireframes, test all user stories (US-001 through US-019), document bugs in GitHub issues with priority labels, verify accessibility (keyboard navigation, color contrast)
  - [ ] 7.17 Fix identified bugs: triage bug reports, fix high-priority bugs blocking MVP, create regression tests for fixed bugs, re-run full test suite after fixes

- [ ] **8.0 Deployment & Launch**
  - [ ] 8.1 Provision AWS infrastructure: navigate to `infrastructure/terraform/`, run `terraform init`, configure AWS credentials, customize `variables.tf` (region, instance sizes, database password), run `terraform plan` and review resources to be created (VPC, RDS PostgreSQL, ECS cluster, S3 buckets, Secrets Manager), run `terraform apply` to provision infrastructure, save outputs (database endpoint, S3 bucket names, ECS cluster name)
  - [ ] 8.2 Configure AWS Secrets Manager: store secrets: DATABASE_URL (RDS connection string), JWT_SECRET_KEY (generate random 256-bit key), OPENAI_API_KEY, SAGE_CREDENTIALS (username, password or API key), TIME_TRACKING_API_KEY, EQUIPMENT_API_KEY, ASPIRE_API_KEY, TEAMS_WEBHOOK_URL, grant ECS task execution role access to secrets
  - [ ] 8.3 Set up RDS PostgreSQL: connect to RDS instance using bastion host or Systems Manager, enable pgvector extension (`CREATE EXTENSION vector;`), run database migrations (`alembic upgrade head`), create application database user with limited permissions (grant SELECT on semantic schema, grant SELECT/INSERT/UPDATE/DELETE on core/raw schemas for ETL user)
  - [ ] 8.4 Build and push Docker images: build backend image with `docker build -t superscapes-backend:latest backend/`, tag with ECR repository URL, push to AWS ECR, build ETL image, tag and push to ECR (no frontend Docker image - Vercel handles deployment)
  - [ ] 8.5 Deploy backend to ECS: create ECS task definition for backend (use ECR image, set environment variables from Secrets Manager, allocate 2GB memory, 1 vCPU), create ECS service with 2 tasks for redundancy, configure Application Load Balancer (ALB) routing port 443 to backend tasks, configure health check on `/health` endpoint, verify tasks are running and healthy
  - [ ] 8.6 Deploy frontend to Vercel: ensure Vercel project is connected to GitHub repository, configure environment variables in Vercel dashboard (VITE_API_URL pointing to ALB), push to main branch to trigger automatic deployment, verify build succeeds, verify frontend loads from Vercel URL (e.g., superscapes-fi.vercel.app), test API connectivity from Vercel frontend to ECS backend
  - [ ] 8.7 Deploy ETL to ECS: create ECS task definition for Prefect server (optional - can run Prefect locally and trigger remote ECS tasks), create ECS task definitions for each ETL flow (Sage extract, Time Tracking, Equipment, Aspire), configure EventBridge rules to trigger daily ETL flow at 2 AM UTC, verify ETL tasks can be triggered manually
  - [ ] 8.8 Configure DNS: configure custom domain in Vercel (e.g., `fi.superscapes.com`), point `api.superscapes.com` to backend ALB using CNAME or A record, verify DNS resolution and HTTPS certificates work for both frontend and backend
  - [ ] 8.9 Set up monitoring and alerting: create CloudWatch dashboard with metrics: backend API latency (p50, p95, p99), error rate, database connections, RDS CPU/memory, ECS task count, enable Vercel Analytics for frontend monitoring, create CloudWatch alarms: API error rate >5%, database CPU >80%, ETL job failures, ECS task failures, configure SNS topic for email alerts and Microsoft Teams webhook for critical alerts
  - [ ] 8.10 Configure backup automation: enable RDS automated backups (30-day retention), create ECS scheduled task (or simple script) to backup database to S3 daily using `pg_dump`, create S3 lifecycle policy to archive old backups to Glacier after 90 days, test restore procedure from backup
  - [ ] 8.11 Run staging deployment: deploy full stack to staging environment (separate VPC/RDS/ECS), load 1 month of sample data via historical ETL script, run smoke tests against staging, run E2E tests against staging, verify all features work end-to-end
  - [ ] 8.12 Create deployment runbook: write `docs/deployment.md` with step-by-step instructions: pre-deployment checklist, deployment commands, rollback procedure, post-deployment verification, troubleshooting common issues
  - [ ] 8.13 Prepare UAT environment: create test users in staging database (CFO, Finance Analyst, Regional Manager, Executive roles with real names), load realistic test data (anonymized Sage exports if possible or generated data), create UAT test guide document with scenarios for each user role
  - [ ] 8.14 Conduct User Acceptance Testing: schedule UAT sessions with CFO and 2-3 Finance Analysts, provide UAT test guide and credentials, observe users performing tasks (login, view dashboards, ask AI questions, export data), collect feedback on usability, functionality, performance, document issues and feature requests
  - [ ] 8.15 Address UAT feedback: prioritize UAT issues (blockers must be fixed, nice-to-haves deferred to Phase 2), fix critical bugs, make minor UI adjustments, re-test with users if significant changes made, get final sign-off from CFO
  - [ ] 8.16 Prepare production deployment: schedule deployment window (weekend preferred per PRD FR-1003), communicate downtime to users (none expected for initial launch), prepare rollback plan, assign roles (deploy engineer, QA tester, on-call support)
  - [ ] 8.17 Execute production deployment: run `terraform apply` for production environment, deploy Docker images to production ECS, run database migrations on production RDS, configure Vercel production domain and ALB DNS, run production smoke tests, verify all services healthy (Vercel frontend, ECS backend, RDS database)
  - [ ] 8.18 Load production data: run historical ETL for 3 years of Sage data (execute in chunks, monitor progress), verify data loaded correctly (row counts, reconciliation), refresh semantic materialized views, create initial admin user and pilot user accounts (CFO + Finance Analysts)
  - [ ] 8.19 Conduct production verification: test login with real user accounts, verify dashboard displays actual company data, test AI queries return correct answers, verify export functionality works, test all critical user journeys from UAT guide, monitor system metrics (CPU, memory, response times) for 2 hours
  - [ ] 8.20 Launch to pilot users: send launch announcement email with: login URL, credentials (temporary passwords), link to user documentation, support contact information, schedule brief training session (30 min) demonstrating key features, be available for support during first week
  - [ ] 8.21 Monitor post-launch metrics: track daily: login activity (adoption rate), feature usage (dashboard views, AI queries), error rates, performance metrics, ETL job success rate, collect user feedback via email/Teams, address issues within 24 hours
  - [ ] 8.22 Create user documentation: write `docs/user-guide.md` with: getting started (login, navigation), dashboard overview (KPIs, charts, filters), AI analyst guide (how to ask questions, sample queries), export instructions, FAQ, create video walkthrough (5-10 min) demonstrating key workflows
  - [ ] 8.23 Schedule post-launch review: conduct review meeting 2 weeks after launch with CFO and pilot users, review adoption metrics (logins, feature usage), review success metrics (time to insight, reports replaced), collect feedback for Phase 2 enhancements, celebrate launch success

---

**Status:** Complete task list generated (0.0 - 8.0) - Updated for final architecture

**Task Summary:**
- **0.0 Git Branch** - 3 sub-tasks
- **1.0 Infrastructure** - 13 sub-tasks (added Vercel setup, RDS dev instance)
- **2.0 Database** - 12 sub-tasks
- **3.0 ETL Pipeline** - 20 sub-tasks (replaced CRM/Payroll with Time Tracking/Equipment/Aspire)
- **4.0 Backend API** - 20 sub-tasks
- **5.0 Frontend** - 27 sub-tasks
- **6.0 AI Services** - 18 sub-tasks
- **7.0 Testing & QA** - 17 sub-tasks
- **8.0 Deployment** - 23 sub-tasks

**Total:** 153 detailed, actionable sub-tasks covering the entire MVP implementation

**Architecture:** Vercel (frontend) + ECS Fargate (backend/ETL) + RDS PostgreSQL (all environments) + Microsoft Teams

**Next Steps:**
1. Review task list for completeness
2. Begin implementation starting with Task 0.0 (create branch)
3. Track progress by checking off completed tasks
4. Refer to PRD for detailed requirements when implementing each task

---

*Task list follows the structure defined in `03-generate-tasks.md`*
