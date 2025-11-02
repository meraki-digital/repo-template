# agents.md (Base)

Purpose: A single, repo-agnostic control file that defines always-on commands, style, and structure for agentic work.
Extensible by loading supplemental rule files so each repo can add commands without editing this base.

Load order and overrides:
1. `./agents.md`  (this file)
2. `./agentic/agents.d/*.md`  (repo-specific rules, optional)
3. `./agents.local.d/*.md`  (developer or machine specific, git-ignored, optional)

If two files define a command with the same `name`, the last loaded definition wins.

---

## Global defaults

- Timezone: America/Chicago
- Style: plain, direct, no em dashes
- Encoding: UTF-8
- Line endings: LF
- Confirm only on destructive actions
- Use ISO timestamps `YYYY-MM-DD HH:MM`
- Do not create new folders from this base file

---

## Folder expectations

This base file assumes only these paths exist by default:
- `/` root with `agents.md`
- `./agentic/agents.d/`
- `./agents.local.d/`
- `./agentic/tasks/`
- `./agentic/tasks/explainers/`
- `./agentic/tasks/mods/`  (contains per-module folders like `0001`, `0002`, etc.)

Repo-level files in `agentic/agents.d/` may introduce additional folders if that repo needs them.

---

## Command schema

Each command must follow this schema for machine parsing and human readability:

```
name: <Trigger>
intent: <One-line purpose>
inputs: <Questions or auto-detection rules>
writes: <Files created or modified>
steps:
  - <Action 1>
  - <Action 2>
done: <What to return to chat>
```

Rules:
- `name` must be unique, case insensitive
- If `inputs` is empty, run immediately
- Never delete user content unless the command states to do so
- Only write to files under the existing folders listed above

---

## Development workflow commands

### 1) Do Step 1
```
name: Do Step 1
intent: Run discovery using ./agentic/tasks/01-discover-requirements.md
inputs:
  - Determine target mod folder with this precedence:
      1) If user explicitly specifies one in the current message, use that
      2) Else if a mod folder was established earlier in this conversation thread, use that
      3) Else ask: "Which mod folder under agentic/tasks/mods should I work on? (example: 0001)"
writes: ./agentic/tasks/mods/<mod-folder>/<mod-folder>-srs-executive-[project-name].md, ./agentic/tasks/mods/<mod-folder>/<mod-folder>-srs-technical-[project-name].md
steps:
  - Read ./agentic/tasks/01-discover-requirements.md
  - Check if mod folder and seed file (e.g., <mod-folder>-seed.md) exist
  - If seed file is present, read it as the initial concept and conduct discovery interview to clarify any gaps
  - If seed file is not present, conduct full discovery interview to gather initial concept
  - Generate Executive SRS and Technical SRS documents
  - Write both SRS files to ./agentic/tasks/mods/<mod-folder>/ with ISO timestamps in headers
  - Cross-reference the documents in their appendices
done: Return short bullet summaries of both SRS documents and their saved file paths
```

### 2) Do Step 2
```
name: Do Step 2
intent: Create a PRD using ./agentic/tasks/02-create-prd.md
inputs:
  - Resolve mod folder using the same precedence as Do Step 1
writes: ./agentic/tasks/mods/<mod-folder>/02-prd.md
steps:
  - Read ./agentic/tasks/02-create-prd.md
  - Generate a complete PRD for the chosen mod folder
  - Include goals, non-goals, user stories, acceptance criteria, risks, and open questions
  - Save to ./agentic/tasks/mods/<mod-folder>/02-prd.md
done: Return the PRD title, section list, and file path
```

### 3) Do Step 3
```
name: Do Step 3
intent: Generate a task list using ./agentic/tasks/03-generate-tasks.md
inputs:
  - Resolve mod folder using the same precedence as Do Step 1
writes: ./agentic/tasks/mods/<mod-folder>/03-tasks.md
steps:
  - Read ./agentic/tasks/03-generate-tasks.md
  - Produce a structured list with IDs, owners (placeholder if unknown), estimates, dependencies, and acceptance criteria
  - Save to ./agentic/tasks/mods/<mod-folder>/03-tasks.md
done: Return task count, critical path items, and file path
```

