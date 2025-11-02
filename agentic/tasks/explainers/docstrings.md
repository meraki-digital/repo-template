# Docstrings

**Category:** Documentation  
**Official Docs:** [PEP 257](https://peps.python.org/pep-0257/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Docstrings are string literals that appear as the first statement in a module, function, class, or method definition in Python. They provide a convenient way to associate documentation with Python code, serving as both inline documentation and the basis for automatic documentation generation. Docstrings follow PEP 257 conventions and can be accessed at runtime using the `__doc__` attribute.

Think of docstrings as the Python way of writing documentation that lives right in the code. They're like comments, but more structured and machine-readable, allowing tools to extract and format documentation automatically.

---

## Why We're Using It In This Project

Docstrings provide standardized, accessible documentation for our Python codebase:

- **PEP 257 compliant**: Follows Python's official documentation standards
- **Runtime accessible**: Can be accessed via `help()` and `__doc__`
- **Tool integration**: Used by Sphinx, FastAPI, and IDEs for documentation
- **Self-documenting code**: Documentation lives with the code it describes
- **Type hints enhancement**: Complement type annotations with usage examples
- **Testing integration**: Doctest allows executable examples in docstrings
- **IDE support**: Enhanced autocomplete and help in Python editors
- **Maintenance**: Documentation updates with code changes

---

## How We'll Use It

Docstrings will document all our Python functions, classes, and modules:

**Example 1: Function documentation**
```python
def calculate_revenue_metrics(transactions: List[Transaction], 
                            start_date: date, 
                            end_date: date) -> Dict[str, float]:
    """
    Calculate key revenue metrics from transaction data.
    
    Computes total revenue, average transaction value, and growth rate
    for the specified date range.
    
    Args:
        transactions: List of Transaction objects to analyze
        start_date: Start date for the analysis period (inclusive)
        end_date: End date for the analysis period (inclusive)
    
    Returns:
        Dictionary containing:
        - total_revenue: Sum of all revenue transactions
        - avg_transaction: Average transaction value
        - transaction_count: Number of transactions
        - growth_rate: Month-over-month growth percentage
    
    Raises:
        ValueError: If start_date is after end_date
        EmptyDatasetError: If no transactions found in date range
    
    Example:
        >>> transactions = get_sample_transactions()
        >>> metrics = calculate_revenue_metrics(
        ...     transactions, 
        ...     date(2024, 1, 1), 
        ...     date(2024, 1, 31)
        ... )
        >>> print(f"Total revenue: ${metrics['total_revenue']:,.2f}")
        Total revenue: $125,430.67
    """
    if start_date > end_date:
        raise ValueError("Start date must be before or equal to end date")
    
    # Filter transactions by date
    filtered = [t for t in transactions 
               if start_date <= t.date <= end_date]
    
    if not filtered:
        raise EmptyDatasetError(f"No transactions found between {start_date} and {end_date}")
    
    # Calculate metrics
    revenue_transactions = [t for t in filtered if t.amount > 0]
    total_revenue = sum(t.amount for t in revenue_transactions)
    avg_transaction = total_revenue / len(revenue_transactions) if revenue_transactions else 0
    
    return {
        'total_revenue': total_revenue,
        'avg_transaction': avg_transaction,
        'transaction_count': len(revenue_transactions),
        'growth_rate': 0.0  # Would calculate from historical data
    }
```

**Example 2: Class documentation**
```python
class FinancialReportGenerator:
    """
    Generates financial reports in various formats.
    
    This class handles the creation of financial reports including
    income statements, balance sheets, and cash flow statements.
    Supports multiple output formats and customization options.
    
    Attributes:
        company_name (str): Name of the company for report headers
        fiscal_year_end (date): End date of the fiscal year
        currency (str): Currency code for financial amounts
    
    Example:
        >>> generator = FinancialReportGenerator(
        ...     company_name="Acme Corp",
        ...     fiscal_year_end=date(2024, 12, 31)
        ... )
        >>> report = generator.generate_income_statement()
    """
    
    def __init__(self, company_name: str, fiscal_year_end: date, currency: str = "USD"):
        """
        Initialize the report generator.
        
        Args:
            company_name: Name of the company
            fiscal_year_end: Fiscal year end date
            currency: Currency code (default: USD)
        """
        self.company_name = company_name
        self.fiscal_year_end = fiscal_year_end
        self.currency = currency
    
    def generate_income_statement(self, start_date: date, end_date: date) -> Dict:
        """
        Generate an income statement for the specified period.
        
        Args:
            start_date: Period start date
            end_date: Period end date
            
        Returns:
            Dictionary containing income statement data with sections:
            - revenue: Total revenue
            - expenses: Operating expenses
            - net_income: Net profit/loss
        """
        # Implementation would go here
        pass
```

**Example 3: Module documentation**
```python
"""
Financial data processing utilities.

This module contains utility functions for processing and analyzing
financial transaction data, including validation, transformation,
and calculation functions.

The module is designed to work with the Transaction dataclass
and integrates with the broader financial analytics pipeline.

Typical usage involves:
1. Loading raw transaction data
2. Validating and cleaning the data
3. Performing financial calculations
4. Preparing data for reporting or analysis

Example:
    >>> from financial_utils import validate_transaction, calculate_totals
    >>> 
    >>> # Process a batch of transactions
    >>> transactions = load_transaction_data()
    >>> valid_transactions = [t for t in transactions if validate_transaction(t)]
    >>> totals = calculate_totals(valid_transactions)
"""

from typing import List, Dict
from dataclasses import dataclass
from datetime import date

# Module contents would follow...
```

---

## Key Concepts

- **Triple quotes**: Use `"""` for multi-line docstrings
- **Args/Returns**: Document parameters and return values
- **Raises**: Specify exceptions that may be raised
- **Examples**: Include usage examples with doctest format
- **Attributes**: Document class attributes
- **Notes**: Additional implementation notes

---

## Alternatives We Considered

- **Regular comments**: Not machine-readable or standardized
- **External documentation**: Becomes outdated from code changes
- **Type hints only**: Provides types but not usage or examples
- **No documentation**: Makes code hard to understand and maintain

---

## Getting Started

1. **Follow PEP 257**: Use triple quotes for docstrings
2. **Document public APIs**: Focus on functions/classes used by others
3. **Include examples**: Show typical usage patterns
4. **Use consistent style**: Follow team's documentation conventions
5. **Test docstrings**: Run doctests to verify examples work

---

## Common Patterns & Best Practices

1. **One-line for simple functions**: `"""Calculate the square of a number."""`
2. **Multi-line for complex items**: Include Args, Returns, Examples
3. **Consistent formatting**: Use the same style throughout codebase
4. **Update with code**: Keep docstrings current when code changes
5. **Use tools**: Leverage linters and formatters for consistency

---

## Troubleshooting

**Issue 1:** Docstrings not showing in help()  
**Solution:** Ensure proper indentation and syntax

**Issue 2:** Doctests failing  
**Solution:** Update examples to match current implementation

---

## Learning Resources

**Essential:**
- [PEP 257](https://peps.python.org/pep-0257/)
- [Python Docstring Conventions](https://docs.python.org/3/tutorial/controlflow.html#documentation-strings)

**Recommended:**
- [Google Style Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
- [NumPy Docstring Standard](https://numpydoc.readthedocs.io/en/latest/format.html)

**Community:**
- [Python Documentation SIG](https://www.python.org/community/sig/doc-sig/)
- [Stack Overflow Docstrings](https://stackoverflow.com/questions/tagged/docstring)

---

**Related Technologies:**
- [Python](python-311.md) - Language using docstrings
- [FastAPI](fastapi.md) - Uses docstrings for API documentation
- [Sphinx](https://www.sphinx-doc.org/) - Documentation generator using docstrings
