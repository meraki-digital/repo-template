# Technical SRS: RDS Auto-Stop/Start Cost Management + Authentication

**Date:** 2025-11-01 22:00

**Project Name:** Authentication RDS Management

**Version:** 1.0

---

## 1. Introduction

### 1.1 Purpose
This document specifies the technical requirements for implementing authentication and automated RDS cost management in the Superscapes Financial Intelligence Dashboard. The system will provide secure user access while minimizing cloud costs through intelligent database lifecycle management.

### 1.2 Scope
The system includes:
- Custom stateless JWT-based authentication using DynamoDB
- Invite-only user registration system
- AWS Lambda functions for RDS control
- EventBridge scheduled automation
- Frontend authentication flows
- Admin control interfaces

### 1.3 Definitions, Acronyms, Abbreviations
- JWT: JSON Web Token
- RDS: Relational Database Service (AWS)
- SSO: Single Sign-On
- API: Application Programming Interface

### 1.4 References
- Executive SRS: Business requirements and scope
- Module 0007 Seed: Detailed functional requirements
- AWS RDS Documentation
- Authentication System Documentation: `/poc/docs/authentication-system.md`

---

## 2. Overall Description

### 2.1 Product Perspective
The system integrates with existing FastAPI backend and React frontend, adding authentication middleware and RDS management capabilities. It operates as middleware between users and the core financial analytics functionality.

### 2.2 Product Functions
- User authentication via custom JWT with DynamoDB user storage
- Invite-only user registration (admin creates invite links)
- JWT token validation on all API requests (stateless)
- Automatic RDS stop after inactivity
- User-initiated RDS restart with authentication
- Role-based authorization for admin features
- Cost tracking and reporting

### 2.3 User Characteristics
- **End Users:** Basic computer literacy, expect intuitive authentication flow
- **Administrators:** Technical knowledge of AWS and system administration
- **Developers:** Familiar with React, Python, and cloud services

### 2.4 Constraints
- Must work with existing Vercel + FastAPI architecture
- Authentication must function when database is unavailable
- JWT validation must be performant (<100ms)
- RDS restart must complete within 90 seconds

### 2.5 Assumptions and Dependencies
- AWS services (RDS, Lambda, EventBridge, DynamoDB) available
- DynamoDB used for authentication (always-available, independent of RDS)
- Existing frontend/backend integration patterns maintained
- JWT secret key securely stored in environment variables

---

## 3. System Features

### 3.1 Authentication System
**Description:** Users authenticate via custom JWT implementation, receiving tokens for stateless identity verification. User data stored in DynamoDB for always-on availability.

**Functional Requirements:**
- FR1: Support email/password login via `/api/auth/login`
- FR2: Issue JWT tokens with user_id, email, role claims (7-day expiration)
- FR3: Validate JWT signatures on all protected API endpoints
- FR4: Redirect unauthenticated users to login page
- FR5: Store user credentials in DynamoDB `auth-users` table
- FR6: Hash passwords using bcrypt (salt rounds: 12)
- FR7: Support invite-only registration (admin generates invite links)
- FR8: One-time invite token acceptance via `/api/auth/complete-invite`

### 3.2 Authorization System
**Description:** Role-based permissions stored in DynamoDB and cached in JWT claims.

**Functional Requirements:**
- FR9: Store user roles (admin, user, viewer) in DynamoDB `auth-users` table
- FR10: Require admin role for RDS management endpoints
- FR11: Embed role in JWT claims to minimize DynamoDB queries
- FR12: Validate role on each protected endpoint via middleware
- FR13: Support role updates by admins via `/api/auth/users/{user_id}` PATCH

### 3.3 RDS Auto-Stop
**Description:** Automatically stop RDS after period of inactivity.

**Functional Requirements:**
- FR14: Monitor last query timestamp via middleware
- FR15: Trigger stop after 60 minutes of no activity
- FR16: Log stop events with timestamp and cost savings
- FR17: Send notifications (future enhancement)

### 3.4 RDS User Restart
**Description:** Allow authenticated users to restart stopped RDS instances.

