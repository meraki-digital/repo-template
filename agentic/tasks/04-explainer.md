# Rule: Generating Technical Explainer Documents

## Goal

To guide an AI assistant in creating focused, educational explainer documents for technical concepts marked with `[EXPLAIN]` tags in source documentation. Each explainer should provide clear, practical understanding of a technology in the context of the specific project.

## Process
1. **Find Tech Stack Document:** Determine if the Tech Stack document for this mod exists. If it does, it will be found in the tasks/mods/XXXX folder with a name like XXXX-tech-stack.md. If that file does not exist, it will need to be created. To create it, provide a bullet list of all the various tech stack tools, languages, platforms, libraries and patterns that will be utilized by the team to accomplish the successful development and deployment of this project. For each bullet point, include the word "[EXPLAIN] " immediately before the dash between the stack item and the description. This word will be used in subsequent steps of these instructions.
2. **Receive Source Document:** The user points the AI to a source document (typically a tech stack or architecture document)
3. **Scan for Markers:** Search the document for all `[EXPLAIN]` markers
4. **List Markers:** List the Markers that were found and confirm with the user that these are the Markers that need to be explained. Direct the user to respond with "Go" when ready.
5. **Create Explainer Folder:** Create `/tasks/explainers/` directory if it doesn't exist. This folder sits as a sibling folder to the `/tasks/mods/` folder, as it will be referenced by all `mods`.
6. **Generate Explainer Files:** For each `[EXPLAIN]` marker, create a dedicated markdown file with educational content
7. **Update Source Document:** Replace each `[EXPLAIN]` marker with `[📚](../../../agentic/tasks/explainers/filename.md)` hyperlink
8. **Summary Report:** Provide a list of all explainers created with brief description

## Explainer File Naming

- Extract the technology name from the line containing `[EXPLAIN]`
- Use lowercase with hyphens for spaces
- Add `.md` extension
- Examples:
  - `**pgvector** [EXPLAIN]` → `pgvector.md`
  - `**React Router v6** [EXPLAIN]` → `react-router-v6.md`
  - `**AWS ECS Fargate** [EXPLAIN]` → `aws-ecs-fargate.md`
  - `**TanStack Query (React Query)** [EXPLAIN]` → `tanstack-query.md`

## Explainer Document Structure

Each explainer document must follow this template:

```markdown
# [Technology Name]

**Category:** [Frontend / Backend / Database / Infrastructure / ETL / AI / Testing / etc.]
**Official Docs:** [URL to official documentation]
**Used In:** [Project Name]

---

## What Is It?

[2-3 paragraph plain English explanation suitable for someone unfamiliar with the technology. Avoid jargon. Use analogies where helpful.]

---

## Why We're Using It In This Project

[Bulleted list of specific reasons this technology was chosen for THIS project. Be concrete and project-specific.]

- Reason 1 related to project requirements
- Reason 2 related to project constraints
- Reason 3 related to team or client needs

---

## How We'll Use It

[Concrete examples of how this technology will be used in the project. Include code snippets, configuration examples, or workflow descriptions where appropriate.]

**Example 1: [Use Case Name]**
[Description or code example]

**Example 2: [Use Case Name]**
[Description or code example]

---

## Key Concepts

[Definitions of 3-5 important terms or concepts related to this technology that someone implementing it should understand]

- **Term 1:** Definition
- **Term 2:** Definition
- **Term 3:** Definition

---

## Alternatives We Considered

[Brief list of alternative technologies that could have served similar purpose, with 1-sentence reason why we chose the selected technology instead]

- **Alternative 1:** Why we didn't choose it
- **Alternative 2:** Why we didn't choose it

---

## Getting Started

[Practical first steps for a developer who needs to start using this technology in the project]

1. [Installation or setup step]
2. [Configuration step]
3. [First usage example]

---

## Common Patterns & Best Practices

[3-5 common patterns or best practices specific to this technology that the team should follow]

1. **Pattern/Practice 1:** Description
2. **Pattern/Practice 2:** Description
3. **Pattern/Practice 3:** Description

---

## Troubleshooting

[Common issues and solutions]

**Issue 1:** [Problem description]
**Solution:** [How to fix it]

**Issue 2:** [Problem description]
**Solution:** [How to fix it]

---

## Learning Resources

**Essential:**
- [Official Documentation](URL)
- [Getting Started Guide](URL)

**Recommended:**
- [Tutorial or article](URL)
- [Video course](URL) (optional)

**Community:**
- [GitHub Repository](URL)
- [Discord/Forum](URL) (optional)

---

**Related Technologies:**
- [Link to other explainers that work with this technology]
```

## Target Audience

Assume the primary reader is a **junior to mid-level developer** who:
- May not have used this technology before
- Needs to understand it enough to implement it in the project
- Wants practical, actionable information over theoretical completeness
- Learns best with examples and concrete use cases

## Tone & Style

- **Clear and conversational** - Write like you're explaining to a colleague
- **Practical over theoretical** - Focus on "how we'll use it" not "everything it can do"
- **Project-specific** - Tie explanations to actual project requirements
- **Assume intelligence, not knowledge** - Don't talk down, but don't assume familiarity
- **Use analogies** - Complex concepts explained through familiar comparisons
- **Keep it focused** - Each explainer should be readable in 5-10 minutes

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/tasks/explainers/`
- **Filename:** `[technology-name].md` (lowercase, hyphenated)

## After Generation

1. Replace `[EXPLAIN]` markers in source document with hyperlinks
2. Commit changes to both source document and new explainers
3. Provide summary report of all explainers created

---

## Example Transformation

**Before (in source document):**
```markdown
- **pgvector** [EXPLAIN] - PostgreSQL extension for vector embeddings
```

**After (in source document):**
```markdown
- **pgvector** [📚](explainers/pgvector.md) - PostgreSQL extension for vector embeddings
```

**New file created:** `/tasks/mods/0001/explainers/pgvector.md`

---

## Best Practices

1. **Focus on project context** - Don't write a generic pgvector tutorial; write about how WE'RE using pgvector for AI embeddings in financial queries
2. **Include relevant examples** - If explaining React Router, show examples from our dashboard navigation
3. **Link to related explainers** - If FastAPI explainer mentions Pydantic, link to Pydantic explainer
4. **Keep updated** - If architecture changes, update affected explainers
5. **Use real project code** - When possible, reference actual files from the task list

---

**Final Note:** Explainers are living documents. As the project evolves and the team learns, these can be updated with lessons learned, gotchas encountered, and project-specific patterns discovered during implementation.
