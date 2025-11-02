# PostgreSQL

**Category:** Database
**Official Docs:** https://www.postgresql.org/docs/
**Used In:** Superscapes Financial Intelligence Dashboard

---

## What Is It?

PostgreSQL (often called "Postgres") is a powerful, open-source relational database management system that has been in active development for over 35 years. Think of it as an extremely reliable and sophisticated filing cabinet for your data—but instead of paper files, it stores digital records in tables with rows and columns.

Unlike simpler databases, PostgreSQL is known for being feature-rich and standards-compliant. It can handle everything from simple blog posts to complex financial transactions with millions of records. It's particularly good at maintaining data integrity (making sure your data is accurate and consistent) and supporting advanced features like JSON storage, full-text search, and geographic data.

Many organizations choose PostgreSQL because it's free, extremely reliable, and can scale from a small startup application to enterprise systems handling billions of transactions. It's the "Swiss Army knife" of databases—versatile enough to handle almost any data storage need.

---

## Why We're Using It In This Project

- **ACID Compliance:** Financial data requires absolute reliability—PostgreSQL ensures transactions are atomic, consistent, isolated, and durable, preventing data corruption or loss
- **Advanced Data Types:** Native support for JSON, arrays, and custom types allows flexible storage of configuration data (like our `system_variables` table) alongside structured financial records
- **Mature Ecosystem:** Excellent Python integration through SQLAlchemy, robust backup/recovery tools, and extensive monitoring capabilities for production environments
- **Performance & Scalability:** Handles complex JOIN queries across millions of financial transactions efficiently, with support for advanced indexing strategies
- **Open Source & Cost-Free:** No licensing fees, making it ideal for POC/MVP phases while being production-ready for enterprise deployment
- **Standards Compliance:** Full SQL standard support means queries work as expected and developers with SQL experience can be immediately productive

---

## How We'll Use It

**Example 1: Storing Financial Transactions**

```sql
-- Transactions table with fiscal period tracking
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    account_code VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    fy INTEGER NOT NULL,
    period INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query with date range filtering
SELECT
    account_code,
    SUM(amount) as total_amount
FROM transactions
WHERE date BETWEEN '2025-01-01' AND '2025-03-31'
GROUP BY account_code
ORDER BY total_amount DESC;
```

**Example 2: System Configuration Storage**

```sql
-- Key-value configuration table using TEXT for flexibility
CREATE TABLE system_variables (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Store fiscal year settings
INSERT INTO system_variables (key, value, description) VALUES
('fiscal_year_start_month', '1', 'Fiscal year start month (1=Jan)'),
('data_inception_date', '2024-07-01', 'Earliest transaction date');
```

**Example 3: Complex Financial Reporting Queries**

```sql
-- Monthly revenue trend with year-over-year comparison
WITH monthly_revenue AS (
    SELECT
        fy,
        period,
        SUM(amount) as revenue
    FROM transactions
    WHERE account_code LIKE 'REV%'
    GROUP BY fy, period
)
SELECT
    curr.fy,
    curr.period,
    curr.revenue as current_year_revenue,
    prev.revenue as prior_year_revenue,
    ((curr.revenue - prev.revenue) / prev.revenue * 100)::DECIMAL(10,2) as yoy_growth_pct
FROM monthly_revenue curr
LEFT JOIN monthly_revenue prev ON curr.period = prev.period AND curr.fy = prev.fy + 1
ORDER BY curr.fy, curr.period;
```

---

## Key Concepts

