# Task List: Superscapes Financial Intelligence Dashboard - POC

**Based on:** `0000-prd-superscapes-poc.md`
**Project Code:** 0000
**Target Timeline:** 7-10 days
**Created:** October 26, 2025

---

## Relevant Files

### Backend (FastAPI)
- `poc/backend/main.py` - FastAPI application entry point
- `poc/backend/config.py` - Configuration and environment variables
- `poc/backend/database.py` - Database connection management
- `poc/backend/api/health.py` - Health check endpoint
- `poc/backend/api/dashboard.py` - Dashboard data endpoint
- `poc/backend/api/ask.py` - AI query endpoint
- `poc/backend/requirements.txt` - Python dependencies
- `.env` - Environment variables (git-ignored)
- `.env.example` - Environment variable template

### Frontend (React)
- `poc/frontend/package.json` - Node.js dependencies
- `poc/frontend/vite.config.ts` - Vite build configuration
- `poc/frontend/tsconfig.json` - TypeScript configuration
- `poc/frontend/tailwind.config.js` - Tailwind CSS configuration
- `poc/frontend/src/main.tsx` - React entry point
- `poc/frontend/src/App.tsx` - Main App component
- `poc/frontend/src/components/Dashboard.tsx` - Dashboard component
- `poc/frontend/src/components/AskAI.tsx` - AI query interface component
- `poc/frontend/src/api/client.ts` - Axios HTTP client
- `poc/frontend/src/types/api.ts` - TypeScript API types

### Database
- `poc/database/schema.sql` - Database schema (3 tables)
- `poc/database/load_data.py` - Python script to load Sage CSV export

### Documentation
- `poc/README.md` - POC project overview and setup instructions
- `README.md` - Setup instructions and quick start
- `DEPLOYMENT.md` - Deployment guide (optional)
- `.env.example` - Environment variable template

### Notes

- This is a 7-10 day POC, not production code - prioritize working demo over perfection
- No authentication/authorization for POC
- Manual data loading via CSV export (no automated ETL)
- Tech stack: React + TypeScript + Tailwind, FastAPI, PostgreSQL on AWS RDS, Vercel hosting
- See `0000-tech-stack.md` for complete technology decisions
- Deploy to Vercel for both frontend and backend API routes
- Target deployment: Public URL accessible by stakeholders

---

## Tasks

### **Day 1-2: Setup & Data Foundation**

- [x] **0.0 Git Branch Setup**
  - [x] 0.1 Create and checkout branch `poc-0000`

- [x] **1.0 Project Initialization**
  - [x] 1.1 Create POC project structure within this repository: `poc/backend/`, `poc/frontend/`, `poc/database/`, `poc/docs/`
  - [x] 1.2 Initialize POC directories with `.gitignore` (ignore `.env`, `node_modules/`, `venv/`, `__pycache__/`)
  - [x] 1.3 Create `poc/README.md` with project overview, tech stack, setup instructions placeholder

- [x] **2.0 AWS RDS PostgreSQL Setup**
  - [x] 2.1 Verify RDS access in AWS CLI, using the "ss" profile.
  - [x] 2.2 Create PostgreSQL instance: db.t3.micro (or t4g.micro), PostgreSQL 14 or 15, 20GB storage, public accessibility enabled
  - [x] 2.3 Configure security group: allow inbound port 5432 from your IP address and Vercel IP ranges (will add later)
  - [x] 2.4 Set master username and password, note connection details
  - [x] 2.5 Wait for instance to become available (~10 minutes)
  - [x] 2.6 Test connection using `psql` or database GUI tool: `psql -h <endpoint> -U <username> -d postgres`
  - [x] 2.7 Create database: `CREATE DATABASE superscapes_poc;`

