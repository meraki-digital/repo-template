# PyJWT

**Category:** Backend / Security  
**Official Docs:** [https://pyjwt.readthedocs.io/](https://pyjwt.readthedocs.io/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

PyJWT is a lightweight Python library for encoding and decoding JSON Web Tokens (JWT), providing a simple interface for working with JWT tokens in authentication systems. JWTs are standardized, compact tokens that can securely transmit information between parties as a JSON object.

Like python-jose, PyJWT helps create secure tokens for user authentication, but with a simpler API focused on the most common use cases. It's particularly good for straightforward JWT operations without the additional complexity of multiple cryptographic algorithms.

---

## Why We're Using It In This Project

PyJWT provides a reliable, simple JWT implementation for our authentication needs:

- **Simple API**: Easy to use for basic JWT encoding and decoding operations
- **Lightweight**: Minimal dependencies and straightforward integration
- **Well-maintained**: Active community and regular security updates
- **FastAPI compatible**: Works well with our dependency injection system
- **Sufficient for our needs**: Our authentication requirements don't need advanced crypto algorithms
- **Widely adopted**: Used by many Python web applications and libraries

---

## How We'll Use It

PyJWT will handle JWT token management in our authentication system:

**Example 1: Generate JWT token**
```python
import jwt
from datetime import datetime, timedelta

def create_jwt_token(user_id: str, secret: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token
```

**Example 2: Decode and verify token**
```python
def verify_jwt_token(token: str, secret: str) -> dict:
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
```

**Example 3: FastAPI dependency**
```python
from fastapi import Depends, HTTPException
from jwt import PyJWTError

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
    except PyJWTError:
        raise HTTPException(status_code=401)
    return user_id
```

---

## Key Concepts

- **Header**: Contains algorithm and token type information
- **Payload**: Contains claims (user data, expiration, etc.)
- **Signature**: Cryptographic signature to verify token integrity
- **Algorithm**: HS256 (HMAC SHA-256) for symmetric encryption
- **Claims**: Registered (exp, iat) and custom claims

---

## Alternatives We Considered

- **python-jose**: More comprehensive but overkill for our simple JWT needs
- **Auth0 JWT**: Cloud-service dependent, not suitable for our self-hosted solution
- **Custom token system**: Less secure and more maintenance than standard JWT

---

## Getting Started

1. **Install PyJWT**: `pip install PyJWT`
2. **Basic usage**:
   ```python
   import jwt
   
   # Encode
   token = jwt.encode({"user": "john"}, "secret", algorithm="HS256")
   
   # Decode
   data = jwt.decode(token, "secret", algorithms=["HS256"])
   ```
3. **Use environment variables for secrets**: Never hardcode secret keys

---

## Common Patterns & Best Practices

1. **Use HS256 for simplicity**: Symmetric encryption with shared secret
2. **Include expiration**: Always set 'exp' claim to prevent indefinite access
3. **Minimal payload**: Only include necessary user identification data
4. **Secure secret storage**: Use environment variables or secret management
5. **Handle exceptions**: Catch ExpiredSignatureError and InvalidTokenError

---

## Troubleshooting

**Issue 1:** Token decoding fails with invalid signature  
**Solution:** Verify the same secret key is used for encoding and decoding

**Issue 2:** Tokens not expiring as expected  
**Solution:** Check datetime handling and timezone consistency

---

## Learning Resources

**Essential:**
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
- [JWT.io](https://jwt.io/) - JWT debugger and information

**Recommended:**
- [Real Python JWT Authentication](https://realpython.com/token-based-authentication-with-flask/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

**Community:**
- [PyJWT GitHub](https://github.com/jpadilla/pyjwt)
- [Python Web Security Resources](https://owasp.org/www-project-web-security-testing-guide/)

---

**Related Technologies:**
- [python-jose](python-jose.md) - Alternative JWT library
- [FastAPI](fastapi.md) - Web framework
- [passlib](https://passlib.readthedocs.io/) - Password hashing
