# slowapi

**Category:** Backend  
**Official Docs:** [https://slowapi.readthedocs.io/](https://slowapi.readthedocs.io/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

slowapi is a rate limiting middleware for FastAPI applications that helps protect your API from abuse and ensures fair usage. It allows you to set limits on how many requests users can make within a time period, preventing excessive API calls that could overwhelm your system or incur high costs (especially important for our OpenAI integration).

Think of slowapi as a traffic cop for your API. It monitors incoming requests and politely tells users to "slow down" when they exceed reasonable limits, protecting your system from being overwhelmed by too many requests at once.

---

## Why We're Using It In This Project

Rate limiting is crucial for our API's stability and cost control:

- **OpenAI cost protection**: Prevents excessive AI queries that could run up bills
- **System stability**: Protects against DDoS-like attacks or runaway scripts
- **Fair usage**: Ensures all users get reasonable access to dashboard features
- **Performance protection**: Prevents database overload from too many concurrent queries
- **FastAPI integration**: Seamlessly works with our web framework
- **Flexible configuration**: Different limits for different endpoints and users

---

## How We'll Use It

slowapi will enforce rate limits on our API endpoints, especially the expensive AI features:

**Example 1: Basic rate limiting setup**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
```

**Example 2: Limit expensive AI queries**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/ask")
@limiter.limit("10/minute")  # 10 AI queries per minute
def ask_ai_question(request: AIQueryRequest):
    # Process expensive OpenAI call
    pass
```

**Example 3: Different limits for different endpoints**
```python
@app.get("/api/dashboard")
@limiter.limit("100/minute")  # Dashboard data is cheaper
def get_dashboard_data():
    pass

@app.get("/api/export")
@limiter.limit("5/minute")  # Exports are resource intensive
def export_financial_data():
    pass
```

---

## Key Concepts

- **Rate Limit**: Number of requests allowed per time period (e.g., "10/minute")
- **Key Function**: How to identify users (IP address, user ID, API key)
- **Storage Backend**: Where to store rate limit counters (memory, Redis, etc.)
- **Burst vs Sustained**: Allow short bursts but limit sustained high usage
- **Exemption**: Certain users or endpoints can bypass limits

---

## Alternatives We Considered

- **Custom rate limiting**: Too complex to implement reliably
- **Cloud provider limits**: AWS API Gateway limits, but we want application-level control
- **No rate limiting**: Would leave us vulnerable to abuse and cost overruns

---

## Getting Started

1. **Install slowapi**: `pip install slowapi`
2. **Basic setup**:
   ```python
   from slowapi import Limiter, SlowAPIMiddleware
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.add_middleware(SlowAPIMiddleware)
   ```
3. **Add limits to endpoints**:
   ```python
   @app.get("/api/data")
   @limiter.limit("10/minute")
   def get_data():
       return {"data": "here"}
   ```

---

## Common Patterns & Best Practices

1. **Tiered limits**: Higher limits for paying users, basic limits for free tier
2. **Per-user limits**: Use user ID instead of IP for authenticated requests
3. **Graduated limits**: Different limits for different endpoint costs
4. **Redis backend**: Use Redis for distributed rate limiting in production
5. **Clear error messages**: Inform users when they're rate limited

---

## Troubleshooting

**Issue 1:** Rate limits not working in development  
**Solution:** Ensure SlowAPIMiddleware is added to the app

**Issue 2:** Limits too restrictive  
**Solution:** Monitor actual usage patterns and adjust limits accordingly

---

## Learning Resources

**Essential:**
- [slowapi Documentation](https://slowapi.readthedocs.io/)
- [Rate Limiting Guide](https://slowapi.readthedocs.io/en/latest/)

**Recommended:**
- [API Rate Limiting Strategies](https://stripe.com/blog/rate-limiters)
- [FastAPI Middleware](https://fastapi.tiangolo.com/tutorial/middleware/)

**Community:**
- [slowapi GitHub](https://github.com/laurentS/slowapi)
- [FastAPI GitHub](https://github.com/tiangolo/fastapi)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Web framework
- [OpenAI GPT-4 API](openai-gpt-4-api.md) - Expensive service we protect
- [Redis](https://redis.io/) - Optional backend for distributed limiting
