# React Testing Library

**Category:** Frontend  
**Official Docs:** https://testing-library.com/docs/react-testing-library/intro/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

React Testing Library is a testing utility for React components that encourages testing from the user's perspective. Think of it as a set of tools that let you interact with your components like a real user would - clicking buttons, typing in inputs, and checking what's displayed on screen.

In simple terms: Instead of testing implementation details, React Testing Library helps you write tests that verify your components work correctly for users. It's like having a simulated user interact with your dashboard to ensure everything functions as expected.

---

## Why We're Using It In This Project

- **User-Centric Testing:** Tests how users actually interact with the dashboard
- **Accessibility Focus:** Encourages accessible markup and interactions
- **Implementation Agnostic:** Tests don't break when refactoring internal code
- **React Best Practices:** Promotes testing user behavior over implementation details
- **Integration with Vitest:** Seamless combination for fast, comprehensive testing

---

## How We'll Use It

**Example 1: Testing Dashboard Filters**
```typescript
// DashboardFilters.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardFilters } from './DashboardFilters';

describe('DashboardFilters', () => {
  it('allows users to select date range', async () => {
    const user = userEvent.setup();
    const mockOnFilterChange = vi.fn();
    
    render(<DashboardFilters onFilterChange={mockOnFilterChange} />);
    
    // Find date inputs
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    
    // User types dates
    await user.clear(startDateInput);
    await user.type(startDateInput, '2024-01-01');
    
    await user.clear(endDateInput);
    await user.type(endDateInput, '2024-12-31');
    
    // Verify the callback was called with correct values
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31')
      },
      categories: [],
      searchTerm: ''
    });
  });

  it('filters transactions by category', async () => {
    const user = userEvent.setup();
    const mockOnFilterChange = vi.fn();
    
    render(<DashboardFilters onFilterChange={mockOnFilterChange} />);
    
    // Find category buttons
    const revenueButton = screen.getByRole('button', { name: /revenue/i });
    const laborButton = screen.getByRole('button', { name: /labor/i });
    
    // User clicks categories
    await user.click(revenueButton);
    await user.click(laborButton);
    
    // Check that buttons show active state
    expect(revenueButton).toHaveClass('active');
    expect(laborButton).toHaveClass('active');
    
    // Verify filter change
    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: ['Revenue', 'Labor']
      })
    );
  });

  it('searches transactions by text', async () => {
    const user = userEvent.setup();
    const mockOnFilterChange = vi.fn();
    
    render(<DashboardFilters onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    
    await user.type(searchInput, 'office supplies');
    
    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        searchTerm: 'office supplies'
      })
    );
  });

  it('resets all filters when reset button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnFilterChange = vi.fn();
    
    render(<DashboardFilters onFilterChange={mockOnFilterChange} />);
    
    // Apply some filters first
    const revenueButton = screen.getByRole('button', { name: /revenue/i });
    await user.click(revenueButton);
    
    const searchInput = screen.getByPlaceholderText(/search transactions/i);
    await user.type(searchInput, 'test search');
    
    // Click reset
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);
    
    // Verify filters are reset
    expect(mockOnFilterChange).toHaveBeenLastCalledWith({
      dateRange: expect.any(Object), // Default date range
      categories: [],
      searchTerm: ''
    });
  });
});
```

**Example 2: Testing Data Table Interactions**
```typescript
// DataTable.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';

const mockTransactions = [
  {
    id: 1,
    date: '2024-01-15',
    description: 'Office Supplies',
    amount: 250.00,
    category: 'Materials'
  },
  {
    id: 2,
    date: '2024-01-20',
    description: 'Consulting Services',
    amount: 1500.00,
    category: 'Labor'
  }
];

describe('DataTable', () => {
  it('displays transaction data correctly', () => {
    render(<DataTable transactions={mockTransactions} />);
    
    // Check table headers
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    
    // Check first row data
    const firstRow = screen.getByText('Office Supplies').closest('tr');
    expect(firstRow).toBeInTheDocument();
    
    if (firstRow) {
      expect(within(firstRow).getByText('Jan 15, 2024')).toBeInTheDocument();
      expect(within(firstRow).getByText('$250.00')).toBeInTheDocument();
      expect(within(firstRow).getByText('Materials')).toBeInTheDocument();
    }
  });

  it('formats amounts as currency', () => {
    render(<DataTable transactions={mockTransactions} />);
    
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
  });

  it('shows positive amounts in green, negative in red', () => {
    const transactionsWithNegative = [
      ...mockTransactions,
      {
        id: 3,
        date: '2024-01-25',
        description: 'Refund',
        amount: -100.00,
        category: 'Revenue'
      }
    ];
    
    render(<DataTable transactions={transactionsWithNegative} />);
    
    const positiveAmount = screen.getByText('$250.00');
    const negativeAmount = screen.getByText('-$100.00');
    
    expect(positiveAmount).toHaveClass('text-green-600');
    expect(negativeAmount).toHaveClass('text-red-600');
  });

  it('handles empty transaction list', () => {
    render(<DataTable transactions={[]} />);
    
    expect(screen.getByText('No transactions found')).toBeInTheDocument();
  });

  it('allows sorting by columns', async () => {
    const user = userEvent.setup();
    render(<DataTable transactions={mockTransactions} />);
    
    const amountHeader = screen.getByText('Amount');
    
    // Click to sort ascending
    await user.click(amountHeader);
    
    // Verify order (assuming sort functionality)
    const amounts = screen.getAllByText(/\$[\d,]+\.\d{2}/);
    expect(amounts[0]).toHaveTextContent('$250.00');
    expect(amounts[1]).toHaveTextContent('$1,500.00');
    
    // Click again for descending
    await user.click(amountHeader);
    expect(amounts[0]).toHaveTextContent('$1,500.00');
    expect(amounts[1]).toHaveTextContent('$250.00');
  });
});
```

