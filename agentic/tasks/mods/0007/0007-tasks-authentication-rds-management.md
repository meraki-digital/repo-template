# Task List: Authentication & RDS Cost Management

**Module:** 0007
**Based on PRD:** `0007-prd-authentication-rds-management.md`
**Date:** November 1, 2025
**Status:** High-Level Tasks Generated

---

## Relevant Files

### Backend - Authentication Library (`/poc/backend/lib/auth/`)
- `lib/auth/__init__.py` - Package exports for authentication module
- `lib/auth/models.py` - Pydantic models for auth requests/responses
- `lib/auth/jwt_handler.py` - JWT token creation, validation, auto-extension
- `lib/auth/password.py` - Password hashing (bcrypt) and validation
- `lib/auth/dynamo_repository.py` - DynamoDB CRUD operations for users
- `lib/auth/middleware.py` - FastAPI dependencies for authentication
- `lib/auth/router.py` - Authentication API routes (login, invite, etc.)
- `lib/auth/exceptions.py` - Custom authentication exceptions

### Backend - RDS Management (`/poc/backend/lib/rds/`)
- `lib/rds/__init__.py` - Package exports for RDS module
- `lib/rds/models.py` - Pydantic models for RDS operations
- `lib/rds/rds_client.py` - AWS RDS API client wrapper
- `lib/rds/activity_tracker.py` - Middleware for tracking DB activity
- `lib/rds/router.py` - RDS control API routes (start, stop, status)

### Backend - AWS Lambda Functions (`/poc/backend/lambda/`)
- `lambda/auto_stop_checker.py` - EventBridge scheduled auto-stop logic
- `lambda/rds_start.py` - Lambda function to start RDS instance
- `lambda/rds_stop.py` - Lambda function to stop RDS instance
- `lambda/rds_status.py` - Lambda function to query RDS status

### Backend - Scripts
- `scripts/seed_admin_user.py` - Create initial admin user in DynamoDB
- `scripts/create_dynamodb_tables.py` - Set up DynamoDB tables with proper indexes

### Backend - Database Migrations
- `migrations/versions/XXXX_add_rds_management_columns.py` - Alembic migration for system_variables

### Backend - Main Application Updates
- `main.py` - Include auth and RDS routers, add activity tracking middleware
- `database.py` - Update to handle DB connection errors gracefully

### Frontend - Authentication (`/poc/frontend/src/`)
- `contexts/AuthContext.tsx` - Auth state management (user, login, logout, token refresh)
- `components/Login.tsx` - Login form component
- `components/AcceptInvite.tsx` - Invitation acceptance page
- `components/ProtectedRoute.tsx` - Route wrapper requiring authentication
- `api/authClient.ts` - Axios client with auth interceptors

### Frontend - RDS Management
- `components/RestartModal.tsx` - Database restart modal with progress
- `components/RDSStatusIndicator.tsx` - Header indicator for RDS status
- `hooks/useKeepalive.ts` - Custom hook for keepalive pings

### Frontend - Admin Panel
- `pages/AdminAuthPage.tsx` - User management interface
- `pages/AdminRDSPage.tsx` - RDS controls and cost tracking
- `components/admin/UserTable.tsx` - List users with actions
- `components/admin/InviteForm.tsx` - Create user invitation
- `components/admin/CostDashboard.tsx` - Cost tracking charts

### Frontend - Routing Updates
- `App.tsx` - Add protected routes, auth provider, public routes (login, invite)

### AWS Infrastructure (Manual Setup)
- DynamoDB tables: `auth-users`, `failed-login-attempts`, `restart-locks`, `rds-audit-log`
- Lambda functions: `auto-stop-checker`, `rds-start`, `rds-stop`, `rds-status`
- EventBridge rule: Trigger auto-stop-checker every 1 minute
- CloudWatch alarms: Failed logins, restart time, Lambda errors, auto-stop failures

### Configuration
- `.env` updates - JWT secret, DynamoDB table names, RDS instance ID
- `requirements.txt` - Add python-jose, bcrypt, boto3 dependencies
- `package.json` - No new frontend dependencies needed (using existing libraries)

