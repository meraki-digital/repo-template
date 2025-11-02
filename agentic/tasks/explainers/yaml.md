# YAML

**Category:** Configuration  
**Official Docs:** [https://yaml.org/](https://yaml.org/)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

YAML (YAML Ain't Markup Language) is a human-readable data serialization standard that is commonly used for configuration files and data exchange. It uses indentation to represent hierarchical data structures and supports complex data types like lists, dictionaries, and custom objects. YAML is particularly popular in DevOps and configuration management due to its readability and support for comments.

Think of YAML as a more readable and flexible alternative to JSON. While JSON is great for machines, YAML is designed to be easy for humans to read and write, making it perfect for configuration files that need to be maintained by developers.

---

## Why We're Using It In This Project

YAML provides human-readable configuration for our tools and infrastructure:

- **Readable syntax**: Easy to understand and modify configurations
- **Hierarchical structure**: Represents complex nested configurations
- **Comments support**: Document configuration options inline
- **Tool integration**: Used by dbt, Terraform, GitHub Actions, and more
- **Version control friendly**: Text-based format works well with Git
- **Environment-specific configs**: Different settings for dev/staging/prod
- **Validation**: Can be validated against schemas
- **Widely supported**: Works with all major programming languages

---

## How We'll Use It

YAML will configure our development tools, infrastructure, and CI/CD pipelines:

**Example 1: dbt project configuration**
```yaml
# dbt_project.yml
name: 'financial_dashboard'
version: '1.0.0'
config-version: 2

profile: 'financial_dashboard'

model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]
seed-paths: ["seeds"]
macro-paths: ["macros"]

target-path: "target"
clean-targets:
  - "target"
  - "dbt_packages"

models:
  financial_dashboard:
    marts:
      +materialized: table
    staging:
      +materialized: view
```

**Example 2: Terraform configuration**
```yaml
# versions.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "financial-dashboard-tf-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

# variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}
```

**Example 3: GitHub Actions workflow**
```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
    
    - name: Run tests
      run: pytest
      
    - name: Run dbt tests
      run: dbt test
```

**Example 4: Docker Compose configuration**
```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/financial
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: financial
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

---

## Key Concepts

- **Indentation**: Uses spaces (not tabs) for hierarchy
- **Data types**: Strings, numbers, booleans, lists, dictionaries
- **Anchors & aliases**: Reuse configuration sections
- **Multi-line strings**: Literal and folded block styles
- **Comments**: Lines starting with #

---

## Alternatives We Considered

- **JSON**: Less readable for configuration files
- **INI files**: Limited hierarchical structure
- **TOML**: Good but less widely supported
- **XML**: Verbose and hard to read

---

## Getting Started

1. **Learn syntax**: Understand indentation and data types
2. **Use online validator**: yaml-online-parser.appspot.com
3. **Start simple**: Begin with basic key-value pairs
4. **Add comments**: Document complex configurations
5. **Validate**: Use tools to check syntax

---

## Common Patterns & Best Practices

1. **Consistent indentation**: Use 2 spaces, never tabs
2. **Descriptive keys**: Use clear, meaningful names
3. **Comments**: Document complex or non-obvious settings
4. **Validation**: Use schema validation where possible
5. **Modular configs**: Split large files into smaller ones

---

## Troubleshooting

**Issue 1:** Indentation errors  
**Solution:** Use consistent spacing and YAML linter

**Issue 2:** Type conversion issues  
**Solution:** Quote strings that look like numbers

---

## Learning Resources

**Essential:**
- [YAML Specification](https://yaml.org/spec/)
- [YAML Tutorial](https://yaml.org/YAML_for_ruby.html)

**Recommended:**
- [YAML Syntax Guide](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)
- [Online YAML Validator](https://yaml-online-parser.appspot.com/)

**Community:**
- [YAML GitHub](https://github.com/yaml/yaml)
- [Stack Overflow YAML](https://stackoverflow.com/questions/tagged/yaml)

---

**Related Technologies:**
- [dbt](dbt.md) - Uses YAML for project configuration
- [Terraform](terraform.md) - Infrastructure as code
- [GitHub Actions](https://github.com/features/actions) - CI/CD workflows
