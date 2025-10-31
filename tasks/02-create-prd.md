# Rule: Generating a Product Requirements Document (PRD)

## Goal

To guide an AI assistant in creating a detailed Product Requirements Document (PRD) in Markdown format, based on the Technical SRS from Step 1. The PRD should be clear, actionable, and suitable for a junior developer to understand and implement the feature.

## Process

1.  **Receive SRS Reference:** The user points to the Technical SRS document created in Step 1 (e.g., `tasks/mods/0002/0002-srs-technical-[project-name].md`).
2.  **Review Technical SRS:** Read and analyze the Technical SRS to understand requirements, architecture, and technical constraints.
3.  **Ask Clarifying Questions:** Ask focused clarifying questions to fill any gaps or ambiguities in the SRS. Questions should focus on implementation details, priorities, and specific behaviors not fully detailed in the SRS. Make sure to provide options in letter/number lists so the user can respond easily with selections.
4.  **Generate PRD:** Based on the Technical SRS and the user's answers to the clarifying questions, generate a PRD using the structure outlined below. The PRD should translate the SRS requirements into specific, actionable development requirements.
5.  **Save PRD:** Save the generated document as `[n]-prd-[feature-name].md` inside the `/tasks/mods/[n]/` directory (same directory as the SRS files). Use the same `[n]` prefix as the SRS.
6.  **Naysayer Mode:** Once Step 5 is complete, pause and prompt the user again. This time, let the user know that you need to run a critical analysis of the PRD designed to challenge assumptions, find logic or feasibility flaws, expose likely client resistance or pushback, and evaluate plausibility. Upon user permission, do these things. During the review, you should feel free to amend, reduce, or augment the PRD. Also, you should include an Appendix at the bottom with outstanding concerns.

## Clarifying Questions (Examples)

The AI should adapt its questions based on the prompt, but here are some common areas to explore:

**IMPORTANT FORMATTING RULE:** When presenting numbered questions to the user, use **bold text** for category labels (e.g., "**1. Problem/Goal**"), NOT markdown headings (###). Markdown auto-numbers lists and will display all questions as "1." if headings are inserted between them.

**Example areas to explore:**

*   **Problem/Goal:** "What problem does this feature solve for the user?" or "What is the main goal we want to achieve with this feature?"
*   **Target User:** "Who is the primary user of this feature?"
*   **Core Functionality:** "Can you describe the key actions a user should be able to perform with this feature?"
*   **User Stories:** "Could you provide a few user stories? (e.g., As a [type of user], I want to [perform an action] so that [benefit].)"
*   **Acceptance Criteria:** "How will we know when this feature is successfully implemented? What are the key success criteria?"
*   **Scope/Boundaries:** "Are there any specific things this feature *should not* do (non-goals)?"
*   **Data Requirements:** "What kind of data does this feature need to display or manipulate?"
*   **Design/UI:** "Are there any existing design mockups or UI guidelines to follow?" or "Can you describe the desired look and feel?"
*   **Edge Cases:** "Are there any potential edge cases or error conditions we should consider?"

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
    *   Recap of Clarifying Questions and Answers (Note: if answer indicates AI should decide, document the AI's decision and mark with an asterisk (*) to denote it was AI-recommended)
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
3. Ask focused clarifying questions to fill gaps
4. Generate PRD that translates SRS requirements into actionable development specs
