# Custom JWT Implementation

**Category:** Authentication / Security Pattern
**Official Docs:** (Pattern - see JWT and python-jose documentation)
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

A custom JWT implementation is an authentication pattern where you build your own token-based authentication system using JWT (JSON Web Tokens) as the token format, combined with a custom user storage backend (in our case, DynamoDB). This contrasts with using third-party authentication providers like Auth0, Clerk, or Firebase Authentication.

Think of it like building your own keycard system for a building instead of hiring a security company. You control the door locks (user storage), the keycard encoding (JWT), and the access rules (roles and permissions), giving you complete flexibility and avoiding vendor lock-in.

---

## Why We're Using It In This Project

- **Vendor independence** - No reliance on Auth0, Clerk, or other paid services; full control over authentication logic
- **Always-available authentication** - Works even when main PostgreSQL database is stopped (uses DynamoDB)
- **Reusability** - Pattern can be reused in future projects without licensing concerns
- **Cost savings** - Free except for minimal DynamoDB costs (<$1/month for 100 users)
- **Learning opportunity** - Team gains deep understanding of authentication mechanisms
- **Customization** - Can add project-specific features (invite-only registration, RDS permissions) without API limitations

---

## How We'll Use It

**Example 1: User Registration (Invite Acceptance)**
```python
import bcrypt
import uuid
from datetime import datetime
import boto3

dynamodb = boto3.client('dynamodb')

def complete_invite(invite_token: str, password: str, full_name: str):
    # Verify invite token exists and not expired
    user = get_user_by_invite_token(invite_token)
    if not user or user['invite_expires_at'] < datetime.utcnow().isoformat():
        raise ValueError('Invalid or expired invite token')

    # Hash password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))

    # Update user record
    dynamodb.update_item(
        TableName='auth-users',
        Key={'user_id': {'S': user['user_id']}},
        UpdateExpression='SET password_hash = :ph, full_name = :fn, invite_token = :null, is_active = :true, password_changed_at = :now',
        ExpressionAttributeValues={
            ':ph': {'S': password_hash.decode('utf-8')},
            ':fn': {'S': full_name},
            ':null': {'NULL': True},
            ':true': {'BOOL': True},
            ':now': {'S': datetime.utcnow().isoformat()}
        }
    )
    return {'success': True, 'email': user['email']}
```

**Example 2: Login and JWT Generation**
```python
from jose import jwt
import bcrypt
from datetime import datetime, timedelta
import os

JWT_SECRET = os.getenv('JWT_SECRET_KEY')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DAYS = 7

def login(email: str, password: str):
    # Query DynamoDB by email (using GSI)
    user = get_user_by_email(email)
    if not user or not user.get('is_active'):
        raise ValueError('Invalid credentials')

    # Verify password
    password_match = bcrypt.checkpw(
        password.encode('utf-8'),
        user['password_hash'].encode('utf-8')
    )
    if not password_match:
        raise ValueError('Invalid credentials')

    # Generate JWT token
    payload = {
        'user_id': user['user_id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(days=JWT_EXPIRATION_DAYS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    # Update last_login timestamp
    update_last_login(user['user_id'])

    return {'token': token, 'user': {'email': user['email'], 'role': user['role']}}
```

**Example 3: JWT Validation Middleware**
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from jose import jwt, JWTError

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    token = credentials.credentials

    try:
        # Decode and verify JWT (stateless - no DB query)
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        email = payload.get('email')
        role = payload.get('role')

        if not user_id or not email:
            raise HTTPException(status_code=401, detail='Invalid token')

        return {'user_id': user_id, 'email': email, 'role': role}

    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid or expired token')

# Protected endpoint example
@app.get('/api/auth/me')
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
```

**Example 4: Admin-Only Endpoint Protection**
```python
def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail='Admin access required')
    return current_user

@app.post('/admin/rds/stop')
def stop_rds(current_user: dict = Depends(require_admin)):
    # Only admins can manually stop RDS
    stop_rds_instance('ss-financial-prod')
    return {'status': 'stopped'}
