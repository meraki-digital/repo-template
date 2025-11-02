# python-jose

**Category:** Backend / Security  
**Official Docs:** [https://python-jose.readthedocs.io/](https://python-jose.readthedocs.io/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

python-jose is a comprehensive Python library for working with JSON Web Tokens (JWT) and JSON Web Signatures (JWS). It provides both encoding and decoding capabilities for JWT tokens, which are compact, URL-safe means of representing claims between two parties. JWTs are commonly used for authentication and information exchange in web applications.

Think of JWT as a secure, self-contained ticket that proves someone's identity. python-jose helps you create these tickets when users log in and verify them when they make requests to protected parts of your API.

---

## Why We're Using It In This Project

python-jose provides the cryptographic foundation for our API authentication system:

- **Secure token generation**: Creates tamper-proof tokens for user authentication
- **Multiple algorithm support**: Supports RSA, ECDSA, and HMAC algorithms for different security needs
- **Cryptography integration**: Uses the battle-tested cryptography library for security
- **FastAPI integration**: Works seamlessly with our web framework's dependency injection
- **Stateless authentication**: Enables scalable authentication without server-side sessions
- **Industry standard**: JWT is the standard for modern API authentication

---

## How We'll Use It

python-jose will handle JWT creation and verification for our user authentication flow:

**Example 1: Create access token on login**
```python
from jose import jwt
from datetime import datetime, timedelta

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode, 
        SECRET_KEY, 
        algorithm="HS256"
    )
    return encoded_jwt
```

**Example 2: Verify token in API endpoint**
```python
from jose import jwt, JWTError
from fastapi import Depends, HTTPException

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

**Example 3: Refresh token handling**
```python
@app.post("/auth/refresh")
def refresh_access_token(refresh_token: str):
    # Verify refresh token (longer expiry)
    # Generate new access token
    # Return new token pair
    pass
```

---

## Key Concepts

- **JWT Claims**: Payload data like user ID, expiration time, and permissions
- **Algorithm**: Cryptographic method used to sign the token (HS256, RS256, etc.)
- **Secret Key**: Private key used for signing (keep secure!)
- **Expiration**: Token validity period to prevent indefinite access
- **Refresh Tokens**: Longer-lived tokens to get new access tokens

---

## Alternatives We Considered

- **PyJWT**: Simpler but less comprehensive algorithm support
- **Authlib**: More complex for our authentication needs
- **Session-based auth**: Not scalable for our API-first architecture

---

## Getting Started

1. **Install python-jose**: `pip install python-jose[cryptography]`
2. **Import and use**:
   ```python
   from jose import jwt
   
   # Create token
   token = jwt.encode({"user": "john"}, "secret", algorithm="HS256")
   
   # Decode token
   data = jwt.decode(token, "secret", algorithms=["HS256"])
   ```
3. **Secure your secret key**: Use environment variables, never hardcode

---

## Common Patterns & Best Practices

1. **Use strong secrets**: Generate cryptographically secure random keys
2. **Set appropriate expiration**: 15-30 minutes for access tokens
3. **Include minimal claims**: Only user ID and necessary permissions
4. **Use refresh tokens**: For long-term sessions without re-login
5. **Validate all tokens**: Always verify before processing requests

---

## Troubleshooting

**Issue 1:** Token signature verification fails  
**Solution:** Ensure same secret key and algorithm used for encode/decode

**Issue 2:** Tokens not expiring properly  
**Solution:** Check timezone handling and token format

---

## Learning Resources

**Essential:**
- [python-jose Documentation](https://python-jose.readthedocs.io/)
- [JWT.io Introduction](https://jwt.io/introduction/)

**Recommended:**
- [Real Python JWT Guide](https://realpython.com/token-based-authentication-with-flask/)
- [FastAPI Security Tutorial](https://fastapi.tiangolo.com/tutorial/security/)

**Community:**
- [python-jose GitHub](https://github.com/mpdavis/python-jose)
- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)

---

**Related Technologies:**
- [PyJWT](pyjwt.md) - Alternative JWT library
- [FastAPI](fastapi.md) - Web framework integration
- [passlib](https://passlib.readthedocs.io/) - Password hashing