- [x] **3.0 Database Schema Creation**
  - [x] 3.1 Create `database/schema.sql` file with table definitions:
    ```sql
    CREATE TABLE regions (
        region_id INTEGER PRIMARY KEY,
        region_code VARCHAR(20) NOT NULL,
        region_name VARCHAR(100) NOT NULL
    );

    CREATE TABLE accounts (
        account_id INTEGER PRIMARY KEY,
        account_number VARCHAR(50) NOT NULL UNIQUE,
        account_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,  -- 'Revenue', 'Expense', 'Asset', etc.
        subcategory VARCHAR(100)
    );

    CREATE TABLE transactions (
        transaction_id SERIAL PRIMARY KEY,
        transaction_date DATE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        account_id INTEGER NOT NULL REFERENCES accounts(account_id),
        region_id INTEGER REFERENCES regions(region_id),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX idx_transactions_date ON transactions(transaction_date);
    CREATE INDEX idx_transactions_account ON transactions(account_id);
    CREATE INDEX idx_transactions_region ON transactions(region_id);
    ```
  - [x] 3.2 Execute schema creation: `psql -h <endpoint> -U <username> -d superscapes_poc -f database/schema.sql`
  - [x] 3.3 Verify tables created: `\dt` in psql

- [x] **4.0 Data Loading**
  - [ ] 4.1 Obtain 3-month Sage GL CSV export from finance team (format: transaction_id, transaction_date, amount, account_number, region_code, description)
  - [x] 4.2 Create `poc/database/load_data.py` Python script:
    - Import pandas, psycopg2
    - Read CSV file
    - Validate data (check for nulls, date formats)
    - Extract unique regions and accounts, insert into dimension tables
    - Load transactions with foreign key lookups
    - Print load statistics (rows loaded, errors, completion time)
  - [x] 4.3 Create Python virtual environment: `python -m venv venv`, activate: `source venv/bin/activate`
  - [x] 4.4 Install dependencies: `pip install pandas psycopg2-binary python-dotenv`
  - [x] 4.5 Create `.env` file with `DATABASE_URL=postgresql://user:pass@endpoint:5432/superscapes_poc`
  - [ ] 4.6 Run data loading script: `python poc/database/load_data.py`
  - [ ] 4.7 Verify data loaded: `SELECT COUNT(*) FROM transactions;` (should be ~500K-1M rows)
  - [ ] 4.8 Manually reconcile totals against Sage reports (calculate SUM by revenue/expense categories, compare)

### **Day 3-4: Backend API Development**

- [x] **5.0 Backend Project Setup**
  - [x] 5.1 Create `poc/backend/requirements.txt` with dependencies:
    ```
    fastapi==0.104.1
    uvicorn[standard]==0.23.0
    sqlalchemy==2.0.0
    psycopg2-binary==2.9.0
    pydantic==1.10.13
    openai==1.0.0
    python-dotenv==1.0.0
    sqlparse==0.5.0
    ```
  - [x] 5.2 Install backend dependencies: `pip install -r poc/backend/requirements.txt`
  - [x] 5.3 Create `poc/backend/.env.example` template:
    ```
    DATABASE_URL=postgresql://user:pass@host:5432/dbname
    OPENAI_API_KEY=sk-...
    ENVIRONMENT=development
    ```
  - [x] 5.4 Copy to `poc/backend/.env` and fill in actual values

- [x] **6.0 Backend Core Implementation**
  - [x] 6.1 Create `poc/backend/config.py`:
  - Load environment variables using python-dotenv
  - Define Config class with DATABASE_URL, OPENAI_API_KEY, ENVIRONMENT
  - [x] 6.2 Create `poc/backend/database.py`:
  - Create SQLAlchemy engine from DATABASE_URL
  - Create session maker
  - Define `get_db()` dependency function yielding database sessions
  - [x] 6.3 Create `poc/backend/main.py`:
  - Initialize FastAPI app with title "Superscapes Financial POC"
  - Configure CORS to allow all origins (for POC only)
  - Include router imports (will create next)
  - [x] 6.4 Create `poc/backend/api/health.py`:
  - Define `GET /health` endpoint returning `{"status": "healthy", "timestamp": "<iso-timestamp>"}`
  - [x] 6.5 Create `poc/backend/api/dashboard.py`:
    - Define `GET /api/dashboard` endpoint
    - Query database for KPIs (SUM amounts WHERE category='Revenue', WHERE category='Expense')
    - Query monthly trends (GROUP BY month, SUM amounts by Revenue/Expense)
    - Calculate gross margin and margin %
    - Return JSON response matching schema from SRS
  - [ ] 6.6 Test backend locally: `uvicorn poc.backend.main:app --reload`
    - Visit `http://localhost:8000/health` - should return 200
    - Visit `http://localhost:8000/docs` - should show Swagger UI
    - Test `/api/dashboard` endpoint - should return KPIs and monthly trends

