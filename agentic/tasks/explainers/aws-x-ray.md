# AWS X-Ray

**Category:** Infrastructure  
**Official Docs:** [AWS X-Ray Documentation](https://docs.aws.amazon.com/xray/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

AWS X-Ray is a distributed tracing service that helps developers analyze and debug distributed applications, such as those built using microservices architecture. It provides insights into how requests flow through your application, identifies performance bottlenecks, and helps troubleshoot issues across multiple services. X-Ray collects trace data from your applications and visualizes it as service maps and trace timelines.

Think of X-Ray as a GPS tracker for your application's requests. It follows each request as it travels through your system, recording where it goes, how long it takes at each stop, and if it encounters any problems along the way.

---

## Why We're Using It In This Project

AWS X-Ray provides observability for our distributed financial application:

- **Request tracing**: Track requests across FastAPI, PostgreSQL, and OpenAI services
- **Performance monitoring**: Identify slow database queries and API calls
- **Error tracking**: Pinpoint where failures occur in the request flow
- **Service maps**: Visualize application architecture and dependencies
- **Debugging aid**: Troubleshoot issues in production environments
- **Cost optimization**: Identify inefficient code paths and bottlenecks
- **User experience**: Monitor end-to-end request performance
- **Compliance**: Audit trails for financial data processing

---

## How We'll Use It

AWS X-Ray will trace requests through our entire application stack:

**Example 1: FastAPI integration**
```python
from fastapi import FastAPI, Request
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.ext.fastapi.middleware import XRayMiddleware

app = FastAPI()

# Configure X-Ray
xray_recorder.configure(
    service_name='financial-api',
    sampling=True
)

# Add X-Ray middleware
app.add_middleware(XRayMiddleware, recorder=xray_recorder)

@app.get("/api/dashboard")
def get_dashboard_data(request: Request):
    # X-Ray automatically traces this request
    # Segments will be created for database calls, external APIs, etc.
    return {"data": "dashboard metrics"}

# Manual tracing for complex operations
from aws_xray_sdk.core import patch

@app.post("/api/ask")
def process_ai_query(query: str):
    with xray_recorder.in_subsegment('ai_query_processing') as subsegment:
        subsegment.put_annotation('query_length', len(query))
        
        # Call OpenAI API
        with xray_recorder.in_subsegment('openai_call') as ai_segment:
            response = call_openai_api(query)
            ai_segment.put_metadata('tokens_used', response.usage.total_tokens)
        
        # Process response
        with xray_recorder.in_subsegment('response_processing'):
            result = process_response(response)
        
        return result
```

**Example 2: Database tracing**
```python
from aws_xray_sdk.ext.sqlalchemy import XRaySQLAlchemy
from sqlalchemy import create_engine

# Patch SQLAlchemy for automatic tracing
XRaySQLAlchemy(engine)

# Database operations are now automatically traced
def get_transactions():
    with xray_recorder.in_subsegment('database_query') as subsegment:
        subsegment.put_annotation('table', 'transactions')
        subsegment.put_annotation('operation', 'select')
        
        result = session.query(Transaction).filter(
            Transaction.date >= start_date
        ).all()
        
        subsegment.put_metadata('record_count', len(result))
        return result
```

**Example 3: Custom tracing**
```python
from aws_xray_sdk.core import xray_recorder

class FinancialProcessor:
    def __init__(self):
        self.recorder = xray_recorder
    
    def process_monthly_report(self, month: str, year: int):
        # Create main segment for the entire operation
        with self.recorder.in_subsegment('monthly_report') as segment:
            segment.put_annotation('month', month)
            segment.put_annotation('year', year)
            
            # Data extraction
            with self.recorder.in_subsegment('data_extraction') as sub:
                raw_data = self.extract_data(month, year)
                sub.put_metadata('records_extracted', len(raw_data))
            
            # Validation
            with self.recorder.in_subsegment('data_validation') as sub:
                validated_data = self.validate_data(raw_data)
                sub.put_metadata('validation_errors', 
                               len(raw_data) - len(validated_data))
            
            # Report generation
            with self.recorder.in_subsegment('report_generation') as sub:
                report = self.generate_report(validated_data)
                sub.put_metadata('report_size', len(report))
            
            return report
```

**Example 4: Error tracking**
```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Record error in current segment
    segment = xray_recorder.current_segment()
    if segment:
        segment.add_error(exc)
        segment.put_annotation('error_type', type(exc).__name__)
        segment.put_metadata('error_message', str(exc))
    
    # Re-raise for normal error handling
    raise exc

def call_external_api(url: str, data: dict):
    with xray_recorder.in_subsegment('external_api_call') as subsegment:
        subsegment.put_annotation('api_url', url)
        subsegment.put_annotation('method', 'POST')
        
        try:
            response = requests.post(url, json=data, timeout=30)
            response.raise_for_status()
            
            subsegment.put_annotation('status_code', response.status_code)
            return response.json()
            
        except requests.RequestException as e:
            # Record the error
            subsegment.add_error(e)
            subsegment.put_annotation('error', 'api_call_failed')
            raise
```

---

## Key Concepts

- **Traces**: Complete journey of a single request through the system
- **Segments**: Individual operations within a trace
- **Subsegments**: Detailed operations within segments
- **Service Map**: Visual representation of application architecture
- **Sampling**: Configurable rate of requests to trace for cost control

---

## Alternatives We Considered

- **Custom logging**: Doesn't provide timing and dependency visualization
- **Application Performance Monitoring (APM)**: More expensive than X-Ray
- **OpenTelemetry**: More complex setup and configuration
- **Manual instrumentation**: Time-consuming and error-prone

---

## Getting Started

1. **Enable X-Ray**: Configure IAM permissions and enable in services
2. **Install SDK**: `pip install aws-xray-sdk`
3. **Configure recorder**: Set service name and sampling rules
4. **Add middleware**: Integrate with FastAPI and other frameworks
5. **View traces**: Use AWS X-Ray console to analyze traces

---

## Common Patterns & Best Practices

1. **Use annotations**: Add metadata for filtering and searching
2. **Create subsegments**: Break down complex operations
3. **Handle errors**: Record exceptions in traces
4. **Configure sampling**: Balance visibility with cost
5. **Monitor performance**: Set up alerts on slow traces

---

## Troubleshooting

**Issue 1:** Traces not appearing  
**Solution:** Check IAM permissions and service configuration

**Issue 2:** High costs  
**Solution:** Adjust sampling rates and retention periods

---

## Learning Resources

**Essential:**
- [AWS X-Ray Documentation](https://docs.aws.amazon.com/xray/)
- [X-Ray Developer Guide](https://docs.aws.amazon.com/xray/latest/devguide/)

**Recommended:**
- [X-Ray Python SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-python.html)
- [Distributed Tracing Best Practices](https://aws.amazon.com/builders-library/distributed-tracing/)

**Community:**
- [AWS X-Ray Blog](https://aws.amazon.com/blogs/aws/category/aws-x-ray/)
- [AWS Forums](https://forums.aws.amazon.com/forum.jspa?forumID=291)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Application framework being traced
- [AWS CloudWatch](https://docs.aws.amazon.com/cloudwatch/) - Complementary monitoring
- [OpenTelemetry](opentelemetry.md) - Alternative observability framework
