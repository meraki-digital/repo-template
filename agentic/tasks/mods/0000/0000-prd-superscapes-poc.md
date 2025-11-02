# Product Requirements Document (PRD)
## Superscapes Financial Intelligence Dashboard - POC

**Version:** 1.0  
**Date:** October 26, 2025  
**Project Code:** 0000  
**Phase:** Proof of Concept (POC)  
**Target Timeline:** 7-10 days from project kickoff

---

## 1. Introduction / Overview

The Superscapes Financial Intelligence Dashboard POC is a rapid prototype designed to validate core technical assumptions and demonstrate value before committing to the full 18-week MVP (project 0001). This POC will answer critical questions: Can AI generate accurate SQL from natural language? Can Sage data be extracted and visualized effectively? Will stakeholders find value in this approach?

**Problem Statement:**  
Before investing 5-6 months and significant resources in a full MVP, Superscapes needs:
- Proof that AI-powered financial queries work with real Sage data
- A tangible demo to build stakeholder confidence
- Early identification of data quality issues
- Validation of technical architecture decisions

**Solution:**  
A minimal working prototype deployed in 7-10 days featuring:
- 3 months of real Sage GL data in PostgreSQL
- One interactive dashboard showing revenue/expense trends
- Basic AI query interface using OpenAI API
- Public URL for stakeholder access and testing

**POC Scope:**  
This is a **time-boxed proof of concept**, not a production system. Success means demonstrating core capabilities quickly, gathering feedback, and establishing a foundation for 0001 MVP development.

---

## 2. Goals

### Primary Goals

1. **Validate AI Feasibility:** Prove that OpenAI can generate accurate SQL queries from natural language financial questions (≥70% accuracy on test queries)
2. **Demonstrate Value:** Show stakeholders a working dashboard with real Sage data within 7-10 days
3. **Identify Data Issues:** Discover Sage data quality problems early before full MVP development
4. **Build Confidence:** Provide a tangible prototype that stakeholders can interact with via public URL
5. **Establish Foundation:** Create a codebase that evolves into the 0001 MVP (not throwaway code)

### Secondary Goals

6. Test technical stack (React + FastAPI + RDS PostgreSQL + Vercel)
7. Validate data extraction process from Sage
8. Gather user feedback on dashboard design and AI interaction patterns
9. Estimate infrastructure costs for production deployment

---

## 3. User Stories

### CFO / Controller Stories (POC)

**US-001:** As a CFO, I want to view a simple dashboard showing 3-month revenue and expense trends, so that I can see proof this system can visualize our Sage data.

**US-002:** As a CFO, I want to ask basic questions like "What were our total expenses last month?" and see the AI's SQL + answer, so that I can evaluate whether AI querying will work for our needs.

**US-003:** As a Controller, I want to verify that dashboard totals match my Sage reports, so that I can trust this system's data accuracy.

### Finance Analyst Stories (POC)

**US-004:** As a Finance Analyst, I want to see the SQL query the AI generated for my question, so that I can verify the logic is correct and understand what the AI is doing.

**US-005:** As a Finance Analyst, I want to ask "Show me revenue by region" and see results in a table, so that I can test whether the AI understands our data structure.

### Stakeholder Stories (POC)

**US-006:** As a Stakeholder, I want to access the dashboard via a public URL without installing anything, so that I can easily review progress and provide feedback.

---

## 4. Functional Requirements

### 4.1 Data Integration (Manual for POC)

**FR-101:** The system must load 3 months of Sage GL transaction data into PostgreSQL via manual CSV export and Python script.

**FR-102:** The system must store data in 3 core tables:
- `transactions` - GL transaction records (date, amount, account, region, description)
- `accounts` - Chart of accounts (account_id, account_name, category)
- `regions` - Geographic regions (region_id, region_name)

**FR-103:** The system must include basic data validation during load (non-null amounts, valid dates, foreign key integrity).

**FR-104:** The system must handle ~500K-1M transaction records from a 3-month period.

### 4.2 Authentication (Deferred)

**FR-201:** The POC does **not** implement authentication. The dashboard is publicly accessible via URL.

*(Note: Production 0001 MVP will add JWT authentication and RBAC)*

### 4.3 Dashboard - Single Financial Overview

**FR-301:** The system must display one dashboard showing:
- **KPI Cards:** Total Revenue, Total Expenses, Gross Margin ($ and %)
- **Monthly Trend Chart:** Bar chart showing revenue vs. expenses for each of the 3 months
- **Data Period Indicator:** Display date range of loaded data (e.g., "July - September 2024")

**FR-302:** The system must load and display dashboard data in under 3 seconds.

**FR-303:** The dashboard must be responsive and viewable on desktop browsers (Chrome, Edge, Firefox, Safari).