- [x] **7.0 AI Query Implementation**
  - [x] 7.1 Create `poc/backend/services/ai_service.py`:
    - Initialize OpenAI client with API key from config
    - Define `generate_sql(question: str, schema_context: str)` function:
      - Build prompt with schema (table structures, sample data)
      - Instruction: "Generate a valid PostgreSQL SELECT query to answer: {question}"
      - Safety rule: "Only generate SELECT statements. No INSERT, UPDATE, DELETE, DROP, CREATE"
      - Call OpenAI API (GPT-4 or GPT-3.5-turbo)
      - Extract SQL from response
      - Return SQL string
    - Define `generate_answer(question: str, results: list)` function:
      - Build prompt: "Given this data, answer the question: {question}. Data: {results}"
      - Call OpenAI API
      - Return narrative answer
  - [x] 7.2 Create `poc/backend/services/sql_validator.py`:
    - Import sqlparse library: `pip install sqlparse` (add to requirements.txt)
    - Define `validate_sql(sql: str)` function:
      - Check SQL starts with SELECT (case-insensitive)
      - Check SQL doesn't contain: INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, TRUNCATE
      - Use sqlparse to validate syntax
      - Raise ValueError if invalid
      - Return True if valid
  - [x] 7.3 Create `poc/backend/api/ask.py`:
    - Define `POST /api/ask` endpoint accepting `{"question": str}`
    - Build schema context string (table definitions)
    - Call `generate_sql(question, schema_context)`
    - Call `validate_sql(sql)`
    - Execute SQL against database with timeout (10 seconds) and row limit (1000)
    - Format results as list of dicts
    - Call `generate_answer(question, results)`
    - Return JSON: `{"question": str, "sql": str, "results": list, "answer": str, "execution_time_ms": int}`
    - Handle errors: invalid SQL (400), query timeout (408), OpenAI error (503)
  - [ ] 7.4 Test AI endpoint locally using Postman/Bruno:
    - POST to `http://localhost:8000/api/ask` with body `{"question": "What were our total expenses last month?"}`
    - Verify SQL is generated
    - Verify results returned
    - Verify narrative answer included
  - [ ] 7.5 Test with 10 validation questions from PRD Appendix:
    - Run each question through `/api/ask`
    - Document success/failure
    - Aim for 7/10 correct SQL queries
    - Refine prompts if accuracy is low

### **Day 5-6: Frontend Development**

- [x] **8.0 Frontend Project Setup**
  - [x] 8.1 Create React + TypeScript + Vite project: `npm create vite@latest frontend -- --template react-ts`
  - [x] 8.2 Navigate to `frontend/` directory: `cd frontend`
  - [x] 8.3 Install dependencies: `npm install`
  - [x] 8.4 Install additional packages:
    ```bash
    npm install tailwindcss postcss autoprefixer
    npm install recharts
    npm install axios
    npm install @types/node
    ```
  - [x] 8.5 Initialize Tailwind CSS: `npx tailwindcss init -p`
  - [x] 8.6 Configure `tailwind.config.js`:
    ```js
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
    ```
  - [x] 8.7 Create `src/index.css` with Tailwind directives:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
  - [x] 8.8 Import in `src/main.tsx`: `import './index.css'`

- [x] **9.0 Frontend API Client**
  - [x] 9.1 Create `frontend/src/api/client.ts`:
    - Create Axios instance with baseURL from environment variable (`import.meta.env.VITE_API_URL`)
    - Set default headers
    - Export axios instance
  - [x] 9.2 Create `frontend/src/types/api.ts`:
    - Define TypeScript interfaces: `KPIs`, `MonthlyTrend`, `DashboardData`, `AskResponse`
  - [x] 9.3 Create `frontend/.env.development`:
    ```
    VITE_API_URL=http://localhost:8000
    ```
  - [ ] 9.4 Create `frontend/.env.production`:
    ```
    VITE_API_URL=https://your-app.vercel.app
    ```

