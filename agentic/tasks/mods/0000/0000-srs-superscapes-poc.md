# Software Requirements Specification (SRS)
## Superscapes Financial Intelligence Dashboard - POC

**Version:** 1.0  
**Date:** October 26, 2025  
**Project Code:** 0000  
**Phase:** Proof of Concept

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the Superscapes Financial Intelligence Dashboard POC - a rapid 7-10 day prototype that validates core technical assumptions before committing to the full 18-week MVP (project 0001).

This POC demonstrates: (1) AI can generate accurate SQL from natural language, (2) Sage data can be extracted and visualized, and (3) the proposed technical stack is viable.

### 1.2 Scope

**In Scope:**
- Manual load of 3 months Sage GL transaction data into PostgreSQL
- Single financial dashboard showing revenue/expense trends
- Basic AI query interface using OpenAI API
- Public deployment to Vercel (frontend) + AWS RDS (database)
- 3 core tables: transactions, accounts, regions
- Manual data validation/reconciliation

**Out of Scope:**
- Authentication and authorization (public access only)
- Automated ETL pipelines
- Multiple dashboards or advanced visualizations
- Drill-down capabilities
- Data export functionality
- Multi-year historical data (only 3 months)
- Additional data sources beyond Sage GL
- Production-grade infrastructure
- Comprehensive testing suite

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| GL | General Ledger |
| LLM | Large Language Model |
| POC | Proof of Concept |
| RDS | Amazon Relational Database Service |
| SQL | Structured Query Language |

### 1.4 References

- Seed Document: `tasks/mods/0000/seed.md`
- PRD Document: `tasks/mods/0000/0000-prd-superscapes-poc.md`
- 0001 MVP Documentation: `tasks/mods/0001/` (for context on future evolution)

---

## 2. Overall Description

### 2.1 Product Perspective

The POC is a minimal working prototype that validates technical feasibility and demonstrates value to stakeholders. It serves as the foundation for the 0001 MVP, not a throwaway experiment.

**System Context:**
- **Source System:** Sage (GL module only)
- **Data Flow:** Manual CSV export → Python load script → PostgreSQL → FastAPI → React Dashboard
- **AI Flow:** User question → FastAPI → OpenAI API → SQL generation → Query execution → Natural language response
- **Deployment:** Vercel (frontend + API routes) + AWS RDS PostgreSQL

### 2.2 Product Functions

High-level POC capabilities:

1. **Manual Data Loading:** Python script loads 3 months of Sage GL CSV export into PostgreSQL
2. **Financial Dashboard:** Single-page React app showing revenue/expense trends for 3-month period
3. **AI Query Interface:** Text input accepts natural language questions, displays SQL + results + narrative answer
4. **Public Access:** Dashboard accessible via Vercel URL without authentication

### 2.3 User Characteristics

| User Role | Quantity (POC) | Technical Proficiency | Primary Goals |
|-----------|----------------|----------------------|---------------|
| **CFO / Controller** | 1-2 | Medium | Validate data accuracy, test AI query capability |
| **Finance Analysts** | 2-3 | High | Verify SQL generation logic, reconcile against Sage |
| **Stakeholders** | 3-5 | Low-Medium | View working demo, provide feedback |

**Total Expected POC Users:** 3-5 concurrent, 5-10 total

### 2.4 Constraints

1. **Timeline:** Must complete in 7-10 days (hard deadline)
2. **Budget:** ~$50/month infrastructure cost for POC period
3. **Data Volume:** Limited to 3 months to ensure fast performance
4. **Scope Discipline:** Any feature requiring >1 day deferred to 0001 MVP
5. **Security:** No authentication (public URL) - acceptable for POC only
6. **Browser Support:** Latest versions of Chrome, Edge, Firefox, Safari only

### 2.5 Assumptions and Dependencies

**Assumptions:**
- Superscapes finance team can export 3 months of GL data from Sage as CSV
- OpenAI API access is available (paid account for GPT-4 recommended)
- AWS account exists with permissions to create RDS instances
- Vercel account exists for deployment
- Stakeholders have modern web browsers
- Budget approval for ~$50/month infrastructure

**Dependencies:**
- Sage GL CSV export in expected format
- OpenAI API key with sufficient credits
- AWS RDS setup completed by day 2
- Finance team availability for data export (~1 hour)
- Stakeholder availability for demo on day 10