**FR-304:** The dashboard must use Tailwind CSS for styling with a clean, professional appearance.

### 4.4 AI Query Interface

**FR-401:** The system must provide a text input field where users can type natural language questions about financial data.

**FR-402:** The system must send user questions to OpenAI API (GPT-4 or GPT-3.5-turbo) with:
- Database schema context (table structures, sample data)
- Instructions to generate valid PostgreSQL SQL
- Safety constraints (read-only queries, no DDL/DML)

**FR-403:** The system must display three outputs for each AI query:
1. **Generated SQL:** Show the SQL query the AI created
2. **Query Results:** Display results in a formatted table (max 100 rows)
3. **Natural Language Answer:** AI's narrative explanation of the results

**FR-404:** The system must handle AI query errors gracefully:
- Invalid SQL: Display error message and allow retry
- No results: Show "No data found" message
- API errors: Show "AI service unavailable" message

**FR-405:** The system must limit query execution time to 10 seconds maximum.

**FR-406:** The system must restrict AI to SELECT queries only (block INSERT, UPDATE, DELETE, DROP, CREATE).

**FR-407:** The system must log all AI queries (question, SQL, success/failure, timestamp) for evaluation.

### 4.5 Backend API

**FR-501:** The system must provide a FastAPI backend with 3 endpoints:
- `GET /health` - Health check (returns status)
- `GET /api/dashboard` - Returns dashboard data (KPIs + monthly trends)
- `POST /api/ask` - Accepts question, returns SQL + results + answer

**FR-502:** The backend must connect to AWS RDS PostgreSQL using connection pooling.

**FR-503:** The backend must return JSON responses with appropriate HTTP status codes.

**FR-504:** The backend must implement CORS to allow requests from Vercel frontend domain.

### 4.6 Deployment

**FR-601:** The frontend must be deployed to Vercel with a public HTTPS URL.

**FR-602:** The backend API must be deployed to Vercel as serverless functions.

**FR-603:** The database must be hosted on AWS RDS PostgreSQL (single instance, no Multi-AZ required).

**FR-604:** All environment variables (database credentials, OpenAI API key) must be stored securely in Vercel environment settings.

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-101:** Dashboard page must load in under 3 seconds on standard broadband connection.

**NFR-102:** AI query responses must return in under 10 seconds (including OpenAI API call time).

**NFR-103:** The system must handle 3 concurrent users without performance degradation.

### 5.2 Reliability

**NFR-201:** The system must be available during business hours (8 AM - 6 PM Eastern) with 95% uptime target for POC period.

**NFR-202:** Database queries must not timeout (max execution time: 30 seconds).

### 5.3 Usability

**NFR-301:** The dashboard must be intuitive enough for first-time users to understand without training.

**NFR-302:** AI query interface must provide example questions to guide users.

**NFR-303:** Error messages must be clear and actionable.

### 5.4 Security (Minimal for POC)

**NFR-401:** Database credentials must not be committed to version control (use environment variables).

**NFR-402:** OpenAI API key must be stored securely in Vercel environment settings.

**NFR-403:** AI queries must be restricted to read-only operations.

*(Note: Production 0001 MVP will add comprehensive security including authentication, encryption, audit logging)*

### 5.5 Data Accuracy

**NFR-501:** Dashboard totals must match Sage GL totals within 0.1% (manual reconciliation for POC).

---

## 6. Success Criteria

The POC is considered successful if:

✅ **Delivered on Time:** Working prototype deployed to public URL within 7-10 days  
✅ **Data Accuracy:** Dashboard revenue/expense totals match Sage reports (manual verification)  
✅ **AI Performance:** 7 out of 10 test questions generate correct SQL and accurate answers (≥70% accuracy)  
✅ **Stakeholder Approval:** CFO and finance team can access dashboard and test AI queries  
✅ **Technical Validation:** Proves React + FastAPI + RDS + OpenAI stack is viable  
✅ **Foundation Established:** Codebase is structured to evolve into 0001 MVP  

---

## 7. Out of Scope (Deferred to 0001 MVP)

### Features NOT Included in POC

