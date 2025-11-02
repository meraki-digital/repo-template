# NumPy

**Category:** AI  
**Official Docs:** [https://numpy.org/](https://numpy.org/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

NumPy is the fundamental package for scientific computing in Python, providing support for large, multi-dimensional arrays and matrices, along with a collection of mathematical functions to operate on these arrays. It's the foundation upon which most other scientific Python libraries are built, including pandas, scikit-learn, and many deep learning frameworks. NumPy's core feature is the ndarray - a fast, memory-efficient array that supports vectorized operations.

Think of NumPy as Python's answer to MATLAB's matrix operations. It gives you the speed and efficiency needed for numerical computing while staying within the Python ecosystem.

---

## Why We're Using It In This Project

NumPy provides the numerical foundation for our financial computations and machine learning:

- **Efficient arrays**: Fast operations on large financial datasets
- **Vectorized operations**: Perform calculations on entire arrays without loops
- **Mathematical functions**: Statistical and financial calculations
- **Memory efficiency**: Handle large datasets without excessive memory usage
- **Integration**: Foundation for pandas, scikit-learn, and other ML libraries
- **Broadcasting**: Automatic array shape handling for complex calculations
- **Universal standard**: Used by all major Python data science libraries
- **Performance**: C-speed operations for numerical computing

---

## How We'll Use It

NumPy will handle numerical computations throughout our financial analysis pipeline:

**Example 1: Financial calculations**
```python
import numpy as np

def calculate_portfolio_returns(prices: np.ndarray, weights: np.ndarray) -> float:
    # Calculate daily returns
    returns = np.diff(prices, axis=0) / prices[:-1]
    
    # Calculate weighted portfolio returns
    portfolio_returns = np.sum(returns * weights, axis=1)
    
    # Calculate Sharpe ratio
    excess_returns = portfolio_returns - risk_free_rate
    sharpe_ratio = np.mean(excess_returns) / np.std(excess_returns)
    
    return sharpe_ratio

# Usage
prices = np.array([[100, 200], [105, 195], [102, 205]])  # [days, assets]
weights = np.array([0.6, 0.4])
sharpe = calculate_portfolio_returns(prices, weights)
```

**Example 2: Risk analysis**
```python
def calculate_var(returns: np.ndarray, confidence_level: float = 0.95) -> float:
    # Value at Risk calculation
    sorted_returns = np.sort(returns)
    index = int((1 - confidence_level) * len(sorted_returns))
    var = sorted_returns[index]
    return var

def calculate_correlation_matrix(assets_returns: np.ndarray) -> np.ndarray:
    # Calculate correlation between assets
    return np.corrcoef(assets_returns.T)

# Risk analysis
returns_data = np.random.normal(0.001, 0.02, (1000, 5))  # 1000 days, 5 assets
var_95 = calculate_var(returns_data[:, 0], 0.95)  # 95% VaR for first asset
correlation_matrix = calculate_correlation_matrix(returns_data)
```

**Example 3: Time series analysis**
```python
def moving_average(data: np.ndarray, window: int) -> np.ndarray:
    # Calculate moving average using convolution
    weights = np.ones(window) / window
    return np.convolve(data, weights, mode='valid')

def exponential_moving_average(data: np.ndarray, alpha: float) -> np.ndarray:
    # Calculate EMA
    ema = np.zeros_like(data)
    ema[0] = data[0]
    for i in range(1, len(data)):
        ema[i] = alpha * data[i] + (1 - alpha) * ema[i-1]
    return ema

# Technical analysis
prices = np.random.uniform(100, 200, 1000)
ma_20 = moving_average(prices, 20)
ema_12 = exponential_moving_average(prices, 2/(12+1))
```

**Example 4: Monte Carlo simulation**
```python
def monte_carlo_simulation(initial_investment: float, 
                          expected_return: float, 
                          volatility: float, 
                          years: int, 
                          simulations: int) -> np.ndarray:
    # Simulate multiple investment scenarios
    dt = 1/252  # Daily time steps
    
    # Generate random returns
    random_returns = np.random.normal(
        (expected_return - 0.5 * volatility**2) * dt,
        volatility * np.sqrt(dt),
        (years * 252, simulations)
    )
    
    # Calculate cumulative returns
    cumulative_returns = np.cumprod(1 + random_returns, axis=0)
    
    # Calculate final portfolio values
    final_values = initial_investment * cumulative_returns[-1, :]
    
    return final_values

# Investment simulation
final_portfolios = monte_carlo_simulation(
    initial_investment=10000,
    expected_return=0.08,
    volatility=0.15,
    years=10,
    simulations=10000
)

print(f"Expected value: ${np.mean(final_portfolios):.2f}")
print(f"95% confidence: ${np.percentile(final_portfolios, 5):.2f} - ${np.percentile(final_portfolios, 95):.2f}")
```

---

## Key Concepts

- **ndarray**: N-dimensional array object with vectorized operations
- **Broadcasting**: Automatic array shape compatibility for operations
- **Universal functions (ufuncs)**: Element-wise operations on arrays
- **Indexing and slicing**: Advanced array access patterns
- **Memory layout**: Row-major (C-style) vs column-major ordering
- **Data types**: Efficient numerical types (float64, int32, etc.)

---

## Alternatives We Considered

- **Python lists**: Too slow for numerical computing
- **Python loops**: Inefficient for array operations
- **MATLAB**: Not integrated with our Python stack
- **R**: Different language ecosystem

---

## Getting Started

1. **Install NumPy**: `pip install numpy` (usually comes with pandas/scikit-learn)
2. **Import**: `import numpy as np`
3. **Create arrays**: `arr = np.array([1, 2, 3])`
4. **Perform operations**: `result = np.sum(arr)`
5. **Use in calculations**: Combine with other NumPy functions

---

## Common Patterns & Best Practices

1. **Vectorize operations**: Avoid Python loops, use array operations
2. **Choose appropriate dtypes**: Use smallest sufficient numerical type
3. **Pre-allocate arrays**: Avoid growing arrays in loops
4. **Use broadcasting**: Leverage automatic shape compatibility
5. **Profile performance**: Use NumPy's efficient implementations

---

## Troubleshooting

**Issue 1:** Memory errors with large arrays  
**Solution:** Use appropriate dtypes and consider chunked processing

**Issue 2:** Slow performance  
**Solution:** Replace Python loops with vectorized NumPy operations

---

## Learning Resources

**Essential:**
- [NumPy Documentation](https://numpy.org/doc/)
- [NumPy User Guide](https://numpy.org/doc/stable/user-guide.html)

**Recommended:**
- [Python for Data Analysis](https://wesmckinney.com/book/) - NumPy chapters
- [Scientific Python Lectures](https://scipy-lectures.org/)

**Community:**
- [NumPy GitHub](https://github.com/numpy/numpy)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/numpy)

---

**Related Technologies:**
- [pandas](pandas.md) - Data manipulation built on NumPy
- [scikit-learn](scikit-learn.md) - ML library using NumPy arrays
- [matplotlib](https://matplotlib.org/) - Plotting with NumPy arrays
