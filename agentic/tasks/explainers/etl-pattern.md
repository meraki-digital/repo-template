# ETL Pattern

**Category:** Data Engineering  
**Official Docs:** [ETL Wikipedia](https://en.wikipedia.org/wiki/Extract,_transform,_load)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

ETL (Extract, Transform, Load) is a data integration pattern that describes the process of extracting data from various sources, transforming it into a consistent format, and loading it into a target system like a data warehouse. The pattern is fundamental to data engineering and ensures that disparate data sources can be combined and analyzed together. ETL processes handle data cleansing, standardization, and enrichment during the transformation phase.

Think of ETL as a factory assembly line for data. Raw materials (data from various sources) come in, get processed and refined (transformed), and then get assembled into finished products (loaded into the warehouse) ready for use.

---

## Why We're Using It In This Project

ETL pattern ensures reliable data integration from our financial systems:

- **Data consolidation**: Combine data from Sage, APIs, and other sources
- **Quality assurance**: Clean and validate data during transformation
- **Standardization**: Convert different formats to consistent schemas
- **Enrichment**: Add calculated fields and business logic
- **Scalability**: Handle large volumes of financial transaction data
- **Reliability**: Robust error handling and recovery mechanisms
- **Auditability**: Track data lineage and transformation logic
- **Maintainability**: Modular approach to data processing

---

## How We'll Use It

Our ETL pipeline will process financial data using the extract-transform-load pattern:

**Example 1: Extract phase**
```python
def extract_sage_data():
    """Extract data from Sage accounting system"""
    # Connect to Sage database/API
    connection = create_sage_connection()
    
    # Extract different data types
    transactions = connection.execute("""
        SELECT * FROM GL_TRANSACTIONS 
        WHERE POST_DATE >= ?
    """, (start_date,))
    
    accounts = connection.execute("SELECT * FROM CHART_OF_ACCOUNTS")
    customers = connection.execute("SELECT * FROM CUSTOMERS")
    
    return {
        'transactions': transactions,
        'accounts': accounts, 
        'customers': customers
    }

def extract_api_data():
    """Extract data from external APIs"""
    # API calls with pagination
    all_orders = []
    page = 1
    
    while True:
        response = requests.get(f"https://api.example.com/orders?page={page}")
        orders = response.json()
        
        if not orders:
            break
            
        all_orders.extend(orders)
        page += 1
    
    return {'orders': all_orders}
```

**Example 2: Transform phase**
```python
def transform_transactions(raw_transactions, accounts_df):
    """Clean and standardize transaction data"""
    df = pd.DataFrame(raw_transactions)
    
    # Data cleansing
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    df['post_date'] = pd.to_datetime(df['post_date'])
    df['description'] = df['description'].str.strip()
    
    # Remove invalid records
    df = df.dropna(subset=['amount', 'post_date'])
    df = df[df['amount'] != 0]  # Remove zero-amount transactions
    
    # Enrich with account information
    df = df.merge(accounts_df, on='account_code', how='left')
    
    # Add derived columns
    df['month'] = df['post_date'].dt.to_period('M')
    df['is_revenue'] = df['account_code'].str.startswith('4')
    df['is_expense'] = df['account_code'].str.startswith('5')
    
    # Standardize account types
    df['account_category'] = df['account_code'].apply(categorize_account)
    
    return df

def categorize_account(account_code):
    """Map account codes to categories"""
    if account_code.startswith('4'):
        return 'Revenue'
    elif account_code.startswith('5'):
        return 'Expenses'
    elif account_code.startswith('1'):
        return 'Assets'
    elif account_code.startswith('2'):
        return 'Liabilities'
    else:
        return 'Other'
```

**Example 3: Load phase**
```python
def load_to_warehouse(transformed_data, table_name):
    """Load transformed data into PostgreSQL warehouse"""
    engine = create_db_engine()
    
    # Use upsert for incremental loads
    with engine.connect() as conn:
        # Create temp table for staging
        temp_table = f"{table_name}_temp"
        transformed_data.to_sql(temp_table, conn, index=False, if_exists='replace')
        
        # Upsert logic
        upsert_query = f"""
        INSERT INTO {table_name} 
        SELECT * FROM {temp_table}
        ON CONFLICT (transaction_key) 
        DO UPDATE SET
            amount = EXCLUDED.amount,
            updated_at = CURRENT_TIMESTAMP
        """
        
        conn.execute(upsert_query)
        conn.execute(f"DROP TABLE {temp_table}")
        
        # Log load statistics
        load_stats = {
            'table': table_name,
            'records_loaded': len(transformed_data),
            'load_timestamp': datetime.now()
        }
        log_etl_run(load_stats)
```

**Example 4: Complete ETL pipeline**
```python
from prefect import flow, task

@task
def extract():
    sage_data = extract_sage_data()
    api_data = extract_api_data()
    return {'sage': sage_data, 'api': api_data}

@task
def transform(extracted_data):
    accounts_df = pd.DataFrame(extracted_data['sage']['accounts'])
    transactions_df = transform_transactions(
        extracted_data['sage']['transactions'], 
        accounts_df
    )
    return transactions_df

@task
def load(transformed_data):
    load_to_warehouse(transformed_data, 'fact_transactions')

@flow
def financial_etl():
    raw_data = extract()
    clean_data = transform(raw_data)
    load(clean_data)

# Run ETL pipeline
if __name__ == "__main__":
    financial_etl()
```

---

## Key Concepts

- **Extract**: Pull data from source systems
- **Transform**: Clean, validate, and enrich data
- **Load**: Insert data into target system
- **Incremental loading**: Only process new/changed data
- **Error handling**: Graceful failure and recovery
- **Data validation**: Ensure quality before loading

---

## Alternatives We Considered

- **ELT**: Transform in warehouse, less control over data quality
- **Custom scripts**: Harder to monitor and maintain
- **ETL tools**: Complex and expensive
- **Manual processes**: Not scalable or reliable

---

## Getting Started

1. **Identify sources**: What systems provide data
2. **Design transformations**: How to clean and standardize
3. **Choose tools**: Prefect, dbt, custom scripts
4. **Implement incrementally**: Start with one data source
5. **Add monitoring**: Track ETL health and performance

---

## Common Patterns & Best Practices

1. **Idempotent loads**: Safe to run multiple times
2. **Incremental processing**: Only process changed data
3. **Data validation**: Check quality at each stage
4. **Error handling**: Robust failure recovery
5. **Monitoring**: Track pipeline health and performance

---

## Troubleshooting

**Issue 1:** Data quality issues  
**Solution:** Add validation steps and error handling

**Issue 2:** Performance problems  
**Solution:** Optimize transformations and use incremental loads

---

## Learning Resources

**Essential:**
- [ETL Wikipedia](https://en.wikipedia.org/wiki/Extract,_transform,_load)
- [ETL Best Practices](https://www.oreilly.com/library/view/etl-patterns/9781496303268/)

**Recommended:**
- [Building ETL Pipelines](https://realpython.com/etl/)
- [Data Engineering Patterns](https://www.startdataengineering.com/)

**Community:**
- [Data Engineering Subreddit](https://www.reddit.com/r/dataengineering/)
- [ETL World](https://etlworld.com/)

---

**Related Technologies:**
- [Prefect](prefect.md) - Workflow orchestration
- [dbt](dbt.md) - Data transformation
- [pandas](pandas.md) - Data manipulation
- [PostgreSQL](https://www.postgresql.org/docs/) - Target warehouse
