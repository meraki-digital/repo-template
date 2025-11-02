# React 19

**Category:** Frontend
**Official Docs:** https://react.dev
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

React 19 is the latest major version of React, a JavaScript library for building user interfaces. Think of React as a set of building blocks (called "components") that you assemble to create interactive web applications. Instead of manually updating the page when data changes, React automatically keeps your UI in sync with your application state.

React 19 introduces performance improvements, new features for server-side rendering, and enhanced developer experience. It's designed to make building complex, interactive UIs simpler and more efficient.

---

## Why We're Using It In This Project

- **Component reusability** - Build authentication UI components (login forms, user management panels) once and reuse throughout the application
- **Declarative UI patterns** - Describe what the UI should look like for different states (logged in, logged out, loading) rather than imperatively updating the DOM
- **Rich ecosystem** - Seamless integration with React Router for protected routes, TanStack Query for authentication state management, and Tailwind CSS for styling
- **Team familiarity** - Existing project already uses React, maintaining consistency across the codebase
- **Performance** - React 19's improved rendering performance ensures responsive authentication flows even under load

---

## How We'll Use It

**Example 1: Login Form Component**
```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const { token } = await response.json();
    localStorage.setItem('jwt', token);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

**Example 2: Protected Route Component**
```tsx
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('jwt');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

## Key Concepts

- **Components:** Reusable UI building blocks that accept inputs (props) and return what should appear on screen
- **State:** Data that changes over time within a component (like form inputs, authentication status)
- **Hooks:** Functions like `useState`, `useEffect` that let you use React features inside function components
- **JSX:** Syntax extension that lets you write HTML-like code inside JavaScript
- **Virtual DOM:** React's internal representation of the UI that enables efficient updates

---

## Alternatives We Considered

- **Vue.js:** Excellent framework but would require team retraining since we're already using React
- **Angular:** More opinionated and heavier framework; overkill for our authentication UI needs
- **Svelte:** Compelling compiler-based approach but smaller ecosystem and less team familiarity
- **Plain JavaScript:** Would require manual DOM manipulation and state management, significantly more code

---

## Getting Started

1. **Already installed** - React 19 is part of the existing frontend setup
2. **Create authentication components** in `poc/frontend/src/components/auth/`
3. **Use hooks for state management:**
   ```tsx
   import { useState, useEffect } from 'react';
   ```

---

## Common Patterns & Best Practices

1. **Keep components small and focused** - Each component should have a single responsibility (e.g., LoginForm, UserList, RDSStatusIndicator)
2. **Lift state up** - When multiple components need the same data (like authentication status), move the state to their common parent
3. **Use controlled components** - Form inputs should be controlled by React state, not DOM state
4. **Avoid inline function definitions in JSX** - Define event handlers outside JSX to prevent unnecessary re-renders
5. **Memoize expensive computations** - Use `useMemo` for complex calculations based on authentication data

---

## Troubleshooting

**Issue 1:** Component not re-rendering when authentication state changes
**Solution:** Ensure you're using `useState` or a state management library like TanStack Query. Direct mutations to objects won't trigger re-renders.

**Issue 2:** "Maximum update depth exceeded" error
**Solution:** You're likely calling `setState` inside the render phase without conditions. Move state updates to event handlers or `useEffect`.

**Issue 3:** Lost authentication state on page refresh
**Solution:** Persist JWT token in localStorage and restore it on app mount using `useEffect`.

---

## Learning Resources

**Essential:**
- [Official React Documentation](https://react.dev)
- [React 19 Release Notes](https://react.dev/blog)

**Recommended:**
- [React Hooks Guide](https://react.dev/reference/react)
- [Thinking in React](https://react.dev/learn/thinking-in-react)

**Community:**
- [React GitHub Repository](https://github.com/facebook/react)
- [React Discord](https://discord.gg/react)

---

**Related Technologies:**
- [TypeScript](typescript-5.md) - Type safety for React components
- [React Router v6](react-router-v6.md) - Protected routing for authenticated users
- [TanStack Query](tanstack-query.md) - Authentication state management
- [Vite](vite.md) - Build tool and dev server
