# sqlparse

**Category:** Backend / Python Library  
**Official Docs:** https://sqlparse.readthedocs.io/  
**Used In:** Module 0001 - AI Question Library & Response Format Enhancement

---

## What Is It?

sqlparse is a Python library that parses (reads and understands) SQL queries and can format them nicely with proper indentation, line breaks, and alignment. Think of it like Prettier for SQL - it takes messy, single-line SQL and makes it readable.

For example, it transforms this mess:
```
SELECT region_name,SUM(revenue) FROM semantic.monthly_financials WHERE year=2025 GROUP BY region_name
```

Into this readable formatted query:
```sql
SELECT region_name,
       SUM(revenue)
FROM semantic.monthly_financials
WHERE year = 2025
GROUP BY region_name
```

In our project, when the AI generates SQL queries, they might be compact single lines. Before showing them to Finance Analysts in the SQL modal, we'll use sqlparse to make them properly formatted and easy to read.

---

## Why We're Using It In This Project

- **Readability requirement:** Finance Analysts need to read and verify AI-generated SQL - formatted SQL is 10x easier to understand
- **Consistency:** All SQL displayed in modals will have consistent, professional formatting
- **Simplicity:** Just call one function to format any SQL query
- **No configuration needed:** Works out-of-the-box with PostgreSQL syntax
- **Lightweight:** Small library (~100KB), minimal dependencies
- **Battle-tested:** Used by major tools like pgAdmin, sqlfluff, and many SQL editors

---

## How We'll Use It

**Example 1: Formatting AI-Generated SQL for Display**

In our backend API, before returning SQL to the frontend:

```python
import sqlparse

def format_sql_for_display(sql_query: str) -> str:
    """Format SQL query for readability in SQL modal"""
    formatted = sqlparse.format(
        sql_query,
        reindent=True,              # Add proper indentation
        keyword_case='upper',       # SELECT, FROM, WHERE in uppercase
        indent_width=4,             # 4 spaces per indent level
        wrap_after=80,              # Wrap lines longer than 80 chars
        use_space_around_operators=True  # Add spaces around = and other operators
    )
    return formatted

# Usage in API endpoint
@app.post("/ai/query")
async def query(request: QueryRequest):
    # ... AI generates SQL ...
    raw_sql = "SELECT region_name,SUM(revenue) FROM semantic.monthly_financials WHERE year=2025"
    
    formatted_sql = format_sql_for_display(raw_sql)
    
    return {
        "answer": { ... },
        "sql_query": formatted_sql  # Send formatted SQL to frontend
    }
```

**Example 2: Extracting Table Names from SQL**

We also use sqlparse to extract which tables were queried (for "Data Sources" section in modal):

```python
import sqlparse
from sqlparse.sql import IdentifierList, Identifier
from sqlparse.tokens import Keyword, DML

def extract_tables(sql_query: str) -> list[str]:
    """Extract table names from SQL query"""
    tables = []
    parsed = sqlparse.parse(sql_query)[0]
    
    from_seen = False
    for token in parsed.tokens:
        if from_seen:
            if isinstance(token, IdentifierList):
                for identifier in token.get_identifiers():
                    tables.append(str(identifier))
            elif isinstance(token, Identifier):
                tables.append(str(token))
        if token.ttype is Keyword and token.value.upper() == 'FROM':
            from_seen = True
            
    return tables

# Usage
sql = "SELECT * FROM semantic.monthly_financials JOIN core.dim_region"
tables = extract_tables(sql)
# Returns: ['semantic.monthly_financials', 'core.dim_region']
```

---

## Key Concepts

- **Parsing:** Reading SQL text and understanding its structure (keywords, identifiers, clauses)
- **Formatting:** Rearranging SQL with proper whitespace, indentation, and line breaks for readability
- **Tokens:** sqlparse breaks SQL into pieces (tokens) like keywords, identifiers, operators
- **Reindent:** Adding proper indentation based on query structure (subqueries, joins, etc.)
- **Keyword Case:** Converting keywords to uppercase (SELECT) or lowercase (select) for consistency

---

## Alternatives We Considered

- **sqlglot:** More powerful (can transpile between SQL dialects), but overkill for just formatting - much heavier library
- **Manual regex formatting:** Could use regex to add line breaks, but fragile and doesn't handle complex SQL (subqueries, CTEs)
- **sqlformat (CLI tool):** Command-line only, not usable in Python code
- **Client-side JavaScript libraries:** Could format in browser, but adds frontend bundle size and we're already sending SQL from backend

**Why sqlparse won:** Purpose-built for formatting, lightweight, Python-native, handles complex SQL correctly, actively maintained.

---

## Getting Started

1. **Install the package:**
   ```bash
   pip install sqlparse
   ```
   
   Add to `backend/requirements.txt`:
   ```
   sqlparse==0.4.4
   ```