### Testing
- `lib/auth/tests/test_jwt_handler.py` - JWT creation/validation tests
- `lib/auth/tests/test_password.py` - Password hashing tests
- `lib/auth/tests/test_router.py` - Auth API integration tests
- `lib/rds/tests/test_rds_client.py` - RDS operations tests
- `lambda/tests/test_auto_stop_checker.py` - Auto-stop logic tests

### Notes

- **Branch Strategy:** All work for Module 0007 lives in `feature/mod-0007-authentication-rds` branch (already created)
- **Deployment Order:** Backend → Lambda functions → DynamoDB tables → Frontend
- **Testing Approach:** Unit tests for auth library, integration tests for API, E2E for full flows
- **Security:** Never commit JWT secret keys or admin passwords to git

---

## Tasks

### 0.0 Setup Development Branch
**Purpose:** Ensure all work for Module 0007 is isolated in a feature branch.

**Status:** ✅ COMPLETE

**What was done:**
- Committed outstanding changes to `poc-dev` (checkpoint v08, task list, SRS updates)
- Created new branch: `feature/mod-0007-authentication-rds`
- Currently on feature branch, ready for implementation

---

### 1.0 Build Authentication Library (`lib/auth/`)
**Purpose:** Create reusable, framework-agnostic authentication functions.

**Estimated Time:** 1-2 days (AI generates boilerplate, you review and test)

**Deliverables:**
- JWT token generation and validation
- Password hashing and verification
- DynamoDB user operations (CRUD)
- Token auto-extension logic (3-day threshold)
- Device fingerprinting
- Rate limiting helpers
- Token version management