```

---

## Key Concepts

- **Stateless Authentication:** JWT contains all user info (user_id, role); no database lookup needed for validation
- **Token Signing:** JWT is signed with secret key; tampering invalidates the signature
- **Expiration:** Tokens expire after 7 days; users must re-login (no refresh tokens in v1)
- **Role-Based Authorization:** User roles (admin, user, viewer) stored in JWT claims for permission checks
- **Invite-Only Registration:** Admins create invite links with one-time tokens; users complete registration via invite

---

## Alternatives We Considered

- **Auth0:** Managed service, costs $23+/month for production features, vendor lock-in
- **Clerk:** Modern UI but $25/month for production, less control over data
- **Firebase Authentication:** Google ecosystem lock-in, harder to migrate
- **Passport.js + Sessions:** Requires Redis/session storage, more complex than stateless JWT
- **OAuth2 with GitHub/Google:** Good for public apps but requires external provider availability

---

## Getting Started

1. **Set JWT secret in environment variables:**
   ```bash
   export JWT_SECRET_KEY="your-256-bit-secret-key-here"
   ```

2. **Install dependencies:**
   ```bash
   pip install python-jose[cryptography] bcrypt boto3
   ```

3. **Create DynamoDB table:**
   ```python
   # See aws-dynamodb.md for table creation
   ```

4. **Implement login endpoint:**
   ```python
   from fastapi import FastAPI, HTTPException
   from pydantic import BaseModel

   app = FastAPI()

   class LoginRequest(BaseModel):
       email: str
       password: str

   @app.post('/api/auth/login')
   def login_endpoint(request: LoginRequest):
       try:
           result = login(request.email, request.password)
           return result
       except ValueError as e:
           raise HTTPException(status_code=401, detail=str(e))
   ```

5. **Test with curl:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"testpass"}'
   ```

---

## Common Patterns & Best Practices

1. **Store JWT in httpOnly cookies or localStorage** - localStorage is simpler but vulnerable to XSS; httpOnly cookies more secure
2. **Include minimal claims in JWT** - Only user_id, email, role; avoid sensitive data
3. **Validate JWT on every protected request** - Use FastAPI dependency injection for clean middleware pattern
4. **Use strong JWT secrets** - Minimum 256-bit random string (32+ characters)
5. **Implement token expiration** - Force re-login after 7 days to limit token lifetime

---

## Troubleshooting

**Issue 1:** JWT verification fails with "Signature verification failed"
**Solution:** Ensure `JWT_SECRET_KEY` matches between token generation and validation. Check for whitespace in environment variable.

**Issue 2:** Users logged out immediately after login
**Solution:** Frontend may not be storing JWT. Check localStorage or cookie storage implementation.

**Issue 3:** Role-based access not working
**Solution:** Verify `role` claim is included in JWT payload and middleware checks `current_user['role']`.

**Issue 4:** "Token expired" errors before 7 days
**Solution:** Check server clock synchronization. JWT `exp` claim uses UTC timestamps.

---

## Learning Resources

**Essential:**
- [JWT.io](https://jwt.io/) - JWT debugger and introduction
- [python-jose Documentation](https://python-jose.readthedocs.io/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

**Recommended:**
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

**Community:**
- [FastAPI Discord](https://discord.gg/fastapi)
- [r/webdev Authentication Discussions](https://www.reddit.com/r/webdev/)

---

**Related Technologies:**
- [JWT (JSON Web Tokens)](jwt.md) - Token format specification
- [python-jose](python-jose.md) - JWT encoding/decoding library
- [bcrypt](bcrypt.md) - Password hashing for user credentials
- [AWS DynamoDB](aws-dynamodb.md) - User storage backend
- [DynamoDB Global Secondary Index](dynamodb-gsi.md) - Email lookup for login
- [FastAPI](fastapi.md) - Backend framework for authentication endpoints
