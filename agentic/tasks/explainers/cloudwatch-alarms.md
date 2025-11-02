# CloudWatch Alarms

**Category:** Cloud Services / Monitoring & Alerting
**Official Docs:** https://docs.aws.amazon.com/cloudwatch/latest/monitoring/AlarmThatSendsEmail.html
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

CloudWatch Alarms automatically monitor metrics and trigger actions when thresholds are breached. An alarm watches a specific metric (like Lambda errors or RDS CPU usage), and when the value crosses a threshold, it changes state (OK → ALARM) and can send notifications or trigger automated responses.

Think of CloudWatch Alarms like smoke detectors: they watch for dangerous conditions (Lambda auto-stop function failing, RDS CPU at 100%) and alert you when something needs attention.

---

## Why We're Using It In This Project

- **RDS auto-stop failure alerts** - Notify team if EventBridge-triggered Lambda fails to stop RDS
- **Lambda error monitoring** - Alert when authentication endpoints return errors
- **Cost overrun protection** - Trigger alarm if RDS runs 24/7 (forgot to stop)
- **Automated remediation** - Alarm can invoke another Lambda to fix issues (future enhancement)
- **Proactive monitoring** - Catch problems before users report them

---

## How We'll Use It

**Example 1: Alarm for Lambda Function Errors**
```bash
# Create alarm for Lambda errors (via AWS CLI)
aws cloudwatch put-metric-alarm \
  --alarm-name rds-auto-stop-function-errors \
  --alarm-description "Alert when RDS auto-stop Lambda fails" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --dimensions Name=FunctionName,Value=auto-stop-rds-function \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:admin-alerts
```

**Example 2: Alarm for RDS Running Too Long (Cost Control)**
```bash
# Create alarm if RDS uptime > 12 hours (should auto-stop after 1 hour inactivity)
aws cloudwatch put-metric-alarm \
  --alarm-name rds-uptime-too-long \
  --alarm-description "RDS has been running for 12+ hours" \
  --metric-name DatabaseConnections \
  --namespace AWS/RDS \
  --statistic Average \
  --period 3600 \
  --evaluation-periods 12 \
  --threshold 0 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DBInstanceIdentifier,Value=ss-financial-prod \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:admin-alerts
```

**Example 3: SNS Topic for Email Notifications**
```bash
# Create SNS topic for alarm notifications
aws sns create-topic --name admin-alerts

# Subscribe email to topic
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT_ID:admin-alerts \
  --protocol email \
  --notification-endpoint admin@superscapes.com

# Confirm subscription via email link
```

**Example 4: Alarm for RDS High CPU (Performance Issue)**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name rds-high-cpu \
  --alarm-description "RDS CPU > 80% for 10 minutes" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DBInstanceIdentifier,Value=ss-financial-prod \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:admin-alerts
```

**Example 5: Alarm That Invokes Lambda (Auto-Remediation)**
```python
# Lambda function triggered by alarm to auto-stop RDS
def lambda_handler(event, context):
    # Parse SNS message from CloudWatch Alarm
    message = json.loads(event['Records'][0]['Sns']['Message'])

    if message['AlarmName'] == 'rds-uptime-too-long':
        # Stop RDS instance
        rds.stop_db_instance(DBInstanceIdentifier='ss-financial-prod')
        print("Auto-stopped RDS due to alarm")

    return {'statusCode': 200}
```

---

## Key Concepts

- **Alarm:** Watches a single metric and triggers action when threshold breached
- **Metric:** Data point being monitored (Lambda errors, RDS CPU, custom metric)
- **Threshold:** Value that triggers alarm (e.g., Errors >= 1, CPU > 80%)
- **Evaluation Period:** How long metric must exceed threshold before alarm triggers
- **Alarm State:** OK (normal), ALARM (threshold breached), INSUFFICIENT_DATA (not enough data)
- **Action:** What happens when alarm triggers (SNS notification, Lambda invocation, Auto Scaling)

---

## Alternatives We Considered

- **Manual monitoring:** Check logs daily; alarms provide 24/7 automated monitoring
- **Third-party alerting (PagerDuty):** More features but costs $19+/month per user
- **Email alerts from Lambda:** Manual implementation; CloudWatch Alarms are standardized
- **CloudWatch Insights scheduled queries:** Can't trigger actions like SNS/Lambda

---

## Getting Started

1. **Create SNS topic for notifications:**
   ```bash
   aws sns create-topic --name rds-alerts
   aws sns subscribe --topic-arn arn:aws:sns:REGION:ACCOUNT:rds-alerts \
     --protocol email --notification-endpoint your@email.com
   ```

2. **Create alarm via AWS Console:**
   - CloudWatch → Alarms → Create alarm
   - Select metric: AWS/Lambda → Errors → FunctionName=auto-stop-rds-function
   - Conditions: Threshold type=Static, Greater/Equal, than=1
   - Actions: Send notification to SNS topic `rds-alerts`
   - Name: `rds-auto-stop-errors`

3. **Test alarm:**
   ```bash
   # Trigger test notification
   aws cloudwatch set-alarm-state \
     --alarm-name rds-auto-stop-errors \
     --state-value ALARM \
     --state-reason "Testing alarm"
   ```

4. **Check email for notification**

---

## Common Patterns & Best Practices

1. **Use meaningful alarm names** - `rds-auto-stop-errors` not `alarm-1`
2. **Set appropriate thresholds** - 1 error is significant; 100 errors might trigger false positives
3. **Configure evaluation periods** - 2 consecutive periods reduces noise from transient spikes
4. **Use SNS for notifications** - Email, SMS, or Lambda invocation for automated response
5. **Test alarms regularly** - Use `set-alarm-state` to verify notifications work

---

## Troubleshooting

**Issue 1:** Alarm stays in INSUFFICIENT_DATA state
**Solution:** Metric has no data points. Verify resource exists and is generating metrics (Lambda invoked at least once, RDS running).

**Issue 2:** Alarm triggers but no email received
**Solution:** Check SNS subscription is confirmed (click link in confirmation email). Verify email not in spam.

**Issue 3:** Alarm triggers too frequently (false positives)
**Solution:** Increase evaluation periods (2 instead of 1) or adjust threshold

**Issue 4:** Alarm never triggers even when metric exceeds threshold
**Solution:** Check comparison operator is correct (GreaterThan vs LessThan), verify metric namespace and dimensions match

---

## Learning Resources

**Essential:**
- [CloudWatch Alarms Documentation](https://docs.aws.amazon.com/cloudwatch/latest/monitoring/AlarmThatSendsEmail.html)
- [Using Amazon SNS for Notifications](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)

**Recommended:**
- [CloudWatch Alarm Actions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-action-types)
- [Alarm Evaluation and State Changes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation)

**Community:**
- [AWS CloudWatch Forum](https://forums.aws.amazon.com/)

---

**Related Technologies:**
- [AWS CloudWatch](aws-cloudwatch.md) - Metrics and logs that alarms monitor
- [AWS Lambda](aws-lambda.md) - Functions monitored by alarms or invoked by alarms
- [AWS RDS](aws-rds.md) - Database metrics (CPU, connections) monitored by alarms
- [AWS EventBridge](aws-eventbridge.md) - Can trigger based on alarm state changes
