# Software Requirements Specification (SRS)
## Superscapes Financial Intelligence Dashboard

**Version:** 1.0
**Date:** October 25, 2025
**Project Code:** 0001

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the Superscapes Financial Intelligence Dashboard - a new centralized analytics platform that will establish Superscapes' first structured financial analysis capability by integrating Sage accounting data with operational systems to deliver financial insights through interactive dashboards and AI-powered analysis.

This is a greenfield project creating new financial intelligence capabilities where no formal analysis process currently exists. This document serves as the foundation for the Product Requirements Document (PRD) and subsequent development planning.

### 1.2 Scope

**In Scope:**
- Automated ETL pipeline from Sage, time tracking, equipment/fleet management, and Aspire systems
- Centralized data warehouse with normalized financial and operational data (3 years historical)
- Interactive web-based dashboards for financial performance visualization
- AI-powered financial analyst for natural language queries and proactive insights
- Predictive analytics for forecasting and anomaly detection
- Role-based access control and audit logging
- Daily data refresh cycles with reconciliation validation

**Out of Scope:**
- Modifications to Sage or source systems
- Mobile native applications (Phase 1)
- Real-time/streaming data integration (daily batch is sufficient)
- Regional data restrictions (planned for future phase)
- Payroll processing or transactional capabilities
- Direct write-back to Sage

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| AI | Artificial Intelligence |
| AP | Accounts Payable |
| AR | Accounts Receivable |
| ETL | Extract, Transform, Load |
| GL | General Ledger |
| LLM | Large Language Model |
| MVP | Minimum Viable Product |
| RBAC | Role-Based Access Control |
| SRS | Software Requirements Specification |
| PRD | Product Requirements Document |

### 1.4 References

- Seed Document: `tasks/mods/0001/seed.md`
- Discovery Interview Responses (October 25, 2025)
- Sage Documentation (to be provided)
- Aspire System Documentation (to be provided)

---

## 2. Overall Description

### 2.1 Product Perspective

The Superscapes Financial Intelligence Dashboard is a new standalone system that will integrate with existing enterprise systems but operate independently. It serves as an analytics and intelligence layer on top of transactional systems without replacing them.

**System Context:**
- **Source Systems:** Sage (accounting including payroll), Time Tracking, Equipment/Fleet Management, Aspire (landscaping industry tool)
- **Data Flow:** Read-only extraction from source systems → Data Warehouse → Semantic Layer → Dashboard & AI interfaces
- **Deployment:** AWS cloud infrastructure, accessible via web browser

The system does not perform transactions or modify source data - it is strictly a decision intelligence platform.

### 2.2 Product Functions

High-level system capabilities:

1. **Data Integration & Warehousing:** Automated daily extraction, transformation, and loading of financial and operational data into a governed data warehouse
2. **Financial Dashboards:** Interactive visualizations of revenue, expenses, margins, and operational metrics with drill-down capabilities
3. **AI Financial Analyst:** Natural language interface for ad-hoc queries and automated narrative explanations of financial performance
4. **Predictive Analytics:** Forecasting of cash flow, labor costs, and demand patterns with anomaly detection
5. **Governance & Security:** Role-based access, audit logging, and data encryption
6. **Reconciliation & Validation:** Automated checks ensuring source system totals match warehouse data

### 2.3 User Characteristics

| User Role | Quantity | Technical Proficiency | Primary Goals |
|-----------|----------|----------------------|---------------|
| **CFO / Controller** | 2-3 | Medium | Real-time profitability visibility, variance analysis, strategic decision support |
| **Finance Analysts** | 5-8 | High | Detailed drilldowns, reconciliation, data exploration, predictive modeling |
| **Regional Managers** | 10-15 | Low-Medium | Job-level profitability, division performance, cost efficiency |
| **Executives (CEO, COO)** | 3-5 | Low | Executive summaries, margin trends, scenario analysis |

**Total Expected Users:** 20-30 concurrent users, ~50-75 total licensed users

### 2.4 Constraints

