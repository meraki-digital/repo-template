# Recharts 2.5+

**Category:** Frontend  
**Official Docs:** https://recharts.org/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

Recharts is a composable charting library built on React components that makes it easy to create interactive data visualizations. Think of it as a set of LEGO blocks for charts - you combine different components (like bars, lines, axes) to build exactly the chart you need. Version 2.5+ includes performance improvements and new features.

In simple terms: Recharts gives you pre-built React components for charts instead of writing complex SVG or Canvas code from scratch. You just pass your data as props and it handles the visualization.

---

## Why We're Using It In This Project

- **Interactive Financial Charts:** Our dashboard needs clickable, hoverable charts for exploring financial trends - Recharts provides responsive interactions out of the box
- **React Integration:** Works seamlessly with our React components and TypeScript, allowing us to embed charts directly in dashboard layouts
- **Performance:** Handles large datasets efficiently, crucial for displaying millions of financial transactions
- **Customization:** Highly customizable while maintaining consistency across all dashboard visualizations
- **Developer Experience:** Declarative API makes it easy to create complex charts with less code

---

## How We'll Use It

**Example 1: Revenue Trend Line Chart**
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 35000 },
  // ... more data
];

const RevenueChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="revenue" 
        stroke="#10b981" 
        strokeWidth={3}
        dot={{ r: 6 }}
      />
      <Line 
        type="monotone" 
        dataKey="expenses" 
        stroke="#ef4444" 
        strokeWidth={3}
        dot={{ r: 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
);
```

**Example 2: Job Profitability Bar Chart**
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const jobData = [
  { job: 'Job A', profit: 15000, revenue: 50000 },
  { job: 'Job B', profit: 8000, revenue: 35000 },
  // ... more jobs
];

const JobProfitChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={jobData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="job" />
      <YAxis />
      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
      <Bar dataKey="profit" fill="#3b82f6" />
    </BarChart>
  </ResponsiveContainer>
);
```

---

## Key Concepts

- **Composability:** Build charts by combining components (Chart, Axis, Series, etc.)
- **Data Binding:** Charts automatically render from array of objects with dataKey props
- **Responsive Design:** Charts adapt to container size with ResponsiveContainer
- **Interactive Elements:** Built-in tooltips, legends, and hover effects
- **Customization:** Extensive props for styling, colors, and behavior

---

## Alternatives We Considered

- **Chart.js:** Popular but not React-native, requires more integration work - Recharts is built for React
- **D3.js:** Extremely powerful but has steep learning curve and lots of boilerplate - Recharts provides the 80% use case with less code
- **Plotly.js:** Great for advanced charts but heavier bundle size - Recharts is lighter and sufficient for our financial dashboards
- **Victory:** Similar to Recharts but less mature ecosystem - Recharts has better documentation and community

---

## Getting Started

1. **Installation:** `npm install recharts`
2. **Import Components:** `import { LineChart, BarChart } from 'recharts'`
3. **Prepare Data:** Format data as array of objects
4. **Wrap in ResponsiveContainer:** For responsive behavior
5. **Add Interactions:** Include Tooltip, Legend as needed

---

## Common Patterns & Best Practices

1. **Use ResponsiveContainer:** Always wrap charts for responsive design
2. **Format Data Appropriately:** Ensure data keys match component dataKey props
3. **Customize Tooltips:** Use formatter functions for currency display
4. **Handle Loading States:** Show loading indicators for data fetch
5. **Optimize Performance:** Use memoization for expensive chart calculations

---

## Troubleshooting

**Issue 1: Chart not rendering**  
**Solution:** Check data format and ensure all required components (XAxis, YAxis) are included

**Issue 2: Responsive issues**  
**Solution:** Always use ResponsiveContainer and ensure parent has defined height

**Issue 3: Performance with large datasets**  
**Solution:** Implement data sampling or pagination for very large datasets

---

## Learning Resources

**Essential:**
- [Recharts Documentation](https://recharts.org/en-US/guide) - Official guide with examples
- [Recharts API Reference](https://recharts.org/en-US/api) - Component props and options

**Recommended:**
- [Recharts Examples](https://recharts.org/en-US/examples) - Gallery of chart types
- [React Charts Comparison](https://www.sitepoint.com/react-charting-libraries/) - Library comparisons

**Community:**
- [Recharts GitHub](https://github.com/recharts/recharts) - Issues and feature requests
- [Stack Overflow](https://stackoverflow.com/questions/tagged/recharts) - Community Q&A

---

**Related Technologies:**
- React - UI framework that Recharts integrates with
- TypeScript - Provides type safety for chart data and props
- Tailwind CSS - Can be used for additional styling around charts
