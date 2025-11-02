# fastapi-cors-middleware

**Category:** Backend  
**Official Docs:** [https://github.com/sbdchd/fastapi-cors-middleware](https://github.com/sbdchd/fastapi-cors-middleware)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

fastapi-cors-middleware is a FastAPI middleware package that simplifies handling Cross-Origin Resource Sharing (CORS) in FastAPI applications. CORS is a security feature implemented by web browsers that controls which websites can make requests to your API. Without proper CORS configuration, browsers will block requests from your frontend to your backend, even if they're on different domains or ports.

Think of CORS as a bouncer at a club door. It checks the "ID" (origin) of everyone trying to enter and only lets in those on the approved list. fastapi-cors-middleware helps you configure this bouncer for your FastAPI application.

---

## Why We're Using It In This Project

CORS middleware is essential for our frontend-backend communication:

- **Frontend-backend integration**: Allows our Vercel-hosted React app to call our ECS Fargate API
- **Development flexibility**: Enables local development with different ports
- **Security-conscious**: Provides fine-grained control over which origins can access our API
- **Production ready**: Supports credentials and various CORS scenarios
- **FastAPI native**: Integrates seamlessly with our web framework
- **Simple configuration**: Easy to set up for both development and production

---

## How We'll Use It

The middleware will handle CORS headers automatically for all API requests:

**Example 1: Basic CORS setup**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

**Example 2: Production configuration**
```python
# In production settings
CORS_ORIGINS = [
    "https://your-app.vercel.app",
    "https://dashboard.yourcompany.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=86400,  # Cache preflight for 24 hours
)
```

**Example 3: Environment-based configuration**
```python
import os

origins = []
if os.getenv("ENVIRONMENT") == "development":
    origins = ["http://localhost:3000", "http://localhost:5173"]
else:
    origins = [os.getenv("FRONTEND_URL")]

app.add_middleware(CORSMiddleware, allow_origins=origins)
```

---

## Key Concepts

- **Origin**: The protocol, domain, and port of the requesting website
- **Preflight request**: Browser's initial check before allowing the actual request
- **Credentials**: Cookies, authorization headers that need explicit permission
- **Headers**: Which HTTP headers the frontend is allowed to send
- **Methods**: HTTP methods (GET, POST, etc.) allowed from the frontend

---

## Alternatives We Considered

- **Manual CORS headers**: Too error-prone and repetitive
- **Flask-CORS**: Not needed since we're using FastAPI
- **No CORS handling**: Would break frontend-backend communication

---

## Getting Started

1. **Install the middleware**: `pip install fastapi-cors-middleware` (or use FastAPI's built-in CORSMiddleware)
2. **Add to your FastAPI app**:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_methods=["GET", "POST"],
   )
   ```
3. **Test with your frontend**: Make requests and check browser network tab

---

## Common Patterns & Best Practices

1. **Environment-specific origins**: Different allowed origins for dev vs production
2. **Minimal required permissions**: Only allow necessary methods and headers
3. **Credentials when needed**: Only set `allow_credentials=True` if using cookies/auth
4. **Cache preflight requests**: Use `max_age` to reduce OPTIONS requests
5. **Log CORS issues**: Monitor for unexpected origin requests

---

## Troubleshooting

**Issue 1:** CORS error in browser despite correct config  
**Solution:** Check that the origin includes protocol (http/https) and port

**Issue 2:** Credentials not working with CORS  
**Solution:** Ensure `allow_credentials=True` and specific origins (not wildcard)

---

## Learning Resources

**Essential:**
- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

**Recommended:**
- [CORS in Action](https://web.dev/cross-origin-resource-sharing/)
- [FastAPI Middleware Guide](https://fastapi.tiangolo.com/tutorial/middleware/)

**Community:**
- [FastAPI GitHub](https://github.com/tiangolo/fastapi)
- [Stack Overflow CORS Questions](https://stackoverflow.com/questions/tagged/cors)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Web framework
- [Vercel](vercel.md) - Frontend hosting
- [AWS ECS Fargate](aws-ecs-fargate.md) - Backend hosting
