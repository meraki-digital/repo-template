# date-fns

**Category:** Frontend  
**Official Docs:** https://date-fns.org/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

date-fns is a modern JavaScript date utility library that provides a comprehensive set of functions for manipulating dates in a functional, immutable way. Think of it as a Swiss Army knife for date operations - formatting, parsing, comparing, and calculating date differences.

In simple terms: date-fns is a collection of small, focused functions that make working with dates in JavaScript safe and easy. Instead of mutating dates (which causes bugs), it returns new date objects for every operation.

---

## Why We're Using It In This Project

- **Immutable Operations:** Prevents bugs from accidentally modifying date objects
- **Tree Shaking:** Only bundle the functions you use, keeping app size small
- **Financial Date Calculations:** Accurate date math for fiscal periods, aging reports, and time-based analytics
- **Localization:** Support for different locales and date formats
- **TypeScript Support:** Excellent type definitions for type safety

---

## How We'll Use It

**Example 1: Financial Period Calculations**
```typescript
import { 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear, 
  addMonths, 
  subMonths,
  format,
  eachMonthOfInterval
} from 'date-fns';

class FinancialPeriods {
  // Get fiscal quarters (assuming fiscal year starts in April)
  static getFiscalQuarter(date: Date): { quarter: number; year: number } {
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Fiscal year starts in April (month 3)
    if (month >= 3) {
      return { quarter: Math.floor((month - 3) / 3) + 1, year };
    } else {
      return { quarter: Math.floor((month + 9) / 3) + 1, year: year - 1 };
    }
  }

  // Get fiscal year dates
  static getFiscalYearDates(fiscalYear: number): { start: Date; end: Date } {
    // Fiscal year starts April 1st
    const start = new Date(fiscalYear, 3, 1); // April 1st
    const end = new Date(fiscalYear + 1, 2, 31); // March 31st next year
    
    return { start, end };
  }

  // Generate monthly periods for a date range
  static getMonthlyPeriods(startDate: Date, endDate: Date): Array<{
    start: Date;
    end: Date;
    label: string;
  }> {
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    
    return months.map(month => ({
      start: startOfMonth(month),
      end: endOfMonth(month),
      label: format(month, 'MMM yyyy')
    }));
  }

  // Calculate aging buckets for receivables
  static getAgingBuckets(invoiceDate: Date, currentDate: Date = new Date()) {
    const daysDiff = differenceInDays(currentDate, invoiceDate);
    
    if (daysDiff <= 30) return 'Current';
    if (daysDiff <= 60) return '31-60 days';
    if (daysDiff <= 90) return '61-90 days';
    if (daysDiff <= 120) return '91-120 days';
    return '120+ days';
  }
}

// Usage in components
const FinancialReportFilters = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getPeriodDates = () => {
    switch (selectedPeriod) {
      case 'monthly':
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate)
        };
      case 'quarterly':
        return {
          start: startOfQuarter(selectedDate),
          end: endOfQuarter(selectedDate)
        };
      case 'yearly':
        return {
          start: startOfYear(selectedDate),
          end: endOfYear(selectedDate)
        };
    }
  };

  const periodDates = getPeriodDates();

  return (
    <div>
      <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as any)}>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>
      
      <DatePicker
        selected={selectedDate}
        onChange={setSelectedDate}
        dateFormat="MMM yyyy"
        showMonthYearPicker={selectedPeriod === 'monthly'}
        showQuarterYearPicker={selectedPeriod === 'quarterly'}
        showYearPicker={selectedPeriod === 'yearly'}
      />
      
      <p>
        Period: {format(periodDates.start, 'MMM d, yyyy')} - {format(periodDates.end, 'MMM d, yyyy')}
      </p>
    </div>
  );
};
```

