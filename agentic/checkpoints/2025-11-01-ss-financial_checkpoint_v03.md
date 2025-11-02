# Checkpoint: SS Financial - Module 0007 Authentication Integration
**Date:** 2025-11-01 21:30
**Project:** Superscapes Financial Intelligence Dashboard
**Version:** v03
**Branch:** poc-dev
**Session Focus:** Enhanced Module 0007 seed with authentication requirements and stateless auth architecture

---

## Session Summary

Significantly enhanced Module 0007 seed to include authentication system that works independently of database availability. Designed stateless JWT-based auth using Clerk/Auth0 to enable users to authenticate even when RDS is stopped, with DB-dependent authorization for permissions. This solves the critical challenge of auth requiring DB while DB may be down when users arrive.

---

## What Was Accomplished

### Module 0007: Authentication Integration
- ✅ Updated 0007 seed to include comprehensive authentication requirements
- ✅ Designed stateless authentication flow (JWT tokens, no DB required for login)
- ✅ Separated authentication (identity verification) from authorization (permissions)
- ✅ Added PostgreSQL `core.users` table schema with role-based access
- ✅ Planned graceful degradation: auth works offline, permissions load when DB available
- ✅ Defined role-based admin controls (admin vs user vs viewer)
- ✅ Added JWT-protected Lambda function examples
- ✅ Documented auth provider options (Clerk recommended for POC)
- ✅ Created use cases for DB-down authentication scenarios
- ✅ Added 7 auth-specific open questions for discovery phase

### Analysis & Planning
- ✅ Researched existing codebase: confirmed zero auth implementation currently
- ✅ Identified placeholder `require_admin()` function in backend (always returns True)
- ✅ Verified no auth libraries in dependencies (no JWT, OAuth, or guards)
- ✅ Confirmed CORS allows all origins (needs tightening with auth)
- ✅ Analyzed dependency chain: 0007 blocks 0003-0006 (all need auth)

---

## Key Decisions Made

### 1. Stateless Authentication (DB-Independent)
**Decision:** Use Auth0/Clerk/Cognito for JWT-based authentication that works without database
**Rationale:**
- Users can authenticate even when RDS is stopped
- JWT signature validation is stateless (no DB lookup needed)
- Basic user info (email, name, user_id) embedded in JWT claims
- Prevents chicken-and-egg problem of needing DB for auth when DB is down

### 2. Separation of Authentication vs Authorization
**Decision:** Auth (identity) works offline; Permissions (role checks) require DB
**Rationale:**
- Authentication: "Who are you?" → JWT validates this (DB-independent)
- Authorization: "What can you do?" → Role lookup from `core.users` (DB-dependent)
- If DB down when permissions needed, show restart prompt
- Cache basic role in JWT claims to reduce DB lookups

### 3. Clerk as Recommended Auth Provider
**Decision:** Recommend Clerk for POC implementation (over Auth0 or Cognito)
**Rationale:**
- Drop-in React components (login UI ready in minutes)
- Excellent developer experience with hooks (`useAuth()`, `useUser()`)
- Free tier supports 10k monthly active users (ample for POC)
- Works seamlessly with Vercel deployments
- Simpler setup than Auth0, better DX than Cognito

### 4. Any Authenticated User Can Restart DB
**Decision:** Don't require admin role to trigger RDS restart
**Rationale:**
- If user is authenticated, they have legitimate need to access data
- Prevents frustration of regular users being locked out
- Still requires valid JWT token (prevents anonymous restarts)
- Admin users get additional controls (Keep Alive, Stop Now, cost tracking)

### 5. Module 0007 is Foundation for All Other Mods
**Decision:** Prioritize 0007 before 0003-0006
**Rationale:**
- Mods 0003-0006 are all admin features requiring authentication
- 0007 provides auth + cost savings (two foundational needs)
- No dependencies on other mods
- Immediate value (60-80% AWS cost reduction)

---

## Module 0007 Enhanced Architecture

