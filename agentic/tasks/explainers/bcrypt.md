# bcrypt

**Category:** Backend / Security
**Official Docs:** https://github.com/pyca/bcrypt/
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

bcrypt is a password hashing library designed specifically for securely storing passwords. Unlike simple hashing algorithms (like MD5 or SHA-1), bcrypt is intentionally slow and includes a "salt" (random data) automatically. This makes it extremely resistant to brute-force attacks and rainbow table attacks.

Think of bcrypt as a one-way encryption system: you can easily turn a password into a hash, but it's computationally expensive (nearly impossible) to reverse the hash back into the original password. When a user logs in, you hash their entered password and compare it to the stored hash.

---

## Why We're Using It In This Project

- **Industry standard** - bcrypt is the gold standard for password hashing in production applications
- **Automatic salting** - No need to manually generate and store salts; bcrypt handles this internally
- **Configurable work factor** - We can adjust the "cost" (12 rounds) to keep pace with increasing computational power
- **Proven security** - Widely audited and trusted by security experts for protecting user credentials
- **Python native** - First-class support in Python with simple API for our FastAPI backend

---

## How We'll Use It

**Example 1: Hashing a Password During User Registration**
```python
import bcrypt

def create_user(email: str, password: str, role: str):
    # Generate salt and hash password (12 rounds = ~300ms on modern hardware)
    password_hash = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt(rounds=12)
    )

    # Store in DynamoDB
    user_data = {
        "user_id": str(uuid.uuid4()),
        "email": email,
        "password_hash": password_hash.decode('utf-8'),  # Store as string
        "role": role,
        "created_at": datetime.utcnow().isoformat()
    }
    dynamodb.put_item(TableName='auth-users', Item=user_data)
    return user_data
```

**Example 2: Verifying Password During Login**
```python
import bcrypt

def verify_login(email: str, password: str):
    # Retrieve user from DynamoDB
    user = get_user_by_email(email)
    if not user:
        return None

    # Compare submitted password with stored hash
    password_match = bcrypt.checkpw(
        password.encode('utf-8'),
        user['password_hash'].encode('utf-8')
    )

    if password_match:
        return user  # Login successful
    else:
        return None  # Wrong password
```

---

## Key Concepts

- **Hash:** One-way transformation of password into fixed-length string (e.g., `$2b$12$KIXn...`)
- **Salt:** Random data added to password before hashing to ensure identical passwords produce different hashes
- **Work Factor (Cost):** Number of iterations (rounds) the algorithm performs; 12 rounds = 2^12 = 4096 iterations
- **Rainbow Table:** Pre-computed table of password hashes; bcrypt's salting makes these useless
- **Timing Attack Resistance:** bcrypt's constant-time comparison prevents attackers from guessing passwords based on response times

---

## Alternatives We Considered

- **Argon2:** Winner of Password Hashing Competition; slightly more modern but less widely supported in Python
- **PBKDF2:** Older standard, fast but requires manual salt management
- **scrypt:** Memory-hard algorithm; good but bcrypt is simpler and sufficient for our use case
- **Plain SHA-256:** Never acceptable for passwords; too fast and no built-in salting

---

## Getting Started

1. **Install bcrypt:**
   ```bash
   pip install bcrypt
   ```

2. **Add to requirements.txt:**
   ```
   bcrypt==4.1.1
   ```

3. **Hash a password:**
   ```python
   import bcrypt
   hashed = bcrypt.hashpw(b"my_password", bcrypt.gensalt(rounds=12))
   ```

4. **Verify a password:**
   ```python
   if bcrypt.checkpw(b"user_input", hashed):
       print("Password correct!")
   ```

---

## Common Patterns & Best Practices

1. **Use 12 rounds minimum** - Balance between security and performance (~300ms hashing time)
2. **Store hash as string** - Decode bytes to UTF-8 string for DynamoDB storage
3. **Never log or print hashes** - Treat password hashes as sensitive data
4. **Use constant-time comparison** - Always use `bcrypt.checkpw()`, never `==` comparison
5. **Re-hash on work factor increase** - If you increase rounds from 12 to 13, re-hash passwords on next login

---

## Troubleshooting

**Issue 1:** `TypeError: Unicode-objects must be encoded before hashing`
**Solution:** Convert strings to bytes: `password.encode('utf-8')`

**Issue 2:** Password verification fails even with correct password
**Solution:** Ensure you're encoding both the input password AND the stored hash to bytes before calling `checkpw()`

**Issue 3:** Login takes 5+ seconds
**Solution:** You've set the work factor too high. 12 rounds should take ~300ms. Check `bcrypt.gensalt(rounds=?)` parameter.

---

## Learning Resources

**Essential:**
- [bcrypt Python Documentation](https://github.com/pyca/bcrypt/)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

**Recommended:**
- [How bcrypt Works](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/)
- [Choosing Work Factor](https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt)

**Community:**
- [PyCA Cryptography GitHub](https://github.com/pyca)

---

**Related Technologies:**
- [python-jose](python-jose.md) - JWT token generation after successful password verification
- [AWS DynamoDB](aws-dynamodb.md) - Storage for password hashes
- [FastAPI](fastapi.md) - Authentication endpoints that use bcrypt
