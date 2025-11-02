# TypeScript Compiler (tsc)

**Category:** Frontend  
**Official Docs:** https://www.typescriptlang.org/docs/handbook/compiler-options.html  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

The TypeScript Compiler (tsc) is the official compiler that transforms TypeScript code into JavaScript and performs static type checking. Think of it as a sophisticated translator that not only converts TypeScript to JavaScript but also acts as a code reviewer, catching type-related bugs before runtime.

In simple terms: tsc is like having a strict but brilliant code translator that checks your TypeScript for errors and converts it to JavaScript that browsers can understand, ensuring your financial dashboard code is both type-safe and executable.

---

## Why We're Using It In This Project

- **Type Safety:** Catches type-related bugs in our complex financial logic
- **Better IDE Support:** Enables IntelliSense and refactoring tools
- **Future JavaScript:** Uses modern JS features safely
- **Code Quality:** Enforces disciplined coding practices
- **Team Productivity:** Reduces debugging time with compile-time checks

---

## How We'll Use It

**Example 1: TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    // Target JavaScript version
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    
    // Module system
    "module": "ESNext",
    "moduleResolution": "bundler",
    
    // Output
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    
    // Type checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // Interop
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    
    // JSX
    "jsx": "react-jsx",
    
    // Source maps for debugging
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    
    // Path mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    },
    
    // Additional checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.test.ts"
  ],
  "ts-node": {
    "esm": true
  }
}
```

**Example 2: Common TypeScript Patterns in Our Dashboard**
```typescript
// types/financial.ts
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category: TransactionCategory;
  accountId: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  period: {
    start: Date;
    end: Date;
  };
}

export type TransactionCategory = 
  | 'revenue' 
  | 'labor' 
  | 'materials' 
  | 'equipment' 
  | 'other';

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

```typescript
// utils/financialCalculations.ts
import { Transaction, FinancialSummary } from '@/types/financial';

/**
 * Calculate financial summary from transactions
 * TypeScript ensures all calculations are type-safe
 */
export function calculateFinancialSummary(
  transactions: Transaction[],
  period: { start: Date; end: Date }
): FinancialSummary {
  // Filter transactions within period
  const periodTransactions = transactions.filter(
    (t) => t.date >= period.start && t.date <= period.end
  );

  // Separate revenue and expenses
  const revenue = periodTransactions
    .filter((t) => t.category === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = periodTransactions
    .filter((t) => t.category !== 'revenue')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netProfit = revenue - expenses;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return {
    totalRevenue: revenue,
    totalExpenses: expenses,
    netProfit,
    profitMargin,
    period
  };
}

/**
 * Type-safe currency formatting
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Strongly typed validation function
 */
export function validateTransaction(transaction: unknown): transaction is Transaction {
  if (!transaction || typeof transaction !== 'object') return false;
  
  const t = transaction as Record<string, unknown>;
  
  return (
    typeof t.id === 'string' &&
    typeof t.amount === 'number' &&
    typeof t.description === 'string' &&
    t.date instanceof Date &&
    typeof t.category === 'string' &&
    typeof t.accountId === 'string'
  );
}
```

**Example 3: React Component with TypeScript**
```tsx
// components/TransactionTable.tsx
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionCategory } from '@/types/financial';
import { formatCurrency } from '@/utils/financialCalculations';

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionSelect?: (transaction: Transaction) => void;
  categoryFilter?: TransactionCategory;
  searchTerm?: string;
}

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  revenue: 'text-green-600',
  labor: 'text-blue-600',
  materials: 'text-orange-600',
  equipment: 'text-purple-600',
  other: 'text-gray-600'
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onTransactionSelect,
  categoryFilter,
  searchTerm = ''
}) => {
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filtered and sorted transactions
  const processedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(term) ||
        t.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Sort transactions
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, categoryFilter, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('date')}
            >
              Date
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('description')}
            >
              Description
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('category')}
            >
              Category
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('amount')}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {processedTransactions.map((transaction) => (
            <tr 
              key={transaction.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onTransactionSelect?.(transaction)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.date.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`capitalize ${CATEGORY_COLORS[transaction.category]}`}>
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## Key Concepts

- **Type Checking:** Static analysis for type errors
- **Transpilation:** Converting TS to JS
- **Configuration:** tsconfig.json for compiler options
- **Path Mapping:** Custom import paths
- **Declaration Files:** .d.ts for type definitions

---

## Alternatives We Considered

- **Babel + TS:** More complex setup
- **No TypeScript:** Less safe, more runtime errors
- **Flow:** Less popular ecosystem
- **JavaScript:** No type safety

---

## Getting Started

1. **Installation:** `npm install -D typescript`
2. **Initialize:** `npx tsc --init`
3. **Configure:** Edit tsconfig.json
4. **Build:** `npx tsc` or add to scripts
5. **Check:** `npx tsc --noEmit` for type checking

---

## Common Patterns & Best Practices

1. **Strict Mode:** Enable all strict options
2. **Path Mapping:** Use for clean imports
3. **Utility Types:** Leverage built-in generics
4. **Interface vs Type:** Use interfaces for objects
5. **Declaration Merging:** Extend third-party types

---

## Troubleshooting

**Issue 1: Type errors**  
**Solution:** Check tsconfig.json and type definitions

**Issue 2: Module resolution**  
**Solution:** Configure paths and moduleResolution

**Issue 3: Slow compilation**  
**Solution:** Use incremental builds and exclude node_modules

---

## Learning Resources

**Essential:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - Official docs
- [Compiler Options](https://www.typescriptlang.org/tsconfig) - Config reference

**Recommended:**
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - Comprehensive guide
- [Playground](https://www.typescriptlang.org/play) - Try TypeScript online

**Community:**
- [TypeScript GitHub](https://github.com/microsoft/TypeScript) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/typescript) - Community solutions

---

**Related Technologies:**
- React - Framework using TypeScript
- Vite - Build tool with TS support
- ESLint - Linting for TypeScript
- VS Code - Editor with TS integration
