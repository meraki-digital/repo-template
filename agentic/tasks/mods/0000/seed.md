## **`seed.md` — Superscapes Financial Intelligence Dashboard - POC**

### **Project Title**

Superscapes Financial Intelligence Dashboard - Proof of Concept (POC)

### **Client Overview**

**Superscapes** is a national commercial landscaping company with over **$100M in annual revenue**, operating across multiple regions with hundreds of active projects. Financial operations span divisions for maintenance, design-build, and seasonal contracts. Accounting, payroll, and job costing are currently managed in **Sage**.

### **Problem Statement**

Superscapes' finance and operations teams rely heavily on static Sage exports and fragmented Excel workbooks to understand business performance. Before committing to an 18-week MVP (project 0001), Superscapes needs a **rapid proof of concept** to:

* Validate that AI can generate accurate SQL queries from natural language questions
* Demonstrate that Sage data can be extracted and visualized effectively
* Provide stakeholders with a tangible working demo to build confidence in the full MVP investment
* Identify technical challenges and data quality issues early

### **Proposed Solution**

Develop a **minimal working prototype** in **7-10 days** that demonstrates core capabilities. This POC will:

1. Extract **3 months** of Sage GL transaction data
2. Load data into a simple PostgreSQL database (AWS RDS)
3. Provide **one interactive dashboard** showing revenue and expense trends
4. Enable **basic AI queries** using OpenAI API ("What were our total expenses in Q3?")
5. Deploy to a **public URL** that stakeholders can access

### **Core Objectives**

* **Validate technical feasibility** of AI-powered financial queries
* **Demonstrate value** with a working dashboard on real Sage data
* **Identify data quality issues** before full MVP development
* **Build stakeholder confidence** with a tangible deliverable in 7-10 days
* **Establish foundation** that can evolve into the full 0001 MVP

### **Primary Users (POC Phase)**

| Role                      | Goals                                                                   |
| ------------------------- | ----------------------------------------------------------------------- |
| **CFO / Controller**      | View 3-month revenue/expense trends, ask basic AI questions             |
| **Finance Analysts**      | Validate data accuracy against Sage, test AI query responses           |

### **Key Features (POC Scope)**

1. **Single Financial Dashboard**

   * Bar chart showing monthly revenue vs. expenses (3 months)
   * Total revenue, total expenses, gross margin KPIs
   * Date range: most recent complete 3-month period

2. **Basic AI Query Interface**

   * Text input for natural language questions
   * AI generates SQL query using OpenAI API
   * Displays: generated SQL + results + natural language answer
   * Example queries: "What were our total expenses last month?" or "Show me revenue by region"

3. **Data Integration (Manual for POC)**

   * Manual CSV export from Sage (GL transactions)
   * Simple Python script to load into PostgreSQL
   * 3 core tables: `transactions`, `accounts`, `regions`

4. **Deployment**

   * Frontend: React + Tailwind CSS on Vercel
   * Backend: FastAPI on Vercel (serverless functions)
   * Database: AWS RDS PostgreSQL (minimal instance)

### **Technology Stack (Simplified)**

| Layer               | Technology                         | Notes                                          |
| ------------------- | ---------------------------------- | ---------------------------------------------- |
| **Database**        | AWS RDS PostgreSQL                 | Single instance, no Multi-AZ for POC           |
| **Backend**         | FastAPI                            | 3 endpoints: /health, /dashboard-data, /ask-ai |
| **Frontend**        | React + TypeScript + Tailwind CSS  | Single page, minimal components                |
| **Build Tool**      | Vite                               | Fast dev server, aligns with 0001 MVP          |
| **AI**              | OpenAI GPT-4 API                   | Direct API calls, text-to-SQL generation       |
| **Hosting**         | Vercel (frontend + API routes)     | Free tier sufficient for POC                   |
| **Visualization**   | Recharts or Chart.js               | Simple bar/line charts                         |

### **What's NOT in POC (Deferred to 0001 MVP)**

* ❌ No authentication or role-based access
* ❌ No automated ETL (Prefect, Airbyte)
* ❌ No semantic layer or dbt transformations
* ❌ No vector embeddings (pgvector)
* ❌ No multiple dashboards
* ❌ No drill-down capabilities
* ❌ No multi-year historical data (only 3 months)
* ❌ No advanced AI features (proactive insights, forecasting)
* ❌ No export functionality
* ❌ No production-grade infrastructure (ECS Fargate, Multi-AZ RDS)

### **POC Data Scope**

* **Time Period:** 3 most recent complete months (e.g., July-September 2024)
* **Data Volume:** ~500K-1M transaction records (vs. 50M+ for full 3-year history)
* **Tables:** 3 simple tables (transactions, accounts, regions)
* **Metrics:** Revenue, Expenses, Gross Margin only

### **Success Metrics (POC)**

* ✅ Working dashboard deployed to public URL within 7-10 days
* ✅ AI query accuracy ≥ 70% on 10 test questions
* ✅ Dashboard loads in < 3 seconds
* ✅ Stakeholders can access and interact with demo
* ✅ Data matches Sage totals (manual reconciliation)

### **Constraints**

* **Timeline:** Must complete in 7-10 days (not weeks/months)
* **Cost:** Stay within ~$50/month for POC infrastructure
* **Complexity:** Keep codebase minimal to enable rapid iteration
* **Scope Discipline:** Resist feature creep; defer everything non-essential to 0001

### **Migration Path to 0001 MVP**

This POC is **not throwaway code**. It serves as the foundation:

* Database schema evolves into full star schema
* FastAPI endpoints become production API
* React components rebuilt with production standards
* AI prompts refined into semantic layer
* Manual data load replaced with Prefect ETL
* Single dashboard expands to 8+ dashboards
* Vercel serverless migrates to AWS ECS Fargate

### **Next Steps**

1. **Create 0000 documentation:**
   * `0000-prd-superscapes-poc.md` - Product requirements for POC
   * `0000-srs-superscapes-poc.md` - System requirements specification
   * `0000-tech-stack.md` - Detailed technology decisions
   * `0000-tasks-superscapes-poc.md` - Task breakdown (15-20 tasks)

2. **Begin development** following 7-10 day timeline

3. **Demo to stakeholders** and gather feedback

4. **Transition to 0001 MVP** with validated architecture and learnings
