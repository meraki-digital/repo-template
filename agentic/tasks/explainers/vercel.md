# Vercel

**Category:** Deployment / Hosting Platform
**Official Docs:** https://vercel.com/docs
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

Vercel is a cloud platform for deploying frontend applications (React, Next.js, Vue) and serverless backend APIs. It provides automatic deployments from Git, global CDN distribution, and serverless function hosting—all with zero configuration.

Think of Vercel as Heroku for the modern web: push your code to GitHub, Vercel automatically builds and deploys it worldwide with HTTPS, preview deployments for each pull request, and instant rollbacks if needed.

---

## Why We're Using It In This Project

- **Existing deployment** - Project already uses Vercel for React frontend and FastAPI backend
- **Serverless backend** - FastAPI runs as Vercel serverless functions, no server management
- **Automatic deployments** - Push to `poc-dev` or `poc-prod` branch triggers deployment
- **Preview URLs** - Each pull request gets its own preview URL for testing
- **Global CDN** - Frontend assets served from edge locations for fast load times worldwide

---

## How We'll Use It

**Example 1: Vercel Configuration for Frontend**
```json
// vercel.json (in poc/frontend/)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Example 2: Deploying via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Link project to Vercel
cd poc/frontend
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Example 3: Environment Variables in Vercel**
```bash
# Add environment variable via CLI
vercel env add JWT_SECRET_KEY

# Or in Vercel Dashboard: Settings → Environment Variables
# Example variables for our project:
# VITE_API_URL=https://api.superscapes.com
# VITE_AWS_REGION=us-east-1
```

**Example 4: Automatic Deployment from GitHub**
```yaml
# .github/workflows/deploy.yml (optional - Vercel auto-deploys)
name: Deploy to Vercel
on:
  push:
    branches: [poc-dev, poc-prod]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Key Concepts

- **Project:** A single application deployed to Vercel (we have separate projects for frontend and backend)
- **Deployment:** Each Git push creates a new immutable deployment with unique URL
- **Production Deployment:** Deployment from main/prod branch; gets custom domain (dashboard.superscapes.com)
- **Preview Deployment:** Deployment from feature branch; gets unique URL for testing
- **Serverless Functions:** Backend code runs in isolated function instances (see vercel-serverless-functions.md)

---

## Alternatives We Considered

- **Netlify:** Similar to Vercel but less optimized for serverless backends
- **AWS Amplify:** More complex setup; Vercel is simpler for our stack
- **Heroku:** More expensive ($7/month per app); Vercel free tier is generous
- **Self-hosted on EC2:** Requires server management; Vercel is fully managed

---

## Getting Started

1. **Connect GitHub repository:**
   - Go to vercel.com → New Project
   - Import GitHub repository: `gmartin1965/ss-financial`
   - Configure root directory: `poc/frontend` for frontend project

2. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add environment variables:**
   - Settings → Environment Variables
   - Add `VITE_API_URL`, `JWT_SECRET_KEY`, etc.

4. **Deploy:**
   ```bash
   git push origin poc-dev  # Triggers automatic deployment
   ```

5. **Access deployment:**
   - Production: `https://ss-financial.vercel.app`
   - Preview: `https://ss-financial-<git-branch>.vercel.app`

---

## Common Patterns & Best Practices

1. **Use environment variables for config** - Never hardcode API URLs or secrets
2. **Enable preview deployments** - Test changes in isolation before merging to prod
3. **Configure custom domains** - Map `dashboard.superscapes.com` to production deployment
4. **Use `vercel.json` for rewrites** - Configure SPA routing to serve `index.html` for all routes
5. **Monitor analytics** - Track page views, performance, and errors in Vercel Dashboard

---

## Troubleshooting

**Issue 1:** Build fails with "Command not found: vite"
**Solution:** Ensure `vite` is in `package.json` dependencies, not devDependencies

**Issue 2:** 404 errors on page refresh for routes like `/dashboard`
**Solution:** Add rewrite rule in `vercel.json` to serve `index.html` for all paths

**Issue 3:** Environment variables not available in frontend
**Solution:** Prefix with `VITE_` for Vite projects (e.g., `VITE_API_URL`)

**Issue 4:** Deployment takes 10+ minutes
**Solution:** Check for large dependencies; optimize `node_modules` size

---

## Learning Resources

**Essential:**
- [Vercel Documentation](https://vercel.com/docs)
- [Deploying Vite Apps](https://vercel.com/docs/frameworks/vite)

**Recommended:**
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

**Community:**
- [Vercel Discord](https://vercel.com/discord)
- [Vercel GitHub Discussions](https://github.com/vercel/vercel/discussions)

---

**Related Technologies:**
- [Vite](vite.md) - Build tool used for React frontend
- [React 19](react-19.md) - Frontend framework deployed to Vercel
- [Vercel Serverless Functions](vercel-serverless-functions.md) - Backend API deployment
- [Environment Variables](environment-variables.md) - Configuration management on Vercel
