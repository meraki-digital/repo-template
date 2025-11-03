# Rule: Generating a Product Requirements Document (PRD)

## Goal

To guide an AI assistant in creating a detailed Product Requirements Document (PRD) in Markdown format, based on the Technical SRS from Step 1. The PRD should be clear, actionable, and suitable for a junior developer to understand and implement the feature.

## Process

1.  **Receive SRS Reference:** The user points to the Technical SRS document created in Step 1 (e.g., `tasks/mods/0002/0002-srs-technical-[project-name].md`).
2.  **Review Technical SRS:** Read and analyze the Technical SRS to understand requirements, architecture, and technical constraints.
3.  **Generate Clarifying Questions File:** Create a focused questions.md file to fill any gaps or ambiguities in the SRS. Questions should focus on implementation details, priorities, and specific behaviors not fully detailed in the SRS. Structure with sections, numbered questions, checkboxes for options, and space for additional context. Instruct the user to fill it out and reply when complete.
4.  **Generate PRD:** Based on the Technical SRS and the user's answers to the clarifying questions, generate a PRD using the structure outlined below. The PRD should translate the SRS requirements into specific, actionable development requirements.
5.  **Save PRD:** Save the generated document as `[n]-prd-[feature-name].md` inside the `/tasks/mods/[n]/` directory (same directory as the SRS files). Use the same `[n]` prefix as the SRS.
6.  **Naysayer Mode:** Once Step 5 is complete, pause and prompt the user again. This time, let the user know that you need to run a critical analysis of the PRD designed to challenge assumptions, find logic or feasibility flaws, expose likely client resistance or pushback, and evaluate plausibility. Upon user permission, do these things. During the review, you should feel free to amend, reduce, or augment the PRD. Also, you should include an Appendix at the bottom with outstanding concerns.

## Clarifying Questions File

Generate a focused questions.md file in the mod folder, structured similarly to the provided example:

- **Format:** Markdown with sections, numbered questions, checkboxes for multiple choice, and space for additional context
- **Coverage:** Implementation details, priorities, and specific behaviors not fully detailed in the SRS
- **Focus Areas:** Adapt based on the SRS, but common areas include:
  - Problem/Goal
  - Target User
  - Core Functionality
  - User Stories
  - Acceptance Criteria
  - Scope/Boundaries
  - Data Requirements
  - Design/UI
  - Edge Cases
- **Filename:** `[n]-prd-clarifying-questions.md` (e.g., `0002-prd-clarifying-questions.md`)
- **Instruction to User:** "Please fill out this questions file and reply with 'questions complete' when done."

## PRD Structure

The generated PRD should include the following sections:

1.  **Introduction/Overview:** Briefly describe the feature and the problem it solves. State the goal.
2.  **Goals:** List the specific, measurable objectives for this feature.
3.  **User Stories:** Detail the user narratives describing feature usage and benefits.
4.  **Functional Requirements:** List the specific functionalities the feature must have. Use clear, concise language (e.g., "The system must allow users to upload a profile picture."). Number these requirements.
5.  **Non-Goals (Out of Scope):** Clearly state what this feature will *not* include to manage scope.
6.  **Design Considerations (Optional):** Link to mockups, describe UI/UX requirements, or mention relevant components/styles if applicable.
7.  **Technical Considerations (Optional):** Mention any known technical constraints, dependencies, or suggestions (e.g., "Should integrate with the existing Auth module").
8.  **Success Metrics:** How will the success of this feature be measured? (e.g., "Increase user engagement by 10%", "Reduce support tickets related to X").
9.  **Open Questions:** List any remaining questions or areas needing further clarification.
10. **Appendix**
    *   Recap of Clarifying Questions File (Note: if answer indicates AI should decide, document the AI's decision and mark with an asterisk (*) to denote it was AI-recommended)
    *   Outstanding concerns from Naysayer Mode analysis
    *   Design mockups (optional)
    *   Technical diagrams (optional)

## Target Audience

Assume the primary reader of the PRD is a **junior developer**. Therefore, requirements should be explicit, unambiguous, and avoid jargon where possible. Provide enough detail for them to understand the feature's purpose and core logic.

## Output

*   **Format:** Markdown (`.md`)
*   **Location:** `/tasks/mods/[n]/` (same directory as SRS files)
*   **Filename:** `[n]-prd-[feature-name].md`
*   **Cross-reference:** PRD should reference the Technical SRS in its introduction

## Workflow Integration

**Input:** Technical SRS from Step 1 (`[n]-srs-technical-[project-name].md`)  
**Output:** PRD (`[n]-prd-[feature-name].md`)  
**Next Step:** Step 3 uses this PRD to generate the task list

## Final instructions

1. Do NOT start implementing the PRD
2. Read and understand the Technical SRS first
3. Generate clarifying questions file and wait for user completion
4. Generate PRD that translates SRS requirements into actionable development specs
