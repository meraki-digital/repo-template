# Technology Stack
## Superscapes Financial Intelligence Dashboard - MVP

**Project Code:** 0001
**Last Updated:** October 26, 2025

---

## Programming Languages

- **Python 3.11+** [📚](../../../agentic/tasks/explainers/python-311.md) - Backend API, ETL pipelines, data transformations
- **TypeScript 5.0+** [📚](../../../agentic/tasks/explainers/typescript-5.md) - Frontend application
- **SQL** - Database queries, dbt models, semantic layer views
- **JavaScript** - Build tooling, testing utilities
- **Bash/Shell** - Deployment scripts, database backup/restore

---

## Frontend Stack

### Core Framework & Build Tools
- **React 18.2+** [📚](../../../agentic/tasks/explainers/react-18.md) - UI framework
- **TypeScript 5.0+** [📚](../../../agentic/tasks/explainers/typescript-5.md) - Type safety and developer experience
- **Vite** [📚](../../../agentic/tasks/explainers/vite.md) - Build tool and dev server (faster than Create React App)
- **Node.js 18+** - Runtime for build tools

### UI/Styling
- **Tailwind CSS 3.3+** [📚](../../../agentic/tasks/explainers/tailwind-css-3.md) - Utility-first CSS framework
- **Headless UI** [📚](../../../agentic/tasks/explainers/headless-ui.md) - Unstyled accessible components
- **CSS3** - Custom styling where needed

### Data Visualization
- **Recharts 2.5+** [📚](../../../agentic/tasks/explainers/recharts-25.md) - React charting library for interactive visualizations
- Alternative: **Plotly.js** - Advanced interactive charts (if needed)

### State Management & Data Fetching
- **React Context API** [📚](../../../agentic/tasks/explainers/react-context-api.md) - Global state (authentication)
- **TanStack Query (React Query)** [📚](../../../agentic/tasks/explainers/tanstack-query.md) - Server state management, caching, data fetching
- **React Hooks** [📚](../../../agentic/tasks/explainers/react-hooks.md) - Component state management

### Routing & Navigation
- **React Router v6** [📚](../../../agentic/tasks/explainers/react-router-v6.md) - Client-side routing

### HTTP & API Communication
- **Axios** [📚](../../../agentic/tasks/explainers/axios.md) - HTTP client with request/response interceptors

### Forms & Validation
- **React Hook Form** [📚](../../../agentic/tasks/explainers/react-hook-form.md) - Form state management and validation
- **Zod** [📚](../../../agentic/tasks/explainers/zod.md) - Schema validation library

### Date/Time Handling
- **react-datepicker** [📚](../../../agentic/tasks/explainers/react-datepicker.md) - Date range picker component
- **date-fns** or **Day.js** [📚](../../../agentic/tasks/explainers/date-fns.md) - Date formatting and manipulation utilities

### Testing
- **Vitest** [📚](../../../agentic/tasks/explainers/vitest.md) - Unit testing framework (Vite-native)
- **React Testing Library** [📚](../../../agentic/tasks/explainers/react-testing-library.md) - Component testing utilities
- **Playwright** [📚](../../../agentic/tasks/explainers/playwright.md) - End-to-end testing framework
- **@testing-library/jest-dom** [📚](../../../agentic/tasks/explainers/testing-library-jest-dom.md) - Custom jest matchers

### Code Quality
- **ESLint** [📚](../../../agentic/tasks/explainers/eslint.md) - JavaScript/TypeScript linting
- **Prettier** [📚](../../../agentic/tasks/explainers/prettier.md) - Code formatting
- **TypeScript Compiler (tsc)** [📚](../../../agentic/tasks/explainers/typescript-compiler.md) - Type checking
- **Husky** [📚](../../../agentic/tasks/explainers/husky.md) - Git hooks for pre-commit checks
- **lint-staged** [📚](../../../agentic/tasks/explainers/lint-staged.md) - Run linters on staged files

---

## Backend Stack

### Core Framework
- **FastAPI 0.100+** [📚](../../../agentic/tasks/explainers/fastapi.md) - Modern Python web framework
- **Uvicorn** [📚](../../../agentic/tasks/explainers/uvicorn.md) - ASGI server for running FastAPI
- **Python 3.11+** - Runtime