### 4) Do Step 4
```
name: Do Step 4
intent: Produce an explainer using ./agentic/tasks/explainers/04-explainer.md
inputs:
  - Resolve mod folder using the same precedence as Do Step 1
writes: ./agentic/tasks/mods/<mod-folder>/04-explainer.md
steps:
  - Read ./agentic/tasks/explainers/04-explainer.md
  - Create a non-technical narrative with diagram placeholders and a glossary
  - Save to ./agentic/tasks/mods/<mod-folder>/04-explainer.md
done: Return key points and file path
```

### 5) Do Step 5
```
name: Do Step 5
intent: Process the task list using ./agentic/tasks/05-process-task-list.md
inputs:
  - Resolve mod folder using the same precedence as Do Step 1
writes: ./agentic/tasks/mods/<mod-folder>/05-processed-tasks.md
steps:
  - Read ./agentic/tasks/05-process-task-list.md
  - Transform tasks into a ready-to-execute plan with phases, lanes, and dependency order
  - Save to ./agentic/tasks/mods/<mod-folder>/05-processed-tasks.md
done: Return the phase map and file path
```

### 6) Do Step 6
```
name: Do Step 6
intent: Create a status document using ./agentic/tasks/06-generate-status-recap.md
inputs:
  - Resolve mod folder using the same precedence as Do Step 1
writes: (file to write specified in instructions file)
done: Return the document name and file path
```

---

## Environment commands

### Install dependencies
```
name: Install dependencies
intent: Install project dependencies
inputs:
  - None
writes: none
steps:
  - If package.json exists, run "npm install"
  - Else if requirements.txt exists, run "pip install -r requirements.txt"
done: Return a one-line success or failure summary
```

### Run development server
```
name: Run development server
intent: Start a local development server
inputs:
  - None
writes: none
steps:
  - If package.json has a "dev" script, run "npm run dev"
  - Else if app.py exists, run "python app.py"
done: Return the command used
```

### Build project
```
name: Build project
intent: Build the project for release
inputs:
  - None
writes: none
steps:
  - If package.json has a "build" script, run "npm run build"
  - Else if setup.py exists, run "python setup.py build"
done: Return a build summary
```

---

## Quality commands

### Run tests
```
name: Run tests
intent: Execute test suite
inputs:
  - None
writes: none
steps:
  - If package.json has "test", run "npm test"
  - Else run "pytest" if tests are present
done: Return pass and fail counts
```

### Run linting
```
name: Run linting
intent: Lint and format code
inputs:
  - None
writes: none
steps:
  - If package.json has "lint", run "npm run lint"
  - Else run "black ." if Python files are present
done: Return a brief summary
```

---

## Deployment command

```
name: Deploy to production
intent: Deploy current build to the production environment
inputs:
  - Ask once per repo to store the deployment command. Examples:
      - npm run deploy
      - docker push <image-tag>
      - custom script path
writes: none
steps:
  - Execute the stored deployment command
done: Return deployment status
```

---

## Agentic commands

### Checkpoint
```
name: Checkpoint
intent: Generate a checkpoint for the current project state
inputs:
  - None (auto-detect project state)
writes: ./agentic/checkpoints/YYYY-MM-DD_HHMM-<project-slug>_checkpoint_vNN.md
steps:
  - Parse the current project state from working memory and open files.
  - Generate a checkpoint using the Episode Checkpoint Template.
  - Write the file to `./agentic/checkpoints/` using this naming rule: `YYYY-MM-DD-<project-slug>_checkpoint_vNN.md`
  - Update or create `./agentic/checkpoints/INDEX.md` with the newest entry at the top.
  - Run `lint_checkpoint.py` and show any errors before finalizing.
done: Reply with the file path written, a 3-line "Next actions" summary, and a warning if any sections were incomplete
```

### Restart
```
name: Restart
intent: Restart from a checkpoint
inputs:
  - Ask: "Restart from [latest_checkpoint.md]? (yes/no or specify another filename)"
writes: none
steps:
  - Read the /agentic/checkpoints folder.
  - Identify the most recent checkpoint file.
  - Display a list of available checkpoints (most recent first).
  - If user says "yes", load that checkpoint's contents as the new active context.
  - If user names another checkpoint, load that one instead.
done: Confirm reload success and display project name + objective line.
```

