# Explainer: Authentication & RDS Cost Management System

**Project:** Superscapes Financial Intelligence Dashboard
**Module:** 0007 - Authentication RDS Management
**Date:** 2025-11-02
**Version:** 1.0
**Audience:** Junior to mid-level developers, project stakeholders

---

## What Are We Building?

We're adding two interconnected systems to the Superscapes Financial Intelligence Dashboard:

1. **Custom JWT Authentication** - A secure, invite-only user authentication system using DynamoDB that works even when the main database is offline
2. **Automated RDS Cost Management** - Smart database lifecycle automation that stops PostgreSQL when inactive and allows authenticated users to restart it on-demand

Think of it like adding a security guard (authentication) and a smart thermostat (RDS automation) to your house. The security guard controls who gets in, and the thermostat automatically turns off heating when nobody's home but lets you restart it remotely when needed.

---

## Why This Matters

### The Business Problem

The dashboard currently has three pain points:

1. **No access control** - Anyone with the URL can view sensitive financial data
2. **Always-on database costs** - PostgreSQL RDS runs 24/7 even when nobody's using it ($20-50/month wasted)
3. **Vendor lock-in risk** - Using third-party auth providers (Auth0, Clerk) creates dependencies and ongoing costs

### Our Solution

**Custom Authentication:**
- Invite-only user registration (admin controls who gets access)
- JWT-based stateless authentication (works when database is stopped)
- DynamoDB user storage (always-available, low-cost)
- Role-based permissions (admin vs. user vs. viewer)

**RDS Cost Management:**
- Automatic database stop after 60 minutes of inactivity
- User-initiated database restart via authenticated API
- Lambda functions for serverless database control
- EventBridge scheduler for inactivity checks

**Expected Impact:**
- **Security:** Only authorized users can access sensitive financial data
- **Cost savings:** ~$30-40/month by stopping database during inactive periods
- **User experience:** Seamless restart flow when database is needed

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                            │
└─────────────────────────────────────────────────────────────────┘

1. Admin invites user → Email with invite link
2. User accepts invite → Sets password (stored in DynamoDB)
3. User logs in → Receives JWT token (7-day expiration)
4. User makes request → Backend validates JWT
5. Database inactive 60min → EventBridge triggers Lambda → Stops RDS
6. User tries to query → Database stopped error
7. User clicks "Restart" → Lambda starts RDS (90 seconds)
8. User retries query → Success!

┌─────────────────────────────────────────────────────────────────┐
│                     COMPONENT DIAGRAM                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌─────────────────┐         ┌────────────┐
│   Frontend   │────────>│  FastAPI Backend│────────>│ DynamoDB   │
│  (React 19)  │  HTTPS  │   (Vercel)      │  boto3  │ auth-users │
└──────────────┘         └─────────────────┘         └────────────┘
       │                          │
       │                          │ JWT Validation
       │                          ▼
       │                  ┌─────────────────┐
       │                  │  PostgreSQL RDS │
       │                  │  (Analytics)    │
       │                  └─────────────────┘
       │                          ▲
       │                          │
       │                  ┌───────┴────────┐
       │                  │  Lambda RDS    │
       └─────────────────>│  Controller    │
         API Gateway      └────────────────┘
                                  ▲
                                  │
                          ┌───────┴────────┐
                          │  EventBridge   │
                          │  (15min cron)  │
                          └────────────────┘
```

---

## Core Technologies Explained

### Authentication Stack

**JWT (JSON Web Tokens)**
- Compact, self-contained token format
- Contains user_id, email, role, expiration
- Signed with secret key to prevent tampering
- **Benefit:** No database lookup needed for every request

**DynamoDB**
- NoSQL database for user credentials
- Always-on availability (99.99% uptime SLA)
- Single-digit millisecond latency
- **Benefit:** Login works even when PostgreSQL is stopped

**bcrypt**
- Password hashing algorithm with salt
- Intentionally slow (~300ms) to resist brute-force
- **Benefit:** User passwords never stored in plain text

### RDS Automation Stack

**AWS Lambda**
- Serverless functions for start/stop operations
- Only charged for execution time (milliseconds)
- Auto-scales to handle concurrent requests
- **Benefit:** No server to maintain, pay-per-use

**EventBridge**
- Scheduled event triggers (cron jobs)
- Invokes Lambda every 15 minutes to check inactivity
- **Benefit:** Reliable, serverless scheduling

**IAM Roles**
- Least-privilege permissions for Lambda
- Can start/stop RDS but can't delete it
- **Benefit:** Security without storing AWS credentials

---

## Key Workflows

### 1. User Invitation & Registration

```
┌─────────┐  Creates    ┌──────────┐  Generates  ┌──────────────┐
│  Admin  │────────────>│ Invitation│────────────>│ Invite Token │
└─────────┘  (Email +   └──────────┘  (32-byte   └──────────────┘
              Role)                    random)            │
                                                          │
                                                          ▼
                                               ┌──────────────────┐
                                               │   DynamoDB       │
                                               │   User Record    │
                                               │   is_active=false│
                                               └──────────────────┘
                                                          │
              ┌───────────────────────────────────────────┘
              │ User clicks invite link
              ▼
