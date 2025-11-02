# tiktoken

**Category:** AI  
**Official Docs:** [https://github.com/openai/tiktoken](https://github.com/openai/tiktoken)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

tiktoken is OpenAI's fast tokenization library that breaks text into tokens - the basic units that language models like GPT-4 understand and process. Tokens are chunks of text (often subwords, single characters, or punctuation) that the model uses as building blocks. tiktoken provides accurate token counting and encoding/decoding, which is essential for managing API costs, staying within token limits, and optimizing prompts.

Think of tiktoken as a precise measuring tool for text. Just as a kitchen scale tells you exactly how much flour you have, tiktoken tells you exactly how many tokens your text contains - crucial information when each token costs money and there are strict limits on how many you can use.

---

## Why We're Using It In This Project

tiktoken ensures we manage OpenAI API costs and limits effectively:

- **Accurate cost estimation**: Know exactly how much API calls will cost
- **Prevent token limit errors**: Avoid failed requests due to exceeding limits
- **Optimize prompts**: Craft prompts that fit within token budgets
- **Batch processing**: Group requests efficiently without exceeding limits
- **Cost monitoring**: Track and control AI feature expenses
- **Performance optimization**: Avoid over-paying for unnecessary tokens
- **Error prevention**: Validate requests before sending to OpenAI
- **Resource planning**: Budget for AI features based on expected usage

---

## How We'll Use It

tiktoken will manage our OpenAI API usage and costs:

**Example 1: Count tokens for cost estimation**
```python
import tiktoken

def count_tokens(text: str, model: str = "gpt-4") -> int:
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)
    return len(tokens)

# Check if query will fit in context
user_question = "What were our expenses by category last quarter?"
token_count = count_tokens(user_question)
max_tokens = 8192  # GPT-4 context limit

if token_count > max_tokens:
    raise ValueError(f"Question too long: {token_count} tokens")
```

**Example 2: Estimate API costs**
```python
def estimate_cost(prompt: str, response_max: int, model: str = "gpt-4") -> float:
    encoding = tiktoken.get_encoding("cl100k_base")  # GPT-4 encoding
    
    prompt_tokens = len(encoding.encode(prompt))
    total_tokens = prompt_tokens + response_max
    
    # Pricing (as of 2024, subject to change)
    if model == "gpt-4":
        cost_per_1k = 0.03  # $0.03 per 1K tokens
    else:  # gpt-3.5-turbo
        cost_per_1k = 0.002
    
    return (total_tokens / 1000) * cost_per_1k

# Budget check before expensive operations
estimated_cost = estimate_cost(
    prompt="Analyze these financial transactions...",
    response_max=1000,
    model="gpt-4"
)

if estimated_cost > 0.10:  # $0.10 limit
    logger.warning(f"Expensive query: ${estimated_cost:.3f}")
```

**Example 3: Smart text truncation**
```python
def truncate_to_token_limit(text: str, max_tokens: int, model: str = "gpt-4") -> str:
    encoding = tiktoken.encoding_for_model(model)
    
    tokens = encoding.encode(text)
    if len(tokens) <= max_tokens:
        return text
    
    # Truncate to fit
    truncated_tokens = tokens[:max_tokens-10]  # Leave room for "..."
    truncated_text = encoding.decode(truncated_tokens)
    
    return truncated_text + "..."

# Ensure schema descriptions fit in context
schema_description = get_database_schema()
truncated_schema = truncate_to_token_limit(schema_description, 2000)
```

**Example 4: Batch processing optimization**
```python
def batch_requests(questions: List[str], max_batch_tokens: int = 7000):
    """Group questions into batches that fit token limits"""
    encoding = tiktoken.get_encoding("cl100k_base")
    batches = []
    current_batch = []
    current_tokens = 0
    
    for question in questions:
        question_tokens = len(encoding.encode(question))
        
        if current_tokens + question_tokens > max_batch_tokens:
            if current_batch:  # Save current batch
                batches.append(current_batch)
                current_batch = []
                current_tokens = 0
        
        current_batch.append(question)
        current_tokens += question_tokens
    
    if current_batch:
        batches.append(current_batch)
    
    return batches
```

**Example 5: Monitoring and alerting**
```python
class TokenTracker:
    def __init__(self):
        self.daily_tokens = 0
        self.monthly_cost = 0.0
    
    def track_usage(self, prompt: str, response: str, model: str):
        encoding = tiktoken.encoding_for_model(model)
        prompt_tokens = len(encoding.encode(prompt))
        response_tokens = len(encoding.encode(response))
        total_tokens = prompt_tokens + response_tokens
        
        self.daily_tokens += total_tokens
        
        # Estimate cost
        cost = estimate_token_cost(total_tokens, model)
        self.monthly_cost += cost
        
        # Alert on high usage
        if self.daily_tokens > 100000:  # 100K tokens
            alert_team("High token usage today")
        
        if self.monthly_cost > 50.0:  # $50
            alert_team("Monthly budget exceeded")

# Use in API endpoints
tracker = TokenTracker()

@app.post("/api/ask")
def ask_ai(question: str):
    # ... generate response ...
    
    tracker.track_usage(question, response, "gpt-4")
    return {"answer": response}
```

---

## Key Concepts

- **Tokens**: Basic units of text that models process
- **Encoding**: How text is converted to tokens (model-specific)
- **Token Limits**: Maximum tokens per request (context window)
- **Cost Calculation**: Tokens determine API pricing
- **Context Management**: Fitting prompts within limits

---

## Alternatives We Considered

- **Character counting**: Inaccurate for cost and limit estimation
- **Word counting**: Still not precise for tokenization
- **OpenAI API errors**: Reactive rather than preventive
- **Fixed limits**: Doesn't account for variable token usage

---

## Getting Started

1. **Install tiktoken**: `pip install tiktoken`
2. **Get encoding**: `encoding = tiktoken.encoding_for_model("gpt-4")`
3. **Encode text**: `tokens = encoding.encode("Hello world")`
4. **Count tokens**: `len(tokens)`
5. **Monitor usage**: Integrate into API calls

---

## Common Patterns & Best Practices

1. **Pre-flight checks**: Count tokens before API calls
2. **Cost estimation**: Always calculate expected costs
3. **Smart truncation**: Preserve important content when truncating
4. **Batch optimization**: Group similar requests efficiently
5. **Usage monitoring**: Track and alert on token consumption

---

## Troubleshooting

**Issue 1:** Token count mismatch with OpenAI  
**Solution:** Use the exact encoding for your model

**Issue 2:** Unexpected costs  
**Solution:** Always count tokens before sending requests

---

## Learning Resources

**Essential:**
- [tiktoken GitHub](https://github.com/openai/tiktoken)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer)

**Recommended:**
- [Token Estimation Guide](https://platform.openai.com/docs/guides/chat/introduction)
- [Understanding Tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)

**Community:**
- [OpenAI Developer Forum](https://community.openai.com/)
- [Python AI Discussions](https://discuss.python.org/)

---

**Related Technologies:**
- [OpenAI GPT-4 API](openai-gpt-4-api.md) - API that consumes tokens
- [OpenAI text-embedding-ada-002](openai-text-embedding-ada-002.md) - Also uses tokens