**Sub-tasks:**
- [ ] 1.1 Create `/backend/lib/auth/__init__.py` with package exports
- [ ] 1.2 Create `/backend/lib/auth/jwt.py` with `generate_token()`, `validate_token()`, `should_extend_token()`
- [ ] 1.3 Create `/backend/lib/auth/password.py` with `hash_password()`, `verify_password()` using bcrypt
- [ ] 1.4 Create `/backend/lib/auth/dynamodb.py` with DynamoDB client setup and table constants
- [ ] 1.5 Create `/backend/lib/auth/users.py` with `create_user()`, `get_user_by_email()`, `update_user()`, `increment_token_version()`
- [ ] 1.6 Create `/backend/lib/auth/device.py` with `generate_device_fingerprint()` (user-agent + IP hash)
- [ ] 1.7 Create `/backend/lib/auth/rate_limit.py` with `check_failed_attempts()`, `record_failed_login()`, `clear_failed_attempts()`
- [ ] 1.8 Create `/backend/lib/auth/config.py` with JWT_SECRET, TOKEN_EXPIRY_DAYS (7), MAX_TOKEN_AGE_DAYS (30), BCRYPT_ROUNDS (12)
- [ ] 1.9 Add python-jose[cryptography], bcrypt, boto3 to `requirements.txt`
- [ ] 1.10 Write unit tests for JWT generation/validation with various expiry scenarios
- [ ] 1.11 Write unit tests for password hashing (verify same password, verify different password)
- [ ] 1.12 Write unit tests for token auto-extension logic (< 3 days = extend, > 3 days = don't extend)

---

### 2.0 Build Authentication API Routes
**Purpose:** FastAPI endpoints for login, logout, registration (invite-only), token refresh.

**Estimated Time:** 0.5-1 day (AI scaffolds endpoints, you integrate and test)

**Deliverables:**
- POST /api/auth/login (with rate limiting)
- POST /api/auth/logout
- POST /api/auth/refresh (auto-extend token)
- POST /api/auth/invite/create (admin only)
- POST /api/auth/invite/register (use invite code)
- GET /api/auth/me (current user info)
- POST /api/auth/password/change (invalidates all tokens)

**Sub-tasks:**
- [ ] 2.1 Create `/backend/api_routes/auth.py` with APIRouter setup
- [ ] 2.2 Implement POST /api/auth/login: validate email/password, check rate limiting, generate JWT, return user + token
- [ ] 2.3 Implement POST /api/auth/logout: invalidate current token (client-side only, no server-side revocation yet)
- [ ] 2.4 Implement POST /api/auth/refresh: validate current token, check if should extend, generate new token if needed
- [ ] 2.5 Implement POST /api/auth/invite/create: admin only, generate random invite code, store in DynamoDB with 48-hour expiry
- [ ] 2.6 Implement POST /api/auth/invite/register: validate invite code, create user, expire invite, return token
- [ ] 2.7 Implement GET /api/auth/me: validate JWT, return current user info (email, role, created_at)
- [ ] 2.8 Implement POST /api/auth/password/change: validate old password, hash new password, increment token_version
- [ ] 2.9 Create `/backend/api_routes/dependencies.py` with `get_current_user()` dependency (JWT validation)
- [ ] 2.10 Create `/backend/api_routes/dependencies.py` with `require_admin()` dependency
- [ ] 2.11 Add Pydantic schemas in `/backend/schemas/auth.py` (LoginRequest, LoginResponse, InviteRequest, etc.)
- [ ] 2.12 Register auth router in `/backend/main.py`
- [ ] 2.13 Test login endpoint with valid credentials
- [ ] 2.14 Test login endpoint with invalid credentials (rate limiting after 5 attempts)
- [ ] 2.15 Test invite flow: create invite → register with invite → login

---

### 3.0 Build RDS Management Backend
**Purpose:** API routes for RDS status, start, stop, auto-stop configuration.

**Estimated Time:** 2-3 days (AWS setup, Lambda deployment, testing)

**Deliverables:**
- GET /api/rds/status (current state, uptime, cost)
- POST /api/rds/start (with concurrency lock)
- POST /api/rds/stop
- GET /api/rds/config (inactivity timeout, keepalive interval)
- PUT /api/rds/config (admin only)
- GET /api/rds/audit (cost history, uptime logs)
- Keepalive heartbeat endpoint (POST /api/rds/keepalive)

**Sub-tasks:**
- [ ] 3.1 Create `/backend/lib/rds/__init__.py` with package exports
- [ ] 3.2 Create `/backend/lib/rds/client.py` with boto3 RDS client setup
- [ ] 3.3 Create `/backend/lib/rds/status.py` with `get_rds_status()` (query AWS RDS API)
- [ ] 3.4 Create `/backend/lib/rds/control.py` with `start_rds()`, `stop_rds()` functions
- [ ] 3.5 Create `/backend/lib/rds/lock.py` with `acquire_restart_lock()`, `release_restart_lock()` using DynamoDB
- [ ] 3.6 Create `/backend/lib/rds/audit.py` with `log_rds_event()` to DynamoDB (start/stop/cost)
- [ ] 3.7 Create `/backend/lib/rds/config.py` with `get_config()`, `update_config()` for system_variables table
- [ ] 3.8 Create `/backend/api_routes/rds.py` with APIRouter setup
- [ ] 3.9 Implement GET /api/rds/status: return RDS state, uptime since start, estimated cost today
- [ ] 3.10 Implement POST /api/rds/start: check lock, acquire lock, call Lambda, release lock, log audit
- [ ] 3.11 Implement POST /api/rds/stop: call Lambda, log audit
- [ ] 3.12 Implement GET /api/rds/config: return inactivity_timeout_minutes, keepalive_interval_minutes, max_uptime_hours
- [ ] 3.13 Implement PUT /api/rds/config: validate inputs, update system_variables (admin only)
- [ ] 3.14 Implement GET /api/rds/audit: query DynamoDB rds-audit-log, return last 30 days
- [ ] 3.15 Implement POST /api/rds/keepalive: update last_activity_at in system_variables, check 4-hour max
- [ ] 3.16 Add Pydantic schemas in `/backend/schemas/rds.py` (RDSStatus, RDSConfig, RDSAuditLog)
- [ ] 3.17 Register rds router in `/backend/main.py`
- [ ] 3.18 Create IAM policy for backend to invoke Lambda functions (rds-start, rds-stop)

---

### 4.0 Build Frontend Authentication UI
**Purpose:** Login page, registration (invite), logout, token refresh, protected routes.

**Estimated Time:** 1-2 days (AI generates components, you style and wire up)

**Deliverables:**
- Login page with email/password form
- Registration page with invite code
- AuthContext for global auth state
- Protected route wrapper component
- Token auto-refresh logic (every 6 hours or on 401)
- Logout functionality
- "Account locked" error handling

**Sub-tasks:**
- [ ] 4.1 Create `/frontend/src/contexts/AuthContext.tsx` with user state, login(), logout(), refreshToken()
- [ ] 4.2 Create `/frontend/src/api/auth.ts` with axios calls to /api/auth/* endpoints
- [ ] 4.3 Create `/frontend/src/pages/Login.tsx` with email/password form, error handling, "Account locked" message
- [ ] 4.4 Create `/frontend/src/pages/Register.tsx` with invite code + email/password form
- [ ] 4.5 Create `/frontend/src/components/ProtectedRoute.tsx` that checks AuthContext, redirects to /login if not authenticated
- [ ] 4.6 Add token auto-refresh logic in AuthContext: check localStorage token on mount, refresh if < 3 days remaining
- [ ] 4.7 Add axios interceptor to attach JWT to all requests (Authorization: Bearer <token>)
- [ ] 4.8 Add axios interceptor to handle 401 responses (trigger logout or refresh)
- [ ] 4.9 Store JWT in localStorage (key: "auth_token")
- [ ] 4.10 Update `/frontend/src/App.tsx` to wrap app in AuthProvider
- [ ] 4.11 Update `/frontend/src/App.tsx` routes: /login, /register, /dashboard (protected)
- [ ] 4.12 Create `/frontend/src/components/Header.tsx` with logout button (only shows when authenticated)
- [ ] 4.13 Style login page with Tailwind CSS (centered card, nice form)
- [ ] 4.14 Test login flow: enter credentials → redirect to /dashboard
- [ ] 4.15 Test logout flow: click logout → redirect to /login, localStorage cleared
- [ ] 4.16 Test rate limiting: 5 failed logins → show "Account locked for 1 hour" message

---

### 5.0 Build Frontend RDS Management UI
**Purpose:** Dashboard showing RDS status, start/stop buttons, cost tracking, restart modal.

**Estimated Time:** 1 day (straightforward React components)

**Deliverables:**
- RDS status widget (current state, uptime, cost today)
- Start/Stop buttons with confirmation
- Restart modal (blocking, with Cancel button, shows countdown)
- Auto-refresh status every 10 seconds
- Keepalive ping every 5 minutes (when RDS running)
- 4-hour max uptime warning

**Sub-tasks:**
- [ ] 5.1 Create `/frontend/src/api/rds.ts` with axios calls to /api/rds/* endpoints
- [ ] 5.2 Create `/frontend/src/contexts/RDSContext.tsx` with RDS status state, polling logic
- [ ] 5.3 Create `/frontend/src/components/RDSStatus.tsx` widget showing state (running/stopped/starting), uptime, cost today
- [ ] 5.4 Create `/frontend/src/components/RDSControls.tsx` with Start/Stop buttons, confirmation dialog
- [ ] 5.5 Create `/frontend/src/components/RDSRestartModal.tsx` blocking modal with countdown timer, Cancel button
- [ ] 5.6 Add auto-refresh logic in RDSContext: poll GET /api/rds/status every 10 seconds
- [ ] 5.7 Add keepalive logic in RDSContext: if RDS running, POST /api/rds/keepalive every 5 minutes
- [ ] 5.8 Add 4-hour max uptime warning: if uptime > 3.5 hours, show yellow warning banner
- [ ] 5.9 Handle restart modal trigger: when RDS starting, show modal until status = "available"
- [ ] 5.10 Handle Cancel button in restart modal: POST /api/rds/stop, close modal
- [ ] 5.11 Add RDS status widget to main dashboard page
- [ ] 5.12 Style RDS components with Tailwind CSS (status badge, buttons, modal)
- [ ] 5.13 Test start flow: click Start → modal appears → RDS starts → modal closes
- [ ] 5.14 Test stop flow: click Stop → confirm → RDS stops
- [ ] 5.15 Test cancel restart: click Start → modal appears → click Cancel → RDS stops, modal closes

---

### 6.0 Build Admin Panel
**Purpose:** User management, invite management, RDS configuration, cost reports.

**Estimated Time:** 2-3 days (most complex UI, multiple tables/forms/charts)

**Deliverables:**
- User list table (email, role, created_at, locked status)
- Invite management (create invite, view pending invites, expire invites)
- RDS config form (inactivity timeout, keepalive interval, max uptime)
- Cost history chart (last 30 days)
- Audit log table (RDS start/stop events, user logins)

**Sub-tasks:**
- [ ] 6.1 Create `/frontend/src/pages/Admin.tsx` with tabbed interface (Users, Invites, RDS Config, Reports)
- [ ] 6.2 Create `/frontend/src/api/admin.ts` with axios calls to admin endpoints
- [ ] 6.3 Create `/frontend/src/components/admin/UserList.tsx` table with email, role, created_at, locked status
- [ ] 6.4 Add "Unlock User" button to UserList (calls POST /api/auth/unlock/:email, admin only)
- [ ] 6.5 Create `/frontend/src/components/admin/InviteManager.tsx` with "Create Invite" button, pending invites table
- [ ] 6.6 Create invite creation form: email (pre-fill), role (dropdown), expires_at (48 hours default)
- [ ] 6.7 Show invite link with copy button, expiration countdown
- [ ] 6.8 Add "Expire Invite" button to pending invites table
- [ ] 6.9 Create `/frontend/src/components/admin/RDSConfigForm.tsx` with inputs for inactivity_timeout_minutes, max_uptime_hours
- [ ] 6.10 Add form validation: inactivity_timeout_minutes (15-180), max_uptime_hours (1-8)
- [ ] 6.11 Wire up PUT /api/rds/config on form submit
- [ ] 6.12 Create `/frontend/src/components/admin/CostChart.tsx` using Recharts, show last 30 days
- [ ] 6.13 Create `/frontend/src/components/admin/AuditLog.tsx` table with timestamp, event, user, details
- [ ] 6.14 Add filters to AuditLog: date range, event type (start/stop/login)
- [ ] 6.15 Protect /admin route with ProtectedRoute + require_admin check
- [ ] 6.16 Style admin panel with Tailwind CSS (clean tables, forms, charts)
- [ ] 6.17 Test invite creation: create invite → copy link → register with invite → verify user created
- [ ] 6.18 Test RDS config update: change inactivity timeout → verify system_variables updated
- [ ] 6.19 Test cost chart: verify chart shows daily costs, tooltips work

---

### 7.0 Deploy AWS Infrastructure
**Purpose:** Create DynamoDB tables, Lambda functions, EventBridge rules, IAM roles.

**Estimated Time:** 2-3 days (AWS Console work, IAM permissions, deployment scripts)

**Deliverables:**
- DynamoDB tables: auth-users, failed-login-attempts, restart-locks, rds-audit-log
- Lambda functions: auto-stop-checker, rds-start, rds-stop, rds-status
- EventBridge rule (1-minute interval → auto-stop-checker)
- IAM roles with minimal permissions
- CloudWatch alarms for auto-stop failures

**Sub-tasks:**
- [ ] 7.1 Create DynamoDB table: auth-users (email as partition key, indexes for role, created_at)
- [ ] 7.2 Create DynamoDB table: failed-login-attempts (email as partition key, TTL on locked_until)
- [ ] 7.3 Create DynamoDB table: restart-locks (lock_id as partition key, TTL on expires_at)
- [ ] 7.4 Create DynamoDB table: rds-audit-log (event_id as partition key, GSI on timestamp)
- [ ] 7.5 Create `/poc/lambda/auto-stop-checker/handler.py` with logic to check inactivity, call rds-stop
- [ ] 7.6 Create `/poc/lambda/rds-start/handler.py` with boto3 RDS start_db_instance call
- [ ] 7.7 Create `/poc/lambda/rds-stop/handler.py` with boto3 RDS stop_db_instance call
- [ ] 7.8 Create `/poc/lambda/rds-status/handler.py` with boto3 RDS describe_db_instances call
- [ ] 7.9 Create IAM role for Lambda functions with permissions: RDS (start/stop/describe), DynamoDB (read/write), CloudWatch Logs
- [ ] 7.10 Package Lambda functions with dependencies (boto3 bundled by default)
- [ ] 7.11 Deploy Lambda functions to AWS (use AWS Console or `aws lambda create-function`)
- [ ] 7.12 Create EventBridge rule: cron(0/1 * * * ? *) → invoke auto-stop-checker Lambda
- [ ] 7.13 Test EventBridge rule: verify Lambda invoked every 1 minute, check CloudWatch Logs
- [ ] 7.14 Create CloudWatch alarm: if auto-stop-checker errors > 3 in 5 minutes, send SNS notification
- [ ] 7.15 Create IAM policy for Vercel backend to invoke Lambda functions (rds-start, rds-stop, rds-status)
- [ ] 7.16 Store AWS credentials in Vercel environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION)
- [ ] 7.17 Test Lambda rds-start: invoke manually, verify RDS starts
- [ ] 7.18 Test Lambda rds-stop: invoke manually, verify RDS stops
- [ ] 7.19 Test auto-stop-checker: set inactivity timeout to 1 minute, wait 2 minutes, verify RDS stops

---

### 8.0 Database Migrations & Seed Data
**Purpose:** Alembic migration for system_variables, seed script for admin user.

**Estimated Time:** 0.5 day (AI generates migration, quick manual testing)

**Deliverables:**
- Alembic migration for system_variables columns
- Seed script for admin user creation (random password)
- Initial invitation for steven@superscapes.com
- Database schema validation

**Sub-tasks:**
- [ ] 8.1 Create Alembic migration: add columns to system_variables (inactivity_timeout_minutes, last_activity_at, keepalive_interval_minutes, max_uptime_hours, rds_started_at, auto_stop_enabled)
- [ ] 8.2 Set default values: inactivity_timeout_minutes=60, keepalive_interval_minutes=5, max_uptime_hours=4, auto_stop_enabled=true
- [ ] 8.3 Create `/poc/database/seeds/01_admin_user.py` seed script
- [ ] 8.4 Generate random admin password (secrets.token_urlsafe(16)), print to console on seed run
- [ ] 8.5 Create admin user in DynamoDB auth-users table (email=greg@meraki-digital.com, role=admin, hashed password)
- [ ] 8.6 Create initial invite for steven@superscapes.com (expires in 48 hours, role=user)
- [ ] 8.7 Run Alembic migration against local PostgreSQL: `alembic upgrade head`
- [ ] 8.8 Verify system_variables columns created with `SELECT * FROM system_variables`
- [ ] 8.9 Run seed script: `python poc/database/seeds/01_admin_user.py`
- [ ] 8.10 Save admin password from console output to secure location (1Password, etc.)
- [ ] 8.11 Test login with admin credentials

---

### 9.0 Integration Testing & Security Review
**Purpose:** Validate full authentication and RDS flows, security audit.

**Estimated Time:** 1-2 days (AI generates test cases, you verify security)

**Deliverables:**
- Unit tests for auth library (JWT, password, DynamoDB)
- Integration tests for API routes
- E2E tests for login → protected route → logout
- E2E tests for restart flow
- Security testing (rate limiting, token theft, device fingerprinting)
- Performance testing (JWT validation <50ms, restart <90s)

**Sub-tasks:**
- [ ] 9.1 Write unit tests for lib/auth/jwt.py (generate, validate, should_extend)
- [ ] 9.2 Write unit tests for lib/auth/password.py (hash, verify)
- [ ] 9.3 Write unit tests for lib/auth/rate_limit.py (5 failed attempts → lock, clear after 1 hour)
- [ ] 9.4 Write integration tests for POST /api/auth/login (success, invalid password, rate limited)
- [ ] 9.5 Write integration tests for POST /api/auth/refresh (extend token, don't extend if > 3 days)
- [ ] 9.6 Write integration tests for POST /api/auth/invite/create + register flow
- [ ] 9.7 Write integration tests for POST /api/auth/password/change (token version increments)
- [ ] 9.8 Write integration tests for GET /api/rds/status (authenticated vs unauthenticated)
- [ ] 9.9 Write integration tests for POST /api/rds/start (concurrency lock prevents double-start)
- [ ] 9.10 Write E2E test: login → navigate to /dashboard → logout → redirect to /login
- [ ] 9.11 Write E2E test: start RDS → modal appears → RDS starts → modal closes
- [ ] 9.12 Write E2E test: start RDS → click Cancel → RDS stops → modal closes
- [ ] 9.13 Security test: attempt to use expired token (> 30 days) → 401 Unauthorized
- [ ] 9.14 Security test: attempt to use token after password change → 401 Unauthorized (token_version mismatch)
- [ ] 9.15 Security test: attempt to reuse invite code → 400 Bad Request
- [ ] 9.16 Performance test: measure JWT validation latency (target <50ms)
- [ ] 9.17 Performance test: measure RDS restart time (target <90s from button click to "available")
- [ ] 9.18 Run all tests with pytest: `pytest poc/backend/tests/ -v`

---

### 10.0 Deployment & Documentation
**Purpose:** Deploy to production, create operational documentation.

**Estimated Time:** 1 day (automated deployment, AI-generated docs)

**Deliverables:**
- Deploy backend with auth library to Vercel
- Deploy Lambda functions to AWS
- Deploy frontend with authentication
- Run seed script to create admin user
- Update README with authentication instructions
- Document admin user setup process
- Create operational runbook (password reset, user unlocking, etc.)

**Sub-tasks:**
- [ ] 10.1 Set Vercel environment variables: JWT_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, DATABASE_URL
- [ ] 10.2 Deploy backend to Vercel: `vercel --prod` from /poc/backend
- [ ] 10.3 Verify backend deployment: test GET /api/health endpoint
- [ ] 10.4 Deploy Lambda functions to AWS production account (same steps as Task 7)
- [ ] 10.5 Deploy frontend to Vercel: `vercel --prod` from /poc/frontend
- [ ] 10.6 Verify frontend deployment: test login page loads, no console errors
- [ ] 10.7 Run seed script against production DynamoDB (careful: only run once!)
- [ ] 10.8 Save admin password securely, share with team via 1Password
- [ ] 10.9 Create initial invite for steven@superscapes.com, send link via email
- [ ] 10.10 Update `/poc/README.md` with "Authentication" section (how to login, create users, manage invites)
- [ ] 10.11 Create `/poc/docs/admin-operations.md` runbook with procedures:
  - Password reset (manual DynamoDB update + token_version increment)
  - Unlock user account (delete failed-login-attempts record)
  - Create new invite (via admin panel)
  - Adjust RDS auto-stop timeout (via admin panel)
  - Troubleshoot auto-stop failures (check CloudWatch Logs)
- [ ] 10.12 Create `/poc/docs/security-checklist.md` with items:
  - JWT_SECRET rotated quarterly
  - Admin password rotated monthly
  - Failed login attempts monitored
  - Cost variance alerts configured
  - Rate limiting tested
- [ ] 10.13 Test production login: greg@meraki-digital.com → verify dashboard loads
- [ ] 10.14 Test production invite flow: steven@superscapes.com → register → login → verify user role
- [ ] 10.15 Test production RDS control: start RDS → verify starts, auto-stops after inactivity

---

**Total Estimated Time:** 12-18 days (~2.5-3.5 weeks with agentic coding)

**Realistic Timeline with AI Pair Programming:** Most tasks completed in days/hours rather than weeks. Complex AWS setup and testing remain the time sinks.

**Critical Path:** Task 1 → Task 2 → Task 4 → Task 8 → Task 10

**Critical Path:** Task 1 → Task 2 → Task 4 → Task 8 → Task 10

**Next Step:** I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed.