2. **Basic formatting:**
   ```python
   import sqlparse
   
   sql = "SELECT name,age FROM users WHERE age>25 ORDER BY name"
   
   formatted = sqlparse.format(sql, reindent=True, keyword_case='upper')
   print(formatted)
   ```
   
   Output:
   ```sql
   SELECT name,
          age
   FROM users
   WHERE age > 25
   ORDER BY name
   ```

3. **Use in FastAPI endpoint:**
   ```python
   from fastapi import APIRouter
   import sqlparse
   
   router = APIRouter()
   
   @router.post("/ai/query")
   async def ai_query(question: str):
       # AI generates SQL
       generated_sql = ai_service.generate_sql(question)
       
       # Format for display
       formatted_sql = sqlparse.format(
           generated_sql,
           reindent=True,
           keyword_case='upper'
       )
       
       return {
           "answer": { ... },
           "sql_query": formatted_sql
       }
   ```

---

## Common Patterns & Best Practices

1. **Consistent formatting options:** Use same format() parameters everywhere for consistency. Create a utility function:
   ```python
   def format_sql_for_display(sql: str) -> str:
       return sqlparse.format(
           sql,
           reindent=True,
           keyword_case='upper',
           indent_width=4,
           use_space_around_operators=True
       )
   ```

2. **Handle multiple statements:** If SQL contains multiple statements (separated by `;`), split and format each:
   ```python
   statements = sqlparse.split(sql_string)
   formatted_statements = [format_sql_for_display(s) for s in statements]
   ```

3. **Validate before formatting:** Don't assume SQL is valid - catch parse errors:
   ```python
   try:
       formatted = sqlparse.format(sql, reindent=True)
   except Exception:
       # Return original if parsing fails
       formatted = sql
   ```

4. **Preserve comments:** sqlparse preserves SQL comments (--  and /* */) which can be useful for AI-generated explanatory comments.

5. **Don't over-format:** Keep `indent_width` reasonable (4 spaces max) - too much indentation makes SQL hard to read in modal.

---

## Troubleshooting

**Issue 1:** Formatted SQL looks wrong (weird indentation, keywords in wrong places)  
**Solution:** Check input SQL is valid. sqlparse does its best but can't fix broken SQL. Validate SQL with `sqlglot` or database before formatting.

**Issue 2:** Very long SQL causes formatting to take too long  
**Solution:** Set timeout or skip formatting for queries >10,000 characters. Most AI-generated queries are <500 chars.

**Issue 3:** SQL with CTEs or subqueries isn't formatting nicely  
**Solution:** Adjust `indent_width` or use `reindent_aligned=True` for better alignment of nested queries.

**Issue 4:** Import fails or module not found  
**Solution:** Ensure sqlparse is in `requirements.txt` and pip installed. Check Python version compatibility (works with 3.7+).

---

## Learning Resources

**Essential:**
- [Official Documentation](https://sqlparse.readthedocs.io/) - API reference and examples
- [GitHub Repository](https://github.com/andialbrecht/sqlparse) - Source code and issues

**Recommended:**
- [PyPI Page](https://pypi.org/project/sqlparse/) - Installation and version info
- [sqlparse Tutorial](https://sqlparse.readthedocs.io/en/latest/analyzing/) - Parsing and analyzing SQL

**Community:**
- [Stack Overflow sqlparse tag](https://stackoverflow.com/questions/tagged/sqlparse) - Common questions
- [GitHub Issues](https://github.com/andialbrecht/sqlparse/issues) - Bug reports and feature requests

---

**Related Technologies:**
- [react-syntax-highlighter](../../../agentic/tasks/explainers/react-syntax-highlighter.md) - Frontend library that displays the formatted SQL
- [PostgreSQL](../../../agentic/tasks/explainers/postgresql.md) - The SQL dialect we're formatting
- [FastAPI](../../../agentic/tasks/explainers/fastapi.md) - Backend framework where we use sqlparse

---

## Usage in Our Architecture

```
AI generates SQL (compact, single line) →
  Backend formats with sqlparse (readable, indented) →
    Send to frontend in API response →
      Frontend displays in modal with react-syntax-highlighter (color-coded) →
        Finance Analyst can read and verify query logic
```

**File:** `backend/services/sql_formatter.py`

```python
import sqlparse

class SQLFormatter:
    @staticmethod
    def format_for_display(sql: str) -> str:
        """Format SQL query for display in frontend modal"""
        if not sql or len(sql) > 10000:  # Safety check
            return sql
            
        try:
            formatted = sqlparse.format(
                sql,
                reindent=True,
                keyword_case='upper',
                indent_width=4,
                use_space_around_operators=True,
                wrap_after=80
            )
            return formatted.strip()
        except Exception as e:
            # Log error but don't fail - return original
            logger.error(f"SQL formatting failed: {e}")
            return sql
    
    @staticmethod
    def extract_table_names(sql: str) -> list[str]:
        """Extract table names from SQL for data sources list"""
        # Implementation using sqlparse token parsing
        # Returns: ['semantic.monthly_financials', 'core.dim_region']
        pass
```

This service is called in the AI query endpoint to prepare SQL for frontend display.
