# dbt-postgres

**Category:** ETL  
**Official Docs:** [https://docs.getdbt.com/docs/core/connect-data-platform/postgres-setup](https://docs.getdbt.com/docs/core/connect-data-platform/postgres-setup)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

dbt-postgres is the PostgreSQL adapter for dbt (data build tool), enabling dbt to connect to and run transformations directly in PostgreSQL databases. It provides the database-specific implementation that allows dbt's SQL models to be executed against PostgreSQL, handling connection management, SQL generation, and PostgreSQL-specific features like schemas, indexes, and data types.

Think of dbt-postgres as the bridge between dbt's transformation logic and PostgreSQL's execution engine. While dbt defines what transformations to run, dbt-postgres handles how to run them efficiently in PostgreSQL.

---

## Why We're Using It In This Project

dbt-postgres enables efficient SQL transformations in our PostgreSQL warehouse:

- **Native PostgreSQL support**: Optimized for PostgreSQL's features and performance
- **Schema management**: Handles database schemas, search paths, and permissions
- **Incremental materializations**: Efficiently updates only changed data
- **PostgreSQL-specific SQL**: Supports advanced PostgreSQL features like CTEs, window functions
- **Connection pooling**: Efficient database connection management
- **Transaction handling**: Proper transaction management for data consistency
- **pgvector compatibility**: Works with our AI vector extensions

---

## How We'll Use It

dbt-postgres will execute our dbt transformations in PostgreSQL:

**Example 1: Profile configuration**
```yaml
# ~/.dbt/profiles.yml
financial_dashboard:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      port: 5432
      user: dbt_user
      password: "{{ env_var('DBT_PASSWORD') }}"
      database: financial_warehouse
      schema: analytics
      threads: 4
      keepalives_idle: 0
      connect_timeout: 10
      retries: 1

    prod:
      type: postgres
      host: "{{ env_var('PROD_DB_HOST') }}"
      database: prod_warehouse
      # ... other prod settings
```

**Example 2: Schema setup**
```sql
-- Create dbt user and schema
CREATE USER dbt_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE financial_warehouse TO dbt_user;

CREATE SCHEMA IF NOT EXISTS analytics;
GRANT USAGE ON SCHEMA analytics TO dbt_user;
GRANT CREATE ON SCHEMA analytics TO dbt_user;

-- Grant permissions on source data
GRANT SELECT ON ALL TABLES IN SCHEMA staging TO dbt_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA staging GRANT SELECT ON TABLES TO dbt_user;
```

**Example 3: Running transformations**
```bash
# Run all models
dbt run

# Run specific model
dbt run --models fact_transactions

# Run with target
dbt run --target prod

# Run tests
dbt test
```

**Example 4: Incremental materialization**
```sql
-- Models can use PostgreSQL-specific features
{{ config(materialized='incremental') }}

SELECT
    id,
    transaction_date,
    amount,
    ROW_NUMBER() OVER (PARTITION BY account_code ORDER BY transaction_date) as transaction_sequence
FROM {{ ref('stg_transactions') }}

{% if is_incremental() %}
WHERE transaction_date > (SELECT MAX(transaction_date) FROM {{ this }})
{% endif %}
```

---

## Key Concepts

- **Adapter**: Database-specific implementation for dbt
- **Profile**: Configuration for database connections and settings
- **Schema**: PostgreSQL schema where dbt models are created
- **Materialization**: How models are stored (tables, views, incremental)
- **Threads**: Number of concurrent connections for parallel execution

---

## Alternatives We Considered

- **Other dbt adapters**: Not suitable for PostgreSQL
- **Raw SQL execution**: No dbt's testing and documentation features
- **Python-based ETL**: Less efficient for SQL transformations

---

## Getting Started

1. **Install adapter**: `pip install dbt-postgres`
2. **Configure profile**: Create `~/.dbt/profiles.yml`
3. **Initialize project**: `dbt init`
4. **Test connection**: `dbt debug`
5. **Run models**: `dbt run`

---

## Common Patterns & Best Practices

1. **Separate dev/prod profiles**: Different schemas for development and production
2. **Schema naming**: Use descriptive schema names (analytics, marts, staging)
3. **Connection pooling**: Configure appropriate thread counts
4. **Permissions**: Grant minimal required permissions to dbt user
5. **Monitoring**: Monitor dbt execution in PostgreSQL logs

---

## Troubleshooting

**Issue 1:** Connection timeouts  
**Solution:** Adjust keepalives_idle and connect_timeout settings

**Issue 2:** Permission denied  
**Solution:** Verify schema and table permissions for dbt user

---

## Learning Resources

**Essential:**
- [dbt-postgres Documentation](https://docs.getdbt.com/docs/core/connect-data-platform/postgres-setup)
- [dbt Profiles](https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml)

**Recommended:**
- [PostgreSQL Adapter Features](https://docs.getdbt.com/reference/resource-configs/postgres-configs)
- [dbt Best Practices](https://docs.getdbt.com/best-practices/)

**Community:**
- [dbt Slack](https://www.getdbt.com/community/)
- [PostgreSQL Mailing List](https://www.postgresql.org/list/)

---

**Related Technologies:**
- [dbt](dbt.md) - Core transformation tool
- [PostgreSQL](https://www.postgresql.org/docs/) - Target database
- [pgvector](pgvector.md) - Vector extensions
