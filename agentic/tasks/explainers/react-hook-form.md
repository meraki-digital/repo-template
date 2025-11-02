# React Hook Form

**Category:** Frontend  
**Official Docs:** https://react-hook-form.com/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

React Hook Form is a performant, flexible forms library for React that makes form validation and handling easy. Think of it as a smart form manager that handles validation, error messages, and form state without the performance issues of controlled components.

In simple terms: React Hook Form is like a professional form coordinator - it manages all the complex logic of form inputs, validation, and submission, letting you focus on building great user experiences for your dashboard forms.

---

## Why We're Using It In This Project

- **Form Performance:** Our dashboard has complex forms for report generation, user settings, and data filters that need to perform well with large datasets
- **Easy Validation:** Built-in validation with clear error messages for financial data entry
- **Developer Experience:** Less boilerplate code compared to controlled forms
- **Integration:** Works seamlessly with our UI components and TypeScript
- **Accessibility:** Built-in support for form accessibility standards

---

## How We'll Use It

**Example 1: Report Generation Form**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const reportSchema = z.object({
  name: z.string().min(1, 'Report name is required'),
  type: z.enum(['financial', 'operational', 'custom']),
  dateRange: z.object({
    start: z.string().min(1, 'Start date is required'),
    end: z.string().min(1, 'End date is required')
  }),
  includeCharts: z.boolean(),
  email: z.string().email('Invalid email').optional()
});

type ReportForm = z.infer<typeof reportSchema>;

const ReportForm = ({ onSubmit }: { onSubmit: (data: ReportForm) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: 'financial',
      includeCharts: true,
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      }
    }
  });

  const reportType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Name
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Q4 Financial Summary"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Type
        </label>
        <select
          {...register('type')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="financial">Financial Report</option>
          <option value="operational">Operational Report</option>
          <option value="custom">Custom Report</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            {...register('dateRange.start')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dateRange?.start && (
            <p className="mt-1 text-sm text-red-600">{errors.dateRange.start.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            {...register('dateRange.end')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dateRange?.end && (
            <p className="mt-1 text-sm text-red-600">{errors.dateRange.end.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          {...register('includeCharts')}
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Include charts in report
        </label>
      </div>

      {reportType === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Report (Optional)
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="user@company.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Generating Report...' : 'Generate Report'}
      </button>
    </form>
  );
};
```

**Example 2: User Settings Form with Validation**
```tsx
import { useForm, Controller } from 'react-hook-form';

interface UserSettings {
  name: string;
  email: string;
  notifications: {
    email: boolean;
    push: boolean;
    reports: boolean;
  };
  timezone: string;
  currency: string;
}

const UserSettingsForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<UserSettings>({
    defaultValues: {
      notifications: {
        email: true,
        push: false,
        reports: true
      }
    }
  });

  const onSubmit = (data: UserSettings) => {
    console.log('Updating settings:', data);
    // Call API to update user settings
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              {...field}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="notifications.email"
        control={control}
        render={({ field }) => (
          <div className="flex items-center">
            <input
              {...field}
              type="checkbox"
              checked={field.value}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-900">
              Email notifications
            </label>
          </div>
        )}
      />

      <Controller
        name="timezone"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        )}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Save Settings
      </button>
    </form>
  );
};
```

---

## Key Concepts

- **useForm:** Main hook that provides form state and methods
- **register:** Connects form inputs to React Hook Form
- **handleSubmit:** Handles form submission with validation
- **formState:** Contains errors, isSubmitting, isValid, etc.
- **Controller:** For complex components that need manual control

---

## Alternatives We Considered

- **Controlled Components:** Manual state management - too verbose for complex forms
- **Formik:** Popular alternative but heavier and more boilerplate
- **React Final Form:** Similar to Formik, more complex than needed
- **Native HTML Validation:** Limited styling and error handling control

---

## Getting Started

1. **Installation:** `npm install react-hook-form @hookform/resolvers zod`
2. **Import:** `import { useForm } from 'react-hook-form'`
3. **Create Form:** Use useForm hook with configuration
4. **Register Inputs:** Use register() or Controller for inputs
5. **Handle Submit:** Use handleSubmit with validation

---

## Common Patterns & Best Practices

1. **Schema Validation:** Use Zod or Yup with resolvers
2. **Default Values:** Set sensible defaults for better UX
3. **Error Display:** Show validation errors clearly
4. **Loading States:** Disable submit during form submission
5. **Dirty State:** Track if form has unsaved changes

---

## Troubleshooting

**Issue 1: Form not submitting**  
**Solution:** Ensure handleSubmit wraps the submit function

**Issue 2: Validation not working**  
**Solution:** Check resolver configuration and schema

**Issue 3: Re-renders on every keystroke**  
**Solution:** Use Controller for complex components or debounce

---

## Learning Resources

**Essential:**
- [React Hook Form Docs](https://react-hook-form.com/) - Official documentation
- [API Reference](https://react-hook-form.com/api) - Complete API

**Recommended:**
- [Advanced Usage](https://react-hook-form.com/advanced-usage) - Complex patterns
- [Examples](https://react-hook-form.com/examples) - Code examples

**Community:**
- [GitHub](https://github.com/react-hook-form/react-hook-form) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-hook-form) - Community solutions

---

**Related Technologies:**
- Zod - Schema validation for forms
- TypeScript - Type safety for form data
- React - Framework for form components
