# AWS IAM Roles

**Category:** Cloud Services / Security
**Official Docs:** https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

AWS IAM (Identity and Access Management) Roles define what AWS actions an entity (user, service, or application) can perform. A role is a set of permissions that can be assumed by AWS services like Lambda, EC2, or ECS. Unlike users with permanent credentials, roles provide temporary security credentials.

Think of IAM roles like job titles with access badges: a "Lambda RDS Controller" role gets permissions to start/stop RDS, and any Lambda function assigned that role can perform those actions without storing AWS credentials in code.

---

## Why We're Using It In This Project

- **Lambda RDS control** - Lambda functions assume role with permissions to start/stop RDS instances
- **Least privilege** - Lambda can only do what role permits (start/stop RDS, nothing else)
- **No credential management** - Temporary credentials automatically rotated by AWS
- **Audit trail** - CloudTrail logs all actions performed using the role
- **Secure by default** - No AWS keys stored in code or environment variables for Lambda

---

## How We'll Use It

**Example 1: Create IAM Role for Lambda (Trust Policy)**
```json
// lambda-rds-control-trust-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```bash
# Create role
aws iam create-role \
  --role-name lambda-rds-control-role \
  --assume-role-policy-document file://lambda-rds-control-trust-policy.json
```

**Example 2: Attach Permissions Policy (What Role Can Do)**
```json
// lambda-rds-control-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:StartDBInstance",
        "rds:StopDBInstance",
        "rds:DescribeDBInstances"
      ],
      "Resource": "arn:aws:rds:us-east-1:ACCOUNT_ID:db:ss-financial-prod"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

```bash
# Create policy
aws iam create-policy \
  --policy-name lambda-rds-control-policy \
  --policy-document file://lambda-rds-control-policy.json

# Attach policy to role
aws iam attach-role-policy \
  --role-name lambda-rds-control-role \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/lambda-rds-control-policy
```

**Example 3: Assign Role to Lambda Function**
```bash
# Create Lambda function with role
aws lambda create-function \
  --function-name start-rds-function \
  --runtime python3.11 \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-rds-control-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip
```

**Example 4: Lambda Uses Role Automatically (No Credentials Needed)**
```python
# Lambda function code - boto3 uses role credentials automatically
import boto3

# No need for AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY
# Lambda assumes role and boto3 uses temporary credentials
rds = boto3.client('rds')

def lambda_handler(event, context):
    # This works because role has rds:StartDBInstance permission
    response = rds.start_db_instance(
        DBInstanceIdentifier='ss-financial-prod'
    )
    return {'statusCode': 200, 'body': 'RDS starting'}
```

---

## Key Concepts

- **Role:** Set of permissions that can be assumed by AWS services
- **Trust Policy:** Defines who/what can assume the role (e.g., Lambda service)
- **Permissions Policy:** Defines what actions the role can perform (e.g., start/stop RDS)
- **Assume Role:** Temporary credentials granted when service uses the role
- **Principal:** Entity that assumes the role (Lambda function, EC2 instance, user)
- **Least Privilege:** Grant only minimum permissions needed (start/stop RDS, not delete)

---

## Alternatives We Considered

- **IAM Users with access keys:** Requires managing and rotating credentials; roles are more secure
- **Root account credentials:** Massive security risk; never use root credentials in code
- **Broad permissions (AdministratorAccess):** Violates least privilege; role should only control RDS
- **Hardcoded AWS keys:** Security nightmare; roles eliminate need for stored credentials

---

## Getting Started

1. **Create role via AWS Console:**
   - IAM → Roles → Create role
   - Trusted entity: AWS service → Lambda
   - Permissions: Attach policies (or create custom policy)
   - Role name: `lambda-rds-control-role`

2. **Create custom policy:**
   - IAM → Policies → Create policy
   - JSON editor: Paste permissions policy
   - Name: `lambda-rds-control-policy`

3. **Attach policy to role:**
   - IAM → Roles → `lambda-rds-control-role`
   - Permissions → Attach policies
   - Select `lambda-rds-control-policy`

4. **Assign role to Lambda:**
   - Lambda → Functions → Configuration → Permissions
   - Execution role: `lambda-rds-control-role`

5. **Test permissions:**
   ```python
   # In Lambda function
   import boto3
   rds = boto3.client('rds')
   response = rds.describe_db_instances()  # Should work if role has permission
   ```

---

## Common Patterns & Best Practices

1. **One role per function/purpose** - Separate role for RDS control vs. DynamoDB access
2. **Least privilege principle** - Only grant necessary permissions (start/stop, not delete)
3. **Resource-specific permissions** - Limit to specific RDS instance, not all instances
4. **Use managed policies when possible** - AWS maintains policies like `AWSLambdaBasicExecutionRole`
5. **Regularly audit roles** - Remove unused permissions and roles

---

## Troubleshooting

**Issue 1:** `AccessDenied` error when Lambda tries to start RDS
**Solution:** Verify role has `rds:StartDBInstance` permission for the specific RDS instance ARN

**Issue 2:** `User is not authorized to perform: sts:AssumeRole`
**Solution:** Trust policy must allow the service (Lambda) to assume the role

**Issue 3:** Lambda can access RDS but can't write logs to CloudWatch
**Solution:** Add `AWSLambdaBasicExecutionRole` managed policy or custom CloudWatch Logs permissions

**Issue 4:** Changes to role not taking effect
**Solution:** Role changes are immediate, but Lambda may cache credentials for a few minutes; wait or redeploy function

---

## Learning Resources

**Essential:**
- [IAM Roles Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

**Recommended:**
- [Least Privilege Principle](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege)
- [IAM Policy Simulator](https://policysim.aws.amazon.com/)

**Community:**
- [r/aws IAM Discussions](https://www.reddit.com/r/aws/)
- [AWS IAM Forum](https://forums.aws.amazon.com/)

---

**Related Technologies:**
- [AWS Lambda](aws-lambda.md) - Functions that assume IAM roles
- [AWS RDS](aws-rds.md) - Database instances controlled via IAM role permissions
- [boto3](boto3.md) - SDK that uses IAM role credentials automatically
- [AWS EventBridge](aws-eventbridge.md) - Triggers Lambda functions with role-based permissions
