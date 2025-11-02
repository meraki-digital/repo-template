# Prettier

**Category:** Frontend  
**Official Docs:** https://prettier.io/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

Prettier is an opinionated code formatter that automatically formats your code to ensure consistent style across your entire codebase. Think of it as an automated stylist that makes all your code look the same, eliminating debates about formatting preferences.

In simple terms: Prettier is like having a professional code formatter that instantly makes your JavaScript, TypeScript, and React code look clean and consistent, so you can focus on functionality instead of style.

---

## Why We're Using It In This Project

- **Consistency:** Eliminates formatting debates and ensures uniform code style
- **Productivity:** No time spent on manual formatting or style discussions
- **Integration:** Works seamlessly with ESLint and our development workflow
- **Large Codebase:** Maintains consistent formatting across our growing dashboard codebase
- **Tool Support:** Integrated into VS Code, CI/CD, and git hooks

---

## How We'll Use It

**Example 1: Configuration**
```json
// .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "printWidth": 80,
        "proseWrap": "preserve"
      }
    }
  ]
}
```

```json
// .prettierignore
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Generated files
*.generated.ts

# Config files
*.config.js
```

**Example 2: VS Code Integration**
```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**Example 3: Before and After Formatting**
```typescript
// ❌ Before Prettier
const formatFinancialData=(data)=>{
  const results=data.map(item=>{const{revenue,expenses}=item;return{profit:revenue-expenses,margin:((revenue-expenses)/revenue*100).toFixed(2)+' %'}})
  return results.filter(item=>item.profit>0).sort((a,b)=>b.profit-a.profit)
}

// ✅ After Prettier
const formatFinancialData = (data) => {
  const results = data.map((item) => {
    const { revenue, expenses } = item;
    return {
      profit: revenue - expenses,
      margin: ((revenue - expenses) / revenue * 100).toFixed(2) + ' %',
    };
  });
  return results.filter((item) => item.profit > 0).sort((a, b) => b.profit - a.profit);
};
```

**Example 4: Complex React Component Formatting**
```tsx
// ❌ Before Prettier
const FinancialChart=({data,loading,error,onRetry})=>{if(loading)return<div>Loading chart...</div>;if(error)return<div>Error: {error}<button onClick={onRetry}>Retry</button></div>;return(<div className="chart-container"><LineChart width={800}height={400}data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip formatter={(value)=>[`$${value.toLocaleString()}`,undefined]}/><Line type="monotone"dataKey="revenue"stroke="#10b981"strokeWidth={3}/></LineChart></div>);};

// ✅ After Prettier
const FinancialChart = ({ data, loading, error, onRetry }) => {
  if (loading) return <div>Loading chart...</div>;
  if (error)
    return (
      <div>
        Error: {error}
        <button onClick={onRetry}>Retry</button>
      </div>
    );

  return (
    <div className="chart-container">
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
      </LineChart>
    </div>
  );
};
```

---

## Key Concepts

- **Opinionated Formatting:** Prettier makes all formatting decisions for you
- **Language Support:** Formats JavaScript, TypeScript, JSX, JSON, and more
- **Configuration:** Minimal config options for customization
- **Integration:** Works with ESLint, VS Code, and CI/CD
- **Range Formatting:** Can format specific code ranges

---

## Alternatives We Considered

- **ESLint formatting rules:** Less comprehensive and can conflict
- **EditorConfig:** Basic formatting but not code-aware
- **Manual formatting:** Inconsistent and time-consuming
- **No formatting:** Leads to messy, hard-to-read code

---

## Getting Started

1. **Installation:** `npm install -D prettier`
2. **Configuration:** Create .prettierrc.json
3. **Run:** `npx prettier --write src/`
4. **VS Code:** Install Prettier extension
5. **Integration:** Add to package.json scripts

---

## Common Patterns & Best Practices

1. **Format on Save:** Enable in your editor
2. **Pre-commit Hooks:** Use Husky to format before commits
3. **CI Integration:** Check formatting in CI pipeline
4. **Ignore Files:** Use .prettierignore for generated files
5. **Team Consistency:** Share config across team

---

## Troubleshooting

**Issue 1: Conflicts with ESLint**  
**Solution:** Disable ESLint formatting rules

**Issue 2: Large files slow**  
**Solution:** Use .prettierignore for large generated files

**Issue 3: Different formats**  
**Solution:** Ensure team uses same Prettier version

---

## Learning Resources

**Essential:**
- [Prettier Documentation](https://prettier.io/docs/en/index.html) - Official docs
- [Options](https://prettier.io/docs/en/options.html) - Configuration options

**Recommended:**
- [Playground](https://prettier.io/playground/) - Try formatting online
- [Integrations](https://prettier.io/docs/en/editors.html) - Editor setup guides

**Community:**
- [Prettier GitHub](https://github.com/prettier/prettier) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/prettier) - Community solutions

---

**Related Technologies:**
- ESLint - Code quality (works with Prettier)
- TypeScript - Language being formatted
- VS Code - Editor with Prettier integration
- Husky - Git hooks for pre-commit formatting
