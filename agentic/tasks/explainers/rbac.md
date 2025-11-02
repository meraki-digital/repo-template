# Role-Based Access Control (RBAC)

**Category:** Authorization / Security Pattern
**Official Docs:** (Pattern - see OWASP Authorization Cheat Sheet)
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

Role-Based Access Control (RBAC) is a permission system where users are assigned roles (like "admin", "user", "viewer"), and each role has specific permissions. Instead of managing permissions individually for each user, you grant or restrict access based on their role.

Think of RBAC like job titles in a company. An "admin" (CEO) can access everything, a "user" (employee) can access most features, and a "viewer" (intern) can only view data. When someone gets promoted, you change their role, and they automatically inherit all permissions of that role.

---

## Why We're Using It In This Project

- **RDS management permissions** - Only admins should manually stop/start the database
- **User administration** - Only admins can create invitations and manage users
- **Clear authorization logic** - Easy to understand: if role == 'admin', allow action
- **Scalability** - Adding new permissions means updating role definitions, not individual users
- **Audit trail** - Know which roles performed sensitive operations

---

## How We'll Use It

**Example 1: Role Definitions (Application Constants)**
```python
# poc/backend/config.py

class Roles:
    ADMIN = 'admin'
    USER = 'user'
    VIEWER = 'viewer'

ROLE_PERMISSIONS = {
    'admin': {
        'view_data': True,
        'query_data': True,
        'manage_rds': True,
        'create_users': True,
        'update_users': True,
        'delete_users': True
    },
    'user': {
        'view_data': True,
        'query_data': True,
        'manage_rds': False,  # Can restart RDS when stopped, but not stop it
        'create_users': False,
        'update_users': False,
        'delete_users': False
    },
    'viewer': {
        'view_data': True,
        'query_data': False,
        'manage_rds': False,
        'create_users': False,
        'update_users': False,
        'delete_users': False
    }
}
```

**Example 2: Role Checking Middleware (FastAPI)**
```python
from fastapi import Depends, HTTPException

def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    # Decode JWT and return user info including role
    # (See custom-jwt-implementation.md)
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    return {
        'user_id': payload['user_id'],
        'email': payload['email'],
        'role': payload['role']
    }

def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(
            status_code=403,
            detail='Admin access required'
        )
    return current_user

def require_role(allowed_roles: list):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user['role'] not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f'Requires one of: {", ".join(allowed_roles)}'
            )
        return current_user
    return role_checker
```

**Example 3: Protected Admin Endpoints**
```python
from fastapi import APIRouter

router = APIRouter(prefix='/admin')

@router.post('/rds/stop')
def stop_rds_instance(current_user: dict = Depends(require_admin)):
    # Only admins can manually stop the database
    result = rds_client.stop_db_instance(DBInstanceIdentifier='ss-financial-prod')
    return {'status': 'stopped', 'stopped_by': current_user['email']}

@router.post('/rds/start')
def start_rds_instance(current_user: dict = Depends(get_current_user)):
    # Any authenticated user can restart stopped database
    result = rds_client.start_db_instance(DBInstanceIdentifier='ss-financial-prod')
    return {'status': 'starting', 'started_by': current_user['email']}

@router.get('/rds/status')
def get_rds_status(current_user: dict = Depends(get_current_user)):
    # Any authenticated user can check status
    response = rds_client.describe_db_instances(DBInstanceIdentifier='ss-financial-prod')
    return {'status': response['DBInstances'][0]['DBInstanceStatus']}
```

**Example 4: User Management Endpoints (Admin Only)**
```python
@router.post('/auth/invite')
def create_user_invite(request: InviteRequest, current_user: dict = Depends(require_admin)):
    # Only admins can create user invitations
    return create_invitation(current_user['user_id'], request.email, request.role)

@router.get('/auth/users')
def list_users(current_user: dict = Depends(require_admin)):
    # Only admins can list all users
    response = dynamodb.scan(TableName='auth-users')
    return {'users': response['Items']}

@router.patch('/auth/users/{user_id}')
def update_user(user_id: str, updates: UserUpdate, current_user: dict = Depends(require_admin)):
    # Only admins can change user roles or status
    dynamodb.update_item(
        TableName='auth-users',
        Key={'user_id': {'S': user_id}},
        UpdateExpression='SET role = :role, is_active = :active',
        ExpressionAttributeValues={
            ':role': {'S': updates.role},
            ':active': {'BOOL': updates.is_active}
        }
    )
    return {'updated': True}
```

