# Tech Stack Document
## Reading List Tracker

**Project:** Reading List Tracker  
**Version:** 1.0  
**Date:** 2025-11-03  
**Status:** Approved

---

## Overview

This document outlines the complete technology stack for the Reading List Tracker application, including rationale for each choice and how they work together.

---

## Architecture Pattern

**Full-Stack Web Application**

```
┌─────────────────────────────────────┐
│         Frontend (Client)           │
│    React + TypeScript + Vite        │
│         Tailwind CSS                │
└──────────────┬──────────────────────┘
               │
               │ HTTP/REST API
               │
┌──────────────▼──────────────────────┐
│         Backend (Server)            │
│   Node.js + Express + TypeScript    │
└──────────────┬──────────────────────┘
               │
               │ SQL Queries
               │
┌──────────────▼──────────────────────┐
│          Database                   │
│         PostgreSQL                  │
└─────────────────────────────────────┘
```

**Pattern:** Monolithic full-stack with separate client/server  
**Communication:** RESTful API  
**Data Flow:** Client → API → Database → API → Client

---

## Frontend Stack

### Core Framework: React 18

**Why React:**
- Component-based architecture fits the card/list/detail UI pattern perfectly
- Strong ecosystem and community support
- Excellent TypeScript integration
- Familiar to most developers (good for handoff/collaboration)
- Hooks provide clean state management without complex libraries

**Alternatives Considered:**
- Vue: Good option, but React has slightly better TypeScript support
- Svelte: Tempting for performance, but smaller ecosystem
- Vanilla JS: Too much boilerplate for a multi-view application

**Decision:** React strikes the best balance of productivity, performance, and ecosystem.

### Language: TypeScript 5

**Why TypeScript:**
- Catch bugs at compile time, not runtime
- Excellent IDE support and autocomplete
- Type safety for API responses prevents common errors
- Self-documenting code through type definitions
- Scales well as project grows

**Alternative:**
- JavaScript: Simpler to start, but error-prone for data-heavy apps

**Decision:** TypeScript's safety nets are worth the small learning curve.

### Build Tool: Vite

**Why Vite:**
- Lightning-fast dev server with HMR (Hot Module Replacement)
- Optimized production builds
- Excellent TypeScript support out of the box
- Modern, actively maintained
- Simple configuration

**Alternatives:**
- Create React App: Slower, being deprecated
- Webpack: More powerful but overly complex for this project
- Parcel: Good, but less popular than Vite

**Decision:** Vite provides the best developer experience for React + TypeScript.

### Styling: Tailwind CSS 3

**Why Tailwind:**
- Utility-first approach speeds up development
- No CSS file juggling
- Built-in responsive design utilities
- Consistent spacing and color systems
- Purges unused styles in production (small bundle)
- Easy to create custom components

**Alternatives:**
- CSS Modules: More setup, harder to maintain consistency
- Styled Components: Runtime overhead, less performant
- Plain CSS: Too much boilerplate and naming decisions

**Decision:** Tailwind is the fastest path to a polished, responsive UI.

### Routing: React Router v6

**Why React Router:**
- De facto standard for React routing
- Declarative route configuration
- Excellent TypeScript support
- Handles nested routes and navigation well
- Active maintenance and large community

**Alternative:**
- Next.js: Overkill for a simple SPA, adds unnecessary complexity

**Decision:** React Router is the right tool for client-side routing.

---

## Backend Stack

### Runtime: Node.js 18 LTS

**Why Node.js:**
- JavaScript/TypeScript across full stack (one language)
- Fast, non-blocking I/O perfect for API servers
- Huge ecosystem (npm)
- Excellent hosting support (Vercel, Railway, Heroku)
- Strong PostgreSQL drivers available

**Alternatives:**
- Python + Flask/FastAPI: Good choice, but two languages to maintain
- Go: Fast but overkill for CRUD operations
- Java/Spring: Too heavy for a simple API

**Decision:** Node.js keeps the tech stack unified and simple.

### Framework: Express

**Why Express:**
- Minimal, unopinionated framework
- Massive ecosystem of middleware
- Well-documented and widely used
- Easy to understand and debug
- Perfect for RESTful APIs

**Alternatives:**
- Fastify: Faster, but smaller ecosystem
- Nest.js: Too opinionated and complex for this scale
- Koa: Lightweight but less popular

**Decision:** Express is proven, simple, and has everything we need.

### Language: TypeScript 5

**Why TypeScript:** (same reasons as frontend)
- Type safety for database queries and API responses
- Catches errors before they reach production
- Better refactoring support
- Shared types between frontend and backend possible