**Example 2: Date Formatting and Validation**
```typescript
import { 
  format, 
  parse, 
  isValid, 
  isBefore, 
  isAfter, 
  differenceInDays, 
  differenceInMonths, 
  addDays, 
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval
} from 'date-fns';

class DateUtils {
  // Format dates for display
  static formatForDisplay(date: Date, formatType: 'short' | 'medium' | 'long' = 'medium'): string {
    const formats = {
      short: 'MMM d, yyyy',      // Jan 15, 2024
      medium: 'MMM d, yyyy h:mm a', // Jan 15, 2024 2:30 PM
      long: 'EEEE, MMMM d, yyyy'   // Monday, January 15, 2024
    };
    
    return format(date, formats[formatType]);
  }

  // Parse various date formats
  static parseFlexibleDate(dateString: string): Date | null {
    const formats = [
      'yyyy-MM-dd',
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'MMM d, yyyy',
      'MMMM d, yyyy'
    ];

    for (const fmt of formats) {
      try {
        const parsed = parse(dateString, fmt, new Date());
        if (isValid(parsed)) {
          return parsed;
        }
      } catch {
        continue;
      }
    }
    
    return null;
  }

  // Calculate business days between dates
  static getBusinessDays(startDate: Date, endDate: Date): number {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days.filter(day => {
      const dayOfWeek = day.getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6; // Not Saturday or Sunday
    }).length;
  }

  // Generate date ranges for charts
  static generateDateRange(startDate: Date, endDate: Date, interval: 'day' | 'week' | 'month'): Date[] {
    const dates: Date[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      dates.push(new Date(current));
      
      switch (interval) {
        case 'day':
          current = addDays(current, 1);
          break;
        case 'week':
          current = addDays(current, 7);
          break;
        case 'month':
          current = addMonths(current, 1);
          break;
      }
    }

    return dates;
  }

  // Validate date ranges for reports
  static validateDateRange(startDate: Date, endDate: Date): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (isAfter(startDate, endDate)) {
      errors.push('Start date must be before end date');
    }
    
    if (isAfter(startDate, new Date())) {
      errors.push('Start date cannot be in the future');
    }
    
    const maxRange = 365; // 1 year max
    if (differenceInDays(endDate, startDate) > maxRange) {
      errors.push(`Date range cannot exceed ${maxRange} days`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Usage in transaction aging report
const TransactionAgingReport = ({ transactions }: { transactions: Transaction[] }) => {
  const now = new Date();
  
  const agedTransactions = transactions.map(transaction => ({
    ...transaction,
    ageInDays: differenceInDays(now, new Date(transaction.date)),
    ageBucket: FinancialPeriods.getAgingBuckets(new Date(transaction.date), now),
    isOverdue: isBefore(new Date(transaction.dueDate), now)
  }));

  const summary = {
    current: agedTransactions.filter(t => t.ageBucket === 'Current').length,
    overdue: agedTransactions.filter(t => t.isOverdue).length,
    totalAmount: agedTransactions.reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-blue-800">{summary.current}</h3>
          <p className="text-blue-600">Current</p>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-red-800">{summary.overdue}</h3>
          <p className="text-red-600">Overdue</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-green-800">
            ${summary.totalAmount.toLocaleString()}
          </h3>
          <p className="text-green-600">Total Value</p>
        </div>
      </div>
      
      {/* Transaction table with formatted dates */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Age</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {agedTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td className="border border-gray-300 p-2">
                {DateUtils.formatForDisplay(new Date(transaction.date), 'short')}
              </td>
              <td className="border border-gray-300 p-2">{transaction.description}</td>
              <td className="border border-gray-300 p-2">${transaction.amount.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">{transaction.ageInDays} days</td>
              <td className={`border border-gray-300 p-2 ${
                transaction.isOverdue ? 'text-red-600' : 'text-green-600'
              }`}>
                {transaction.isOverdue ? 'Overdue' : 'Current'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## Key Concepts

- **Immutable Operations:** All functions return new Date objects
- **Functional Programming:** Pure functions with no side effects
- **Modular Imports:** Import only the functions you need
- **TypeScript Support:** Full type definitions included
- **Locale Support:** Internationalization for different languages

---

## Alternatives We Considered

- **Moment.js:** Feature-rich but heavy bundle size
- **Day.js:** Similar API but less comprehensive
- **Native Date:** Error-prone and inconsistent
- **Luxon:** Good but more complex API

---

## Getting Started

1. **Installation:** `npm install date-fns`
2. **Import Functions:** `import { format, addDays } from 'date-fns'`
3. **Use Functions:** `const tomorrow = addDays(new Date(), 1)`
4. **Format Dates:** `format(date, 'yyyy-MM-dd')`
5. **Chain Operations:** Functions can be chained safely

---

## Common Patterns & Best Practices

1. **Import Selectively:** Only import needed functions
2. **Handle Timezones:** Be aware of timezone implications
3. **Validate Dates:** Check isValid() before operations
4. **Consistent Formatting:** Use consistent format strings
5. **Error Handling:** Wrap operations in try-catch for safety

---

## Troubleshooting

**Issue 1: Unexpected date results**  
**Solution:** Check timezone handling and date object creation

**Issue 2: Bundle size concerns**  
**Solution:** Use selective imports to tree-shake unused functions

**Issue 3: Parsing failures**  
**Solution:** Try multiple format strings and validate results

---

## Learning Resources

**Essential:**
- [date-fns Documentation](https://date-fns.org/) - Official docs
- [API Reference](https://date-fns.org/docs/) - Function reference

**Recommended:**
- [Guides](https://date-fns.org/docs/Getting-Started) - Getting started
- [Examples](https://date-fns.org/docs/Examples) - Code examples

**Community:**
- [GitHub](https://github.com/date-fns/date-fns) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/date-fns) - Community solutions

---

**Related Technologies:**
- TypeScript - Type safety for date operations
- React - Framework using date utilities
- react-datepicker - Date picker component integration
- React Hook Form - Form validation with date fields