**Example 3: Testing Form Submissions**
```typescript
// ReportForm.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportForm } from './ReportForm';

describe('ReportForm', () => {
  it('submits report configuration correctly', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    
    render(<ReportForm onSubmit={mockOnSubmit} />);
    
    // Fill out the form
    const nameInput = screen.getByLabelText(/report name/i);
    await user.type(nameInput, 'Q4 Financial Summary');
    
    const typeSelect = screen.getByLabelText(/report type/i);
    await user.selectOptions(typeSelect, 'financial');
    
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-10-01');
    
    const endDateInput = screen.getByLabelText(/end date/i);
    await user.type(endDateInput, '2024-12-31');
    
    // Check include charts checkbox
    const chartsCheckbox = screen.getByLabelText(/include charts/i);
    await user.click(chartsCheckbox);
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /generate report/i });
    await user.click(submitButton);
    
    // Verify submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Q4 Financial Summary',
        type: 'financial',
        dateRange: {
          start: '2024-10-01',
          end: '2024-12-31'
        },
        includeCharts: true
      });
    });
  });

  it('shows validation errors for invalid input', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    
    render(<ReportForm onSubmit={mockOnSubmit} />);
    
    // Try to submit without required fields
    const submitButton = screen.getByRole('button', { name: /generate report/i });
    await user.click(submitButton);
    
    // Check for validation errors
    expect(screen.getByText(/report name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/end date is required/i)).toBeInTheDocument();
    
    // Verify form was not submitted
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates date range logic', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    
    render(<ReportForm onSubmit={mockOnSubmit} />);
    
    // Fill form with invalid date range (end before start)
    const nameInput = screen.getByLabelText(/report name/i);
    await user.type(nameInput, 'Test Report');
    
    const startDateInput = screen.getByLabelText(/start date/i);
    await user.type(startDateInput, '2024-12-31');
    
    const endDateInput = screen.getByLabelText(/end date/i);
    await user.type(endDateInput, '2024-01-01');
    
    const submitButton = screen.getByRole('button', { name: /generate report/i });
    await user.click(submitButton);
    
    // Check for date range error
    expect(screen.getByText(/start date must be before end date/i)).toBeInTheDocument();
  });
});
```

---

## Key Concepts

- **Queries:** getBy, findBy, queryBy for finding elements
- **User Events:** userEvent for realistic interactions
- **Screen Object:** screen.getBy* for accessible queries
- **Async Testing:** waitFor for asynchronous updates
- **Accessibility:** Encourages semantic HTML and ARIA attributes

---

## Alternatives We Considered

- **Enzyme:** Tests implementation details, less user-focused
- **React Test Renderer:** Low-level, requires more setup
- **Manual DOM manipulation:** Error-prone and verbose
- **No testing:** Would risk regressions in user interactions

---

## Getting Started

1. **Installation:** `npm install -D @testing-library/react @testing-library/user-event`
2. **Import:** `import { render, screen } from '@testing-library/react'`
3. **Render Component:** `render(<MyComponent />)`
4. **Query Elements:** `screen.getByText('Hello')`
5. **Interact:** `await user.click(button)`

---

## Common Patterns & Best Practices

1. **Test User Behavior:** Focus on what users see and do
2. **Use Accessible Queries:** Prefer getByRole, getByLabelText
3. **Wait for Async:** Use waitFor for state updates
4. **Mock Dependencies:** Isolate components from external dependencies
5. **Describe User Journeys:** Test complete user workflows

---

## Troubleshooting

**Issue 1: Element not found**  
**Solution:** Check accessibility attributes and query priorities

**Issue 2: Async test failures**  
**Solution:** Use waitFor or findBy queries for async updates

**Issue 3: Act warnings**  
**Solution:** Wrap state updates in act() or use userEvent

---

## Learning Resources

**Essential:**
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/) - Official docs
- [Queries Guide](https://testing-library.com/docs/queries/about/) - Query reference

**Recommended:**
- [Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/) - Quick reference
- [Common Mistakes](https://kentcdodds.com/blog/common-testing-mistakes) - Best practices

**Community:**
- [GitHub](https://github.com/testing-library/react-testing-library) - Issues and discussions
- [Discord](https://testing-library.com/discord) - Community support

---

**Related Technologies:**
- Vitest - Test runner that executes RTL tests
- React - Framework being tested
- @testing-library/jest-dom - Additional matchers
- TypeScript - Type safety in tests
