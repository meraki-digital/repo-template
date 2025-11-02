# Prophet

**Category:** AI  
**Official Docs:** [https://facebook.github.io/prophet/](https://facebook.github.io/prophet/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Prophet is an open-source forecasting tool developed by Meta (formerly Facebook) that makes it easy to produce high-quality forecasts for time series data. It's designed to handle business forecasting scenarios where you have daily observations with weekly and yearly seasonality, plus holiday effects. Unlike complex statistical models, Prophet is user-friendly and automatically handles many of the common challenges in forecasting.

Think of Prophet as a smart forecasting assistant that can look at your historical data and predict future values, accounting for trends, seasonality, and special events - all with minimal configuration required from you.

---

## Why We're Using It In This Project

Prophet provides accessible forecasting capabilities for our financial intelligence dashboard:

- **Business-friendly forecasting**: Easy to use for non-experts who need to forecast financial metrics
- **Handles seasonality**: Automatically detects and accounts for weekly, monthly, and yearly patterns in financial data
- **Holiday awareness**: Can incorporate known events and holidays that affect financial performance
- **Uncertainty quantification**: Provides prediction intervals to show forecast confidence
- **Scalable**: Can handle large datasets and multiple forecasting scenarios
- **Integration ready**: Works well with our Python-based data pipeline and dashboard
- **Open source**: No licensing costs and active community support

---

## How We'll Use It

Prophet will generate financial forecasts for our dashboard:

**Example 1: Revenue forecasting**
```python
from prophet import Prophet
import pandas as pd

def forecast_revenue(historical_data: pd.DataFrame) -> pd.DataFrame:
    # Prepare data for Prophet
    df = historical_data[['date', 'revenue']].rename(
        columns={'date': 'ds', 'revenue': 'y'}
    )
    
    # Create and fit model
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False
    )
    
    # Add holiday effects for financial periods
    model.add_country_holidays(country_name='US')
    
    model.fit(df)
    
    # Generate future dates
    future = model.make_future_dataframe(periods=90)  # 90 days forecast
    
    # Make predictions
    forecast = model.predict(future)
    
    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
```

**Example 2: Expense trend analysis**
```python
def analyze_expense_trends(expense_data: pd.DataFrame) -> dict:
    # Group by expense category
    categories = expense_data['category'].unique()
    forecasts = {}
    
    for category in categories:
        category_data = expense_data[expense_data['category'] == category]
        
        # Prepare for Prophet
        df = category_data[['date', 'amount']].rename(
            columns={'date': 'ds', 'amount': 'y'}
        )
        
        # Fit model
        model = Prophet()
        model.fit(df)
        
        # Forecast next quarter
        future = model.make_future_dataframe(periods=90)
        forecast = model.predict(future)
        
        # Calculate trend
        latest_forecast = forecast.tail(1)
        trend = "increasing" if latest_forecast['yhat'].iloc[0] > df['y'].iloc[-1] else "decreasing"
        
        forecasts[category] = {
            'forecast': latest_forecast['yhat'].iloc[0],
            'trend': trend,
            'confidence_lower': latest_forecast['yhat_lower'].iloc[0],
            'confidence_upper': latest_forecast['yhat_upper'].iloc[0]
        }
    
    return forecasts
```

**Example 3: Integration with dashboard**
```python
@app.get("/api/forecasts/revenue")
def get_revenue_forecast():
    # Get historical data
    historical = db.query_revenue_last_year()
    
    # Generate forecast
    forecast_data = forecast_revenue(historical)
    
    # Convert to dashboard format
    response = {
        'forecasts': forecast_data.to_dict('records'),
        'metadata': {
            'model': 'Prophet',
            'confidence_interval': 0.80,
            'forecast_period_days': 90
        }
    }
    
    return response
```

---

## Key Concepts

- **Additive model**: Forecast = trend + seasonality + holidays + error
- **Automatic seasonality detection**: Identifies weekly, monthly, yearly patterns
- **Changepoint detection**: Finds points where trends change
- **Holiday effects**: Incorporates known events that affect the time series
- **Prediction intervals**: Quantifies uncertainty in forecasts

---

## Alternatives We Considered

- **ARIMA/SARIMA**: More complex statistical models requiring expertise
- **Exponential smoothing**: Simpler but less flexible than Prophet
- **Custom ML models**: Time-consuming to develop and maintain
- **Manual forecasting**: Inconsistent and hard to scale

---

## Getting Started

1. **Install Prophet**: `pip install prophet`
2. **Prepare data**: DataFrame with 'ds' (date) and 'y' (value) columns
3. **Create model**: `model = Prophet()`
4. **Fit model**: `model.fit(df)`
5. **Make predictions**: `model.predict(future_dates)`

---

## Common Patterns & Best Practices

1. **Use appropriate seasonality**: Enable yearly/monthly based on your data
2. **Handle outliers**: Prophet is robust but extreme outliers can affect forecasts
3. **Tune changepoints**: Adjust sensitivity to trend changes
4. **Cross-validation**: Use built-in cross-validation for model evaluation
5. **Monitor forecast accuracy**: Track actual vs predicted performance

---

## Troubleshooting

**Issue 1:** Poor forecast accuracy  
**Solution:** Check data quality and consider adding custom seasonality

**Issue 2:** Model not converging  
**Solution:** Reduce complexity or check for data issues

---

## Learning Resources

**Essential:**
- [Prophet Documentation](https://facebook.github.io/prophet/)
- [Prophet Quick Start](https://facebook.github.io/prophet/docs/quick_start.html)

**Recommended:**
- [Prophet Paper](https://peerj.com/preprints/3190/)
- [Time Series Forecasting with Prophet](https://realpython.com/facebook-prophet-python/)

**Community:**
- [Prophet GitHub](https://github.com/facebook/prophet)
- [Facebook Research](https://research.fb.com/category/data-science/)

---

**Related Technologies:**
- [pandas](pandas.md) - Data preparation
- [scikit-learn](scikit-learn.md) - Alternative ML approaches
- [statsmodels](statsmodels.md) - Statistical modeling