---

## 3. System Features

### Feature 1: Database & Data Loading

**Description:**  
PostgreSQL database hosted on AWS RDS with 3 core tables loaded from Sage GL CSV export.

**Functional Requirements:**

**FR-101:** Database must have 3 tables with following schema:

```sql
-- transactions table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    transaction_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    account_id INTEGER NOT NULL REFERENCES accounts(account_id),
    region_id INTEGER REFERENCES regions(region_id),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- accounts table
CREATE TABLE accounts (
    account_id INTEGER PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Revenue', 'Expense', 'Asset', etc.
    subcategory VARCHAR(100)
);

-- regions table
CREATE TABLE regions (
    region_id INTEGER PRIMARY KEY,
    region_code VARCHAR(20) NOT NULL,
    region_name VARCHAR(100) NOT NULL
);
```

**FR-102:** Python data loading script must:
- Read Sage GL CSV export
- Validate data (non-null amounts, valid dates, foreign key integrity)
- Load ~500K-1M transaction records
- Report load statistics (rows loaded, errors, completion time)
- Handle duplicate detection (skip or error)

**FR-103:** Database must be accessible from:
- Local development environment (for development)
- Vercel serverless functions (for production API)

**FR-104:** Database credentials must be stored in environment variables (never committed to git).

### Feature 2: Backend API

**Description:**  
FastAPI backend with 3 endpoints deployed to Vercel as serverless functions.

**Functional Requirements:**

**FR-201:** Implement `GET /health` endpoint:
- Returns: `{"status": "healthy", "timestamp": "2024-10-26T10:30:00Z"}`
- Response time: <500ms
- Used for: Deployment verification, monitoring

**FR-202:** Implement `GET /api/dashboard` endpoint:
- Returns: Dashboard data (KPIs + monthly trends)
- Response format:
```json
{
  "kpis": {
    "total_revenue": 12500000.00,
    "total_expenses": 9800000.00,
    "gross_margin": 2700000.00,
    "gross_margin_pct": 21.6
  },
  "monthly_trends": [
    {"month": "2024-07", "revenue": 4200000, "expenses": 3300000},
    {"month": "2024-08", "revenue": 4100000, "expenses": 3200000},
    {"month": "2024-09", "revenue": 4200000, "expenses": 3300000}
  ],
  "data_period": {
    "start_date": "2024-07-01",
    "end_date": "2024-09-30"
  }
}
```
- Performance: Return in <2 seconds
- Error handling: 500 with error message if database unreachable

**FR-203:** Implement `POST /api/ask` endpoint:
- Accepts: `{"question": "What were our total expenses in August?"}`
- Calls OpenAI API with:
  - Database schema context
  - Instruction to generate valid PostgreSQL SQL
  - Safety constraints (SELECT only, no DDL/DML)
- Executes generated SQL against database
- Returns:
```json
{
  "question": "What were our total expenses in August?",
  "sql": "SELECT SUM(amount) FROM transactions WHERE...",
  "results": [{"total_expenses": 3200000.00}],
  "answer": "Your total expenses in August 2024 were $3,200,000.",
  "execution_time_ms": 245
}
```
- Error handling:
  - Invalid SQL: Return 400 with error message
  - Query timeout (>10s): Return 408 timeout error
  - OpenAI API error: Return 503 service unavailable
  - No results: Return successful response with empty results array

**FR-204:** API must implement CORS to allow requests from Vercel frontend domain.

**FR-205:** API must validate all incoming requests (schema validation using Pydantic).

**FR-206:** API must restrict AI-generated SQL to:
- SELECT statements only
- No INSERT, UPDATE, DELETE, DROP, CREATE, ALTER
- Maximum result set: 1000 rows
- Query timeout: 10 seconds

**FR-207:** API must log all requests with:
- Endpoint called
- Timestamp
- Response status code
- Execution time
- (For /api/ask) User question, generated SQL, success/failure

### Feature 3: Frontend Dashboard

**Description:**  
Single-page React application with Tailwind CSS showing financial overview and AI query interface.

**Functional Requirements:**

**FR-301:** Dashboard must display 4 KPI cards showing:
- Total Revenue (with dollar formatting)
- Total Expenses (with dollar formatting)
- Gross Margin (dollar amount)
- Gross Margin % (percentage with 1 decimal)

