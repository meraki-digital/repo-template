# Ruff

**Category:** Code Quality  
**Official Docs:** [https://beta.ruff.rs/](https://beta.ruff.rs/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

Ruff is an extremely fast Python linter and code formatter written in Rust. It's designed to be a drop-in replacement for multiple Python code quality tools including Flake8, isort, pydocstyle, and pyupgrade. Ruff can lint your code, check import sorting, and even automatically fix many issues - all in a fraction of the time that traditional Python tools take.

Think of Ruff as a lightning-fast code quality inspector who can check thousands of files in seconds. While other tools might take minutes to analyze your codebase, Ruff can complete the same work in just a few seconds, making it perfect for quick feedback during development and fast CI/CD pipelines.

---

## Why We're Using It In This Project

Ruff provides fast, comprehensive code quality checking for our Python codebase:

- **Blazing fast**: 10-100x faster than traditional Python linters
- **Multiple tools in one**: Replaces flake8, isort, pyupgrade, and more
- **Auto-fixing**: Can automatically fix many code quality issues
- **IDE integration**: Provides instant feedback in editors
- **CI/CD friendly**: Fast enough for pre-commit hooks and CI pipelines
- **Rust-based**: No Python import overhead, consistent performance
- **Comprehensive rules**: Catches bugs, style issues, and security problems

---

## How We'll Use It

Ruff will check and improve our code quality throughout development:

**Example 1: Lint code**
```bash
# Check for issues
ruff check .

# Check specific file
ruff check backend/api/routes.py

# Auto-fix what can be fixed automatically
ruff check --fix .
```

**Example 2: Format imports**
```bash
# Sort and format imports
ruff check --select I --fix .
```

**Example 3: Pre-commit integration**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.0.287
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

**Example 4: VS Code integration**
```json
// .vscode/settings.json
{
  "ruff.enable": true,
  "ruff.lint.enable": true,
  "python.linting.ruffEnabled": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.ruff": true,
    "source.organizeImports.ruff": true
  }
}
```

**Example 5: CI integration**
```yaml
# .github/workflows/ci.yml
- name: Lint with Ruff
  run: |
    ruff check .
    ruff format --check .
```

---

## Key Concepts

- **Rules**: Individual checks for specific code quality issues
- **Categories**: Groups of related rules (F for Pyflakes, E for pycodestyle)
- **Autofix**: Automatic correction of fixable issues
- **Configuration**: pyproject.toml-based settings
- **Performance**: Rust-based parsing and analysis

---

## Alternatives We Considered

- **flake8**: Slower, requires multiple plugins for full functionality
- **pylint**: Comprehensive but very slow on large codebases
- **prospector**: Meta-linter but still slower than Ruff
- **Multiple separate tools**: Complex setup and slower combined runtime

---

## Getting Started

1. **Install Ruff**: `pip install ruff`
2. **Check code**: `ruff check .`
3. **Auto-fix**: `ruff check --fix .`
4. **Format**: `ruff format .`

---

## Common Patterns & Best Practices

1. **Run frequently**: Use in pre-commit hooks for instant feedback
2. **Auto-fix safe issues**: Let Ruff fix formatting and import issues automatically
3. **Configure rules**: Enable/disable rules based on project needs
4. **Integrate with editors**: Real-time feedback during coding
5. **Use in CI**: Fast enough to run on every commit

---

## Troubleshooting

**Issue 1:** Ruff is too strict  
**Solution:** Configure rules in pyproject.toml to disable specific checks

**Issue 2:** Conflicts with Black  
**Solution:** Use `ruff format` instead of Black, or configure to work together

---

## Learning Resources

**Essential:**
- [Ruff Documentation](https://beta.ruff.rs/)
- [Ruff Rules](https://beta.ruff.rs/docs/rules/)

**Recommended:**
- [Ruff vs Other Tools](https://beta.ruff.rs/docs/faq/#how-does-ruff-compare-to-other-tools)
- [Ruff Configuration](https://beta.ruff.rs/docs/configuration/)

**Community:**
- [Ruff GitHub](https://github.com/charliermarsh/ruff)
- [Python Code Quality Slack](https://pythoncodequality.slack.com/)

---

**Related Technologies:**
- [Black](black.md) - Code formatter (Ruff can replace it)
- [isort](isort.md) - Import sorter (Ruff includes this)
- [mypy](mypy.md) - Type checker that complements Ruff
