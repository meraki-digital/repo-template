# React Hooks

**Category:** Frontend  
**Official Docs:** https://react.dev/reference/react  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

React Hooks are functions that let you "hook into" React state and lifecycle features from functional components. They enable you to use state and other React features without writing class components. Think of them as special functions that connect your components to React's internal machinery.

In simple terms: Hooks are like magical functions that give functional components superpowers - they can remember things (state), run code at the right times (effects), and access context, all without the complexity of classes.

---

## Why We're Using It In This Project

- **Modern React Patterns:** Our dashboard uses functional components exclusively, and hooks are the standard way to manage state and side effects
- **Component State:** Each chart, filter, and data table needs to manage its own local state (loading, selected items, form data)
- **Lifecycle Management:** Handle data fetching, cleanup, and side effects in our complex financial interfaces
- **Code Reusability:** Custom hooks allow us to share stateful logic across similar components
- **Performance:** Hooks enable fine-grained optimization with useMemo and useCallback

---

## How We'll Use It

**Example 1: Dashboard Filter State Management**
```tsx
import { useState, useEffect } from 'react';

interface DateRange {
  start: Date;
  end: Date;
}

const useDashboardFilters = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset filters when component mounts (optional)
  useEffect(() => {
    // Could load saved filters from localStorage
    const saved = localStorage.getItem('dashboard-filters');
    if (saved) {
      const parsed = JSON.parse(saved);
      setDateRange(parsed.dateRange);
      setSelectedCategories(parsed.categories);
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    const filters = {
      dateRange,
      categories: selectedCategories
    };
    localStorage.setItem('dashboard-filters', JSON.stringify(filters));
  }, [dateRange, selectedCategories]);

  const resetFilters = () => {
    setDateRange({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    });
    setSelectedCategories([]);
    setSearchTerm('');
  };

  return {
    dateRange,
    setDateRange,
    selectedCategories,
    setSelectedCategories,
    searchTerm,
    setSearchTerm,
    resetFilters
  };
};

const DashboardFilters = () => {
  const {
    dateRange,
    setDateRange,
    selectedCategories,
    setSelectedCategories,
    searchTerm,
    setSearchTerm,
    resetFilters
  } = useDashboardFilters();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={(start, end) => setDateRange({ start, end })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {['Revenue', 'Labor', 'Materials', 'Equipment'].map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategories(prev =>
                    prev.includes(category)
                      ? prev.filter(c => c !== category)
                      : [...prev, category]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={resetFilters}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
```

**Example 2: Custom Hook for API Data with Loading States**
```tsx
import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApi<T>(url: string, options?: RequestInit): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Usage in component
const TransactionList = ({ accountId }: { accountId: number }) => {
  const { data: transactions, loading, error, refetch } = useApi<Transaction[]>(
    `/api/accounts/${accountId}/transactions`
  );

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">
      Error loading transactions: {error}
      <button onClick={refetch} className="ml-2 underline">Retry</button>
    </div>;
  }

  return (
    <div className="space-y-2">
      {transactions?.map(transaction => (
        <div key={transaction.id} className="p-4 border rounded">
          <div className="flex justify-between">
            <span>{transaction.description}</span>
            <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## Key Concepts

- **useState:** Manages local component state
- **useEffect:** Runs side effects (API calls, subscriptions) at appropriate times
- **useContext:** Accesses React Context values
- **useCallback:** Memoizes functions to prevent unnecessary re-renders
- **useMemo:** Memoizes expensive calculations

---

## Alternatives We Considered

- **Class Components:** Older React pattern with more boilerplate - hooks are simpler and more composable
- **State Management Libraries:** Redux/Zustand for complex global state - hooks sufficient for component-level state
- **No State Management:** Would make components hard to test and maintain - hooks provide clean state management

---

## Getting Started

1. **Import Hooks:** `import { useState, useEffect } from 'react'`
2. **Use in Functional Components:** Hooks only work in function components
3. **Follow Rules:** Call hooks at top level, not in loops/conditions
4. **TypeScript:** Use proper types for state and effects

---

## Common Patterns & Best Practices

1. **Custom Hooks:** Extract reusable logic into custom hooks
2. **Dependency Arrays:** Include all dependencies in useEffect/useCallback
3. **Cleanup:** Return cleanup functions from useEffect
4. **Memoization:** Use useMemo for expensive computations
5. **State Structure:** Keep related state together in objects

---

## Troubleshooting

**Issue 1: Infinite re-renders**  
**Solution:** Check dependency arrays and avoid putting objects/functions in dependencies

**Issue 2: Stale closures**  
**Solution:** Use useCallback for event handlers and include dependencies

**Issue 3: State not updating**  
**Solution:** Remember that state updates are asynchronous

---

## Learning Resources

**Essential:**
- [React Hooks Documentation](https://react.dev/reference/react) - Official reference
- [Hooks at a Glance](https://react.dev/reference/react/hooks) - Quick overview

**Recommended:**
- [React Hooks in Action](https://www.manning.com/books/react-hooks-in-action) - Comprehensive guide
- [useHooks](https://usehooks.com/) - Collection of custom hooks

**Community:**
- [React GitHub](https://github.com/facebook/react) - Core discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-hooks) - Community solutions

---

**Related Technologies:**
- React - Framework that provides hooks
- TypeScript - Adds type safety to hook usage
- TanStack Query - Works well with hooks for data fetching