**FR-302:** Dashboard must display monthly trend chart:
- Type: Grouped bar chart (revenue vs. expenses)
- X-axis: Month labels (Jul, Aug, Sep)
- Y-axis: Dollar amounts (with $ formatting)
- Legend: Revenue (blue), Expenses (red)
- Tooltip: Show exact values on hover

**FR-303:** Dashboard must display data period indicator:
- Format: "Showing data from July 1 - September 30, 2024"
- Location: Below main heading

**FR-304:** Dashboard must display AI query interface:
- Text input field: Large, placeholder "Ask a question about your financial data..."
- Submit button: "Ask AI" button
- Example questions: Display 3-5 example questions users can click
- Results display area: Shows SQL + results table + narrative answer

**FR-305:** AI query results must display:
1. **Generated SQL:** Code block with syntax highlighting
2. **Results Table:** Formatted table (max 100 rows displayed)
3. **Natural Language Answer:** Narrative response from AI
4. **Execution Time:** "Query executed in 245ms"

**FR-306:** Dashboard must show loading states:
- Dashboard data loading: Skeleton screens for KPI cards + chart
- AI query in progress: Disable submit button, show spinner with "Thinking..."

**FR-307:** Dashboard must handle errors gracefully:
- Failed to load dashboard data: Error message with retry button
- AI query error: Display error message, allow user to retry
- No results: "No data found for your question"

**FR-308:** Dashboard must be responsive:
- Desktop (1024px+): Full layout with side-by-side sections
- Tablet (768-1023px): Stacked layout
- Mobile (< 768px): Basic support, fully stacked

**FR-309:** Dashboard styling must use:
- Tailwind CSS utility classes
- Professional color scheme (blue/gray palette)
- Clean typography (system fonts)
- Consistent spacing and padding

### Feature 4: AI Query Processing

**Description:**  
OpenAI integration that translates natural language questions into SQL queries and generates narrative responses.

**Functional Requirements:**

**FR-401:** AI prompt must include:
- Database schema (table structures, column names, data types)
- Sample data (2-3 rows per table for context)
- Instructions: "Generate a valid PostgreSQL SELECT query to answer the user's question"
- Safety rules: "Only generate SELECT statements. Do not use INSERT, UPDATE, DELETE, DROP, or CREATE"
- Output format: "Return only the SQL query, no explanations"

**FR-402:** AI must use GPT-4 or GPT-3.5-turbo model.

**FR-403:** SQL validation must:
- Check query starts with SELECT
- Reject queries containing: INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, TRUNCATE
- Validate query is valid PostgreSQL syntax (attempt parse)

**FR-404:** Query execution must:
- Set timeout to 10 seconds
- Limit results to 1000 rows
- Return results as JSON-serializable format

**FR-405:** Natural language answer must:
- Use second AI call: "Given this SQL query and results, provide a concise natural language answer to the user's question"
- Format numbers with commas and currency symbols where appropriate
- Be 1-3 sentences maximum

**FR-406:** AI system must log:
- Original question
- Generated SQL
- SQL validation result (pass/fail)
- Query execution result (success/error)
- Execution time
- Timestamp

### Feature 5: Deployment & Infrastructure

**Description:**  
Deployment to Vercel (frontend + API) and AWS RDS PostgreSQL.

**Functional Requirements:**

**FR-501:** Frontend must be deployed to Vercel:
- Build command: `npm run build` (Vite)
- Output directory: `dist`
- Environment variables: `VITE_API_URL` pointing to API base URL

**FR-502:** Backend API must be deployed to Vercel:
- Framework: FastAPI
- Serverless functions in `/api` directory
- Environment variables: `DATABASE_URL`, `OPENAI_API_KEY`

**FR-503:** Database must be AWS RDS PostgreSQL:
- Instance type: db.t3.micro (or db.t4g.micro for cost optimization)
- Storage: 20GB GP2
- PostgreSQL version: 14 or 15
- Public accessibility: Yes (for POC only; secured via security group)
- Backup retention: 7 days

**FR-504:** Security group must allow:
- Inbound PostgreSQL (5432) from: Developer IP, Vercel IP ranges
- Outbound: All traffic

**FR-505:** Environment variables must be stored:
- Vercel: Project settings → Environment Variables
- Never committed to git repository
- .env.example provided with placeholder values

