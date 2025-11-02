# Product Requirements Document: Authentication & RDS Cost Management

**Module:** 0007
**Date:** November 1, 2025
**Version:** 1.1
**Status:** Naysayer Review Complete - Ready for Approval

---

## 1. Introduction

### 1.1 Purpose
This Product Requirements Document (PRD) defines the functional and technical requirements for implementing authentication and automated RDS cost management in the Superscapes Financial Intelligence Dashboard. This document serves as the single source of truth for developers, testers, and stakeholders during implementation.

### 1.2 Background
The current POC application runs without authentication, exposing sensitive financial data to anyone with the URL. Additionally, the AWS RDS PostgreSQL database runs 24/7, incurring approximately $15-20/month in costs that could be reduced by 60-80% through intelligent lifecycle management. This module addresses both security and cost concerns simultaneously.

### 1.3 Scope
This PRD covers:
- Custom JWT-based authentication system using DynamoDB
- Invite-only user registration with admin controls
- Automatic RDS stop after configurable inactivity period
- User-initiated RDS restart with progress feedback
- Admin interface for user management and RDS controls
- Full audit trail for cost tracking and user attribution

### 1.4 Intended Audience
This document is written for junior developers who may not be familiar with authentication patterns, AWS RDS management, or serverless architectures. Technical terms are explained, and implementation details are specific and unambiguous.

---

## 2. Goals & Objectives

### 2.1 Primary Goals
1. **Security:** Ensure 100% of application access requires valid authentication
2. **Cost Reduction:** Achieve 60-80% reduction in RDS operational costs within first month
3. **User Experience:** Provide seamless authentication and database restart flows
4. **Reusability:** Build authentication library that can be reused in future projects

### 2.2 Success Metrics
- Zero unauthorized access incidents after deployment
- RDS running time reduced from 720 hours/month to <200 hours/month
- Database restart completion within 90 seconds 95% of the time
- User satisfaction >80% with cold start experience
- Average JWT validation time <50ms

### 2.3 Non-Goals
This module explicitly does NOT include:
- Multi-factor authentication (MFA)
- OAuth/SSO integration (Google, GitHub, etc.)
- Open user registration (invite-only only)
- Automated email delivery for invitations
- Password reset via email
- Predictive usage analytics
- Integration with other AWS cost tools

---

## 3. User Stories & Personas

### 3.1 Personas

**Primary User - Financial Analyst (Sarah)**
- Accesses dashboard 2-3 times per week
- Reviews KPIs, exports reports
- Basic technical knowledge
- Expects immediate access to data

**Admin User - System Administrator (Greg)**
- Manages user access
- Monitors system costs
- Controls RDS lifecycle manually when needed
- Advanced technical knowledge

**Secondary User - Business Stakeholder (Steven)**
- Occasional access for executive reviews
- Views high-level metrics only
- Non-technical
- Expects simple login process

### 3.2 User Stories

**US-001: User Login**
- **As a** financial analyst
- **I want to** log in with my email and password
- **So that** I can securely access the dashboard
- **Acceptance Criteria:**
  - Login form accepts email and password
  - Invalid credentials show clear error message
  - Successful login redirects to dashboard
  - Token stored in browser persists across sessions
  - Token auto-extends if user is active (no re-login for 7+ days of inactivity)

**US-002: User Invitation**
- **As an** admin
- **I want to** invite new users via email address
- **So that** I can control who has access to the system
- **Acceptance Criteria:**
  - Admin can create invitation with email, name, and role
  - System generates unique one-time invitation token
  - Invitation expires after 7 days
  - Admin receives invitation URL to send manually
  - Cannot create duplicate users (email uniqueness enforced)

**US-003: Accept Invitation**
- **As a** new user
- **I want to** set my password using an invitation link
- **So that** I can activate my account and log in
- **Acceptance Criteria:**
  - Invitation link opens password setup form
  - Password validation shows clear requirements (min 8 chars, 1 number)
  - Expired invitation shows helpful error message
  - Successful setup logs user in immediately
  - Invitation token invalidated after use

**US-004: Database Restart**
- **As a** user
- **I want to** restart the database when it's stopped
- **So that** I can access my data without contacting an admin
- **Acceptance Criteria:**
  - Modal appears immediately when database is stopped
  - Modal explains why database is stopped (cost savings)
  - User can click "Start Database" button
  - Progress indicator shows restart status (0-100%)
  - Estimated cost impact displayed ($0.02/hour)
  - Original request retries automatically after restart completes
  - Restart completes within 90 seconds

**US-005: Admin User Management**
- **As an** admin
- **I want to** view, create, and manage all users
- **So that** I can control system access and roles
- **Acceptance Criteria:**
  - List all users with email, role, status, last login
  - Filter users by role or active status
  - Create new invitation from user list
  - Change user role (admin, user, viewer)
  - Deactivate user accounts
  - Cannot deactivate own account