### Database & ORM
- **SQLAlchemy 2.0+** [📚](../../../agentic/tasks/explainers/sqlalchemy.md) - SQL toolkit and ORM
- **Alembic** [📚](../../../agentic/tasks/explainers/alembic.md) - Database migration tool
- **asyncpg** or **psycopg2** - PostgreSQL database drivers

### Authentication & Security
- **python-jose** [📚](../../../agentic/tasks/explainers/python-jose.md) - JWT token generation and validation
- **passlib** - Password hashing (bcrypt)
- **PyJWT** [📚](../../../agentic/tasks/explainers/pyjwt.md) - JWT library
- **bcrypt** - Password hashing algorithm

### Data Validation
- **Pydantic v2** - Request/response validation and serialization

### API & Middleware
- **fastapi-cors-middleware** - CORS handling
- **slowapi** - Rate limiting middleware
- **Starlette** - ASGI framework (FastAPI dependency)

### File Generation
- **openpyxl** - Excel file generation (not pandas - avoid in serverless)
- **reportlab** or **weasyprint** - PDF generation
- **csv module (built-in)** - CSV generation

### Testing
- **pytest** - Testing framework
- **pytest-asyncio** - Async test support
- **pytest-cov** - Code coverage reporting
- **httpx** - Async HTTP client for testing
- **faker** - Test data generation

### Code Quality
- **Black** - Code formatting
- **Ruff** - Fast Python linter
- **mypy** - Static type checker
- **isort** - Import sorting

---

## Data & ETL Stack

### Database
- **PostgreSQL 14.9+** or **15+** - Relational database and data warehouse
- **pgvector** [📚](../../../agentic/tasks/explainers/pgvector.md) - PostgreSQL extension for vector embeddings
- **pg_cron** - PostgreSQL extension for scheduled jobs (optional)

### ETL Orchestration
- **Prefect 2.10+** - Workflow orchestration (recommended over Airflow for simplicity)
- Alternative: **Apache Airflow 2.7+** - Workflow orchestration

### Data Ingestion
- **Airbyte 0.50+** - Data integration platform with pre-built connectors
- **pyodbc** - ODBC driver for Sage integration
- **Python standard library** - Data manipulation (dicts, lists) - NO pandas in serverless!
- **SQLAlchemy** - Database interaction

### Data Transformation
- **dbt (data build tool) 1.5+** - SQL-based data transformations
- **dbt-postgres** - PostgreSQL adapter for dbt

### Data Connectors
- **requests** - HTTP library for API calls
- **pyodbc** - ODBC connectivity for Sage
- Custom connector classes for each source system

### Testing
- **pytest** - ETL pipeline testing
- **dbt test** - Data quality testing within dbt models
- **Great Expectations** (optional) - Data validation framework

---

## AI & Machine Learning Stack

### LLM & AI Services
- **OpenAI GPT-4 API** - Natural language understanding and SQL generation
- **OpenAI text-embedding-ada-002** - Text embeddings for semantic search
- Alternative: **FinGPT** or **Llama 3** - Finance-specific models (Phase 2)

### Vector Database
- **pgvector** - PostgreSQL extension for storing and querying vector embeddings

### AI Utilities
- **sqlglot** or **sqlparse** - SQL parsing and validation
- **langchain** (optional) - LLM application framework
- **tiktoken** - Token counting for OpenAI API

### Forecasting & Analytics (Phase 2)
- **Prophet** - Time-series forecasting (Meta/Facebook)
- **statsmodels** - Statistical models (ARIMA, etc.)
- **scikit-learn** - Machine learning utilities
- **SQL queries** - Data analysis (avoid pandas in API layer)
- **numpy** - Numerical computing

---

## Infrastructure & DevOps

### Cloud Platform
- **AWS (Amazon Web Services)** - Primary cloud provider

### Compute
- **AWS ECS Fargate** - Serverless container orchestration (SELECTED)
- **AWS ECS Task Definitions** - Container specifications
- **AWS ECS Services** - Long-running applications (backend API)
- **AWS ECS Scheduled Tasks** - Cron-like job execution (ETL)
- **Docker** - Minimal usage: 2 Dockerfiles for production deployment only (no local Docker required)

### Database Hosting
- **AWS RDS for PostgreSQL** - Managed PostgreSQL database
- **PgBouncer** (optional) - Connection pooling

### Storage
- **AWS S3** - Object storage for exports, backups, static assets
- **AWS S3 Glacier** - Long-term archive storage