**FR-506:** Deployment must be automated:
- Git push to main branch triggers Vercel deployment
- Build and deploy complete in <5 minutes
- Deployment URL is HTTPS with valid certificate

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-101:** Dashboard page load time:
- Initial load: <3 seconds (including API call to /api/dashboard)
- Subsequent loads: <1 second (with browser caching)

**NFR-102:** API response times:
- /health: <500ms
- /api/dashboard: <2 seconds
- /api/ask: <10 seconds (including OpenAI API time)

**NFR-103:** Database query performance:
- Simple aggregations (SUM, COUNT): <500ms
- Complex queries (multiple JOINs): <2 seconds
- Full table scan (all 500K-1M rows): <5 seconds

**NFR-104:** Concurrent users:
- Support 3-5 concurrent users without performance degradation
- Handle 10 requests per minute

### 4.2 Reliability

**NFR-201:** System uptime:
- Target: 95% during business hours (8 AM - 6 PM Eastern) for POC period
- Acceptable downtime: Weekends/evenings for maintenance

**NFR-202:** Error handling:
- All errors return appropriate HTTP status codes
- Error messages are clear and actionable
- No unhandled exceptions crash the application

**NFR-203:** Data integrity:
- Foreign key constraints enforced in database
- Transactions used for multi-step operations
- No partial data loads (all-or-nothing for CSV import)

### 4.3 Usability

**NFR-301:** Dashboard must be intuitive:
- First-time users can understand KPIs without explanation
- Chart labels are clear and descriptive
- AI interface provides example questions

**NFR-302:** Error messages must be user-friendly:
- Avoid technical jargon for end users
- Provide actionable next steps
- Example: "Unable to load dashboard data. Please refresh the page or try again later."

**NFR-303:** Visual design must be professional:
- Consistent color scheme
- Readable fonts (minimum 14px for body text)
- Adequate contrast ratios (WCAG AA compliance)
- Loading states prevent user confusion

### 4.4 Security (Minimal for POC)

**NFR-401:** Credentials security:
- Database credentials stored in environment variables
- OpenAI API key stored in environment variables
- No credentials in git repository
- .env file in .gitignore

**NFR-402:** SQL injection prevention:
- Use parameterized queries
- Validate AI-generated SQL before execution
- Restrict to SELECT statements only

**NFR-403:** HTTPS:
- All traffic encrypted in transit (Vercel provides HTTPS by default)
- Database connections use SSL/TLS

**NFR-404:** No authentication for POC:
- Dashboard is publicly accessible (acceptable for POC only)
- No sensitive PII in 3-month dataset
- Full authentication in 0001 MVP

### 4.5 Maintainability

**NFR-501:** Code organization:
- Frontend: Component-based architecture
- Backend: Modular route handlers
- Database: Version-controlled schema (SQL file)
- Clear separation of concerns

**NFR-502:** Documentation:
- README with setup instructions
- API endpoint documentation
- Database schema diagram
- Environment variable template (.env.example)

**NFR-503:** Code style:
- TypeScript for frontend (type safety)
- Python type hints for backend
- Consistent formatting (Prettier for frontend, Black for backend)

### 4.6 Data Accuracy

**NFR-601:** Data validation:
- Dashboard totals must match Sage GL totals within 0.1%
- Manual reconciliation performed before stakeholder demo
- Documented reconciliation process

**NFR-602:** AI accuracy:
- 70% of test questions (7 out of 10) must generate correct SQL
- Results must be factually accurate when SQL is correct
- False positives (wrong answers stated confidently) logged and analyzed

---

## 5. System Architecture

### 5.1 High-Level Architecture

```
┌─────────────┐
│   Browser   │
│  (Chrome,   │
│   Edge,     │
│  Firefox,   │
│  Safari)    │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────┐
│         Vercel Platform         │
│                                 │
│  ┌──────────────────────────┐  │
│  │   React Frontend (SPA)   │  │
│  │   - Dashboard.tsx        │  │
│  │   - AskAI.tsx           │  │
│  │   - Components          │  │
│  └──────────┬───────────────┘  │
│             │                   │
│             ▼                   │
│  ┌──────────────────────────┐  │
│  │  FastAPI Backend (API)   │  │
│  │  - GET /health          │  │
│  │  - GET /api/dashboard   │  │
│  │  - POST /api/ask        │  │
│  └──┬────────────────┬──────┘  │
│     │                │          │
└─────┼────────────────┼──────────┘
      │                │
      │                │ HTTPS API Call
      │                ▼
      │         ┌──────────────┐
      │         │  OpenAI API  │
      │         │  (GPT-4)     │
      │         └──────────────┘
      │
      │ PostgreSQL Connection
      ▼
┌─────────────────────┐
│   AWS RDS Postgres  │
│                     │
│  - transactions     │
│  - accounts         │
│  - regions          │
└─────────────────────┘
```