**US-006: Admin RDS Controls**
- **As an** admin
- **I want to** manually start/stop the database
- **So that** I can override automatic behavior when needed
- **Acceptance Criteria:**
  - Display current RDS status (running, stopped, starting, stopping)
  - Show last activity timestamp
  - Manual start/stop buttons
  - Confirm destructive actions (stop)
  - Update status in real-time
  - Log all manual actions with admin attribution

**US-007: Token Auto-Extension**
- **As a** user
- **I want** my session to stay active as long as I'm using the app
- **So that** I don't get logged out while actively working
- **Acceptance Criteria:**
  - Token refreshes automatically when <3 days until expiration
  - Refresh happens silently during normal API calls
  - No user interaction required
  - Inactive users (7+ days no activity) must re-login
  - New token has fresh 7-day expiration

**US-008: Cost Tracking**
- **As an** admin
- **I want to** see detailed usage and cost attribution
- **So that** I can understand who is driving database costs
- **Acceptance Criteria:**
  - Track every RDS start/stop event with timestamp
  - Record user who triggered restart
  - Calculate running hours per day/week/month
  - Show estimated cost savings vs 24/7 operation
  - Export audit trail to CSV

---

## 4. Functional Requirements

### 4.1 Authentication System

**FR-001: User Login**
- Endpoint: `POST /api/auth/login`
- Request: `{ "email": "user@example.com", "password": "password123" }`
- Response: JWT token (7-day expiration), user object (id, email, name, role)
- Error Cases:
  - 401 Unauthorized: Invalid email or password
  - 403 Forbidden: Account is inactive
  - 429 Too Many Requests: Rate limit exceeded
- DynamoDB query uses email GSI for lookup
- Password verification uses bcrypt with salt rounds = 12
- Update `last_login` timestamp on successful login
- Track failed login attempts in DynamoDB (failed_login_attempts table)

**FR-001a: Login Rate Limiting** ⭐ NEW
- Track failed login attempts per email address
- After 5 failed attempts within 1 hour, lock account for 1 hour
- Store lockout in DynamoDB: `{ "email": "user@example.com", "locked_until": "2025-11-01T13:00:00Z" }`
- Return 429 Too Many Requests with: `{ "error": "rate_limit_exceeded", "retry_after": 3600 }`
- Successful login resets failed attempt counter
- Log all failed attempts to CloudWatch for security monitoring
- Admin can manually unlock accounts via admin panel

**FR-002: JWT Validation**
- All protected endpoints require `Authorization: Bearer <token>` header
- Middleware validates JWT signature using python-jose
- Extract user_id, email, role from token claims
- Validation must complete in <50ms
- Return 401 Unauthorized for invalid/expired tokens
- No database query required for validation (stateless)

**FR-003: Token Auto-Extension**
- Check token expiration on every protected endpoint request
- If token expires within 3 days, generate new token
- New token includes same claims (user_id, email, role) with fresh 7-day expiration
- Return new token in `X-New-Token` response header
- Frontend intercepts header and updates localStorage
- Tokens older than 7 days with no activity expire permanently
- **Absolute maximum token lifetime: 30 days from first issuance** ⭐ UPDATED
- Track `first_issued_at` claim in JWT (never changes during auto-extension)
- After 30 days from `first_issued_at`, user must re-login regardless of activity
- Include device fingerprint hash in JWT claims (User-Agent + IP range /24)
- Invalidate token if device fingerprint changes (potential theft)
- On device change, require password re-entry to issue new token

**FR-004: User Invitation Creation**
- Endpoint: `POST /api/auth/invite` (admin only)
- Request: `{ "email": "new@example.com", "full_name": "Name", "role": "user" }`
- Generate UUID for user_id
- Generate secure random invite_token (32 bytes, URL-safe)
- Set invite_expires_at to 7 days from now
- Hash password as null (set during invitation acceptance)
- Store in DynamoDB with is_active = false
- Return invitation URL: `https://app.domain.com/accept-invite?token={invite_token}`
- Response includes: `{ "invite_url": "...", "created_at": "2025-11-01T12:00:00Z", "expires_at": "2025-11-08T12:00:00Z" }` ⭐ UPDATED
- Prevent duplicate emails (return 409 Conflict)
- **Admin UI displays pending invitations with expiration countdown** ⭐ NEW
- **"Copy to Clipboard" button with visual confirmation toast** ⭐ NEW
- **List shows: email, role, created date, expires date, status (pending/accepted)** ⭐ NEW

**FR-005: Invitation Acceptance**
- Endpoint: `POST /api/auth/complete-invite`
- Request: `{ "invite_token": "abc123", "password": "newPassword123" }`
- Validate invite_token exists and not expired
- Validate password meets requirements (min 8 chars, 1 number)
- Hash password with bcrypt
- Update user record: password_hash, is_active = true, invite_token = null
- Log user in immediately (return JWT)
- Return 400 Bad Request for invalid/expired tokens

**FR-006: Password Change**
- Endpoint: `POST /api/auth/change-password` (authenticated users)
- Request: `{ "current_password": "old", "new_password": "new" }`
- Verify current_password matches stored hash
- Validate new_password meets requirements
- Update password_hash and password_changed_at
- **Increment user's token_version in DynamoDB** ⭐ NEW
- Return 401 for incorrect current password

