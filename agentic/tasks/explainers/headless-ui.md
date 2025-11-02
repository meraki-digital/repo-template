# Headless UI

**Category:** Frontend  
**Official Docs:** https://headlessui.com/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

Headless UI is a library of completely unstyled, accessible UI components designed to integrate perfectly with Tailwind CSS and other styling solutions. Think of it as the "logic layer" for common UI patterns - it handles all the complex accessibility, keyboard navigation, and interaction logic while leaving the styling entirely up to you.

In simple terms: Headless UI gives you the brains for dropdowns, modals, and menus without any visual styling. You bring your own Tailwind classes to make it look exactly how you want. It's like having a professional driver for your car - they handle all the complex driving logic while you control the appearance.

---

## Why We're Using It In This Project

- **Accessibility First:** Financial dashboards must be usable by everyone - Headless UI ensures WCAG compliance for our complex data interfaces
- **Tailwind Integration:** Perfect pairing with our CSS framework - style components exactly as needed
- **Developer Productivity:** Pre-built interaction logic saves time on dropdowns, modals, and navigation
- **Consistency:** Standardized behavior across all dashboard interactions
- **Lightweight:** Only includes used components, keeping bundle size small

---

## How We'll Use It

**Example 1: Financial Report Export Dropdown**
```tsx
import { Menu } from '@headlessui/react'

const ExportMenu = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Export Report
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportToFormat('pdf')}
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex items-center px-4 py-2 text-sm w-full`}
              >
                <DocumentIcon className="mr-3 h-5 w-5" />
                Export as PDF
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportToFormat('csv')}
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex items-center px-4 py-2 text-sm w-full`}
              >
                <TableIcon className="mr-3 h-5 w-5" />
                Export as CSV
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  )
}
```

**Example 2: Date Range Filter Modal**
```tsx
import { Dialog } from '@headlessui/react'

const DateFilterModal = ({ isOpen, setIsOpen, onApply }: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onApply: (range: DateRange) => void;
}) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(),
    end: new Date()
  });

  return (
    <Dialog 
      open={isOpen} 
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
              Select Date Range
            </Dialog.Title>
            
            <div className="mt-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApply(dateRange);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Apply Filter
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
```

---

## Key Concepts

- **Unstyled Components:** Pure behavior and accessibility, zero opinions on appearance
- **Render Props:** Flexible API that lets you control rendering and styling
- **Accessibility (A11y):** Built-in ARIA attributes and keyboard navigation
- **State Management:** Handles open/closed states, focus management, and transitions
- **Composition:** Components work together (Menu.Button + Menu.Items)

---

## Alternatives We Considered

- **Styled Component Libraries:** Bootstrap/Material-UI have opinions on styling that conflict with our Tailwind approach
- **Custom Components:** Building accessible dropdowns from scratch would be time-consuming and error-prone
- **Radix UI:** Very similar, but Headless UI has better React integration
- **No library:** Would require implementing complex accessibility patterns ourselves

---

## Getting Started

1. **Installation:** `npm install @headlessui/react`
2. **Import Components:** `import { Menu, Dialog } from '@headlessui/react'`
3. **Style with Tailwind:** Apply your own classes to the render prop elements
4. **Handle State:** Use React state for controlled components

---

## Common Patterns & Best Practices

1. **Use Render Props:** Access active/focused states for styling
2. **Combine with Tailwind:** Leverage utility classes for responsive design
3. **Handle Focus Management:** Let Headless UI manage focus automatically
4. **Use Semantic HTML:** Choose appropriate ARIA roles
5. **Test Accessibility:** Use screen readers to verify implementations

---

## Troubleshooting

**Issue 1: Component not closing on outside click**  
**Solution:** Ensure the Dialog/Modal is properly structured with backdrop

**Issue 2: Keyboard navigation not working**  
**Solution:** Check that components are not wrapped in elements that interfere with focus

**Issue 3: Styling conflicts**  
**Solution:** Use Tailwind's @layer directive to avoid specificity issues

---

## Learning Resources

**Essential:**
- [Headless UI Documentation](https://headlessui.com/) - Component guides and examples
- [React Integration Guide](https://headlessui.com/react/menu) - Framework-specific usage

**Recommended:**
- [A11y Resources](https://www.w3.org/WAI/ARIA/apg/) - Accessibility guidelines
- [Tailwind + Headless UI Examples](https://tailwindui.com/) - Styled component examples

**Community:**
- [Headless UI GitHub](https://github.com/tailwindlabs/headlessui) - Issues and feature requests
- [Tailwind Discord](https://tailwindcss.com/discord) - Community discussions

---

**Related Technologies:**
- React - Framework that Headless UI components integrate with
- Tailwind CSS - Our styling system for Headless UI components
- TypeScript - Provides type safety for Headless UI APIs
