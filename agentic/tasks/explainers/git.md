# Git

**Category:** Development / Version Control
**Official Docs:** https://git-scm.com/doc
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

Git is a distributed version control system that tracks changes to your code over time. It lets multiple developers work on the same project simultaneously, experiment with new features in branches, and roll back mistakes—all while maintaining a complete history of every change.

Think of Git like a time machine for your code: every commit is a snapshot you can return to, branches are parallel universes where you can experiment safely, and merging combines the best changes from different timelines.

---

## Why We're Using It In This Project

- **Collaboration** - Multiple developers can work on authentication features simultaneously
- **Branch-based workflow** - Develop mod-0007 in `poc-dev-mod-0007` branch without affecting production
- **Code review** - Changes reviewed via pull requests before merging to `poc-dev`
- **Deployment automation** - Push to `poc-dev` or `poc-prod` triggers automatic Vercel deployment
- **History tracking** - See who changed authentication logic and when for debugging

---

## How We'll Use It

**Example 1: Branch-Based Workflow**
```bash
# Create feature branch for mod 0007
git checkout -b poc-dev-mod-0007

# Make changes to authentication code
git add poc/backend/api_routes/auth.py
git commit -m "feat: add JWT login endpoint"

# Push to remote
git push origin poc-dev-mod-0007

# Merge to poc-dev when ready
git checkout poc-dev
git merge poc-dev-mod-0007 --no-ff
git push origin poc-dev
```

**Example 2: Committing Authentication Changes**
```bash
# Stage specific files
git add poc/backend/api_routes/auth.py
git add poc/frontend/src/components/LoginForm.tsx

# Commit with conventional commit message
git commit -m "feat(auth): implement JWT-based login

- Add POST /api/auth/login endpoint
- Create LoginForm component with email/password inputs
- Store JWT token in localStorage on successful login"

# Push changes
git push
```

**Example 3: Viewing Change History**
```bash
# See commit history for authentication files
git log --oneline -- poc/backend/api_routes/auth.py

# See who last modified a line
git blame poc/backend/api_routes/auth.py

# Compare branches
git diff poc-dev..poc-dev-mod-0007
```

**Example 4: Undoing Changes**
```bash
# Undo uncommitted changes to a file
git checkout -- poc/backend/api_routes/auth.py

# Undo last commit but keep changes
git reset --soft HEAD~1

# Revert a specific commit (creates new commit)
git revert abc123
```

---

## Key Concepts

- **Repository (Repo):** Project directory tracked by Git (our `ss-financial` repo)
- **Commit:** Snapshot of code at a specific point in time with message describing changes
- **Branch:** Independent line of development (e.g., `poc-dev-mod-0007`)
- **Merge:** Combine changes from one branch into another
- **Remote:** Server hosting the repository (GitHub: `gmartin1965/ss-financial`)
- **Pull Request:** Request to merge changes from feature branch to main branch (with code review)

---

## Alternatives We Considered

- **Subversion (SVN):** Centralized version control; Git's distributed model is more flexible
- **Mercurial:** Similar to Git but less widely adopted
- **No version control:** Unthinkable for professional software development
- **Perforce:** Enterprise tool, overkill for our team size

---

## Getting Started

1. **Install Git:**
   ```bash
   # macOS
   brew install git

   # Verify installation
   git --version
   ```

2. **Configure Git:**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```

3. **Clone repository:**
   ```bash
   git clone https://github.com/gmartin1965/ss-financial.git
   cd ss-financial
   ```

4. **Create branch:**
   ```bash
   git checkout -b feature-branch
   ```

5. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin feature-branch
   ```

---

## Common Patterns & Best Practices

1. **Commit often** - Small, focused commits are easier to review and revert than large ones
2. **Write descriptive messages** - Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
3. **Use feature branches** - Never commit directly to `poc-dev` or `poc-prod`
4. **Pull before push** - Sync with remote before pushing: `git pull origin poc-dev`
5. **Review diffs before committing** - Use `git diff` to see exactly what changed

---

## Troubleshooting

**Issue 1:** `fatal: not a git repository`
**Solution:** You're not in a Git repository directory. Navigate to `ss-financial/` or run `git init`.

**Issue 2:** Merge conflicts when merging branches
**Solution:** Edit conflicted files (marked with `<<<<<<<`), choose which changes to keep, then `git add` and `git commit`.

**Issue 3:** Accidentally committed secrets (JWT_SECRET_KEY)
**Solution:** Remove from current commit: `git rm --cached .env`, add to `.gitignore`, commit fix. Use `git-secrets` or `gitleaks` to prevent.

**Issue 4:** `Your branch is ahead of 'origin/poc-dev' by 3 commits`
**Solution:** Push your commits: `git push origin poc-dev`

---

## Learning Resources

**Essential:**
- [Official Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book/en/v2)

**Recommended:**
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)

**Community:**
- [Stack Overflow Git Tag](https://stackoverflow.com/questions/tagged/git)
- [r/git on Reddit](https://www.reddit.com/r/git/)

---

**Related Technologies:**
- [GitHub](github.md) - Remote Git repository hosting and collaboration
- [Vercel](vercel.md) - Automatic deployments triggered by Git pushes
- [Environment Variables](environment-variables.md) - Managed separately from Git (in `.gitignore`)
