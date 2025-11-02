# isort

**Category:** Code Quality  
**Official Docs:** [https://pycqa.github.io/isort/](https://pycqa.github.io/isort/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

isort is a Python utility that automatically sorts and organizes import statements in your code. It groups imports into sections (standard library, third-party, local), removes duplicates, and ensures consistent formatting. This tool eliminates the debate over import organization and maintains clean, readable import blocks throughout your codebase.

Think of isort as a meticulous librarian who organizes your import statements into neat, consistent sections. Instead of manually arranging imports or having inconsistent styles across files, isort automatically creates orderly import blocks that are easy to read and maintain.

---

## Why We're Using It In This Project

isort ensures consistent, organized import statements across our codebase:

- **Automatic organization**: No more manual import sorting or style debates
- **Standard sections**: Groups imports by type (standard, third-party, local)
- **Duplicate removal**: Eliminates redundant import statements
- **Team consistency**: All team members produce identically organized imports
- **IDE integration**: Works with VS Code, PyCharm, and other editors
- **Pre-commit friendly**: Fast enough for git hooks and CI pipelines
- **Black compatibility**: Works seamlessly with our code formatter

---

## How We'll Use It

isort will organize our Python imports automatically:

**Example 1: Sort imports in a file**
```bash
isort backend/api/routes.py
```

**Example 2: Sort entire project**
```bash
isort .
```

**Example 3: Check without changing**
```bash
isort --check-only --diff .
```

**Example 4: Pre-commit integration**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
        args: ["--profile", "black"]
```

**Example 5: VS Code integration**
```json
// .vscode/settings.json
{
  "python.sortImports.args": ["--profile", "black"],
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

**Example 6: Before and after**
```python
# Before isort
import os
from fastapi import FastAPI, HTTPException
import pandas as pd
from backend.database import get_db
from sqlalchemy.orm import Session
from typing import List

# After isort
import os
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
```

---

## Key Concepts

- **Import sections**: Standard library, third-party, local imports
- **Profile compatibility**: Can match Black's import style
- **Line length**: Respects line length limits for wrapping
- **Multi-line imports**: Handles complex import statements
- **Skip files**: Can exclude certain files or directories

---

## Alternatives We Considered

- **Manual import sorting**: Time-consuming and inconsistent
- **Editor features**: Not standardized across team members
- **Other import sorters**: isort is the most popular and feature-rich

---

## Getting Started

1. **Install isort**: `pip install isort`
2. **Sort a file**: `isort your_file.py`
3. **Sort project**: `isort .`
4. **Check only**: `isort --check-only --diff .`

---

## Common Patterns & Best Practices

1. **Use with Black**: Configure with `--profile black` for consistency
2. **Pre-commit hooks**: Automatic sorting on every commit
3. **IDE integration**: Sort imports on save for instant organization
4. **Team standards**: Agree on import section order
5. **Exclude generated files**: Don't sort auto-generated import blocks

---

## Troubleshooting

**Issue 1:** isort conflicts with Black  
**Solution:** Use `isort --profile black` to match Black's style

**Issue 2:** Custom import sections needed  
**Solution:** Configure sections in pyproject.toml or setup.cfg

---

## Learning Resources

**Essential:**
- [isort Documentation](https://pycqa.github.io/isort/)
- [isort Configuration](https://pycqa.github.io/isort/docs/configuration/options.html)

**Recommended:**
- [Python Import Sorting with isort](https://realpython.com/python-imports/)
- [isort Profiles](https://pycqa.github.io/isort/docs/configuration/profiles.html)

**Community:**
- [isort GitHub](https://github.com/pycqa/isort)
- [Python Code Quality Slack](https://pythoncodequality.slack.com/)

---

**Related Technologies:**
- [Black](black.md) - Code formatter that complements isort
- [Ruff](ruff.md) - Linter that includes import sorting
- [pre-commit](https://pre-commit.com/) - Git hooks framework
