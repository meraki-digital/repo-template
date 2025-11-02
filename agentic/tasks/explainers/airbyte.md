# Airbyte

**Category:** ETL  
**Official Docs:** [https://docs.airbyte.com/](https://docs.airbyte.com/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Airbyte is an open-source data integration platform that provides pre-built connectors for extracting data from various sources and loading it into destinations. It offers a user-friendly interface for configuring data pipelines without writing custom code, supporting both batch and incremental data synchronization. Airbyte is particularly useful for connecting to SaaS applications, databases, and APIs that don't have native Python libraries.

Think of Airbyte as a universal translator for data sources. Instead of writing custom scripts to pull data from each system (Sage, time tracking, equipment systems), Airbyte provides ready-made connectors that handle authentication, pagination, error handling, and data transformation automatically.

---

## Why We're Using It In This Project

Airbyte simplifies data ingestion from our diverse financial systems:

- **Pre-built connectors**: Ready-made integrations for Sage, APIs, and databases
- **No custom code**: Configure connections through UI instead of writing ETL scripts
- **Incremental syncs**: Only transfer changed data to reduce processing time
- **Schema management**: Automatically detect and handle schema changes
- **Monitoring**: Built-in dashboards for pipeline health and performance
- **Open source**: No vendor lock-in and extensive connector ecosystem
- **API-first**: REST API for automation and integration with Prefect
- **Cost-effective**: Self-hosted option avoids expensive data integration services

---

## How We'll Use It

Airbyte will handle data extraction from our source systems into staging tables:

**Example 1: Sage GL connector setup**
```yaml
# Airbyte connection configuration
source:
  type: "sage"
  config:
    api_key: "${SAGE_API_KEY}"
    company_id: "our-company"
    start_date: "2020-01-01"

destination:
  type: "postgres"
  config:
    host: "warehouse-db"
    database: "financial_data"
    schema: "staging"

sync:
  schedule: "0 2 * * *"  # Daily at 2 AM
  mode: "incremental"
```

**Example 2: API data source**
```yaml
source:
  type: "rest_api"
  config:
    url: "https://api.time-tracking.com/v1/entries"
    method: "GET"
    headers:
      Authorization: "Bearer ${API_TOKEN}"
    pagination:
      type: "offset"
      page_size: 100

destination:
  type: "postgres"
  config:
    table: "time_entries"
```

**Example 3: Integration with Prefect**
```python
from prefect import flow, task
import requests

@task
def trigger_airbyte_sync(connection_id: str):
    """Trigger Airbyte sync via API"""
    response = requests.post(
        f"{AIRBYTE_URL}/api/v1/connections/sync",
        json={"connectionId": connection_id},
        headers={"Authorization": f"Bearer {AIRBYTE_TOKEN}"}
    )
    response.raise_for_status()
    return response.json()["job"]["id"]

@task
def wait_for_sync_completion(job_id: str):
    """Wait for Airbyte sync to complete"""
    while True:
        response = requests.get(
            f"{AIRBYTE_URL}/api/v1/jobs/{job_id}"
        )
        status = response.json()["job"]["status"]
        if status == "succeeded":
            break
        elif status == "failed":
            raise Exception("Airbyte sync failed")
        time.sleep(30)

@flow
def etl_pipeline():
    job_id = trigger_airbyte_sync("sage-connection-id")
    wait_for_sync_completion(job_id)
    # Continue with Prefect transformation tasks
```

**Example 4: Schema mapping**
```json
{
  "mappings": [
    {
      "from": "Sage GL",
      "to": "financial_transactions",
      "field_mappings": {
        "TransactionDate": "date",
        "AccountCode": "account_code", 
        "Amount": "amount",
        "Description": "description"
      }
    }
  ]
}
```

---

## Key Concepts

- **Sources**: Data systems to extract from (APIs, databases, files)
- **Destinations**: Where to load data (warehouses, databases, data lakes)
- **Connections**: Configured pipelines from source to destination
- **Sync modes**: Full refresh or incremental updates
- **Streams**: Individual data tables or endpoints within a source

---

## Alternatives We Considered

- **Custom Python scripts**: Time-consuming to build and maintain
- **Stitch Data**: SaaS-only, expensive for our scale
- **Fivetran**: Enterprise-focused pricing
- **Manual data exports**: Not automated or scalable

---

## Getting Started

1. **Deploy Airbyte**: Use Docker or cloud deployment
2. **Configure source**: Select connector and enter credentials
3. **Configure destination**: Set up warehouse connection
4. **Create connection**: Link source to destination
5. **Test sync**: Run manual sync to verify data flow

---

## Common Patterns & Best Practices

1. **Incremental syncs**: Use for large datasets to reduce sync time
2. **Schema evolution**: Handle source schema changes gracefully
3. **Error handling**: Monitor sync failures and data quality issues
4. **Testing**: Test connections with sample data before production
5. **Documentation**: Document custom field mappings and transformations

---

## Troubleshooting

**Issue 1:** Connection authentication fails  
**Solution:** Verify credentials and network connectivity

**Issue 2:** Schema changes break downstream processes  
**Solution:** Use schema change detection and notifications

---

## Learning Resources

**Essential:**
- [Airbyte Documentation](https://docs.airbyte.com/)
- [Airbyte Quick Start](https://docs.airbyte.com/quickstart/)

**Recommended:**
- [Airbyte Connectors](https://docs.airbyte.com/integrations/)
- [Airbyte API](https://docs.airbyte.com/api-documentation/)

**Community:**
- [Airbyte GitHub](https://github.com/airbytehq/airbyte)
- [Airbyte Slack](https://slack.airbyte.com/)

---

**Related Technologies:**
- [Prefect](prefect.md) - Workflow orchestration for post-Airbyte processing
- [PostgreSQL](https://www.postgresql.org/docs/) - Common destination
- [pgvector](pgvector.md) - For AI-ready data storage
