# Repo Template

> 📋 [View Changelog](CHANGELOG.md) - See the evolution from simple tools to comprehensive workflow

This repository serves as a starting template for new projects. It provides a structured workflow for planning, developing, and documenting software features using a series of guided steps.

## Features

- **Step-by-Step Development Process**: Follow numbered steps (1-4) to generate requirements, PRDs, tasks, and explainers.
- **Agent-Driven Workflow**: Integrates with AI agents for consistent command execution, style guidelines, and repository structure.
- **Task Management**: Organized task lists and documentation in the `tasks/` directory.

## Getting Started

1. Clone or copy this repository to start a new project:
   ```bash
   git clone https://github.com/meraki-digital/repo-template.git your-new-project
   cd your-new-project
   ```

2. Initialize Git if needed:
   ```bash
   git init
   ```
3. Create a GitHub repo of your own.

4. Attach to your own GitHub repo:
   ```bash
   git remote add origin https://github.com/your-username/your-new-repo.git
   ```

## Usage

### Development Workflow

Use the following commands with an AI agent (like Amp) to guide your project:

- **Do Step 1**: Generate a Software Requirements Specification (SRS) via discovery interview.
- **Do Step 2**: Create a Product Requirements Document (PRD) from the SRS.
- **Do Step 3**: Generate a detailed task list from the PRD.
- **Do Step 4**: Create or maintain a Tech Stack document.
- **Do Step 5**: Perform and document progress on the items on the Task List.
- **Do Step 6**: Generate a Status Recap document suitable for your clients or stakeholders.

Each step creates files in `tasks/mods/[n]/` (e.g., `0001-srs-project.md`, `0001-prd-feature.md`).

### Commands

Refer to `AGENTS.md` for standard commands:

- Install dependencies: `npm install` or `pip install -r requirements.txt`
- Run tests: `npm test` or `pytest`
- Build: `npm run build` or `python setup.py build`

## Repository Structure

- `src/` or `app/`: Main source code (or a different naming convention if you prefer)
- `agentic/tests/` or `spec/`: Test files
- `agentic/docs/`: Documentation
- `agentic/tasks/`: Task-related files and instructions
- `.github/`: GitHub workflows and templates
- `AGENTS.md`: Default instructions for agents

## AI Agent Integration

This template is designed to work seamlessly with AI coding agents (like Amp). Instead of manually following each step, you can prompt the agent directly. Each "Do Step X" command initiates a guided process:

- **Do Step 1**: Just these 3 words. This will start a discovery interview to generate a Software Requirements Specification (SRS). The agent will ask clarifying questions to understand your project vision, features, and constraints, then create the SRS document.
- **Do Step 2**: Three words again, simple. Uses the SRS to create a Product Requirements Document (PRD). Involves additional questions to refine requirements, acceptance criteria, and success metrics.
- **Do Step 3**: Generates a detailed task list from the PRD. The agent analyzes the PRD and produces actionable sub-tasks for implementation.
- **Do Step 4**: Creates a Tech Stack document with explainer files. Analyzes project needs and provides in-depth guides for each technology component.
- **Do Step 5**: Begins implementation of the task list. Use prompts like "Do Step 5: 1.1 through 1.3" to work on specific sub-tasks incrementally. The agent will check off completed items and suggest next steps.
- **Do Step 6**: This will generate recap files to share with your clients or stakeholders.

All generated files are saved in `agentic/tasks/mods/[n]/` (e.g., `0001-srs-project.md`). The agent ensures consistency with guidelines in `AGENTS.md`.

## Contributing

1. Follow the style guidelines in `AGENTS.md`.
2. Use conventional commits for changes.
3. Add new recurring commands to `AGENTS.md`.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MIT License (see LICENSE file)
