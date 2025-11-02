# DynamoDB Global Secondary Index (GSI)

**Category:** Database / NoSQL
**Official Docs:** https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

A Global Secondary Index (GSI) is an alternate query path for DynamoDB tables. By default, you can only query DynamoDB by the partition key (primary key). A GSI lets you create additional "indexes" with different partition and sort keys, enabling lookups on other attributes.

Think of a GSI like an index in the back of a book. The main table is organized by chapter number (partition key), but the GSI creates a separate alphabetical index by topic, letting you find information without reading every chapter.

For our project, we need to look up users by email during login, but our partition key is `user_id`. The `email-index` GSI solves this by creating an email-based lookup path.

---

## Why We're Using It In This Project

- **Login by email** - Users log in with email addresses, not user IDs, so we need to query DynamoDB by email
- **Fast email lookups** - GSI provides single-digit millisecond query performance (vs. scanning entire table)
- **Unique email enforcement** - While DynamoDB doesn't enforce uniqueness on GSI, we validate in application code
- **No data duplication** - GSI is automatically maintained by DynamoDB when items are added/updated
- **Always available** - Like the main table, GSI is serverless and requires no management

---

## How We'll Use It

**Example 1: Creating email-index GSI (Table Setup)**
```python
import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')

dynamodb.create_table(
    TableName='auth-users',
    KeySchema=[
        {'AttributeName': 'user_id', 'KeyType': 'HASH'}  # Partition key
    ],
    AttributeDefinitions=[
        {'AttributeName': 'user_id', 'AttributeType': 'S'},
        {'AttributeName': 'email', 'AttributeType': 'S'}  # GSI partition key
    ],
    GlobalSecondaryIndexes=[
        {
            'IndexName': 'email-index',
            'KeySchema': [
                {'AttributeName': 'email', 'KeyType': 'HASH'}  # Query by email
            ],
            'Projection': {
                'ProjectionType': 'ALL'  # Include all attributes in GSI
            }
        }
    ],
    BillingMode='PAY_PER_REQUEST'
)
```

**Example 2: Querying User by Email (Login Flow)**
```python
def get_user_by_email(email: str):
    response = dynamodb.query(
        TableName='auth-users',
        IndexName='email-index',  # Use GSI instead of primary key
        KeyConditionExpression='email = :email',
        ExpressionAttributeValues={
            ':email': {'S': email}
        }
    )

    # Should return 0 or 1 item (emails should be unique)
    if response['Count'] > 0:
        return response['Items'][0]
    return None

# Usage in login endpoint
user = get_user_by_email('admin@superscapes.com')
if user and bcrypt.checkpw(password, user['password_hash']):
    # Generate JWT token
    token = create_jwt(user['user_id'], user['email'], user['role'])
    return {'token': token}
```

**Example 3: Checking for Duplicate Email Before Registration**
```python
def email_exists(email: str) -> bool:
    response = dynamodb.query(
        TableName='auth-users',
        IndexName='email-index',
        KeyConditionExpression='email = :email',
        ExpressionAttributeValues={':email': {'S': email}},
        Select='COUNT'  # Only return count, not full items (faster)
    )
    return response['Count'] > 0

# Usage in invite acceptance
if email_exists('newuser@example.com'):
    raise ValueError('Email already registered')
```

---

## Key Concepts

- **Projection:** Which attributes to copy into the GSI (`ALL` = all attributes, `KEYS_ONLY` = only keys, `INCLUDE` = specific attributes)
- **Eventually Consistent Reads:** GSI updates are asynchronous; there's a brief delay (~milliseconds) after writing to main table
- **Sparse Index:** If an item doesn't have the GSI partition key attribute, it won't appear in the GSI
- **GSI Partition Key:** The attribute you want to query by (our `email` field)
- **GSI Sort Key (Optional):** Secondary sorting within partition key groups (we don't use this)

---

## Alternatives We Considered

- **Scan with FilterExpression:** Query entire table and filter by email—slow and expensive
- **Store email as partition key:** Would prevent lookups by user_id (our primary access pattern)
- **Separate email → user_id mapping table:** Requires two queries instead of one
- **Local Secondary Index (LSI):** Only works if we use a composite primary key, doesn't fit our schema

---

## Getting Started

1. **Add GSI to existing table** (via AWS Console or boto3):
   ```python
   dynamodb.update_table(
       TableName='auth-users',
       GlobalSecondaryIndexUpdates=[{
           'Create': {
               'IndexName': 'email-index',
               'KeySchema': [{'AttributeName': 'email', 'KeyType': 'HASH'}],
               'Projection': {'ProjectionType': 'ALL'}
           }
       }]
   )
   ```

2. **Wait for GSI to become active** (5-10 minutes for initial creation):
   ```python
   waiter = dynamodb.get_waiter('table_exists')
   waiter.wait(TableName='auth-users')
   ```

3. **Query the GSI:**
   ```python
   response = dynamodb.query(
       TableName='auth-users',
       IndexName='email-index',
       KeyConditionExpression='email = :email',
       ExpressionAttributeValues={':email': {'S': 'test@example.com'}}
   )
   ```

---

## Common Patterns & Best Practices

1. **Use ALL projection for small tables** - With <1000 users, copying all attributes to GSI is fine and simplifies queries
2. **Query, don't scan** - Always use `query()` with GSI name; never `scan()` entire table
3. **Handle zero results** - GSI queries return empty results if email doesn't exist; check `response['Count']`
4. **Validate uniqueness in application** - DynamoDB doesn't enforce unique GSI keys; check for duplicates before creating users
5. **Monitor GSI capacity** - If using provisioned capacity, ensure GSI has enough read/write units

---

## Troubleshooting

**Issue 1:** Query returns `ValidationException: The provided key element does not match the schema`
**Solution:** You're querying with the wrong key. Ensure `KeyConditionExpression` uses `email`, not `user_id`.

**Issue 2:** GSI query returns empty results even though item exists in main table
**Solution:** GSI might still be building (check table status in AWS Console). Also verify the item actually has an `email` attribute.

**Issue 3:** Query returns multiple users with the same email
**Solution:** Application-level validation failed. Implement `email_exists()` check before allowing registration.

**Issue 4:** `ResourceNotFoundException: Requested resource not found`
**Solution:** Check that `IndexName='email-index'` matches exactly (case-sensitive). Verify GSI creation succeeded.

---

## Learning Resources

**Essential:**
- [Global Secondary Indexes Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)
- [Working with Queries](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html)

**Recommended:**
- [GSI Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes-general.html)
- [DynamoDB Query vs Scan](https://dynobase.dev/dynamodb-scan-vs-query/)

**Community:**
- [AWS DynamoDB Forums](https://forums.aws.amazon.com/forum.jspa?forumID=131)
- [DynamoDB Guide by Alex DeBrie](https://www.dynamodbguide.com/)

---

**Related Technologies:**
- [AWS DynamoDB](aws-dynamodb.md) - Main table storage for user authentication data
- [boto3](boto3.md) - Python SDK for querying GSI
- [Custom JWT Implementation](custom-jwt-implementation.md) - Authentication flow that queries by email
- [bcrypt](bcrypt.md) - Password verification after email lookup
