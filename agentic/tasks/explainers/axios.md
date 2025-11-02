# Axios

**Category:** Frontend  
**Official Docs:** https://axios-http.com/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

Axios is a promise-based HTTP client for making API requests from browsers and Node.js. Think of it as a more powerful and user-friendly version of the built-in fetch() API, with automatic JSON parsing, request/response interceptors, and better error handling.

In simple terms: Axios is like a smart messenger that handles all your communication with backend APIs. It automatically converts data to/from JSON, handles authentication tokens, retries failed requests, and gives you consistent error handling across your entire dashboard.

---

## Why We're Using It In This Project

- **API Communication:** Our dashboard makes hundreds of API calls to fetch financial data, generate reports, and manage user settings
- **Authentication Handling:** Automatic inclusion of auth tokens in requests and refresh token logic
- **Consistent Error Handling:** Standardized error responses across all API calls
- **Request Interceptors:** Automatically add loading states and handle common request setup
- **Better DX:** More intuitive API than fetch() with automatic JSON parsing

---

## How We'll Use It

**Example 1: Basic API Client Setup**
```typescript
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    if (error.response?.status >= 500) {
      // Show user-friendly error for server errors
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Example 2: Financial Data API Functions**
```typescript
import apiClient from './apiClient';

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
  accountId: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  topCategories: Array<{ name: string; amount: number }>;
}

class FinancialAPI {
  // GET request with query parameters
  async getTransactions(
    accountId: number,
    params?: {
      startDate?: string;
      endDate?: string;
      category?: string;
      limit?: number;
    }
  ): Promise<Transaction[]> {
    const response = await apiClient.get(`/accounts/${accountId}/transactions`, {
      params
    });
    return response.data;
  }

  // GET request with automatic error handling
  async getFinancialSummary(
    startDate: string,
    endDate: string
  ): Promise<FinancialSummary> {
    try {
      const response = await apiClient.get('/financial/summary', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch summary: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  // POST request for creating reports
  async generateReport(reportConfig: {
    type: 'pdf' | 'csv' | 'excel';
    filters: Record<string, any>;
    email?: string;
  }): Promise<{ reportId: string; downloadUrl: string }> {
    const response = await apiClient.post('/reports/generate', reportConfig, {
      // Show progress for large report generation
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        console.log(`Report generation: ${percentCompleted}%`);
      }
    });
    
    return response.data;
  }

  // PUT request for updating data
  async updateTransaction(
    transactionId: number,
    updates: Partial<Pick<Transaction, 'description' | 'category'>>
  ): Promise<Transaction> {
    const response = await apiClient.put(`/transactions/${transactionId}`, updates);
    return response.data;
  }

  // DELETE request
  async deleteTransaction(transactionId: number): Promise<void> {
    await apiClient.delete(`/transactions/${transactionId}`);
  }
}

export const financialAPI = new FinancialAPI();
```

**Example 3: Usage in React Components**
```tsx
import { useState, useEffect } from 'react';
import { financialAPI, Transaction } from './api/financial';

const TransactionList = ({ accountId }: { accountId: number }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    category: 'all'
  });

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await financialAPI.getTransactions(accountId, {
        startDate: filters.startDate,
        endDate: filters.endDate,
        category: filters.category !== 'all' ? filters.category : undefined,
        limit: 100
      });
      
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [accountId, filters]);

  const handleExport = async () => {
    try {
      const result = await financialAPI.generateReport({
        type: 'csv',
        filters: {
          accountId,
          ...filters
        },
        email: 'user@company.com' // Optional: email when ready
      });
      
      // Download the report
      window.open(result.downloadUrl, '_blank');
    } catch (err) {
      alert('Failed to generate report');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded p-4">
      <p className="text-red-800">{error}</p>
      <button 
        onClick={loadTransactions}
        className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
      >
        Retry
      </button>
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <div className="space-y-2">
        {transactions.map(transaction => (
          <div key={transaction.id} className="flex justify-between p-4 border rounded">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-600">
                {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
              </p>
            </div>
            <span className={`font-bold ${
              transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Key Concepts

- **Instance Configuration:** Create configured axios instances for different APIs
- **Interceptors:** Modify requests/responses globally
- **Request Methods:** GET, POST, PUT, DELETE, PATCH
- **Error Handling:** Consistent error responses and retry logic
- **Cancellation:** Abort requests when components unmount

---

## Alternatives We Considered

- **Fetch API:** Built-in but lacks interceptors and automatic JSON handling
- **SuperAgent:** Similar to Axios but less popular ecosystem
- **Ky:** Modern fetch wrapper but less mature than Axios
- **GraphQL Clients:** Apollo/Relay for GraphQL APIs - Axios better for REST

---

## Getting Started

1. **Installation:** `npm install axios`
2. **Create Instance:** Configure base URL, timeouts, headers
3. **Add Interceptors:** Set up auth and error handling
4. **Make Requests:** Use axios.get/post/put/delete methods
5. **Handle Responses:** Access data property for parsed JSON

---

## Common Patterns & Best Practices

1. **Instance per API:** Create separate instances for different services
2. **Request Interceptors:** Add auth tokens and common headers
3. **Response Interceptors:** Handle errors and token refresh
4. **TypeScript:** Strongly type request/response data
5. **Cancellation:** Use AbortController for cleanup

---

## Troubleshooting

**Issue 1: CORS errors**  
**Solution:** Configure CORS on backend or use proxy in development

**Issue 2: Request timeouts**  
**Solution:** Increase timeout or implement retry logic

**Issue 3: Interceptors not working**  
**Solution:** Ensure interceptors are added before making requests

---

## Learning Resources

**Essential:**
- [Axios Documentation](https://axios-http.com/docs/intro) - Official docs
- [API Reference](https://axios-http.com/docs/api_intro) - Complete API

**Recommended:**
- [Axios Cheat Sheet](https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index) - Quick reference
- [Handling Errors](https://axios-http.com/docs/handling_errors) - Error handling guide

**Community:**
- [Axios GitHub](https://github.com/axios/axios) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/axios) - Community solutions

---

**Related Technologies:**
- TypeScript - Provides type safety for API responses
- TanStack Query - Often used together for caching API calls
- React - Framework where Axios is commonly used
