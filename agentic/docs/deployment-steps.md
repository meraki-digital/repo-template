# Vercel Deployment Steps - POC

## Branch Strategy
- **poc-dev** → Development environment on Vercel
- **poc-main** → Production environment on Vercel
- Both branches deploy independently to separate Vercel projects

## Prerequisites
- Install Vercel CLI: `npm install -g vercel`
- Login: `vercel login`

## Setup Two Vercel Projects

You'll create **4 Vercel projects** total:
1. POC Backend Dev (linked to `poc-dev` branch)
2. POC Backend Prod (linked to `poc-main` branch)
3. POC Frontend Dev (linked to `poc-dev` branch)
4. POC Frontend Prod (linked to `poc-main` branch)

---

## POC Backend Deployment

### 1. Deploy Backend Dev (poc-dev branch)

```bash
git checkout poc-dev
cd poc/backend
vercel --prod
```

When prompted:
- **Project name:** `ss-financial-poc-backend-dev`
- **Which scope:** Select your account
- **Link to existing project:** No
- **Project name:** Confirm
- **Directory:** `poc/backend`
- **Override settings:** No

**Configure Environment Variables in Vercel Dashboard:**
- Go to the project settings in Vercel
- Navigate to Settings → Environment Variables
- Add the following for **Production**:
  - `DATABASE_URL` - Your AWS RDS PostgreSQL connection string
  - `OPENAI_API_KEY` - Your OpenAI API key
  - `ENVIRONMENT` - Set to `development`

**Link Branch to Production:**
- Go to Settings → Git
- Set Production Branch to: `poc-dev`

**Note the backend URL** (e.g., `https://ss-financial-poc-backend-dev.vercel.app`)

### 2. Deploy Backend Prod (poc-main branch)

```bash
git checkout poc-main
cd poc/backend
vercel --prod
```

When prompted:
- **Project name:** `ss-financial-poc-backend-prod`
- Link to existing project: No
- Follow same steps as dev

**Configure Environment Variables:**
- Same as dev environment
- Set `ENVIRONMENT` to `production`

**Link Branch to Production:**
- Settings → Git
- Set Production Branch to: `poc-main`

**Note the backend URL** (e.g., `https://ss-financial-poc-backend-prod.vercel.app`)

---

## POC Frontend Deployment

### 3. Deploy Frontend Dev (poc-dev branch)

**Update Environment Variable:**
```bash
# Edit poc/frontend/.env.production
# Set VITE_API_URL to your dev backend URL
VITE_API_URL=https://ss-financial-poc-backend-dev.vercel.app
```

```bash
git checkout poc-dev
git add poc/frontend/.env.production
git commit -m "Update API URL for dev deployment"
cd poc/frontend
vercel --prod
```

When prompted:
- **Project name:** `ss-financial-poc-frontend-dev`
- **Directory:** `poc/frontend`

**Link Branch to Production:**
- Settings → Git
- Set Production Branch to: `poc-dev`

### 4. Deploy Frontend Prod (poc-main branch)

```bash
git checkout poc-main
# Merge poc-dev when ready
git merge poc-dev

# Update .env.production with prod backend URL
# Then deploy
cd poc/frontend
vercel --prod
```

When prompted:
- **Project name:** `ss-financial-poc-frontend-prod`

**Link Branch to Production:**
- Settings → Git  
- Set Production Branch to: `poc-main`

---

## Post-Deployment Configuration

### Update RDS Security Group
1. Get Vercel IP ranges from: https://vercel.com/docs/concepts/edge-network/regions
2. Add Vercel IPs to your RDS security group inbound rules (port 5432)
3. Alternatively, allow all IPs (0.0.0.0/0) for POC only - **NOT recommended for production**

### Update Backend CORS
Ensure your FastAPI backend CORS configuration allows your frontend domains:
```python
# In poc/backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ss-financial-poc-frontend-dev.vercel.app",
        "https://ss-financial-poc-frontend-prod.vercel.app",
        "http://localhost:5173"  # for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Test the Deployments

**Dev Environment:**
- Visit your frontend dev URL
- Check dashboard loads
- Test AI query interface

**Prod Environment:**
- Visit your frontend prod URL
- Same tests as dev

---

## Workflow

1. **Development:** Work on `poc-0000` or feature branches
2. **Test:** Merge to `poc-dev` → auto-deploys to dev environment
3. **Production:** Merge `poc-dev` to `poc-main` → auto-deploys to prod environment

---

## Troubleshooting

- **CORS Issues:** Ensure backend allows frontend domain in CORS settings
- **Database Connection:** Verify RDS security group allows Vercel IPs
- **Environment Variables:** Double-check all variables are set in Vercel dashboard
- **Build Logs:** Check Vercel deployment logs for errors
- **Backend 404:** Ensure `vercel.json` is in the backend directory