### Networking & Delivery
- **Vercel** - Frontend hosting platform (SELECTED)
- **AWS Application Load Balancer (ALB)** - HTTPS endpoint for backend API (ECS Fargate)
- **AWS VPC** - Virtual Private Cloud for network isolation
- **AWS Route 53** (optional) - DNS management (if not using Vercel DNS)
- **AWS Certificate Manager (ACM)** - SSL/TLS certificates for ALB

### Security & Secrets
- **AWS Secrets Manager** - Secure credential storage
- **AWS IAM** - Identity and access management
- **AWS Security Groups** - Network firewall rules

### Monitoring & Logging
- **AWS CloudWatch** - Metrics, logs, alarms
- **AWS CloudWatch Logs** - Centralized logging
- **AWS CloudWatch Alarms** - Alert notifications
- **Grafana** (optional) - Advanced dashboards and visualization

### Scheduling & Events
- **AWS EventBridge** - Scheduled triggers for ECS tasks (cron-style jobs at 2 AM daily)

### Notifications
- **AWS SNS** - Email/SMS notifications
- **PagerDuty** (optional) - Incident management and alerting
- **Microsoft Teams API** - Teams notifications for anomalies and alerts (PREFERRED)

### Container Registry
- **AWS ECR (Elastic Container Registry)** - Docker image registry for ECS Fargate deployments

---

## Infrastructure as Code

- **Terraform** - Infrastructure provisioning and management
- Alternative: **AWS CDK (Cloud Development Kit)** - TypeScript/Python-based IaC
- **Terraform Cloud** (optional) - Remote state management

---

## CI/CD & Version Control

### Version Control
- **Git** - Source code version control
- **GitHub** - Git repository hosting and collaboration

### CI/CD Platform
- **GitHub Actions** - Automated testing and deployment pipelines

### CI/CD Tools
- **Docker** - Build container images
- **docker-compose** - Local multi-container orchestration
- **AWS CLI** - AWS command-line interface
- **Terraform CLI** - Infrastructure deployment

---

## Development Tools

### Package Management
- **npm** or **pnpm** - Node.js package manager (frontend)
- **pip** - Python package manager
- **poetry** or **pipenv** (optional) - Python dependency management
- **venv** - Python virtual environments

### API Development & Testing
- **Postman** or **Bruno** - API testing collections
- **Swagger UI** - API documentation (auto-generated by FastAPI)
- **OpenAPI 3.0** - API specification format

### Database Tools
- **psql** - PostgreSQL command-line client
- **pgAdmin** or **DBeaver** - Database GUI tools
- **pg_dump / pg_restore** - Database backup/restore utilities

### Code Editors & IDEs
- **VS Code** (recommended) - Code editor
- **PyCharm** (optional) - Python IDE
- **WebStorm** (optional) - JavaScript/TypeScript IDE

---

## Testing & Quality Assurance

### Testing Frameworks
- **pytest** - Python unit/integration testing
- **Vitest** - Frontend unit testing
- **Playwright** - End-to-end browser testing
- Alternative: **Cypress** - E2E testing

### Performance Testing
- **k6** - Load testing and performance benchmarking
- Alternative: **Locust** - Python-based load testing

### Security Testing
- **OWASP ZAP** - Automated security scanning
- **Bandit** (optional) - Python security linter
- **npm audit** - Dependency vulnerability scanning

### Code Coverage
- **pytest-cov** - Python code coverage
- **c8** or **Istanbul** - JavaScript code coverage

---

## Data Sources & Integrations

### Primary Data Sources
- **Sage (ODBC or API)** - Accounting system (GL, AP, AR, Payroll)
- **Time Tracking System** - Employee time entries and job allocations
- **Equipment/Fleet Management System** - Equipment usage and costs
- **Aspire** - Landscaping industry-specific job tracking

### Integration Methods
- **ODBC** - Database connectivity for Sage
- **REST APIs** - API integrations for operational systems
- **File Exports** - CSV/JSON/XML file-based integrations (if APIs unavailable)
- **Airbyte Connectors** - Pre-built data source connectors

---

## Communication Protocols

- **HTTPS/TLS 1.2+** - Secure web traffic
- **WebSocket** (optional) - Real-time notifications (Phase 2)
- **SMTP** - Email notifications
- **OAuth 2.0** - Authentication protocol (if SSO integration)
- **JWT (JSON Web Tokens)** - Stateless authentication tokens

---

## Data Formats

