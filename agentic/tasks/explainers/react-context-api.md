# React Context API

**Category:** Frontend  
**Official Docs:** https://react.dev/reference/react/useContext  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

React Context API is a built-in React feature for sharing state across component trees without prop drilling. Think of it as a global store accessible to any component in your app tree. It solves the problem of passing data through many levels of components that don't need it.

In simple terms: Context acts like a shared refrigerator in your app - any component can reach in and get what it needs (user authentication, theme settings, etc.) without having to pass items through every room in the house.

---

## Why We're Using It In This Project

- **Authentication State:** Our dashboard needs user login state accessible across all components (header, protected routes, API calls)
- **Global Settings:** User preferences like date formats, currency display, and theme settings
- **App-Wide Data:** Current user's permissions and role information for conditional rendering
- **Simplicity:** Built into React, no additional libraries needed for basic global state
- **Performance:** With proper memoization, it efficiently updates only components that need the data

---

## How We'll Use It

**Example 1: Authentication Context**
```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call our FastAPI authentication endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('authToken', userData.token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**Example 2: Using the Context in Components**
```tsx
import { useAuth } from './AuthContext';

const DashboardHeader = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 py-3">
        <h1 className="text-lg font-semibold">Financial Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user?.email}</span>
          <button 
            onClick={logout}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

---

## Key Concepts

- **Provider:** Component that supplies context values to its children
- **Consumer/useContext:** Hook to access context values in components
- **Context Object:** Created with createContext() to define the shape of shared data
- **Value Prop:** What gets passed down to consuming components
- **Tree Scope:** Context only affects components within the provider's tree

---

## Alternatives We Considered

- **Prop Drilling:** Passing auth state through every component - becomes unwieldy in large apps
- **Redux:** Powerful but adds complexity and boilerplate - Context API sufficient for our auth needs
- **Zustand:** Lightweight state management - considered for future expansion but Context works for current scope
- **URL Params/Local Storage:** Not suitable for sensitive auth state that needs reactivity

---

## Getting Started

1. **Create Context:** `const MyContext = createContext<ContextType>()`
2. **Create Provider Component:** Wrap children with Context.Provider
3. **Use in Components:** `const value = useContext(MyContext)`
4. **Type Safety:** Use TypeScript interfaces for context types

---

## Common Patterns & Best Practices

1. **Custom Hooks:** Create useContext hooks for cleaner component code
2. **Memoization:** Use useMemo for expensive context values
3. **Error Boundaries:** Handle context errors gracefully
4. **Provider Composition:** Nest multiple providers for different concerns
5. **TypeScript:** Strongly type context values and hooks

---

## Troubleshooting

**Issue 1: Context not updating components**  
**Solution:** Ensure Provider value is not recreated on every render (use useMemo)

**Issue 2: useContext returns undefined**  
**Solution:** Check that component is wrapped with the Provider and hook is called correctly

**Issue 3: Too many re-renders**  
**Solution:** Split contexts for different concerns and memoize context values

---

## Learning Resources

**Essential:**
- [React Context Documentation](https://react.dev/reference/react/useContext) - Official React docs
- [Context API Guide](https://react.dev/learn/scaling-up-with-reducer-and-context) - Advanced patterns

**Recommended:**
- [How to use Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively) - Best practices
- [React Context vs Redux](https://blog.logrocket.com/redux-vs-context-api/) - When to use each

**Community:**
- [React GitHub](https://github.com/facebook/react) - Core React discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-context) - Community solutions

---

**Related Technologies:**
- React - Framework that provides Context API
- TypeScript - Adds type safety to context usage
- React Router - Often used with auth context for protected routes
