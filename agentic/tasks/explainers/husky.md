# Husky

**Category:** Frontend  
**Official Docs:** https://typicode.github.io/husky/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

Husky is a tool that makes it easy to use Git hooks to run scripts before commits, pushes, and other Git operations. Think of it as a quality gatekeeper that automatically runs your linting, testing, and formatting checks before code gets committed to your repository.

In simple terms: Husky is like having a strict code reviewer that checks your work every time you try to commit code, ensuring only clean, tested, and properly formatted code makes it into your financial dashboard repository.

---

## Why We're Using It In This Project

- **Quality Gates:** Prevents buggy or poorly formatted code from being committed
- **Automated Checks:** Runs linting, formatting, and tests automatically
- **Team Consistency:** Ensures all team members follow the same quality standards
- **Early Feedback:** Catches issues immediately rather than during CI/CD
- **Git Integration:** Works seamlessly with Git workflow

---

## How We'll Use It

**Example 1: Setting Up Husky**
```bash
# Initialize Husky
npx husky-init && npm install

# This creates:
# - .husky/ directory
# - pre-commit hook
# - package.json script
```

```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src/ --ext .ts,.tsx",
    "lint:fix": "eslint src/ --ext .ts,.tsx --fix",
    "format": "prettier --write src/",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

**Example 2: Pre-commit Hook with lint-staged**
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```json
// package.json (lint-staged configuration)
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "tsc --noEmit --skipLibCheck"
    ],
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**Example 3: Additional Git Hooks**
```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run test
npm run type-check
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

```bash
# .husky/post-merge
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Install new dependencies if package.json changed
if git diff HEAD@{1} --name-only | grep -q "package.json\|package-lock.json"; then
  echo "📦 Package dependencies changed, installing..."
  npm install
fi
```

---

## Key Concepts

- **Git Hooks:** Scripts that run at specific Git events
- **Pre-commit:** Runs before code is committed
- **Pre-push:** Runs before code is pushed
- **Lint-staged:** Runs linters only on staged files
- **Hook Scripts:** Shell scripts in .husky/ directory

---

## Alternatives We Considered

- **Manual hooks:** Error-prone and hard to share
- **Git hooks directly:** Not version controlled
- **CI/CD only:** No early feedback
- **No hooks:** Allows bad code to be committed

---

## Getting Started

1. **Installation:** `npx husky-init && npm install`
2. **Configure:** Edit .husky/pre-commit script
3. **Add lint-staged:** `npm install -D lint-staged`
4. **Test:** Make a commit to trigger hooks
5. **Share:** Hooks are version controlled

---

## Common Patterns & Best Practices

1. **Fast Checks:** Keep pre-commit hooks quick
2. **Use lint-staged:** Only check changed files
3. **Clear Messages:** Make hook failures obvious
4. **CI Integration:** Don't duplicate CI checks
5. **Team Agreement:** All team members must use hooks

---

## Troubleshooting

**Issue 1: Hooks not running**  
**Solution:** Ensure husky is installed and hooks are executable

**Issue 2: Slow commits**  
**Solution:** Optimize lint-staged configuration

**Issue 3: Windows issues**  
**Solution:** Use cross-platform scripts

---

## Learning Resources

**Essential:**
- [Husky Documentation](https://typicode.github.io/husky/) - Official docs
- [Getting Started](https://typicode.github.io/husky/get-started.html) - Setup guide

**Recommended:**
- [lint-staged](https://github.com/okonet/lint-staged) - Staged files linter
- [Husky Examples](https://typicode.github.io/husky/recipes.html) - Common setups

**Community:**
- [Husky GitHub](https://github.com/typicode/husky) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/husky) - Community solutions

---

**Related Technologies:**
- ESLint - Code quality checks
- Prettier - Code formatting
- lint-staged - Runs linters on staged files
- Git - Version control system
