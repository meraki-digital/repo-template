# JWT (JSON Web Tokens)

**Category:** Security  
**Official Docs:** [https://jwt.io/](https://jwt.io/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims to be transferred between two parties. They are commonly used for authentication and authorization in web applications, allowing stateless authentication where the server doesn't need to store session information. A JWT consists of three parts: a header, a payload, and a signature, all encoded as a single string.

Think of JWT as a secure, self-contained passport for your application. Instead of checking a database every time a user makes a request, the server can verify the user's identity by checking the JWT they provide, which contains all the necessary information encrypted and signed.

---

## Why We're Using It In This Project

JWT provides secure, stateless authentication for our API:

- **Stateless authentication**: No server-side session storage needed
- **Scalable**: Works across multiple servers and services
- **Secure**: Cryptographically signed and optionally encrypted
- **Self-contained**: Contains all user information in the token
- **Standardized**: Widely adopted industry standard
- **Cross-platform**: Works with any programming language
- **Expiration control**: Built-in token lifetime management
- **Claims-based**: Can include custom user permissions and roles

---

## How We'll Use It

JWT will handle user authentication and authorization in our system:

**Example 1: Token generation**
```python
from datetime import datetime, timedelta
import jwt

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)  # Short-lived
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    
    encoded_jwt = jwt.encode(
        to_encode, 
        SECRET_KEY, 
        algorithm="HS256"
    )
    return encoded_jwt

# Create token for authenticated user
token = create_access_token({
    "sub": "user123",
    "email": "user@example.com",
    "role": "analyst"
})
```

**Example 2: Token verification**
```python
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        return {"user_id": user_id, "valid": True}
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired", "valid": False}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token", "valid": False}

# Verify token on API requests
auth_result = verify_token(request.headers.get("Authorization").split()[1])
```

**Example 3: Refresh token pattern**
```python
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)  # Longer-lived
    to_encode.update({"exp": expire, "type": "refresh"})
    
    encoded_jwt = jwt.encode(
        to_encode, 
        REFRESH_SECRET_KEY,  # Different key for refresh tokens
        algorithm="HS256"
    )
    return encoded_jwt

# Issue both tokens on login
access_token = create_access_token({"sub": user.id})
refresh_token = create_refresh_token({"sub": user.id})

# Use refresh token to get new access token
@app.post("/auth/refresh")
def refresh_access_token(refresh_token: str):
    # Verify refresh token
    payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=["HS256"])
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    
    # Issue new access token
    new_access_token = create_access_token({"sub": payload["sub"]})
    return {"access_token": new_access_token}
```

---

## Key Concepts

- **Header**: Contains algorithm and token type
- **Payload**: Contains claims (user data, expiration, etc.)
- **Signature**: Cryptographic signature for verification
- **Claims**: Registered (iss, exp, sub) and custom claims
- **Algorithms**: HS256 (symmetric) or RS256 (asymmetric)

---

## Alternatives We Considered

- **Session-based auth**: Requires server storage, less scalable
- **API keys**: Less secure, harder to manage permissions
- **OAuth2**: More complex for our needs
- **Custom tokens**: Reinventing the wheel

---

## Getting Started

1. **Install library**: `pip install PyJWT` or `python-jose`
2. **Choose algorithm**: HS256 for simplicity, RS256 for distributed systems
3. **Set secret key**: Use strong, random key
4. **Implement middleware**: Verify tokens on protected routes
5. **Handle refresh**: Implement token refresh flow

---

## Common Patterns & Best Practices

1. **Short-lived access tokens**: 15-30 minutes
2. **Longer refresh tokens**: 7-30 days
3. **Secure storage**: Never store tokens in localStorage long-term
4. **HTTPS only**: Always use HTTPS to prevent token interception
5. **Token revocation**: Implement logout and invalidation

---

## Troubleshooting

**Issue 1:** Token expired errors  
**Solution:** Implement automatic token refresh

**Issue 2:** Token tampering  
**Solution:** Verify signatures and use strong secrets

---

## Learning Resources

**Essential:**
- [JWT.io Introduction](https://jwt.io/introduction/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

**Recommended:**
- [JWT Authentication Best Practices](https://tools.ietf.org/html/rfc8725)
- [API Security with JWT](https://realpython.com/token-based-authentication-with-flask/)

**Community:**
- [JWT.io](https://jwt.io/)
- [Stack Overflow JWT Questions](https://stackoverflow.com/questions/tagged/jwt)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - Framework using JWT
- [python-jose](python-jose.md) - JWT implementation
- [PyJWT](pyjwt.md) - Alternative JWT library
