# @testing-library/jest-dom

**Category:** Frontend  
**Official Docs:** https://github.com/testing-library/jest-dom  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

@testing-library/jest-dom is a companion library that provides custom Jest matchers for asserting on DOM nodes. Think of it as extending Jest with specialized assertions designed for testing web interfaces, making your tests more readable and expressive.

In simple terms: It adds methods like `toBeInTheDocument()`, `toHaveClass()`, and `toBeVisible()` to Jest's expect, so you can write tests that read like plain English descriptions of what should happen in your dashboard.

---

## Why We're Using It In This Project

- **Readable Assertions:** Tests read like specifications ("button should be disabled", "error message should be visible")
- **DOM-Specific Matchers:** Specialized for web UI testing rather than generic JavaScript
- **Accessibility Focus:** Matchers that consider ARIA attributes and screen reader compatibility
- **Consistency:** Standardized assertions across all component tests
- **Better Error Messages:** Clear failure descriptions when tests don't pass

---

## How We'll Use It

**Example 1: Component State Testing**
```typescript
// Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportButton } from './ExportButton';

describe('ExportButton', () => {
  it('shows loading state during export', async () => {
    const user = userEvent.setup();
    const mockOnExport = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<ExportButton onExport={mockOnExport} />);
    
    const button = screen.getByRole('button', { name: /export/i });
    
    // Initial state
    expect(button).toBeEnabled();
    expect(button).toHaveTextContent('Export Data');
    expect(button).not.toHaveAttribute('aria-disabled');
    
    // Start export
    await user.click(button);
    
    // Loading state
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveTextContent('Exporting...');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for completion
    await waitFor(() => {
      expect(button).toBeEnabled();
      expect(button).toHaveTextContent('Export Data');
    });
  });

  it('displays error state on export failure', async () => {
    const user = userEvent.setup();
    const mockOnExport = vi.fn(() => Promise.reject(new Error('Export failed')));
    
    render(<ExportButton onExport={mockOnExport} />);
    
    await user.click(screen.getByRole('button', { name: /export/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Export failed')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Error should be visible and properly styled
    const errorMessage = screen.getByText('Export failed');
    expect(errorMessage).toBeVisible();
    expect(errorMessage).toHaveClass('text-red-600');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });
});
```

**Example 2: Form Validation Testing**
```typescript
// LoginForm.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Try to submit empty form
    await user.click(submitButton);
    
    // Check validation messages
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    
    // Check input error states
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
    
    // Error messages should be associated with inputs
    expect(emailInput).toHaveAttribute('aria-describedby');
    expect(passwordInput).toHaveAttribute('aria-describedby');
    
    // Form should not submit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows success state on valid submission', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    // Fill form with valid data
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securePass123');
    
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check success feedback
    await waitFor(() => {
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
    });
    
    const successMessage = screen.getByText('Login successful!');
    expect(successMessage).toBeVisible();
    expect(successMessage).toHaveClass('text-green-600');
    expect(successMessage).toHaveAttribute('role', 'status');
  });

  it('handles email format validation', async () => {
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={vi.fn()} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    
    // Type invalid email
    await user.type(emailInput, 'invalid-email');
    
    // Check validation
    expect(emailInput).toBeInvalid();
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    
    // Type valid email
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');
    
    expect(emailInput).toBeValid();
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });
});
```