- **JSON** - API request/response format
- **CSV** - Data exports and bulk imports
- **Excel (XLSX)** - Financial report exports
- **PDF** - Report generation
- **SQL** - Database queries and transformations
- **YAML** - Configuration files (dbt, Terraform, CI/CD)

---

## Architectural Patterns

### Application Architecture
- **REST API** - Backend API design pattern
- **Single Page Application (SPA)** - Frontend architecture
- **Microservices** - Separation of concerns (API, ETL, AI services)
- **Layered Architecture** - Presentation → Application → Data layers

### Data Architecture
- **Star Schema** - Dimensional modeling (fact and dimension tables)
- **ETL Pattern** - Extract, Transform, Load pipeline
- **Semantic Layer** - Business-friendly abstraction over raw data
- **Data Warehouse** - Centralized analytical data store

### Security Patterns
- **Role-Based Access Control (RBAC)** - Authorization model
- **JWT Authentication** - Stateless token-based auth
- **Principle of Least Privilege** - Minimal necessary permissions
- **Defense in Depth** - Multiple security layers

### Design Patterns
- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic separation
- **Dependency Injection** - Loose coupling (FastAPI dependencies)
- **Factory Pattern** - Object creation (connectors, services)
- **Observer Pattern** - Event-driven notifications
- **Singleton Pattern** - Database connections, API clients

---

## Development Practices

### Methodologies
- **Agile Development** - Iterative development approach
- **Continuous Integration/Continuous Deployment (CI/CD)** - Automated testing and deployment
- **Test-Driven Development (TDD)** - Tests first, then implementation (recommended)
- **Code Reviews** - Pull request reviews before merge

### Version Control Practices
- **Git Flow** - Feature branches, pull requests
- **Semantic Versioning** - Version numbering (MAJOR.MINOR.PATCH)
- **Conventional Commits** - Standardized commit messages

### Documentation
- **Markdown** - Documentation format
- **OpenAPI/Swagger** - API documentation
- **JSDoc** or **TypeDoc** - Code documentation (optional)
- **Docstrings** - Python function documentation

---

## Monitoring & Observability

### Application Monitoring
- **CloudWatch Metrics** - System and application metrics
- **CloudWatch Dashboards** - Metric visualization
- **CloudWatch Alarms** - Threshold-based alerting

### Logging
- **CloudWatch Logs** - Centralized log aggregation
- **Structured Logging** - JSON-formatted logs
- **Python logging module** - Backend logging
- **console methods** - Frontend logging (development)

### Tracing (Optional - Phase 2)
- **AWS X-Ray** - Distributed tracing
- **OpenTelemetry** - Observability framework

---

## Performance Optimization

### Caching
- **Browser Cache** - Static asset caching
- **Service Worker** (optional) - Offline asset caching
- **In-Memory Cache** - API response caching (5-minute TTL)
- **Materialized Views** - Pre-computed database aggregations

### Database Optimization
- **Indexes** - B-tree indexes on foreign keys and date columns
- **Connection Pooling** - PgBouncer for connection reuse
- **Query Optimization** - EXPLAIN ANALYZE for query tuning
- **Table Partitioning** (future) - Date-based partitioning for large fact tables

### Frontend Optimization
- **Code Splitting** - Lazy loading routes
- **Tree Shaking** - Unused code elimination (Vite)
- **Asset Minification** - Compressed JS/CSS bundles
- **Image Optimization** - Compressed images for charts/logos
- **Virtual Scrolling** - Efficient rendering of large tables (TanStack Table)

---

## Security Tools & Libraries

### Authentication & Authorization
- **JWT (JSON Web Tokens)** - Token-based authentication
- **bcrypt** - Password hashing algorithm
- **OAuth 2.0** (optional) - SSO integration
- **Active Directory** (optional) - Enterprise auth integration

### Security Scanning
- **OWASP ZAP** - Automated vulnerability scanning
- **npm audit** - Frontend dependency vulnerability scanning
- **pip-audit** or **safety** - Python dependency scanning
- **Bandit** (optional) - Python security linter
- **Snyk** (optional) - Continuous security monitoring

### Encryption
- **TLS 1.2+** - Transport layer security
- **AWS KMS** (optional) - Key management service
- **AES-256** - Encryption at rest (RDS)

---

## Data Science & Analytics

### Data Manipulation
- **Python dicts/lists** - Data structures (pandas removed for serverless compatibility)
- **numpy** - Numerical computations
- **scipy** (optional) - Scientific computing

