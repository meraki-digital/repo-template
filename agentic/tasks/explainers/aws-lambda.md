# AWS Lambda

**Category:** Cloud Services / Serverless
**Official Docs:** https://docs.aws.amazon.com/lambda/
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

AWS Lambda is a serverless compute service that runs your code in response to events without requiring you to manage servers. You upload your code (Python, Node.js, etc.), configure a trigger (HTTP request, scheduled event, file upload), and AWS handles everything else—scaling, patching, and infrastructure.

Think of Lambda like a vending machine: you put in a request (trigger), Lambda executes your function, returns a result, and you're only charged for the few milliseconds it ran. No servers to maintain, no paying for idle time.

---

## Why We're Using It In This Project

- **RDS lifecycle automation** - Lambda functions start/stop PostgreSQL RDS based on triggers (EventBridge schedules, API calls)
- **Cost optimization** - Only pay when Lambda runs; no 24/7 server costs for infrequent operations
- **Event-driven architecture** - Trigger RDS start when user hits "restart database" button via API Gateway
- **AWS-native integration** - Lambda has built-in permissions (IAM roles) to control RDS instances
- **Auto-scaling** - Handles concurrent requests (multiple users restarting database) automatically

---

## How We'll Use It

**Example 1: Lambda Function to Start RDS**
```python
# lambda_start_rds.py
import boto3
import json

rds = boto3.client('rds')

def lambda_handler(event, context):
    """
    Triggered by API Gateway or EventBridge.
    Starts the RDS instance if it's stopped.
    """
    db_instance_id = 'ss-financial-prod'

    try:
        # Check current status
        response = rds.describe_db_instances(DBInstanceIdentifier=db_instance_id)
        current_status = response['DBInstances'][0]['DBInstanceStatus']

        if current_status == 'stopped':
            # Start the database
            rds.start_db_instance(DBInstanceIdentifier=db_instance_id)
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'RDS instance starting',
                    'instance_id': db_instance_id
                })
            }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': f'RDS already {current_status}',
                    'instance_id': db_instance_id
                })
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

**Example 2: Lambda Function to Auto-Stop RDS After Inactivity**
```python
# lambda_auto_stop_rds.py
import boto3
import json
from datetime import datetime, timedelta

rds = boto3.client('rds')
dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    """
    Triggered by EventBridge (every 15 minutes).
    Stops RDS if no activity for 60 minutes.
    """
    db_instance_id = 'ss-financial-prod'

    # Check last query time from system_variables (stored in DynamoDB or RDS metadata)
    # For simplicity, assuming we store this in DynamoDB
    response = dynamodb.get_item(
        TableName='system-metadata',
        Key={'key': {'S': 'last_rds_query_time'}}
    )

    if 'Item' not in response:
        return {'statusCode': 200, 'body': 'No activity data found'}

    last_query_str = response['Item']['value']['S']
    last_query_time = datetime.fromisoformat(last_query_str)

    # Check if inactive for 60 minutes
    if datetime.utcnow() - last_query_time > timedelta(minutes=60):
        # Stop the database
        try:
            rds.stop_db_instance(DBInstanceIdentifier=db_instance_id)
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'RDS stopped due to inactivity',
                    'last_activity': last_query_str
                })
            }
        except Exception as e:
            return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'RDS still active', 'last_activity': last_query_str})
    }
```

**Example 3: Deploying Lambda Function (AWS CLI)**
```bash
# Package function with dependencies
zip lambda_start_rds.zip lambda_start_rds.py

# Create Lambda function
aws lambda create-function \
  --function-name start-rds-function \
  --runtime python3.11 \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-rds-control-role \
  --handler lambda_start_rds.lambda_handler \
  --zip-file fileb://lambda_start_rds.zip \
  --timeout 60

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission \
  --function-name start-rds-function \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com
```

**Example 4: Invoke Lambda from FastAPI Backend**
```python
import boto3
import json

lambda_client = boto3.client('lambda', region_name='us-east-1')

def trigger_rds_start():
    response = lambda_client.invoke(
        FunctionName='start-rds-function',
        InvocationType='RequestResponse',  # Synchronous
        Payload=json.dumps({})
    )

    result = json.loads(response['Payload'].read())
    return result