1. **Technical Constraints:**
   - Must integrate with Sage using ODBC or Sage API (read-only)
   - AI/LLMs cannot access raw transaction data - only semantic/aggregated views
   - Must handle multi-year historical data (3 years minimum) and thousands of active job records
   - Daily data refresh cycle (not real-time) - overnight batch processing
   - Must run on AWS infrastructure

2. **Regulatory & Compliance:**
   - Must comply with Superscapes' accounting audit standards
   - Must maintain detailed audit logs for all AI-generated queries and data access
   - Must support data encryption in transit and at rest

3. **Business Constraints:**
   - Budget considerations favor open-source and cost-effective solutions (PostgreSQL over enterprise data warehouses)
   - Phased rollout required - MVP with basic AI + Dashboard, not full feature set at launch
   - No hard external deadline - internal timeline driven

4. **Operational Constraints:**
   - Maintenance windows acceptable on weekends (preferred) or after-hours
   - System uptime expectations align with business-critical applications (not 24/7 mission-critical)

### 2.5 Assumptions and Dependencies

**Assumptions:**
- Sage and other source systems will remain accessible via standard integration methods
- Source system data quality is sufficient or can be improved through transformation rules
- Users have modern web browsers (Chrome, Edge, Safari, Firefox - latest 2 versions)
- AWS infrastructure will provide adequate performance and scalability
- CFO and key stakeholders will be available for design validation interviews (not yet conducted)

**Dependencies:**
- Access to Sage API credentials and documentation
- Access to Aspire, time tracking, and fleet management system APIs/exports
- AWS account setup and infrastructure provisioning
- Sample historical data for testing and model training
- User feedback on initial wireframes/prototypes (CFO workflow to be determined)

---

## 3. System Features

### Feature 1: Data Integration & ETL Pipeline

**Description:**
Automated extraction, transformation, and loading of data from multiple source systems (Sage including payroll data, Time Tracking, Equipment/Fleet Management, Aspire) into a centralized PostgreSQL data warehouse.

**Functional Requirements:**
1. Extract data daily from Sage (GL, AP, AR, Payroll modules) via ODBC or Sage API
2. Extract data from time tracking, equipment/fleet, and Aspire systems via APIs or file exports
3. Transform and normalize data into dimensional model (star schema):
   - Dimension tables: `dim_account`, `dim_job`, `dim_region`, `dim_division`, `dim_employee`, `dim_date`
   - Fact tables: `fact_transaction`, `fact_payroll`, `fact_job_cost`, `fact_time_entry`, `fact_equipment_usage`
4. Load 3 years of historical data on initial implementation
5. Execute daily incremental loads during maintenance window (overnight)
6. Validate data completeness and referential integrity
7. Log all ETL job executions, errors, and data lineage
8. Provide notifications on ETL failures or data quality issues
9. Support manual re-runs and backfills for specific date ranges

### Feature 2: Financial Performance Dashboards

**Description:**
Interactive web-based dashboards providing comprehensive views of financial performance with filtering, drill-down, and time-series analysis capabilities.

**Functional Requirements:**
1. Display consolidated revenue, expenses, and margin metrics across all divisions
2. Provide drill-down capabilities by: Region, Division, Job, Account, Time Period
3. Visualize data using: Line charts (trends), bar charts (comparisons), pie charts (composition), tables (details)
4. Support dynamic filters: Date range selector, Region selector, Division selector, Job selector
5. Display key performance indicators (KPIs): Total revenue, gross margin %, operating expenses, net profit, revenue per region
6. Enable time-series trend analysis: Month-over-month, Quarter-over-quarter, Year-over-year comparisons
7. Provide export functionality: Export charts as images, Export data to Excel/CSV
8. Support multiple simultaneous user sessions (20-30 concurrent users)
9. Render dashboards within 2-3 seconds for standard queries
10. Display data freshness timestamp ("Last updated: YYYY-MM-DD HH:MM")

### Feature 3: AI-Powered Financial Analyst

**Description:**
Natural language interface enabling users to ask questions about financial performance and receive both data-driven answers and narrative explanations. The AI proactively surfaces insights and anomalies.