### Time Series Analysis (Phase 2)
- **Prophet** - Facebook's forecasting library
- **statsmodels** - Statistical models (ARIMA, seasonal decomposition)
- **scikit-learn** - Machine learning library

### Data Validation
- **Great Expectations** (optional) - Data quality framework
- **Pydantic** - Data validation
- **dbt tests** - Data quality tests in transformations

---

## Third-Party Services

### AI/ML Services
- **OpenAI API** - GPT-4 and embeddings API
- **OpenAI Python SDK** - Official OpenAI client library

### Email Services
- **SMTP Server** - Email delivery (company SMTP or AWS SES)
- **AWS SES (Simple Email Service)** (optional) - Scalable email sending

### Communication
- **Microsoft Teams API** - Internal team notifications and alerts (PREFERRED)
- **Microsoft Graph API** - Teams integration and user management

### Source System APIs
- **Sage API** or **ODBC** - Sage integration
- **Time Tracking System API** - Time entry data
- **Equipment/Fleet Management API** - Equipment usage data
- **Aspire API** - Landscaping-specific data

---

## Local Development Environment

### Local Database
- **AWS RDS PostgreSQL** - Dedicated dev/staging RDS instance (PREFERRED - no Docker needed)
- **pgvector extension** - Vector similarity search (pre-installed on RDS)
- Alternative: **Local PostgreSQL installation** - Native installation on dev machine
- Alternative: **PostgreSQL in Docker** - If team decides containerization is acceptable

### Containerization
- **Not required for local development** - Team preference to avoid Docker entirely

### Development Services
- **Hot Module Replacement (HMR)** - Vite dev server auto-reload
- **FastAPI Auto-reload** - Backend auto-reload on code changes
- **Prefect UI** - Local ETL flow monitoring (port 4200)

---

## Production Infrastructure Components

### Compute Resources
- **AWS ECS Fargate** - Backend API (long-running service) and ETL jobs (scheduled tasks)
- **ECS Task Definitions** - Container specifications for API and ETL
- **ECS Services** - Backend API running 24/7 (with auto-scaling)
- **ECS Scheduled Tasks** - Nightly ETL jobs triggered by EventBridge

### Database
- **RDS PostgreSQL Instance** - Multi-AZ for high availability
- **RDS Automated Backups** - 30-day retention
- **RDS Performance Insights** (optional) - Database performance monitoring

### Storage & Hosting
- **Vercel** - Frontend hosting with global CDN (PREFERRED)
- **S3 Buckets** - Object storage (exports, backups)
- **S3 Lifecycle Policies** - Automated data archival

### Networking
- **VPC** - Isolated network environment
- **Public Subnets** - For load balancers
- **Private Subnets** - For databases and backend services
- **NAT Gateway** - Outbound internet access for private subnets
- **Internet Gateway** - Inbound traffic routing

### Load Balancing
- **AWS Application Load Balancer (ALB)** - HTTPS endpoint for ECS Fargate backend API
- **ALB Target Groups** - Route traffic to ECS tasks
- **ALB Health Checks** - Monitor backend API health

---

## Configuration Management

### Environment Variables
- **.env files** - Local environment configuration
- **AWS Secrets Manager** - Production secrets storage
- **AWS Systems Manager Parameter Store** (alternative) - Configuration storage

### Configuration Files
- **config.py** - Backend configuration module
- **.env.example** - Environment variable template
- **vite.config.ts** - Frontend build configuration
- **tsconfig.json** - TypeScript compiler configuration
- **tailwind.config.js** - Tailwind CSS customization
- **dbt_project.yml** - dbt configuration
- **profiles.yml** - dbt database connections
- **prefect_config.py** - Prefect orchestration settings

---

## Documentation Tools

### Documentation Format
- **Markdown** - All documentation files
- **Mermaid** (optional) - Diagram-as-code

### API Documentation
- **OpenAPI 3.0 (Swagger)** - API specification
- **Swagger UI** - Interactive API documentation (auto-generated by FastAPI)
- **ReDoc** (optional) - Alternative API documentation UI

### Code Documentation
- **Python Docstrings** - Function/class documentation
- **JSDoc comments** (optional) - JavaScript/TypeScript documentation
- **Type hints** - Python type annotations

---

## Project Management & Collaboration

