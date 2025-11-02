# Postman

**Category:** Testing / API Development
**Official Docs:** https://learning.postman.com/docs/
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

Postman is a collaboration platform for testing, documenting, and sharing APIs. It provides a GUI for making HTTP requests (GET, POST, PUT, DELETE), organizing endpoints into collections, and automating API testing. Think of it as a souped-up version of `curl` with a user-friendly interface.

For developers, Postman is like a Swiss Army knife for APIs: you can test authentication flows, save JWT tokens between requests, generate code snippets, and share entire API documentation with your team.

---

## Why We're Using It In This Project

- **Test authentication endpoints** - Manually test login, invite acceptance, JWT validation without writing frontend code
- **Save JWT tokens** - Automatically inject auth tokens into subsequent requests
- **API documentation** - Generate shareable docs for `/api/auth/*` and `/api/rds/*` endpoints
- **Team collaboration** - Share collections with teammates for consistent testing
- **Debug backend** - Isolate backend issues from frontend by testing API directly

---

## How We'll Use It

**Example 1: Login Request with Token Capture**
```
Method: POST
URL: https://api.superscapes.com/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "email": "admin@superscapes.com",
  "password": "SecurePassword123"
}

Tests (JavaScript):
// Save JWT token for future requests
const response = pm.response.json();
pm.environment.set("jwt_token", response.token);
pm.test("Login successful", function() {
    pm.expect(pm.response.code).to.equal(200);
    pm.expect(response.token).to.be.a('string');
});
```

**Example 2: Authenticated Request Using Saved Token**
```
Method: GET
URL: https://api.superscapes.com/api/auth/me
Headers:
  Authorization: Bearer {{jwt_token}}

Tests:
pm.test("User info retrieved", function() {
    pm.expect(pm.response.code).to.equal(200);
    const user = pm.response.json();
    pm.expect(user.email).to.equal("admin@superscapes.com");
    pm.expect(user.role).to.equal("admin");
});
```

**Example 3: Create User Invitation (Admin Only)**
```
Method: POST
URL: https://api.superscapes.com/api/auth/invite
Headers:
  Authorization: Bearer {{jwt_token}}
  Content-Type: application/json
Body:
{
  "email": "newuser@example.com",
  "role": "user"
}

Tests:
pm.test("Invitation created", function() {
    pm.expect(pm.response.code).to.equal(200);
    const result = pm.response.json();
    pm.expect(result.invite_url).to.include("auth/invite/");
});
```

**Example 4: RDS Start Request**
```
Method: POST
URL: https://api.superscapes.com/api/rds/start
Headers:
  Authorization: Bearer {{jwt_token}}

Tests:
pm.test("RDS starting", function() {
    pm.expect(pm.response.code).to.equal(200);
    const result = pm.response.json();
    pm.expect(result.status).to.be.oneOf(['starting', 'available']);
});
```

---

## Key Concepts

- **Collection:** Group of related API requests (e.g., "SS Financial Auth API")
- **Environment:** Set of variables (dev, staging, prod) with different base URLs
- **Variable:** Reusable value like `{{jwt_token}}` or `{{base_url}}`
- **Pre-request Script:** JavaScript that runs before request (e.g., generate timestamp)
- **Tests:** JavaScript assertions that validate response (status code, body structure)

---

## Alternatives We Considered

- **curl:** Command-line tool, powerful but harder to save/share workflows
- **Insomnia:** Similar to Postman but smaller ecosystem
- **HTTPie:** Beautiful CLI tool but lacks GUI and collaboration features
- **Writing test scripts:** More work than using Postman's built-in testing

---

## Getting Started

1. **Install Postman:**
   - Download from https://www.postman.com/downloads/
   - Or use web version at https://web.postman.com

2. **Create collection:**
   - New → Collection
   - Name: "SS Financial Auth API"
   - Description: "Authentication and RDS management endpoints"

3. **Create environment:**
   - Environments → Create new
   - Name: "Development"
   - Variables:
     - `base_url` = `http://localhost:8000`
     - `jwt_token` = (leave empty, will be set by login)

4. **Add login request:**
   - New Request → POST `{{base_url}}/api/auth/login`
   - Body: `{"email":"admin@test.com","password":"test123"}`
   - Tests: `pm.environment.set("jwt_token", pm.response.json().token);`

5. **Add authenticated request:**
   - New Request → GET `{{base_url}}/api/auth/me`
   - Headers: `Authorization: Bearer {{jwt_token}}`

---

## Common Patterns & Best Practices

1. **Use environment variables** - `{{base_url}}` instead of hardcoding URLs
2. **Save tokens in tests** - Automatically set `jwt_token` from login response
3. **Organize with folders** - Group auth endpoints, RDS endpoints, admin endpoints
4. **Add test assertions** - Validate status codes and response structure
5. **Share collections** - Export and commit to `/poc/docs/postman/` folder

---

## Troubleshooting

**Issue 1:** `401 Unauthorized` on authenticated endpoint
**Solution:** Check `jwt_token` variable is set. Run login request first to capture token.

**Issue 2:** Variables not substituting (shows `{{base_url}}` literally)
**Solution:** Select correct environment in top-right dropdown (Dev, Staging, Prod)

**Issue 3:** CORS error when calling localhost backend from Postman
**Solution:** Postman runs outside browser; CORS doesn't apply. Check backend is actually running.

**Issue 4:** Token expired between tests
**Solution:** Increase JWT expiration time for testing, or re-run login request to get fresh token

---

## Learning Resources

**Essential:**
- [Postman Learning Center](https://learning.postman.com/)
- [Postman Variables](https://learning.postman.com/docs/sending-requests/variables/)

**Recommended:**
- [Writing Tests](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [API Documentation](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/)

**Community:**
- [Postman Community Forum](https://community.postman.com/)
- [Postman YouTube Channel](https://www.youtube.com/postmanchannel)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Backend API tested with Postman
- [Custom JWT Implementation](custom-jwt-implementation.md) - Authentication flow tested via Postman
- [Axios](axios.md) - Frontend HTTP client that mirrors Postman requests
- [AWS API Gateway](aws-api-gateway.md) - Additional API endpoints testable via Postman