**FR-006a: Token Invalidation on Password Change** ⭐ NEW
- Add `token_version` field to DynamoDB auth-users table (default: 1)
- Include `token_version` claim in all JWTs
- On password change, increment token_version (e.g., 1 → 2)
- During JWT validation, compare token's version with user's current version in DynamoDB
- If versions don't match, return 401 Unauthorized "Session invalidated, please login"
- This invalidates all existing tokens immediately after password change
- User must re-login to get new token with updated version
- **Note:** This adds one DynamoDB read per protected request (trade-off for security)

**FR-007: Get Current User**
- Endpoint: `GET /api/auth/me` (authenticated users)
- Extract user_id from JWT claims
- Query DynamoDB for full user object
- Return user_id, email, full_name, role, last_login
- Do not return password_hash or invite_token

### 4.2 User Management (Admin Only)

**FR-008: List All Users**
- Endpoint: `GET /api/auth/users` (admin only)
- Query parameters: `?is_active=true&role=user` (optional filters)
- Scan DynamoDB auth-users table
- Return array of user objects (exclude password_hash)
- Sort by created_at descending
- Include total count

**FR-009: Update User**
- Endpoint: `PATCH /api/auth/users/{user_id}` (admin only)
- Allowed updates: role, is_active
- Cannot update own is_active (prevent admin lockout)
- Validate role is one of: admin, user, viewer
- Return updated user object
- Return 404 for invalid user_id

**FR-010: Admin Role Enforcement**
- Extract role from JWT claims
- Compare role === 'admin'
- Return 403 Forbidden if not admin
- Apply to all admin endpoints (invite, users PATCH, RDS stop)

### 4.3 RDS Lifecycle Management

**FR-011: Auto-Stop Configuration**
- Store configuration in PostgreSQL system_variables table
- Columns: rds_auto_stop_enabled (boolean, default true)
- Columns: rds_inactivity_minutes (integer, configurable by admin, default 60)
- Columns: rds_max_uptime_hours (integer, configurable by admin, default 4) ⭐ NEW
- Columns: rds_last_query_time (timestamp, updated on every DB query)
- Columns: rds_last_start_time (timestamp, updated when RDS starts) ⭐ NEW
- Admin can change inactivity threshold via settings UI
- Changes take effect immediately

**FR-012: Activity Tracking**
- Middleware intercepts all database queries
- Update system_variables.rds_last_query_time on every query
- Do not track authentication queries (DynamoDB only, not RDS)
- Include timestamp in application logs

