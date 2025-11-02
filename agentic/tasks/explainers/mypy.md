# mypy

**Category:** Code Quality  
**Official Docs:** [https://mypy.readthedocs.io/](https://mypy.readthedocs.io/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

mypy is a static type checker for Python that helps catch type-related errors before runtime. It analyzes your code for type inconsistencies, missing type annotations, and potential bugs that arise from type mismatches. Unlike Python's dynamic typing, mypy performs static analysis to verify that your code adheres to the type hints you provide.

Think of mypy as a vigilant proofreader for your code's type annotations. It checks that the types you're declaring actually match how you're using variables, functions, and classes, catching subtle bugs that could cause runtime errors or unexpected behavior.

---

## Why We're Using It In This Project

mypy provides type safety for our complex financial data processing:

- **Catch type errors early**: Prevent bugs from incorrect data types in financial calculations
- **Improve code documentation**: Type hints serve as inline documentation
- **Enhanced IDE support**: Better autocomplete and error detection in editors
- **Refactoring safety**: Confidence when changing code that types help validate
- **FastAPI compatibility**: Works seamlessly with our heavily typed API
- **Gradual adoption**: Can be introduced incrementally to existing code
- **Complex type support**: Handles generics, unions, and advanced type features

---

## How We'll Use It

mypy will validate our type annotations throughout the codebase:

**Example 1: Basic type checking**
```python
# With type hints
def calculate_revenue(transactions: List[Transaction]) -> float:
    return sum(tx.amount for tx in transactions if tx.amount > 0)

# mypy will catch:
# - If transactions contains non-Transaction objects
# - If amount is not numeric
# - If function returns wrong type
```

**Example 2: Complex types for financial data**
```python
from typing import Dict, List, Optional, Union
from pydantic import BaseModel

class FinancialMetrics(BaseModel):
    revenue: float
    expenses: float
    profit_margin: Optional[float] = None

def process_financial_data(
    data: Dict[str, Union[int, float, str]],
    filters: Optional[Dict[str, str]] = None
) -> List[FinancialMetrics]:
    # mypy ensures data dict has correct types
    # and return list contains FinancialMetrics objects
    pass
```

**Example 3: Database model typing**
```python
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Numeric

class Transaction(Base):
    __tablename__ = 'transactions'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[float] = mapped_column(Numeric(10, 2))
    account_code: Mapped[str] = mapped_column(String(10))
    
    # mypy will verify these types match SQLAlchemy expectations
```

**Example 4: Configuration and setup**
```ini
# mypy.ini or pyproject.toml
[mypy]
python_version = 3.11
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
disallow_incomplete_defs = True
check_untyped_defs = True
disallow_untyped_decorators = True

# Third-party libraries without stubs
[mypy-pandas.*]
ignore_missing_imports = True
```

---

## Key Concepts

- **Type Hints**: Python's typing syntax for declaring variable/function types
- **Gradual Typing**: Can mix typed and untyped code
- **Type Stubs**: .pyi files providing types for untyped libraries
- **Generics**: Type[T] for generic classes and functions
- **Union Types**: Union[A, B] for multiple possible types

---

## Alternatives We Considered

- **pyright**: Microsoft's type checker, good but less mature ecosystem
- **pyre**: Facebook's type checker, more complex setup
- **No type checking**: Misses many preventable bugs

---

## Getting Started

1. **Install mypy**: `pip install mypy`
2. **Add type hints** to your code:
   ```python
   def greet(name: str) -> str:
       return f"Hello, {name}!"
   ```
3. **Run type checking**: `mypy your_file.py`

---

## Common Patterns & Best Practices

1. **Start with function signatures**: Type hints on functions provide the most value
2. **Use pydantic for data models**: Automatic type validation at runtime
3. **Add types incrementally**: Use `# type: ignore` for complex cases
4. **Configure strictness**: Start permissive, increase strictness over time
5. **Use generic types**: List[str] instead of just list

---

## Troubleshooting

**Issue 1:** Too many type errors initially  
**Solution:** Start with basic configuration and gradually increase strictness

**Issue 2:** Third-party library missing types  
**Solution:** Use type stub packages or `ignore_missing_imports`

---

## Learning Resources

**Essential:**
- [mypy Documentation](https://mypy.readthedocs.io/)
- [Python Typing Guide](https://docs.python.org/3/library/typing.html)

**Recommended:**
- [Real Python Type Checking](https://realpython.com/python-type-checking/)
- [mypy Cheat Sheet](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)

**Community:**
- [mypy GitHub](https://github.com/python/mypy)
- [Python Typing Discussions](https://github.com/python/typing/discussions)

---

**Related Technologies:**
- [Pydantic v2](pydantic-v2.md) - Runtime type validation
- [FastAPI](fastapi.md) - Framework that uses type hints extensively
- [SQLAlchemy](sqlalchemy.md) - ORM with typing support
