# AWS API Gateway

**Category:** Cloud Services / API Management
**Official Docs:** https://docs.aws.amazon.com/apigateway/
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

AWS API Gateway is a managed service that creates, publishes, and manages RESTful HTTP APIs at any scale. It acts as a "front door" for your backend services, accepting HTTP requests and routing them to Lambda functions, EC2 instances, or other AWS services.

Think of API Gateway as a receptionist for your backend: clients (frontend, mobile apps) make requests to the Gateway's public URL, and Gateway authenticates requests, validates input, and forwards them to the appropriate backend service.

---

## Why We're Using It In This Project

- **Secure Lambda invocation** - Expose Lambda RDS control functions via HTTPS endpoints without managing infrastructure
- **JWT validation** - Can validate JWT tokens before invoking Lambda (optional; we may do this in Lambda itself)
- **CORS handling** - Automatically manage cross-origin requests from frontend
- **Throttling** - Protect backend from abuse with rate limiting
- **Cost optimization** - Pay only for API requests ($3.50 per million requests)

---

## How We'll Use It

**Example 1: Create HTTP API for Lambda**
```bash
# Create HTTP API (simpler than REST API)
aws apigatewayv2 create-api \
  --name rds-control-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:ACCOUNT_ID:function:start-rds-function
```

**Example 2: Create Route for RDS Start**
```bash
# Add route for POST /rds/start
aws apigatewayv2 create-route \
  --api-id <api-id> \
  --route-key "POST /rds/start" \
  --target integrations/<integration-id>

# Grant API Gateway permission to invoke Lambda
aws lambda add-permission \
  --function-name start-rds-function \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com
```

**Example 3: Frontend Calling API Gateway**
```typescript
// poc/frontend/src/api/rds.ts
import axios from 'axios';

const API_BASE_URL = 'https://abc123.execute-api.us-east-1.amazonaws.com';

export async function startRDS(jwt: string) {
  const response = await axios.post(
    `${API_BASE_URL}/rds/start`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

export async function getRDSStatus(jwt: string) {
  const response = await axios.get(
    `${API_BASE_URL}/rds/status`,
    {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    }
  );
  return response.data;
}
```

**Example 4: Lambda Function Receiving API Gateway Event**
```python
import json

def lambda_handler(event, context):
    # API Gateway passes request details in event
    print("Headers:", event.get('headers'))
    print("Body:", event.get('body'))
    print("Query params:", event.get('queryStringParameters'))

    # Extract JWT from Authorization header
    auth_header = event['headers'].get('authorization', '')
    token = auth_header.replace('Bearer ', '')

    # Validate token and execute RDS operation
    # (Token validation logic here)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  # CORS
        },
        'body': json.dumps({'message': 'RDS started'})
    }
```

---

## Key Concepts

- **API:** Collection of routes and integrations (our `rds-control-api`)
- **Route:** HTTP method + path combination (e.g., `POST /rds/start`)
- **Integration:** Backend service that handles requests (Lambda, HTTP endpoint, etc.)
- **Stage:** Deployment environment (dev, staging, prod) with its own URL
- **Authorizer:** Lambda function that validates authentication (JWT authorizer)

---

## Alternatives We Considered

- **Direct Lambda Function URLs:** Simpler but lacks API Gateway features (throttling, JWT validation)
- **ALB + Lambda:** More complex and expensive for simple API needs
- **Self-managed API server:** Requires maintaining servers; API Gateway is fully managed
- **Vercel API routes:** We're already using Vercel for main backend; Gateway for AWS-specific operations

---

## Getting Started

1. **Create HTTP API via AWS Console:**
   - Navigate to API Gateway → Create API → HTTP API
   - Add integration: Select Lambda function
   - Configure routes: `POST /rds/start`, `GET /rds/status`

2. **Or use AWS CLI:**
   ```bash
   aws apigatewayv2 create-api \
     --name my-api \
     --protocol-type HTTP
   ```

3. **Deploy API:**
   ```bash
   aws apigatewayv2 create-stage \
     --api-id <api-id> \
     --stage-name prod \
     --auto-deploy
   ```

4. **Test endpoint:**
   ```bash
   curl -X POST https://abc123.execute-api.us-east-1.amazonaws.com/rds/start \
     -H "Authorization: Bearer <jwt-token>"
   ```

---

## Common Patterns & Best Practices

1. **Use HTTP API over REST API** - HTTP APIs are simpler, faster, and cheaper for most use cases
2. **Enable CORS** - Configure `Access-Control-Allow-Origin` for frontend requests
3. **Add JWT authorizer** - Validate tokens at API Gateway level before invoking Lambda
4. **Use custom domain names** - Map `api.superscapes.com` to API Gateway URL
5. **Enable CloudWatch Logs** - Debug request/response flows and track errors

---

## Troubleshooting

**Issue 1:** CORS errors when calling from frontend
**Solution:** Add CORS configuration to API Gateway or return CORS headers from Lambda

**Issue 2:** `Missing Authentication Token` error
**Solution:** Route doesn't exist or method doesn't match (check route key: `POST /path` vs `GET /path`)

**Issue 3:** 502 Bad Gateway error
**Solution:** Lambda function crashed or returned invalid response format (check CloudWatch Logs)

**Issue 4:** Request times out after 30 seconds
**Solution:** API Gateway timeout is 30 seconds max; ensure Lambda completes faster or use asynchronous pattern

---

## Learning Resources

**Essential:**
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [HTTP API vs REST API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)

**Recommended:**
- [API Gateway CORS Configuration](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html)
- [JWT Authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)

**Community:**
- [AWS API Gateway Forum](https://forums.aws.amazon.com/)

---

**Related Technologies:**
- [AWS Lambda](aws-lambda.md) - Backend functions invoked by API Gateway
- [Custom JWT Implementation](custom-jwt-implementation.md) - Tokens validated by API Gateway or Lambda
- [Axios](axios.md) - Frontend HTTP client for calling API Gateway endpoints
- [AWS IAM Roles](aws-iam-roles.md) - Permissions for API Gateway to invoke Lambda
