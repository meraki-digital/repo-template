# ESLint

**Category:** Frontend  
**Official Docs:** https://eslint.org/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

ESLint is a static code analysis tool for identifying problematic patterns in JavaScript and TypeScript code. Think of it as an automated code reviewer that checks your code for bugs, style issues, and best practices before you commit.

In simple terms: ESLint is like having a strict but helpful coding mentor that reviews your code as you write it, catching mistakes and enforcing consistent style across your entire dashboard codebase.

---

## Why We're Using It In This Project

- **Code Quality:** Catches potential bugs and anti-patterns early
- **Consistency:** Enforces uniform coding standards across the team
- **TypeScript Support:** Specialized rules for type-safe JavaScript
- **React Best Practices:** Rules tailored for React component development
- **CI/CD Integration:** Prevents poorly written code from being merged

---

## How We'll Use It

**Example 1: Configuration for React/TypeScript**
```json
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    // TypeScript specific
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",
    
    // React specific
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "react/prop-types": "off", // Using TypeScript for prop validation
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // Import sorting
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ],
    
    // Accessibility
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    
    // General code quality
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {}
    }
  },
  "ignorePatterns": ["dist/", "node_modules/", "*.config.js"]
}
```

**Example 2: Common Issues and Fixes**
```typescript
// ❌ Bad: ESLint errors
const MyComponent = ({ data }: { data: any }) => { // @typescript-eslint/no-explicit-any
  console.log('Data received:', data); // no-console
  
  const handleClick = () => {
    var count = 0; // no-var
    count = count + 1; // prefer-const
  };
  
  return (
    <button onClick={handleClick}> // jsx-a11y/click-events-have-key-events
      Click me
    </button>
  );
};

// ✅ Good: ESLint compliant
interface MyComponentProps {
  data: FinancialData[];
}

const MyComponent = ({ data }: MyComponentProps) => {
  const handleClick = () => {
    const count = 0; // Use const
    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Data received:', data);
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()} // Add keyboard handler
      type="button"
    >
      Click me
    </button>
  );
};
```

**Example 3: Integration with VS Code and CI/CD**
```json
// .vscode/settings.json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true
}
```

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run type-check
```

---

## Key Concepts

- **Rules:** Configurable checks for different code patterns
- **Plugins:** Extend ESLint with framework-specific rules
- **Configurations:** Pre-made rule sets for common tech stacks
- **Auto-fix:** Automatically fix many linting issues
- **Ignore Patterns:** Exclude files or directories from linting

---

## Alternatives We Considered

- **TSLint:** Deprecated in favor of ESLint for TypeScript
- **Prettier only:** Formatting but no code quality checks
- **StandardJS:** Opinionated but less flexible
- **No linting:** Would allow inconsistent, buggy code

---

## Getting Started

1. **Installation:** `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`
2. **Initialize:** `npx eslint --init`
3. **Configure:** Create .eslintrc.json with rules
4. **Run:** `npx eslint src/` or add to package.json scripts
5. **Fix:** `npx eslint src/ --fix`

---

## Common Patterns & Best Practices

1. **Extend Configurations:** Use established configs as base
2. **Rule Severity:** Use error for must-fix, warn for should-fix
3. **Team Consistency:** Share config across team
4. **CI Integration:** Fail builds on lint errors
5. **Auto-fix:** Enable fix-on-save in editor

---

## Troubleshooting

**Issue 1: False positives**  
**Solution:** Disable specific rules or use eslint-disable comments

**Issue 2: Performance issues**  
**Solution:** Use ignore patterns and cache

**Issue 3: Rule conflicts**  
**Solution:** Adjust rule severity or disable conflicting rules

---

## Learning Resources

**Essential:**
- [ESLint Documentation](https://eslint.org/docs/user-guide/) - Official docs
- [Rules Reference](https://eslint.org/docs/rules/) - All built-in rules

**Recommended:**
- [Configuring ESLint](https://eslint.org/docs/user-guide/configuring/) - Setup guide
- [Shareable Configs](https://eslint.org/docs/developer-guide/shareable-configs) - Community configs

**Community:**
- [ESLint GitHub](https://github.com/eslint/eslint) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/eslint) - Community solutions

---

**Related Technologies:**
- TypeScript - Language being linted
- React - Framework-specific rules
- Prettier - Code formatting (works with ESLint)
- Husky - Git hooks for pre-commit linting