**Functional Requirements:**
1. Accept natural language questions via chat interface (e.g., "What drove margin decline in Q3?")
2. Translate questions into SQL queries against semantic data layer (not raw tables)
3. Return answers as: Numerical results, Charts/visualizations, Narrative explanations
4. Proactively generate insights on dashboard load: Key variances, Emerging trends, Anomaly alerts
5. Provide transparency: Show SQL generated, Explain reasoning, Cite data sources
6. Maintain conversation context for follow-up questions
7. Implement guardrails: Prevent access to raw PII or sensitive data, Query timeout limits (30 seconds), Result set size limits
8. Log all AI interactions for audit: User ID, timestamp, question asked, SQL generated, results returned
9. Support financial domain-specific queries: Variance analysis, Ratio calculations, Trend identification
10. Achieve ≥85% accuracy on standard financial metrics queries

### Feature 4: Predictive & Diagnostic Analytics

**Description:**
Machine learning models and statistical analysis to forecast future performance, detect anomalies, and support scenario planning.

**Functional Requirements:**
1. **Cash Flow Forecasting:**
   - Predict cash flow 30/60/90 days forward
   - Incorporate historical patterns, seasonality, and contract pipeline data
   - Display confidence intervals
   - Update forecasts daily with new data

2. **Labor Cost Forecasting:**
   - Predict labor costs by division and region
   - Factor in historical utilization, seasonal demand, and known staffing changes
   - Alert on projected overruns

3. **Anomaly Detection:**
   - Detect unusual spikes or drops in: Revenue, expenses, labor costs, material costs, job profitability
   - Flag anomalies in dashboard with visual indicators
   - Send email/Slack alerts to relevant stakeholders (configurable)
   - Generate automated summary reports for review

4. **Scenario Modeling:**
   - Allow users to model "what-if" scenarios: Price changes, volume changes, cost structure adjustments
   - Compare scenarios side-by-side
   - Save and share scenario analyses

5. **Trend Analysis:**
   - Identify labor cost spikes, seasonal revenue patterns, material cost volatility, customer payment delays
   - Provide root cause analysis where possible

### Feature 5: Data Reconciliation & Quality Assurance

**Description:**
Automated validation ensuring data warehouse totals match source systems and maintaining data integrity.

**Functional Requirements:**
1. Perform daily reconciliation checks: Sage GL totals vs. warehouse fact_transaction totals, Sage Payroll totals vs. warehouse fact_payroll totals
2. Flag discrepancies exceeding threshold (0.1% variance)
3. Generate reconciliation reports accessible to finance analysts
4. Prevent AI and dashboards from querying unreconciled data
5. Maintain data quality metrics: Completeness, accuracy, timeliness, consistency
6. Alert data stewards on quality issues
7. Support manual reconciliation overrides with approval workflow

### Feature 6: Security, Governance & Audit

**Description:**
Comprehensive security controls, role-based access, and audit logging to ensure data protection and compliance.

**Functional Requirements:**
1. **Authentication & Authorization:**
   - Integrate with Superscapes SSO/Active Directory (or implement secure login)
   - Implement role-based access control (RBAC) with roles: Admin, CFO, Finance Analyst, Regional Manager, Executive (View-only)
   - Plan for future regional data restrictions (not MVP)

2. **Data Security:**
   - Encrypt data in transit (TLS 1.2+)
   - Encrypt data at rest (database encryption)
   - Encrypt connections to Sage and source systems
   - Mask sensitive fields in non-production environments

3. **Audit Logging:**
   - Log all user logins and access attempts
   - Log all AI queries (user, timestamp, query, results)
   - Log all data exports
   - Log all administrative actions
   - Retain audit logs for 7 years (compliance requirement)

4. **Compliance:**
   - Support accounting audit standards
   - Provide audit trail for all financial data transformations
   - Enable data lineage tracking (source to dashboard)

---

## 4. External Interface Requirements

### 4.1 User Interfaces

**General UI Requirements:**
- Modern, clean web interface (fresh design optimized for financial intelligence)
- Responsive design supporting desktop and tablet (mobile support deferred to future phase)
- Support for latest 2 versions of Chrome, Edge, Safari, Firefox
- Accessible via HTTPS
- Single-page application (SPA) architecture for fluid navigation

