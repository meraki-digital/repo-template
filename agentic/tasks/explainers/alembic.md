# Alembic

**Category:** Backend / Database  
**Official Docs:** [https://alembic.sqlalchemy.org/](https://alembic.sqlalchemy.org/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Alembic is a lightweight database migration tool for SQLAlchemy that helps you manage and version your database schema changes over time. It works like Git for your database structure - you can create, apply, and rollback changes to your database tables, indexes, and constraints in a safe, version-controlled way.

Think of Alembic as a careful librarian who keeps track of every change made to your database structure. When you need to add a new column, create an index, or modify a table, Alembic generates the necessary SQL and ensures it's applied consistently across all environments.

---

## Why We're Using It In This Project

Alembic provides the database evolution capabilities essential for our iterative development process:

- **Safe schema changes**: Prevents data loss during database structure modifications
- **Version control for schema**: Tracks database changes alongside code changes
- **Multi-environment support**: Ensures dev, staging, and production databases stay in sync
- **Rollback capability**: Can undo changes if migrations cause issues
- **SQLAlchemy integration**: Works seamlessly with our ORM layer
- **Complex migration support**: Handles our evolving financial data models (transactions, jobs, accounts)

---

## How We'll Use It

Alembic will manage all database schema changes throughout our project lifecycle:

**Example 1: Initialize Alembic**
```bash
# Create alembic directory and config
alembic init alembic
```

**Example 2: Create a new migration**
```bash
# Auto-generate migration for model changes
alembic revision --autogenerate -m "add user authentication tables"
```

**Example 3: Apply migrations**
```bash
# Upgrade database to latest version
alembic upgrade head

# Upgrade to specific version
alembic upgrade +1
```

**Example 4: Migration file structure**
```python
# alembic/versions/123abc_add_user_table.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('users')
```

---

## Key Concepts

- **Revision**: A single migration file containing upgrade/downgrade operations
- **Head**: The latest revision in the migration chain
- **Autogeneration**: Automatic detection of model changes to create migrations
- **Branching**: Support for parallel development branches with merge support
- **Environment**: Configuration for different database connections (dev/staging/prod)

---

## Alternatives We Considered

- **Django Migrations**: Too framework-specific, we chose FastAPI over Django
- **Manual SQL scripts**: Error-prone and hard to track across environments
- **Flyway**: Java-based, not Python-native like Alembic

---

## Getting Started

1. **Install Alembic**: `pip install alembic`
2. **Initialize in project**: `alembic init alembic`
3. **Configure database URL** in `alembic.ini`
4. **Create first migration**: `alembic revision -m "initial schema"`

---

## Common Patterns & Best Practices

1. **Use descriptive revision messages**: `alembic revision -m "add financial_year to transactions"`
2. **Test migrations**: Always run on a copy of production data first
3. **Keep migrations small**: One logical change per revision
4. **Use --autogenerate cautiously**: Review auto-generated migrations before applying
5. **Version control migrations**: Commit migration files with your code

---

## Troubleshooting

**Issue 1:** Migration fails with data type conflicts  
**Solution:** Manually edit the migration to handle data conversion safely

**Issue 2:** Multiple developers creating conflicting migrations  
**Solution:** Pull latest changes and rebase before creating new migrations

---

## Learning Resources

**Essential:**
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)

**Recommended:**
- [SQLAlchemy + Alembic Guide](https://docs.sqlalchemy.org/en/20/changelog/migration_20.html)
- [Alembic Best Practices](https://alembic.sqlalchemy.org/en/latest/cookbook.html)

**Community:**
- [Alembic GitHub](https://github.com/sqlalchemy/alembic)
- [SQLAlchemy Mailing List](https://groups.google.com/g/sqlalchemy)

---

**Related Technologies:**
- [SQLAlchemy](sqlalchemy.md) - ORM that Alembic migrates
- [PostgreSQL](https://www.postgresql.org/docs/) - Target database
