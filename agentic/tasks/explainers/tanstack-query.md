# TanStack Query (React Query)

**Category:** Frontend  
**Official Docs:** https://tanstack.com/query/latest  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

TanStack Query (formerly React Query) is a powerful data fetching and state management library for React that makes server state management simple and efficient. Think of it as a smart cache for your API calls - it handles fetching, caching, background updates, and error states automatically.

In simple terms: Instead of manually managing loading states, error handling, and caching for every API call, TanStack Query does it for you. It keeps your data fresh, handles network failures gracefully, and makes your app feel fast and responsive.

---

## Why We're Using It In This Project

- **Server State Management:** Our financial dashboard needs to manage data from APIs (transaction lists, reports, user data) - TanStack Query handles the complexity of server state
- **Intelligent Caching:** Prevents unnecessary API calls by caching responses and serving stale data while fetching fresh data in background
- **Real-time Updates:** Automatically refetches data when the app regains focus or network reconnects, keeping financial data current
- **Error Handling:** Built-in retry logic and error states make our dashboard resilient to network issues
- **Developer Experience:** Reduces boilerplate code for data fetching across all dashboard components

---

## How We'll Use It

**Example 1: Fetching Financial Summary Data**
```tsx
import { useQuery } from '@tanstack/react-query';

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  period: string;
}

const useFinancialSummary = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['financial-summary', startDate, endDate],
    queryFn: async (): Promise<FinancialSummary> => {
      const response = await fetch(
        `/api/financial/summary?start=${startDate}&end=${endDate}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch financial summary');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

const FinancialSummaryCard = ({ startDate, endDate }: { 
  startDate: string; 
  endDate: string; 
}) => {
  const { data, isLoading, error, refetch } = useFinancialSummary(startDate, endDate);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load financial summary</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ${data?.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Expenses</p>
          <p className="text-2xl font-bold text-red-600">
            ${data?.totalExpenses.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Net Profit</p>
          <p className="text-2xl font-bold text-blue-600">
            ${data?.netProfit.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
```

**Example 2: Creating Reports with Mutations**
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reportData: ReportRequest): Promise<ReportResponse> => {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create report');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch reports list
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      
      // Show success message
      toast.success('Report generated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    }
  });
};

const ReportGenerator = () => {
  const createReport = useCreateReport();
  
  const handleGenerateReport = (filters: ReportFilters) => {
    createReport.mutate({
      type: 'financial-summary',
      filters,
      format: 'pdf'
    });
  };

  return (
    <div>
      <ReportFiltersForm onSubmit={handleGenerateReport} />
      
      {createReport.isPending && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">Generating report...</p>
        </div>
      )}
      
      {createReport.isError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">
            Error: {createReport.error?.message}
          </p>
        </div>
      )}
    </div>
  );
};
```

---

## Key Concepts

- **Queries:** For fetching and caching data (useQuery)
- **Mutations:** For creating/updating/deleting data (useMutation)
- **Query Keys:** Unique identifiers for cache entries
- **Stale-While-Revalidate:** Serve cached data while fetching fresh data
- **Background Refetching:** Automatic updates when app regains focus

---

## Alternatives We Considered

- **Manual useEffect/fetch:** Too much boilerplate and error-prone - TanStack Query handles all the complexity
- **SWR:** Similar library, but TanStack Query has better TypeScript support and more features
- **Apollo Client:** Great for GraphQL, but overkill for our REST API needs
- **Redux Toolkit Query:** Part of Redux ecosystem - TanStack Query is more lightweight and standalone

---

## Getting Started

1. **Installation:** `npm install @tanstack/react-query`
2. **Setup Provider:** Wrap app with QueryClient and QueryClientProvider
3. **Create Client:** `const queryClient = new QueryClient()`
4. **Use Hooks:** Replace useEffect/fetch with useQuery/useMutation
5. **Configure Defaults:** Set global staleTime, error handling, etc.

---

## Common Patterns & Best Practices

1. **Meaningful Query Keys:** Use arrays like ['users', userId] for cache management
2. **Optimistic Updates:** Update UI immediately, rollback on error
3. **Dependent Queries:** Chain queries that depend on previous results
4. **Prefetching:** Load data before user needs it
5. **Error Boundaries:** Handle query errors gracefully

---

## Troubleshooting

**Issue 1: Queries not refetching**  
**Solution:** Check queryKey uniqueness and network connectivity

**Issue 2: Infinite loading states**  
**Solution:** Ensure queryFn returns a promise and handles errors properly

**Issue 3: Cache not updating**  
**Solution:** Use invalidateQueries or setQueryData to update cached data

---

## Learning Resources

**Essential:**
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview) - Official docs
- [React Query Patterns](https://tkdodo.eu/blog/practical-react-query) - Best practices guide

**Recommended:**
- [React Query Course](https://learn.tanstack.com/) - Video tutorials
- [Awesome React Query](https://github.com/tanstack/query/discussions) - Community discussions

**Community:**
- [TanStack GitHub](https://github.com/tanstack/query) - Issues and discussions
- [Discord Community](https://tanstack.com/discord) - Real-time help

---

**Related Technologies:**
- React - Framework that TanStack Query enhances
- Axios - Can be used as the fetch function in queries
- TypeScript - Provides type safety for query responses
- React Router - Often used together for data loading on route changes
