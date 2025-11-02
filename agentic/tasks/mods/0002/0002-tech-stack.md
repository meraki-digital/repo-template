# Tech Stack Document
## Mod 0002: Global Date Range Picker & Admin UI Navigation

**Version:** 1.0
**Date:** October 30, 2025
**Project:** Superscapes Financial Intelligence Dashboard
**Module:** 0002 - Date Range Picker & Admin Navigation

---

## Frontend Technologies

- **React 18** [📚](../../../agentic/tasks/explainers/react-18.md) - Core JavaScript library for building user interfaces with component-based architecture
- **TypeScript** [📚](../../../agentic/tasks/explainers/typescript-5.md) - Typed superset of JavaScript that provides compile-time type checking and enhanced IDE support
- **Tailwind CSS** [📚](../../../agentic/tasks/explainers/tailwind-css-3.md) - Utility-first CSS framework for rapid UI development with consistent design tokens
- **Headless UI** [📚](../../../agentic/tasks/explainers/headless-ui.md) - Unstyled, accessible UI component library from Tailwind Labs for building custom dropdowns, dialogs, and more
- **React Context API** [📚](../../../agentic/tasks/explainers/react-context-api.md) - Built-in React state management solution for sharing data across component trees without prop drilling
- **date-fns** [📚](../../../agentic/tasks/explainers/date-fns.md) - Modern JavaScript date utility library providing comprehensive date manipulation and formatting functions
- **Axios** [📚](../../../agentic/tasks/explainers/axios.md) - Promise-based HTTP client for making API requests from the browser
- **React Router v6** [📚](../../../agentic/tasks/explainers/react-router-v6.md) - Declarative routing library for React applications enabling navigation between pages

---

## Backend Technologies

- **Python 3.11** [📚](../../../agentic/tasks/explainers/python-311.md) - Modern, high-level programming language with extensive ecosystem for web development and data processing
- **FastAPI** [📚](../../../agentic/tasks/explainers/fastapi.md) - Modern, fast web framework for building APIs with automatic OpenAPI documentation and async support
- **SQLAlchemy 2.0** [📚](../../../agentic/tasks/explainers/sqlalchemy.md) - Powerful Python SQL toolkit and Object-Relational Mapping (ORM) library for database operations
- **Pydantic v2** [📚](../../../agentic/tasks/explainers/pydantic-v2.md) - Data validation library using Python type annotations for request/response models and settings management
- **PostgreSQL** [📚](../../../agentic/tasks/explainers/postgresql.md) - Advanced open-source relational database system with robust ACID compliance and JSON support

---

## AI & Integration Technologies

- **OpenAI GPT-4 API** [📚](../../../agentic/tasks/explainers/openai-gpt-4-api.md) - Large language model API for natural language understanding, SQL generation, and intelligent query processing
- **OpenAI Text Embedding ada-002** [📚](../../../agentic/tasks/explainers/openai-text-embedding-ada-002.md) - Vector embedding model for semantic search and similarity matching of text content

---

## Development Patterns & Practices

- **React Hooks** [📚](../../../agentic/tasks/explainers/react-hooks.md) - Functions that let you use state and lifecycle features in functional React components
- **ETL Pattern** [📚](../../../agentic/tasks/explainers/etl-pattern.md) - Extract, Transform, Load data pipeline pattern for moving and transforming data from sources to targets
- **JWT** [📚](../../../agentic/tasks/explainers/jwt.md) - JSON Web Tokens for stateless authentication and secure information exchange between parties

---

## Development Tools

- **ESLint** [📚](../../../agentic/tasks/explainers/eslint.md) - JavaScript linting utility for identifying and fixing code quality issues and enforcing style guidelines
- **Prettier** [📚](../../../agentic/tasks/explainers/prettier.md) - Opinionated code formatter that enforces consistent style across JavaScript, TypeScript, and other languages
- **Black** [📚](../../../agentic/tasks/explainers/black.md) - Uncompromising Python code formatter that enforces PEP 8 style guide automatically

---

## Testing & Quality Assurance

- **pytest** [📚](../../../agentic/tasks/explainers/pytest.md) - Python testing framework for writing and running unit tests, integration tests, and fixtures
- **React Testing Library** [📚](../../../agentic/tasks/explainers/react-testing-library.md) - Testing utilities for React that encourage testing components from a user's perspective

---

## Documentation Standards

- **Markdown** [📚](../../../agentic/tasks/explainers/markdown.md) - Lightweight markup language for formatting plain text documentation with simple syntax
- **Docstrings** [📚](../../../agentic/tasks/explainers/docstrings.md) - Python documentation strings embedded in code to describe modules, classes, functions, and methods
- **JSDoc** [📚](../../../agentic/tasks/explainers/jsdoc-typedoc.md) - Documentation generator for JavaScript that uses special comments to describe code structure and types

---

## Summary

This module leverages a modern full-stack architecture with React 18 + TypeScript on the frontend and FastAPI + PostgreSQL on the backend. Key technical decisions include:

1. **React Context API** for global date range state management (lightweight, built-in solution)
2. **Headless UI** for accessible dropdown components (aligns with Tailwind design system)
3. **date-fns** for date calculations (modern alternative to Moment.js with tree-shaking support)
4. **PostgreSQL system_variables table** for flexible configuration storage without code deployment
5. **FastAPI + SQLAlchemy** for consistent backend patterns established in previous modules

The stack emphasizes type safety (TypeScript + Pydantic), developer experience (hot reload, auto-documentation), and maintainability (linting, formatting, testing frameworks).
