# boto3

**Category:** Backend / Cloud Services
**Official Docs:** https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

boto3 is the official Amazon Web Services (AWS) SDK for Python. It provides a Python interface to interact with AWS services like DynamoDB, RDS, Lambda, S3, and hundreds of others. Think of boto3 as a remote control for your AWS infrastructure—instead of clicking through the AWS console, you write Python code to create, read, update, and delete cloud resources.

boto3 has two levels of abstraction: low-level "client" API (mirrors AWS API exactly) and high-level "resource" API (more Pythonic, object-oriented). For most tasks, you'll use the client API for precise control.

---

## Why We're Using It In This Project

- **DynamoDB access** - Store and retrieve user authentication data from DynamoDB tables
- **RDS lifecycle management** - Start and stop PostgreSQL RDS instances programmatically
- **Lambda integration** - Invoke serverless functions for RDS automation from our FastAPI backend
- **IAM role management** - Query and verify permissions for admin operations
- **AWS-native solution** - First-party SDK ensures compatibility and long-term support

---

## How We'll Use It

**Example 1: DynamoDB - Create User in auth-users Table**
```python
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.client('dynamodb', region_name='us-east-1')

def create_user(email: str, password_hash: str, role: str):
    user_id = str(uuid.uuid4())

    response = dynamodb.put_item(
        TableName='auth-users',
        Item={
            'user_id': {'S': user_id},
            'email': {'S': email},
            'password_hash': {'S': password_hash},
            'role': {'S': role},
            'is_active': {'BOOL': True},
            'created_at': {'S': datetime.utcnow().isoformat()}
        }
    )
    return user_id
```

**Example 2: DynamoDB - Query User by Email (using GSI)**
```python
def get_user_by_email(email: str):
    response = dynamodb.query(
        TableName='auth-users',
        IndexName='email-index',  # Global Secondary Index
        KeyConditionExpression='email = :email',
        ExpressionAttributeValues={
            ':email': {'S': email}
        }
    )

    if response['Count'] > 0:
        return response['Items'][0]
    return None
```

**Example 3: RDS - Start Stopped Database**
```python
rds = boto3.client('rds', region_name='us-east-1')

def start_rds_instance(db_instance_identifier: str):
    response = rds.start_db_instance(
        DBInstanceIdentifier=db_instance_identifier
    )
    return response['DBInstance']['DBInstanceStatus']  # 'starting'
```

**Example 4: RDS - Check Database Status**
```python
def get_rds_status(db_instance_identifier: str):
    response = rds.describe_db_instances(
        DBInstanceIdentifier=db_instance_identifier
    )
    return response['DBInstances'][0]['DBInstanceStatus']  # 'available', 'stopped', etc.
```

---

## Key Concepts

- **Client:** Low-level service access (e.g., `boto3.client('dynamodb')`) - maps 1:1 with AWS API
- **Resource:** High-level, object-oriented interface (e.g., `boto3.resource('s3')`) - more Pythonic
- **Session:** Container for AWS configuration (credentials, region); default session used implicitly
- **Credentials Chain:** boto3 looks for credentials in this order: environment variables → AWS config files → IAM instance roles
- **Pagination:** Automatic handling of large result sets with built-in paginators

---

## Alternatives We Considered

- **AWS CLI:** Command-line tool, not suitable for programmatic backend integration
- **Direct HTTP requests to AWS API:** Possible but requires manual request signing and error handling
- **Pulumi/Terraform:** Infrastructure-as-code tools, not designed for runtime operations like our RDS start/stop
- **aioboto3:** Async version of boto3; considered but synchronous boto3 is simpler for our use case

---

## Getting Started

1. **Install boto3:**
   ```bash
   pip install boto3
   ```

2. **Configure AWS credentials** (choose one):
   - Environment variables:
     ```bash
     export AWS_ACCESS_KEY_ID=your_key
     export AWS_SECRET_ACCESS_KEY=your_secret
     export AWS_DEFAULT_REGION=us-east-1
     ```
   - Or use IAM roles (recommended for Lambda/ECS)

3. **Create a client:**
   ```python
   import boto3
   dynamodb = boto3.client('dynamodb', region_name='us-east-1')
   ```

4. **Make your first call:**
   ```python
   response = dynamodb.list_tables()
   print(response['TableNames'])
   ```

---

## Common Patterns & Best Practices

1. **Use clients for most operations** - Client API gives you precise control over DynamoDB and RDS operations
2. **Specify region explicitly** - Always set `region_name='us-east-1'` to avoid configuration issues
3. **Handle pagination** - Use `get_paginator()` for operations that return large result sets
4. **Catch service exceptions** - Wrap calls in try/except for `botocore.exceptions.ClientError`
5. **Use resource API sparingly** - Stick with client API for consistency in this project

---

## Troubleshooting

**Issue 1:** `NoCredentialsError: Unable to locate credentials`
**Solution:** Set AWS credentials via environment variables or configure AWS CLI with `aws configure`

**Issue 2:** `ClientError: An error occurred (AccessDenied)` when accessing DynamoDB
**Solution:** Verify IAM user/role has `dynamodb:PutItem`, `dynamodb:Query` permissions on `auth-users` table

**Issue 3:** DynamoDB put_item succeeds but data not visible in AWS Console
**Solution:** Check you're writing to the correct region. DynamoDB tables are region-specific.

**Issue 4:** RDS start_db_instance fails with "InvalidDBInstanceState"
**Solution:** Instance may already be starting or running. Check status with `describe_db_instances()` first.

---

## Learning Resources

**Essential:**
- [boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
- [DynamoDB Client API Reference](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html)
- [RDS Client API Reference](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/rds.html)

**Recommended:**
- [boto3 DynamoDB Examples](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html)
- [AWS SDK Code Examples](https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/python/example_code)

**Community:**
- [boto3 GitHub Repository](https://github.com/boto/boto3)
- [AWS Developer Forums](https://forums.aws.amazon.com/)

---

**Related Technologies:**
- [AWS DynamoDB](aws-dynamodb.md) - NoSQL database accessed via boto3
- [AWS RDS](aws-rds.md) - PostgreSQL database controlled via boto3
- [AWS Lambda](aws-lambda.md) - Serverless functions that use boto3
- [FastAPI](fastapi.md) - Backend framework that integrates boto3 for AWS operations
