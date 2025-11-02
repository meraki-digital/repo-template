# Tech Stack: Authentication & RDS Management (Mod 0007)

**Project:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management
**Date:** 2025-11-02
**Version:** 1.0

---

## Overview

This document outlines the technology stack for implementing custom authentication with DynamoDB and automated RDS cost management. Each technology is marked with an explainer link for educational reference.

---

## Frontend Technologies

- **React 19** [📚](../../../tasks/explainers/react-19.md) - UI component framework for building the authentication interface and admin controls
- **TypeScript** [📚](../../../tasks/explainers/typescript-5.md) - Type-safe development for frontend code
- **Tailwind CSS** [📚](../../../tasks/explainers/tailwind-css-3.md) - Utility-first CSS framework for styling authentication forms and modals
- **Vite** [📚](../../../tasks/explainers/vite.md) - Fast development server and build tool for React application
- **React Router v6** [📚](../../../tasks/explainers/react-router-v6.md) - Client-side routing with protected routes for authenticated users
- **TanStack Query (React Query)** [📚](../../../tasks/explainers/tanstack-query.md) - Data fetching and state management for authentication status and RDS operations
- **Axios** [📚](../../../tasks/explainers/axios.md) - HTTP client for API requests with JWT token injection
- **date-fns** [📚](../../../tasks/explainers/date-fns.md) - Date manipulation for token expiration display

---

## Backend Technologies

- **FastAPI** [📚](../../../tasks/explainers/fastapi.md) - Python web framework for building authentication and RDS management APIs
- **Python 3.11** [📚](../../../tasks/explainers/python-311.md) - Programming language for backend development
- **Pydantic** [📚](../../../tasks/explainers/pydantic-v2.md) - Data validation and settings management using Python type annotations
- **SQLAlchemy** [📚](../../../tasks/explainers/sqlalchemy.md) - ORM for PostgreSQL database interactions (analytics data)
- **python-jose** [📚](../../../tasks/explainers/python-jose.md) - JWT creation and validation library for stateless authentication
- **bcrypt** [📚](../../../tasks/explainers/bcrypt.md) - Password hashing library for secure credential storage
- **boto3** [📚](../../../tasks/explainers/boto3.md) - AWS SDK for Python to interact with DynamoDB, RDS, and Lambda

---

## Database & Storage

- **PostgreSQL 15** [📚](../../../tasks/explainers/postgresql.md) - Relational database for analytics data (running on AWS RDS)
- **AWS RDS** [📚](../../../tasks/explainers/aws-rds.md) - Managed PostgreSQL service with auto-stop/start capabilities
- **AWS DynamoDB** [📚](../../../tasks/explainers/aws-dynamodb.md) - NoSQL database for authentication user storage (always-available)
- **DynamoDB Global Secondary Index (GSI)** [📚](../../../tasks/explainers/dynamodb-gsi.md) - Query users by email for login

---

## Authentication & Security

- **JWT (JSON Web Tokens)** [📚](../../../tasks/explainers/jwt.md) - Stateless authentication token standard
- **Custom JWT Implementation** [📚](../../../tasks/explainers/custom-jwt-implementation.md) - DynamoDB-backed authentication without vendor lock-in
- **bcrypt Password Hashing** [📚](../../../tasks/explainers/bcrypt.md) - Secure password storage with salt rounds
- **Invite-Only Registration** [📚](../../../tasks/explainers/invite-only-registration.md) - Admin-controlled user onboarding pattern
- **Role-Based Access Control (RBAC)** [📚](../../../tasks/explainers/rbac.md) - Permission system with admin, user, and viewer roles

---

## Cloud Services & Infrastructure

- **AWS Lambda** [📚](../../../tasks/explainers/aws-lambda.md) - Serverless functions for RDS start/stop operations
- **AWS EventBridge** [📚](../../../tasks/explainers/aws-eventbridge.md) - Scheduled event triggers for RDS auto-stop automation
- **AWS API Gateway** [📚](../../../tasks/explainers/aws-api-gateway.md) - HTTP API for invoking Lambda functions from frontend
- **Vercel** [📚](../../../tasks/explainers/vercel.md) - Hosting platform for React frontend and FastAPI serverless functions
- **Vercel Serverless Functions** [📚](../../../tasks/explainers/vercel-serverless-functions.md) - Backend API deployment without dedicated servers

---

## Development & Deployment

- **Git** [📚](../../../tasks/explainers/git.md) - Version control with branch-based workflow
- **GitHub** [📚](../../../tasks/explainers/github.md) - Code repository and collaboration platform
- **Environment Variables** [📚](../../../tasks/explainers/environment-variables.md) - Secure configuration management for JWT secrets and AWS credentials
- **AWS IAM Roles** [📚](../../../tasks/explainers/aws-iam-roles.md) - Least-privilege access for Lambda functions to control RDS

---

## Testing & Quality Assurance

- **pytest** [📚](../../../tasks/explainers/pytest.md) - Python testing framework for backend unit and integration tests
- **Vitest** [📚](../../../tasks/explainers/vitest.md) - Unit testing framework for React components
- **Postman** [📚](../../../tasks/explainers/postman.md) - API testing tool for authentication endpoints
- **Black** [📚](../../../tasks/explainers/black.md) - Python code formatter for consistent style

---

## Monitoring & Logging (Future Enhancement)

- **AWS CloudWatch** [📚](../../../tasks/explainers/aws-cloudwatch.md) - Log aggregation and monitoring for Lambda functions
- **CloudWatch Alarms** [📚](../../../tasks/explainers/cloudwatch-alarms.md) - Automated alerts for RDS auto-stop failures

---

## Summary

This tech stack combines:
- **Custom authentication** (JWT + DynamoDB) for vendor-independence and always-available user management
- **Serverless architecture** (Lambda + EventBridge) for cost-effective RDS automation
- **Modern frontend** (React 19 + TypeScript) for type-safe authentication UI
- **Secure patterns** (bcrypt + role-based access) for production-grade security

Total technologies: 35 components across frontend, backend, database, cloud services, and tooling.
