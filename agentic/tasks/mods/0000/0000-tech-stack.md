# Technology Stack
## Superscapes Financial Intelligence Dashboard - POC

**Project Code:** 0000
**Last Updated:** October 26, 2025

---

## Programming Languages

- **Python 3.11+** [📚](../../../agentic/tasks/explainers/python-311.md) - Backend API, data loading scripts
- **TypeScript 5.0+** [📚](../../../agentic/tasks/explainers/typescript-5.md) - Frontend application
- **SQL** - Database queries, schema definition
- **JavaScript** - Build tooling
- **Bash/Shell** - Deployment scripts, data loading utilities

---

## Frontend Stack

### Core Framework & Build Tools
- **React 18.2+** [📚](../../../agentic/tasks/explainers/react-18.md) - UI framework
- **TypeScript 5.0+** [📚](../../../agentic/tasks/explainers/typescript-5.md) - Type safety and developer experience
- **Vite** [📚](../../../agentic/tasks/explainers/vite.md) - Build tool and dev server (faster than Create React App)
- **Node.js 18+** - Runtime for build tools

### UI/Styling
- **Tailwind CSS 3.3+** [📚](../../../agentic/tasks/explainers/tailwind-css-3.md) - Utility-first CSS framework
- **CSS3** - Custom styling where needed

### Data Visualization
- **Recharts 2.5+** [📚](../../../agentic/tasks/explainers/recharts-25.md) - React charting library for bar charts
- Alternative: **Chart.js** - Simple charting library (if Recharts is too heavy)

### State Management & Data Fetching
- **React Hooks** [📚](../../../agentic/tasks/explainers/react-hooks.md) - Component state management (useState, useEffect)
- **Axios** [📚](../../../agentic/tasks/explainers/axios.md) - HTTP client for API calls

### Code Quality (Optional for POC)
- **ESLint** [📚](../../../agentic/tasks/explainers/eslint.md) - JavaScript/TypeScript linting
- **Prettier** [📚](../../../agentic/tasks/explainers/prettier.md) - Code formatting
- **TypeScript Compiler (tsc)** [📚](../../../agentic/tasks/explainers/typescript-compiler.md) - Type checking

---

## Backend Stack

### Core Framework
- **FastAPI 0.100+** [📚](../../../agentic/tasks/explainers/fastapi.md) - Modern Python web framework for API endpoints
- **Uvicorn** [📚](../../../agentic/tasks/explainers/uvicorn.md) - ASGI server for running FastAPI locally
- **Python 3.11+** - Runtime

### Database & ORM
- **SQLAlchemy 2.0+** [📚](../../../agentic/tasks/explainers/sqlalchemy.md) - SQL toolkit and ORM (minimal usage for POC)
- **psycopg2-binary** or **asyncpg** - PostgreSQL database driver

### Data Validation
- **Pydantic v2** [📚](../../../agentic/tasks/explainers/pydantic-v2.md) - Request/response validation and serialization (FastAPI dependency)

### API & Middleware
- **fastapi-cors-middleware** - CORS handling (built into FastAPI)
- **Starlette** - ASGI framework (FastAPI dependency)

### Data Loading
- **Python csv module** - CSV parsing for initial data load (pandas removed due to Vercel serverless size constraints)
- **csv module (built-in)** - CSV file reading

---

## Data Stack

### Database
- **PostgreSQL 14.9+** or **15+** - Relational database hosted on AWS RDS
- No pgvector (deferred to 0001 MVP)
- No pg_cron (deferred to 0001 MVP)

### Data Loading (Manual for POC)
- **Python scripts** - Custom CSV import scripts
- **Python standard library** - Data manipulation and validation (dicts, lists, csv module)
- No Prefect, no Airbyte, no dbt for POC

---

## AI & Machine Learning Stack

### LLM & AI Services
- **OpenAI GPT-4 API** or **GPT-3.5-turbo** [📚](../../../agentic/tasks/explainers/openai-gpt-4-api.md) - Natural language to SQL generation
- **OpenAI Python SDK** - Official OpenAI client library

### AI Utilities
- **sqlparse** - SQL parsing and validation (Python library)
- No langchain (keep it simple for POC)
- No tiktoken (not needed for POC usage levels)

---

## Infrastructure & DevOps

### Cloud Platform
- **AWS (Amazon Web Services)** - Database hosting only
- **Vercel** [📚](../../../agentic/tasks/explainers/vercel.md) - Frontend and backend API hosting

### Database Hosting
- **AWS RDS for PostgreSQL** - Managed PostgreSQL database
- Instance type: **db.t3.micro** or **db.t4g.micro** (free tier eligible)
- Storage: 20GB GP2
- Single instance (no Multi-AZ for POC)
- Public accessibility: Enabled (secured via security group)

