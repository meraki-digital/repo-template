# Vitest

**Category:** Testing  
**Official Docs:** [https://vitest.dev/](https://vitest.dev/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Vitest is a fast, lightweight testing framework designed specifically for Vite-based projects. It provides a Jest-compatible API with native ES modules support, making it perfect for testing modern JavaScript/TypeScript applications. Vitest runs tests in parallel, provides instant feedback during development, and integrates seamlessly with Vite's hot module replacement.

Think of Vitest as the testing companion to Vite. Just as Vite revolutionized frontend development with its speed, Vitest brings that same performance to testing, allowing you to run tests as fast as you can type.

---

## Why We're Using It In This Project

Vitest provides fast, reliable testing for our React/TypeScript frontend:

- **Native Vite integration**: Works seamlessly with our build tool
- **Lightning fast**: Test execution speed matches development speed
- **ES modules support**: Tests modern JavaScript without transpilation
- **Jest compatibility**: Familiar API for existing Jest users
- **Hot module replacement**: Tests update automatically during development
- **TypeScript support**: Full TypeScript testing capabilities
- **Rich ecosystem**: Extensive plugins and integrations
- **Developer experience**: Fast feedback and clear error reporting

---

## How We'll Use It

Vitest will test our React components, hooks, and utilities:

**Example 1: Component testing**
```typescript
// Dashboard.test.tsx
import { render, screen } from '@testing-library/react'
import { Dashboard } from './Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

test('displays loading state initially', () => {
  const queryClient = createTestQueryClient()
  
  render(
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
  
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})
```

**Example 2: Custom hook testing**
```typescript
// useFinancialData.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useFinancialData } from './useFinancialData'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

test('fetches financial data successfully', async () => {
  const queryClient = createTestQueryClient()
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
  
  const { result } = renderHook(() => useFinancialData(), { wrapper })
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })
  
  expect(result.current.data).toHaveProperty('revenue')
  expect(result.current.data).toHaveProperty('expenses')
})
```

**Example 3: Utility function testing**
```typescript
// formatCurrency.test.ts
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  test('formats positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
  
  test('formats negative numbers correctly', () => {
    expect(formatCurrency(-500)).toBe('($500.00)')
  })
  
  test('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
})
```

**Example 4: Mocking API calls**
```typescript
// api.test.ts
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { fetchFinancialData } from './api'

const server = setupServer(
  rest.get('/api/dashboard', (req, res, ctx) => {
    return res(ctx.json({
      revenue: 100000,
      expenses: 75000,
      profit: 25000
    }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('fetches dashboard data', async () => {
  const data = await fetchFinancialData()
  expect(data.revenue).toBe(100000)
  expect(data.profit).toBe(25000)
})
```

---

## Key Concepts

- **Test runners**: Execute tests and report results
- **Matchers**: Assertions for verifying expected behavior
- **Mocks and spies**: Isolate code under test
- **Setup/teardown**: Prepare test environment and cleanup
- **Coverage reporting**: Measure how much code is tested

---

## Alternatives We Considered

- **Jest**: Slower and requires more configuration
- **Mocha**: Less integrated with modern tooling
- **Jasmine**: Older framework with fewer features
- **No testing**: Would lead to unreliable frontend code

---

## Getting Started

1. **Install Vitest**: `npm install -D vitest`
2. **Configure Vite**: Add test config to vite.config.ts
3. **Write tests**: Create .test.ts files
4. **Run tests**: `npm run test` or `vitest`
5. **Watch mode**: `vitest --watch` for continuous testing

---

## Common Patterns & Best Practices

1. **Test file naming**: Use .test.ts or .spec.ts extensions
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Mock external dependencies**: Isolate unit tests
4. **Use descriptive test names**: Make failures easy to understand
5. **Test edge cases**: Cover error conditions and boundary values

---

## Troubleshooting

**Issue 1:** Tests not running  
**Solution:** Check Vitest configuration in vite.config.ts

**Issue 2:** Import errors in tests  
**Solution:** Ensure proper path resolution and module mocking

---

## Learning Resources

**Essential:**
- [Vitest Documentation](https://vitest.dev/)
- [Vitest Guide](https://vitest.dev/guide/)

**Recommended:**
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

**Community:**
- [Vitest GitHub](https://github.com/vitest-dev/vitest)
- [Vite Discord](https://chat.vitejs.dev/)

---

**Related Technologies:**
- [React](https://react.dev/) - Framework being tested
- [TypeScript](https://www.typescriptlang.org/) - Language being tested
- [Vite](vite.md) - Build tool integration
- [Playwright](playwright.md) - E2E testing complement
