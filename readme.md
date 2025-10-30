# Repo Template

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

3. Attach to your own GitHub repo:
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

Each step creates files in `tasks/mods/[n]/` (e.g., `0001-srs-project.md`, `0001-prd-feature.md`).

### Commands

Refer to `AGENTS.md` for standard commands:

- Install dependencies: `npm install` or `pip install -r requirements.txt`
- Run tests: `npm test` or `pytest`
- Build: `npm run build` or `python setup.py build`

## Repository Structure

- `src/` or `app/`: Main source code
- `tests/` or `spec/`: Test files
- `docs/`: Documentation
- `tasks/`: Task-related files and instructions
- `.github/`: GitHub workflows and templates
- `AGENTS.md`: Default instructions for agents

## AI Agent Integration

This template is designed to work seamlessly with AI coding agents (like Amp). Instead of manually following each step, you can prompt the agent directly:

- Say **"Do Step 1"** to start a discovery interview for generating an SRS.
- Say **"Do Step 2"** to create a PRD from the SRS.
- Say **"Do Step 3"** to generate a task list from the PRD.
- Say **"Do Step 4"** to create technical explainers.
- Say **"Do Step 5"** to process and implement the task list.

The agent will guide you through questions, generate documents in `tasks/mods/[n]/`, and ensure consistency. See `tasks/sample_commands.md` for example prompts.

## Contributing

1. Follow the style guidelines in `AGENTS.md`.
2. Use conventional commits for changes.
3. Add new recurring commands to `AGENTS.md`.

## License

MIT License (see LICENSE file)
