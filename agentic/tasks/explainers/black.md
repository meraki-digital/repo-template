# Black

**Category:** Code Quality  
**Official Docs:** [https://black.readthedocs.io/](https://black.readthedocs.io/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Black is the uncompromising Python code formatter that automatically formats your code to conform to a consistent style. Unlike other formatters that offer extensive configuration options, Black enforces a single, opinionated style guide. It's designed to take the debate out of code formatting by providing a definitive "correct" way to format Python code.

Think of Black as a strict but fair code editor who instantly reorganizes your messy code into a clean, professional layout. No arguments about tabs vs spaces or line length - Black makes these decisions for you.

---

## Why We're Using It In This Project

Black ensures consistent, professional code formatting across our team:

- **Zero configuration**: No time wasted on formatting debates or config files
- **Consistent style**: All team members produce identically formatted code
- **PEP 8 compliant**: Follows Python's official style guidelines
- **IDE integration**: Works seamlessly with VS Code, PyCharm, and other editors
- **Pre-commit integration**: Automatically formats code before commits
- **Large codebase friendly**: Handles our growing backend codebase efficiently
- **Reduces merge conflicts**: Formatting changes are applied consistently

---

## How We'll Use It

Black will automatically format our Python code in development and CI:

**Example 1: Format a single file**
```bash
black backend/api/routes.py
```

**Example 2: Format entire project**
```bash
black .
```

**Example 3: Check formatting without changing files**
```bash
black --check .
# Returns exit code 1 if files need formatting
```

**Example 4: Pre-commit hook integration**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.7.0
    hooks:
      - id: black
        language_version: python3
```

**Example 5: VS Code integration**
```json
// .vscode/settings.json
{
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

---

## Key Concepts

- **Opinionated formatting**: Single correct way to format code
- **Line length**: 88 characters (configurable but we use default)
- **String quotes**: Double quotes preferred for strings
- **Trailing commas**: Forces trailing commas in multi-line structures
- **Magic trailing comma**: Automatically formats multi-line structures

---

## Alternatives We Considered

- **autopep8**: Less opinionated, requires more configuration
- **yapf**: Google's formatter, more configurable but complex
- **Manual formatting**: Inconsistent and time-consuming

---

## Getting Started

1. **Install Black**: `pip install black`
2. **Format a file**: `black your_file.py`
3. **Format project**: `black .`
4. **Check only**: `black --check .` (for CI)

---

## Common Patterns & Best Practices

1. **Run before committing**: Format code as part of your workflow
2. **Use with pre-commit**: Automatic formatting on commit
3. **Integrate with IDE**: Format on save for instant feedback
4. **Review formatted code**: Understand Black's style decisions
5. **Exclude generated files**: Don't format auto-generated code

---

## Troubleshooting

**Issue 1:** Black changes code unexpectedly  
**Solution:** Black's changes are always PEP 8 compliant - trust the formatter

**Issue 2:** Large reformatting commits  
**Solution:** Format the entire codebase at once, then commit separately

---

## Learning Resources

**Essential:**
- [Black Documentation](https://black.readthedocs.io/)
- [Black Code Style](https://black.readthedocs.io/en/stable/the_black_code_style/current_style.html)

**Recommended:**
- [Python Code Formatting with Black](https://realpython.com/python-code-formatting-black/)
- [Black FAQ](https://black.readthedocs.io/en/stable/faq.html)

**Community:**
- [Black GitHub](https://github.com/psf/black)
- [Python Code Quality Slack](https://pythoncodequality.slack.com/)

---

**Related Technologies:**
- [Ruff](ruff.md) - Fast Python linter that works with Black
- [isort](isort.md) - Import sorter that complements Black
- [pre-commit](https://pre-commit.com/) - Framework for managing git hooks