**FR-012a: Keepalive Mechanism with Maximum Uptime** ⭐ NEW
- Frontend sends keepalive ping every 5 minutes while user tab is active
- Endpoint: `GET /api/health/keepalive` (authenticated users)
- Updates system_variables.rds_keepalive_until to current_time + 10 minutes
- Auto-stop checks BOTH `rds_last_query_time` AND `rds_keepalive_until`
- **Prevents mid-session auto-stop** (user reading dashboard won't trigger stop)
- **HOWEVER: Absolute maximum uptime per session enforced** ⭐ CRITICAL
- If `(current_time - rds_last_start_time) > rds_max_uptime_hours`, auto-stop triggers regardless of keepalive
- Default 4-hour maximum prevents "user left machine on overnight" scenario
- Keepalive extends inactivity window but not total uptime
- Frontend detects tab visibility changes (Page Visibility API), pauses keepalive when tab hidden

**FR-013: Auto-Stop Trigger**
- EventBridge scheduled rule runs every 1 minute ⭐ UPDATED (was 5 minutes)
- Lambda function checks rds_last_query_time and rds_keepalive_until
- Calculate minutes since last activity: `max(rds_last_query_time, rds_keepalive_until)`
- Calculate hours since last start: `(current_time - rds_last_start_time) / 60`
- **Stop RDS if EITHER condition is true:** ⭐ UPDATED
  - Inactivity: `minutes_inactive > rds_inactivity_minutes` AND no keepalive
  - Maximum uptime: `hours_running > rds_max_uptime_hours`
- If rds_auto_stop_enabled = false, skip auto-stop
- Call AWS RDS API: `rds_client.stop_db_instance(DBInstanceIdentifier='...')`
- Log stop event with reason (inactivity vs max_uptime) to DynamoDB audit table
- Return early if already stopped

**FR-014: Detect Stopped Database**
- Backend catches PostgreSQL connection errors
- Check error type for "could not connect" or timeout
- Query AWS RDS API for instance status
- If status === 'stopped', return special response:
  - HTTP 503 Service Unavailable
  - Body: `{ "error": "database_stopped", "message": "Database is stopped for cost savings" }`
- Frontend detects 503 + error code and shows restart modal

**FR-015: User-Initiated Restart**
- Frontend shows modal immediately when database stopped detected
- Modal content: "Database Stopped for Cost Savings. Start it now? (~$0.02/hour)"
- Primary button: "Start Database"
- **Secondary button: "Cancel" (close modal without starting)** ⭐ NEW
- Endpoint: `POST /api/admin/rds/start` (authenticated users, not just admin)
- Lambda calls AWS RDS API: `rds_client.start_db_instance(DBInstanceIdentifier='...')`
- Return 202 Accepted with restart_id for polling
- Log restart event to DynamoDB audit table with user_id attribution
- **Cancel button behavior:** ⭐ NEW
  - If restart not yet triggered: Close modal, user can retry later
  - If restart in progress: Show confirmation "Restart already started. Database will continue starting. Close anyway?"
  - If user confirms, close modal (restart continues in background)

**FR-015a: Restart Concurrency Lock** ⭐ NEW
- Before starting RDS, attempt distributed lock using DynamoDB
- Create lock record: `{ "lock_id": "rds-restart-lock", "locked_by": user_id, "locked_at": timestamp }`
- Use DynamoDB conditional write: `ConditionExpression: attribute_not_exists(lock_id)`
- Set TTL on lock record: 5 minutes (auto-cleanup if Lambda crashes)
- If lock write fails (lock already exists), return 409 Conflict
- Response: `{ "error": "restart_in_progress", "message": "Another user is already restarting the database" }`
- Frontend shows friendly message: "Database is already starting. Please wait..."
- After successful RDS start, delete lock record
- **Prevents duplicate Lambda invocations and race conditions**

**FR-016: Restart Progress Polling**
- Endpoint: `GET /api/admin/rds/status?restart_id={id}` (authenticated users)
- Lambda queries AWS RDS API for instance status
- Possible states: stopped, starting, available, stopping
- Calculate progress percentage: starting = 50%, available = 100%
- Return: `{ "status": "starting", "progress": 50, "estimated_seconds": 45 }`
- Frontend polls every 3 seconds until status === 'available'
- Target completion: <90 seconds

**FR-017: Automatic Request Retry**
- After restart completes (status === 'available')
- Frontend retries original API request that triggered restart
- Maintain original request context (endpoint, params, body)
- Show success message: "Database restarted successfully"
- Resume normal application flow

**FR-018: Manual Admin Stop**
- Endpoint: `POST /api/admin/rds/stop` (admin only)
- Lambda calls AWS RDS API stop
- Show confirmation dialog: "Stop database? Users will need to restart it."
- Log stop event with admin user_id
- Return 409 Conflict if already stopped

**FR-019: RDS Status Dashboard**
- Endpoint: `GET /api/admin/rds/status` (authenticated users)
- Return current status, last_query_time, uptime_hours_today
- Show in admin panel and as status indicator in header
- Refresh every 30 seconds

### 4.4 Cost Tracking & Audit

**FR-020: Audit Log Storage**
- Create DynamoDB table: `rds-audit-log`
- Primary key: event_id (UUID)
- Sort key: timestamp (ISO-8601)
- Attributes: event_type (start, stop, auto_stop), user_id, user_email, notes
- TTL attribute: expires_at (90 days from event)
- GSI on user_id for per-user activity reports

**FR-021: Cost Calculation**
- Track RDS running hours per day/week/month
- Calculate: (available_hours / total_hours) * 100 = uptime_percentage
- Estimate RDS cost: running_hours * $0.02/hour (t3.micro estimate)
- **Estimate Lambda costs:** ⭐ NEW
  - Auto-stop checks: 43,800/month (1 min interval) × $0.0000002 = $0.01
  - Start/stop operations: ~100/month × $0.0000002 = negligible
  - Total Lambda: ~$0.01/month
- **Estimate DynamoDB costs:** ⭐ NEW
  - Auth queries: ~10,000 reads/month × $0.00025 per 1M = negligible
  - Audit writes: ~200/month = negligible
  - Total DynamoDB: <$0.01/month
- **Estimate EventBridge costs:** ⭐ NEW
  - 43,800 invocations/month × $0.000001 = $0.04/month
- **Calculate net savings: RDS savings MINUS (Lambda + DynamoDB + EventBridge)** ⭐ NEW
- Example: $14.40 RDS savings - $0.06 operational costs = $14.34 net savings
- Display in admin dashboard with breakdown (RDS, Lambda, DynamoDB, EventBridge, Net)

**FR-022: Audit Trail Export**
- Endpoint: `GET /api/admin/audit/export?start_date=2025-11-01&end_date=2025-11-30` (admin only)
- Query DynamoDB audit log by timestamp range
- Include all fields: event_type, user, timestamp, notes
- Return CSV format
- Include cost calculations at bottom (total hours, total cost, savings)

### 4.5 Initial Deployment

**FR-023: Seed Admin User**
- Script: `/poc/backend/scripts/seed_admin_user.py`
- Run once after DynamoDB table creation
- Create admin user: email = `greg@meraki-digital.com`
- **Generate cryptographically random password (16 characters)** ⭐ UPDATED
- Use Python: `import secrets; password = secrets.token_urlsafe(16)`
- Attributes: role = admin, is_active = true, created_by = 'system', token_version = 1
- **Print credentials to console ONCE** ⭐ UPDATED
- Output format:
  ```
  ============================================
  ADMIN USER CREATED
  ============================================
  Email: greg@meraki-digital.com
  Password: {generated_random_password}

  ⚠️  SAVE THIS PASSWORD IMMEDIATELY!
  ⚠️  It will not be shown again.
  ⚠️  Change password after first login.
  ============================================
  ```
- **Security note:** Never hardcode passwords in source code or documentation

**FR-024: Create Initial Users**
- After admin logs in first time
- Admin creates invitation for: `steven@superscapes.com`
- Role: user
- Full name: Steven (Superscapes)
- Admin sends invitation URL manually via email/Slack
- Steven accepts invite and sets password

---

## 5. Non-Functional Requirements

### 5.1 Performance
- JWT validation: <50ms per request
- Database restart: <90 seconds from trigger to available
- Auto-stop check: <5 seconds execution time
- Token auto-extension: <10ms additional latency
- Admin dashboard load: <2 seconds

### 5.2 Security
- All passwords hashed with bcrypt (salt rounds = 12)
- JWT secret key stored in environment variable (never committed)
- JWT algorithm: HS256
- HTTPS required in production
- No sensitive data in JWT claims (user_id, email, role only)
- Admin endpoints require role verification
- Invitation tokens are cryptographically secure random (32 bytes)
- Expired invitations cannot be reused

### 5.3 Scalability
- DynamoDB auto-scales for user storage
- Support up to 100 concurrent authenticated users
- Lambda functions auto-scale for RDS operations
- Audit log handles 10,000+ events/month

### 5.4 Reliability
- Authentication system: 99.9% uptime (DynamoDB SLA)
- RDS operations success rate: >95%
- Graceful degradation when RDS unavailable
- Retry logic for AWS API failures (3 attempts with exponential backoff)

### 5.5 Maintainability
- Authentication library in `/poc/backend/lib/auth/` for reusability
- Clear separation: auth logic, RDS logic, audit logic
- Comprehensive error messages for debugging
- Environment variable configuration (no hardcoded values)

### 5.6 Usability
- Login form: <3 clicks to access dashboard
- Password requirements clearly displayed
- Error messages: user-friendly, actionable
- Restart modal: non-technical language
- Admin panel: intuitive navigation

---

## 6. Design Considerations

### 6.1 Architecture Decisions

**Why Custom JWT Instead of Clerk/Auth0?**
- Avoid vendor lock-in and monthly subscription costs
- Full control over authentication logic
- Reusable library for future projects
- Lightweight implementation (~300 lines of code)
- No external service dependencies

**Why DynamoDB for User Storage?**
- Always-available (works when RDS is stopped)
- Serverless (no management overhead)
- Low cost (<$1/month for 100 users)
- Fast email lookups via GSI

**Why Token Auto-Extension Instead of Refresh Tokens?**
- Simpler implementation (no refresh token storage)
- Better UX (no visible session expiration for active users)
- Still stateless (no server-side session)
- Security maintained (7-day hard limit for inactive users)

**Why User-Initiated Restart Instead of Automatic?**
- User awareness of cost impact
- Prevents unnecessary restarts
- Gives users control over their workflow
- Reduces total running hours

### 6.2 UI/UX Patterns

**Login Page:**
- Centered form on clean background
- Email and password inputs
- "Login" button (primary CTA)
- Error message below form (red text)
- No "forgot password" link (Phase 1 limitation)

**Restart Modal:**
- Overlay with backdrop
- Cannot close without action (modal blocks interaction)
- Clear headline: "Database Stopped for Cost Savings"
- Explanation: "Database automatically stopped after 60 minutes of inactivity"
- Cost info: "Starting the database costs ~$0.02/hour"
- Primary button: "Start Database"
- Progress bar: 0% to 100% with estimated time remaining
- Auto-closes and retries request when complete

**Admin Panel:**
- Tab navigation: Users, RDS Controls, Cost Tracking
- Users tab: Table with columns (email, name, role, status, last login, actions)
- RDS Controls tab: Status card, manual start/stop buttons, last activity
- Cost Tracking tab: Charts (uptime %, running hours, cost savings), export button

### 6.3 Error Handling Patterns

**Authentication Errors:**
- 401 Unauthorized: "Invalid email or password"
- 403 Forbidden: "Your account is inactive. Contact an administrator."
- 422 Validation: "Password must be at least 8 characters with 1 number"

**RDS Errors:**
- Connection timeout: Trigger restart modal
- Restart failure: "Failed to start database. Please try again or contact support: greg@meraki-digital.com"
- AWS API error: Log full error, show user-friendly message

**General Pattern:**
- Log technical details server-side
- Show actionable message to user
- Provide admin contact for unrecoverable errors

---

## 7. Technical Considerations

### 7.1 Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS, Axios
- **Backend:** FastAPI, Python 3.11, python-jose, bcrypt, boto3
- **User Storage:** AWS DynamoDB (auth-users table)
- **Analytics Database:** PostgreSQL on AWS RDS (existing)
- **RDS Automation:** AWS Lambda, EventBridge
- **Deployment:** Vercel (frontend + backend serverless)

### 7.2 Database Schema

**DynamoDB Table: `auth-users`**
```
Primary Key: user_id (String, UUID)
GSI: email-index (Partition Key: email)

Attributes:
- user_id: String (UUID v4)
- email: String (unique)
- password_hash: String (bcrypt)
- role: String (admin | user | viewer)
- full_name: String
- invite_token: String (nullable, one-time use)
- invite_expires_at: String (ISO-8601, nullable)
- is_active: Boolean
- token_version: Number (default 1, increments on password change) ⭐ NEW
- created_at: String (ISO-8601)
- created_by: String (user_id or 'system')
- last_login: String (ISO-8601, nullable)
- password_changed_at: String (ISO-8601)
```

**DynamoDB Table: `failed-login-attempts`** ⭐ NEW
```
Primary Key: email (String)
TTL: expires_at (1 hour from last failed attempt)

Attributes:
- email: String
- attempt_count: Number (increments on each failed login)
- first_attempt_at: String (ISO-8601)
- last_attempt_at: String (ISO-8601)
- locked_until: String (ISO-8601, nullable - set after 5 attempts)
- expires_at: Number (Unix timestamp, TTL - auto-cleanup after 1 hour)
```

**DynamoDB Table: `restart-locks`** ⭐ NEW
```
Primary Key: lock_id (String, always "rds-restart-lock")
TTL: ttl (5 minutes from lock creation)

Attributes:
- lock_id: String (always "rds-restart-lock")
- locked_by: String (user_id)
- locked_at: String (ISO-8601)
- ttl: Number (Unix timestamp, TTL - auto-cleanup after 5 min)
```

**DynamoDB Table: `rds-audit-log`**
```
Primary Key: event_id (String, UUID)
Sort Key: timestamp (String, ISO-8601)
GSI: user_id-index (Partition Key: user_id)
TTL: expires_at (90 days)

Attributes:
- event_id: String (UUID v4)
- timestamp: String (ISO-8601)
- event_type: String (start | stop | auto_stop)
- user_id: String (UUID, nullable for auto_stop)
- user_email: String (nullable)
- rds_status_before: String
- rds_status_after: String
- notes: String (nullable)
- expires_at: Number (Unix timestamp, TTL)
```

**PostgreSQL Updates: `system_variables`**
```sql
ALTER TABLE core.system_variables
ADD COLUMN rds_auto_stop_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN rds_inactivity_minutes INTEGER DEFAULT 60,
ADD COLUMN rds_max_uptime_hours INTEGER DEFAULT 4,
ADD COLUMN rds_last_query_time TIMESTAMP,
ADD COLUMN rds_last_start_time TIMESTAMP,
ADD COLUMN rds_keepalive_until TIMESTAMP;
```

### 7.3 API Endpoints Summary

**Public Endpoints:**
- POST `/api/auth/login` - User login
- POST `/api/auth/complete-invite` - Accept invitation

**Authenticated Endpoints:**
- GET `/api/auth/me` - Current user info
- POST `/api/auth/logout` - Logout (client-side token removal)
- POST `/api/auth/change-password` - Change password
- GET `/api/admin/rds/status` - RDS status (all authenticated users)
- POST `/api/admin/rds/start` - Start RDS (all authenticated users)

**Admin-Only Endpoints:**
- POST `/api/auth/invite` - Create user invitation
- GET `/api/auth/users` - List all users
- PATCH `/api/auth/users/{user_id}` - Update user
- POST `/api/admin/rds/stop` - Stop RDS manually
- GET `/api/admin/audit/export` - Export audit trail

**Lambda Functions:**
- `rds-auto-stop-checker` (EventBridge trigger every 5 min)
- `rds-start` (API Gateway trigger)
- `rds-stop` (API Gateway trigger)
- `rds-status` (API Gateway trigger)

### 7.4 Environment Variables
```bash
# Backend (.env)
JWT_SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(64))">
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7
JWT_AUTO_EXTEND_THRESHOLD_DAYS=3
DYNAMODB_AUTH_TABLE=auth-users
DYNAMODB_AUDIT_TABLE=rds-audit-log
AWS_REGION=us-east-1
RDS_INSTANCE_ID=ss-financial-poc
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ADMIN_CONTACT_EMAIL=greg@meraki-digital.com
```

### 7.5 Deployment Steps
1. Create DynamoDB tables (auth-users, rds-audit-log)
2. Deploy Lambda functions (auto-stop, start, stop, status)
3. Create EventBridge rule (every 5 min → auto-stop Lambda)
4. Set environment variables in Vercel
5. Deploy backend with auth library
6. Run seed script to create admin user
7. Deploy frontend with login UI
8. Test full flow: login → invite → restart → admin controls
9. Monitor CloudWatch logs for errors

### 7.6 Testing Strategy
- **Unit Tests:** JWT creation/validation, password hashing, DynamoDB queries
- **Integration Tests:** Full auth flow (login → token → protected endpoint)
- **E2E Tests:** Restart modal flow, admin user management
- **Security Tests:** Invalid tokens, role bypass attempts, SQL injection (N/A for DynamoDB)
- **Performance Tests:** JWT validation under load, restart time measurement

---

## 8. Success Metrics

### 8.1 Launch Criteria
- [ ] Admin user can log in successfully
- [ ] Steven can accept invite and log in
- [ ] Token auto-extends for active users
- [ ] Database stops after 60 min inactivity
- [ ] Users can restart database via modal
- [ ] Restart completes in <90 seconds
- [ ] Admin can create invitations
- [ ] Admin can view/update users
- [ ] Audit log captures all events
- [ ] All endpoints require authentication
- [ ] No security vulnerabilities in penetration test

### 8.2 Post-Launch Metrics (30 Days)
- RDS uptime <200 hours/month (vs 720 baseline)
- Cost savings >$8/month (60%+ reduction)
- Zero unauthorized access incidents
- Average restart time <90 seconds
- User satisfaction survey >80% positive
- <5 failed login attempts per user (good password UX)

### 8.3 Monitoring & Alerts
- **CloudWatch Alarm:** Failed login attempts >10/hour → SNS email to admin
- **CloudWatch Alarm:** RDS restart time >120 seconds → SNS email to admin
- **CloudWatch Alarm:** Lambda errors >5/hour → SNS email to admin
- **CloudWatch Alarm:** Auto-stop Lambda failures >3 within 1 hour → SNS email to admin ⭐ NEW
- **Weekly Cost Report:** RDS running hours vs target (if >150 hours, investigate) ⭐ NEW
- **Weekly Cost Variance Alert:** If actual uptime >25% above projected, email admin ⭐ NEW
- **Monthly Security Audit:** Review audit log for anomalies (unusual restart patterns, failed logins)
- **Dashboard Metrics:** Display in admin panel:
  - Current RDS status (running/stopped)
  - Uptime this week/month
  - Cost this week/month vs projected
  - Failed auto-stop attempts (last 7 days)

---

## 9. Open Questions

### 9.1 Resolved Questions
- ✅ Authentication provider: Custom JWT (not Clerk/Auth0)
- ✅ User registration: Invite-only (not open registration)
- ✅ Password requirements: Simple (min 8 chars, 1 number)
- ✅ Token expiration: Auto-extend for active users
- ✅ Initial users: Greg + Steven
- ✅ Inactivity threshold: Configurable by admin (default 60 min)
- ✅ Restart UX: Modal blocks interaction
- ✅ Cost tracking: Full audit trail with user attribution

### 9.2 Outstanding Questions
- **Email delivery:** How should admin send invitation links? (Manual copy/paste for Phase 1, email automation in Phase 2)
- **Password reset:** How do users reset forgotten passwords? (Admin manually resets for Phase 1, self-service in Phase 2)
- ✅ **Concurrent restarts:** Resolved via FR-015a (distributed lock prevents race conditions)
- **Lambda cold starts:** Will Lambda cold starts delay restart API calls? (Pre-warm Lambdas with EventBridge ping every 5 min, monitor performance)
- **Token storage security:** Is localStorage safe enough for JWT? (Yes for Phase 1 internal tool, consider httpOnly cookies in Phase 2 for external users)
- ✅ **Token theft protection:** Resolved via FR-003 (30-day absolute lifetime + device fingerprinting)
- ✅ **Mid-session auto-stop:** Resolved via FR-012a (keepalive mechanism with 4-hour maximum uptime limit)
- ✅ **Brute force attacks:** Resolved via FR-001a (rate limiting after 5 failed attempts)

---

## 10. Appendix

### 10.1 Related Documents
- Executive SRS: `/tasks/mods/0007/0007-srs-executive-authentication-rds-management.md`
- Technical SRS: `/tasks/mods/0007/0007-srs-technical-authentication-rds-management.md`
- Authentication System Documentation: `/poc/docs/authentication-system.md`
- Module Seed: `/tasks/mods/0007/0007-seed.md`

### 10.2 Glossary
- **JWT (JSON Web Token):** Stateless authentication token containing user claims
- **DynamoDB:** AWS NoSQL database service (key-value store)
- **RDS (Relational Database Service):** AWS managed PostgreSQL database
- **Lambda:** AWS serverless function service
- **EventBridge:** AWS event scheduling service (like cron)
- **bcrypt:** Password hashing algorithm with built-in salt
- **GSI (Global Secondary Index):** DynamoDB index for querying non-primary-key attributes
- **TTL (Time To Live):** Automatic deletion of DynamoDB items after expiration
- **Cold Start:** Time to start a stopped RDS instance (60-90 seconds)
- **Auto-Extension:** Automatic token refresh for active users

### 10.3 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-01 | AI Agent | Initial draft based on SRS and clarifying questions |
| 1.1 | 2025-11-01 | AI Agent | Naysayer review complete - added security hardening and operational improvements |

### 10.4 Naysayer Review: Outstanding Concerns

**Completed During Review:**
The following critical issues were identified and resolved during Naysayer review:

1. ✅ **Token Auto-Extension Security Risk** - RESOLVED
   - **Issue:** Stolen tokens could remain valid indefinitely
   - **Resolution:** Added 30-day absolute lifetime + device fingerprinting (FR-003)

2. ✅ **Concurrent Restart Race Condition** - RESOLVED
   - **Issue:** Multiple users could trigger duplicate Lambda invocations
   - **Resolution:** Implemented distributed lock using DynamoDB (FR-015a)

3. ✅ **RDS Auto-Stop During Active Session** - RESOLVED
   - **Issue:** User reading dashboard for 61 min would trigger auto-stop
   - **Resolution:** Added keepalive mechanism with 4-hour maximum uptime limit (FR-012a)

4. ✅ **Hardcoded Admin Password** - RESOLVED
   - **Issue:** Security vulnerability with documented default password
   - **Resolution:** Generate cryptographically random password in seed script (FR-023)

5. ✅ **Manual Invitation Distribution** - RESOLVED
   - **Issue:** Admin could forget to send invitation links
   - **Resolution:** Added invite management UI with expiration tracking (FR-004)

6. ✅ **EventBridge Check Interval Too Slow** - RESOLVED
   - **Issue:** 5-minute interval reduced cost savings by 5-10%
   - **Resolution:** Reduced to 1-minute interval (FR-013)

7. ✅ **No Rate Limiting on Login** - RESOLVED
   - **Issue:** Vulnerability to brute force attacks
   - **Resolution:** Implemented 5-attempt lockout with 1-hour cooldown (FR-001a)

8. ✅ **Cost Tracking Incomplete** - RESOLVED
   - **Issue:** Ignored Lambda/DynamoDB/EventBridge costs
   - **Resolution:** Added comprehensive cost breakdown (FR-021)

9. ✅ **Restart Modal Blocks UI** - RESOLVED
   - **Issue:** No way to cancel restart operation
   - **Resolution:** Added Cancel button with confirmation for in-progress restarts (FR-015)

10. ✅ **No Auto-Stop Failure Monitoring** - RESOLVED
    - **Issue:** Failed auto-stop could cause runaway costs
    - **Resolution:** Added CloudWatch alarms and weekly variance alerts (Section 8.3)

11. ✅ **Password Change Doesn't Invalidate Tokens** - RESOLVED
    - **Issue:** Stolen tokens remain valid after password change
    - **Resolution:** Implemented token versioning with DynamoDB validation (FR-006a)

**Remaining Concerns (Documented for Phase 2):**

1. **JWT Secret Key Rotation** (Deferred to Phase 2)
   - **Concern:** No mechanism for periodic secret key rotation
   - **Impact:** Compromised key affects all tokens until natural expiration
   - **Mitigation:** Document rotation strategy for Phase 2
   - **Workaround:** Manual key rotation acceptable for Phase 1 (2 users, internal tool)

2. **Token Version Validation Performance** (Accepted Trade-off)
   - **Concern:** FR-006a adds 1 DynamoDB read per protected request
   - **Impact:** ~$0.02/month additional cost, ~5-10ms latency per request
   - **Decision:** Security benefit outweighs minimal performance cost
   - **Monitoring:** Track p95 latency for protected endpoints

3. **Device Fingerprinting Accuracy** (Known Limitation)
   - **Concern:** User-Agent + IP /24 range could have false positives
   - **Scenarios:** User changes browser, VPN reconnects to different region, corporate proxy rotation
   - **Impact:** User forced to re-login occasionally
   - **Decision:** Acceptable for Phase 1 security improvement
   - **Future:** Consider more sophisticated fingerprinting (canvas, WebGL, etc.)

4. **4-Hour Maximum Uptime Limit** (User Experience Trade-off)
   - **Concern:** Power user working 5+ hours will experience forced stop
   - **Scenario:** Greg analyzing data for 6 hours straight, DB stops mid-session
   - **Impact:** Minor inconvenience, 90-second restart required
   - **Decision:** Protects against "left machine on overnight" scenario
   - **Monitoring:** Track frequency of max-uptime auto-stops, adjust threshold if >10/month

5. **localStorage Token Storage** (Phase 1 Acceptable)
   - **Concern:** Vulnerable to XSS attacks (if XSS vulnerability exists)
   - **Impact:** Attacker could steal token via JavaScript
   - **Decision:** Low risk for Phase 1 (2 trusted users, no user-generated content)
   - **Phase 2:** Migrate to httpOnly cookies if external users added

**Security Posture Summary:**
- ✅ 12 critical security improvements implemented
- ✅ 5 remaining concerns documented and accepted
- ✅ No unmitigated high-severity risks
- ⚠️ Phase 2 should address: key rotation, httpOnly cookies, advanced fingerprinting

### 10.5 Approval
- [ ] Product Owner: _______________  Date: _______
- [ ] Technical Lead: _______________  Date: _______
- [ ] Security Review: _______________  Date: _______

---

**Status:** Naysayer Review Complete - Ready for Approval

**Next Steps:**
1. ✅ Naysayer review complete
2. Address any concerns from technical lead
3. Security review approval
4. Generate task list (Step 3)
5. Begin implementation

---

*End of PRD*
