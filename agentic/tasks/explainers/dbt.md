# dbt (data build tool)

**Category:** ETL  
**Official Docs:** [https://docs.getdbt.com/](https://docs.getdbt.com/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

dbt is a SQL-first transformation tool that allows data analysts and engineers to transform raw data in their warehouse into clean, reliable datasets. It treats SQL as code, enabling version control, testing, and documentation of data transformations. Instead of complex ETL pipelines, dbt focuses on the "T" (transform) part using simple SQL SELECT statements that build upon each other.

Think of dbt as Git for SQL transformations. It organizes your data models like code files, tracks changes over time, and ensures that your transformations are reliable, testable, and well-documented - turning your data warehouse into a reliable source of truth.

---

## Why We're Using It In This Project

dbt provides SQL-based data transformation with modern software engineering practices:

- **SQL-first approach**: Write transformations in familiar SQL syntax
- **Version control**: Track changes to data models like code
- **Testing**: Built-in data quality tests and assertions
- **Documentation**: Auto-generated documentation from your SQL comments
- **Incremental processing**: Only reprocess changed data for efficiency
- **Modular design**: Build complex transformations from simple, reusable components
- **Collaboration**: Data analysts can work alongside engineers
- **Warehouse-native**: Runs directly in PostgreSQL without additional infrastructure

---

## How We'll Use It

dbt will transform our raw financial data into analytics-ready datasets:

**Example 1: Basic staging model**
```sql
-- models/staging/stg_sage_transactions.sql
WITH source AS (
    SELECT * FROM {{ source('sage', 'raw_transactions') }}
),

cleaned AS (
    SELECT
        id,
        CAST(amount AS DECIMAL(10,2)) AS amount,
        CAST(date AS DATE) AS transaction_date,
        UPPER(TRIM(account_code)) AS account_code,
        COALESCE(description, 'No description') AS description,
        loaded_at
    FROM source
    WHERE amount IS NOT NULL
)

SELECT * FROM cleaned
```

**Example 2: Dimensional model**
```sql
-- models/marts/dim_accounts.sql
{{ config(materialized='table') }}

WITH accounts AS (
    SELECT DISTINCT
        account_code,
        account_name,
        account_type,
        is_active
    FROM {{ ref('stg_sage_chart_of_accounts') }}
    WHERE account_code IS NOT NULL
)

SELECT
    {{ dbt_utils.generate_surrogate_key(['account_code']) }} AS account_key,
    account_code,
    account_name,
    CASE 
        WHEN account_code LIKE '4%' THEN 'Revenue'
        WHEN account_code LIKE '5%' THEN 'Expenses'
        WHEN account_code LIKE '1%' THEN 'Assets'
        WHEN account_code LIKE '2%' THEN 'Liabilities'
        ELSE 'Other'
    END AS category,
    is_active,
    CURRENT_TIMESTAMP AS created_at
FROM accounts
```

**Example 3: Fact table**
```sql
-- models/marts/fact_transactions.sql
{{ config(materialized='incremental') }}

SELECT
    {{ dbt_utils.generate_surrogate_key(['id', 'source_system']) }} AS transaction_key,
    t.id,
    t.transaction_date,
    a.account_key,
    p.project_key,
    t.amount,
    t.description,
    'Sage' AS source_system,
    CURRENT_TIMESTAMP AS processed_at
FROM {{ ref('stg_sage_transactions') }} t
LEFT JOIN {{ ref('dim_accounts') }} a ON t.account_code = a.account_code
LEFT JOIN {{ ref('dim_projects') }} p ON t.project_id = p.project_id

{% if is_incremental() %}
WHERE t.loaded_at > (SELECT MAX(processed_at) FROM {{ this }})
{% endif %}
```

**Example 4: Data quality tests**
```yaml
# models/schema.yml
models:
  - name: dim_accounts
    columns:
      - name: account_code
        tests:
          - not_null
          - unique

  - name: fact_transactions
    columns:
      - name: amount
        tests:
          - not_null
      - name: transaction_date
        tests:
          - not_null
```

**Example 5: Macros for reusability**
```sql
-- macros/clean_amount.sql
{% macro clean_amount(column_name) %}
    NULLIF(TRIM({{ column_name }}), '')::DECIMAL(10,2)
{% endmacro %}

-- Usage in model
SELECT
    id,
    {{ clean_amount('amount') }} AS clean_amount
FROM raw_data
```

---

## Key Concepts

- **Models**: SQL files that define transformations
- **Sources**: Declarations of raw data tables
- **Materializations**: How models are stored (table, view, incremental)
- **Tests**: Assertions about data quality
- **Macros**: Reusable SQL snippets
- **Seeds**: CSV files loaded into the warehouse

---

## Alternatives We Considered

- **Custom SQL scripts**: No testing, documentation, or version control
- **Stored procedures**: Database-specific, harder to version control
- **Python transformations**: Overkill for SQL-based transformations
- **ELT tools**: More expensive and complex than dbt

---

## Getting Started

1. **Install dbt**: `pip install dbt-postgres`
2. **Initialize project**: `dbt init my_project`
3. **Configure connection**: Edit `profiles.yml`
4. **Write first model**: Create `models/example.sql`
5. **Run dbt**: `dbt run`

---

## Common Patterns & Best Practices

1. **Layered architecture**: staging → intermediate → marts
2. **Incremental models**: For large fact tables
3. **Generic tests**: not_null, unique, relationships
4. **Documentation**: Add descriptions to models and columns
5. **Version control**: Commit dbt project with code

---

## Troubleshooting

**Issue 1:** Model dependencies not resolving  
**Solution:** Check ref() and source() references

**Issue 2:** Incremental models duplicating data  
**Solution:** Verify incremental logic and unique keys

---

## Learning Resources

**Essential:**
- [dbt Documentation](https://docs.getdbt.com/)
- [dbt Tutorial](https://docs.getdbt.com/tutorial/)

**Recommended:**
- [dbt Best Practices](https://docs.getdbt.com/best-practices/)
- [dbt Learn](https://learn.getdbt.com/)

**Community:**
- [dbt Slack](https://www.getdbt.com/community/)
- [dbt GitHub](https://github.com/dbt-labs/dbt)

---

**Related Technologies:**
- [PostgreSQL](https://www.postgresql.org/docs/) - Data warehouse
- [Prefect](prefect.md) - Pipeline orchestration
- [pgvector](pgvector.md) - Vector extensions for AI features