**Key UI Components:**
1. **Dashboard View:**
   - Left sidebar: Navigation menu (Home, Dashboards, AI Analyst, Reports, Admin)
   - Top bar: User profile, notifications, data freshness indicator, help
   - Main content area: Charts, KPIs, data tables
   - Right panel (collapsible): Filters, settings

2. **AI Analyst Interface:**
   - Chat-style interface (similar to ChatGPT)
   - Input box for questions
   - Conversation history
   - Results display: text, charts, tables
   - Transparency panel: SQL preview, data sources

3. **Admin Panel:**
   - User management
   - ETL job monitoring
   - Data quality dashboard
   - Audit log viewer

**UI Preferences:**
- Professional, data-dense aesthetic (not overly colorful)
- Clear visual hierarchy
- Consistent color scheme aligned with Superscapes branding (TBD)
- Loading indicators for queries taking >1 second

### 4.2 Hardware Interfaces

Not applicable - web-based application with no direct hardware integration requirements.

### 4.3 Software Interfaces

**Source System Integrations:**

1. **Sage (Accounting System)**
   - Interface Type: ODBC or Sage API
   - Data Flow: Read-only, daily batch extraction
   - Data Elements: GL transactions, AP invoices, AR invoices, payroll records
   - Authentication: Secure credentials (vault-managed)

2. **CRM System**
   - Interface Type: REST API or file export
   - Data Flow: Read-only, daily extraction
   - Data Elements: Customer records, sales pipeline, contract data

3. **Payroll System**
   - Interface Type: API or CSV export
   - Data Flow: Read-only, daily extraction
   - Data Elements: Employee hours, labor costs by job, benefits

4. **Time Tracking System**
   - Interface Type: API integration
   - Data Flow: Read-only, daily extraction
   - Data Elements: Employee time entries, job allocations, overtime

5. **Equipment/Fleet Management System**
   - Interface Type: API or database connection
   - Data Flow: Read-only, daily extraction
   - Data Elements: Equipment usage, maintenance costs, depreciation

6. **Aspire (Industry-Specific Tool)**
   - Interface Type: API or export files
   - Data Flow: Read-only, daily extraction
   - Data Elements: Job costing, project tracking, resource allocation

**AI/LLM Integration:**
- GPT-4 API (OpenAI) for reasoning and narrative generation
- Optional: FinGPT or Llama 3 for finance-specific analysis (if needed)
- Vector database (pgvector) for document embedding and context retrieval

**Notification Services:**
- Email SMTP integration for alerts
- Slack API integration for real-time notifications

### 4.4 Communications Interfaces

**Protocols:**
- HTTPS for all web traffic
- TLS 1.2+ for database connections
- Secure API protocols (OAuth 2.0 where supported)

**Data Formats:**
- JSON for API communications
- CSV for bulk data exports
- SQL for database queries

**Network Requirements:**
- Outbound access to OpenAI API endpoints
- Outbound access to Sage and source system endpoints
- Inbound HTTPS access for user browsers

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

1. **Response Time:**
   - Dashboard load: <3 seconds for standard views
   - AI query response: <10 seconds for typical questions (30 second timeout)
   - Data export: <30 seconds for datasets up to 100k rows

2. **Throughput:**
   - Support 20-30 concurrent users without degradation
   - Handle 100+ dashboard views per hour during peak usage
   - Process 50+ AI queries per hour during peak usage

3. **ETL Performance:**
   - Complete daily ETL within 4-hour maintenance window
   - Process 3 years historical data (initial load) within 24 hours

4. **Scalability:**
   - Design to accommodate growth to 100 concurrent users
   - Support data volume growth to 10+ years historical data
   - Handle increasing job/transaction volume (thousands of active jobs)

### 5.2 Security Requirements

1. **Authentication:**
   - Secure login with password complexity requirements
   - Session timeout after 30 minutes of inactivity
   - Multi-factor authentication (optional, recommended for admin roles)

