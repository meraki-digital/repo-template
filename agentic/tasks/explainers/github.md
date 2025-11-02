# GitHub

**Category:** Development / Collaboration Platform
**Official Docs:** https://docs.github.com
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

GitHub is a web-based platform for hosting Git repositories with collaboration features like pull requests, code review, issue tracking, and CI/CD automation. It's where teams store code, discuss changes, track bugs, and manage projects.

Think of GitHub as a social network for code: Git manages version history locally, but GitHub provides the central hub where everyone syncs their work, reviews each other's changes, and coordinates development.

---

## Why We're Using It In This Project

- **Central repository** - Single source of truth for all code at `gmartin1965/ss-financial`
- **Code review via pull requests** - Authentication changes reviewed before merging to `poc-dev`
- **Issue tracking** - Track bugs, feature requests, and mod 0007 tasks
- **Vercel integration** - Pushes to `poc-dev` or `poc-prod` trigger automatic deployments
- **Collaboration** - Team members can fork, branch, and contribute without conflicts

---

## How We'll Use It

**Example 1: Creating Pull Request for Mod 0007**
```bash
# Create and push feature branch
git checkout -b poc-dev-mod-0007
# ... make changes ...
git push origin poc-dev-mod-0007

# On GitHub:
# 1. Navigate to repository: github.com/gmartin1965/ss-financial
# 2. Click "Compare & pull request"
# 3. Base: poc-dev ← Compare: poc-dev-mod-0007
# 4. Title: "feat(auth): JWT authentication system"
# 5. Description: Link to mod 0007 docs, list changes
# 6. Request review from team
# 7. Merge after approval
```

**Example 2: GitHub Issue for Bug Tracking**
```markdown
# On GitHub Issues tab:
Title: "JWT tokens expire immediately after login"

**Description:**
Users report being logged out immediately after successful login.

**Steps to Reproduce:**
1. POST /api/auth/login with valid credentials
2. Receive JWT token
3. Make authenticated request to /api/auth/me
4. Receive 401 Unauthorized

**Expected:** Token should be valid for 7 days
**Actual:** Token invalid after first request

**Environment:** Production (poc-prod branch)
**Labels:** bug, authentication, high-priority
```

**Example 3: Branch Protection Rules**
```
# Repository Settings → Branches → Add rule

Branch name pattern: poc-prod

✅ Require a pull request before merging
✅ Require approvals (1)
✅ Dismiss stale reviews when new commits pushed
✅ Require status checks to pass before merging
   - vercel-build
   - tests
✅ Require linear history
✅ Include administrators
```

**Example 4: GitHub Actions for Testing (Future)**
```yaml
# .github/workflows/test.yml
name: Run Tests

on:
  pull_request:
    branches: [poc-dev, poc-prod]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd poc/backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd poc/backend
          pytest
```

---

## Key Concepts

- **Repository:** Project hosted on GitHub (`gmartin1965/ss-financial`)
- **Fork:** Personal copy of repository for independent development
- **Pull Request (PR):** Proposal to merge changes from one branch to another with code review
- **Issue:** Bug report, feature request, or discussion thread
- **Actions:** CI/CD automation (run tests, deploy on push, etc.)
- **Collaborators:** Team members with write access to repository

---

## Alternatives We Considered

- **GitLab:** Self-hosted option with similar features, but GitHub has better ecosystem
- **Bitbucket:** Good Atlassian integration but smaller community
- **Azure DevOps:** Enterprise-focused, more complex than needed
- **Self-hosted Git server:** Requires maintenance; GitHub is fully managed

---

## Getting Started

1. **Access repository:**
   - URL: https://github.com/gmartin1965/ss-financial
   - Clone: `git clone https://github.com/gmartin1965/ss-financial.git`

2. **Create personal access token:**
   - Settings → Developer settings → Personal access tokens
   - Generate token with `repo` scope
   - Use instead of password for Git operations

3. **Create issue:**
   - Repository → Issues → New issue
   - Add title, description, labels, assignees

4. **Create pull request:**
   - Push branch: `git push origin feature-branch`
   - GitHub → Pull requests → New pull request
   - Select base and compare branches

5. **Review pull request:**
   - Files changed tab → Review changes
   - Add comments, approve, or request changes

---

## Common Patterns & Best Practices

1. **Use pull requests for all changes** - Never push directly to `poc-dev` or `poc-prod`
2. **Write descriptive PR descriptions** - Link to issues, explain what changed and why
3. **Request code review** - At least one approval before merging
4. **Link PRs to issues** - Use "Closes #123" in PR description to auto-close issue
5. **Keep PRs small** - Easier to review 200 lines than 2000 lines

---

## Troubleshooting

**Issue 1:** `Permission denied (publickey)` when pushing
**Solution:** Set up SSH key or use personal access token instead of password

**Issue 2:** Can't create pull request
**Solution:** Ensure you've pushed your branch to GitHub: `git push origin your-branch`

**Issue 3:** Merge conflicts in pull request
**Solution:** Sync with base branch: `git pull origin poc-dev`, resolve conflicts, push again

**Issue 4:** Vercel deployment not triggered by push
**Solution:** Check Vercel dashboard integration settings; may need to reconnect GitHub app

---

## Learning Resources

**Essential:**
- [GitHub Docs](https://docs.github.com)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

**Recommended:**
- [Pull Request Best Practices](https://github.com/blog/1943-how-to-write-the-perfect-pull-request)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

**Community:**
- [GitHub Community Forum](https://github.community/)
- [GitHub Skills](https://skills.github.com/)

---

**Related Technologies:**
- [Git](git.md) - Version control system underlying GitHub
- [Vercel](vercel.md) - Deployment platform integrated with GitHub
- [Environment Variables](environment-variables.md) - Secrets managed in GitHub and Vercel, not committed to repo
