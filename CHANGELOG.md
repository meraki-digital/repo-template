# Changelog

All notable changes between project versions are documented in this file.

## [main] - 2025-11-02

### Major Structural Changes
Complete reorganization of project structure with introduction of comprehensive `agentic/` directory hierarchy.

### Added

#### Core Configuration
- **AGENTS.md**: Comprehensive AI agent configuration and workflow documentation (408 lines)
  - Global defaults (timezone, style, encoding)
  - Command schema and development workflow
  - Quality, deployment, and agentic commands (Checkpoint, Restart, Promote to Production)
  - Technology constraints (serverless deployment guidance)
  - Repo structure reference and extensibility guidelines

#### Agentic Directory Structure
- **agentic/agents.d/**: Agent-specific configurations
  - discord.md: Discord bot configuration

#### Task Management System
- **agentic/tasks/**: Complete task workflow templates
  - 01-discover-requirements.md: Requirements discovery interview process
  - 02-create-prd.md: Product Requirements Document template
  - 03-generate-tasks.md: Task list generation framework (refined from root)
  - 04-explainer.md: Non-technical explainer creation guide
  - 05-process-task-list.md: Task processing and prioritization
  - 06-generate-status-recap.md: Status report generation
  - sample_commands.md: Example command reference

#### Directory Placeholders (Created for Future Use)
- **agentic/checkpoints/**: Project checkpoint storage
- **agentic/correspondence/**: Client communication records
- **agentic/docs/**: Deployment and operational documentation
- **agentic/notes/**: Team communication and stakeholder notes
- **agentic/scripts/**: Automation scripts
- **agentic/tasks/explainers/**: Technology explainer templates (directory structure ready)
- **agentic/tasks/mods/**: Module-specific documentation (directory structure ready)

### Changed
- **LICENSE**: Simplified and updated (222 deletions, cleaner format)
- **readme.md**: Completely restructured project documentation (158 changes)
  - Updated project description and purpose
  - Revised structure overview
  - Enhanced usage instructions
  - Clarified contribution guidelines
- **agentic/tasks/03-generate-tasks.md**: Minor refinements (11 changes)

### Removed
- **create-prd.md**: Removed from root (56 deletions) - superseded by agentic/tasks/02-create-prd.md
- **generate-tasks.md**: Removed from root - moved to agentic structure

### Statistics
- **13 files changed**
- **1,230 insertions**
- **469 deletions**
- Net addition of **761 lines**

### Notes
This version represents a template-ready state with:
- Comprehensive workflow documentation
- Scalable directory structure for future projects
- Agent-driven development processes
- Clear separation between template files and project-specific content

---

## [carson] - 2025-11-02

### Initial Version
Early version of the repository template project.

### Structure
- Root-level task files (create-prd.md, generate-tasks.md)
- Basic LICENSE and readme.md
- Simple tasks directory structure
- AGENTS.md configuration

### Characteristics
- Minimal organizational structure
- Task files at root level
- Basic documentation
- Foundation for future expansion

---

## Evolution: From Simple Files to Comprehensive Workflow

The journey from `carson` to `main` represents a fundamental shift in how project development is approached and managed. What began as two standalone files—`create-prd.md` and `generate-tasks.md`—has evolved into a complete, structured workflow system that guides projects from initial concept through to delivery.

### The Carson Approach: Reactive Documentation

In the `carson` branch, the workflow was minimal and reactive. The two root-level files provided basic templates:

- **create-prd.md** focused solely on creating a Product Requirements Document through a question-and-answer process with the user
- **generate-tasks.md** handled the conversion of a PRD into an actionable task list

While functional, this approach had inherent limitations. It assumed you already knew what you were building and simply needed to document it. There was no upstream discovery process, no downstream explanation for stakeholders, and no mechanism for tracking project status or processing tasks strategically.

### The Philosophy: Proactive Development Framework

The `main` branch transforms these two files into six interconnected stages that form a complete development lifecycle:

**Stage 1: Discovery (01-discover-requirements.md)**
The workflow now begins before the PRD, with a structured requirements discovery interview process. This ensures that ideas are properly vetted and understood before documentation begins, reducing costly mid-project pivots.

**Stage 2: Product Requirements (02-create-prd.md)**
The PRD creation process has been refined and integrated into the broader workflow. It's no longer a starting point but a natural evolution from discovery.

**Stage 3: Task Generation (03-generate-tasks.md)**
Task generation builds on the enhanced PRD, creating more contextual and actionable development tasks.

**Stage 4: Stakeholder Communication (04-explainer.md)**
A new step creates non-technical explainers for stakeholders who need to understand what's being built without diving into technical specifications.

**Stage 5: Task Processing (05-process-task-list.md)**
Raw tasks are now processed, prioritized, and organized into implementation phases with clear dependency chains.

**Stage 6: Status Reporting (06-generate-status-recap.md)**
The workflow concludes with structured status reporting, ensuring stakeholders remain informed throughout the development process.

### Organizational Maturity

Beyond the workflow expansion, `main` introduces critical organizational infrastructure:

- **Centralized Structure**: All workflow files moved from the root into `agentic/tasks/`, creating a clear separation between project templates and actual project work
- **Configuration Management**: The addition of `AGENTS.md` provides comprehensive guidance on how AI agents should interact with the workflow
- **Extensibility**: The `agentic/agents.d/` directory allows project-specific customizations without modifying core templates
- **Sample Commands**: The `sample_commands.md` file provides practical examples for users learning the system

### Creator Note
This update is in no way a criticism of Ryan Carson's original work. His repo (https://github.com/snarktank/ai-dev-tasks) was absolutely the inspiration and the "light bulb moment" for unlocking how our team thinks about and executes development projects.