### 5.2 Data Flow

**Dashboard Load Flow:**
1. User navigates to Vercel URL
2. Browser loads React SPA
3. React calls `GET /api/dashboard`
4. FastAPI queries PostgreSQL (aggregations)
5. API returns JSON with KPIs + monthly trends
6. React renders dashboard with charts

**AI Query Flow:**
1. User enters question in text input
2. React calls `POST /api/ask` with question
3. FastAPI sends question + schema to OpenAI API
4. OpenAI returns SQL query
5. FastAPI validates SQL (SELECT only)
6. FastAPI executes SQL against PostgreSQL
7. FastAPI sends results back to OpenAI for narrative answer
8. API returns: SQL + results + narrative
9. React displays all three sections

### 5.3 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + TypeScript | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Build Tool | Vite | Fast dev server + build |
| Charting | Recharts | React chart library |
| Backend | FastAPI | Python API framework |
| Database | PostgreSQL 14/15 | Relational database |
| Database Host | AWS RDS | Managed PostgreSQL |
| AI | OpenAI GPT-4 API | Text-to-SQL + narratives |
| Hosting | Vercel | Frontend + API deployment |
| Version Control | Git + GitHub | Source control |

---

## 6. Database Design

### 6.1 Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐
│   regions   │         │  accounts   │
├─────────────┤         ├─────────────┤
│ region_id   │◄────┐   │ account_id  │◄───┐
│ region_code │     │   │ account_#   │    │
│ region_name │     │   │ account_name│    │
└─────────────┘     │   │ category    │    │
                    │   │ subcategory │    │
                    │   └─────────────┘    │
                    │                      │
                    │   ┌──────────────────┴──────────────┐
                    │   │                                 │
                    │   │      transactions               │
                    │   │  ────────────────────────────   │
                    └───┤  transaction_id (PK)            │
                        │  transaction_date               │
                        │  amount                         │
                        │  account_id (FK)                │
                        │  region_id (FK)                 │
                        │  description                    │
                        │  created_at                     │
                        └─────────────────────────────────┘
