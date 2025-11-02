# pgvector

**Category:** AI  
**Official Docs:** [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

pgvector is a PostgreSQL extension that adds support for vector similarity search, enabling efficient storage and querying of high-dimensional vector embeddings. It introduces a new VECTOR data type and specialized operators for calculating similarity between vectors using metrics like cosine similarity, Euclidean distance, and inner product. This makes PostgreSQL suitable for AI-powered applications that need to find semantically similar content.

Think of pgvector as giving PostgreSQL "AI superpowers." While traditional databases excel at exact matches and range queries, pgvector enables "find things that are similar to this" queries - perfect for semantic search, recommendation systems, and AI-driven features.

---

## Why We're Using It In This Project

pgvector enables AI-powered search in our PostgreSQL warehouse:

- **Native PostgreSQL integration**: No separate vector database to manage
- **Cost-effective**: Avoids expensive specialized vector databases
- **ACID compliance**: Vector operations participate in database transactions
- **Rich indexing**: IVFFlat and HNSW indexes for fast similarity search
- **Multiple distance metrics**: Cosine, Euclidean, and inner product similarity
- **SQL integration**: Use familiar SQL syntax for vector operations
- **Scalability**: Handles millions of vectors efficiently
- **Open source**: No vendor lock-in for vector operations

---

## How We'll Use It

pgvector will power our semantic search and AI features:

**Example 1: Enable pgvector extension**
```sql
-- Install extension (requires superuser)
CREATE EXTENSION vector;

-- Grant usage to application user
GRANT USAGE ON SCHEMA public TO your_app_user;
```

**Example 2: Create vector table**
```sql
-- Table for document embeddings
CREATE TABLE document_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536),  -- OpenAI ada-002 dimension
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table for user query embeddings
CREATE TABLE query_cache (
    id SERIAL PRIMARY KEY,
    query_text TEXT,
    embedding VECTOR(1536),
    response TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Example 3: Basic similarity search**
```sql
-- Find similar documents to a query embedding
SELECT 
    content,
    metadata,
    1 - (embedding <=> $1::VECTOR) as cosine_similarity
FROM document_embeddings
ORDER BY embedding <=> $1::VECTOR  -- Cosine distance
LIMIT 10;
```

**Example 4: Advanced search with filtering**
```python
def semantic_search_with_filters(query_embedding, category=None, min_score=0.7):
    sql = """
        SELECT 
            content,
            metadata,
            1 - (embedding <=> %s::VECTOR) as similarity
        FROM document_embeddings
        WHERE 1 - (embedding <=> %s::VECTOR) > %s
    """
    params = [query_embedding, query_embedding, min_score]
    
    if category:
        sql += " AND metadata->>'category' = %s"
        params.append(category)
    
    sql += " ORDER BY embedding <=> %s::VECTOR LIMIT 20"
    params.append(query_embedding)
    
    return db.execute(sql, params)
```

**Example 5: Indexing for performance**
```sql
-- Create IVFFlat index for approximate nearest neighbor search
CREATE INDEX ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create HNSW index for more accurate search (requires pgvector >= 0.5.0)
CREATE INDEX ON document_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

**Example 6: Aggregation queries**
```sql
-- Find average embedding for a category
SELECT 
    metadata->>'category' as category,
    AVG(embedding) as avg_embedding
FROM document_embeddings
GROUP BY metadata->>'category';

-- Find most similar categories
SELECT 
    a.category as category_a,
    b.category as category_b,
    1 - (a.avg_embedding <=> b.avg_embedding) as similarity
FROM category_embeddings a
CROSS JOIN category_embeddings b
WHERE a.category < b.category
ORDER BY similarity DESC;
```

---

## Key Concepts

- **VECTOR type**: Stores high-dimensional floating-point vectors
- **Distance operators**: `<=>` (cosine), `<->` (Euclidean), `<#>` (inner product)
- **Indexing**: IVFFlat and HNSW for fast approximate search
- **Similarity metrics**: Different ways to measure vector closeness
- **Dimensionality**: Vector size (1536 for ada-002 embeddings)

---

## Alternatives We Considered

- **Pinecone**: Specialized vector database, adds complexity and cost
- **Weaviate**: Requires separate infrastructure and maintenance
- **Milvus**: Similar to pgvector but separate system
- **FAISS**: In-memory only, not persistent like pgvector

---

## Getting Started

1. **Install pgvector**: `CREATE EXTENSION vector;`
2. **Create vector columns**: `VECTOR(1536)` for ada-002
3. **Insert embeddings**: Use standard INSERT statements
4. **Query similarity**: Use distance operators in WHERE/ORDER BY
5. **Add indexes**: Create IVFFlat or HNSW indexes for performance

---

## Common Patterns & Best Practices

1. **Choose right dimensions**: Match your embedding model (1536 for ada-002)
2. **Index for performance**: Use IVFFlat for large datasets
3. **Batch operations**: Insert/embed multiple items at once
4. **Similarity thresholds**: Filter results by relevance scores
5. **Metadata storage**: Store context information in JSONB columns

---

## Troubleshooting

**Issue 1:** Slow queries on large datasets  
**Solution:** Add appropriate indexes and consider approximate search

**Issue 2:** Memory usage during indexing  
**Solution:** Use IVFFlat with reasonable list counts

---

## Learning Resources

**Essential:**
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [pgvector README](https://github.com/pgvector/pgvector#pgvector)

**Recommended:**
- [Vector Similarity Search](https://github.com/pgvector/pgvector#vector-similarity-search)
- [pgvector Examples](https://github.com/pgvector/pgvector/tree/master/examples)

**Community:**
- [PostgreSQL Mailing List](https://www.postgresql.org/list/)
- [pgvector Discussions](https://github.com/pgvector/pgvector/discussions)

---

**Related Technologies:**
- [PostgreSQL](https://www.postgresql.org/docs/) - Host database
- [OpenAI text-embedding-ada-002](openai-text-embedding-ada-002.md) - Embedding generation
