# react-syntax-highlighter

**Category:** Frontend / UI Library  
**Official Docs:** https://github.com/react-syntax-highlighter/react-syntax-highlighter  
**Used In:** Module 0001 - AI Question Library & Response Format Enhancement

---

## What Is It?

react-syntax-highlighter is a React component library that displays code with syntax highlighting - meaning it color-codes different parts of code (keywords, strings, numbers, etc.) to make it more readable, just like your code editor does.

Think of it like the difference between reading plain black text versus color-coded text in VS Code. Keywords are blue, strings are green, functions are purple - it's easier to scan and understand at a glance.

For our project, we're using it specifically to display SQL queries in a modal. When a Finance Analyst wants to see the SQL query the AI generated, we'll show it with proper syntax highlighting so they can quickly understand the query structure without squinting at plain text.

---

## Why We're Using It In This Project

- **SQL transparency requirement:** Finance Analysts want to verify the SQL queries AI generates, and syntax highlighting makes SQL dramatically more readable
- **Professional appearance:** Color-coded SQL looks polished and professional versus plain monospace text
- **React-native:** Works seamlessly with our React frontend (no DOM manipulation hacks)
- **Zero configuration:** Works out-of-the-box with PostgreSQL syntax support
- **Lightweight:** Small bundle size impact (~50KB) for significant UX improvement
- **Widely used:** 4M+ weekly downloads, battle-tested, actively maintained

---

## How We'll Use It

**Example 1: SQL Display Modal**

When user clicks "Show SQL" button in an AI response, we'll display the generated SQL:

```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SQLDisplayModal({ sql, onClose }) {
  return (
    <div className="modal">
      <h2>Generated SQL Query</h2>
      
      <SyntaxHighlighter 
        language="sql" 
        style={vscDarkPlus}
        customStyle={{
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px'
        }}
      >
        {sql}
      </SyntaxHighlighter>
      
      <button onClick={() => navigator.clipboard.writeText(sql)}>
        Copy SQL
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

**Example 2: Customizing Colors for Our Theme**

We'll match Module 0010's color scheme (Primary: #1E3A8A blue):

```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const customStyle = {
  'keyword': { color: '#1E3A8A' },      // SELECT, FROM, WHERE (our primary blue)
  'function': { color: '#7C3AED' },     // SUM, COUNT, AVG (purple)
  'string': { color: '#059669' },       // 'values' (green)
  'number': { color: '#EA580C' },       // 123 (orange)
  'operator': { color: '#6B7280' },     // =, <, > (gray)
};

<SyntaxHighlighter 
  language="sql"
  customStyle={customStyle}
>
  {sqlQuery}
