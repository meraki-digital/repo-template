# pytest

**Category:** Testing  
**Official Docs:** [https://docs.pytest.org/](https://docs.pytest.org/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

pytest is a mature, feature-rich testing framework for Python that makes it easy to write simple and scalable test cases. It provides a clean syntax for writing tests, powerful fixtures for test setup/teardown, and extensive plugins for additional functionality. Unlike Python's built-in unittest framework, pytest focuses on simplicity and ease of use while providing advanced features for complex testing scenarios.

Think of pytest as a diligent quality inspector for your code. It automatically finds and runs your tests, provides detailed reports on what passed or failed, and helps you catch bugs before they reach production.

---

## Why We're Using It In This Project

pytest ensures the reliability of our financial data processing and API endpoints:

- **API endpoint testing**: Verify our FastAPI routes return correct data
- **Database operation testing**: Ensure SQLAlchemy queries work correctly
- **ETL pipeline testing**: Validate data transformations and loading processes
- **AI integration testing**: Test OpenAI API calls and response handling
- **Regression prevention**: Catch bugs when code changes
- **CI/CD integration**: Automated testing in our deployment pipeline
- **Fast feedback**: Quick test execution during development

---

## How We'll Use It

pytest will test our backend API, database operations, and ETL processes:

**Example 1: API endpoint testing**
```python
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_dashboard_endpoint():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "revenue" in data
    assert "expenses" in data
    assert isinstance(data["revenue"], (int, float))

def test_dashboard_date_filter():
    response = client.get("/api/dashboard?start_date=2024-01-01&end_date=2024-01-31")
    assert response.status_code == 200
    # Verify date filtering works correctly
```

**Example 2: Database testing with fixtures**
```python
import pytest
from sqlalchemy.orm import sessionmaker
from backend.database import engine
from backend.models import Transaction

@pytest.fixture
def db_session():
    # Create test database session
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_transaction_creation(db_session):
    # Create test transaction
    transaction = Transaction(
        amount=1000.00,
        date="2024-01-15",
        account_code="4000"
    )
    db_session.add(transaction)
    db_session.commit()
    
    # Verify it was created
    saved = db_session.query(Transaction).filter(Transaction.id == transaction.id).first()
    assert saved.amount == 1000.00
    assert saved.account_code == "4000"
```

**Example 3: ETL testing**
```python
def test_sage_data_transformation():
    # Mock Sage CSV data
    raw_data = [
        {"Account": "4000", "Amount": "1500.00", "Date": "2024-01-15"},
        {"Account": "5000", "Amount": "-500.00", "Date": "2024-01-16"}
    ]
    
    # Test transformation logic
    transformed = transform_sage_data(raw_data)
    
    assert len(transformed) == 2
    assert transformed[0]["revenue"] == 1500.00
    assert transformed[1]["expense"] == 500.00
    assert "job_id" in transformed[0]  # Check enrichment
```

**Example 4: AI query testing with mocking**
```python
from unittest.mock import patch

@patch('backend.ai.openai.ChatCompletion.create')
def test_ai_query(mock_openai):
    # Mock OpenAI response
    mock_openai.return_value = {
        "choices": [{"message": {"content": "SELECT SUM(amount) FROM transactions"}}]
    }
    
    result = process_ai_query("What is total revenue?")
    
    assert "SELECT" in result["sql"]
    mock_openai.assert_called_once()
```

---

## Key Concepts

- **Test Functions**: Simple functions that start with `test_`
- **Fixtures**: Setup/teardown code that runs before/after tests
- **Assertions**: Statements that verify expected vs actual results
- **Parametrization**: Running the same test with different inputs
- **Marking**: Labels for categorizing and filtering tests

---

## Alternatives We Considered

- **unittest**: Built-in but verbose and less feature-rich
- **nose**: Older framework, pytest is the modern successor
- **Manual testing**: Not scalable or repeatable

---

## Getting Started

1. **Install pytest**: `pip install pytest`
2. **Write a simple test**:
   ```python
   def test_addition():
       assert 2 + 2 == 4
   ```
3. **Run tests**: `pytest` or `pytest test_file.py`

---

## Common Patterns & Best Practices

1. **Use descriptive test names**: `test_dashboard_returns_financial_metrics`
2. **Test one thing per test**: Keep tests focused and readable
3. **Use fixtures for setup**: Share common test data and connections
4. **Mock external dependencies**: Test in isolation without real APIs
5. **Use parametrization**: Test multiple inputs with one test function

---

## Troubleshooting

**Issue 1:** Tests can't import application code  
**Solution:** Set PYTHONPATH or use relative imports

**Issue 2:** Database tests interfere with each other  
**Solution:** Use transactions that rollback or separate test databases

---

## Learning Resources

**Essential:**
- [pytest Documentation](https://docs.pytest.org/)
- [pytest Tutorial](https://docs.pytest.org/en/stable/getting-started.html)

**Recommended:**
- [Python Testing with pytest](https://pragprog.com/titles/bopytest/python-testing-with-pytest/)
- [FastAPI Testing Guide](https://fastapi.tiangolo.com/tutorial/testing/)

**Community:**
- [pytest GitHub](https://github.com/pytest-dev/pytest)
- [Python Testing Slack](https://pypitesting.slack.com/)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Framework we're testing
- [SQLAlchemy](sqlalchemy.md) - Database operations we're testing
- [OpenAI GPT-4 API](openai-gpt-4-api.md) - AI features we're testing