### Hosting & Deployment
- **Vercel** - Frontend hosting + serverless API functions (SELECTED)
- **Vercel CLI** - Deployment tool
- Free tier sufficient for POC

### Networking & Security
- **AWS Security Groups** - Database firewall rules (allow developer IP + Vercel IPs)
- **Vercel Environment Variables** - Secure credential storage
- **HTTPS** - TLS encryption (provided by Vercel)

### Monitoring & Logging (Minimal)
- **Vercel Logs** - Application logs and function execution logs
- **Console logging** - Python logging module, console.log for frontend
- No CloudWatch, no Grafana for POC

---

## Development Tools

### Package Management
- **npm** or **pnpm** - Node.js package manager (frontend)
- **pip** - Python package manager
- **venv** - Python virtual environments

### API Development & Testing
- **Postman** or **Bruno** - API testing
- **FastAPI Swagger UI** - Auto-generated API documentation (http://localhost:8000/docs)

### Database Tools
- **psql** - PostgreSQL command-line client
- **pgAdmin** or **DBeaver** - Database GUI tools (optional)
- **TablePlus** - Database GUI (Mac/Windows) (optional)

### Code Editors & IDEs
- **VS Code** (recommended) - Code editor
- **PyCharm** (optional) - Python IDE
- **Cursor** (optional) - AI-powered code editor

---

## Testing & Quality Assurance (Minimal for POC)

### Manual Testing
- **Manual QA** - Developer testing of all features
- **Browser DevTools** - Frontend debugging

### API Testing
- **Postman/Bruno** [📚](../../../agentic/tasks/explainers/api-testing-collections.md) - Manual API endpoint testing
- **FastAPI /docs** - Interactive API testing

### No Automated Testing for POC
- No pytest for backend
- No Vitest for frontend
- No Playwright for E2E
- *(All deferred to 0001 MVP)*

---

## Data Sources & Integration

### Primary Data Source
- **Sage GL** - General Ledger transaction data (CSV export)

### Integration Method
- **Manual CSV Export** - Finance team exports from Sage
- **Python Script** - Custom data loading script
- No ODBC, no APIs for POC

---

## Communication Protocols

- **HTTPS/TLS 1.2+** - Secure web traffic (Vercel provides automatically)
- **PostgreSQL Wire Protocol** - Database connections
- **REST over HTTPS** - API communication

---

## Data Formats

- **JSON** - API request/response format
- **CSV** - Sage GL data export format
- **SQL** - Database queries and schema

---

## Browser & Device Support

### Web Browsers (Latest Versions Only)
- **Google Chrome**
- **Microsoft Edge**
- **Mozilla Firefox**
- **Apple Safari**

### Device Types
- **Desktop** (primary) - 1024px and wider
- **Tablet** - Basic responsive support
- **Mobile** - Minimal support

---

## Standards & Specifications

### Web Standards
- **HTML5** - Markup
- **CSS3** - Styling
- **ECMAScript 2020+** - JavaScript language features
- **HTTP/2** - Protocol

### API Standards
- **REST** - API architectural style
- **OpenAPI 3.0** - API specification (auto-generated by FastAPI)

---

## POC Technology Stack Summary

### What's Included (POC)

✅ **Frontend:** React + TypeScript + Tailwind + Vite  
✅ **Backend:** FastAPI + Python 3.11  
✅ **Database:** AWS RDS PostgreSQL (single instance)  
✅ **AI:** OpenAI GPT-4 API  
✅ **Hosting:** Vercel (frontend + API routes)  
✅ **Visualization:** Recharts (bar charts)  
✅ **HTTP Client:** Axios  
✅ **Data Loading:** Python standard library (manual scripts)  

### What's Excluded (Deferred to 0001 MVP)

❌ **No Authentication:** No JWT, no RBAC, no user management  
❌ **No ETL Orchestration:** No Prefect, no Airflow, no Airbyte  
❌ **No Data Transformation:** No dbt, no semantic layer  
❌ **No Advanced UI:** No React Router, no TanStack Query, no Headless UI  
❌ **No Form Libraries:** No React Hook Form, no Zod validation  
❌ **No Vector DB:** No pgvector extension  
❌ **No Production Infrastructure:** No ECS Fargate, no Multi-AZ RDS  
❌ **No CI/CD:** No GitHub Actions, no automated testing  
❌ **No Monitoring:** No CloudWatch, no Grafana, no alerts  
❌ **No Docker:** Not needed for POC (Vercel handles deployment)  

---

## Technology Decisions (POC)

### Why These Choices?

**React + TypeScript + Tailwind:**
- Aligns with 0001 MVP stack (code reusability)
- Fast development with Tailwind utilities
- Type safety catches errors early

**FastAPI:**
- Simple, modern Python framework
- Auto-generated API docs
- Easy to deploy to Vercel serverless functions
- Direct path to 0001 MVP backend

**AWS RDS PostgreSQL:**
- Same database platform as 0001 MVP
- Managed service (no server maintenance)
- Easy to upgrade to Multi-AZ for production
- Free tier eligible (db.t3.micro)

**Vercel:**
- Zero-config deployment
- Free tier supports POC requirements
- HTTPS by default
- Works for both frontend and API routes
- Fast global CDN

**OpenAI GPT-4:**
- Best-in-class SQL generation
- Good for financial domain understanding
- Can downgrade to GPT-3.5-turbo if cost is concern

**Recharts:**
- React-native charting library
- Simple bar charts for POC
- Aligns with 0001 MVP stack

---

## Development Environment Setup

### Prerequisites

- **Node.js 18+** - Install from nodejs.org
- **Python 3.11+** - Install from python.org
- **Git** - Version control
- **AWS Account** - For RDS database
- **Vercel Account** - For deployment
- **OpenAI Account** - For API access

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

**Database:**
- Connect to AWS RDS instance (no local PostgreSQL needed)
- Use connection string from environment variables

---

## Environment Variables

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:8000  # Local dev
# VITE_API_URL=https://your-app.vercel.app  # Production
```

### Backend (.env)

```bash
DATABASE_URL=postgresql://user:pass@your-rds-instance.amazonaws.com:5432/dbname
OPENAI_API_KEY=sk-...
ENVIRONMENT=development  # or production
```

### Vercel Environment Variables

Configure in Vercel dashboard → Project Settings → Environment Variables:
- `DATABASE_URL` (secret)
- `OPENAI_API_KEY` (secret)
- `VITE_API_URL` (plain text)

---

## Dependency Management

### Frontend (package.json)

**Core Dependencies:**
- react: ^18.2.0
- react-dom: ^18.2.0
- typescript: ^5.0.0
- tailwindcss: ^3.3.0
- recharts: ^2.5.0
- axios: ^1.4.0

**Dev Dependencies:**
- vite: ^4.4.0
- @types/react: ^18.2.0
- @types/react-dom: ^18.2.0
- eslint: ^8.45.0
- prettier: ^3.0.0

### Backend (requirements.txt)

```
fastapi==0.100.0
uvicorn[standard]==0.23.0
pydantic==2.0.0
sqlalchemy==2.0.0
psycopg2-binary==2.9.0
# pandas removed - causes 22min Vercel builds (200MB dependency)
openai==1.0.0
python-dotenv==1.0.0
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│           Vercel Platform               │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  React Frontend (Static Site)  │    │
│  │  - Hosted on Vercel CDN        │    │
│  │  - HTTPS: your-app.vercel.app  │    │
│  └────────────┬───────────────────┘    │
│               │                         │
│               ▼                         │
│  ┌────────────────────────────────┐    │
│  │  FastAPI Serverless Functions  │    │
│  │  - /api/health                 │    │
│  │  - /api/dashboard              │    │
│  │  - /api/ask                    │    │
│  └────────────┬───────────────────┘    │
│               │                         │
└───────────────┼─────────────────────────┘
                │
                │ PostgreSQL Connection
                ▼
┌───────────────────────────────────────┐
│         AWS RDS PostgreSQL            │
│  - db.t3.micro instance               │
│  - 20GB storage                       │
│  - Public access (secured)            │
│  - Backup: 7 days retention           │
└───────────────────────────────────────┘
                │
                │ API Call
                ▼
┌───────────────────────────────────────┐
│         OpenAI API                    │
│  - GPT-4 or GPT-3.5-turbo             │
│  - Text-to-SQL generation             │
│  - Narrative answer generation        │
└───────────────────────────────────────┘
```

---

## Cost Estimate (POC)

### Monthly Costs

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| **AWS RDS PostgreSQL** | db.t3.micro, 20GB storage | $15-25/month |
| **Vercel Hosting** | Free tier (hobby) | $0/month |
| **OpenAI API** | ~100-200 queries at GPT-4 rates | $5-15/month |
| **AWS Data Transfer** | Minimal for POC | $1-2/month |

**Total POC Cost:** ~$20-40/month

### Cost Optimization

- Use **db.t4g.micro** (ARM-based) instead of db.t3.micro if available (cheaper)
- Use **GPT-3.5-turbo** instead of GPT-4 for testing (10x cheaper)
- Stop RDS instance when not in use (save ~60% on compute)
- Vercel free tier is sufficient for POC (no upgrade needed)

---

## Migration Path to 0001 MVP

### Technology Continuity

| Component | POC (0000) | MVP (0001) | Migration |
|-----------|------------|------------|-----------|
| **Frontend Framework** | React + TypeScript | Same | ✅ Keep |
| **Styling** | Tailwind CSS | Same | ✅ Keep |
| **Build Tool** | Vite | Same | ✅ Keep |
| **Charting** | Recharts | Same | ✅ Expand |
| **Backend Framework** | FastAPI | Same | ✅ Expand |
| **Database** | RDS PostgreSQL | RDS PostgreSQL (Multi-AZ) | ✅ Upgrade |
| **Frontend Hosting** | Vercel | Vercel | ✅ Keep |
| **Backend Hosting** | Vercel Serverless | AWS ECS Fargate | 🔄 Migrate |
| **AI** | OpenAI Direct | OpenAI + Semantic Layer | ✅ Enhance |
| **Data Loading** | Manual Python | Prefect + Airbyte | 🔄 Replace |

### What Changes in 0001

**Add:**
- JWT authentication + RBAC
- React Router for multiple pages
- TanStack Query for data fetching
- dbt for data transformations
- Prefect for ETL orchestration
- pgvector for semantic search
- AWS ECS Fargate for backend
- CloudWatch monitoring
- Comprehensive testing

**Keep:**
- React + TypeScript foundation
- Tailwind CSS styling
- FastAPI patterns
- PostgreSQL database
- Vercel frontend hosting
- OpenAI integration

---

## Security Considerations (POC)

### What's Secure

✅ **HTTPS:** All traffic encrypted (Vercel provides SSL)  
✅ **Credentials:** Stored in environment variables, not in code  
✅ **SQL Injection Prevention:** Parameterized queries  
✅ **Database Access:** Restricted by security group  
✅ **API Key Protection:** OpenAI key stored securely  

### What's NOT Secure (Acceptable for POC)

⚠️ **No Authentication:** Dashboard is publicly accessible  
⚠️ **Public RDS:** Database has public IP (secured by security group only)  
⚠️ **No Rate Limiting:** API can be called unlimited times  
⚠️ **No Audit Logging:** Minimal logging for POC  
⚠️ **No Encryption at Rest:** RDS encryption not enabled  

**Note:** All security gaps will be addressed in 0001 MVP.

---

## Performance Targets (POC)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Dashboard Load Time** | <3 seconds | Initial page load with data |
| **API Response Time** | <2 seconds | /api/dashboard endpoint |
| **AI Query Time** | <10 seconds | /api/ask endpoint (including OpenAI) |
| **Database Query Time** | <500ms | Simple aggregations |
| **Concurrent Users** | 3-5 | Without performance degradation |

---

## Documentation & Resources

### Internal Documentation

- `README.md` - Setup instructions
- `DEPLOYMENT.md` - Deployment guide (optional)
- `.env.example` - Environment variable template
- API documentation - Auto-generated by FastAPI at `/docs`

### External Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Explainer Links

For detailed explanations of key technologies, see:

- [React 18](../../../agentic/tasks/explainers/react-18.md) - UI framework fundamentals
- [TypeScript 5](../../../agentic/tasks/explainers/typescript-5.md) - Type system and configuration
- [Tailwind CSS 3](../../../agentic/tasks/explainers/tailwind-css-3.md) - Utility-first CSS approach
- [Vite](../../../agentic/tasks/explainers/vite.md) - Build tool and dev server
- [Recharts 2.5](../../../agentic/tasks/explainers/recharts-25.md) - Charting library usage
- [React Hooks](../../../agentic/tasks/explainers/react-hooks.md) - State management patterns
- [Axios](../../../agentic/tasks/explainers/axios.md) - HTTP client configuration
- [Python 3.11](../../../agentic/tasks/explainers/python-311.md) - Language features
- [ESLint](../../../agentic/tasks/explainers/eslint.md) - Linting configuration (optional)
- [Prettier](../../../agentic/tasks/explainers/prettier.md) - Code formatting (optional)

---

**Total Technologies:** ~20 tools, libraries, and services (vs. 100+ for 0001 MVP)

**Core Technology Stack (POC):**
- **Language:** TypeScript (frontend) + Python (backend)
- **Framework:** React (frontend) + FastAPI (backend)
- **Database:** AWS RDS PostgreSQL (single instance)
- **AI:** OpenAI GPT-4
- **Hosting:** Vercel (all-in-one)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS

---

**Document Prepared By:** AI Assistant  
**Last Updated:** October 26, 2025