### Promote to Production
```
name: Promote to Production
intent: Promote poc-dev to poc-prod (production deployment)
inputs:
  - None (runs immediately)
writes: none
steps:
  - Verify current branch is poc-dev with `git branch --show-current`
  - If not on poc-dev, abort with error message
  - Ensure working directory is clean with `git status`
  - Checkout poc-prod: `git checkout poc-prod`
  - Merge poc-dev: `git merge poc-dev --ff-only`
  - Push to production: `git push origin poc-prod`
  - Switch back to dev: `git checkout poc-dev`
  - Confirm promotion complete
done: Return "Promoted to production. Switched back to poc-dev." with deployment URLs
```

### Show Commands
```
name: Show Commands
intent: Display all available commands from AGENTS.md and agents.d/
inputs:
- Optional filter keyword (e.g., "Show Commands deploy")
writes: none
steps:
- Read AGENTS.md and scan for command blocks (sections starting with "name:")
- Read all *.md files in agents.d/ and scan for command blocks
- Extract name + intent from each command
- If filter provided, show only commands matching the filter in name or intent
- Group commands by category (Development Workflow, Environment, Agentic, etc.)
- Display in formatted markdown list
done: Return categorized command list with command names and one-line intents
```

### Bug Fix
```
name: Bug Fix
intent: Start a bug fix session for this thread
inputs:
  - Optional bug description or details
writes: none
steps:
  - Acknowledge that bug fix mode is active
done: Confirm bug fix session started
```

### Bug Fix Complete
```
name: Bug Fix Complete
intent: End bug fix session and document the fixes
inputs:
  - None
writes: poc/bugs/YYYY-MM-DD-HHMM-bug-fix.md or prod/bugs/YYYY-MM-DD-HHMM-bug-fix.md
steps:
  - Determine mode: check current branch with `git branch --show-current`; if branch contains 'poc', mode=poc, else mode=prod
  - Create folder if needed: `mkdir -p poc/bugs` or `mkdir -p prod/bugs`
  - Generate timestamp: {{timestamp}} reformatted to YYYY-MM-DD-HHMM
  - Summarize all thread content from 'Bug Fix' to 'Bug Fix Complete'
  - Write summary to <mode>/bugs/<timestamp>-bug-fix.md with timestamp and details
done: Return file path and brief summary of fixes
```

---

## Style guidelines

- GitHub-flavored Markdown for documentation
- Naming conventions
  - JavaScript and TypeScript: camelCase for variables and functions, PascalCase for components and classes
  - Python: snake_case for modules, functions, and variables, PascalCase for classes
- Use Prettier and ESLint where applicable
- Conventional Commits for messages

---

## Technology constraints

### ⚠️ CRITICAL: No Pandas in Vercel Serverless Deployments

**DO NOT** use pandas in backend code deployed to Vercel serverless functions.

**Why:**
- Pandas is 200+ MB with compiled C extensions
- Causes 20+ minute build times on Vercel
- Serverless functions have size limits (50MB compressed on Vercel)
- Adds unnecessary complexity for simple data operations

**When pandas is acceptable:**
- AWS ECS deployments with Docker (pre-built images)
- Local development scripts
- ETL pipelines running on dedicated servers
- Batch processing jobs (not real-time APIs)

**Alternatives for common pandas use cases:**
- Simple aggregations: Use plain Python with list comprehensions and built-in functions
- SQL queries: Use SQLAlchemy or raw SQL
- Data transformation: Use Python dictionaries and lists
- CSV processing: Use Python's built-in `csv` module

**If you must use pandas:**
1. Deploy to AWS ECS with Docker (not Vercel)
2. Document why pandas is required (justify the 200MB dependency)
3. Consider polars as a lighter alternative

---

## Repo structure reference

- `agents.md` at repo root
- `agents.d/` for shared repo rules
- `agents.local.d/` for private overrides, git-ignored
- `tasks/` for task instruction files
- `tasks/explainers/` for explainer instruction files
- `tasks/mods/` for per-module artifacts (folders like `0001`, `0002`, etc.)
- `scripts/` for shell scripts and automation files
- `docs/` for documentation

---

## Extending with supplemental rules

Add new commands or overrides in:
- `./agentic/agents.d/` for shared, repo-level rules
- `./agents.local.d/` for private overrides that should not be committed

Use the same command schema. Reuse an existing `name` to override a command. Use a new `name` to add commands.