**Example 5: Frontend Role-Based UI**
```tsx
import { useAuth } from './hooks/useAuth';

export function AdminPanel() {
  const { user } = useAuth();

  return (
    <div>
      {user.role === 'admin' && (
        <div>
          <h2>Admin Controls</h2>
          <button onClick={stopRDS}>Stop Database</button>
          <button onClick={createUser}>Invite User</button>
        </div>
      )}

      {['admin', 'user'].includes(user.role) && (
        <button onClick={startRDS}>Start Database</button>
      )}

      <StatusDisplay /> {/* All authenticated users */}
    </div>
  );
}
```

---

## Key Concepts

- **Role:** A named set of permissions (admin, user, viewer)
- **Permission:** A specific action (view_data, manage_rds, create_users)
- **Principal:** The entity performing action (the authenticated user)
- **Resource:** What is being accessed (RDS instance, user records, analytics data)
- **Role Assignment:** Associating a user with a role (stored in DynamoDB `role` field)

---

## Alternatives We Considered

- **Attribute-Based Access Control (ABAC):** More flexible but complex; overkill for 3 roles
- **Access Control Lists (ACLs):** Per-resource permissions; harder to manage at scale
- **Permission-Based (no roles):** Assign permissions directly to users; tedious to maintain
- **Claims-Based (OAuth):** External identity provider defines claims; less control

---

## Getting Started

1. **Add role field to user schema:**
   ```python
   # Already in DynamoDB auth-users table
   # role: 'admin' | 'user' | 'viewer'
   ```

2. **Include role in JWT payload:**
   ```python
   payload = {
       'user_id': user['user_id'],
       'email': user['email'],
       'role': user['role'],  # Include role
       'exp': datetime.utcnow() + timedelta(days=7)
   }
   ```

3. **Create role middleware:**
   ```python
   def require_admin(current_user: dict = Depends(get_current_user)):
       if current_user['role'] != 'admin':
           raise HTTPException(status_code=403, detail='Admin required')
       return current_user
   ```

4. **Protect endpoints:**
   ```python
   @app.post('/admin/action')
   def admin_action(current_user: dict = Depends(require_admin)):
       # Only admins can call this
       pass
   ```

---

## Common Patterns & Best Practices

1. **Cache role in JWT** - Avoid database lookup on every request; role embedded in token
2. **Fail closed** - Default to denying access if role check fails or is missing
3. **Audit role changes** - Log when admins update user roles for security tracking
4. **Principle of least privilege** - Start users with 'viewer' role; promote as needed
5. **Role hierarchy** - Admin inherits all user/viewer permissions (implicit in code)

---

## Troubleshooting

**Issue 1:** User has admin role in DynamoDB but gets 403 errors
**Solution:** JWT was issued before role change. User must log out and back in to get new token with updated role.

**Issue 2:** Frontend shows admin buttons but API returns 403
**Solution:** Frontend checks are for UX only; backend must also verify role. Ensure both are consistent.

**Issue 3:** Can't change own role to test permissions
**Solution:** Create a second admin user or add temporary role switching for development (remove in production).

---

## Learning Resources

**Essential:**
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [NIST RBAC Model](https://csrc.nist.gov/projects/role-based-access-control)

**Recommended:**
- [FastAPI Security Dependencies](https://fastapi.tiangolo.com/tutorial/security/)
- [RBAC vs ABAC Comparison](https://www.cloudflare.com/learning/access-management/role-based-access-control-rbac/)

**Community:**
- [r/netsec Access Control Discussions](https://www.reddit.com/r/netsec/)

---

**Related Technologies:**
- [Custom JWT Implementation](custom-jwt-implementation.md) - Role stored in JWT claims
- [AWS DynamoDB](aws-dynamodb.md) - User role storage
- [FastAPI](fastapi.md) - Dependency injection for role checking
- [Invite-Only Registration](invite-only-registration.md) - Admin assigns roles during invitation
