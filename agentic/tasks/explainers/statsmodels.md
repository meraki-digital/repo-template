# statsmodels

**Category:** AI  
**Official Docs:** [https://www.statsmodels.org/](https://www.statsmodels.org/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

statsmodels is a comprehensive Python library for statistical modeling and econometrics that provides classes and functions for estimating and testing statistical models. It includes tools for regression analysis, time series analysis, and statistical tests, making it a go-to library for traditional statistical methods. The library is particularly strong in classical statistical methods and provides a statsmodels.formula.api for R-style formula specification.

Think of statsmodels as a statistical toolkit that brings the power of R's statistical capabilities to Python. It's perfect for rigorous statistical analysis where you need to understand not just "what" but "why" and "how confident" you are about your findings.

---

## Why We're Using It In This Project

statsmodels provides rigorous statistical analysis for our financial forecasting needs:

- **ARIMA/SARIMA models**: Industry-standard time series forecasting methods
- **Econometric models**: Proper statistical modeling for financial data
- **Hypothesis testing**: Statistical validation of financial relationships
- **Regression analysis**: Understanding drivers of financial performance
- **Diagnostic tools**: Comprehensive model validation and checking
- **Time series decomposition**: Breaking down trends, seasonality, and residuals
- **Confidence intervals**: Proper uncertainty quantification for financial forecasts
- **Integration with pandas**: Works seamlessly with our data processing pipeline

---

## How We'll Use It

statsmodels will provide statistical modeling for financial analysis:

**Example 1: ARIMA forecasting**
```python
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

def arima_forecast(revenue_data: pd.Series, forecast_periods: int = 12):
    # Check stationarity
    result = adfuller(revenue_data)
    if result[1] > 0.05:
        # Difference if not stationary
        revenue_data = revenue_data.diff().dropna()
    
    # Fit ARIMA model (p=1, d=1, q=1)
    model = ARIMA(revenue_data, order=(1, 1, 1))
    model_fit = model.fit()
    
    # Generate forecast
    forecast = model_fit.forecast(steps=forecast_periods)
    
    # Get confidence intervals
    forecast_obj = model_fit.get_forecast(steps=forecast_periods)
    conf_int = forecast_obj.conf_int()
    
    return {
        'forecast': forecast,
        'confidence_lower': conf_int.iloc[:, 0],
        'confidence_upper': conf_int.iloc[:, 1],
        'model_summary': model_fit.summary()
    }
```

**Example 2: Seasonal decomposition**
```python
from statsmodels.tsa.seasonal import seasonal_decompose
import matplotlib.pyplot as plt

def analyze_seasonality(financial_data: pd.Series):
    # Decompose time series
    decomposition = seasonal_decompose(
        financial_data, 
        model='additive',  # or 'multiplicative'
        period=12  # Monthly seasonality
    )
    
    # Extract components
    trend = decomposition.trend
    seasonal = decomposition.seasonal
    residual = decomposition.resid
    
    return {
        'trend': trend,
        'seasonal': seasonal,
        'residual': residual,
        'original': financial_data
    }

# Use for financial planning
seasonal_analysis = analyze_seasonality(monthly_revenue)
# Identify seasonal patterns for budgeting
```

**Example 3: Regression analysis**
```python
import statsmodels.formula.api as smf

def analyze_revenue_drivers(revenue_data: pd.DataFrame):
    # Multiple regression: Revenue ~ Marketing + Season + Competition
    model = smf.ols(
        'revenue ~ marketing_spend + season + competitor_price',
        data=revenue_data
    )
    
    results = model.fit()
    
    return {
        'coefficients': results.params,
        'p_values': results.pvalues,
        'r_squared': results.rsquared,
        'f_statistic': results.fvalue,
        'summary': results.summary()
    }

# Business insights
drivers = analyze_revenue_drivers(sales_data)
# Which factors most impact revenue?
```

---

## Key Concepts

- **ARIMA**: AutoRegressive Integrated Moving Average for time series
- **Stationarity**: Time series property for reliable forecasting
- **Seasonal decomposition**: Breaking down series into trend, seasonal, residual
- **Hypothesis testing**: Statistical significance of relationships
- **Regression diagnostics**: Checking model assumptions and fit
- **Confidence intervals**: Uncertainty quantification

---

## Alternatives We Considered

- **Prophet**: Easier to use but less statistically rigorous
- **scikit-learn**: General ML but less specialized for time series
- **R statistical packages**: Not integrated with our Python stack
- **Excel analysis**: Manual and not reproducible

---

## Getting Started

1. **Install statsmodels**: `pip install statsmodels`
2. **Import modules**: `import statsmodels.api as sm`
3. **Prepare data**: Ensure proper time series format
4. **Choose model**: ARIMA, regression, etc.
5. **Fit and validate**: Check model diagnostics

---

## Common Patterns & Best Practices

1. **Check stationarity**: Use Augmented Dickey-Fuller test
2. **Model selection**: Use AIC/BIC for comparing models
3. **Residual analysis**: Check for patterns in model errors
4. **Cross-validation**: Validate model performance
5. **Interpret results**: Focus on economic significance, not just statistical

---

## Troubleshooting

**Issue 1:** Model not converging  
**Solution:** Simplify model or transform data

**Issue 2:** Poor forecast accuracy  
**Solution:** Check model assumptions and try different specifications

---

## Learning Resources

**Essential:**
- [statsmodels Documentation](https://www.statsmodels.org/)
- [statsmodels User Guide](https://www.statsmodels.org/stable/user-guide.html)

**Recommended:**
- [Econometric Modeling with statsmodels](https://realpython.com/statsmodels-python/)
- [Time Series Analysis Guide](https://www.statsmodels.org/stable/tsa.html)

**Community:**
- [statsmodels GitHub](https://github.com/statsmodels/statsmodels)
- [Cross Validated (Stack Exchange)](https://stats.stackexchange.com/)

---

**Related Technologies:**
- [pandas](pandas.md) - Data manipulation
- [numpy](numpy.md) - Numerical computing
- [Prophet](prophet.md) - Alternative forecasting
- [scikit-learn](scikit-learn.md) - Machine learning