### Documentation
- **README.md** - Project overview and quick start
- **AGENTS.md** (optional) - AI assistant instructions
- **CHANGELOG.md** (optional) - Version history

### Issue Tracking
- **GitHub Issues** - Bug tracking and feature requests
- **GitHub Projects** (optional) - Kanban board for task management

### Communication
- **Email** - Stakeholder communication
- **Microsoft Teams** - Team collaboration and internal communication (PREFERRED)

---

## Compliance & Audit

### Audit Logging
- **Custom audit_log table** - Application-level audit trail
- **CloudWatch Logs** - Infrastructure audit trail
- **RDS Audit Logs** - Database query logging (if needed)

### Data Retention
- **S3 Lifecycle Policies** - Automated archival and deletion
- **RDS Backup Retention** - 30-day backup retention
- **Audit Log Retention** - 7-year retention requirement

### Compliance Tools
- **AWS Config** (optional) - Resource compliance tracking
- **AWS CloudTrail** - AWS API audit logging

---

## Browser & Device Support

### Web Browsers (Latest 2 Versions)
- **Google Chrome**
- **Microsoft Edge**
- **Mozilla Firefox**
- **Apple Safari**

### Device Types
- **Desktop** (primary) - 1024px and wider
- **Tablet** - 768px to 1023px
- **Mobile** (basic support) - Below 768px

---

## Standards & Specifications

### Web Standards
- **HTML5** - Markup
- **CSS3** - Styling
- **ECMAScript 2020+** - JavaScript language features
- **WebSocket** (optional Phase 2) - Real-time communication
- **HTTP/2** - Protocol

### Accessibility Standards
- **WCAG 2.1 Level AA** - Web accessibility guidelines
- **ARIA** - Accessible Rich Internet Applications attributes

### Security Standards
- **OWASP Top 10** - Security best practices
- **TLS 1.2+** - Encryption protocol
- **HTTPS** - Secure HTTP

### API Standards
- **REST** - API architectural style
- **OpenAPI 3.0** - API specification standard
- **JSON:API** (optional) - JSON API specification

---

## Summary by Development Phase

### Phase 0: Setup (Weeks 1-2)
- Git, GitHub, Docker, docker-compose, PostgreSQL, Terraform, AWS account setup

### Phase 1: Database & ETL (Weeks 3-10)
- PostgreSQL, Alembic, dbt, Prefect, Airbyte, pyodbc, pytest (NO pandas)

### Phase 2: Backend API (Weeks 7-13)
- FastAPI, SQLAlchemy, Pydantic, python-jose, passlib, pytest, OpenAPI

### Phase 3: Frontend (Weeks 11-15)
- React, TypeScript, Vite, Tailwind CSS, Recharts, TanStack Query, Axios, Vitest, Playwright

### Phase 4: AI Integration (Weeks 11-13)
- OpenAI API, pgvector, sqlglot (avoid pandas in serverless functions)

### Phase 5: Testing & QA (Weeks 14-17)
- Playwright, k6, OWASP ZAP, pytest, Vitest

### Phase 6: Deployment (Weeks 16-18)
- Terraform, AWS ECS, RDS, S3, CloudFront, ALB, Secrets Manager, CloudWatch

---

**Total Technologies:** 100+ tools, libraries, platforms, and services across the full stack

**Core Technology Decisions (FINAL):**
- **Language:** Python (backend/ETL) + TypeScript (frontend)
- **Framework:** FastAPI (backend) + React (frontend)
- **Database:** AWS RDS PostgreSQL with pgvector (dev, staging, production)
- **Compute:** AWS ECS Fargate (backend API + ETL jobs)
- **Frontend Hosting:** Vercel
- **Cloud Provider:** AWS (backend/data) + Vercel (frontend)
- **AI:** OpenAI GPT-4
- **Communication:** Microsoft Teams (CLIENT REQUIREMENT)
- **Docker:** Minimal - 2 Dockerfiles for production only, zero Docker in local development

---

## Background: Understanding Key Concepts

### What is ETL?

**ETL = Extract, Transform, Load**

For this project, ETL means:

1. **Extract:** Pull data from Sage, time tracking, equipment systems, Aspire
   - Example: Download all GL transactions from Sage for the last 3 years
   - This could be 50-100 million transaction records

2. **Transform:** Clean and organize data into a usable structure
   - Example: Convert Sage account codes into standardized categories (Revenue, Labor, Materials)
   - Example: Calculate job profitability by combining revenue and cost data
   - Example: Create monthly summaries from daily transactions