### Authentication Flow (New)
```
User visits app → Login screen (Clerk/Auth0)
  ↓
User authenticates (email/password or Google SSO)
  ↓
JWT token issued (no DB needed)
  ↓
Token stored in browser localStorage
  ↓
User authenticated, can access basic UI
  ↓
App tries to load permissions/data → DB query needed
  ↓
If DB down: Show restart prompt
If DB up: Load role from core.users table
  ↓
Render UI based on role (admin vs user)
```

### Authorization Check (DB-Dependent)
- Backend middleware validates JWT signature (stateless, fast)
- For admin-only routes, query `core.users.role`
- If DB unavailable, return `DB_UNAVAILABLE` error
- Frontend shows restart prompt
- After DB restart, retry original request

### Database Schema (New)
```sql
CREATE TABLE core.users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider_id VARCHAR(255) UNIQUE NOT NULL,  -- Clerk/Auth0 user ID
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',  -- 'admin', 'user', 'viewer'
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

### RDS Management (Updated)
- All RDS API endpoints now require valid JWT token
- Lambda functions validate JWT before start/stop operations
- Activity logs include user attribution (who triggered start/stop)
- Admin controls require both JWT + `admin` role from database

---

## Files Modified

### Updated
- `tasks/mods/0007/0007-seed.md` - Enhanced with comprehensive auth requirements

### Files Identified for Future Implementation
**Authentication:**
- `poc/frontend/src/api/client.ts` - Add Authorization header, JWT storage
- `poc/backend/api/admin/ai_questions.py` - Replace placeholder `require_admin()`
- `poc/backend/config.py` - Add auth provider config (CLERK_SECRET_KEY, etc.)
- `poc/frontend/src/App.tsx` - Add protected routes
- New: `poc/frontend/src/contexts/AuthContext.tsx` - Auth state management
- New: `poc/frontend/src/components/LoginPage.tsx` - Login UI
- New: `poc/backend/auth.py` - JWT validation utilities

**RDS Management:**
- `poc/frontend/src/pages/AdminPage.tsx` - Add RDS control section
- `poc/backend/database.py` - Add connection retry logic
- New: Lambda functions for RDS start/stop (JWT-protected)
- New: EventBridge rules configuration
- New: `poc/frontend/src/components/RDSRestartModal.tsx`
- New: `poc/backend/api/admin/rds.py` - RDS control endpoints

---

## Open Questions for Discovery (New)

### Authentication-Specific
1. Which auth provider: Clerk (easiest), Auth0 (enterprise), or Cognito (AWS ecosystem)?
2. Support multiple login methods (email/password + Google + GitHub)?
3. How should first user become admin? Manual SQL insert or env variable?
4. Should role be cached in JWT claims or always query fresh?
5. What if user's role changes while logged in? Force re-login or wait for expiry?
6. Should unauthenticated users see landing page or redirect to login immediately?
7. Need audit logging for auth events (login, logout, permission denied)?

### RDS Management (Existing)
8. Inactivity threshold configurable by admin (30 min, 1 hour, 2 hours)?
9. Show warning before auto-stopping ("No activity for 55 min, stopping soon")?
10. Email/Slack notification when RDS auto-stops?
11. "Keep Alive" override for extended work sessions?
12. Scheduled stops (e.g., always stop at midnight) in addition to inactivity-based?
13. Restart modal include cost info ("Restarting will cost ~$0.15/hour")?

---

## Technical Context

### Current State (No Auth)
- Backend has placeholder `require_admin()` that always returns `True`
- CORS middleware allows all origins (`allow_origins=["*"]`)
- No JWT libraries in requirements.txt
- No auth guards or protected routes in frontend
- No user/session models in database schema
- Admin endpoints currently wide open

### Target State (With Auth)
- All API endpoints require valid JWT (except public health check)
- JWT signature validation happens before any operations
- CORS restricted to known frontend origin
- User roles stored in PostgreSQL, checked for admin operations
- Frontend login/logout flow with Auth0/Clerk
- Protected routes redirect to login if unauthenticated
- Audit trail for all auth and RDS management events

---

## Module Dependency Chain

**Foundation:**
- Module 0007: RDS Auto-Stop/Start + Authentication ← **START HERE**

**Dependent on 0007 (require auth):**
- Module 0003: CRUD Admin UI (needs admin role)
- Module 0004: AI Context Management (needs admin role)
- Module 0005: Hybrid AI with Saved SQL (needs admin to save SQL)
- Module 0006: SQL Editor/Requery (needs auth for security)

---

## Success Metrics (Updated)

### Cost Reduction
- 60-80% reduction in RDS costs within first month
- Cold start happens < 5% of sessions

### Reliability
- 99%+ successful auto-starts (no stuck states)
- Users understand cold start delay (clear messaging)

### Authentication (New)
- 100% of users authenticate before accessing data
- Login/JWT validation works when DB is down (0% DB dependency for auth)
- Admin features only accessible to users with `admin` role
- Zero unauthorized access to admin endpoints

---

## Example Use Cases (New)

### Use Case: First-Time User Login (DB Down)
User tries to access app on Saturday when DB has been stopped since Friday:
1. User visits app URL
2. Redirected to Clerk login screen
3. User signs in with Google
4. JWT token issued, user authenticated ✅ (no DB needed)
5. Frontend tries to load permissions → `DB_UNAVAILABLE` error
6. Modal: "Database is paused. Restart it?"
7. User clicks "Yes, Restart Database"
8. 60-second wait with progress indicator
9. Database starts, permissions load (`role='user'`)
10. User sees KPI dashboard

**Key Point:** Authentication worked immediately; only data access required DB restart

### Use Case: Permission Denied (Non-Admin)
Regular user tries to access admin controls:
1. User logs in with JWT (authenticated ✅)
2. Tries to navigate to `/admin/rds`
3. Backend queries database for user's role
4. Role = 'user' (not 'admin')
5. Returns 403 Forbidden
6. Frontend: "Admin access required. Contact your administrator."

---

## Next Actions

1. **Run "Do Step 1 for module 0007"** to perform discovery analysis
   - Validate technical assumptions against existing codebase
   - Answer open questions about auth provider choice
   - Identify integration challenges with current Vercel/FastAPI setup
   - Prioritize must-have vs nice-to-have features

2. **Choose Auth Provider** during discovery
   - Evaluate Clerk vs Auth0 vs Cognito based on:
     - Integration complexity with Vercel + FastAPI
     - Cost for POC usage levels
     - Developer experience and documentation
     - Time to implement

3. **Create PRD (Step 2)** after discovery
   - Define exact scope for v1 authentication
   - Specify user flows for login/logout/permission denied
   - Detail RDS restart flow with auth requirements
   - Set acceptance criteria for security and UX

---

## Notes & Observations

### Seed File Philosophy Discussion
- Agreed that detailed seeds are valuable (capture all thinking upfront)
- Seeds preserve context and prevent knowledge loss
- Discovery step validates/refines seed against codebase reality
- More detail in seed = better oracle/AI analysis during discovery
- Alternative (light seeds) would require rebuilding thinking during discovery

### Auth Provider Research
- Searched Amp website for recommended auth providers (none found)
- Clerk recommended based on:
  - Developer experience (drop-in React components)
  - Free tier (10k MAU)
  - Vercel integration
  - Simpler than Auth0, better DX than Cognito

### Critical Insight: DB Down + Auth Challenge
- Traditional auth often requires DB for user lookup
- Can't use DB-dependent auth when DB might be stopped
- Solution: Stateless JWT for identity, DB only for permissions
- This allows graceful degradation (authenticated but limited access)

---

## Session Metadata

**Duration:** ~90 minutes
**AI Model:** Claude 3.5 Sonnet (primary)
**Tools Used:** Read, edit_file, finder, read_web_page
**Commits:** None (planning phase only)
**Tests Run:** None (no code changes)
**Warnings/Errors:** None

---

**Status:** ✅ Module 0007 seed complete with auth integration. Ready for Step 1 discovery.
