# Vercel Serverless Functions

**Category:** Backend / Serverless
**Official Docs:** https://vercel.com/docs/concepts/functions/serverless-functions
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

Vercel Serverless Functions are small, single-purpose functions that run in response to HTTP requests without managing servers. When you deploy Python or Node.js files to Vercel's `api/` directory, they automatically become HTTP endpoints that scale on-demand.

Think of it like AWS Lambda but tightly integrated with your frontend deployment. Each API route in your `/api` folder becomes a serverless endpoint that runs only when called, billed per execution rather than uptime.

---

## Why We're Using It In This Project

- **FastAPI deployment** - Run our Python FastAPI backend as serverless functions without managing servers
- **Cost efficiency** - Only pay for execution time, not 24/7 server costs
- **Auto-scaling** - Handle traffic spikes (multiple users logging in) automatically
- **Same deployment workflow** - Frontend and backend deploy together from single Git push
- **Zero configuration** - Vercel automatically detects Python files and creates endpoints

---

## How We'll Use It

**Example 1: FastAPI Entry Point (vercel.json)**
```json
// poc/backend/vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python",
      "config": {
        "maxLambdaSize": "15mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ],
  "env": {
    "JWT_SECRET_KEY": "@jwt-secret",
    "AWS_ACCESS_KEY_ID": "@aws-access-key",
    "AWS_SECRET_ACCESS_KEY": "@aws-secret-key"
  }
}
```

**Example 2: FastAPI Application (main.py)**
```python
# poc/backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_routes import auth, rds

app = FastAPI(title="SS Financial API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://dashboard.superscapes.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth")
app.include_router(rds.router, prefix="/api/rds")

@app.get("/")
def root():
    return {"status": "API running on Vercel Serverless"}

# Vercel handler (required)
handler = app
```

**Example 3: Authentication Endpoint**
```python
# poc/backend/api_routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import boto3
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
import os

router = APIRouter()

JWT_SECRET = os.getenv('JWT_SECRET_KEY')
dynamodb = boto3.client('dynamodb', region_name='us-east-1')

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post('/login')
def login(request: LoginRequest):
    # Query DynamoDB for user
    response = dynamodb.query(
        TableName='auth-users',
        IndexName='email-index',
        KeyConditionExpression='email = :email',
        ExpressionAttributeValues={':email': {'S': request.email}}
    )

    if response['Count'] == 0:
        raise HTTPException(status_code=401, detail='Invalid credentials')

    user = response['Items'][0]

    # Verify password
    if not bcrypt.checkpw(request.password.encode(), user['password_hash']['S'].encode()):
        raise HTTPException(status_code=401, detail='Invalid credentials')

    # Generate JWT
    token = jwt.encode(
        {
            'user_id': user['user_id']['S'],
            'email': user['email']['S'],
            'role': user['role']['S'],
            'exp': datetime.utcnow() + timedelta(days=7)
        },
        JWT_SECRET,
        algorithm='HS256'
    )

    return {'token': token, 'user': {'email': user['email']['S'], 'role': user['role']['S']}}
```

**Example 4: Deploying to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd poc/backend
vercel

# Deploy to production
vercel --prod
```

---

## Key Concepts

- **Handler:** Entry point for serverless function (our `app` FastAPI instance)
- **Cold Start:** Initial request delay (~1-3 seconds) when function hasn't run recently
- **Execution Limit:** 10-second timeout on Hobby plan, 60 seconds on Pro
- **Region:** Functions run in closest region to user (automatic global deployment)
- **Environment Variables:** Secrets (JWT_SECRET, AWS keys) stored in Vercel dashboard

---

## Alternatives We Considered

- **AWS Lambda + API Gateway:** More powerful but requires separate deployment and configuration
- **Traditional server (EC2, Heroku):** Always-on costs, requires maintenance
- **Netlify Functions:** Similar but FastAPI support is better on Vercel
- **Google Cloud Functions:** Comparable but less integrated with our frontend deployment

---

## Getting Started

1. **Create FastAPI app:**
   ```python
   # main.py
   from fastapi import FastAPI
   app = FastAPI()

   @app.get("/api/hello")
   def hello():
       return {"message": "Hello from Vercel"}

   handler = app  # Required for Vercel
   ```

2. **Create vercel.json:**
   ```json
   {
     "builds": [{"src": "main.py", "use": "@vercel/python"}],
     "routes": [{"src": "/(.*)", "dest": "main.py"}]
   }
   ```

3. **Create requirements.txt:**
   ```
   fastapi==0.104.1
   uvicorn==0.24.0
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Test endpoint:**
   ```bash
   curl https://your-project.vercel.app/api/hello
   ```

---

## Common Patterns & Best Practices

1. **Keep functions small** - Avoid large dependencies; Vercel has 50MB size limit
2. **Use environment variables** - Store secrets in Vercel dashboard, not code
3. **Handle cold starts** - Accept 1-3 second delay on first request after idle
4. **Optimize imports** - Import only what you need to reduce cold start time
5. **Monitor logs** - Check Vercel dashboard for function execution logs and errors

---

## Troubleshooting

**Issue 1:** `500 Internal Server Error` on deployment
**Solution:** Check Vercel function logs in dashboard; common issues: missing dependencies, environment variables

**Issue 2:** `This Serverless Function has crashed` error
**Solution:** Function exceeded 50MB size limit; remove pandas or large dependencies

**Issue 3:** Slow cold starts (5+ seconds)
**Solution:** Optimize imports; move heavy dependencies to Lambda if necessary

**Issue 4:** `FUNCTION_INVOCATION_TIMEOUT` error
**Solution:** Function exceeded 10-second limit; upgrade to Pro plan for 60-second timeout or optimize code

---

## Learning Resources

**Essential:**
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Python on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/python)

**Recommended:**
- [FastAPI on Vercel Tutorial](https://vercel.com/guides/deploying-fastapi-with-vercel)
- [Vercel Limits](https://vercel.com/docs/concepts/limits/overview)

**Community:**
- [Vercel Discord](https://vercel.com/discord)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Backend framework running as serverless functions
- [Vercel](vercel.md) - Platform hosting the serverless functions
- [AWS Lambda](aws-lambda.md) - Similar serverless compute for AWS-specific operations
- [Environment Variables](environment-variables.md) - Configuration for serverless functions
- [boto3](boto3.md) - AWS SDK used within Vercel functions
