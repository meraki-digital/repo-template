# Rule: Generating a Software Requirements Specification (SRS)

## Goal

To guide an AI assistant in creating a Software Requirements Specification (SRS) document in Markdown format, based on an initial user concept or problem statement. The SRS should capture the "what" and "why" of the project through collaborative discovery, setting a solid foundation for the PRD phase.

## Process

1.  **Receive Initial Concept:** The user provides a brief 1-2 sentence description of their idea or the problem they want to solve.
2.  **Assess Context:** Determine if this is a greenfield project or a new feature for an existing codebase. If working in an IDE with codebase access or provided with existing code context, analyze existing patterns, tech stack, and architecture to inform the interview.
3.  **Conduct Discovery Interview:** The AI *must* ask clarifying questions across multiple domains to gather sufficient detail. The goal is to understand the problem, users, features, constraints, and success criteria. Make sure to provide options in letter/number lists so the user can respond easily with selections. **Note:** If this is a new feature for an existing project, many technical questions (stack, architecture, auth patterns, etc.) may already be answered by the codebase - adapt or skip those questions accordingly.
4.  **Generate SRS:** Based on the initial concept and the user's answers to the clarifying questions, generate an SRS using the structure outlined below.
5.  **Save SRS:** Save the generated document as `[n]-srs-[project-name].md` inside the `/tasks/mods/[n]/` directory. (Where `n` is a zero-padded 4-digit sequence starting from 0001, e.g., `0001-srs-gym-timer.md`, `0002-srs-inventory-system.md`, etc.). If tasks, mods, or [n] folders do not exist, create them.

## Discovery Interview (Question Categories)

The AI should adapt its questions based on the concept, but here are key areas to explore:

**Important:** For existing codebases, the AI should first analyze available context (file structure, package.json, existing components, etc.) and skip or adapt questions where answers are already evident from the code.

### Problem & Vision
*   "What specific problem are you trying to solve?"
*   "Who experiences this problem? (target users)"
*   "How are people solving this problem today? What's broken about current solutions?"
*   "What's your vision for how this solution will work?"

### Core Functionality
*   "What are the 3-5 most critical features this solution must have?"
*   "Walk me through a typical user journey - from start to finish, what does a user do?"
*   "Are there any features you're considering but aren't sure about? (nice-to-haves)"
*   "What should this solution NOT do? (boundaries/out of scope)"

### Users & Use Cases
*   "Who are the primary users? Any secondary user types?"
*   "Will users work individually, collaboratively, or both?"
*   "Do different user types need different permissions or capabilities?"
*   "How many users do you expect? (scale: 10s, 100s, 1000s, more?)"

### Technical Context
*   "Do you have an existing technology stack you must use? (e.g., React, Python, AWS)"
*   "Are there any technical constraints? (must run on mobile, must integrate with X, must be offline-capable)"
*   "Do you have preferences for: Web app vs mobile app vs desktop vs all?"
*   "Do you need real-time features? (live updates, collaboration, sync across devices)"
*   "What kind of data will this handle? (user data, files, media, etc.)"

### Data & Storage
*   "What data needs to be stored? (user accounts, content, settings, history)"
*   "Does data need to persist across sessions/devices?"
*   "Are there any data privacy or security requirements?"
*   "Do users need to export their data?"

### User Interface & Experience
*   "What devices will users primarily use? (phone, tablet, desktop, TV/large display)"
*   "Do you have design preferences? (minimalist, data-dense, colorful, professional)"
*   "Should it work offline or require internet?"
*   "Are there accessibility requirements?"

### Non-Functional Requirements
*   "How fast should the app respond? Any specific performance needs?"
*   "How important is real-time synchronization? (<1 second, <5 seconds, doesn't matter)"
*   "What's your uptime/reliability expectation? (hobby project, business-critical)"
*   "Do you need analytics or tracking of user behavior?"

### Success Metrics
*   "How will you know if this project is successful?"
*   "Are there specific metrics you want to track? (user adoption, usage frequency, task completion)"
*   "What would make this a 'win' in 1 month? 3 months? 6 months?"