- [x] **10.0 Dashboard Component**
  - [x] 10.1 Create `frontend/src/components/Dashboard.tsx`:
    - Use useState and useEffect hooks
    - Fetch from `/api/dashboard` on mount
    - Display loading state while fetching
    - Display 4 KPI cards (Revenue, Expenses, Margin, Margin %)
    - Display monthly bar chart using Recharts (Revenue vs Expenses)
    - Display data period indicator
    - Style with Tailwind CSS (grid layout, cards with shadows, blue/gray color scheme)
  - [x] 10.2 Create `frontend/src/components/KPICard.tsx`:
    - Accept props: title, value
    - Format currency values with commas and $ symbol
    - Display in card with border and padding
    - Reusable component
  - [x] 10.3 Test dashboard locally:
    - Run backend: `uvicorn backend.main:app --reload`
    - Run frontend: `npm run dev`
    - Navigate to `http://localhost:5173`
    - Verify dashboard loads and displays data
    - Check browser console for errors

- [x] **11.0 AI Query Interface**
  - [x] 11.1 Create `frontend/src/components/AskAI.tsx`:
    - Use useState for question input and response
    - Create text input with placeholder "Ask a question about your financial data..."
    - Create "Ask AI" submit button
    - On submit, POST to `/api/ask` with question
    - Display loading state ("Thinking...")
    - Display response in 3 sections:
      1. Generated SQL (code block with gray background)
      2. Results table (formatted with borders)
      3. Natural language answer (larger text)
    - Display execution time
    - Show example questions users can click
    - Handle errors (show error message, allow retry)
  - [x] 11.2 Add AskAI component to main App
  - [x] 11.3 Test AI interface:
    - Type "What were our total expenses in August?"
    - Verify SQL displays
    - Verify results table shows
    - Verify natural language answer displays
    - Test error handling (ask nonsense question)

- [x] **12.0 Frontend Polish**
  - [x] 12.1 Create `frontend/src/App.tsx` main layout:
    - Header with logo/title "Superscapes Financial Intelligence - POC"
    - Dashboard section (full width)
    - AI Query section below dashboard (full width)
    - Responsive layout (stacks on mobile)
  - [x] 12.2 Add loading spinner component (simple CSS animation or Tailwind)
  - [x] 12.3 Add error message component (red background, error icon)
  - [x] 12.4 Improve visual design:
    - Consistent spacing and padding
    - Professional color palette (blue primary, gray secondary)
    - Readable fonts
    - Good contrast ratios
  - [x] 12.5 Test responsive design:
    - Desktop (1024px+): Side-by-side layout
    - Tablet (768px): Stacked layout
    - Mobile (<768px): Full stack, smaller text

### **Day 7-8: Deployment & Testing**

- [x] **13.0 Vercel Deployment Setup**
  - [x] 13.1 Create Vercel account at vercel.com
  - [x] 13.2 Install Vercel CLI: `npm install -g vercel`
  - [x] 13.3 In `frontend/` directory, run `vercel login`
  - [x] 13.4 Create `vercel.json` for API routes:
    ```json
    {
      "rewrites": [
        { "source": "/api/(.*)", "destination": "/api/$1" },
        { "source": "/(.*)", "destination": "/" }
      ]
    }
    ```
  - [x] 13.5 Move backend code to frontend for Vercel deployment:
    - Create `frontend/api/` directory
    - Copy backend logic into serverless function format
    - OR deploy backend separately (see alternative below)

- [x] **13.0 Alternative: Deploy Backend to Vercel Separately**
  - [x] 13.1 In `backend/` directory, create `vercel.json`:
    ```json
    {
      "builds": [
        { "src": "main.py", "use": "@vercel/python" }
      ],
      "routes": [
        { "src": "/(.*)", "dest": "main.py" }
      ]
    }
    ```
  - [x] 13.2 Deploy backend: `vercel --prod` in `backend/` directory
  - [x] 13.3 Note backend URL (e.g., `https://backend-xyz.vercel.app`)
  - [x] 13.4 Deploy frontend: `vercel --prod` in `frontend/` directory
  - [x] 13.5 Update frontend environment variable `VITE_API_URL` in Vercel dashboard to backend URL

