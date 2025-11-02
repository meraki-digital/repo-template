# PDF File Generation

**Category:** Backend  
**Official Docs:** [reportlab](https://www.reportlab.com/docs/reportlab-userguide.pdf), [weasyprint](https://weasyprint.org/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

PDF file generation involves creating Portable Document Format files programmatically for professional document output. We'll use reportlab for complete programmatic control over PDF creation and weasyprint for converting HTML templates to PDF. These libraries enable us to generate printable financial reports, invoices, and statements that maintain consistent formatting across different devices and printers.

Think of PDF generation as creating a digital "printed document" that looks identical everywhere. Whether viewed on screen or printed on paper, our financial reports will have precise layouts, professional formatting, and embedded fonts for consistent appearance.

---

## Why We're Using It In This Project

PDF exports provide professional document output for our financial dashboard:

- **Print-ready reports**: Generate formatted financial statements for printing
- **Universal compatibility**: PDFs look the same on any device or operating system
- **Professional appearance**: Consistent fonts, layouts, and branding
- **Secure distribution**: Password protection and digital signatures if needed
- **Archival quality**: Long-term preservation of financial records
- **Regulatory compliance**: Standardized format for financial reporting

---

## How We'll Use It

PDF generation will create printable financial documents:

**Example 1: Simple report with reportlab**
```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

def create_financial_report(data):
    doc = SimpleDocTemplate("financial_report.pdf", pagesize=letter)
    styles = getSampleStyleSheet()
    
    story = []
    
    # Title
    title = Paragraph("Financial Report", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))
    
    # Summary data
    for item in data:
        text = f"{item['label']}: ${item['value']:,.2f}"
        para = Paragraph(text, styles['Normal'])
        story.append(para)
    
    doc.build(story)
    return "financial_report.pdf"
```

**Example 2: HTML template to PDF with weasyprint**
```python
from weasyprint import HTML, CSS
from jinja2 import Template

html_template = """
<html>
<body>
    <h1>Financial Statement</h1>
    <table>
        <tr><th>Account</th><th>Balance</th></tr>
        {% for account in accounts %}
        <tr>
            <td>{{ account.name }}</td>
            <td>${{ "%.2f"|format(account.balance) }}</td>
        </tr>
        {% endfor %}
    </table>
</body>
</html>
"""

def generate_pdf_from_html(accounts):
    template = Template(html_template)
    html_content = template.render(accounts=accounts)
    
    # Add custom CSS for professional styling
    css = CSS(string="""
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    """)
    
    html_doc = HTML(string=html_content)
    html_doc.write_pdf('statement.pdf', stylesheets=[css])
    
    return 'statement.pdf'
```

**Example 3: FastAPI PDF export endpoint**
```python
from fastapi import Response
import io

@app.get("/api/export/report")
def export_financial_report():
    # Generate PDF in memory
    buffer = io.BytesIO()
    
    # Use reportlab or weasyprint to create PDF
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    # ... add content ...
    doc.build(story)
    
    buffer.seek(0)
    return Response(
        content=buffer.getvalue(),
        media_type='application/pdf',
        headers={"Content-Disposition": "attachment; filename=financial_report.pdf"}
    )
```

---

## Key Concepts

- **Canvas**: Low-level PDF drawing surface (reportlab)
- **Flowables**: Content elements that flow onto pages (reportlab)
- **HTML/CSS**: Web technologies for document styling (weasyprint)
- **Page layouts**: Margins, headers, footers, and page breaks
- **Fonts**: Embedded fonts for consistent text rendering

---

## Alternatives We Considered

- **Microsoft Word automation**: Platform-dependent and complex
- **HTML print to PDF**: Browser-dependent and unreliable
- **CSV exports**: Not suitable for formatted reports

---

## Getting Started

1. **Install libraries**: `pip install reportlab weasyprint` (weasyprint requires additional system dependencies)
2. **Basic reportlab usage**:
   ```python
   from reportlab.pdfgen import canvas
   
   c = canvas.Canvas("hello.pdf")
   c.drawString(100, 750, "Hello World")
   c.save()
   ```
3. **Basic weasyprint usage**:
   ```python
   from weasyprint import HTML
   
   HTML('http://example.com').write_pdf('example.pdf')
   ```

---

## Common Patterns & Best Practices

1. **Use templates**: Separate layout from data for maintainability
2. **Handle page breaks**: Ensure tables and content flow properly
3. **Embed fonts**: Include necessary fonts to ensure consistent rendering
4. **Test printing**: Verify documents print correctly from PDF viewers
5. **Optimize file size**: Balance quality and file size for web delivery

---

## Troubleshooting

**Issue 1:** Layout breaking across pages  
**Solution:** Use flowables and proper page break handling in reportlab

**Issue 2:** Fonts not displaying correctly  
**Solution:** Embed fonts in PDF or use standard web fonts for weasyprint

---

## Learning Resources

**Essential:**
- [reportlab User Guide](https://www.reportlab.com/docs/reportlab-userguide.pdf)
- [weasyprint Documentation](https://weasyprint.readthedocs.io/)

**Recommended:**
- [PDF Generation Tutorial](https://realpython.com/pdf-python/)
- [reportlab Examples](https://www.reportlab.com/snippets/)

**Community:**
- [reportlab GitHub](https://github.com/reportlab/reportlab)
- [weasyprint GitHub](https://github.com/Kozea/WeasyPrint)

---

**Related Technologies:**
- [FastAPI](fastapi.md) - API framework for serving PDFs
- [Jinja2](https://jinja.palletsprojects.com/) - Template engine for HTML