- **ACID Properties:** Atomicity (all-or-nothing transactions), Consistency (data integrity rules enforced), Isolation (concurrent transactions don't interfere), Durability (committed data survives crashes)
- **Schema:** The structure of your database—table definitions, relationships, constraints, and indexes that define how data is organized
- **Index:** A data structure that speeds up queries by creating a quick lookup mechanism (like a book's index)—critical for performance on large tables
- **Transaction:** A group of database operations that succeed or fail together, ensuring data consistency (e.g., transferring money between accounts)
- **Connection Pooling:** Reusing database connections instead of creating new ones for each query, improving performance and resource utilization
- **Materialized View:** A pre-computed query result stored as a table, useful for complex aggregations that don't need real-time updates

---

## Alternatives We Considered

- **MySQL:** Popular open-source database, but PostgreSQL offers better standards compliance, more advanced features (JSON, window functions), and stronger data integrity guarantees
- **SQLite:** Excellent for embedded applications but lacks the multi-user concurrency, security features, and scalability needed for a web application
- **MongoDB:** NoSQL document database that's great for flexible schemas, but financial data benefits from relational structure, SQL's powerful querying, and ACID guarantees
- **Microsoft SQL Server:** Enterprise-grade with excellent tooling, but requires licensing costs and locks us into Microsoft ecosystem—PostgreSQL provides equivalent capabilities for free

---

## Getting Started

1. **Local Installation (via Homebrew on macOS):**
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Create Database:**
   ```bash
   createdb superscapes_financial
   psql superscapes_financial
   ```

3. **Connect from Python (using SQLAlchemy):**
   ```python
   from sqlalchemy import create_engine

   DATABASE_URL = "postgresql://user:password@localhost:5432/superscapes_financial"
   engine = create_engine(DATABASE_URL)

   # Connection pooling configured automatically
   ```

4. **Run Schema Migrations:**
   ```bash
   cd poc/backend
   alembic upgrade head
   ```

5. **Verify Installation:**
   ```sql
   SELECT version();  -- Check PostgreSQL version
   \dt                -- List all tables
   \d transactions    -- Describe transactions table structure
   ```

---

## Common Patterns & Best Practices

**Use Prepared Statements (Parameterized Queries):**
Always use parameter binding to prevent SQL injection attacks. SQLAlchemy handles this automatically:
```python
# Good - parameterized
result = session.execute(
    text("SELECT * FROM transactions WHERE account_code = :code"),
    {"code": user_input}
)

# Bad - vulnerable to SQL injection
result = session.execute(f"SELECT * FROM transactions WHERE account_code = '{user_input}'")
```

**Index Your Query Patterns:**
Create indexes on columns frequently used in WHERE clauses, JOIN conditions, and ORDER BY:
```sql
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_account ON transactions(account_code);
CREATE INDEX idx_transactions_fy_period ON transactions(fy, period);
```

**Use Transactions for Multi-Step Operations:**
Wrap related changes in transactions to maintain data consistency:
```python
with engine.begin() as conn:
    conn.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")
    conn.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2")
    # Both updates commit together or rollback together
```

**Regular VACUUM and ANALYZE:**
PostgreSQL requires periodic maintenance to reclaim space and update query statistics:
```sql
VACUUM ANALYZE transactions;  -- Reclaim space and update statistics
```

**Connection Pooling Configuration:**
Configure appropriate pool sizes based on your application's concurrency needs:
```python
engine = create_engine(
    DATABASE_URL,
    pool_size=10,           # Number of persistent connections
    max_overflow=20,        # Additional connections under load
    pool_pre_ping=True      # Verify connections before use
)
```

---

## Performance Tips for This Project

1. **Partial Indexes for Date Ranges:** Since we filter by date frequently, create partial indexes for common queries:
   ```sql
   CREATE INDEX idx_transactions_ytd
   ON transactions(date, account_code)
   WHERE date >= date_trunc('year', CURRENT_DATE);
   ```

2. **Aggregate Tables for Dashboard KPIs:** Consider materialized views for frequently-accessed summary data:
   ```sql
   CREATE MATERIALIZED VIEW monthly_kpis AS
   SELECT fy, period, account_code, SUM(amount) as total
   FROM transactions
   GROUP BY fy, period, account_code;

   REFRESH MATERIALIZED VIEW monthly_kpis;  -- Update periodically
   ```

3. **Query Plan Analysis:** Use EXPLAIN ANALYZE to understand query performance:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM transactions WHERE date BETWEEN '2025-01-01' AND '2025-12-31';
   ```