```

### 6.2 Table Specifications

**transactions**
- Primary Key: transaction_id (SERIAL)
- Indexes: transaction_date, account_id, region_id
- Estimated rows: 500K - 1M
- Growth: Static (POC data doesn't change)

**accounts**
- Primary Key: account_id (INTEGER)
- Unique: account_number
- Estimated rows: 100-500
- Growth: Static (chart of accounts)

**regions**
- Primary Key: region_id (INTEGER)
- Estimated rows: 5-15
- Growth: Static (regional structure)

---

## 7. API Specification

### 7.1 Endpoints

**GET /health**
- Description: Health check endpoint
- Request: None
- Response: `{"status": "healthy", "timestamp": "ISO-8601"}`
- Status Codes: 200 OK

**GET /api/dashboard**
- Description: Returns dashboard data
- Request: None (query params optional for future filtering)
- Response:
```json
{
  "kpis": {
    "total_revenue": number,
    "total_expenses": number,
    "gross_margin": number,
    "gross_margin_pct": number
  },
  "monthly_trends": [
    {
      "month": "YYYY-MM",
      "revenue": number,
      "expenses": number
    }
  ],
  "data_period": {
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
  }
}
```
- Status Codes: 200 OK, 500 Internal Server Error

**POST /api/ask**
- Description: AI-powered query endpoint
- Request:
```json
{
  "question": "string (max 500 characters)"
}
```
- Response:
```json
{
  "question": "string",
  "sql": "string",
  "results": array,
  "answer": "string",
  "execution_time_ms": number
}
```
- Status Codes: 200 OK, 400 Bad Request, 408 Timeout, 500 Internal Server Error, 503 Service Unavailable

---

## 8. Testing Strategy

### 8.1 Unit Testing (Minimal for POC)

- Backend: Test individual functions (SQL validation, query execution)
- Frontend: Test utility functions (data formatting)
- No comprehensive test coverage required for POC

### 8.2 Integration Testing

- Test API endpoints with Postman/Bruno
- Verify database connection from API
- Test OpenAI API integration

### 8.3 User Acceptance Testing

- Manual testing by developer
- Stakeholder testing on day 10 demo
- Test with 10 predefined AI questions (validate ≥70% accuracy)

### 8.4 Test Questions (AI Validation)

1. "What were our total expenses last month?"
2. "Show me revenue by region for the last 3 months"
3. "What was our gross margin in August?"
4. "Which region had the highest revenue?"
5. "How much did we spend on labor in Q3?"
6. "What's the trend in our monthly revenue over the 3-month period?"
7. "Show me all transactions over $10,000"
8. "What were our total costs in September?"
9. "Compare revenue between July and September"
10. "What percentage of our expenses were materials?"

**Success Criteria:** 7/10 questions generate correct SQL and accurate answers.

---

## 9. Deployment Plan

### 9.1 Environment Setup

**Day 1-2:**
1. Create AWS RDS PostgreSQL instance
2. Configure security group (allow developer IP + Vercel IPs)
3. Create database schema (run SQL file)
4. Set up Vercel project
5. Configure environment variables

### 9.2 Data Loading

**Day 2-3:**
1. Receive Sage GL CSV export from finance team
2. Validate CSV format
3. Run Python data loading script
4. Verify data loaded correctly (row counts, sample queries)
5. Perform manual reconciliation against Sage totals

### 9.3 Application Deployment

**Day 6-8:**
1. Deploy backend API to Vercel
2. Test API endpoints (health, dashboard, ask)
3. Deploy frontend to Vercel
4. Test end-to-end flow
5. Fix bugs and refine

### 9.4 Final Testing & Demo

**Day 9-10:**
1. Run full test suite (10 AI questions)
2. Performance testing (load times, concurrent users)
3. Manual QA of all features
4. Prepare demo environment
5. Stakeholder demo and feedback session

---

## 10. Success Metrics

The POC is successful if all criteria are met:

✅ **On-Time Delivery:** Working demo deployed by day 10  
✅ **Data Accuracy:** Dashboard totals match Sage within 0.1%  
✅ **AI Accuracy:** ≥70% success rate on test questions (7/10)  
✅ **Performance:** Dashboard loads in <3s, AI queries return in <10s  
✅ **Stakeholder Approval:** CFO/finance team can access and interact with demo  
✅ **Technical Validation:** Stack proven viable for 0001 MVP  

---

## 11. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sage CSV format incompatible | High | Validate format day 1, work with finance team |
| AI accuracy <70% | High | Provide detailed schema context, use GPT-4 |
| RDS setup delays | Medium | Use Terraform or CloudFormation templates |
| OpenAI API costs high | Low | Monitor usage, use GPT-3.5-turbo for testing |
| Vercel deployment issues | Medium | Test deployment early (day 3) |
| Scope creep | High | Strictly defer non-essential features to 0001 |

---

## 12. Appendix: Sample Data Structure

### Sample CSV Format (Sage GL Export)

```csv
transaction_id,transaction_date,amount,account_number,region_code,description
1,2024-07-01,15000.00,4000,NE,Revenue - Maintenance Contract
2,2024-07-01,-3500.00,5100,NE,Labor - Crew Wages
3,2024-07-02,8500.00,4100,SE,Revenue - Design-Build Project
...
```

### Sample API Response (Dashboard)

```json
{
  "kpis": {
    "total_revenue": 12500000.00,
    "total_expenses": 9800000.00,
    "gross_margin": 2700000.00,
    "gross_margin_pct": 21.6
  },
  "monthly_trends": [
    {"month": "2024-07", "revenue": 4200000, "expenses": 3300000},
    {"month": "2024-08", "revenue": 4100000, "expenses": 3200000},
    {"month": "2024-09", "revenue": 4200000, "expenses": 3300000}
  ],
  "data_period": {
    "start_date": "2024-07-01",
    "end_date": "2024-09-30"
  }
}
```

---

**Document Prepared By:** AI Assistant  
**Review Status:** Pending  
**Approval Status:** Pending