❌ **Authentication/Authorization** - No login, no user roles, no access control  
❌ **Multiple Dashboards** - Only one dashboard (Financial Overview)  
❌ **Drill-down Capabilities** - No click-through to detailed views  
❌ **Data Export** - No CSV/Excel export functionality  
❌ **Advanced Filters** - No date range pickers, region filters, or dynamic filtering  
❌ **Automated ETL** - No Prefect, no Airbyte, no scheduled data loads  
❌ **Data Transformations** - No dbt, no semantic layer, no dimensional modeling  
❌ **Multi-year Data** - Only 3 months (not 3 years)  
❌ **Additional Data Sources** - Sage GL only (no time tracking, equipment, Aspire)  
❌ **Advanced AI Features** - No proactive insights, no anomaly detection, no forecasting  
❌ **Vector Embeddings** - No pgvector, no semantic search  
❌ **Audit Logging** - Basic query logging only, no comprehensive audit trail  
❌ **Production Infrastructure** - No ECS Fargate, no Multi-AZ RDS, no CloudWatch  
❌ **PDF Reports** - No report generation  
❌ **Real-time Updates** - No WebSocket, no live data refresh  
❌ **Mobile Optimization** - Desktop-only for POC  
❌ **Comprehensive Testing** - Manual testing only, no automated test suite  

---

## 8. Constraints

### Timeline Constraints

- **Hard Deadline:** Must complete in 7-10 days maximum
- **No Scope Creep:** Resist adding features beyond core POC requirements
- **Time-boxed:** If a feature takes >1 day, defer to 0001

### Budget Constraints

- **Infrastructure Cost:** Target ~$50/month for POC (RDS + Vercel free tier)
- **Development Cost:** Solo developer or small team only

### Technical Constraints

- **Data Volume:** Limited to 3 months to ensure fast loading and queries
- **Concurrent Users:** Designed for 3-5 users max (CFO + finance analysts)
- **Browser Support:** Latest versions of Chrome, Edge, Firefox, Safari only

### Data Constraints

- **Sage GL Only:** No other data sources in POC
- **Manual Data Load:** CSV export from Sage, one-time load
- **No Historical Changes:** Data is static snapshot, not updated during POC period

---

## 9. Assumptions

1. Superscapes can export 3 months of GL transactions from Sage in CSV format
2. OpenAI API access is available (paid account recommended for GPT-4)
3. AWS account exists with permissions to create RDS instances
4. Vercel account exists for deployment
5. Stakeholders have modern web browsers and internet access
6. Finance team can manually verify dashboard totals against Sage reports
7. Budget approval exists for ~$50/month infrastructure costs
8. POC timeline starts immediately upon approval

---

## 10. Dependencies

### External Dependencies

- **Sage System Access:** Ability to export GL transaction data
- **OpenAI API:** Active API key with sufficient credits
- **AWS Account:** Access to create RDS PostgreSQL instances
- **Vercel Account:** Deployment platform access

### Internal Dependencies

- **Finance Team Availability:** Need ~2 hours for data export and validation
- **Stakeholder Availability:** Need ~1 hour for demo/feedback session at end of POC

---

## 11. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Sage data export issues | High | Medium | Work with finance team early, validate CSV format day 1 |
| AI SQL accuracy <70% | High | Medium | Start with simple schema, provide clear context to OpenAI |
| RDS setup delays | Medium | Low | Use Terraform or documented manual setup process |
| Vercel deployment issues | Medium | Low | Test deployment with minimal app on day 1 |
| Scope creep delays delivery | High | High | Strictly enforce "defer to 0001" rule for any new features |
| OpenAI API costs exceed budget | Low | Low | Monitor API usage, use GPT-3.5-turbo for testing |

---

## 12. Migration Path to 0001 MVP

This POC is **not throwaway code**. It serves as the foundation for 0001:

### Code Evolution

- **Database Schema:** 3 simple tables → full star schema with dimensions and facts
- **Backend API:** 3 endpoints → comprehensive API with 20+ endpoints
- **Frontend:** Single dashboard → 8+ specialized dashboards
- **AI Layer:** Direct OpenAI calls → semantic layer with vector embeddings
- **Data Load:** Manual CSV → automated Prefect + Airbyte ETL
- **Deployment:** Vercel serverless → AWS ECS Fargate + production RDS

### Architecture Continuity

- React + TypeScript + Tailwind foundation carries forward
- FastAPI patterns extend to production API
- RDS PostgreSQL continues (upgraded to Multi-AZ)
- OpenAI integration refines into production AI analyst

---

## 13. Appendix: Example AI Test Questions

The POC will be tested with these 10 questions to validate ≥70% accuracy:

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

Success = 7+ correct SQL queries and accurate answers.

---

## 14. Next Steps

Upon PRD approval:

1. ✅ Create 0000-srs-superscapes-poc.md (System Requirements Specification)
2. ✅ Create 0000-tech-stack.md (Technology Stack Documentation)
3. ✅ Create 0000-tasks-superscapes-poc.md (Task Breakdown)
4. ✅ Begin development following 7-10 day timeline
5. ✅ Schedule stakeholder demo for day 10

---

**Document Prepared By:** AI Assistant  
**Reviewed By:** [Pending]  
**Approved By:** [Pending]  
**Approval Date:** [Pending]