**Decision:** TypeScript everywhere for consistency and safety.

### Database Driver: pg (node-postgres)

**Why pg:**
- Most popular PostgreSQL driver for Node.js
- Simple, direct SQL interface
- Excellent performance
- Good TypeScript support
- Connection pooling built-in

**Alternative:**
- Prisma: Nice ORM, but adds abstraction we don't need for simple CRUD
- TypeORM: More complex than needed
- Sequelize: Older, falling out of favor

**Decision:** Direct SQL with `pg` keeps things simple and performant.

---

## Database

### PostgreSQL 14+

**Why PostgreSQL:**
- Robust, battle-tested relational database
- Perfect for structured data (books, notes)
- ACID compliance ensures data integrity
- Excellent support for foreign keys and constraints
- Free and open-source
- Great managed hosting options (Railway, Supabase, etc.)
- Strong JSON support if we need it later

**Alternatives:**
- MySQL: Good, but PostgreSQL has better standards compliance
- SQLite: Too simple, not suitable for hosted apps
- MongoDB: NoSQL overkill for structured relational data
- Firebase: Vendor lock-in, limited query capabilities

**Decision:** PostgreSQL is the gold standard for relational data.

---

## Development Tools

### Version Control: Git + GitHub

**Why Git/GitHub:**
- Industry standard for version control
- GitHub provides free private repositories
- Excellent integration with deployment platforms
- Built-in issue tracking and project management

### Package Manager: npm

**Why npm:**
- Comes with Node.js (no extra install)
- Largest package registry
- Simple, well-understood

**Alternatives:**
- yarn: Faster, but npm v7+ closed the gap
- pnpm: Efficient but less common

**Decision:** npm is default, simple, and sufficient.

### Code Quality: ESLint + Prettier

**Why ESLint + Prettier:**
- Catch common mistakes and enforce consistency
- Auto-formatting saves time and prevents style debates
- Integrates with TypeScript
- Standard in React ecosystem

### Testing (Future): Vitest + React Testing Library

**For V1:** Manual testing is sufficient  
**For V2:** Vitest (fast, Vite-native) + React Testing Library (best practices)

---

## Deployment Stack

### Frontend Hosting: Vercel

**Why Vercel:**
- Built specifically for frontend frameworks
- Zero-config deployment for Vite/React
- Free tier is generous
- Automatic HTTPS
- Edge network for fast global delivery
- Excellent developer experience

**Alternatives:**
- Netlify: Similar to Vercel, slightly less popular
- GitHub Pages: Static only, harder to configure
- AWS S3 + CloudFront: More complex setup

**Decision:** Vercel provides the best experience for React apps.

### Backend Hosting: Railway

**Why Railway:**
- Simple deployment from Git
- Integrated PostgreSQL database
- Free tier includes everything we need
- Environment variable management
- Automatic HTTPS
- Good developer experience

**Alternatives:**
- Heroku: Used to be great, now expensive and slow
- Render: Good alternative to Railway
- AWS/GCP: Overkill and complex for simple apps
- DigitalOcean: Requires more manual setup

**Decision:** Railway offers simplicity and includes database hosting.

### Database Hosting: Railway PostgreSQL

**Why Railway DB:**
- Included with backend hosting (one platform)
- Managed PostgreSQL (automated backups)
- Free tier sufficient for MVP
- Easy connection from backend

**Alternative:**
- Supabase: Great option, especially if we add auth later
- AWS RDS: Too expensive for MVP
- Self-hosted: Too much operational overhead

**Decision:** Railway's integrated database simplifies deployment.

---

## Development Environment

### Recommended Setup

**Code Editor:** Visual Studio Code
- Excellent TypeScript support
- React dev tools integration
- ESLint/Prettier extensions
- Git integration

**Database Client:** pgAdmin or TablePlus
- Visual database management
- Query editor
- Schema visualization

**API Testing:** Postman or Thunder Client (VS Code extension)
- Test API endpoints during development
- Save request collections

---

## Technology Decision Matrix

| Category | Technology | Complexity | Learning Curve | Cost | Performance | Rationale |
|----------|-----------|------------|----------------|------|-------------|-----------|
| Frontend Framework | React | Medium | Medium | Free | High | Best ecosystem, familiar |
| Frontend Language | TypeScript | Medium | Medium | Free | High | Type safety worth it |
| Build Tool | Vite | Low | Low | Free | Very High | Fast, modern |
| Styling | Tailwind | Low | Low | Free | High | Fast development |
| Backend Runtime | Node.js | Low | Low | Free | High | Unified language |
| Backend Framework | Express | Low | Low | Free | High | Simple, proven |
| Database | PostgreSQL | Medium | Medium | Free* | High | Robust, relational |
| Frontend Host | Vercel | Very Low | Very Low | Free* | Very High | Purpose-built |
| Backend Host | Railway | Low | Low | Free* | High | Integrated, simple |

