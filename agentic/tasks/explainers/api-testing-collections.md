# API Testing Collections

**Category:** Development Tools  
**Official Docs:** [Postman](https://learning.postman.com/), [Bruno](https://docs.usebruno.com/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

API testing collections refer to organized sets of HTTP requests used to test and interact with REST APIs. Tools like Postman and Bruno allow developers to create, save, and share collections of API calls, making it easy to test endpoints, debug issues, and document API behavior. These collections can include authentication, environment variables, and automated test scripts.

Think of API testing collections as a well-organized toolbox for API development. Instead of manually typing curl commands or writing custom scripts for each API call, you have a structured collection that you can reuse, share with teammates, and even automate.

---

## Why We're Using It In This Project

API testing collections ensure our FastAPI endpoints work correctly and provide documentation:

- **API testing**: Verify all endpoints return expected responses
- **Documentation**: Collections serve as living API documentation
- **Debugging**: Quickly test and troubleshoot API issues
- **Team collaboration**: Share API examples with frontend developers
- **Regression testing**: Ensure changes don't break existing functionality
- **Environment management**: Test against dev, staging, and production
- **Automated testing**: Run collections as part of CI/CD pipeline
- **Request history**: Track API changes and evolution

---

## How We'll Use It

API collections will test and document our financial dashboard endpoints:

**Example 1: Authentication flow collection**
```
Collection: Authentication
├── POST /api/auth/login
│   ├── Body: {"username": "admin", "password": "password"}
│   ├── Tests: Check status 200, save access_token
│   └── Tests: Validate JWT token structure
├── POST /api/auth/refresh
│   ├── Headers: Authorization: Bearer {{access_token}}
│   └── Tests: Verify new token generation
└── POST /api/auth/logout
    └── Tests: Verify token invalidation
```

**Example 2: Dashboard data endpoints**
```
Collection: Dashboard API
├── GET /api/dashboard/summary
│   ├── Query Params: start_date, end_date
│   ├── Tests: Response time < 2s
│   ├── Tests: Required fields present
│   └── Tests: Data types correct
├── GET /api/dashboard/transactions
│   ├── Pagination: page, limit
│   ├── Filtering: account_code, date_range
│   └── Tests: Proper pagination metadata
└── GET /api/dashboard/export
    ├── Response: File download
    └── Tests: Correct file format and content
```

**Example 3: AI query testing**
```
Collection: AI Features
├── POST /api/ask
│   ├── Body: {"question": "What is total revenue?"}
│   ├── Tests: Response contains SQL and answer
│   ├── Tests: SQL syntax validation
│   └── Tests: Reasonable response time (< 10s)
├── POST /api/ask (error cases)
│   ├── Body: {"question": "DROP TABLE users;"}
│   ├── Tests: Returns 400 Bad Request
│   └── Tests: Safe error message
└── GET /api/query-history
    └── Tests: Returns user's query history
```

**Example 4: Automated testing script**
```javascript
// Postman test script
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('revenue');
    pm.expect(jsonData).to.have.property('expenses');
});

// Save token for subsequent requests
if (pm.response.code === 200 && jsonData.access_token) {
    pm.environment.set("access_token", jsonData.access_token);
}
```

**Example 5: Environment management**
```
Development Environment:
├── base_url: http://localhost:8000
├── api_key: dev-api-key-123
└── database: financial_dev

Production Environment:
├── base_url: https://api.financial-dashboard.com
├── api_key: {{PROD_API_KEY}}
└── database: financial_prod
```

---

## Key Concepts

- **Collections**: Organized groups of related API requests
- **Environments**: Different configurations for dev/staging/production
- **Variables**: Dynamic values that can be reused across requests
- **Tests**: Automated validation of API responses
- **Authentication**: Handling tokens, API keys, and auth flows
- **Data files**: CSV/JSON files for bulk testing

---

## Alternatives We Considered

- **curl commands**: Hard to organize and share
- **Custom Python scripts**: Time-consuming for simple API testing
- **Browser dev tools**: Not suitable for comprehensive API testing
- **Unit tests only**: Misses integration and end-to-end scenarios

---

## Getting Started

1. **Install tool**: Download Postman or Bruno
2. **Create collection**: Start with a new collection
3. **Add requests**: Create HTTP requests for your endpoints
4. **Add tests**: Include validation scripts
5. **Set environments**: Configure different environments

---

## Common Patterns & Best Practices

1. **Organize by feature**: Group related endpoints together
2. **Use environments**: Separate dev, staging, and production configs
3. **Include examples**: Show typical request/response pairs
4. **Add documentation**: Describe what each request does
5. **Version collections**: Track API changes over time

---

## Troubleshooting

**Issue 1:** Authentication not working  
**Solution:** Check token storage and header formatting

**Issue 2:** Tests failing intermittently  
**Solution:** Add proper waits and retry logic

---

## Learning Resources

**Essential:**
- [Postman Learning Center](https://learning.postman.com/)
- [Bruno Documentation](https://docs.usebruno.com/)

**Recommended:**
- [API Testing Guide](https://www.postman.com/api-platform/api-testing/)
- [Bruno Getting Started](https://docs.usebruno.com/getting-started/overview.html)

**Community:**
- [Postman Community](https://community.postman.com/)
- [Bruno GitHub](https://github.com/usebruno/bruno)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - API framework being tested
- [Swagger UI](swagger-ui.md) - Alternative API documentation
- [pytest](pytest.md) - Unit testing complement
