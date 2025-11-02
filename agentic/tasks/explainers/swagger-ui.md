# Swagger UI

**Category:** Development Tools  
**Official Docs:** [https://swagger.io/tools/swagger-ui/](https://swagger.io/tools/swagger-ui/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Swagger UI is an interactive API documentation tool that automatically generates a web-based interface for exploring and testing REST APIs. It reads OpenAPI specifications and creates a user-friendly interface where developers can see all available endpoints, try them out with sample requests, and view response examples. Swagger UI is particularly valuable for API development because it provides immediate, interactive documentation that stays in sync with the code.

Think of Swagger UI as a living API reference manual. Instead of maintaining separate documentation that can get out of date, Swagger UI automatically generates an interactive playground directly from your API code, making it easy for developers to understand and test your API.

---

## Why We're Using It In This Project

Swagger UI provides automatic, interactive API documentation for our FastAPI endpoints:

- **Auto-generated docs**: Documentation stays in sync with code changes
- **Interactive testing**: Try API calls directly from the browser
- **No maintenance**: Generated from FastAPI's type hints and route definitions
- **Developer friendly**: Clear interface for understanding API structure
- **Request/response examples**: Shows actual data formats
- **Authentication testing**: Test protected endpoints with auth
- **Schema validation**: Visual representation of request/response models
- **Onboarding tool**: Helps new developers understand the API quickly

---

## How We'll Use It

Swagger UI will serve as our primary API documentation and testing interface:

**Example 1: Accessing Swagger UI**
```
FastAPI automatically serves Swagger UI at:
/docs

For our application:
- Development: http://localhost:8000/docs
- Production: https://api.financial-dashboard.com/docs
```

**Example 2: API endpoint documentation**
```python
from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="Financial Intelligence Dashboard API",
    description="API for financial data analysis and AI-powered insights",
    version="1.0.0"
)

class DashboardRequest(BaseModel):
    start_date: str = "2024-01-01"
    end_date: str = "2024-12-31"
    include_forecast: bool = False
    
    class Config:
        schema_extra = {
            "example": {
                "start_date": "2024-01-01",
                "end_date": "2024-01-31",
                "include_forecast": True
            }
        }

@app.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard_data(
    request: DashboardRequest,
    api_key: Optional[str] = Query(None, description="API key for authentication")
):
    """
    Get dashboard summary data with optional forecasting.
    
    - **start_date**: Start date in YYYY-MM-DD format
    - **end_date**: End date in YYYY-MM-DD format  
    - **include_forecast**: Include AI-generated forecasts
    """
    # Implementation here
    pass
```

**Example 3: Authentication in Swagger**
```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

@app.get("/api/user/profile")
def get_user_profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get current user profile information.
    
    Requires valid JWT token in Authorization header.
    """
    # Implementation
    pass

# In Swagger UI, users can:
# 1. Click "Authorize" button
# 2. Enter: Bearer <jwt_token>
# 3. Test authenticated endpoints
```

**Example 4: File upload documentation**
```python
from fastapi import File, UploadFile

@app.post("/api/upload/transactions")
def upload_transaction_file(file: UploadFile = File(..., description="CSV file with transactions")):
    """
    Upload transaction data from CSV file.
    
    File should contain columns: date, amount, description, account_code
    """
    # Implementation
    pass

# Swagger UI shows:
# - File upload button
# - Parameter description
# - Expected file format
```

---

## Key Concepts

- **OpenAPI specification**: Standard format for API documentation
- **Interactive interface**: Try endpoints directly in the browser
- **Request builder**: Fill in parameters and see generated requests
- **Response viewer**: See actual responses with proper formatting
- **Schema display**: Visual representation of data models
- **Authentication**: Built-in auth testing capabilities

---

## Alternatives We Considered

- **Manual API docs**: Get out of sync with code changes
- **Postman collections**: Good for testing but not for documentation
- **Static documentation**: Hard to keep updated
- **Custom documentation**: Time-consuming to maintain

---

## Getting Started

1. **FastAPI includes it**: No additional installation needed
2. **Access docs**: Visit `/docs` endpoint
3. **Try endpoints**: Click on any endpoint to expand
4. **Execute requests**: Fill parameters and click "Execute"
5. **View responses**: See response data and status codes

---

## Common Patterns & Best Practices

1. **Detailed descriptions**: Use docstrings for endpoint explanations
2. **Example data**: Provide realistic request/response examples
3. **Parameter validation**: Use Pydantic models for automatic schema generation
4. **Error responses**: Document possible error codes and messages
5. **Authentication**: Set up proper auth for protected endpoints

---

## Troubleshooting

**Issue 1:** Docs not showing custom examples  
**Solution:** Use Config.schema_extra in Pydantic models

**Issue 2:** Authentication not working in UI  
**Solution:** Configure security schemes in FastAPI

---

## Learning Resources

**Essential:**
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/tutorial/metadata/)

**Recommended:**
- [OpenAPI Specification](https://swagger.io/specification/)
- [FastAPI Advanced Docs](https://fastapi.tiangolo.com/advanced/path-operation-advanced-configuration/)

**Community:**
- [FastAPI GitHub](https://github.com/tiangolo/fastapi)
- [OpenAPI Initiative](https://www.openapis.org/)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Framework that generates the docs
- [Pydantic v2](pydantic-v2.md) - Data models that create schemas
- [API Testing Collections](api-testing-collections.md) - Manual testing complement
