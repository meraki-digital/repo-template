# Rule: Generating Dual SRS Documents (Executive + Technical)

## Goal

To guide an AI assistant in creating TWO Software Requirements Specification documents from a single discovery interview:
1. **Executive SRS** - Client-facing, business-focused, minimal jargon
2. **Technical SRS** - Team-facing, comprehensive technical detail

Both documents capture the same project but from different perspectives.

## Process
1.  **Receive Initial Concept:** The user provides a brief 1-2 sentence description of their idea or problem.
2.  **Assess Context:** Determine if greenfield or existing codebase enhancement.
3.  **Branch:** Suggest a new branch name to user and seek confirmation. When new branch name is determined, create branch and switch to it.
4.  **Conduct Discovery Interview:** Ask clarifying questions across all relevant domains. Get all technical AND business details.
5.  **Generate BOTH SRS Documents:** Create Executive SRS first, then Technical SRS.
6.  **Save Both:**
    - Executive: `/tasks/mods/[n]/[n]-srs-executive-[project-name].md`
    - Technical: `/tasks/mods/[n]/[n]-srs-technical-[project-name].md`
7.  **Naysayer Mode:** Once both documents are saved, pause and prompt the user for permission to run critical analysis. Explain that you will challenge assumptions, identify feasibility flaws, expose likely client resistance/pushback, and evaluate plausibility. Upon user permission, conduct the review and:
    - Amend, reduce, or augment BOTH SRS documents as needed
    - Add "Outstanding Concerns" section to the Appendix of the Technical SRS
    - Document all changes made during naysayer review

## Discovery Interview

Conduct a thorough discovery interview, paying special attention to:
- **Business value** and **ROI** (for Executive SRS)
- **User pain points** and **success metrics** (for Executive SRS)
- **Technical constraints** and **architecture** (for Technical SRS)

## Executive SRS Structure

**Target Audience:** Client, stakeholders, executives who care about *outcomes* not *implementation*

**Length:** 3-5 pages maximum

**Tone:** Business-focused, outcome-oriented, minimal technical jargon

### Sections:

1.  **Executive Summary** (1 page max)
    *   The Problem (What's broken or missing today?)
    *   The Solution (What we're building in plain English)
    *   Key Benefits (Top 3-5 user/business benefits)
    *   Timeline & Milestones

2.  **Business Requirements**
    *   2.1 Problem Statement (Pain points, current state challenges)
    *   2.2 Goals & Objectives (What success looks like)
    *   2.3 Target Users (Who will use this and how it helps them)
    *   2.4 Success Metrics (How we'll measure success)

3.  **Solution Overview**
    *   3.1 Core Capabilities (What users will be able to do)
    *   3.2 User Experience (High-level user journey, no UI details)
    *   3.3 Key Features (5-7 main features in business terms)

4.  **Scope & Boundaries**
    *   4.1 What's Included (In scope for this project)
    *   4.2 What's Not Included (Explicitly out of scope)
    *   4.3 Future Considerations (Potential next phase)

5.  **Project Approach**
    *   5.1 Development Phases (If phased approach)
    *   5.2 Timeline & Milestones
    *   5.3 Key Assumptions
    *   5.4 Risks & Mitigations (Business risks, not technical)

6.  **Appendix**
    *   6.1 Glossary (Any necessary business terms)
    *   6.2 Related Documents (Link to Technical SRS for team)

---

## Technical SRS Structure

**Target Audience:** Development team, architects, technical stakeholders

**Length:** As detailed as necessary (typically 10-20 pages)

**Tone:** Technical, precise, implementation-focused

### Sections:

Use the **full structure** from `01-discover-requirements.md`:

1.  **Introduction**
    *   1.1 Purpose
    *   1.2 Scope
    *   1.3 Definitions, Acronyms, Abbreviations
    *   1.4 References (including link to Executive SRS)

2.  **Overall Description**
    *   2.1 Product Perspective
    *   2.2 Product Functions
    *   2.3 User Characteristics
    *   2.4 Constraints
    *   2.5 Assumptions and Dependencies

3.  **System Features**
    *   Detailed breakdown of all features with functional requirements

4.  **External Interface Requirements**
    *   4.1 User Interfaces
    *   4.2 Hardware Interfaces
    *   4.3 Software Interfaces (APIs, databases, integrations)
    *   4.4 Communications Interfaces

5.  **Non-Functional Requirements**
    *   5.1 Performance Requirements
    *   5.2 Security Requirements
    *   5.3 Usability Requirements
    *   5.4 Reliability Requirements
    *   5.5 Scalability, Maintainability

6.  **System Architecture**
    *   6.1 Technology Stack (detailed)
    *   6.2 Data Storage (database schema, models)
    *   6.3 Architecture Diagram
    *   6.4 Component Interactions

7.  **Data Requirements**
    *   7.1 Data Models
    *   7.2 Data Flow Diagrams
    *   7.3 Storage Requirements

8.  **Appendix**
    *   Recap of Discovery Interview
    *   Technical diagrams
    *   API specifications
    *   Database schema details

---

## Key Differences Between Documents

| Aspect | Executive SRS | Technical SRS |
|--------|---------------|---------------|
| **Audience** | Client, executives | Dev team, architects |
| **Length** | 3-5 pages | 10-20 pages |
| **Focus** | What & Why | What, Why & How |
| **Language** | Business terms | Technical terms |
| **Details** | High-level capabilities | Specific requirements |
| **Success** | Business metrics | Technical specifications |
| **Diagrams** | User journey, high-level | Architecture, data models, APIs |

---

## Writing Guidelines

### For Executive SRS:
- **Avoid:** "API endpoints", "database schema", "component architecture"
- **Use:** "Automated reporting", "secure data storage", "user dashboard"
- **Focus on:** User benefits, time savings, business impact
- **Examples:**
  - ✗ "Implement REST API with JWT authentication"
  - ✓ "Secure login system protecting sensitive financial data"

  - ✗ "PostgreSQL with pgvector extension for embeddings"
  - ✓ "Intelligent search that understands your questions"

### For Technical SRS:
- Be specific and precise
- Include exact technologies and versions
- Detail all technical constraints
- Specify performance requirements with numbers
- Document all integrations and dependencies

---

## Output Files

Both files generated in the same `/tasks/mods/[n]/` directory:

1. **Executive SRS:**
   - **Format:** Markdown
   - **Filename:** `[n]-srs-executive-[project-name].md`
   - **Example:** `0002-srs-executive-user-dashboard.md`

2. **Technical SRS:**
   - **Format:** Markdown
   - **Filename:** `[n]-srs-technical-[project-name].md`
   - **Example:** `0002-srs-technical-user-dashboard.md`

Each document should cross-reference the other in its Appendix/References section.

---

## Generation Order

1. Conduct full discovery interview (all questions)
2. **Generate Executive SRS first** (forces you to distill to essentials)
3. **Then generate Technical SRS** (add all the technical details)
4. Cross-link the documents
5. Present both to user for review

---

## Next Steps

After both SRS documents are created:
1. Client reviews **Executive SRS** for sign-off
2. Team reviews **Technical SRS** for feasibility
3. Use **Technical SRS** as input for Step 2 (PRD generation)
4. Reference **Executive SRS** in client communications

---

**Final Instructions:**

1. Complete the full discovery interview first
2. Generate Executive SRS (3-5 pages, business-focused)
3. Generate Technical SRS (full detail, team-focused)
4. Cross-reference both documents
5. Save both in `/tasks/mods/[n]/` directory
6. Ask user which document they want to review first
