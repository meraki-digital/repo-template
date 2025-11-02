# Excel File Generation

**Category:** Backend  
**Official Docs:** [openpyxl](https://openpyxl.readthedocs.io/), [pandas](https://pandas.pydata.org/docs/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Excel file generation refers to creating Microsoft Excel (.xlsx) files programmatically using Python libraries. For our project, we'll use openpyxl for direct Excel manipulation and pandas for data processing and export. These libraries allow us to generate professional-looking financial reports, charts, and data exports that users can open in Excel or similar spreadsheet applications.

Think of these libraries as Excel's programming interface. Instead of manually creating spreadsheets, our code can automatically generate financial reports with properly formatted numbers, dates, and calculations - perfect for accountants and financial analysts.

---

## Why We're Using It In This Project

Excel exports are essential for our financial dashboard users who need to analyze data in spreadsheet software:

- **Professional reporting**: Generate formatted financial statements and reports
- **Data portability**: Allow users to download and manipulate data in Excel
- **Chart generation**: Create visual representations of financial data
- **Formula support**: Include calculations that update in Excel
- **Industry standard**: Excel is the universal language of finance and accounting
- **Complex layouts**: Support for merged cells, styling, and multi-sheet workbooks

---

## How We'll Use It

Excel generation will power our data export features:

**Example 1: Simple data export with pandas**
```python
import pandas as pd
from fastapi import Response

@app.get("/api/export/transactions")
def export_transactions_csv():
    # Get data from database
    df = pd.read_sql("SELECT * FROM transactions", db_connection)
    
    # Generate Excel file in memory
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Transactions', index=False)
    
    # Return as downloadable file
    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={"Content-Disposition": "attachment; filename=transactions.xlsx"}
    )
```

**Example 2: Formatted financial report with openpyxl**
```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Border

def create_financial_report(data):
    wb = Workbook()
    ws = wb.active
    ws.title = "Financial Summary"
    
    # Headers with styling
    headers = ['Account', 'Revenue', 'Expenses', 'Profit', 'Margin %']
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=header)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="CCCCCC", fill_type="solid")
    
    # Data rows
    for row, account in enumerate(data, 2):
        ws.cell(row=row, column=1, value=account['name'])
        ws.cell(row=row, column=2, value=account['revenue'])
        ws.cell(row=row, column=3, value=account['expenses'])
        profit = account['revenue'] - account['expenses']
        ws.cell(row=row, column=4, value=profit)
        margin = profit / account['revenue'] if account['revenue'] else 0
        ws.cell(row=row, column=5, value=f"{margin:.1%}")
    
    # Auto-adjust column widths
    for column in ws.columns:
        max_length = 0
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column[0].column_letter].width = adjusted_width
    
    return wb
```

**Example 3: Multi-sheet workbook**
```python
def create_complete_report():
    wb = Workbook()
    
    # Summary sheet
    summary_sheet = wb.active
    summary_sheet.title = "Summary"
    # Add summary data...
    
    # Detailed transactions
    tx_sheet = wb.create_sheet("Transactions")
    # Add transaction data...
    
    # Charts sheet
    chart_sheet = wb.create_sheet("Charts")
    # Add chart data...
    
    return wb
```

---

## Key Concepts

- **Workbook**: The Excel file container holding multiple sheets
- **Worksheet**: Individual tabs within the workbook
- **DataFrame**: pandas structure for tabular data manipulation
- **Styling**: Fonts, colors, borders for professional appearance
- **Formulas**: Excel formulas that calculate within the spreadsheet

---

## Alternatives We Considered

- **CSV exports**: Simple but lacks formatting and formulas
- **PDF reports**: Good for printing but not for data manipulation
- **Google Sheets API**: Requires external service dependency

---

## Getting Started

1. **Install libraries**: `pip install openpyxl pandas`
2. **Basic pandas export**:
   ```python
   import pandas as pd
   
   df = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})
   df.to_excel('output.xlsx', index=False)
   ```
3. **Basic openpyxl workbook**:
   ```python
   from openpyxl import Workbook
   
   wb = Workbook()
   ws = wb.active
   ws['A1'] = 'Hello'
   wb.save('output.xlsx')
   ```

---

## Common Patterns & Best Practices

1. **Use pandas for data manipulation**: Clean and transform data before Excel export
2. **Apply consistent styling**: Professional headers, borders, and number formatting
3. **Handle large datasets**: Stream processing for memory efficiency
4. **Include metadata**: Creation date, report parameters in the file
5. **Test with Excel**: Ensure compatibility across Excel versions

---

## Troubleshooting

**Issue 1:** Memory errors with large datasets  
**Solution:** Process data in chunks or use streaming for very large files

**Issue 2:** Formatting not displaying correctly  
**Solution:** Test generated files in actual Excel application

---

## Learning Resources

**Essential:**
- [pandas Excel Documentation](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_excel.html)
- [openpyxl Documentation](https://openpyxl.readthedocs.io/)

**Recommended:**
- [Excel File Generation Tutorial](https://realpython.com/openpyxl-excel-spreadsheets-python/)
- [pandas Excel Guide](https://pandas.pydata.org/docs/user_guide/io.html#excel-files)

**Community:**
- [openpyxl GitHub](https://github.com/EllangoK/Excel-Python)
- [pandas GitHub](https://github.com/pandas-dev/pandas)

---

**Related Technologies:**
- [pandas](pandas.md) - Data manipulation library
- [FastAPI](fastapi.md) - API framework for serving exports
