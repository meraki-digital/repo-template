# SQLAlchemy

**Category:** Backend / Database  
**Official Docs:** [https://www.sqlalchemy.org/](https://www.sqlalchemy.org/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

SQLAlchemy is the most powerful and flexible SQL toolkit and Object-Relational Mapping (ORM) library for Python. It acts as a bridge between your Python code and relational databases, allowing you to work with database records as if they were regular Python objects. Instead of writing raw SQL queries, you define Python classes that represent your database tables, and SQLAlchemy handles the translation.

Think of SQLAlchemy as a sophisticated translator that lets your Python code speak "database language" fluently. It can generate complex SQL queries, handle database connections, and manage relationships between different pieces of data automatically.

---

## Why We're Using It In This Project

SQLAlchemy provides the database abstraction layer our project needs for reliable, efficient data access:

- **Complex query generation**: Essential for our financial dashboard's multi-table aggregations and joins
- **Type safety**: Prevents SQL injection and ensures data integrity
- **Performance optimization**: Can optimize queries and supports connection pooling
- **PostgreSQL compatibility**: Works seamlessly with our pgvector extension for AI features
- **Migration support with Alembic**: Allows safe database schema changes during development
- **Async support**: Compatible with our FastAPI async architecture

---

## How We'll Use It

SQLAlchemy will handle all database interactions in our backend API and ETL pipelines:

**Example 1: Define database models**
```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Transaction(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True)
    amount = Column(Numeric(10, 2))
    date = Column(DateTime)
    account_code = Column(String)
```

**Example 2: Query financial data**
```python
def get_monthly_revenue(db: Session, year: int, month: int):
    return db.query(Transaction).filter(
        Transaction.date.between(f'{year}-{month}-01', f'{year}-{month}-31'),
        Transaction.account_code.like('4%')  # Revenue accounts
    ).with_entities(
        func.sum(Transaction.amount).label('total_revenue')
    ).scalar()
```

**Example 3: ETL data loading**
```python
def load_sage_transactions(db: Session, transactions: List[dict]):
    for tx_data in transactions:
        tx = Transaction(**tx_data)
        db.add(tx)
    db.commit()
```

---

## Key Concepts

- **Engine**: The database connection factory that manages connection pooling
- **Session**: The ORM's "unit of work" pattern for tracking changes to objects
- **Models**: Python classes that represent database tables and their relationships
- **Query API**: Fluent interface for building complex SQL queries
- **Migrations**: Schema changes managed through Alembic

---

## Alternatives We Considered

- **Django ORM**: Too tightly coupled with Django framework, less flexible for our needs
- **Peewee**: Simpler but lacks the advanced querying features we need for financial data
- **Raw SQL**: Error-prone and harder to maintain for complex queries

---

## Getting Started

1. **Install SQLAlchemy**: `pip install sqlalchemy psycopg2-binary`
2. **Create database engine**:
   ```python
   from sqlalchemy import create_engine
   engine = create_engine('postgresql://user:pass@localhost/dbname')
   ```
3. **Define and create tables**:
   ```python
   Base.metadata.create_all(engine)
   ```

---

## Common Patterns & Best Practices

1. **Use session context managers**: Always wrap database operations in `with` blocks
2. **Avoid N+1 queries**: Use `joinedload` or `selectinload` for relationships
3. **Batch operations**: Use `bulk_insert_mappings` for large data loads
4. **Connection pooling**: Let SQLAlchemy manage connection reuse automatically
5. **Schema migrations**: Use Alembic for all database schema changes

---

## Troubleshooting

**Issue 1:** Session leaks causing connection pool exhaustion  
**Solution:** Always close sessions: `session.close()` or use context managers

**Issue 2:** Slow queries with large datasets  
**Solution:** Use `limit()` and pagination, optimize with database indexes

---

## Learning Resources

**Essential:**
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [SQLAlchemy ORM Tutorial](https://docs.sqlalchemy.org/en/20/orm/tutorial.html)

**Recommended:**
- [SQLAlchemy Best Practices](https://docs.sqlalchemy.org/en/20/faq/index.html)
- [Real Python SQLAlchemy Guide](https://realpython.com/python-sqlite-sqlalchemy/)

**Community:**
- [SQLAlchemy GitHub](https://github.com/sqlalchemy/sqlalchemy)
- [SQLAlchemy Mailing List](https://groups.google.com/g/sqlalchemy)

---

**Related Technologies:**
- [PostgreSQL](https://www.postgresql.org/docs/) - Database engine
- [Alembic](alembic.md) - Database migration tool
- [pgvector](pgvector.md) - Vector extensions
- [Pydantic v2](pydantic-v2.md) - Data validation
