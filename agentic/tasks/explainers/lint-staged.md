# lint-staged

**Category:** Frontend  
**Official Docs:** https://github.com/okonet/lint-staged  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

lint-staged is a tool that runs linters against staged git files and prevents adding files with linting errors to the commit. Think of it as a smart filter that only checks the code you're actually trying to commit, making pre-commit hooks fast and efficient.

In simple terms: lint-staged is like a quality control inspector that examines only the code changes you're about to commit, ensuring your commits are clean without slowing down the entire development process.

---

## Why We're Using It In This Project

- **Performance:** Only lints staged files, not entire codebase
- **Fast Commits:** Pre-commit checks complete quickly
- **Focused Checks:** Catches issues in code you're actually committing
- **Integration:** Works seamlessly with Husky git hooks
- **Flexibility:** Different rules for different file types

---

## How We'll Use It

**Example 1: Basic Configuration**
```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ],
    "*.{ts,tsx}": [
      "tsc --noEmit --skipLibCheck"
    ]
  }
}
```

**Example 2: Advanced Configuration with Functions**
```javascript
// .lintstagedrc.js
module.exports = {
  '*.{js,jsx,ts,tsx}': (filenames) => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
    // Run tests related to changed files
    `vitest related --run ${filenames.join(' ')}`
  ],
  
  '*.{json,md,yml,yaml}': (filenames) => [
    `prettier --write ${filenames.join(' ')}`,
    // Check for JSON syntax errors
    filenames.filter(f => f.endsWith('.json')).length > 0 
      ? `node -e "JSON.parse(require('fs').readFileSync('${filenames.filter(f => f.endsWith('.json')).join('\', require(\'fs\').readFileSync(\'')}', 'utf8'))"` 
      : null
  ].filter(Boolean),
  
  '*.{ts,tsx}': () => [
    'tsc --noEmit --skipLibCheck',
    // Check for unused exports
    'ts-unused-exports'
  ]
};
```

**Example 3: Integration with Husky**
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```bash
# .husky/post-commit (optional - for additional checks)
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run full test suite on commits to main branch
if [ "$(git rev-parse --abbrev-ref HEAD)" = "main" ]; then
  npm run test:ci
fi
```

---

## Key Concepts

- **Staged Files:** Only checks files added to git staging area
- **Pattern Matching:** Different rules for different file types
- **Command Arrays:** Multiple commands per file type
- **Function Configuration:** Dynamic command generation
- **Exit Codes:** Non-zero exit prevents commit

---

## Alternatives We Considered

- **Lint entire codebase:** Slow and unnecessary
- **Manual pre-commit checks:** Error-prone
- **CI/CD only:** No early feedback
- **No staging checks:** Allows bad code commits

---

## Getting Started

1. **Installation:** `npm install -D lint-staged`
2. **Configuration:** Add to package.json or create .lintstagedrc
3. **Patterns:** Define file patterns and commands
4. **Test:** Stage files and try to commit
5. **Debug:** Use --verbose flag for troubleshooting

---

## Common Patterns & Best Practices

1. **Auto-fix:** Use --fix flags where available
2. **Logical Grouping:** Group similar file types
3. **Performance:** Keep commands fast
4. **Clear Output:** Commands should be verbose
5. **Fallbacks:** Handle cases where no files match

---

## Troubleshooting

**Issue 1: Commands not running**  
**Solution:** Check file patterns and staging

**Issue 2: Slow performance**  
**Solution:** Optimize command execution

**Issue 3: Pattern matching**  
**Solution:** Test patterns with lint-staged --verbose

---

## Learning Resources

**Essential:**
- [lint-staged Documentation](https://github.com/okonet/lint-staged) - Official docs
- [Configuration](https://github.com/okonet/lint-staged#configuration) - Setup guide

**Recommended:**
- [Examples](https://github.com/okonet/lint-staged#examples) - Common configurations
- [Recipes](https://github.com/okonet/lint-staged#recipes) - Advanced usage

**Community:**
- [lint-staged GitHub](https://github.com/okonet/lint-staged) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/lint-staged) - Community solutions

---

**Related Technologies:**
- Husky - Git hooks framework
- ESLint - Code quality tool
- Prettier - Code formatter
- Git - Version control system