```

---

## Key Concepts

- **Function:** Your code (Python script) that runs in response to events
- **Handler:** Entry point function (e.g., `lambda_handler(event, context)`)
- **Event:** Input data passed to function (HTTP request, scheduled trigger, etc.)
- **Context:** Runtime information (request ID, memory limit, remaining time)
- **Execution Role (IAM):** Permissions Lambda has to access other AWS services (RDS, DynamoDB)
- **Cold Start:** Initial invocation delay (~1-3 seconds) when function hasn't run recently

---

## Alternatives We Considered

- **Cron job on EC2:** Requires managing a server; Lambda is serverless and cheaper for infrequent tasks
- **ECS Fargate tasks:** Overkill for simple RDS control; Lambda is simpler
- **Direct RDS API from frontend:** Security risk exposing AWS credentials; Lambda acts as secure intermediary
- **EventBridge + Step Functions:** More complex; Lambda alone is sufficient for our use case

---

## Getting Started

1. **Create IAM role for Lambda:**
   ```bash
   # Create role with trust policy allowing Lambda service
   aws iam create-role --role-name lambda-rds-control-role \
     --assume-role-policy-document file://trust-policy.json

   # Attach RDS permissions
   aws iam attach-role-policy --role-name lambda-rds-control-role \
     --policy-arn arn:aws:iam::aws:policy/AmazonRDSFullAccess
   ```

2. **Write Lambda function:**
   ```python
   def lambda_handler(event, context):
       print("Event:", event)
       return {'statusCode': 200, 'body': 'Success'}
   ```

3. **Deploy function:**
   ```bash
   zip function.zip lambda_function.py
   aws lambda create-function --function-name test-function \
     --runtime python3.11 --handler lambda_function.lambda_handler \
     --role arn:aws:iam::ACCOUNT_ID:role/lambda-rds-control-role \
     --zip-file fileb://function.zip
   ```

4. **Test invocation:**
   ```bash
   aws lambda invoke --function-name test-function output.json
   cat output.json
   ```

---

## Common Patterns & Best Practices

1. **Keep functions small** - Single responsibility (one function to start RDS, another to stop)
2. **Set appropriate timeout** - RDS operations can take 60+ seconds; set timeout to 90 seconds
3. **Use environment variables** - Store DB instance ID as env var, not hardcoded
4. **Handle errors gracefully** - Return proper HTTP status codes and error messages
5. **Enable CloudWatch Logs** - Automatically logs function output for debugging

---

## Troubleshooting

**Issue 1:** `AccessDenied` error when Lambda tries to start RDS
**Solution:** Verify Lambda execution role has `rds:StartDBInstance` permission

**Issue 2:** Function timeout after 3 seconds
**Solution:** Increase timeout in Lambda configuration (default is 3 seconds, increase to 60-90 seconds for RDS operations)

**Issue 3:** Cold start causes slow first invocation
**Solution:** Accept cold starts (~1-3 seconds) or use provisioned concurrency (costs more)

**Issue 4:** Can't find function logs
**Solution:** Check CloudWatch Logs under `/aws/lambda/<function-name>` log group

---

## Learning Resources

**Essential:**
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Lambda Python Programming Model](https://docs.aws.amazon.com/lambda/latest/dg/python-programming-model.html)

**Recommended:**
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Serverless Patterns Collection](https://serverlessland.com/patterns)

**Community:**
- [r/aws Lambda Discussions](https://www.reddit.com/r/aws/)
- [AWS Lambda Forum](https://forums.aws.amazon.com/forum.jspa?forumID=186)

---

**Related Technologies:**
- [AWS EventBridge](aws-eventbridge.md) - Scheduled triggers for auto-stop Lambda
- [AWS API Gateway](aws-api-gateway.md) - HTTP endpoints that invoke Lambda
- [AWS IAM Roles](aws-iam-roles.md) - Permissions for Lambda to control RDS
- [boto3](boto3.md) - AWS SDK used within Lambda functions
- [AWS RDS](aws-rds.md) - Database instances controlled by Lambda
