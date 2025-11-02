# Star Schema

**Category:** Data Architecture  
**Official Docs:** [Data Warehouse Design](https://en.wikipedia.org/wiki/Star_schema)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

A star schema is a data warehouse schema design that consists of a central fact table connected to multiple dimension tables, forming a star-like structure. The fact table contains quantitative measures (facts) and foreign keys to dimension tables, while dimension tables contain descriptive attributes. This design optimizes query performance for analytical workloads by reducing the number of table joins and enabling fast aggregations.

Think of a star schema as a simplified map of your business. The center (fact table) contains the "what happened" data (sales, transactions), while the points of the star (dimension tables) describe the "who, when, where, why" context (customers, dates, products, locations).

---

## Why We're Using It In This Project

Star schema provides optimal query performance for our financial analytics:

- **Fast queries**: Fewer joins than normalized schemas
- **Simplified analytics**: Easy to understand and query business metrics
- **Aggregations**: Optimized for SUM, AVG, COUNT operations
- **Reporting friendly**: Natural fit for dashboard and BI tools
- **Scalability**: Handles large volumes of transaction data
- **Flexibility**: Easy to add new dimensions and measures
- **Performance**: Pre-joined structure reduces query complexity
- **User-friendly**: Business users can understand the model

---

## How We'll Use It

Our PostgreSQL data warehouse will use star schema for financial reporting:

**Example 1: Core star schema structure**
```
fact_transactions (Central fact table)
├── transaction_key (PK)
├── account_key (FK → dim_accounts)
├── customer_key (FK → dim_customers)
├── project_key (FK → dim_projects)
├── date_key (FK → dim_dates)
├── amount (measure)
├── quantity (measure)
└── discount_amount (measure)

dim_accounts (Dimension table)
├── account_key (PK)
├── account_code
├── account_name
├── account_type
├── category
└── is_active

dim_customers (Dimension table)
├── customer_key (PK)
├── customer_name
├── industry
├── region
├── credit_rating
└── contract_start_date

dim_dates (Dimension table)
├── date_key (PK)
├── date
├── year
├── quarter
├── month
├── month_name
├── day_of_week
└── is_weekend
```

**Example 2: Querying the star schema**
```sql
-- Monthly revenue by customer and account type
SELECT
    c.customer_name,
    a.account_type,
    d.month_name,
    d.year,
    SUM(ft.amount) as total_revenue
FROM fact_transactions ft
JOIN dim_accounts a ON ft.account_key = a.account_key
JOIN dim_customers c ON ft.customer_key = c.customer_key
JOIN dim_dates d ON ft.date_key = d.date_key
WHERE a.category = 'Revenue'
    AND d.year = 2024
GROUP BY c.customer_name, a.account_type, d.month_name, d.year
ORDER BY d.month_name, SUM(ft.amount) DESC;
```

**Example 3: Adding new dimensions**
```sql
-- Adding project dimension for job costing
CREATE TABLE dim_projects (
    project_key SERIAL PRIMARY KEY,
    project_id VARCHAR(50),
    project_name VARCHAR(200),
    client_name VARCHAR(200),
    project_manager VARCHAR(100),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    status VARCHAR(20)
);

-- Update fact table
ALTER TABLE fact_transactions 
ADD COLUMN project_key INTEGER REFERENCES dim_projects(project_key);
```

---

## Key Concepts

- **Fact tables**: Contain measurements and metrics
- **Dimension tables**: Contain descriptive attributes
- **Degenerate dimensions**: Dimensions stored directly in fact table
- **Slowly changing dimensions**: Handle attribute changes over time
- **Grain**: Level of detail in the fact table

---

## Alternatives We Considered

- **Snowflake schema**: More normalized, slower queries
- **Galaxy schema**: Multiple fact tables, more complex
- **Data vault**: Audit-focused, more complex for analytics
- **Flat tables**: No relationships, harder to maintain

---

## Getting Started

1. **Identify facts**: What metrics to measure
2. **Define dimensions**: How to slice and dice the data
3. **Design grain**: Level of detail needed
4. **Create tables**: Build fact and dimension tables
5. **Load data**: Populate with ETL processes

---

## Common Patterns & Best Practices

1. **Surrogate keys**: Use integer keys for performance
2. **Consistent naming**: Fact_ and dim_ prefixes
3. **Avoid nulls**: Use default values in dimensions
4. **Date dimensions**: Rich calendar attributes
5. ** SCD Type 2**: Handle dimension changes

---

## Troubleshooting

**Issue 1:** Query performance  
**Solution:** Add appropriate indexes and consider aggregation tables

**Issue 2:** Data consistency  
**Solution:** Use constraints and validate ETL processes

---

## Learning Resources

**Essential:**
- [Star Schema Wikipedia](https://en.wikipedia.org/wiki/Star_schema)
- [Kimball Data Warehouse Toolkit](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/)

**Recommended:**
- [Data Warehouse Design Best Practices](https://www.guru99.com/star-snowflake-data-warehousing.html)
- [Dimensional Modeling](https://www.kimballgroup.com/2003/01/02/design-tip-63-anatomy-of-a-dimension/)

**Community:**
- [Data Warehouse Subreddit](https://www.reddit.com/r/datawarehouse/)
- [Kimball Group](https://www.kimballgroup.com/)

---

**Related Technologies:**
- [PostgreSQL](https://www.postgresql.org/docs/) - Database platform
- [dbt](dbt.md) - Transformation tool
- [ETL Pattern](etl-pattern.md) - Data loading approach