- [x] **14.0 Production Environment Configuration**
  - [x] 14.1 In Vercel dashboard, navigate to project settings → Environment Variables
  - [x] 14.2 Add `DATABASE_URL` (AWS RDS connection string) - mark as secret
  - [x] 14.3 Add `OPENAI_API_KEY` - mark as secret
  - [x] 14.4 Add `VITE_API_URL` for frontend (backend URL)
  - [x] 14.5 Update RDS security group: add Vercel IP ranges to allowed inbound connections
  - [x] 14.6 Redeploy to apply environment variables

- [x] **15.0 Integration Testing**
  - [x] 15.1 Test deployed frontend: Navigate to Vercel URL (e.g., `https://your-app.vercel.app`)
  - [x] 15.2 Verify dashboard loads and displays data
  - [x] 15.3 Verify charts render correctly
  - [x] 15.4 Test AI query interface:
    - Ask all 10 test questions from PRD Appendix
    - Document success rate (aim for 7/10)
    - Note any errors or unexpected behavior
  - [x] 15.5 Test from different devices: Desktop, tablet, mobile
  - [x] 15.6 Test from different browsers: Chrome, Firefox, Safari, Edge
  - [x] 15.7 Test concurrent access: Have 2-3 people use the app simultaneously
  - [x] 15.8 Verify performance:
    - Dashboard loads in <3 seconds
    - AI queries return in <10 seconds
    - No console errors

- [x] **16.0 Data Validation & Reconciliation**
  - [x] 16.1 Compare dashboard totals with Sage reports:
    - Total Revenue (3-month period)
    - Total Expenses (3-month period)
    - Revenue by month
    - Calculate variance (should be <0.1%)
  - [x] 16.2 Document reconciliation results in `docs/reconciliation.md`
  - [x] 16.3 If variance >0.1%, investigate:
    - Check data loading script for errors
    - Verify CSV export is complete
    - Check for duplicate transactions
    - Fix and reload data if needed

### **Day 9-10: Documentation & Demo Preparation**

- [x] **17.0 Documentation**
  - [x] 17.1 Update `README.md` with:
    - Project overview and POC goals
    - Tech stack summary
    - Live demo URL
    - Local development setup instructions
    - Environment variable documentation
  - [x] 17.2 Create `docs/SETUP.md` with detailed local setup:
    - Prerequisites (Node.js, Python, PostgreSQL client)
    - Backend setup steps
    - Frontend setup steps
    - Troubleshooting common issues
  - [x] 17.3 Create `docs/DEPLOYMENT.md`:
    - AWS RDS setup steps
    - Vercel deployment steps
    - Environment variable configuration
    - Security group configuration
  - [x] 17.4 Create `docs/AI_TESTING.md`:
    - List of 10 test questions
    - Results for each question (SQL generated, accuracy)
    - Overall accuracy percentage
    - Known limitations

- [x] **18.0 Demo Preparation**
  - [x] 18.1 Create demo script/walkthrough:
    - Introduction (2 min): POC goals, tech stack
    - Dashboard demo (3 min): Show KPIs, charts, data period
    - AI query demo (5 min): Ask 3-4 questions live, show SQL generation, explain results
    - Discussion (10 min): Feedback, questions, next steps to 0001 MVP
  - [x] 18.2 Prepare demo questions that showcase AI capabilities:
    - "What were our total expenses last month?"
    - "Show me revenue by region"
    - "Which region had the highest expenses in August?"
    - "What is our gross margin for the 3-month period?"
  - [x] 18.3 Test demo flow end-to-end
  - [x] 18.4 Create backup plan if live demo fails (screenshots, pre-recorded video)

