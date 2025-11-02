# Prefect

**Category:** ETL  
**Official Docs:** [https://docs.prefect.io/](https://docs.prefect.io/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Prefect is a modern workflow orchestration framework for building, running, and monitoring data pipelines. It allows you to define complex ETL processes as Python code with clear task dependencies, error handling, and retry logic. Unlike traditional tools like Apache Airflow, Prefect is designed specifically for Python developers and integrates seamlessly with existing Python codebases.

Think of Prefect as a sophisticated project manager for your data pipelines. It breaks down complex ETL processes into manageable tasks, ensures they run in the correct order, handles failures gracefully, and keeps you informed about the progress of your data workflows.

---

## Why We're Using It In This Project

Prefect provides reliable workflow orchestration for our financial data pipelines:

- **Python-native**: Write ETL logic in pure Python without complex DSLs
- **Error handling**: Built-in retry logic and failure recovery
- **Task dependencies**: Clear definition of execution order and parallel processing
- **Monitoring**: Web UI for tracking pipeline status and debugging
- **Scalable**: Handles both simple scripts and complex distributed workflows
- **Flexible deployment**: Run locally for development, deploy to cloud for production
- **Observability**: Detailed logs and metrics for troubleshooting
- **Community**: Active development and extensive documentation

---

## How We'll Use It

Prefect will orchestrate our ETL processes for financial data:

**Example 1: Basic ETL flow**
```python
from prefect import flow, task
import pandas as pd

@task
def extract_sage_data():
    # Connect to Sage and extract transaction data
    return pd.read_csv('sage_export.csv')

@task
def transform_data(raw_data):
    # Clean and transform the data
    df = pd.DataFrame(raw_data)
    df['amount'] = pd.to_numeric(df['amount'])
    return df

@task
def load_to_warehouse(clean_data):
    # Load into PostgreSQL warehouse
    clean_data.to_sql('transactions', engine, if_exists='append')

@flow
def sage_etl_flow():
    raw = extract_sage_data()
    clean = transform_data(raw)
    load_to_warehouse(clean)

# Run the flow
sage_etl_flow()
```

**Example 2: Complex dependencies**
```python
@task
def validate_sage_data(data):
    # Check data quality
    assert len(data) > 0, "No data received"
    return data

@task
def update_dimensions(data):
    # Update customer, project, account dimensions
    pass

@flow
def full_etl_pipeline():
    raw_data = extract_sage_data()
    validated = validate_sage_data(raw_data)
    
    # Parallel processing
    transformed = transform_data(validated)
    dimensions_updated = update_dimensions(validated)
    
    # Load depends on both transforms completing
    load_to_warehouse(transformed, wait_for=[dimensions_updated])
```

**Example 3: Error handling and retries**
```python
from prefect import task, flow
from prefect.tasks import task_input_hash
from datetime import timedelta

@task(retries=3, retry_delay_seconds=60)
def extract_from_api(api_endpoint):
    response = requests.get(api_endpoint)
    response.raise_for_status()
    return response.json()

@task(cache_key_fn=task_input_hash, cache_expiration=timedelta(hours=1))
def process_large_dataset(data):
    # Expensive processing - cache results
    return expensive_transform(data)

@flow
def robust_etl():
    try:
        data = extract_from_api("https://api.sage.com/transactions")
        processed = process_large_dataset(data)
        load_to_warehouse(processed)
    except Exception as e:
        logger.error(f"ETL failed: {e}")
        # Send notification
        raise
```

**Example 4: Deployment configuration**
```python
from prefect.deployments import Deployment

# Create deployment for production
deployment = Deployment.build_from_flow(
    flow=sage_etl_flow,
    name="production-sage-etl",
    version="1.0",
    work_queue_name="production"
)

deployment.apply()
```

---

## Key Concepts

- **Flows**: Container for tasks that defines the overall workflow
- **Tasks**: Individual units of work within a flow
- **States**: Track execution status (pending, running, completed, failed)
- **Deployments**: Configuration for running flows in different environments
- **Work Queues**: Manage flow execution and scaling

---

## Alternatives We Considered

- **Apache Airflow**: More complex setup and steeper learning curve
- **Luigi**: Older Python workflow tool, less actively maintained
- **Custom scripts**: No orchestration or monitoring capabilities
- **AWS Step Functions**: Cloud-specific, less flexible for custom logic

---

## Getting Started

1. **Install Prefect**: `pip install prefect`
2. **Create a simple flow**:
   ```python
   from prefect import flow, task
   
   @task
   def hello_task():
       return "Hello, World!"
   
   @flow
   def hello_flow():
       result = hello_task()
       print(result)
   
   hello_flow()
   ```
3. **Run Prefect server** for UI: `prefect server start`

---

## Common Patterns & Best Practices

1. **Task composition**: Break complex operations into smaller, testable tasks
2. **Error handling**: Use retries and proper exception handling
3. **Caching**: Cache expensive operations to improve performance
4. **Logging**: Use Prefect's logging for observability
5. **Testing**: Test flows and tasks independently

---

## Troubleshooting

**Issue 1:** Flow not running as expected  
**Solution:** Check task dependencies and state transitions

**Issue 2:** Memory issues with large datasets  
**Solution:** Process data in chunks or use streaming approaches

---

## Learning Resources

**Essential:**
- [Prefect Documentation](https://docs.prefect.io/)
- [Prefect Tutorial](https://docs.prefect.io/tutorials/first-steps/)

**Recommended:**
- [Prefect Flows & Tasks](https://docs.prefect.io/concepts/flows/)
- [Prefect Best Practices](https://docs.prefect.io/concepts/best-practices/)

**Community:**
- [Prefect GitHub](https://github.com/PrefectHQ/prefect)
- [Prefect Slack](https://prefect.io/slack/)

---

**Related Technologies:**
- [Python 3.11](python-311.md) - Runtime for Prefect
- [pandas](pandas.md) - Data processing in ETL tasks
- [PostgreSQL](https://www.postgresql.org/docs/) - Data warehouse target
- [pg_cron](pg-cron.md) - Alternative scheduling approach