**Example 3: Accessibility Testing**
```typescript
// DataTable.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { DataTable } from './DataTable';

const mockData = [
  { id: 1, name: 'Office Supplies', amount: 250.00, status: 'paid' },
  { id: 2, name: 'Software License', amount: 1200.00, status: 'pending' }
];

describe('DataTable', () => {
  it('has proper table structure and accessibility', () => {
    render(<DataTable data={mockData} />);
    
    // Table should have proper semantic structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Should have a caption for screen readers
    expect(table).toHaveAccessibleName('Transaction data');
    
    // Headers should be properly marked
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(4);
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Amount');
    expect(headers[2]).toHaveTextContent('Status');
    expect(headers[3]).toHaveTextContent('Actions');
  });

  it('displays data with proper formatting', () => {
    render(<DataTable data={mockData} />);
    
    // Check currency formatting
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    expect(screen.getByText('$1,200.00')).toBeInTheDocument();
    
    // Check status indicators
    const paidStatus = screen.getByText('paid');
    const pendingStatus = screen.getByText('pending');
    
    expect(paidStatus).toHaveClass('bg-green-100', 'text-green-800');
    expect(pendingStatus).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<DataTable data={mockData} />);
    
    // Focus first row action button
    const firstActionButton = screen.getAllByRole('button', { name: /view/i })[0];
    await user.tab();
    
    expect(firstActionButton).toHaveFocus();
    
    // Check focus management
    expect(firstActionButton).toHaveAttribute('tabindex', '0');
    expect(firstActionButton).not.toHaveAttribute('aria-disabled');
  });

  it('shows loading and empty states appropriately', () => {
    // Loading state
    render(<DataTable data={[]} loading={true} />);
    
    expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Empty state
    render(<DataTable data={[]} loading={false} />);
    
    expect(screen.getByText('No transactions found')).toBeInTheDocument();
    expect(screen.getByText('No transactions found')).toBeVisible();
  });

  it('handles row selection for bulk actions', async () => {
    const user = userEvent.setup();
    const mockOnSelectionChange = vi.fn();
    
    render(<DataTable data={mockData} onSelectionChange={mockOnSelectionChange} />);
    
    // Checkboxes should be present
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3); // Header + 2 rows
    
    // Select all checkbox
    const selectAllCheckbox = checkboxes[0];
    await user.click(selectAllCheckbox);
    
    expect(selectAllCheckbox).toBeChecked();
    expect(mockOnSelectionChange).toHaveBeenCalledWith([1, 2]);
    
    // Individual row selection
    const firstRowCheckbox = checkboxes[1];
    await user.click(firstRowCheckbox);
    
    expect(firstRowCheckbox).toBeChecked();
    expect(mockOnSelectionChange).toHaveBeenLastCalledWith([1]);
  });
});
```

---

## Key Concepts

- **DOM Assertions:** Specialized matchers for DOM elements
- **Accessibility Checks:** Matchers that consider ARIA and screen readers
- **State Assertions:** Check element visibility, attributes, and content
- **Form Validation:** Matchers for form states and input validity
- **Semantic HTML:** Encourages proper element roles and labels

---

## Alternatives We Considered

- **Built-in Jest matchers:** Limited for DOM-specific assertions
- **Custom matchers:** Would need to build and maintain our own
- **Enzyme matchers:** Tied to Enzyme, less focused on accessibility
- **No specialized matchers:** Would make tests verbose and less readable

---

## Getting Started

1. **Installation:** `npm install -D @testing-library/jest-dom`
2. **Setup:** Import in test setup file: `import '@testing-library/jest-dom'`
3. **Use Matchers:** `expect(element).toBeInTheDocument()`
4. **TypeScript:** Types included automatically
5. **IDE Support:** Full autocomplete for all matchers

---

## Common Patterns & Best Practices

1. **Test Accessibility:** Use toBeVisible, toHaveAccessibleName
2. **Check Form States:** Use toBeValid, toBeInvalid, toBeRequired
3. **Verify Content:** Use toHaveTextContent, toContainHTML
4. **Check Styles:** Use toHaveClass, toHaveStyle
5. **Test Interactions:** Combine with userEvent for complete flows

---

## Troubleshooting

**Issue 1: Matchers not available**  
**Solution:** Ensure import is in test setup file, before tests run

**Issue 2: TypeScript errors**  
**Solution:** Types are included, check TypeScript configuration

**Issue 3: Unexpected failures**  
**Solution:** Check element visibility and DOM structure

---

## Learning Resources

**Essential:**
- [jest-dom Documentation](https://github.com/testing-library/jest-dom) - Official docs
- [Matchers Reference](https://github.com/testing-library/jest-dom#custom-matchers) - All matchers

**Recommended:**
- [Examples](https://github.com/testing-library/jest-dom/tree/main/src) - Usage examples
- [Migration Guide](https://github.com/testing-library/jest-dom/blob/main/docs/migration.md) - From other libraries

**Community:**
- [GitHub](https://github.com/testing-library/jest-dom) - Issues and discussions
- [Testing Library Discord](https://testing-library.com/discord) - Community support

---

**Related Technologies:**
- Vitest - Test runner that executes the tests
- React Testing Library - Provides elements to assert on
- Jest - Base testing framework being extended