### Timeline & Phasing
*   "Do you want to build everything at once or in phases?"
*   "If phased, what's the absolute minimum viable version?"
*   "Are there any hard deadlines or time constraints?"

## SRS Structure

The generated SRS should include the following sections:

1.  **Introduction**
    *   1.1 Purpose (brief description of the document's purpose)
    *   1.2 Scope (what the system will and won't do)
    *   1.3 Definitions, Acronyms, and Abbreviations (if applicable)
    *   1.4 References (optional)

2.  **Overall Description**
    *   2.1 Product Perspective (context - standalone vs part of larger system)
    *   2.2 Product Functions (high-level summary of main functions)
    *   2.3 User Characteristics (target users and their traits)
    *   2.4 Constraints (technical, regulatory, or other limitations)
    *   2.5 Assumptions and Dependencies

3.  **System Features**
    *   For each major feature (typically 3-7 features):
        *   Feature X: [Name]
            *   Description
            *   Functional Requirements (numbered list of specific capabilities)

4.  **External Interface Requirements**
    *   4.1 User Interfaces (layout, navigation, controls)
    *   4.2 Hardware Interfaces (if applicable)
    *   4.3 Software Interfaces (APIs, databases, third-party services)
    *   4.4 Communications Interfaces (protocols, data formats)

5.  **Non-Functional Requirements**
    *   5.1 Performance Requirements
    *   5.2 Security Requirements
    *   5.3 Usability Requirements
    *   5.4 Reliability Requirements
    *   5.5 Other (scalability, maintainability, etc.)

6.  **System Architecture (Optional)**
    *   6.1 Technology Stack
    *   6.2 Data Storage
    *   6.3 High-level Architecture Diagram (describe in text or Mermaid)

7.  **Appendix**
    *   Recap of Discovery Interview and Answers (Note: if answer indicates AI should decide, document the AI's decision and mark with an asterisk (*) to denote it was AI-recommended)
    *   Sample UI mockups (text-based) (optional)
    *   Data models (optional)
    *   Glossary (optional)

## Target Audience

The SRS should be understandable by:
*   **Technical stakeholders** (developers, architects)
*   **Non-technical stakeholders** (product managers, clients)
*   **The AI assistant** (who will use it to generate the PRD in the next step)

Keep language clear and avoid unnecessary jargon. When technical terms are needed, define them.

## Output

*   **Format:** Markdown (`.md`)
*   **Location:** `/tasks/mods/[n]/`
*   **Filename:** `[n]-srs-[project-name].md`
*   **Style:** Lightweight and focused - not a 50-page enterprise document. Aim for clarity and completeness without over-specification. This output will be used as the seed for a process and prompt that will create a professional PRD.

## Interview Flow

1.  **Start broad:** Begin with problem, vision, and users
2.  **Narrow to features:** Identify core functionality and user flows
3.  **Address technical context:** Understand constraints and preferences
4.  **Cover non-functionals:** Performance, security, scale
5.  **Define success:** Metrics and phasing
6.  **Summarize & confirm:** Before generating, recap what you heard and confirm with user

## Best Practices

*   **Ask open-ended questions** when exploring new areas
*   **Offer multiple-choice options** when there are common paths (e.g., tech stack choices)
*   **Probe for specifics** if user gives vague answers
*   **Surface trade-offs** when requirements conflict (e.g., "Real-time sync will add complexity - is that acceptable?")
*   **Don't assume** - if the user hasn't mentioned authentication, ask if it's needed
*   **Validate understanding** by paraphrasing back what you heard

## Next Steps

After the SRS is created:
1.  User can review and refine the SRS
2.  User invokes `02-create-prd.md` workflow, referencing the SRS to create a detailed PRD
3.  User invokes `03-generate-tasks.md` workflow to create implementation tasks
4.  Development begins using `04-process-task-list.md` (or similar)

---

**Final Instructions**

1.  Do NOT start writing the SRS until you've completed the discovery interview
2.  Make sure to ask clarifying questions across all relevant categories
3.  Take the user's answers and synthesize them into a clear, actionable SRS
4.  The SRS should be detailed enough to feed into the PRD generation process, but not overly prescriptive on implementation details