*Free for MVP scale, paid tiers available

---

## Dependency List

### Backend Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.0",
    "@types/pg": "^8.10.2",
    "@types/cors": "^2.8.13",
    "typescript": "^5.1.6",
    "ts-node-dev": "^2.0.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0"
  }
}
```

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.1.6",
    "vite": "^4.4.5"
  }
}
```

---

## Security Considerations

### Current Implementation
- Input validation on backend (prevent SQL injection)
- CORS configuration (restrict allowed origins)
- HTTPS in production (automatic with Vercel/Railway)
- Environment variables for sensitive data (database credentials)
- Parameterized SQL queries (no string concatenation)

### Future Enhancements (V2+)
- User authentication (JWT or session-based)
- Rate limiting on API endpoints
- Content Security Policy headers
- Input sanitization library

---

## Performance Optimization

### Frontend
- Code splitting via React.lazy() (if needed)
- Tailwind purges unused CSS automatically
- Vite bundles and minifies for production
- Images served via CDN (if we add them later)

### Backend
- Connection pooling with `pg`
- Database indexes on frequently queried columns
- Efficient SQL queries (avoid N+1 problems)
- Caching headers for static assets

### Database
- Indexes on `books.status`, `books.created_at`, `notes.book_id`
- Foreign key constraints for referential integrity
- Proper column types (VARCHAR(255) vs TEXT)

---

## Scalability Plan

### Current Capacity
- Frontend: Can handle millions of users (CDN-based)
- Backend: ~100 concurrent users on free tier
- Database: ~10,000 books per user without issues

### When to Scale
If usage grows significantly:

1. **Backend:** Upgrade Railway tier or move to containerized deployment
2. **Database:** Add read replicas if reads become bottleneck
3. **Caching:** Add Redis for frequently accessed data
4. **CDN:** Already handled by Vercel

**For this MVP:** Current architecture handles 100x expected load.

---

## Maintenance & Updates

### Update Strategy
- **Dependencies:** Update quarterly for security patches
- **Node.js:** Stay on LTS versions (currently 18.x)
- **React:** Upgrade to new versions within 6 months of release
- **PostgreSQL:** Managed by Railway, automatically updated

### Monitoring (Future)
- Error tracking: Sentry or similar
- Performance monitoring: Vercel Analytics
- Database monitoring: Railway dashboard

---

## Documentation & Learning Resources

### For Developers

**Official Docs:**
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)

**Explainers in This Repo:**
- `agentic/tasks/explainers/react-18.md`
- `agentic/tasks/explainers/typescript-5.md`
- `agentic/tasks/explainers/tailwind-css-3.md`
- `agentic/tasks/explainers/postgresql.md`
- `agentic/tasks/explainers/vercel.md`

---

## Summary

### The Stack in One Sentence
A TypeScript-powered full-stack app with React frontend, Express backend, and PostgreSQL database, deployed to Vercel and Railway.

### Why This Stack Works
- **Unified Language:** TypeScript everywhere reduces context switching
- **Proven Technologies:** Every piece is battle-tested and widely used
- **Developer Experience:** Fast builds, hot reload, good errors
- **Production Ready:** Scales easily, deploys simply, costs nothing to start
- **Future Proof:** Easy to add auth, testing, features without rewriting

### What We're NOT Using (and Why)
- ❌ **GraphQL:** REST is simpler for CRUD operations
- ❌ **Redux:** React hooks + context are sufficient
- ❌ **ORM:** Direct SQL is clearer for simple queries
- ❌ **Docker:** Not needed with Platform-as-a-Service hosting
- ❌ **Microservices:** Overkill for this scale
- ❌ **Server-Side Rendering:** No SEO needs, SPA is fine

---

## Approval & Sign-off

| Aspect | Status | Date | Notes |
|--------|--------|------|-------|
| Frontend Stack | ✅ Approved | 2025-11-03 | React + TypeScript + Vite + Tailwind |
| Backend Stack | ✅ Approved | 2025-11-03 | Node + Express + TypeScript |
| Database | ✅ Approved | 2025-11-03 | PostgreSQL |
| Deployment | ✅ Approved | 2025-11-03 | Vercel + Railway |

**Next Step:** Begin implementation using task list (Step 5)

---

**Document History:**
- v1.0 (2025-11-03): Initial tech stack defined via Step 4 process
