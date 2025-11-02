# AWS CloudWatch

**Category:** Cloud Services / Monitoring & Logging
**Official Docs:** https://docs.aws.amazon.com/cloudwatch/
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

AWS CloudWatch is a monitoring and observability service that collects logs, metrics, and events from AWS services. It's like a security camera system for your cloud infrastructure: Lambda functions, RDS databases, and API Gateway all send data to CloudWatch, where you can view logs, set up alerts, and track performance metrics.

For our project, CloudWatch captures Lambda function logs (did RDS start succeed?) and RDS metrics (CPU usage, connection count), helping us debug issues and monitor system health.

---

## Why We're Using It In This Project

- **Lambda function logs** - Debug RDS start/stop operations by viewing execution logs
- **RDS monitoring** - Track database CPU, memory, and connection metrics
- **Error tracking** - See exceptions from authentication endpoints
- **Performance analysis** - Identify slow database queries or Lambda cold starts
- **Future alerting** - CloudWatch Alarms notify when RDS auto-stop fails

---

## How We'll Use It

**Example 1: Viewing Lambda Function Logs**
```bash
# View logs via AWS CLI
aws logs tail /aws/lambda/start-rds-function --follow

# Or in AWS Console:
# CloudWatch → Logs → Log groups → /aws/lambda/start-rds-function
# Click latest log stream to see output
```

**Example 2: Lambda Function Writing to CloudWatch**
```python
# Lambda function automatically logs print statements
import json

def lambda_handler(event, context):
    print(f"Received event: {json.dumps(event)}")  # Appears in CloudWatch Logs

    try:
        # RDS start operation
        result = rds.start_db_instance(DBInstanceIdentifier='ss-financial-prod')
        print(f"RDS start initiated: {result['DBInstance']['DBInstanceStatus']}")
        return {'statusCode': 200, 'body': 'Success'}
    except Exception as e:
        print(f"ERROR: {str(e)}")  # Logged to CloudWatch
        return {'statusCode': 500, 'body': 'Failed'}
```

**Example 3: Querying Logs with CloudWatch Insights**
```
# CloudWatch Logs Insights Query (in AWS Console)
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 20

# Find all RDS start operations in last hour:
fields @timestamp, @message
| filter @message like /RDS start initiated/
| sort @timestamp desc
```

**Example 4: Viewing RDS Metrics**
```python
import boto3
from datetime import datetime, timedelta

cloudwatch = boto3.client('cloudwatch')

# Get RDS CPU usage for last hour
response = cloudwatch.get_metric_statistics(
    Namespace='AWS/RDS',
    MetricName='CPUUtilization',
    Dimensions=[{'Name': 'DBInstanceIdentifier', 'Value': 'ss-financial-prod'}],
    StartTime=datetime.utcnow() - timedelta(hours=1),
    EndTime=datetime.utcnow(),
    Period=300,  # 5-minute intervals
    Statistics=['Average']
)

for datapoint in response['Datapoints']:
    print(f"{datapoint['Timestamp']}: {datapoint['Average']}% CPU")
```

---

## Key Concepts

- **Log Group:** Container for log streams (e.g., `/aws/lambda/start-rds-function`)
- **Log Stream:** Sequence of log events from a single source (one Lambda execution)
- **Log Event:** Single log entry with timestamp and message
- **Metric:** Time-series data point (RDS CPU usage, Lambda invocation count)
- **Namespace:** Category for metrics (AWS/RDS, AWS/Lambda, custom)
- **Dimension:** Name-value pair that identifies metric source (DBInstanceIdentifier=ss-financial-prod)

---

## Alternatives We Considered

- **Datadog:** Third-party monitoring with beautiful dashboards but costs $15+/month per host
- **Self-hosted ELK stack:** More control but requires managing Elasticsearch/Kibana infrastructure
- **CloudWatch alone:** Built-in, free tier generous (5GB logs, 1M custom metrics), AWS-native integration
- **Splunk:** Enterprise-grade but expensive and overkill for our scale

---

## Getting Started

1. **View Lambda logs (automatic):**
   - Lambda functions automatically send logs to CloudWatch
   - CloudWatch → Logs → /aws/lambda/your-function-name

2. **View RDS metrics (automatic):**
   - RDS automatically sends metrics to CloudWatch
   - CloudWatch → Metrics → RDS → Per-Database Metrics
   - Select `ss-financial-prod` → CPUUtilization, DatabaseConnections

3. **Enable detailed monitoring (optional):**
   ```bash
   # Enable 1-minute metric intervals for RDS (default is 5 minutes)
   aws rds modify-db-instance \
     --db-instance-identifier ss-financial-prod \
     --monitoring-interval 60
   ```

4. **Query logs with Insights:**
   - CloudWatch → Logs → Insights
   - Select log group → Run query

---

## Common Patterns & Best Practices

1. **Use structured logging** - Log JSON for easier querying: `print(json.dumps({'event': 'rds_start', 'status': 'success'}))`
2. **Set log retention** - Default is "Never expire"; set to 7-30 days to reduce costs
3. **Use metric filters** - Convert log patterns into metrics (count of "ERROR" messages)
4. **Create dashboards** - Visualize RDS CPU, Lambda errors, API latency in one view
5. **Tag resources** - Add tags to Lambda/RDS for easier filtering in CloudWatch

---

## Troubleshooting

**Issue 1:** No logs appearing for Lambda function
**Solution:** Verify Lambda execution role has `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents` permissions

**Issue 2:** Can't find RDS metrics
**Solution:** Metrics appear in CloudWatch with ~5 minute delay. Check namespace is `AWS/RDS` and dimension matches instance ID.

**Issue 3:** CloudWatch Insights query returns no results
**Solution:** Verify time range includes log events. Try expanding to last 7 days.

**Issue 4:** High CloudWatch costs
**Solution:** Reduce log retention period (30 days → 7 days) and delete old log groups

---

## Learning Resources

**Essential:**
- [CloudWatch Documentation](https://docs.aws.amazon.com/cloudwatch/)
- [CloudWatch Logs Insights Query Syntax](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)

**Recommended:**
- [CloudWatch Metrics and Dimensions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html)
- [RDS CloudWatch Metrics](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/monitoring-cloudwatch.html)

**Community:**
- [AWS CloudWatch Forum](https://forums.aws.amazon.com/)

---

**Related Technologies:**
- [AWS Lambda](aws-lambda.md) - Functions that send logs to CloudWatch
- [AWS RDS](aws-rds.md) - Database metrics tracked in CloudWatch
- [CloudWatch Alarms](cloudwatch-alarms.md) - Alerts based on CloudWatch metrics
- [AWS EventBridge](aws-eventbridge.md) - Can trigger actions based on CloudWatch events