┌─────────────────────┐  Sets Password  ┌──────────────┐
│ Invite Acceptance   │────────────────>│   bcrypt     │
│ Form                │                 │   Hash       │
└─────────────────────┘                 └──────────────┘
              │                                 │
              └─────────────────────────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │ DynamoDB      │
                        │ is_active=true│
                        │ password_hash │
                        └───────────────┘
```

### 2. Authentication Flow

```
┌──────────┐   Email +   ┌───────────────┐
│  User    │  Password   │ POST /auth/   │
│  Login   │────────────>│ login         │
└──────────┘             └───────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ DynamoDB Query by    │
                     │ Email (GSI)          │
                     └──────────────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ bcrypt.checkpw()     │
                     │ Compare password     │
                     └──────────────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Generate JWT Token   │
                     │ {user_id, email,     │
                     │  role, exp: 7 days}  │
                     └──────────────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │ Frontend      │
                        │ localStorage  │
                        └───────────────┘
```

### 3. RDS Auto-Stop/Restart Flow

```
Every 15 minutes:
┌──────────────┐   Triggers   ┌─────────────────┐
│ EventBridge  │─────────────>│ Lambda: Check   │
│ Scheduler    │              │ Inactivity      │
└──────────────┘              └─────────────────┘
                                      │
                                      ▼
                            ┌───────────────────────┐
                            │ Read last_query_time  │
                            │ from DynamoDB         │
                            └───────────────────────┘
                                      │
                                      ▼
                         ┌────────────────────────────┐
                         │ Time since last query      │
                         │ > 60 minutes?              │
                         └────────────────────────────┘
                                 Yes │     │ No
                    ┌────────────────┘     └────────> Do nothing
                    ▼
          ┌─────────────────┐
          │ rds.stop_db_     │
          │ instance()       │
          └─────────────────┘

When user needs database:
┌──────────┐  Query fails  ┌─────────────────┐
│  User    │──────────────>│ "Database       │
│          │               │  Stopped" Error │
└──────────┘               └─────────────────┘
     │                             │
     │ Clicks "Restart DB"         ▼
     │                  ┌──────────────────────┐
     └─────────────────>│ POST /rds/start      │
                        │ (JWT required)       │
                        └──────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Lambda: Start RDS    │
                        │ (90 second startup)  │
                        └──────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Frontend polls       │
                        │ /rds/status every 5s │
                        └──────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Status: available    │
                        │ Retry original query │
                        └──────────────────────┘
```

---

## Data Models

### DynamoDB: `auth-users` Table

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",  // UUID v4 (Partition Key)
  "email": "user@example.com",                        // String (GSI: email-index)
  "password_hash": "$2b$12$KIXn...",                  // bcrypt hash
  "role": "admin",                                    // "admin" | "user" | "viewer"
  "full_name": "John Doe",
  "invite_token": null,                               // One-time token (nullable)
  "invite_expires_at": null,                          // ISO-8601 timestamp
  "is_active": true,                                  // Boolean
  "created_at": "2025-11-02T12:00:00Z",
  "created_by": "admin-user-id",
  "last_login": "2025-11-02T14:30:00Z",
  "password_changed_at": "2025-11-02T12:00:00Z"
}
```

### PostgreSQL: `system_variables` Table (Additions)

```sql
ALTER TABLE core.system_variables ADD COLUMN
  rds_auto_stop_enabled BOOLEAN DEFAULT TRUE,
  rds_inactivity_minutes INTEGER DEFAULT 60,
  rds_last_query_time TIMESTAMP,
  rds_keepalive_until TIMESTAMP;
```

---

## Security Considerations

### What We Do to Stay Secure

1. **Password Security**
   - bcrypt hashing with 12 salt rounds
   - Minimum 8 characters, at least 1 number
   - No password reset flow in v1 (admin must recreate user)

2. **JWT Security**
   - Signed with 256-bit secret key
   - 7-day expiration (no refresh tokens in v1)
   - Stateless validation (no database lookup per request)

3. **Invite Security**
   - Cryptographically random 32-byte tokens
   - 7-day expiration on invite links
   - One-time use (token nullified after acceptance)

4. **AWS Security**
   - IAM roles with least-privilege permissions
   - No AWS credentials in code (environment variables only)
   - DynamoDB encryption at rest (AWS managed)

5. **CORS & Headers**
   - Strict origin whitelist for frontend
   - HTTPS-only in production
   - Authorization header required for all protected endpoints