2. **Authorization:**
   - Role-based access control enforced at API and database layers
   - Principle of least privilege
   - Separation of duties (admin vs. analyst vs. viewer)

3. **Data Protection:**
   - Encryption in transit (TLS 1.2+)
   - Encryption at rest (AES-256)
   - Secure credential management (AWS Secrets Manager or similar)
   - No sensitive data in logs or error messages

4. **AI Security:**
   - LLMs cannot access raw transaction tables (only semantic views)
   - SQL injection prevention in AI-generated queries
   - Query result size limits to prevent data exfiltration
   - Audit all AI-generated SQL before execution

### 5.3 Usability Requirements

1. **Ease of Use:**
   - New users can navigate dashboards without training
   - AI interface uses natural, conversational language
   - Consistent UI patterns throughout application
   - Contextual help and tooltips

2. **Accessibility:**
   - WCAG 2.1 Level AA compliance (recommended)
   - Keyboard navigation support
   - Screen reader compatibility
   - Color contrast ratios meet standards

3. **Learnability:**
   - Comprehensive user documentation
   - In-app tutorials for key features
   - Sample queries for AI analyst
   - Role-specific quick-start guides

4. **Error Handling:**
   - Clear, actionable error messages
   - Graceful degradation on data source failures
   - User-friendly messages (no technical jargon for end users)

### 5.4 Reliability Requirements

1. **Availability:**
   - Target: 99% uptime during business hours (Monday-Friday, 6 AM - 8 PM)
   - Scheduled maintenance: Weekend windows preferred, after-hours acceptable
   - Unplanned downtime: <2 hours per month

2. **Fault Tolerance:**
   - Graceful handling of source system unavailability
   - ETL job retry logic (3 attempts with exponential backoff)
   - Dashboard displays last successful data load if current load fails

3. **Data Integrity:**
   - Automated reconciliation catches discrepancies
   - Transaction consistency in database operations
   - No data loss during ETL failures (rollback capability)

4. **Backup & Recovery:**
   - Daily database backups with 30-day retention
   - Point-in-time recovery capability (7 days)
   - Recovery Time Objective (RTO): 4 hours
   - Recovery Point Objective (RPO): 24 hours

### 5.5 Other Non-Functional Requirements

**Maintainability:**
- Modular architecture enabling independent component updates
- Comprehensive code documentation
- Automated testing (unit, integration, end-to-end)
- Deployment automation (CI/CD)

**Portability:**
- Containerized deployment (Docker)
- Infrastructure as Code (Terraform or CloudFormation)
- Database-agnostic design where feasible (minimize vendor lock-in)

**Compliance:**
- Support for accounting audit requirements
- Data retention policies configurable
- GDPR considerations (if applicable to employee data)

---

## 6. System Architecture

### 6.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Data Warehouse** | PostgreSQL 14+ | Cost-effective, flexible, team familiarity; pgvector extension for AI embeddings |
| **ETL Orchestration** | Apache Airflow or Prefect | Robust scheduling, monitoring, retry logic |
| **Data Transformation** | dbt (data build tool) | SQL-based transformations, version control, testing |
| **Data Ingestion** | Airbyte or custom Python scripts | Sage integration, CRM connectors, flexibility |
| **Backend API** | FastAPI (Python) | High performance, async support, OpenAPI documentation |
| **Frontend** | React 18+ with TypeScript | Modern SPA framework, strong ecosystem |
| **Visualization** | Plotly.js or Recharts | Interactive charts, flexibility |
| **AI/LLM** | OpenAI GPT-4 | Advanced reasoning, natural language understanding |
| **Vector Database** | pgvector (PostgreSQL extension) | Embeddings for document/context retrieval |
| **Authentication** | OAuth 2.0 / JWT | Industry standard, supports SSO integration |
| **Infrastructure** | AWS (ECS or EKS) | Docker containerized deployment, scalable |
| **Monitoring** | CloudWatch + Grafana | Application and infrastructure monitoring |
| **CI/CD** | GitHub Actions or GitLab CI | Automated testing and deployment |

### 6.2 Data Storage

**Data Warehouse Schema (Dimensional Model):**

