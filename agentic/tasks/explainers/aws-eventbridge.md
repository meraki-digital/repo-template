# AWS EventBridge

**Category:** Cloud Services / Event Management
**Official Docs:** https://docs.aws.amazon.com/eventbridge/
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

AWS EventBridge is a serverless event bus service that routes events from various sources to target services based on rules you define. Think of it as a smart notification system: you create rules like "every 15 minutes" or "when file uploaded to S3", and EventBridge triggers actions (invoke Lambda, send SNS notification, etc.).

For scheduled events (cron jobs), EventBridge replaces the older CloudWatch Events service with more features and better integration.

---

## Why We're Using It In This Project

- **RDS auto-stop scheduler** - Trigger Lambda function every 15 minutes to check for database inactivity
- **Serverless cron** - No need to run a server just to execute scheduled tasks
- **Reliable scheduling** - AWS-managed service with high availability
- **Cost-effective** - First 1 million events per month are free
- **Easy Lambda integration** - Built-in support for triggering Lambda functions

---

## How We'll Use It

**Example 1: Create Scheduled Rule (Every 15 Minutes)**
```bash
# AWS CLI
aws events put-rule \
  --name rds-auto-stop-check \
  --schedule-expression "rate(15 minutes)" \
  --description "Check RDS inactivity every 15 minutes"
```

**Example 2: Add Lambda Target to Rule**
```bash
# Grant EventBridge permission to invoke Lambda
aws lambda add-permission \
  --function-name auto-stop-rds-function \
  --statement-id eventbridge-invoke \
  --action lambda:InvokeFunction \
  --principal events.amazonaws.com \
  --source-arn arn:aws:events:us-east-1:ACCOUNT_ID:rule/rds-auto-stop-check

# Add Lambda as target
aws events put-targets \
  --rule rds-auto-stop-check \
  --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:ACCOUNT_ID:function:auto-stop-rds-function"
```

**Example 3: EventBridge Rule with Cron Expression**
```bash
# Run at 2 AM UTC every day (for daily maintenance)
aws events put-rule \
  --name rds-daily-maintenance \
  --schedule-expression "cron(0 2 * * ? *)" \
  --description "Daily RDS maintenance check"
```

**Example 4: Testing Rule Manually**
```python
import boto3
import json

events = boto3.client('events')

# Put test event to trigger rule manually
response = events.put_events(
    Entries=[
        {
            'Source': 'custom.test',
            'DetailType': 'Manual Test',
            'Detail': json.dumps({'test': True})
        }
    ]
)
print(response)
```

---

## Key Concepts

- **Event Bus:** The router that receives events and matches them to rules (default event bus or custom)
- **Rule:** Pattern matcher that filters events and routes to targets (e.g., "every 15 minutes")
- **Target:** AWS service that receives matched events (Lambda, SQS, SNS, etc.)
- **Schedule Expression:** Cron or rate-based triggers (`rate(15 minutes)`, `cron(0 12 * * ? *)`)
- **Event Pattern:** JSON filter for event-driven rules (not used for scheduled rules)

---

## Alternatives We Considered

- **CloudWatch Events:** Older service; EventBridge is the modern replacement with same functionality
- **Cron on EC2:** Requires managing a server; EventBridge is serverless
- **AWS Step Functions scheduled executions:** More complex and expensive for simple periodic tasks
- **Third-party schedulers (Airflow, Prefect):** Overkill for simple 15-minute interval checks

---

## Getting Started

1. **Create rule via AWS Console:**
   - Navigate to EventBridge → Rules → Create rule
   - Schedule: `rate(15 minutes)`
   - Target: Select Lambda function

2. **Or use AWS CLI:**
   ```bash
   aws events put-rule \
     --name my-scheduled-rule \
     --schedule-expression "rate(15 minutes)"

   aws events put-targets \
     --rule my-scheduled-rule \
     --targets "Id"="1","Arn"="arn:aws:lambda:REGION:ACCOUNT:function:my-function"
   ```

3. **Test the rule:**
   ```bash
   # List targets to verify
   aws events list-targets-by-rule --rule my-scheduled-rule

   # Check CloudWatch Logs for Lambda invocations
   ```

---

## Common Patterns & Best Practices

1. **Use rate() for simple intervals** - `rate(15 minutes)` easier than cron for regular intervals
2. **Use cron() for specific times** - `cron(0 2 * * ? *)` for 2 AM daily tasks
3. **Add rule description** - Document why rule exists for future maintenance
4. **Monitor CloudWatch Metrics** - Track invocation counts and failures
5. **Disable rules during debugging** - Prevent unwanted triggers while testing Lambda

---

## Troubleshooting

**Issue 1:** Lambda not being triggered by EventBridge
**Solution:** Verify Lambda has permission for EventBridge to invoke it (`aws lambda get-policy --function-name my-function`)

**Issue 2:** Rule shows as enabled but no invocations
**Solution:** Check CloudWatch Metrics for the rule; verify target ARN is correct

**Issue 3:** Cron expression not working as expected
**Solution:** EventBridge uses 6-field cron (minute, hour, day-of-month, month, day-of-week, year). Note the `?` wildcard requirement.

**Issue 4:** "No targets found" error
**Solution:** Use `put-targets` to add Lambda function to the rule

---

## Learning Resources

**Essential:**
- [EventBridge Documentation](https://docs.aws.amazon.com/eventbridge/)
- [Schedule Expressions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html)

**Recommended:**
- [Cron Expression Reference](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cron-expressions.html)
- [EventBridge Patterns](https://serverlessland.com/patterns?services=eventbridge)

**Community:**
- [AWS EventBridge Forum](https://forums.aws.amazon.com/)

---

**Related Technologies:**
- [AWS Lambda](aws-lambda.md) - Functions triggered by EventBridge schedules
- [AWS RDS](aws-rds.md) - Database instances managed by scheduled Lambda functions
- [AWS CloudWatch](aws-cloudwatch.md) - Logging and metrics for EventBridge rules