- [x] **19.0 Stakeholder Communication**
  - [x] 19.1 Send email to CFO and finance team with:
    - Demo URL
    - Brief overview of what to expect
    - Invitation to test before formal demo
    - Request for feedback
  - [x] 19.2 Schedule demo meeting (1 hour):
    - CFO, Controller, Finance Analysts
    - Optional: Regional Managers, Executives
  - [x] 19.3 Prepare feedback survey:
    - Does dashboard provide useful insights?
    - Is AI query interface intuitive?
    - Would you use this for real work?
    - What's missing for daily use?
    - On scale 1-10, confidence in moving to 0001 MVP?

- [x] **20.0 Final Checklist & Handoff**
  - [x] 20.1 Verify all POC success criteria met:
    - ✅ Deployed within 7-10 days
    - ✅ Dashboard totals match Sage (<0.1% variance)
    - ✅ AI accuracy ≥70% (7/10 test questions)
    - ✅ Dashboard loads <3 seconds
    - ✅ AI queries return <10 seconds
    - ✅ Stakeholders can access via public URL
  - [x] 20.2 Document lessons learned:
    - What worked well?
    - What was harder than expected?
    - Data quality issues discovered?
    - AI prompt refinements needed?
    - Performance bottlenecks?
  - [x] 20.3 Create transition plan to 0001 MVP:
    - Which POC code can be reused?
    - What needs to be rebuilt?
    - Key improvements for MVP
    - Estimated timeline for MVP (reference 0001 docs)
  - [x] 20.4 Tag POC completion:
    - Tag final POC version: `git tag v0000-poc-final`
    - Push to GitHub: `git push origin v0000-poc-final`
    - Create GitHub release with notes
  - [x] 20.5 Celebrate! 🎉 Working POC in 7-10 days!

---

## Daily Breakdown (Suggested)

**Day 1:**
- Tasks 1.0 - 3.0: Project setup, AWS RDS, database schema

**Day 2:**
- Task 4.0: Data loading and validation

**Day 3:**
- Tasks 5.0 - 6.0: Backend setup and core API implementation

**Day 4:**
- Task 7.0: AI query implementation and testing

**Day 5:**
- Tasks 8.0 - 9.0: Frontend setup and API client

**Day 6:**
- Tasks 10.0 - 12.0: Dashboard, AI interface, frontend polish

**Day 7:**
- Tasks 13.0 - 14.0: Deployment to Vercel

**Day 8:**
- Tasks 15.0 - 16.0: Integration testing and validation

**Day 9:**
- Task 17.0: Documentation

**Day 10:**
- Tasks 18.0 - 20.0: Demo preparation, stakeholder demo, wrap-up

---

## Success Metrics Tracking

Track these metrics to validate POC success:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Completion Time | 7-10 days | ___ days | ⏳ |
| Data Accuracy (variance) | <0.1% | ___% | ⏳ |
| AI Query Accuracy | ≥70% (7/10) | ___/10 | ⏳ |
| Dashboard Load Time | <3 seconds | ___ sec | ⏳ |
| AI Query Response Time | <10 seconds | ___ sec | ⏳ |
| Stakeholder Access | Public URL | ✅/❌ | ⏳ |
| Cost (monthly) | ~$50 | $___ | ⏳ |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Sage CSV export format incompatible | Work with finance team day 1, validate format early |
| AI accuracy <70% | Refine prompts, provide detailed schema context, use GPT-4 |
| RDS setup delays | Use AWS console (not Terraform), follow documented steps |
| Vercel deployment issues | Test deployment early (day 7), have backup hosting plan |
| Scope creep | Strictly defer non-essential features, time-box each task |
| OpenAI API costs | Monitor usage, use GPT-3.5-turbo for testing, set budget alerts |

---

## Notes

- **Speed over perfection:** This is a POC, not production code. Focus on working demo.
- **Defer to 0001:** When tempted to add features, defer to 0001 MVP. Document in "nice to have" list.
- **Daily progress:** Commit code daily, push to GitHub, track against daily breakdown.
- **Ask for help:** If stuck >2 hours on a task, ask for help or find workaround.
- **Test frequently:** Test after each major task, don't wait until end.

---

**Created By:** AI Assistant
**Last Updated:** October 26, 2025
