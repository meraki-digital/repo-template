# Zod

**Category:** Frontend  
**Official Docs:** https://zod.dev/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

Zod is a TypeScript-first schema declaration and validation library that provides runtime type checking and validation. Think of it as a way to define data structures that automatically validate data at runtime while providing excellent TypeScript integration.

In simple terms: Zod is like a smart data inspector that checks if the data your app receives matches the expected format. It ensures financial data is valid before processing, preventing errors from bad API responses or user inputs.

---

## Why We're Using It In This Project

- **Runtime Type Safety:** Our financial dashboard handles critical data - Zod validates API responses and form inputs to prevent runtime errors
- **Form Validation:** Integrated with React Hook Form for robust form validation with clear error messages
- **API Data Validation:** Ensures data from our FastAPI backend matches expected structures
- **TypeScript Integration:** Generates TypeScript types from schemas, reducing duplication
- **Developer Experience:** Clear, readable schema definitions with excellent error messages

---

## How We'll Use It

**Example 1: API Response Validation**
```typescript
import { z } from 'zod';

// Define schema for financial transaction data
const TransactionSchema = z.object({
  id: z.number().int().positive(),
  amount: z.number().finite(),
  description: z.string().min(1).max(200),
  date: z.string().datetime(), // ISO date string
  category: z.enum(['revenue', 'labor', 'materials', 'equipment', 'other']),
  accountId: z.number().int().positive(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional() // Flexible additional data
});

// Schema for paginated API responses
const PaginatedResponseSchema = z.object({
  data: z.array(TransactionSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean()
});

// Usage in API client
export type Transaction = z.infer<typeof TransactionSchema>;
export type PaginatedTransactions = z.infer<typeof PaginatedResponseSchema>;

export class FinancialAPI {
  async getTransactions(params: {
    accountId: number;
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedTransactions> {
    const response = await fetch(`/api/accounts/${params.accountId}/transactions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const rawData = await response.json();
    
    // Validate response data
    try {
      return PaginatedResponseSchema.parse(rawData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('API Response validation failed:', error.errors);
        throw new Error('Invalid API response format');
      }
      throw error;
    }
  }
}
```

**Example 2: Form Validation Schemas**
```typescript
import { z } from 'zod';

// Base user schema
const UserSchema = z.object({
  id: z.number().int().positive().optional(), // Optional for creation
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.enum(['admin', 'manager', 'user'], {
    errorMap: () => ({ message: 'Invalid role selected' })
  }),
  department: z.string().min(1, 'Department is required'),
  isActive: z.boolean().default(true)
});

// Password schema with confirmation
const PasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Combined registration schema
const UserRegistrationSchema = UserSchema.omit({ id: true, isActive: true })
  .merge(PasswordSchema);

// Report generation schema
const ReportSchema = z.object({
  name: z.string().min(1, 'Report name is required').max(100),
  type: z.enum(['financial', 'operational', 'custom']),
  dateRange: z.object({
    start: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid start date'
    }),
    end: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date'
    })
  }).refine((range) => new Date(range.start) <= new Date(range.end), {
    message: 'Start date must be before or equal to end date',
    path: ['start']
  }),
  filters: z.object({
    categories: z.array(z.string()).default([]),
    minAmount: z.number().min(0).optional(),
    maxAmount: z.number().min(0).optional(),
    accounts: z.array(z.number().int().positive()).default([])
  }).optional(),
  format: z.enum(['pdf', 'csv', 'excel']).default('pdf'),
  includeCharts: z.boolean().default(true),
  emailDelivery: z.object({
    enabled: z.boolean(),
    recipients: z.array(z.string().email()).optional()
  }).optional()
}).transform((data) => ({
  ...data,
  // Transform dates to Date objects
  dateRange: {
    start: new Date(data.dateRange.start),
    end: new Date(data.dateRange.end)
  }
}));

// Type exports for use in components
export type User = z.infer<typeof UserSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type ReportConfig = z.infer<typeof ReportSchema>;

// Validation helper functions
export const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};

export const validateReport = (data: unknown): ReportConfig => {
  return ReportSchema.parse(data);
};

export const safeValidateUser = (data: unknown) => {
  return UserSchema.safeParse(data);
};
```

**Example 3: Environment Configuration Validation**
```typescript
import { z } from 'zod';

// Environment variables schema
const EnvSchema = z.object({
  // API Configuration
  REACT_APP_API_BASE_URL: z.string().url('Invalid API base URL'),
  REACT_APP_API_TIMEOUT: z.coerce.number().int().min(1000).max(30000).default(10000),
  
  // Authentication
  REACT_APP_AUTH_REDIRECT_URL: z.string().url().optional(),
  REACT_APP_OAUTH_CLIENT_ID: z.string().min(1, 'OAuth client ID is required'),
  
  // Feature Flags
  REACT_APP_ENABLE_ADVANCED_REPORTS: z.coerce.boolean().default(false),
  REACT_APP_MAX_UPLOAD_SIZE_MB: z.coerce.number().int().min(1).max(100).default(10),
  
  // Analytics
  REACT_APP_ANALYTICS_ID: z.string().optional(),
  REACT_APP_SENTRY_DSN: z.string().url().optional(),
  
  // Development
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
});

// Validate environment at startup
const env = EnvSchema.parse(process.env);

export default env;

// Type-safe environment access
export type Environment = z.infer<typeof EnvSchema>;
```

---

## Key Concepts

- **Schema Definition:** Declarative way to define data structures
- **Type Inference:** Automatic TypeScript types from schemas
- **Validation:** Runtime checking with detailed error messages
- **Transformation:** Modify data during validation (transform())
- **Refinement:** Add custom validation logic (refine())

---

## Alternatives We Considered

- **Manual Type Guards:** Error-prone and lots of boilerplate
- **Yup:** Popular alternative but less TypeScript-focused
- **Joi:** More complex API than Zod
- **io-ts:** Functional programming approach, steeper learning curve

---

## Getting Started

1. **Installation:** `npm install zod`
2. **Import:** `import { z } from 'zod'`
3. **Define Schema:** `const Schema = z.object({...})`
4. **Validate:** `Schema.parse(data)` or `Schema.safeParse(data)`
5. **Get Types:** `type MyType = z.infer<typeof Schema>`

---

## Common Patterns & Best Practices

1. **Co-locate Schemas:** Define schemas near where they're used
2. **Reuse Schemas:** Compose complex schemas from simpler ones
3. **Custom Errors:** Provide clear error messages for users
4. **Optional Fields:** Use `.optional()` for non-required fields
5. **Default Values:** Use `.default()` for sensible defaults

---

## Troubleshooting

**Issue 1: Validation fails unexpectedly**  
**Solution:** Check schema definition and use safeParse() for debugging

**Issue 2: Type inference not working**  
**Solution:** Ensure schema is properly typed and exported

**Issue 3: Transform not applying**  
**Solution:** Transforms run after validation, check order of operations

---

## Learning Resources

**Essential:**
- [Zod Documentation](https://zod.dev/) - Official docs
- [API Reference](https://zod.dev/?id=api-reference) - Complete API

**Recommended:**
- [Zod Examples](https://zod.dev/?id=examples) - Code examples
- [Advanced Usage](https://zod.dev/?id=advanced-usage) - Complex patterns

**Community:**
- [Zod GitHub](https://github.com/colinhacks/zod) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/zod) - Community solutions

---

**Related Technologies:**
- TypeScript - Language that Zod integrates with
- React Hook Form - Form validation using Zod schemas
- FastAPI - Backend validation that could use similar schemas
