# Executive SRS: RDS Auto-Stop/Start Cost Management + Authentication

**Date:** 2025-11-01 22:00

**Project Name:** Authentication RDS Management

**Version:** 1.0

---

## Executive Summary

### The Problem
The Superscapes Financial Intelligence Dashboard POC currently runs its AWS RDS PostgreSQL database instance 24/7, incurring unnecessary costs during non-business hours, weekends, and periods of inactivity. Additionally, the application lacks any authentication system, making it completely unsecured and vulnerable to unauthorized access. This dual challenge prevents the POC from being safely shared with stakeholders while driving up cloud costs that could be reduced by 60-80%.

### The Solution
We will implement an intelligent RDS lifecycle management system with custom JWT-based authentication that automatically stops the database during periods of inactivity and requires users to authenticate before accessing data. The authentication system uses DynamoDB for user storage (ensuring login works even when RDS is stopped) and provides invite-only registration to control access. When users attempt to access the application, they'll be prompted to authenticate with email and password, and if the database is stopped, they'll have the option to restart it. This creates a cost-effective, secure environment where the database only runs when needed.

### Key Benefits
- **Cost Reduction:** 60-80% reduction in RDS costs through intelligent auto-stop/start
- **Security:** Complete authentication system protecting sensitive financial data
- **User Experience:** Seamless cold start experience with clear progress indicators
- **Scalability:** Foundation for enterprise-grade access controls and cost management

### Timeline & Milestones
- **Phase 1 (MVP):** 4-6 weeks - Core authentication + basic RDS auto-stop/start
- **Phase 2:** 2-3 weeks - Advanced controls, cost tracking, notifications
- **Testing & Deployment:** 1-2 weeks - Integration testing, security review

---

## Business Requirements

### 2.1 Problem Statement
The POC application serves as a demonstration platform for financial intelligence analytics but faces two critical limitations: (1) high operational costs from continuous database availability, and (2) zero security controls allowing anyone with the URL to access sensitive financial data. These issues prevent broader stakeholder adoption and create unacceptable cost profiles for production scaling.

### 2.2 Goals & Objectives
- Reduce RDS operational costs by 60-80% through demand-based availability
- Implement complete authentication system ensuring all users are verified
- Provide transparent user experience during database cold starts
- Establish foundation for role-based access controls
- Enable secure sharing of POC with external stakeholders

### 2.3 Target Users
- **Primary:** Financial analysts and business users accessing KPI dashboards
- **Secondary:** Administrators managing system controls and cost tracking
- **Tertiary:** Developers and IT staff maintaining the platform

### 2.4 Success Metrics
- Cost savings of 60-80% on RDS usage within first month
- 100% of application access requires authentication
- Cold start completion rate >95% with user satisfaction >80%
- Zero unauthorized access incidents

---

## Solution Overview

### 3.1 Core Capabilities
- **Stateless Authentication:** Custom JWT-based login with DynamoDB user storage, works even when database is down
- **Invite-Only Access:** Admins create and send invitation links to control who can join
- **Intelligent RDS Management:** Automatic stop after inactivity, user-initiated restart
- **Cost Transparency:** Real-time cost tracking and savings reporting
- **Role-Based Security:** Admin controls separate from regular user access

### 3.2 User Experience
Users visit the application and are immediately prompted to authenticate with email and password (or complete an invitation if they're new). Once logged in, they see their dashboard normally. If the database has been stopped for cost savings, a clear modal explains the situation and offers to restart it. The restart takes 60-90 seconds with progress feedback, after which normal operation resumes. New users receive an email invitation link from an administrator, allowing them to set their password and activate their account.

### 3.3 Key Features
1. Secure email/password login with JWT tokens (7-day expiration)
2. Invite-only user registration via admin-generated invitation links
3. Automatic database pause during inactivity
4. One-click database restart with cost awareness
5. Admin panel for user management, manual RDS controls, and cost monitoring
6. Real-time status indicators and activity logs

---

## Scope & Boundaries

### 4.1 What's Included
- Complete custom authentication system with JWT tokens and DynamoDB storage
- Invite-only user registration with admin controls
- RDS auto-stop/start with EventBridge scheduling
- User-initiated restart flow with progress tracking
- Admin controls for user management, manual RDS override, and monitoring
- Basic cost tracking and reporting
- Initial admin user seed script for first deployment

### 4.2 What's Not Included
- Multi-factor authentication (MFA)
- Open user registration (invite-only in Phase 1)
- Password reset via email (admin manually resets in Phase 1)
- Email automation for invitations (admin sends links manually)
- Predictive usage analytics
- Integration with other AWS cost optimization tools
- Automated scaling based on query load
- OAuth/SSO integration (Google, GitHub, etc.)

### 4.3 Future Considerations
- Automated email delivery for invitations
- Password reset flow with email verification
- Multi-factor authentication (TOTP)
- OAuth providers (Google, GitHub, Microsoft)
- Advanced analytics for usage patterns
- Integration with enterprise identity providers (SAML, LDAP)
- Automated scaling policies
- Multi-region deployment support
- Session management and audit logging

---

## Project Approach

### 5.1 Development Phases
**Phase 1: Foundation**
- Custom authentication library (JWT + DynamoDB)
- User invitation system
- Basic RDS auto-stop mechanism
- User restart flow

**Phase 2: Enhancement**
- Admin controls and user management UI
- Cost tracking dashboard
- Email automation for invitations
- Password reset flow

### 5.2 Timeline & Milestones
- Week 1-2: Custom authentication library implementation (JWT, DynamoDB, bcrypt)
- Week 3: User invitation system and admin user creation
- Week 4: RDS automation setup (Lambda, EventBridge)
- Week 5: Frontend integration (login, invite acceptance, restart modal)
- Week 6: Integration testing and security review
- Week 7: Deployment and monitoring setup

### 5.3 Key Assumptions
- AWS RDS, Lambda, DynamoDB, and EventBridge services available
- Vercel deployment environment stable
- Custom authentication library meets security requirements
- 60-minute inactivity threshold acceptable
- Admin can manually send invitation links initially (email automation in Phase 2)
- 7-day JWT expiration acceptable for users

### 5.4 Risks & Mitigations
- **Cold Start User Experience:** Comprehensive testing and user feedback collection
- **Custom Authentication Security:** Follow industry best practices (bcrypt, JWT standards), security review before deployment
- **DynamoDB Costs:** Monitor usage, expected <$1/month for 100 users
- **Password Reset Without Email:** Admin manually resets passwords in Phase 1, automated reset in Phase 2
- **Cost Estimation Accuracy:** Monitor actual vs. projected savings closely

---

## Appendix

### 6.1 Glossary
- **Cold Start:** Process of starting a stopped RDS instance, takes 60-90 seconds
- **JWT:** JSON Web Token for stateless authentication
- **POC:** Proof of Concept application

### 6.2 Related Documents
- See Technical SRS for implementation details
- Module 0007 Seed: Detailed technical requirements
- Authentication System Documentation: `/poc/docs/authentication-system.md`
