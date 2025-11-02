# Starlette

**Category:** Backend  
**Official Docs:** [https://www.starlette.io/](https://www.starlette.io/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Starlette is a lightweight ASGI (Asynchronous Server Gateway Interface) framework for building high-performance web services in Python. It provides the foundational building blocks for web applications, including routing, middleware, and request/response handling. FastAPI is built on top of Starlette, adding automatic API documentation and data validation features.

Think of Starlette as the engine in a high-performance sports car. While you might drive a FastAPI (the complete car), understanding Starlette helps you tune the engine for maximum performance and customize advanced features that FastAPI doesn't expose directly.

---

## Why We're Using It In This Project

Starlette powers our FastAPI application and understanding it enables advanced usage:

- **Foundation of FastAPI**: Everything we build with FastAPI runs on Starlette
- **Performance optimization**: Direct access to low-level features when needed
- **Custom middleware**: Ability to create specialized request processing
- **ASGI compatibility**: Ensures our app works with any ASGI server
- **Lightweight core**: Minimal overhead while providing essential web features
- **Extensibility**: Can add custom functionality beyond FastAPI's features

---

## How We'll Use It

While we primarily use FastAPI, Starlette features are accessible when needed:

**Example 1: Custom middleware**
```python
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class CustomLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print(f"Request: {request.method} {request.url}")
        response = await call_next(request)
        print(f"Response: {response.status_code}")
        return response

app.add_middleware(CustomLoggingMiddleware)
```

**Example 2: Custom response types**
```python
from starlette.responses import StreamingResponse

@app.get("/api/export")
def stream_financial_data():
    def generate_csv():
        # Stream large CSV files without loading into memory
        yield "id,amount,date\n"
        for row in large_dataset:
            yield f"{row.id},{row.amount},{row.date}\n"
    
    return StreamingResponse(
        generate_csv(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=financial_data.csv"}
    )
```

**Example 3: Background tasks**
```python
from starlette.background import BackgroundTask

@app.post("/api/process")
def process_large_dataset():
    # Start background processing
    return Response(
        "Processing started",
        background=BackgroundTask(process_in_background)
    )
```

---

## Key Concepts

- **ASGI Application**: The core interface for async web applications
- **Routing**: Maps URLs to handler functions
- **Middleware**: Components that process requests/responses
- **Request/Response**: Objects representing HTTP messages
- **Background Tasks**: Async tasks that run after response is sent

---

## Alternatives We Considered

- **Django**: Too heavy for our API performance needs
- **Flask**: Synchronous and less performant than ASGI
- **Direct ASGI**: Too low-level for our development speed requirements

---

## Getting Started

1. **Usually accessed through FastAPI**: `pip install fastapi` (includes Starlette)
2. **Direct usage if needed**:
   ```python
   from starlette.applications import Starlette
   from starlette.responses import JSONResponse
   
   app = Starlette()
   
   @app.route('/hello')
   async def hello(request):
       return JSONResponse({'hello': 'world'})
   ```
3. **Run with Uvicorn**: `uvicorn app:app`

---

## Common Patterns & Best Practices

1. **Use FastAPI for APIs**: Starlette is better for custom web services
2. **Middleware for cross-cutting concerns**: Logging, authentication, etc.
3. **Background tasks for long operations**: Don't block responses
4. **Streaming responses for large data**: Memory-efficient file serving
5. **Custom exception handlers**: Centralized error processing

---

## Troubleshooting

**Issue 1:** Middleware not executing  
**Solution:** Ensure middleware is added before routes that need it

**Issue 2:** Background tasks not running  
**Solution:** Make sure the ASGI server supports background tasks

---

## Learning Resources

**Essential:**
- [Starlette Documentation](https://www.starlette.io/)
- [ASGI Specification](https://asgi.readthedocs.io/)

**Recommended:**
- [FastAPI Advanced Guide](https://fastapi.tiangolo.com/advanced/)
- [Starlette Examples](https://github.com/encode/starlette/tree/master/docs)

**Community:**
- [Starlette GitHub](https://github.com/encode/starlette)
- [FastAPI Discord](https://discord.gg/VQjSZaeJmf)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Framework built on Starlette
- [Uvicorn](uvicorn.md) - ASGI server for Starlette apps
