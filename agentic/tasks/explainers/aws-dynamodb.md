# AWS DynamoDB

**Category:** Database / NoSQL
**Official Docs:** https://docs.aws.amazon.com/dynamodb/
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

AWS DynamoDB is a fully managed NoSQL database service that provides fast, predictable performance at any scale. Unlike relational databases (PostgreSQL, MySQL), DynamoDB stores data as key-value pairs or documents, similar to a giant distributed hash map.

Think of DynamoDB as a massive spreadsheet where each row must have a unique identifier (partition key), and you can add any columns you want to each row without a fixed schema. It's "serverless"—you don't manage servers, and it scales automatically. For our project, the critical feature is **always-on availability** with single-digit millisecond response times, even when our PostgreSQL RDS is stopped.

---

## Why We're Using It In This Project

- **Always-available authentication** - User login works even when PostgreSQL RDS is stopped
- **No cold starts** - Instant response for JWT validation and user lookups
- **Pay-per-request pricing** - With ~100 users, costs <$1/month
- **Serverless architecture** - No database management overhead, auto-scaling
- **Low latency** - <10ms reads for authentication checks critical to user experience

---

## How We'll Use It

**Example 1: Creating auth-users Table (via boto3)**
```python
import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')

# Create table (one-time setup)
dynamodb.create_table(
    TableName='auth-users',
    KeySchema=[
        {'AttributeName': 'user_id', 'KeyType': 'HASH'}  # Partition key
    ],
    AttributeDefinitions=[
        {'AttributeName': 'user_id', 'AttributeType': 'S'},  # String
        {'AttributeName': 'email', 'AttributeType': 'S'}
    ],
    GlobalSecondaryIndexes=[
        {
            'IndexName': 'email-index',
            'KeySchema': [{'AttributeName': 'email', 'KeyType': 'HASH'}],
            'Projection': {'ProjectionType': 'ALL'}
        }
    ],
    BillingMode='PAY_PER_REQUEST'  # No capacity planning needed
)
```

**Example 2: Inserting User (PutItem)**
```python
def create_user(user_id: str, email: str, password_hash: str, role: str):
    dynamodb.put_item(
        TableName='auth-users',
        Item={
            'user_id': {'S': user_id},
            'email': {'S': email},
            'password_hash': {'S': password_hash},
            'role': {'S': role},
            'is_active': {'BOOL': True},
            'created_at': {'S': '2025-11-02T12:00:00Z'}
        }
    )
```

**Example 3: Querying User by Email (using GSI)**
```python
def get_user_by_email(email: str):
    response = dynamodb.query(
        TableName='auth-users',
        IndexName='email-index',  # Use Global Secondary Index
        KeyConditionExpression='email = :email',
        ExpressionAttributeValues={':email': {'S': email}}
    )

    if response['Count'] > 0:
        return response['Items'][0]
    return None
```

**Example 4: Getting User by ID (GetItem)**
```python
def get_user_by_id(user_id: str):
    response = dynamodb.get_item(
        TableName='auth-users',
        Key={'user_id': {'S': user_id}}
    )
    return response.get('Item')
```

---

## Key Concepts

- **Partition Key (Primary Key):** Unique identifier for each item (our `user_id`). Required for every item.
- **Global Secondary Index (GSI):** Alternate key for querying (our `email-index` allows lookups by email)
- **Item:** A single record in DynamoDB (equivalent to a row in SQL)
- **Attribute:** A field within an item (equivalent to a column in SQL)
- **Pay-per-request billing:** Charged per read/write operation instead of provisioned capacity

---

## Alternatives We Considered

- **PostgreSQL RDS for auth data:** Would be unavailable when database is stopped for cost savings
- **Redis/ElastiCache:** In-memory cache, but requires persistent storage backend
- **MongoDB Atlas:** NoSQL alternative but adds another vendor dependency
- **Firebase/Firestore:** Simpler but locks us into Google Cloud Platform

---

## Getting Started

1. **Create table via AWS Console or boto3** (see Example 1 above)

2. **Configure boto3 credentials:**
   ```bash
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   export AWS_DEFAULT_REGION=us-east-1
   ```

3. **Insert first user:**
   ```python
   import boto3
   dynamodb = boto3.client('dynamodb')

   dynamodb.put_item(
       TableName='auth-users',
       Item={
           'user_id': {'S': '12345'},
           'email': {'S': 'admin@example.com'},
           'role': {'S': 'admin'}
       }
   )
   ```

4. **Query by primary key:**
   ```python
   response = dynamodb.get_item(
       TableName='auth-users',
       Key={'user_id': {'S': '12345'}}
   )
   print(response['Item'])
   ```

---

## Common Patterns & Best Practices

1. **Use Global Secondary Indexes for alternate lookups** - We need to query by email (for login) so we create an email GSI
2. **Avoid scans, use queries** - Scanning entire table is slow and expensive; always query by partition key or GSI
3. **Use pay-per-request billing** - For low-volume auth data, pay-per-request is cheaper than provisioned capacity
4. **Store data as simple types** - DynamoDB types: `S` (string), `N` (number), `BOOL` (boolean), `L` (list), `M` (map)
5. **Enable point-in-time recovery** - Protects against accidental deletions (adds ~$0.20/month cost)

---

## Troubleshooting

**Issue 1:** `ValidationException: One or more parameter values were invalid`
**Solution:** Ensure all attributes are wrapped in type descriptors: `{'S': 'value'}` for strings, `{'N': '123'}` for numbers

**Issue 2:** Query by email returns empty results even though user exists
**Solution:** Verify you're using the correct GSI name (`email-index`) and that the GSI has finished creating (can take 5-10 minutes)

**Issue 3:** `ProvisionedThroughputExceededException`
**Solution:** Switch from provisioned capacity to pay-per-request billing mode in table settings

**Issue 4:** Can't query by `created_at` timestamp
**Solution:** You can only query by partition key and sort key (if defined). For other attributes, use scan with filter (expensive) or create another GSI.

---

## Learning Resources

**Essential:**
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [DynamoDB Core Components](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html)
- [Global Secondary Indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)

**Recommended:**
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [DynamoDB vs SQL Databases](https://www.alexdebrie.com/posts/dynamodb-vs-sql/)

**Community:**
- [AWS DynamoDB Forums](https://forums.aws.amazon.com/forum.jspa?forumID=131)
- [Alex DeBrie's DynamoDB Guide](https://www.dynamodbguide.com/)

---

**Related Technologies:**
- [boto3](boto3.md) - Python SDK for DynamoDB operations
- [DynamoDB Global Secondary Index](dynamodb-gsi.md) - Querying by email for login
- [Custom JWT Implementation](custom-jwt-implementation.md) - Authentication system using DynamoDB
- [bcrypt](bcrypt.md) - Password hashing stored in DynamoDB
