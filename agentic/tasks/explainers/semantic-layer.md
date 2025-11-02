# Semantic Layer

**Category:** Data Architecture  
**Official Docs:** [Semantic Layer Concepts](https://en.wikipedia.org/wiki/Semantic_layer)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

A semantic layer is an abstraction layer that sits between raw data and business users, providing a simplified, business-friendly view of complex data structures. It defines business terms, calculations, and relationships in a way that non-technical users can understand and use. The semantic layer translates business questions into technical queries, ensuring consistency and accuracy across reports and dashboards.

Think of a semantic layer as a universal translator for your data warehouse. It speaks both "business language" (revenue, customers, profit margins) and "database language" (SQL joins, aggregations, complex calculations), allowing business users to access data without needing to understand the underlying technical complexity.

---

## Why We're Using It In This Project

Semantic layer provides business-friendly access to our financial data:

- **Business terminology**: Users see "Revenue" not complex SQL
- **Consistent definitions**: Single source of truth for calculations
- **Self-service analytics**: Business users can explore data independently
- **Governance**: Centralized control over data definitions and access
- **Performance optimization**: Pre-defined efficient queries
- **Change management**: Update business logic in one place
- **User adoption**: Familiar concepts reduce training time
- **Regulatory compliance**: Standardized financial reporting

---

## How We'll Use It

Our semantic layer will provide business definitions for financial analytics:

**Example 1: Business metrics definitions**
```sql
-- Revenue semantic definition
CREATE VIEW semantic_revenue AS
SELECT
    transaction_date,
    SUM(CASE 
        WHEN account_code LIKE '4%' THEN amount 
        ELSE 0 
    END) as total_revenue,
    SUM(CASE 
        WHEN account_code LIKE '41%' THEN amount 
        ELSE 0 
    END) as product_revenue,
    SUM(CASE 
        WHEN account_code LIKE '42%' THEN amount 
        ELSE 0 
    END) as service_revenue
FROM fact_transactions t
JOIN dim_accounts a ON t.account_key = a.account_key
WHERE a.category = 'Revenue'
GROUP BY transaction_date;

-- Profit margin calculation
CREATE VIEW semantic_profit_margins AS
SELECT
    month,
    total_revenue,
    total_expenses,
    (total_revenue - total_expenses) as gross_profit,
    CASE 
        WHEN total_revenue > 0 
        THEN ((total_revenue - total_expenses) / total_revenue) * 100 
        ELSE 0 
    END as profit_margin_percentage
FROM (
    SELECT 
        DATE_TRUNC('month', transaction_date) as month,
        SUM(CASE WHEN account_category = 'Revenue' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN account_category = 'Expenses' THEN amount ELSE 0 END) as total_expenses
    FROM fact_transactions ft
    JOIN dim_accounts da ON ft.account_key = da.account_key
    GROUP BY DATE_TRUNC('month', transaction_date)
) monthly_totals;
```

**Example 2: Customer segmentation semantic layer**
```sql
-- Customer lifetime value
CREATE VIEW semantic_customer_ltv AS
SELECT
    c.customer_name,
    c.industry,
    COUNT(t.transaction_key) as total_transactions,
    SUM(t.amount) as total_revenue,
    AVG(t.amount) as avg_transaction_value,
    MAX(t.transaction_date) as last_transaction_date,
    MIN(t.transaction_date) as first_transaction_date,
    DATEDIFF('day', MIN(t.transaction_date), MAX(t.transaction_date)) as customer_age_days,
    CASE
        WHEN SUM(t.amount) > 100000 THEN 'High Value'
        WHEN SUM(t.amount) > 50000 THEN 'Medium Value'
        ELSE 'Low Value'
    END as customer_segment
FROM dim_customers c
LEFT JOIN fact_transactions t ON c.customer_key = t.customer_key
GROUP BY c.customer_key, c.customer_name, c.industry;
```

**Example 3: AI query semantic mapping**
```python
# Map natural language to semantic queries
SEMANTIC_MAPPINGS = {
    "total revenue": "SELECT SUM(total_revenue) FROM semantic_revenue",
    "monthly profit": "SELECT month, gross_profit FROM semantic_profit_margins ORDER BY month",
    "top customers": "SELECT customer_name, total_revenue FROM semantic_customer_ltv ORDER BY total_revenue DESC LIMIT 10",
    "customer segments": "SELECT customer_segment, COUNT(*) as count FROM semantic_customer_ltv GROUP BY customer_segment"
}

def translate_to_semantic_query(natural_query: str) -> str:
    """Convert business questions to semantic layer queries"""
    query_lower = natural_query.lower()
    
    for semantic_term, sql_query in SEMANTIC_MAPPINGS.items():
        if semantic_term in query_lower:
            return sql_query
    
    # Fallback to AI generation if no semantic match
    return generate_sql_with_ai(natural_query)
```

**Example 4: Dashboard semantic layer**
```python
# Dashboard components using semantic layer
DASHBOARD_METRICS = {
    "revenue_trend": {
        "query": "SELECT month, total_revenue FROM semantic_revenue ORDER BY month",
        "chart_type": "line",
        "title": "Monthly Revenue Trend"
    },
    
    "profit_margins": {
        "query": "SELECT month, profit_margin_percentage FROM semantic_profit_margins ORDER BY month",
        "chart_type": "bar",
        "title": "Monthly Profit Margins",
        "format": "percentage"
    },
    
    "customer_segments": {
        "query": "SELECT customer_segment, COUNT(*) as count FROM semantic_customer_ltv GROUP BY customer_segment",
        "chart_type": "pie",
        "title": "Customer Segmentation"
    }
}

def get_dashboard_data(metric_name: str):
    """Retrieve dashboard data using semantic layer"""
    if metric_name not in DASHBOARD_METRICS:
        raise ValueError(f"Unknown metric: {metric_name}")
    
    metric_config = DASHBOARD_METRICS[metric_name]
    query = metric_config["query"]
    
    # Execute semantic query
    result = execute_query(query)
    
    return {
        "data": result,
        "config": metric_config
    }
```

---

## Key Concepts

- **Business terms**: Revenue, customers, profit margins
- **Calculated metrics**: Complex business calculations
- **Data relationships**: How different entities connect
- **Access controls**: Who can see what data
- **Caching**: Performance optimization for common queries
- **Versioning**: Track changes to business definitions

---

## Alternatives We Considered

- **Direct SQL access**: Too technical for business users
- **BI tool semantic layers**: Vendor-specific, less control
- **No abstraction**: Inconsistent definitions across reports
- **Manual calculations**: Error-prone and time-consuming

---

## Getting Started

1. **Identify business terms**: What metrics matter to users
2. **Create semantic views**: Build business-friendly data models
3. **Define calculations**: Centralize complex business logic
4. **Add documentation**: Explain what each metric means
5. **Implement access**: Control who can use which semantics

---

## Common Patterns & Best Practices

1. **Consistent naming**: Use business terminology
2. **Single source of truth**: One definition per business concept
3. **Performance optimization**: Pre-calculate complex metrics
4. **Version control**: Track changes to business logic
5. **User feedback**: Iterate based on user needs

---

## Troubleshooting

**Issue 1:** Performance issues  
**Solution:** Add indexes and consider materializing views

**Issue 2:** Changing business requirements  
**Solution:** Version semantic definitions and communicate changes

---

## Learning Resources

**Essential:**
- [Semantic Layer Wikipedia](https://en.wikipedia.org/wiki/Semantic_layer)
- [Kimball Semantic Layer](https://www.kimballgroup.com/2004/04/the-semantic-layer/)

**Recommended:**
- [Building Semantic Layers](https://www.oreilly.com/library/view/agile-data-warehouse/9780321329304/)
- [Data Modeling Best Practices](https://www.guru99.com/data-modeling-conceptual-logical.html)

**Community:**
- [Data Warehouse Subreddit](https://www.reddit.com/r/datawarehouse/)
- [Kimball Group](https://www.kimballgroup.com/)

---

**Related Technologies:**
- [dbt](dbt.md) - Creates semantic models
- [PostgreSQL](https://www.postgresql.org/docs/) - Hosts semantic views
- [Star Schema](star-schema.md) - Underlying data structure