**Dimension Tables:**
- `dim_account` - Chart of accounts from Sage
- `dim_job` - Job/project master data
- `dim_region` - Geographic regions
- `dim_division` - Business divisions (maintenance, design-build, seasonal)
- `dim_employee` - Employee master data
- `dim_date` - Date dimension for time-series analysis
- `dim_customer` - Customer/client information
- `dim_vendor` - Vendor/supplier information
- `dim_equipment` - Equipment/fleet assets

**Fact Tables:**
- `fact_transaction` - General ledger transactions
- `fact_payroll` - Payroll expenses by employee and job
- `fact_job_cost` - Job-level cost details
- `fact_time_entry` - Employee time tracking entries
- `fact_equipment_usage` - Equipment utilization and costs
- `fact_ar_aging` - Accounts receivable aging snapshots
- `fact_ap_aging` - Accounts payable aging snapshots

**Semantic Layer:**
- SQL views and materialized views for common aggregations
- Pre-calculated metrics for performance
- AI-accessible views with appropriate aggregation (no raw PII)

**Storage Estimates:**
- 3 years historical data: ~50-100 million transaction records
- Growth: ~15-20 million new records per year
- Total database size: 100-200 GB (initial), growing 30-50 GB/year

### 6.3 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Dashboard   │  │ AI Analyst   │  │   Admin Panel      │    │
│  │  (React)     │  │  Interface   │  │                    │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           API Gateway (FastAPI)                          │   │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │ Auth    │  │Dashboard │  │   AI     │  │  Admin   │  │   │
│  │  │Services │  │   API    │  │ Service  │  │   API    │  │   │
│  │  └─────────┘  └──────────┘  └──────────┘  └──────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                         AI LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  GPT-4 API   │  │  pgvector    │  │  Query Generator   │    │
│  │  (OpenAI)    │  │ (embeddings) │  │  (SQL validation)  │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         PostgreSQL Data Warehouse                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │   │
│  │  │ Raw Data │  │Dimensional│  │   Semantic Layer     │   │   │
│  │  │  Staging │  │  Model    │  │  (AI-accessible)     │   │   │
│  │  └──────────┘  └──────────┘  └──────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────────┐
│                      ETL LAYER                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Airflow / Prefect Orchestration                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │   │
│  │  │ Airbyte  │  │   dbt    │  │Reconcile │  │ Quality │  │   │
│  │  │(Extract) │  │(Transform│  │ & Validate│  │ Checks  │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↑ Daily Extract
┌─────────────────────────────────────────────────────────────────┐
│                    SOURCE SYSTEMS                               │
│  ┌────────┐ ┌─────┐ ┌────────┐ ┌──────┐ ┌───────┐ ┌─────────┐ │
│  │ Sage   │ │ CRM │ │Payroll │ │ Time │ │ Fleet │ │ Aspire  │ │
│  │        │ │     │ │        │ │Track │ │ Mgmt  │ │         │ │
│  └────────┘ └─────┘ └────────┘ └──────┘ └───────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. **Extract:** Nightly ETL jobs pull data from source systems (Sage, CRM, Payroll, Time Tracking, Fleet, Aspire)
2. **Transform:** dbt transforms raw data into dimensional model (star schema)
3. **Validate:** Reconciliation jobs verify totals match source systems
4. **Load:** Transformed data loaded into PostgreSQL warehouse
5. **Serve:** FastAPI serves data to dashboards and AI services
6. **Analyze:** AI generates insights and answers queries using semantic layer
7. **Present:** React frontend displays dashboards and AI responses

---

## 7. Appendix

### 7.1 Success Metrics (Detailed)

**Operational Metrics:**
- Monthly close reporting time reduced by 75% (from ~10 days to ~2.5 days)
- Dashboard adoption: >90% of finance users within 90 days of launch
- AI query usage: >50 queries per week by end of quarter 1
- Data freshness: 100% of daily ETL jobs complete successfully

**Quality Metrics:**
- AI Q&A accuracy on financial metrics ≥85%
- Dashboard query response time <3 seconds (95th percentile)
- Data reconciliation discrepancies <0.1%
- System uptime ≥99% during business hours

**Business Impact Metrics:**
- Forecast variance reduced by 10% quarter-over-quarter
- Time saved per finance analyst: 10+ hours per month
- Enable rapid decision-making: Provide answers to financial questions in minutes rather than days
- User satisfaction score: ≥4.0 out of 5.0

### 7.2 Phased Rollout Plan (Recommendation)

**Phase 1 - MVP (Months 1-3):**
- Sage, CRM, and Payroll integration only
- Core financial dashboards (revenue, expenses, margins)
- Basic AI analyst (Q&A, no proactive insights)
- User authentication and basic RBAC
- Daily ETL with reconciliation
- **Target:** CFO and finance analysts (5-10 users)

**Phase 2 - Enhancement (Months 4-5):**
- Add Time Tracking, Fleet Management, Aspire integrations
- Proactive AI insights and anomaly detection
- Cash flow and labor cost forecasting
- Email/Slack alerts
- Expanded dashboards (job-level, division-level)
- **Target:** Add regional managers (20-25 users)

**Phase 3 - Advanced Features (Months 6+):**
- Scenario modeling
- Advanced predictive analytics
- Regional data restrictions (RBAC enhancement)
- Mobile-responsive optimization
- Custom report builder
- **Target:** All users including executives (30+ users)

### 7.3 MVP Definition (Recommended)

The Minimum Viable Product that establishes foundational financial intelligence capabilities includes:

**Must-Have Features:**
1. Automated daily data load from Sage (GL, AP, AR, Payroll)
2. Single consolidated dashboard showing:
   - Total revenue, expenses, margins (current month, YTD)
   - Trend charts (12-month rolling)
   - Drill-down by region and division
3. AI analyst capable of answering 20-30 common financial questions with ≥80% accuracy
4. Data reconciliation ensuring Sage totals match
5. Secure login and basic role-based access
6. Data freshness indicator

**Success Criteria for MVP:**
- Provides structured financial reporting where ad-hoc manual processes currently exist
- CFO can answer board questions with real-time data access
- Finance analysts gain ≥5 hours per month through automated data access and analysis capabilities
- System accessible and responsive for 5-10 concurrent users

### 7.4 Timeline Recommendation

**Estimated Timeline (Internal Deadlines - Flexible):**

- **Weeks 1-2:** Infrastructure setup (AWS, PostgreSQL, dev environment)
- **Weeks 3-6:** ETL development (Sage integration, dimensional model, dbt transformations)
- **Weeks 7-10:** Dashboard development (React frontend, basic visualizations)
- **Weeks 11-13:** AI analyst development (GPT-4 integration, semantic layer, query generation)
- **Weeks 14-15:** Security, RBAC, audit logging
- **Weeks 16-17:** Testing (UAT with CFO and finance team)
- **Week 18:** MVP Launch

**Total MVP Timeline: ~4-5 months from project kickoff**

**Critical Path Items:**
- Sage API access and credentials (Week 1)
- CFO interview for dashboard requirements (Week 6-7)
- User acceptance testing window (Week 16-17)

### 7.5 Open Questions for Future Resolution

1. **CFO Workflow:** Detailed CFO morning scenario and dashboard priorities (requires interview)
2. **Aspire Integration:** Technical documentation and API capabilities not yet assessed
3. **Branding:** Superscapes color scheme and design guidelines for UI
4. **Notifications:** Specific email/Slack distribution lists for anomaly alerts
5. **Forecast Models:** Preference for statistical methods (ARIMA, Prophet) vs. ML models (LSTM, XGBoost)
6. **Scenario Modeling:** Specific scenarios to pre-build vs. ad-hoc user-defined scenarios
7. **Regional Restrictions:** Future RBAC model for regional data access (timeline and requirements TBD)

### 7.6 Discovery Interview Recap

The following questions were asked during the discovery interview to clarify requirements:

**Q1:** Beyond the 75% reduction in reporting time, what's the single biggest pain point you want to eliminate first?
**A:** All equally important, but delayed insights for decision-making is the biggest current pain point.

**Q2:** When you mention "emerging trends" - what type of trends are most critical?
**A:** All of the above (labor cost spikes, seasonal revenue patterns, material cost volatility, customer payment delays).

**Q3:** Walk me through a typical CFO morning scenario: They log in and... what are the first 3 things they want to see or do?
**A:** Unknown - requires future interview with CFO (not yet scheduled).

**Q4:** For the AI analyst - should it proactively surface insights or only respond to questions, or both?
**A:** Both - proactive insights and question-response capability.

**Q5:** Are there specific workflows you want to replicate in the dashboard, or should this be a fresh design?
**A:** Fresh design - create new structured financial intelligence capabilities.

**Q6:** Beyond Sage mentioned - are there other critical data sources?
**A:** Time tracking systems, equipment/fleet management, and Aspire (landscaping industry tool). Note: CRM and external payroll systems were initially mentioned but removed from scope - payroll data comes from Sage.

**Q7:** What's the expected data refresh frequency?
**A:** Daily (overnight batch processing).

**Q8:** Historical data: How many years of Sage data need to be loaded initially?
**A:** 3 years.

**Q9:** Does Superscapes have existing cloud infrastructure preferences?
**A:** AWS.

**Q10:** For role-based access - should regional managers only see their region's data, or aggregate views with restricted drill-down?
**A:** Regional restrictions not needed for MVP, plan for future phase.

**Q11:** What's the acceptable downtime for scheduled maintenance?
**A:** Weekend maintenance windows preferred, after-hours (nights) acceptable.

**Q12:** For forecasting - should the AI use only historical patterns, or incorporate external factors?
**A:*** Incorporate external factors including seasonality, economic indicators, and contract pipeline for more accurate forecasting.

**Q13:** When AI detects an anomaly (e.g., unexpected cost spike), what action should it take?
**A:*** Both flag in dashboard and send email/Slack alerts to relevant stakeholders (configurable).

**Q14:** Would you prefer to launch with Dashboard first, Basic AI + Dashboard together, or Full feature set at once?
**A:** Basic AI + Dashboard together (MVP approach).

**Q15:** Is there a target launch date or fiscal event driving this?
**A:*** ASAP based on internal timeline, no hard external deadline. Recommended 18-week timeline for MVP (4-5 months from kickoff).

**Q16:** What's your MVP definition - the minimum that would deliver immediate value?
**A:*** MVP must include (1) automated daily data load from Sage, (2) consolidated dashboard with revenue/expenses/margins and trend charts, (3) drill-down by region and division, (4) AI analyst capable of answering 20-30 common financial questions with ≥80% accuracy, (5) data reconciliation, (6) secure login and basic RBAC. This establishes structured financial reporting and provides CFO with real-time data access for board questions.

*Note: Asterisk (*) indicates answer was AI-recommended based on best practices.*

### 7.7 Glossary

| Term | Definition |
|------|------------|
| **Anomaly Detection** | Automated identification of unusual patterns in financial data (e.g., unexpected cost spikes) |
| **Aspire** | Landscaping industry-specific software used by Superscapes for job tracking and resource management |
| **Dimensional Model** | Data warehouse design using fact and dimension tables (star schema) optimized for analytics |
| **Drill-down** | Ability to navigate from summary data to detailed transactions (e.g., total revenue → regional revenue → job revenue) |
| **Forecast Variance** | Difference between predicted and actual financial outcomes |
| **Job Costing** | Tracking costs (labor, materials, equipment) at individual job/project level |
| **Reconciliation** | Validation that data warehouse totals match source system (Sage) totals |
| **Semantic Layer** | Abstraction layer providing business-friendly views of data for AI and reporting (hides technical schema complexity) |
| **Variance Analysis** | Comparing actual performance to budget or prior period to identify differences and root causes |

---

**Document Control:**
- **Created:** October 25, 2025
- **Author:** AI Assistant (based on seed document and discovery interview)
- **Reviewers:** Superscapes CFO and project stakeholders (pending)
- **Next Steps:** User review and approval → Generate PRD using `02-create-prd.md` workflow
