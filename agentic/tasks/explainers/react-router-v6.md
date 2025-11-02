# React Router v6

**Category:** Frontend  
**Official Docs:** https://reactrouter.com/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

React Router is a routing library for React that enables navigation between different components/pages in a single-page application. Think of it as a traffic controller for your app - it decides which component to show based on the URL, enabling bookmarkable URLs and browser back/forward navigation.

In simple terms: React Router lets users navigate between different views in your dashboard (like switching from the main dashboard to a detailed report page) without triggering full page reloads. It's like having multiple pages in a single HTML file.

---

## Why We're Using It In This Project

- **Multi-Page Dashboard Experience:** Our financial dashboard has distinct sections (overview, reports, transactions, admin) that need their own URLs
- **Browser Navigation:** Users expect back/forward buttons and bookmarkable URLs for different dashboard views
- **Code Splitting:** Route-based code splitting improves initial load performance
- **Deep Linking:** Direct links to specific reports or filtered views
- **History Management:** Proper browser history for navigation flows

---

## How We'll Use It

**Example 1: Main Dashboard Routing Structure**
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Transactions } from './pages/Transactions';
import { Settings } from './pages/Settings';
import { Layout } from './components/Layout';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main layout with nested routes */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Nested routes for reports */}
          <Route path="reports/:reportId" element={<ReportDetail />} />
          <Route path="reports/new" element={<CreateReport />} />
        </Route>
        
        {/* Auth routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
```

**Example 2: Navigation and Route Parameters**
```tsx
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';

const ReportsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filter parameters from URL
  const status = searchParams.get('status') || 'all';
  const category = searchParams.get('category') || 'all';

  const handleFilterChange = (newStatus: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newStatus !== 'all') params.set('status', newStatus);
    if (newCategory !== 'all') params.set('category', newCategory);
    setSearchParams(params);
  };

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex gap-4">
        <select 
          value={status} 
          onChange={(e) => handleFilterChange(e.target.value, category)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        
        <select 
          value={category} 
          onChange={(e) => handleFilterChange(status, e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All Categories</option>
          <option value="financial">Financial</option>
          <option value="operational">Operational</option>
        </select>
      </div>

      {/* Reports list with navigation */}
      <div className="grid gap-4">
        {reports.map(report => (
          <div key={report.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{report.name}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
            </div>
            
            <div className="flex gap-2">
              {/* Programmatic navigation */}
              <button
                onClick={() => navigate(`/reports/${report.id}`)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                View
              </button>
              
              {/* Declarative navigation */}
              <Link
                to={`/reports/${report.id}/edit`}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  
  // Fetch report data using reportId
  const { data: report, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => fetchReport(reportId!),
    enabled: !!reportId
  });

  if (isLoading) return <div>Loading report...</div>;
  if (!report) return <div>Report not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{report.name}</h1>
        <button
          onClick={() => navigate(-1)} // Go back
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
      
      <ReportViewer report={report} />
    </div>
  );
};
```

---

## Key Concepts

- **Routes/Route:** Define which component shows for which URL path
- **Link:** Declarative navigation (like `<a>` but for React Router)
- **useNavigate:** Programmatic navigation in event handlers
- **useParams:** Extract dynamic segments from URLs
- **useSearchParams:** Work with query string parameters

---

## Alternatives We Considered

- **Next.js:** Full framework with routing - too heavy for our dashboard needs
- **Vanilla JavaScript:** Manual history API management - error-prone and complex
- **Hash routing:** URLs with # - not as clean as history API routing
- **No routing:** Single page app - doesn't work for our multi-section dashboard

---

## Getting Started

1. **Installation:** `npm install react-router-dom`
2. **Wrap App:** Use BrowserRouter at root level
3. **Define Routes:** Use Routes and Route components
4. **Navigation:** Use Link for declarative, useNavigate for programmatic
5. **Parameters:** Use useParams for dynamic routes

---

## Common Patterns & Best Practices

1. **Nested Routes:** Use Outlet for shared layouts
2. **Protected Routes:** Check auth before rendering components
3. **Lazy Loading:** Use React.lazy for route-based code splitting
4. **Search Params:** Use URLSearchParams for filters
5. **Navigation Guards:** Redirect unauthenticated users

---

## Troubleshooting

**Issue 1: Links not working**  
**Solution:** Ensure BrowserRouter wraps the entire app

**Issue 2: useParams returns undefined**  
**Solution:** Check route parameter names match useParams destructuring

**Issue 3: Navigation not updating URL**  
**Solution:** Use navigate() from useNavigate, not window.location

---

## Learning Resources

**Essential:**
- [React Router Documentation](https://reactrouter.com/) - Official docs
- [Tutorial](https://reactrouter.com/start/tutorial) - Step-by-step guide

**Recommended:**
- [React Router in Depth](https://reactrouter.com/start/overview) - Advanced concepts
- [Router Examples](https://reactrouter.com/start/examples) - Code examples

**Community:**
- [React Router GitHub](https://github.com/remix-run/react-router) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-router) - Community solutions

---

**Related Technologies:**
- React - Framework that React Router enhances
- TypeScript - Provides type safety for route parameters
- React Context - Often used for auth state with protected routes