### Known Limitations (v1)

- No password reset flow (requires admin intervention)
- No email delivery automation (admin sends invite links manually)
- No MFA/2FA (planned for v2)
- No session revocation (JWT valid until expiration)

---

## Cost Analysis

### Monthly Costs (Estimated for 100 users)

**DynamoDB (Always-On)**
- 1,000 login requests/month
- 100 user records (~10KB storage)
- Cost: **~$0.50/month**

**AWS Lambda**
- 2,880 invocations/month (EventBridge checks every 15 min)
- 100ms average duration
- Cost: **~$0.10/month**

**EventBridge**
- 2,880 scheduled events/month
- Cost: **Free** (first 1M events free)

**RDS Savings**
- Without automation: 24/7 = 720 hours/month
- With automation (assume 40% uptime): ~288 hours/month
- t3.micro cost: $0.017/hour
- **Savings: ~$7.30/month**

**Net Result:**
- Added cost: $0.60/month
- RDS savings: $7.30/month
- **Net savings: ~$6.70/month**
- **Plus:** Enhanced security and access control

---

## Testing Strategy

### Manual Testing with Postman

1. **Create user invitation** (admin token required)
2. **Accept invitation** (public endpoint)
3. **Login** (capture JWT token)
4. **Authenticated request** (use JWT token)
5. **Admin operation** (verify role-based access)
6. **RDS start** (trigger database restart)
7. **RDS status** (poll until available)

### Automated Testing (Future)

- Unit tests: Password hashing, JWT generation
- Integration tests: DynamoDB user CRUD, RDS operations
- End-to-end tests: Full authentication flow

---

## Rollout Plan

### Phase 1: Core Authentication (Weeks 1-2)
- DynamoDB table creation
- FastAPI authentication endpoints
- React login/invite forms
- Basic JWT validation middleware

### Phase 2: RDS Automation (Weeks 3-4)
- Lambda functions for start/stop
- EventBridge scheduler
- IAM role configuration
- Frontend restart modal

### Phase 3: Polish & Testing (Week 5)
- Error handling improvements
- Logging and monitoring
- Load testing
- Documentation

### Phase 4: Production Deployment (Week 6)
- Seed initial admin user
- Migrate to `poc-prod` branch
- Monitor for issues
- Gradual user invitations

---

## Open Questions & Future Enhancements

### Open Questions
1. What should password reset flow look like? (Self-service vs admin-initiated)
2. Should we implement email delivery for invite links? (SendGrid, AWS SES)
3. Do we need session management for logout? (Current: JWT expires in 7 days)
4. Should viewers be able to restart RDS or only admins/users?

### Future Enhancements (v2)
- **Multi-factor authentication (MFA)** - TOTP-based 2FA
- **Session revocation** - Admin can invalidate tokens before expiration
- **Email automation** - Automated invite and notification emails
- **Audit logging** - Track all admin actions (user creation, role changes)
- **Password reset** - Self-service password reset with email verification
- **RDS scheduling** - Custom schedules (e.g., "keep running 9am-5pm weekdays")
- **Cost dashboard** - Real-time RDS cost tracking and savings metrics

---

## Glossary

**Authentication:** Verifying user identity (proving you are who you claim to be)
**Authorization:** Controlling what authenticated users can do (permissions)
**bcrypt:** Password hashing algorithm designed to be slow (resistant to brute-force)
**DynamoDB:** AWS NoSQL database service (key-value store)
**GSI (Global Secondary Index):** Alternate query path for DynamoDB (query by email instead of user_id)
**IAM Role:** Set of AWS permissions that can be assumed by services like Lambda
**JWT (JSON Web Token):** Compact, self-contained token for stateless authentication
**Lambda:** AWS serverless compute service (run code without managing servers)
**RBAC:** Role-Based Access Control (admin, user, viewer roles)
**RDS:** AWS Relational Database Service (managed PostgreSQL)
**Salt:** Random data added to passwords before hashing (prevents rainbow table attacks)
**Stateless:** Server doesn't store session data; all info in JWT token

---

## Additional Resources

- **Tech Stack Document:** [0007-tech-stack.md](0007-tech-stack.md) - Complete list of technologies with explainer links
- **Executive SRS:** [0007-srs-executive-authentication-rds-management.md](0007-srs-executive-authentication-rds-management.md)
- **Technical SRS:** [0007-srs-technical-authentication-rds-management.md](0007-srs-technical-authentication-rds-management.md)
- **PRD:** [0007-prd-authentication-rds-management.md](0007-prd-authentication-rds-management.md)
- **Task List:** [0007-tasks-authentication-rds-management.md](0007-tasks-authentication-rds-management.md)

---

**Document Status:** Complete
**Next Steps:** Proceed to Step 5 (Process Task List) to create implementation plan