**Functional Requirements:**
- FR18: Detect DB connection failures on API requests
- FR19: Show restart modal with cost information
- FR20: Execute RDS start via JWT-protected Lambda
- FR21: Poll status until database available
- FR22: Automatically retry original request

### 3.5 Admin Controls
**Description:** Provide administrative interface for manual RDS management and user administration.

**Functional Requirements:**
- FR23: Display current RDS status (running/stopped/starting)
- FR24: Show last activity timestamp
- FR25: Allow manual start/stop operations
- FR26: Provide cost tracking dashboard
- FR27: Create user invitations via `/api/auth/invite` (admin only)
- FR28: List all users via `/api/auth/users` (admin only)
- FR29: Update user roles and status via PATCH endpoint (admin only)

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- Login page with email/password form
- Invite acceptance page for new users
- Restart modal with progress indicator
- Admin panel with RDS controls and user management
- Status indicators throughout UI

### 4.2 Hardware Interfaces
- AWS RDS PostgreSQL instance (t3.micro or larger)
- AWS Lambda functions for RDS operations

### 4.3 Software Interfaces
- AWS DynamoDB API (boto3) for user authentication storage
- AWS RDS API (boto3) for database lifecycle management
- PostgreSQL database via SQLAlchemy (analytics data only)
- EventBridge for scheduling
- python-jose for JWT creation and validation
- bcrypt for password hashing

### 4.4 Communications Interfaces
- HTTPS for all API communications
- WebSocket for real-time status updates (future)

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
- Authentication validation: <100ms response time
- JWT signature verification: <50ms
- Database restart: <90 seconds completion
- API response time: <500ms for non-DB operations

### 5.2 Security Requirements
- All API endpoints require valid JWT
- JWT signatures verified on every request
- Admin operations require database role verification
- No sensitive data in JWT claims

### 5.3 Usability Requirements
- Authentication flow: <3 clicks to login
- Restart process: Clear progress feedback
- Error messages: User-friendly explanations

### 5.4 Reliability Requirements
- Authentication availability: 99.9% uptime
- RDS operations success rate: >95%
- Graceful degradation when DB unavailable

### 5.5 Scalability Requirements
- Support 100+ concurrent authenticated users
- Handle multiple simultaneous restart requests
- Scale Lambda functions automatically

---

## 6. System Architecture

### 6.1 Technology Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python 3.11, SQLAlchemy
- **Database:** PostgreSQL 15, AWS RDS (analytics data)
- **Authentication:** Custom JWT with python-jose, bcrypt, DynamoDB
- **User Storage:** AWS DynamoDB (`auth-users` table)
- **Cloud Services:** AWS Lambda, EventBridge, API Gateway
- **Deployment:** Vercel (frontend), Vercel serverless (backend)

### 6.2 Data Storage
- **DynamoDB (`auth-users`):** User credentials, roles, invite tokens (always-available)
- **PostgreSQL (RDS):** Analytics data, system variables, activity logs
- **S3:** Static assets and logs (future enhancement)

### 6.3 Architecture Diagram
```
[User] → [Login Form] → [Frontend]
    ↓           ↓           ↓
[DynamoDB auth-users] ← [Backend API (FastAPI)]
                              ↓
[RDS PostgreSQL] ← [Lambda RDS Control] ← [JWT Middleware]
    ↑                  ↑
[EventBridge Scheduler] ← [System Variables]
```

### 6.4 Component Interactions
1. User submits email/password to `/api/auth/login`
2. Backend queries DynamoDB `auth-users` by email (GSI)
3. Verify password hash using bcrypt
4. Generate JWT with user_id, email, role claims (7-day expiration)
5. Frontend stores JWT in localStorage
6. Frontend includes JWT in `Authorization: Bearer <token>` header
7. Backend validates JWT signature (stateless, no DB query)
8. For admin operations, role claim checked in JWT
9. If RDS down, shows restart prompt
10. Lambda starts RDS, updates system variables
11. Frontend polls status, retries request

---

## 7. Data Requirements

### 7.1 Data Models

