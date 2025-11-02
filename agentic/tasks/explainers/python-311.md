# Python 3.11+

**Category:** Backend  
**Official Docs:** https://www.python.org/  
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

Python is a versatile, high-level programming language known for its simplicity and readability. Think of it like a universal remote for programming - it can handle web servers, data analysis, automation, and more. Python 3.11+ is the latest stable version with performance improvements and new features.

In simple terms: Python is like a smart assistant that can understand English-like instructions to process data, build websites, or automate tasks. It's popular because writing Python code feels like writing a story rather than complex math.

---

## Why We're Using It In This Project

- **Data Processing Power:** Our ETL pipelines need to handle millions of Sage transactions, and Python's pandas library makes data transformation efficient and readable
- **Backend API Development:** FastAPI (our chosen framework) is Python-based, providing high-performance APIs for the dashboard
- **ETL Orchestration:** Python integrates seamlessly with Prefect for workflow management and Airbyte for data ingestion
- **AI Integration:** Python has excellent libraries for OpenAI API integration and vector processing with pgvector
- **Team Productivity:** Python's clean syntax reduces development time for complex data transformations

---

## How We'll Use It

**Example 1: ETL Data Transformation**
```python
import pandas as pd

# Load Sage transaction data
transactions = pd.read_csv('sage_export.csv')

# Transform account codes to categories
transactions['category'] = transactions['account_code'].map({
    '4000-4999': 'Revenue',
    '5000-5999': 'Labor',
    '6000-6999': 'Materials'
})

# Calculate job profitability
job_summary = transactions.groupby('job_id').agg({
    'revenue': 'sum',
    'costs': 'sum'
})
job_summary['profit_margin'] = (job_summary['revenue'] - job_summary['costs']) / job_summary['revenue']
```

**Example 2: FastAPI Backend Endpoint**
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    natural_language: str

@app.post("/api/query")
async def query_financial_data(request: QueryRequest):
    # Use OpenAI to convert natural language to SQL
    # Query PostgreSQL with pgvector for semantic search
    # Return dashboard data
    return {"results": "processed data"}
```

---

## Key Concepts

- **Virtual Environments:** Isolated Python installations to manage dependencies per project (we'll use venv or conda)
- **PIP:** Python's package manager for installing libraries like pandas, fastapi, openai
- **Type Hints:** Optional type annotations for better code clarity (Python 3.11+ has enhanced type features)
- **Async/Await:** Modern Python's way of handling concurrent operations (FastAPI uses this extensively)
- **List Comprehensions:** Python's concise way to process lists (great for data transformations)

---

## Alternatives We Considered

- **Node.js:** JavaScript runtime - We chose Python because our data team has stronger Python skills and better ETL libraries
- **Java:** Enterprise-grade language - Too verbose for rapid ETL development and AI integration
- **Go:** High-performance language - Python offers better developer productivity for our mixed data/API workload

---

## Getting Started

1. **Installation:** Download from python.org or use package manager (`brew install python@3.11` on macOS)
2. **Virtual Environment:** `python -m venv venv && source venv/bin/activate`
3. **Dependencies:** `pip install fastapi pandas openai sqlalchemy`
4. **Run Development Server:** `uvicorn main:app --reload`

---

## Common Patterns & Best Practices

1. **Use Type Hints:** Add type annotations for better IDE support and code clarity
2. **Handle Exceptions Properly:** Use try/except blocks for robust ETL pipelines
3. **Log Everything:** Use Python's logging module for ETL job monitoring
4. **Modular Code:** Break ETL scripts into functions and classes for maintainability
5. **Performance:** Use pandas vectorized operations instead of loops for data processing

---

## Troubleshooting

**Issue 1: Import Error for Library**  
**Solution:** Ensure the library is installed with `pip install <library>` and you're in the correct virtual environment

**Issue 2: Memory Issues with Large Datasets**  
**Solution:** Use pandas chunking (`pd.read_csv(file, chunksize=10000)`) or dask for bigger-than-memory data

---

## Learning Resources

**Essential:**
- [Official Python Documentation](https://docs.python.org/3/)
- [Real Python](https://realpython.com/) - Practical Python learning
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - For our backend framework

**Recommended:**
- [Python for Data Analysis](https://wesmckinney.com/book/) - Essential for ETL work
- [Automate the Boring Stuff](https://automatetheboringstuff.com/) - Practical Python automation

**Community:**
- [r/learnpython](https://reddit.com/r/learnpython) - Active community support
- [Python Discord](https://discord.gg/python) - Real-time help and discussions

---

**Related Technologies:**
- FastAPI - Our web framework
- pandas - Data manipulation library
- PostgreSQL - Our database
