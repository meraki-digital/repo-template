# Playwright

**Category:** Testing  
**Official Docs:** [https://playwright.dev/](https://playwright.dev/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Playwright is a modern end-to-end testing framework for web applications that enables reliable testing across all major browsers (Chrome, Firefox, Safari, and Edge). It provides a single API to automate web interactions, handle modern web features like single-page applications, and run tests in headless or headed modes. Playwright is particularly strong at handling complex scenarios like file uploads, authentication flows, and cross-browser compatibility.

Think of Playwright as a sophisticated web browser puppeteer. It can automate any interaction a human can do in a browser - clicking buttons, filling forms, navigating pages, and verifying results - but it does so programmatically and repeatably.

---

## Why We're Using It In This Project

Playwright ensures our financial dashboard works correctly end-to-end:

- **Cross-browser testing**: Verify functionality across different browsers
- **Real user scenarios**: Test complete user journeys and workflows
- **Visual regression**: Detect unintended UI changes
- **API and UI integration**: Test frontend-backend communication
- **Reliable execution**: Handles dynamic content and async operations
- **CI/CD integration**: Automated testing in deployment pipelines
- **Debugging tools**: Rich debugging and screenshot capabilities
- **Performance monitoring**: Can measure page load times and interactions

---

## How We'll Use It

Playwright will test complete user workflows in our financial dashboard:

**Example 1: Dashboard loading and data display**
```typescript
// dashboard.spec.ts
import { test, expect } from '@playwright/test'

test('dashboard loads and displays financial data', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('http://localhost:3000/dashboard')
  
  // Wait for data to load
  await page.waitForSelector('[data-testid="revenue-chart"]')
  
  // Verify key metrics are displayed
  await expect(page.locator('[data-testid="total-revenue"]')).toContainText('$')
  await expect(page.locator('[data-testid="total-expenses"]')).toContainText('$')
  await expect(page.locator('[data-testid="net-profit"]')).toBeVisible()
  
  // Check that charts render
  const chart = page.locator('.recharts-wrapper')
  await expect(chart).toBeVisible()
})
```

**Example 2: AI query interaction**
```typescript
test('AI query functionality works end-to-end', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Enter a financial question
  await page.fill('[data-testid="query-input"]', 
    'What were our top expenses last quarter?')
  
  // Submit the query
  await page.click('[data-testid="submit-query"]')
  
  // Wait for AI response
  await page.waitForSelector('[data-testid="ai-response"]')
  
  // Verify response contains expected elements
  const response = page.locator('[data-testid="ai-response"]')
  await expect(response).toContainText('expenses')
  await expect(response).toContainText('$')  // Contains monetary values
  
  // Check that SQL was generated
  await expect(page.locator('[data-testid="generated-sql"]')).toBeVisible()
})
```

**Example 3: Authentication flow**
```typescript
test('user authentication and session management', async ({ page }) => {
  // Attempt to access protected route
  await page.goto('http://localhost:3000/dashboard')
  
  // Should redirect to login
  await expect(page).toHaveURL(/.*login/)
  
  // Login process
  await page.fill('[data-testid="username"]', 'testuser')
  await page.fill('[data-testid="password"]', 'testpass')
  await page.click('[data-testid="login-button"]')
  
  // Should redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/)
  
  // Verify user is logged in
  await expect(page.locator('[data-testid="user-menu"]')).toContainText('testuser')
  
  // Test logout
  await page.click('[data-testid="logout-button"]')
  await expect(page).toHaveURL(/.*login/)
})
```

**Example 4: File export functionality**
```typescript
test('data export works correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard')
  
  // Click export button
  const downloadPromise = page.waitForEvent('download')
  await page.click('[data-testid="export-button"]')
  const download = await downloadPromise
  
  // Verify download
  expect(download.suggestedFilename()).toBe('financial_report.xlsx')
  
  // Could also save and verify file contents
  const path = await download.path()
  // Additional file validation here
})
```

**Example 5: Visual regression testing**
```typescript
test('dashboard visual regression', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard')
  
  // Wait for content to load
  await page.waitForSelector('[data-testid="dashboard-content"]')
  
  // Take screenshot for visual comparison
  await expect(page).toHaveScreenshot('dashboard-loaded.png', {
    fullPage: true,
    threshold: 0.1  // Allow 10% difference
  })
})
```

---

## Key Concepts

- **Browser contexts**: Isolated browser sessions for testing
- **Page objects**: Represent web pages and their interactions
- **Locators**: Methods to find elements on pages
- **Assertions**: Verify expected vs actual behavior
- **Screenshots/videos**: Capture test execution for debugging
- **Parallel execution**: Run tests simultaneously for speed

---

## Alternatives We Considered

- **Selenium**: Older, slower, more complex setup
- **Cypress**: Good but limited to Chromium-based browsers
- **Puppeteer**: Powerful but JavaScript-only
- **Manual testing**: Not scalable or repeatable

---

## Getting Started

1. **Install Playwright**: `npm install -D @playwright/test`
2. **Install browsers**: `npx playwright install`
3. **Create test file**: Write tests in .spec.ts files
4. **Run tests**: `npx playwright test`
5. **Debug tests**: `npx playwright test --headed --debug`

---

## Common Patterns & Best Practices

1. **Page Object Model**: Encapsulate page interactions in classes
2. **Data-testid attributes**: Use stable selectors for elements
3. **Wait strategies**: Use explicit waits instead of sleep
4. **Test isolation**: Each test should be independent
5. **Screenshot on failure**: Capture state when tests fail

---

## Troubleshooting

**Issue 1:** Flaky tests due to timing  
**Solution:** Use proper wait conditions and retry logic

**Issue 2:** Element not found  
**Solution:** Use more stable selectors and wait strategies

---

## Learning Resources

**Essential:**
- [Playwright Documentation](https://playwright.dev/)
- [Getting Started Guide](https://playwright.dev/docs/intro)

**Recommended:**
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Web Apps with Playwright](https://www.smashingmagazine.com/2021/12/playwright-testing/)

**Community:**
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright Slack](https://playwright.slack.com/)

---

**Related Technologies:**
- [React](https://react.dev/) - Frontend framework being tested
- [Vitest](vitest.md) - Unit testing complement
- [TypeScript](https://www.typescriptlang.org/) - Language used for tests
