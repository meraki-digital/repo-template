# AGENTS.md

This file contains default instructions for agents working on this repository. It serves as ground truth for commands, style, and structure.

## Commands

### Development
- Do Step 1: Use @tasks/01-discover-requirements.md as instructions.
- Do Step 2: Use @tasks/02-create-prd.md as instructions. Use the currently contextual SRS file or prompt me for the mods folder name if you do not know from context.
- Do Step 3: Use @tasks/03-generate-tasks.md as instructions. Use the currently contextual PRD file or prompt me for the mods folder name if you do not know from context.
- Do Step 4: Use @tasks/04-explainer.md as instructions. Use the currently contextual PRD file or prompt me for the mods folder name if you do not know from context.
- Do Step 5: Use @tasks/05-process-task-list.md as instructions. Use the currently contextual TASKS file or prompt me for the mods folder name if you do not know from context.
- Install dependencies: `npm install` or `pip install -r requirements.txt`
- Run development server: `npm run dev` or `python app.py`
- Build project: `npm run build` or `python setup.py build`

### Testing
- Run tests: `npm test` or `pytest`
- Run linting: `npm run lint` or `black .`

### Deployment
- Deploy to production: [Specify deployment command, e.g., `npm run deploy` or `docker push`]

## Style Guidelines

- Use GitHub-flavored Markdown for documentation.
- Follow consistent naming conventions (e.g., camelCase for JS, snake_case for Python).
- Use Prettier/ESLint for code formatting.
- Write clear commit messages following conventional commits.

## Repository Structure

- `src/` or `app/`: Main source code
- `tests/` or `spec/`: Test files
- `docs/`: Documentation
- `tasks/`: Task-related files and documentation
- `.github/`: GitHub workflows and templates

## Recurring Commands

Add any repository-specific commands here as they are discovered.