**DynamoDB Table: `auth-users`**
```
Primary Key: user_id (UUID, String)
GSI: email-index (email as partition key)

Attributes:
{
  "user_id": "uuid-v4-string",
  "email": "user@example.com",
  "password_hash": "bcrypt-hashed-password",
  "role": "admin | user | viewer",
  "full_name": "User Name",
  "invite_token": "one-time-token (nullable)",
  "invite_expires_at": "ISO-8601-timestamp (nullable)",
  "is_active": true,
  "created_at": "ISO-8601-timestamp",
  "created_by": "user_id-of-creator",
  "last_login": "ISO-8601-timestamp (nullable)",
  "password_changed_at": "ISO-8601-timestamp"
}
```

**PostgreSQL: system_variables Updates:**
```sql
ALTER TABLE core.system_variables
ADD COLUMN rds_auto_stop_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN rds_inactivity_minutes INTEGER DEFAULT 60,
ADD COLUMN rds_last_query_time TIMESTAMP,
ADD COLUMN rds_keepalive_until TIMESTAMP;
```

### 7.2 Data Flow Diagrams
1. **Authentication:** Login Form → Backend `/api/auth/login` → DynamoDB Query → Password Verify → JWT Generation → Frontend Storage (localStorage)
2. **Authorization:** JWT in Request Header → Backend Middleware → JWT Validation → Role Check (from JWT claims) → Permission Grant/Deny
3. **RDS Control:** API Request → Lambda → RDS API → Status Update → System Variables
4. **User Invitation:** Admin → `/api/auth/invite` → DynamoDB Insert (invite_token) → Email Invite Link → User → `/api/auth/complete-invite` → Set Password → Account Active

### 7.3 Storage Requirements
- User data: <1GB (expected <100 users)
- Activity logs: <100MB/month
- System variables: Minimal additional storage

---

## 8. Appendix

### 8.1 Discovery Interview Summary
The seed file provided comprehensive requirements covering authentication architecture, RDS automation, and integration points. Key clarifications:
- **Custom JWT + DynamoDB selected** instead of vendor providers (Clerk/Auth0) to avoid vendor lock-in, reduce complexity, and ensure reusability
- **Invite-only registration:** Admin creates users via invite links (one-time tokens)
- **Password requirements:** Minimum 8 characters, at least 1 number (simple validation)
- **Token expiration:** 7 days, no refresh tokens (user must re-login after expiration)
- **Initial admin user:** Created via seed script on first deployment
- Stateless authentication prioritized for RDS independence
- 60-minute inactivity threshold established
- JWT role caching approved for performance
- See `/poc/docs/authentication-system.md` for complete implementation details

### 8.2 Technical Diagrams
See architecture diagram in Section 6.3

### 8.3 API Specifications
**Authentication Endpoints:**
- POST `/api/auth/login` - Email/password login, returns JWT
- POST `/api/auth/logout` - Client-side token removal (optional server-side tracking)
- GET `/api/auth/me` - Get current user info (requires JWT)
- POST `/api/auth/change-password` - Change user password (requires JWT)
- POST `/api/auth/complete-invite` - Accept invitation and set password (public)

**Admin-Only Endpoints:**
- POST `/api/auth/invite` - Create user invitation (admin role required)
- GET `/api/auth/users` - List all users (admin role required)
- PATCH `/api/auth/users/{user_id}` - Update user role/status (admin role required)

**RDS Management:**
- POST `/admin/rds/start` - Start RDS instance (JWT required)
- POST `/admin/rds/stop` - Stop RDS instance (admin role required)
- GET `/admin/rds/status` - Get RDS status (JWT required)

### 8.4 Database Schema Details
See Section 7.1 for complete table definitions

### 8.5 Outstanding Concerns
- Performance impact of JWT validation on high-traffic endpoints (mitigated: <50ms validation time)
- Handling concurrent restart requests (need locking mechanism)
- Cost estimation accuracy for user display
- DynamoDB costs for authentication table (estimated <$1/month for 100 users)
- Password reset flow not yet specified (marked for Phase 2)
- Email delivery for invite links (initially admin sends manually, automation in Phase 2)
- Invite token expiration cleanup (7-day TTL attribute in DynamoDB)

---

**Status:** Technical SRS complete. Ready for implementation planning.
