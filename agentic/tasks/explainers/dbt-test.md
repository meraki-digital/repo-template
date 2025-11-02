# dbt test

**Category:** ETL  
**Official Docs:** [https://docs.getdbt.com/docs/build/tests](https://docs.getdbt.com/docs/build/tests)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

dbt test is dbt's built-in data quality testing framework that allows you to define and run tests on your transformed data models. Tests ensure that your data transformations produce reliable, high-quality datasets by checking for common data issues like missing values, duplicates, and referential integrity. dbt tests run as SQL queries against your warehouse, making them fast and integrated with your transformation pipeline.

Think of dbt test as a quality assurance team for your data models. Just as unit tests verify that code functions correctly, dbt tests verify that your data transformations produce clean, consistent, and trustworthy datasets that dashboards and reports can rely on.

---

## Why We're Using It In This Project

dbt test ensures data quality in our financial transformations:

- **Automated validation**: Catch data issues before they reach dashboards
- **Schema enforcement**: Ensure data types and constraints are maintained
- **Referential integrity**: Verify relationships between tables
- **Business rules**: Test financial calculations and aggregations
- **CI/CD integration**: Prevent bad data from entering production
- **Documentation**: Tests serve as living documentation of data expectations
- **Incremental testing**: Test only changed data in incremental models
- **Custom logic**: Support for complex business rule validation

---

## How We'll Use It

dbt test will validate our financial data transformations:

**Example 1: Schema-based tests**
```yaml
# models/marts/schema.yml
models:
  - name: dim_accounts
    columns:
      - name: account_key
        tests:
          - not_null
          - unique

      - name: account_code
        tests:
          - not_null
          - unique

      - name: category
        tests:
          - accepted_values:
              values: ['Revenue', 'Expenses', 'Assets', 'Liabilities', 'Equity']

  - name: fact_transactions
    columns:
      - name: transaction_key
        tests:
          - not_null
          - unique

      - name: amount
        tests:
          - not_null

      - name: transaction_date
        tests:
          - not_null
```

**Example 2: Custom singular tests**
```sql
-- tests/test_account_balances.sql
SELECT
    account_code,
    SUM(amount) as total_amount
FROM {{ ref('fact_transactions') }}
GROUP BY account_code
HAVING SUM(amount) < 0
```

```sql
-- tests/test_transaction_date_range.sql
-- Transactions should be within reasonable date range
SELECT transaction_date
FROM {{ ref('fact_transactions') }}
WHERE transaction_date < '2020-01-01' 
   OR transaction_date > CURRENT_DATE + INTERVAL '30 days'
```

**Example 3: Business logic tests**
```sql
-- tests/test_revenue_accounts_positive.sql
-- Revenue accounts should generally be positive
SELECT
    t.account_code,
    a.account_name,
    SUM(t.amount) as total_amount
FROM {{ ref('fact_transactions') }} t
JOIN {{ ref('dim_accounts') }} a ON t.account_key = a.account_key
WHERE a.category = 'Revenue'
GROUP BY t.account_code, a.account_name
HAVING SUM(t.amount) < 0
```

**Example 4: Referential integrity tests**
```sql
-- tests/test_orphaned_transactions.sql
-- All transactions should have valid account references
SELECT COUNT(*) as orphaned_count
FROM {{ ref('fact_transactions') }} t
LEFT JOIN {{ ref('dim_accounts') }} a ON t.account_key = a.account_key
WHERE a.account_key IS NULL
HAVING COUNT(*) > 0
```

**Example 5: Running tests**
```bash
# Run all tests
dbt test

# Run tests for specific model
dbt test --models dim_accounts

# Run specific test
dbt test --select test_account_balances

# Run tests in CI
dbt test --fail-fast  # Stop on first failure
```

---

## Key Concepts

- **Generic tests**: Built-in tests like not_null, unique, accepted_values
- **Singular tests**: Custom SQL queries that should return no rows
- **Schema files**: YAML files defining model and column tests
- **Test selection**: Run specific tests or groups of tests
- **Test results**: Detailed output showing passed/failed tests

---

## Alternatives We Considered

- **Custom validation scripts**: Harder to maintain and integrate
- **Database constraints**: Don't catch all data quality issues
- **Manual spot checks**: Not scalable or automated

---

## Getting Started

1. **Add schema file**: Create `models/schema.yml`
2. **Define tests**: Add tests to model columns
3. **Run tests**: `dbt test`
4. **Fix failures**: Update data or model logic
5. **Add custom tests**: Create `tests/` directory for singular tests

---

## Common Patterns & Best Practices

1. **Test all dimensions**: not_null and unique for primary keys
2. **Validate relationships**: referential integrity between facts and dims
3. **Business rule tests**: Domain-specific validation logic
4. **Data type checks**: Ensure numeric fields contain numbers
5. **Range validations**: Check dates and amounts are reasonable

---

## Troubleshooting

**Issue 1:** Tests failing unexpectedly  
**Solution:** Check test logic and data in warehouse

**Issue 2:** Tests too slow  
**Solution:** Optimize test queries or run subset of tests

---

## Learning Resources

**Essential:**
- [dbt Tests Documentation](https://docs.getdbt.com/docs/build/tests)
- [dbt Test Examples](https://docs.getdbt.com/best-practices/tests)

**Recommended:**
- [Testing Best Practices](https://docs.getdbt.com/best-practices/testing)
- [dbt Testing Guide](https://docs.getdbt.com/guides/testing)

**Community:**
- [dbt Slack](https://www.getdbt.com/community/)
- [dbt Testing Discussions](https://discourse.getdbt.com/t/testing/325)

---

**Related Technologies:**
- [dbt](dbt.md) - Core transformation tool
- [PostgreSQL](https://www.postgresql.org/docs/) - Test execution environment