</SyntaxHighlighter>
```

---

## Key Concepts

- **Syntax Highlighting:** Color-coding text based on programming language rules (keywords, strings, functions, etc.)
- **Prism vs Highlight.js:** Two rendering engines; Prism is lighter and recommended for our use
- **Language Support:** Supports 100+ languages including SQL, Python, JavaScript - we only need SQL
- **Themes:** Pre-built color schemes (vscDarkPlus, nightOwl, etc.) or custom styling
- **Code vs Component:** Use Prism export (lighter) instead of full bundle (saves 200KB+)

---

## Alternatives We Considered

- **Prism.js directly:** Requires manual DOM manipulation, not React-friendly, harder to integrate
- **Highlight.js:** Larger bundle size, less modern, older library
- **Monaco Editor:** Full VS Code editor - massive overkill (5MB+) just to display read-only SQL
- **Custom CSS classes:** Could manually color-code SQL with regex, but reinventing the wheel and fragile

**Why react-syntax-highlighter won:** Perfect fit - React component, PostgreSQL support, small bundle, easy setup, widely used.

---

## Getting Started

1. **Install the package:**
   ```bash
   npm install react-syntax-highlighter
   npm install --save-dev @types/react-syntax-highlighter
   ```

2. **Import and use:**
   ```tsx
   import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
   import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
   
   function MyComponent({ code }) {
     return (
       <SyntaxHighlighter language="sql" style={vscDarkPlus}>
         {code}
       </SyntaxHighlighter>
     );
   }
   ```

3. **Customize if needed:**
   ```tsx
   <SyntaxHighlighter 
     language="sql"
     style={vscDarkPlus}
     showLineNumbers={false}  // We don't need line numbers
     wrapLines={true}         // Wrap long SQL lines
     customStyle={{
       fontSize: '14px',
       borderRadius: '8px'
     }}
   >
     {sqlCode}
   </SyntaxHighlighter>
   ```

---

## Common Patterns & Best Practices

1. **Use Prism export, not default:** Import from `'react-syntax-highlighter/dist/esm/languages/prism/sql'` to reduce bundle size (only loads SQL syntax, not 100+ languages)

2. **Async loading for performance:** If bundle size is a concern, lazy load the component:
   ```tsx
   const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));
   ```

3. **Prevent XSS:** Never use `dangerouslySetInnerHTML` with SQL - react-syntax-highlighter escapes content automatically (safe)

4. **Copy-friendly formatting:** When user copies, they get the actual code (not HTML) - works automatically

5. **Match your theme:** Choose a style that matches your app's dark/light mode. For our professional blue theme, `vscDarkPlus` or custom styling works well.

---

## Troubleshooting

**Issue 1:** Bundle size is too large (>200KB for syntax highlighting)  
**Solution:** Use Prism export (`react-syntax-highlighter/dist/esm/languages/prism`) and only import SQL language, not the full bundle. Also use code splitting to lazy load the modal.

**Issue 2:** SQL isn't highlighting correctly (no colors)  
**Solution:** Verify language is set to `"sql"` (lowercase), verify style is imported correctly, check that SQL string doesn't have leading/trailing whitespace breaking detection.

**Issue 3:** Long SQL queries cause horizontal scrolling  
**Solution:** Add `wrapLines={true}` and set `customStyle={{ wordBreak: 'break-word' }}` or use `overflow: 'auto'` with max-width.

**Issue 4:** Theme doesn't match our dark/light mode  
**Solution:** Use different styles for dark mode (`vscDarkPlus`) and light mode (`vs`), or create custom style object matching Module 0010 colors.

---

## Learning Resources

**Essential:**
- [Official GitHub Repository](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - README with examples
- [Supported Languages](https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_PRISM.MD) - Confirm SQL support

**Recommended:**
- [Available Themes](https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/AVAILABLE_STYLES_PRISM.MD) - Preview different color schemes
- [CodeSandbox Example](https://codesandbox.io/s/react-syntax-highlighter-example) - Live interactive demo

**Community:**
- [npm package page](https://www.npmjs.com/package/react-syntax-highlighter) - Version history, weekly downloads
- [GitHub Issues](https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues) - Common problems

---

**Related Technologies:**
- [PostgreSQL](../../../agentic/tasks/explainers/postgresql.md) - The SQL dialect we're highlighting
- [Modal Components](../../../agentic/tasks/explainers/headless-ui.md) - Where we display the highlighted SQL
- [Tailwind CSS](../../../agentic/tasks/explainers/tailwind-css.md) - Styling the modal containing the SQL

---

## Performance Considerations

**Bundle Size Impact:**
- Full library: ~250KB
- Prism export (SQL only): ~50KB
- Recommendation: Use Prism export and lazy load

**Runtime Performance:**
- Highlighting is fast (<10ms for typical SQL queries)
- Re-highlighting on every render can be slow - wrap in `useMemo` if parent re-renders frequently

**Code Example (Optimized):**
```tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter/dist/esm/prism';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register only SQL language
SyntaxHighlighter.registerLanguage('sql', sql);

// Memoize if parent re-renders often
const highlightedSQL = useMemo(() => (
  <SyntaxHighlighter language="sql" style={vscDarkPlus}>
    {sqlCode}
  </SyntaxHighlighter>
), [sqlCode]);
```

---

## Our Specific Usage in Module 0001

**Where:** SQL Display Modal (`frontend/src/components/AI/SQLDisplayModal.tsx`)

**Configuration:**
- Language: `"sql"` (PostgreSQL)
- Style: Custom theme matching Module 0010 colors or `vscDarkPlus`
- Line numbers: Disabled (SQL queries are usually <50 lines)
- Wrap lines: Enabled (long SQL shouldn't cause horizontal scroll)
- Copy button: Separate button, not built-in

**Rendering:**
```
┌─────────────────────────────────────┐
│  Generated SQL Query          [×]   │
├─────────────────────────────────────┤
│                                     │
│  [Syntax-highlighted SQL here]      │
│  SELECT region_name,                │  <- Blue
│         SUM(revenue) as total       │  <- Purple (SUM)
│  FROM semantic.monthly_financials   │  <- Black
│  WHERE year = 2025                  │  <- Blue (WHERE)
│                                     │
│  [Copy SQL] [Explain Query] [Close] │
└─────────────────────────────────────┘
```

This makes SQL readable at a glance for Finance Analysts verifying AI-generated queries.
