# react-datepicker

**Category:** Frontend  
**Official Docs:** https://reactdatepicker.com/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

React DatePicker is a flexible, customizable date picker component for React that provides an intuitive calendar interface for date selection. Think of it as a professional calendar widget that users can interact with to select dates, date ranges, and times.

In simple terms: React DatePicker gives your users a beautiful, accessible calendar popup to pick dates instead of typing them manually. It's like having a digital calendar built into your forms.

---

## Why We're Using It In This Project

- **Date Range Selection:** Our financial reports and filters need accurate date range inputs
- **User Experience:** Intuitive calendar interface reduces input errors compared to text fields
- **Accessibility:** Screen reader compatible and keyboard navigable
- **Customization:** Matches our Tailwind CSS design system
- **Localization:** Supports different date formats and languages

---

## How We'll Use It

**Example 1: Report Date Range Picker**
```tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const ReportDateRangePicker = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDateRange({ start, end });
    
    // Auto-close when both dates are selected
    if (start && end) {
      setIsOpen(false);
    }
  };

  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This year', days: 365 }
  ];

  const applyPreset = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateRange({ start, end });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Report Date Range
      </label>
      
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <DatePicker
            selectsRange={true}
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={handleDateChange}
            open={isOpen}
            onInputClick={() => setIsOpen(true)}
            onClickOutside={() => setIsOpen(false)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select date range"
            dateFormat="MMM d, yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            maxDate={new Date()}
            calendarClassName="custom-calendar"
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            📅
          </button>
          
          {isOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="p-2">
                <h4 className="font-medium text-sm mb-2">Quick Select</h4>
                {presets.map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset.days)}
                    className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Display selected range */}
      {dateRange.start && dateRange.end && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
```

**Example 2: Transaction Date Filter**
```tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

const TransactionDateFilter = ({ 
  selectedDate, 
  onDateChange 
}: {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">
        Transaction Date:
      </label>
      
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            onDateChange(date);
            setIsCalendarOpen(false);
          }}
          open={isCalendarOpen}
          onInputClick={() => setIsCalendarOpen(true)}
          onClickOutside={() => setIsCalendarOpen(false)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholderText="Select date"
          dateFormat="yyyy-MM-dd"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          maxDate={new Date()}
          minDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)} // 1 year ago
          isClearable
          showIcon
          icon={
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>
      
      {selectedDate && (
        <button
          onClick={() => onDateChange(null)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      )}
    </div>
  );
};
```

---

## Key Concepts

- **Single Date Selection:** Basic date picker for single dates
- **Range Selection:** Select start and end dates together
- **Customization:** Date formats, min/max dates, disabled dates
- **Localization:** Different languages and date formats
- **Accessibility:** Keyboard navigation and screen reader support

---

## Alternatives We Considered

- **HTML date input:** Basic but inconsistent across browsers
- **Custom calendar:** Time-consuming to build and maintain
- **Other date libraries:** Less React-native integration
- **No date picker:** Manual date input prone to errors

---

## Getting Started

1. **Installation:** `npm install react-datepicker`
2. **Import:** `import DatePicker from 'react-datepicker'`
3. **Include CSS:** `import 'react-datepicker/dist/react-datepicker.css'`
4. **Use Component:** `<DatePicker selected={date} onChange={setDate} />`
5. **Customize:** Add props for dateFormat, minDate, etc.

---

## Common Patterns & Best Practices

1. **Controlled Component:** Always use selected and onChange
2. **Date Validation:** Use minDate/maxDate for constraints
3. **Format Consistency:** Use consistent dateFormat across app
4. **Loading States:** Disable picker during data loading
5. **Accessibility:** Include proper labels and ARIA attributes

---

## Troubleshooting

**Issue 1: Calendar not showing**  
**Solution:** Check CSS import and z-index conflicts

**Issue 2: Date format issues**  
**Solution:** Use consistent dateFormat prop and handle timezone

**Issue 3: Mobile responsiveness**  
**Solution:** Test on mobile devices and adjust positioning

---

## Learning Resources

**Essential:**
- [React DatePicker Docs](https://reactdatepicker.com/) - Official documentation
- [API Reference](https://reactdatepicker.com/#api) - Complete props

**Recommended:**
- [Examples](https://reactdatepicker.com/#examples) - Code examples
- [Styling Guide](https://reactdatepicker.com/#styling) - Customization

**Community:**
- [GitHub](https://github.com/Hacker0x01/react-datepicker) - Issues and discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-datepicker) - Community solutions

---

**Related Technologies:**
- React - Framework for the component
- Tailwind CSS - Styling the date picker
- React Hook Form - Form integration
- date-fns - Date manipulation utilities
