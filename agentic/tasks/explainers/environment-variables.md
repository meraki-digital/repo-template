# Environment Variables

**Category:** Configuration / Security
**Official Docs:** (Pattern - see platform-specific docs)
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

Environment variables are dynamic values stored outside your code that configure application behavior based on the environment (development, staging, production). They're especially important for storing secrets like API keys, database passwords, and JWT signing keys that should never be committed to Git.

Think of environment variables like switches and dials on a machine: the same code runs differently based on these external settings. Your local development uses different database credentials than production, but the code remains identical.

---

## Why We're Using It In This Project

- **Security** - JWT secrets, AWS credentials never committed to Git repository
- **Environment-specific config** - Different database URLs for local, staging, production
- **Deployment flexibility** - Change API URLs without rebuilding code
- **Team collaboration** - Each developer has their own local secrets without conflicts
- **Vercel integration** - Secrets managed in Vercel dashboard, injected at build/runtime

---

## How We'll Use It

**Example 1: Environment Variables in Python (FastAPI)**
```python
# poc/backend/config.py
import os

class Settings:
    # JWT Authentication
    JWT_SECRET_KEY: str = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_ALGORITHM: str = 'HS256'
    JWT_EXPIRATION_DAYS: int = 7

    # AWS Configuration
    AWS_REGION: str = os.getenv('AWS_REGION', 'us-east-1')
    AWS_ACCESS_KEY_ID: str = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY: str = os.getenv('AWS_SECRET_ACCESS_KEY')

    # DynamoDB
    DYNAMODB_AUTH_TABLE: str = os.getenv('DYNAMODB_AUTH_TABLE', 'auth-users')

    # RDS
    RDS_INSTANCE_ID: str = os.getenv('RDS_INSTANCE_ID', 'ss-financial-prod')

    # Environment
    ENVIRONMENT: str = os.getenv('ENVIRONMENT', 'development')

settings = Settings()
```

**Example 2: Environment Variables in React (Vite)**
```typescript
// poc/frontend/src/config.ts
export const config = {
  // Vite requires VITE_ prefix for frontend env vars
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  awsRegion: import.meta.env.VITE_AWS_REGION || 'us-east-1',
};

// Usage in components
import { config } from './config';

export async function login(email: string, password: string) {
  const response = await fetch(`${config.apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

**Example 3: Local Development (.env file)**
```bash
# poc/backend/.env (NEVER commit this file - add to .gitignore)
JWT_SECRET_KEY=super-secret-key-for-local-dev-only
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
DYNAMODB_AUTH_TABLE=auth-users-dev
RDS_INSTANCE_ID=ss-financial-dev
ENVIRONMENT=development
DATABASE_URL=postgresql://user:pass@localhost:5432/ssfinancial
```

**Example 4: Vercel Environment Variables (Production)**
```bash
# Set via Vercel Dashboard or CLI
vercel env add JWT_SECRET_KEY production
# Enter: <your-production-secret-key>

vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production
vercel env add VITE_API_URL production
# Enter: https://api.superscapes.com

# Or via Vercel Dashboard:
# Project Settings → Environment Variables
# Name: JWT_SECRET_KEY, Value: (secret), Environment: Production
```

**Example 5: .env.example Template (Commit This)**
```bash
# poc/backend/.env.example
# Copy this to .env and fill in real values

JWT_SECRET_KEY=your-jwt-secret-here
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
DYNAMODB_AUTH_TABLE=auth-users
RDS_INSTANCE_ID=ss-financial-prod
ENVIRONMENT=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

## Key Concepts

- **Secret:** Sensitive value that must not be exposed (API keys, passwords, JWT secrets)
- **Configuration:** Non-sensitive environment-specific values (API URLs, timeouts)
- **.env file:** Local file for storing environment variables during development (never committed)
- **.env.example:** Template showing required variables without actual values (safe to commit)
- **Injection:** Platform provides environment variables to running application (Vercel, AWS Lambda, Docker)

---

## Alternatives We Considered

- **Hardcoded values:** Security nightmare; secrets would be in Git history forever
- **Config files (config.json):** Better than hardcoding but still committed to Git
- **AWS Secrets Manager:** More secure but adds complexity; environment variables sufficient for our scale
- **HashiCorp Vault:** Enterprise secret management; overkill for this project

---

## Getting Started

1. **Create .env file locally:**
   ```bash
   cd poc/backend
   cp .env.example .env
   nano .env  # Edit with real values
   ```

2. **Add .env to .gitignore:**
   ```bash
   echo ".env" >> .gitignore
   ```

3. **Load environment variables (Python):**
   ```bash
   pip install python-dotenv
   ```

   ```python
   from dotenv import load_dotenv
   load_dotenv()  # Loads .env file

   import os
   secret = os.getenv('JWT_SECRET_KEY')
   ```

4. **Set variables in Vercel:**
   ```bash
   vercel env add JWT_SECRET_KEY
   ```

5. **Access in code:**
   ```python
   import os
   jwt_secret = os.getenv('JWT_SECRET_KEY')
   ```

---

## Common Patterns & Best Practices

1. **Never commit .env files** - Always add to `.gitignore`
2. **Provide .env.example** - Template shows teammates what variables are needed
3. **Use different values per environment** - Dev database != production database
4. **Validate required variables on startup** - Fail fast if JWT_SECRET_KEY missing
5. **Rotate secrets regularly** - Change JWT keys, AWS credentials periodically

---

## Troubleshooting

**Issue 1:** `KeyError: 'JWT_SECRET_KEY'` or `None` value
**Solution:** Environment variable not set. Check `.env` file exists and `load_dotenv()` called.

**Issue 2:** Vercel deployment fails with "Missing environment variable"
**Solution:** Add variable in Vercel Dashboard → Settings → Environment Variables for all environments (Production, Preview, Development)

**Issue 3:** Frontend can't access `process.env.API_URL`
**Solution:** Vite requires `VITE_` prefix: use `VITE_API_URL` and access via `import.meta.env.VITE_API_URL`

**Issue 4:** Accidentally committed .env file to Git
**Solution:** Remove from Git: `git rm --cached .env`, add to `.gitignore`, commit fix. Rotate all exposed secrets immediately.

---

## Learning Resources

**Essential:**
- [12-Factor App Config](https://12factor.net/config)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

**Recommended:**
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [python-dotenv Documentation](https://pypi.org/project/python-dotenv/)

**Community:**
- [r/webdev Security Discussions](https://www.reddit.com/r/webdev/)

---

**Related Technologies:**
- [Custom JWT Implementation](custom-jwt-implementation.md) - JWT_SECRET_KEY stored as environment variable
- [Vercel](vercel.md) - Platform managing production environment variables
- [AWS DynamoDB](aws-dynamodb.md) - AWS credentials stored as environment variables
- [FastAPI](fastapi.md) - Backend reads environment variables via `os.getenv()`
