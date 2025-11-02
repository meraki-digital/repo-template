# Uvicorn

**Category:** Backend  
**Official Docs:** [https://www.uvicorn.org/](https://www.uvicorn.org/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Uvicorn is a lightning-fast ASGI (Asynchronous Server Gateway Interface) web server implementation for Python. It serves as the production server that actually runs FastAPI applications, handling HTTP requests and responses asynchronously. Think of it as the engine that powers your FastAPI application, capable of handling thousands of concurrent connections efficiently.

Unlike traditional WSGI servers like Gunicorn, Uvicorn is designed for async-first frameworks and can handle WebSocket connections, long-lived connections, and high-concurrency scenarios that traditional servers struggle with.

---

## Why We're Using It In This Project

Uvicorn is the standard server for FastAPI applications and fits perfectly with our project's async requirements:

- **Native FastAPI support**: The officially recommended server for FastAPI, ensuring compatibility and optimal performance
- **Async capabilities**: Critical for our AI integration where API calls to OpenAI can take several seconds
- **Production ready**: Handles the load from our dashboard users querying complex financial data
- **Simple deployment**: Easy to configure for both development and production environments
- **WebSocket support**: Future-proofs us for real-time dashboard updates if needed

---

## How We'll Use It

Uvicorn will run our FastAPI backend in both development and production:

**Example 1: Development server**
```bash
# Run with auto-reload for development
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Example 2: Production deployment**
```bash
# Run with multiple workers for production
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Example 3: Docker container**
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Key Concepts

- **ASGI**: Asynchronous Server Gateway Interface - the modern standard for async Python web servers
- **Workers**: Multiple process instances that handle requests in parallel for better performance
- **Reload mode**: Automatically restarts the server when code changes during development
- **WebSocket support**: Can handle real-time bidirectional communication
- **SSL/TLS**: Built-in support for HTTPS encryption in production

---

## Alternatives We Considered

- **Gunicorn**: Good WSGI server but doesn't support async operations we need for AI calls
- **Daphne**: More complex configuration and primarily designed for Django Channels

---

## Getting Started

1. **Install Uvicorn**: `pip install uvicorn[standard]` (includes optional dependencies)
2. **Run your FastAPI app**: `uvicorn your_module:app --reload`
3. **Access the app**: Open http://localhost:8000/docs for automatic API documentation

---

## Common Patterns & Best Practices

1. **Use reload during development**: `--reload` flag for automatic restarts on code changes
2. **Configure workers for production**: `--workers 4` for multi-core utilization
3. **Set proper host binding**: `--host 0.0.0.0` to accept connections from any interface
4. **Enable access logging**: Default behavior provides request logging
5. **Use environment variables**: Configure port and host via environment variables

---

## Troubleshooting

**Issue 1:** Port already in use  
**Solution:** Kill existing process or use different port: `uvicorn app:app --port 8001`

**Issue 2:** High memory usage in production  
**Solution:** Adjust worker count based on server resources: `--workers 2` for smaller instances

---

## Learning Resources

**Essential:**
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [Uvicorn Settings](https://www.uvicorn.org/settings/)

**Recommended:**
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [ASGI Explained](https://asgi.readthedocs.io/en/latest/)

**Community:**
- [Uvicorn GitHub](https://github.com/encode/uvicorn)
- [FastAPI Discord](https://discord.gg/VQjSZaeJmf)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Web framework that Uvicorn serves
- [Starlette](starlette.md) - ASGI framework foundation
- [AWS ECS Fargate](aws-ecs-fargate.md) - Production deployment platform
