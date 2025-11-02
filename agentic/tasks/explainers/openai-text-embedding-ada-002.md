# OpenAI text-embedding-ada-002

**Category:** AI  
**Official Docs:** [https://platform.openai.com/docs/guides/embeddings](https://platform.openai.com/docs/guides/embeddings)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

OpenAI's text-embedding-ada-002 is a powerful language model that converts text into high-dimensional vector representations called embeddings. These embeddings capture the semantic meaning of text, allowing for mathematical comparison of text similarity. When stored in a vector database like pgvector, embeddings enable semantic search - finding relevant content based on meaning rather than exact keyword matches.

Think of embeddings as converting words and sentences into "meaning coordinates" in a multi-dimensional space. Similar meanings cluster together, so "profit and loss" and "income statement" would be close in this space, enabling intelligent search and recommendations.

---

## Why We're Using It In This Project

text-embedding-ada-002 powers our semantic search and AI features:

- **Semantic search**: Find financial data by meaning, not just keywords
- **Document similarity**: Group related transactions and reports
- **Question understanding**: Better context for AI query generation
- **Recommendation engine**: Suggest relevant financial insights
- **Dimensionality reduction**: 1536-dimensional vectors balance detail and performance
- **Proven reliability**: Battle-tested embedding model from OpenAI
- **Cost-effective**: Low-cost API for high-quality embeddings
- **pgvector integration**: Native support for vector operations in PostgreSQL

---

## How We'll Use It

Embeddings will enhance our AI-driven financial analysis:

**Example 1: Generate embeddings for text**
```python
import openai

def get_embedding(text: str) -> List[float]:
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response['data'][0]['embedding']

# Generate embedding for a financial query
query_embedding = get_embedding("What were our biggest expenses last quarter?")
```

**Example 2: Store embeddings in pgvector**
```sql
-- Create table with vector column
CREATE TABLE document_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536),
    metadata JSONB
);

-- Insert embedding
INSERT INTO document_embeddings (content, embedding, metadata)
VALUES (
    'Q3 expenses totaled $2.3M with labor costs at $1.1M',
    '[0.123, 0.456, ...]'::VECTOR,
    '{"quarter": "Q3", "year": 2024}'
);
```

**Example 3: Semantic search**
```python
def semantic_search(query: str, limit: int = 5) -> List[dict]:
    query_embedding = get_embedding(query)
    
    # Find similar documents using cosine similarity
    results = db.execute("""
        SELECT content, metadata, 
               1 - (embedding <=> %s::VECTOR) as similarity
        FROM document_embeddings
        ORDER BY embedding <=> %s::VECTOR
        LIMIT %s
    """, (query_embedding, query_embedding, limit))
    
    return [{"content": row[0], "metadata": row[1], "score": row[2]} 
            for row in results]
```

**Example 4: Batch embedding generation**
```python
def embed_financial_documents(documents: List[str]) -> List[List[float]]:
    """Generate embeddings for multiple documents efficiently"""
    
    # OpenAI allows batch processing
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=documents,
        request_timeout=60
    )
    
    return [data['embedding'] for data in response['data']]

# Embed all transaction descriptions
transaction_texts = [tx['description'] for tx in transactions]
embeddings = embed_financial_documents(transaction_texts)
```

**Example 5: Similarity-based recommendations**
```python
def find_similar_transactions(transaction_id: int) -> List[dict]:
    """Find transactions with similar descriptions"""
    
    # Get embedding for target transaction
    target_embedding = db.execute("""
        SELECT embedding FROM document_embeddings 
        WHERE metadata->>'transaction_id' = %s
    """, (str(transaction_id),)).fetchone()[0]
    
    # Find most similar transactions
    similar = db.execute("""
        SELECT metadata, 1 - (embedding <=> %s::VECTOR) as similarity
        FROM document_embeddings 
        WHERE metadata->>'transaction_id' != %s
        ORDER BY embedding <=> %s::VECTOR
        LIMIT 10
    """, (target_embedding, str(transaction_id), target_embedding))
    
    return [{"transaction": row[0], "similarity": row[1]} for row in similar]
```

---

## Key Concepts

- **Embeddings**: Dense vector representations of text meaning
- **Cosine Similarity**: Measure of semantic similarity (0-1 scale)
- **Dimensionality**: 1536 dimensions for ada-002 model
- **Vector Databases**: Specialized storage for high-dimensional data
- **Semantic Search**: Finding content by meaning, not keywords

---

## Alternatives We Considered

- **Sentence Transformers**: Good but OpenAI embeddings are more reliable
- **Custom embedding models**: Too expensive to train and maintain
- **TF-IDF**: Traditional approach lacks semantic understanding
- **Keyword search**: Can't handle synonyms or conceptual similarity

---

## Getting Started

1. **Install OpenAI SDK**: `pip install openai`
2. **Enable pgvector**: `CREATE EXTENSION vector;`
3. **Create embedding table**: See SQL examples above
4. **Generate embeddings**: Use the API calls above
5. **Implement search**: Use cosine similarity queries

---

## Common Patterns & Best Practices

1. **Batch processing**: Generate embeddings for multiple texts at once
2. **Index optimization**: Use proper indexing for vector search performance
3. **Similarity thresholds**: Filter results by relevance scores
4. **Metadata storage**: Store additional context with embeddings
5. **Update strategy**: Re-embed content when it changes significantly

---

## Troubleshooting

**Issue 1:** Slow vector searches  
**Solution:** Add proper indexes: `CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops);`

**Issue 2:** Poor search results  
**Solution:** Experiment with similarity thresholds and preprocessing

---

## Learning Resources

**Essential:**
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

**Recommended:**
- [Vector Databases Overview](https://www.pinecone.io/learn/vector-database/)
- [Semantic Search Tutorial](https://platform.openai.com/docs/tutorials/search)

**Community:**
- [OpenAI Developer Forum](https://community.openai.com/)
- [pgvector Discussions](https://github.com/pgvector/pgvector/discussions)

---

**Related Technologies:**
- [pgvector](pgvector.md) - PostgreSQL vector extension
- [OpenAI GPT-4 API](openai-gpt-4-api.md) - Complementary language model
- [tiktoken](tiktoken.md) - Token counting for API optimization
