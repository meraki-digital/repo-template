# Pydantic v2

**Category:** Backend  
**Official Docs:** [https://docs.pydantic.dev/](https://docs.pydantic.dev/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Pydantic v2 is a cutting-edge data validation and serialization library for Python that uses type hints to automatically validate data and convert it to the correct types. It acts as a smart gatekeeper for your API, ensuring that incoming data matches expected formats and automatically generating documentation from your type definitions.

Think of Pydantic as a strict but helpful data receptionist. When data comes into your API, Pydantic checks if it looks correct, converts strings to numbers or dates as needed, and politely rejects anything that doesn't meet your standards - all while providing clear error messages about what's wrong.

---

## Why We're Using It In This Project

Pydantic v2 provides essential data validation and serialization for our FastAPI backend:

- **Automatic API documentation**: Generates OpenAPI schemas from our type hints
- **Runtime type validation**: Prevents invalid data from corrupting our financial calculations
- **Data serialization**: Converts database objects to JSON responses automatically
- **Performance improvements**: v2 is significantly faster than v1 with better async support
- **Type safety**: Catches data type errors early in the request pipeline
- **FastAPI integration**: Built into FastAPI for seamless request/response handling

---

## How We'll Use It

Pydantic models will define and validate all data structures in our API:

**Example 1: API request model**
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class DashboardRequest(BaseModel):
    start_date: date
    end_date: date
    account_filter: Optional[str] = None
    include_forecast: bool = Field(default=False, description="Include AI forecast data")
```

**Example 2: API response model**
```python
class FinancialMetrics(BaseModel):
    total_revenue: float = Field(..., gt=0, description="Total revenue in dollars")
    total_expenses: float = Field(..., ge=0)
    net_profit: float
    profit_margin: float = Field(..., ge=-1, le=1)
    
    class Config:
        json_encoders = {
            date: lambda v: v.isoformat()
        }
```

**Example 3: Database serialization**
```python
# Convert SQLAlchemy model to Pydantic response
class TransactionResponse(BaseModel):
    id: int
    amount: float
    date: date
    description: str
    
    class Config:
        from_attributes = True  # Enable ORM mode
```

---

## Key Concepts

- **BaseModel**: The foundation class for all Pydantic models
- **Field**: Adds validation rules, defaults, and documentation to fields
- **Validators**: Custom validation functions for complex business rules
- **Config**: Model configuration for serialization behavior
- **Type hints**: Standard Python typing for automatic validation

---

## Alternatives We Considered

- **Pydantic v1**: Older version lacks performance improvements and new features
- **dataclasses**: No validation, just data containers
- **marshmallow**: More verbose and slower than Pydantic

---

## Getting Started

1. **Install Pydantic v2**: `pip install pydantic`
2. **Create a simple model**:
   ```python
   from pydantic import BaseModel
   
   class User(BaseModel):
       name: str
       age: int
   
   user = User(name="John", age=30)
   ```
3. **Validation happens automatically**: `User(name="John", age="thirty")` will raise an error

---

## Common Patterns & Best Practices

1. **Use descriptive field names**: `total_revenue` not `tr`
2. **Add field descriptions**: Helps generate better API documentation
3. **Set appropriate constraints**: `Field(gt=0)` for positive numbers
4. **Use Optional for nullable fields**: `Optional[str] = None`
5. **Enable ORM mode**: `Config.from_attributes = True` for SQLAlchemy integration

---

## Troubleshooting

**Issue 1:** Validation errors with correct-looking data  
**Solution:** Check type hints match actual data types (str vs int)

**Issue 2:** Performance issues with large datasets  
**Solution:** Use `model_validate` instead of `model_validate_json` when possible

---

## Learning Resources

**Essential:**
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Pydantic Tutorial](https://docs.pydantic.dev/latest/tutorial/)

**Recommended:**
- [FastAPI + Pydantic Guide](https://fastapi.tiangolo.com/tutorial/body/)
- [Pydantic Field Types](https://docs.pydantic.dev/latest/usage/types/)

**Community:**
- [Pydantic GitHub](https://github.com/pydantic/pydantic)
- [FastAPI Discord](https://discord.gg/VQjSZaeJmf)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Web framework that uses Pydantic
- [SQLAlchemy](sqlalchemy.md) - ORM integration