3. **Load:** Put the transformed data into your data warehouse (PostgreSQL)
   - Example: Insert transactions into fact_transaction table
   - Example: Update dimension tables with new jobs or regions

**Why ETL matters for this project:**
- Sage data is messy and transaction-based (millions of rows)
- Dashboards need summarized, organized data (monthly totals, job summaries)
- ETL runs nightly to keep dashboard data fresh
- Initial load (3 years) could take hours to process

---

### What is AWS ECS Fargate?

**ECS = Elastic Container Service**
**Fargate = Serverless compute engine for containers**

**In simple terms:**

Think of Fargate as a way to run your Python code on AWS without managing servers. You give AWS:
1. A Docker image (a packaged version of your Python app)
2. Instructions on how much memory/CPU it needs
3. When to run it

AWS handles:
- Finding a server to run it on
- Starting it up
- Keeping it running
- Restarting if it crashes
- Scaling if you need more

**Docker's role:**
Docker is just a way to package your application so it runs the same everywhere. Think of it like a zip file that includes:
- Your Python code
- All the libraries it needs (FastAPI, SQLAlchemy, etc. - NO pandas!)
- The exact Python version
- Instructions on how to start it

**Why Fargate instead of Lambda?**

| Lambda | ECS Fargate |
|--------|-------------|
| Max 15 minutes per run | Can run for hours or days |
| Max 10GB memory | Up to 120GB memory |
| Good for quick tasks | Good for heavy processing |
| Can't handle 3-year data load | Can process all 3 years |
| Cold starts (1-3 sec delay) | Always warm (if kept running) |
| Limited libraries (250MB) | Unlimited libraries |

**For this project:**
- **Backend API:** Could use Lambda (most queries are fast) OR Fargate (safer if complex queries take >15 min)
- **ETL Jobs:** Need Fargate because processing 3 years of Sage data will take hours, not minutes

**The Docker reality:**
- If using Fargate, you need 1-2 simple Dockerfiles (just configuration files)
- You don't need to "learn Docker" deeply - just copy a template
- You never use Docker locally - it's only for deployment
- Most developers create the Dockerfile once and never touch it again

---

## Final Architecture Decision ✅

### Selected Architecture

**Frontend:**
- **Vercel** - Static site hosting with global CDN
- No Docker required at all

**Backend API:**
- **AWS ECS Fargate** - Long-running FastAPI service behind ALB
- Handles API requests from frontend (dashboard data, AI queries, exports, admin)
- 2 tasks for redundancy and zero-downtime deployments
- Requires 1 Dockerfile for production deployment

**ETL Jobs:**
- **AWS ECS Fargate** - Scheduled tasks for data pipeline
- EventBridge triggers nightly at 2 AM
- Handles 3-year historical data load and daily incremental loads
- Requires 1 Dockerfile for production deployment

**Database:**
- **AWS RDS PostgreSQL** - All environments (dev, staging, production)
- No Docker required - fully managed AWS service
- pgvector extension for AI embeddings

**Communication:**
- **Microsoft Teams** - Client's preferred platform


### Docker Usage - Final Summary

**Local Development:**
- ✅ Frontend: Zero Docker (run `npm run dev`)
- ✅ Backend: Zero Docker (run `uvicorn backend.main:app --reload`)
- ✅ ETL: Zero Docker (run Python scripts with Prefect CLI)
- ✅ Database: Zero Docker (connect to RDS dev instance)

**Production Deployment:**
- ✅ Frontend: Zero Docker (Vercel handles it)
- ⚠️ Backend: 1 simple Dockerfile (~10 lines) for ECS deployment
- ⚠️ ETL: 1 simple Dockerfile (~10 lines) for ECS deployment
- ✅ Database: Zero Docker (RDS managed service)

**Total Docker Complexity:** 2 simple Dockerfiles for production deployment. Developers never run Docker locally.

### Why This Architecture?

**Chosen for:**
- Reliability (no 15-minute timeout limits)
- Simplicity (single deployment pattern for backend/ETL)
- Team preference (RDS everywhere, Vercel for frontend)
- Data safety (complex queries and large data loads won't fail)
- Native FastAPI support (no Lambda adapters needed)

**Trade-off accepted:** Minimal Docker usage (2 simple Dockerfiles) for production deployment in exchange for reliable, timeout-free data processing.
