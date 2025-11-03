# Warning: This tutorial branch of the repo should never be merged into main

# Tutorial: From Idea to Shipped Product

## 🚀 Want to See the Working App?

**The complete, running code is in the BAM branch.**

```bash
git checkout BAM
```

The BAM branch has the updated TUTORIAL.md that shows you how to run and test the app in 2 minutes, then explains how it was built in 2 hours 17 minutes.

**This tutorial branch** has the planning documents and shows the framework structure. **The BAM branch** has the working code.

Read below to understand the framework concepts, then switch to BAM to see it in action.

---

## Welcome to the Tutorial Branch

You're now looking at a **complete example project** that went from a simple idea to a working application using this framework.

The project: **A Reading List Tracker** where users can add books, mark them as read, and take notes.

Everything you see in this branch is real. Real discovery questions. Real decisions. Real generated files. Real code (in BAM branch).

---

## This Looks Complicated. It's Not.

Before we begin, let's address what you're probably thinking:

You're seeing 6 numbered steps, SRS documents, PRD files, seeds, explainers, checkpoints, bug fixes, task lists, and folders within folders.

**"This is too much."**

Here's the truth: **You follow a guided path.** Everything else is there *when you need it*.

You don't need to understand the whole framework upfront. You just need to start with three words: **"Do Step 1"**

The AI agent handles the rest—asking questions, creating documents, and guiding you forward one step at a time.

---

## The Journey Map

Here's the path we followed (and you will too):

```
Simple Idea → Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Shipped Product
   ↓           (SRS)   (PRD)   (Tasks) (Stack) (Build) (Recap)
"I want to
track my
reading"

Optional aids that appear along the way:
├─ Seeds: Skip discovery if you already know what you want
├─ Explainers: Understand technologies as needed
├─ Checkpoints: Pause and resume work anytime
└─ Bug Fixes: Document solutions for future reference
```

Each step builds naturally on the previous one. You're never lost. You're never guessing what comes next.

---

## Understanding Mods: How Projects Are Organized

Before we dive into the day-by-day journey, let's talk about **mods** (short for modules or modifications).

### What Is a Mod?

A mod is a self-contained unit of work—a feature, a project iteration, or a complete application. Each mod gets its own folder with a unique four-digit number:

```
agentic/tasks/mods/
├─ 0001-reading-list/      ← This tutorial project
├─ 0002-user-auth/          ← Your next feature
├─ 0003-export-feature/     ← Another feature
└─ 0004-mobile-app/         ← A new project
```

### The Numbering Scheme

**Format:** `000X-descriptive-name`

- **0001:** Your first project or feature
- **0002:** Your second project or feature
- **0003:** And so on...

The four-digit padding (0001 vs 1) ensures proper alphabetical sorting. You'll never accidentally see "10" before "2" in your file browser.

### What Lives Inside a Mod Folder?

Each mod contains all its documentation artifacts:

```
0001-reading-list/
├─ 0001-discovery-questions.md           (Step 1: Questions to answer)
├─ 0001-srs-executive-reading-list.md    (Step 1: Generated from answers)
├─ 0001-srs-technical-reading-list.md    (Step 1: Generated from answers)
├─ 0001-prd-clarifying-questions.md      (Step 2: Refinement questions)
├─ 0001-prd-reading-list.md              (Step 2: Generated PRD)
├─ 0001-tasks-reading-list.md            (Step 3: Task breakdown)
├─ 0001-tech-stack.md                    (Step 4: Technology choices)
├─ 0001-status-recap-reading-list.md     (Step 6: Project status)
└─ seed.md                                (Optional: initial concept)
```

**Everything related to this feature stays together.** No hunting across folders.

### Why This Matters

1. **Clarity:** Each project/feature is isolated and self-documenting
2. **History:** You can see the evolution of your work over time
3. **Reusability:** Reference old mods when building similar features
4. **Collaboration:** Easy to hand off "just work on mod 0003" to a teammate

### How to Use Mods

When starting a new project or feature, the agent automatically determines the next mod number. You can also specify:

**"Do Step 1 for mod 0005"** - Start a specific mod number
**"Do Step 1"** - Agent picks the next available number

For this tutorial, we're using **0001-reading-list** as our example mod.

---

## Day 1: "I Want to Track My Reading"

### The Starting Point

It began with a simple idea: *I want an app to track books I'm reading.*

That's it. No detailed requirements. No technical specs. Just an idea.

### Saying the Magic Words

In a conversation with an AI agent (like Amp), I simply said:

**"Do Step 1"**

That's all. Three words.

### What Happened Next

The agent immediately generated a **discovery questions file** for me to fill out:

📄 **[0001-discovery-questions.md](agentic/tasks/mods/0001-reading-list/0001-discovery-questions.md)**

This file contained structured questions organized into categories:
- Problem & Goals
- Target User
- Core Functionality
- User Stories
- Data & Content
- Design & UX
- Scope & Boundaries
- Edge Cases
- Success Metrics
- Open Questions

I filled out the questions (took about 15 minutes), thinking through things like:

**What problem does this solve?** "I keep forgetting which books I've read and what I thought about them."

**Who will use this?** "Just me for now, but potentially friends who want similar functionality."

**Key actions?** "Add books, mark them as read or currently reading, add notes, and see my complete list."

**Success criteria?** "When I can look at my reading list and remember what I've read without hunting through emails or notes apps."

The questions helped me clarify things I hadn't fully thought through - like how to handle duplicates, what to do with very long notes, and what features were truly essential versus nice-to-have.

### The Result: Two SRS Documents

After answering the questions, the agent generated two documents:

📄 **[0001-srs-executive-reading-list.md](agentic/tasks/mods/0001-reading-list/0001-srs-executive-reading-list.md)**
A high-level, stakeholder-friendly overview of the project. Great for showing clients or team members.

📄 **[0001-srs-technical-reading-list.md](agentic/tasks/mods/0001-reading-list/0001-srs-technical-reading-list.md)**
A detailed technical specification with data models, API requirements, and acceptance criteria.

**Key Insight:** Notice how the questions helped me think through what I actually wanted? I started with "track books" and ended up with a clear vision including notes, reading status, and future sharing capabilities.

**Time Investment:** About 15 minutes of conversation. That's it.

---

## Day 2: Turning Vision into Requirements

### Step 2: Product Requirements Document

With the SRS documents in hand, I said:

**"Do Step 2"**

The agent read the SRS files and generated another questions file to refine the requirements:

📄 **[0001-prd-clarifying-questions.md](agentic/tasks/mods/0001-reading-list/0001-prd-clarifying-questions.md)**

These questions were more specific than the discovery questions, focusing on:
- Feature priorities and scope decisions
- Form validation rules
- User experience details
- Mobile responsiveness priorities
- Performance targets
- Acceptance criteria

I answered questions like:
- Should duplicate books be blocked or just warned?
- How many notes per book?
- What's the default sort order?
- How should status changes work on mobile?

This refinement process helped nail down specifics that would guide implementation.

### The Result: Complete PRD

📄 **[0001-prd-reading-list.md](agentic/tasks/mods/0001-reading-list/0001-prd-reading-list.md)**

This document includes:
- **User Stories:** "As a reader, I want to add a book so that I can track it in my list"
- **Functional Requirements:** Specific, numbered requirements like "The system must allow users to mark a book as 'Currently Reading' or 'Finished'"
- **Non-Goals:** What we're NOT building (social features, advanced search, etc.)
- **Success Metrics:** How we'll know if this is working
- **Open Questions:** Things we need to figure out during implementation

**Key Insight:** The PRD transformed my conversational answers into developer-ready requirements. A junior developer could pick this up and start building.

**Time Investment:** 10 minutes to answer follow-up questions.

---

## Day 3: Breaking It Down

### Step 3: Task List

Now I had requirements, but how do I actually build this?

**"Do Step 3"**

The agent analyzed the PRD and generated a structured task list.

### The Result: Actionable Tasks

📄 **[0001-tasks-reading-list.md](agentic/tasks/mods/0001-reading-list/0001-tasks-reading-list.md)**

The task list broke everything into:
- **Parent Tasks:** High-level phases (Database Setup, API Development, UI Components)
- **Sub-Tasks:** Specific, checkable items (1.1 Create Book schema, 1.2 Set up migrations, etc.)
- **Relevant Files:** Which files will be created or modified
- **Dependencies:** What needs to happen before what

**Key Insight:** Instead of staring at a blank screen wondering where to start, I had a clear roadmap. Task 1.1, then 1.2, then 1.3...

**Time Investment:** Zero. The agent generated it automatically from the PRD.

---

## Day 4: Choosing the Tech Stack

### Step 4: Technology Decisions

Before writing code, I needed to pick technologies.

**"Do Step 4"**

### The Result: Tech Stack Document + Explainers

📄 **[0001-tech-stack.md](agentic/tasks/mods/0001-reading-list/0001-tech-stack.md)**

Lists every technology choice with rationale:
- **Frontend:** React with TypeScript
- **Backend:** Node.js with Express
- **Database:** PostgreSQL
- **Why each choice makes sense for this project**

Plus, the framework automatically has explainer files for each technology in `agentic/tasks/explainers/`. When I needed to remember how React hooks work, I just referenced:

📄 **[agentic/tasks/explainers/react-hooks.md](../agentic/tasks/explainers/react-hooks.md)**

**Key Insight:** I didn't have to decide everything upfront. The agent helped me choose appropriate technologies for my specific requirements.

**Time Investment:** 5 minutes to discuss preferences (Do I prefer Python or Node? SQL or NoSQL?).

---

## Day 5-7: Building (Step 5)

### Step 5: Implementation

This is where I actually built the app. I used:

**"Do Step 5: tasks 1.1 through 1.3"**

The agent helped implement the specific sub-tasks, checking them off as we went.

### What Helped During Implementation

**Checkpoints:**
Midway through Day 6, I had to stop for a meeting. I said "Checkpoint" and the agent generated:

📄 **[agentic/checkpoints/2025-11-03-reading-list_checkpoint_v01.md](agentic/checkpoints/2025-11-03-reading-list_checkpoint_v01.md)**

This captured exactly where I was, what was done, what was next. When I returned the next day, I said "Restart" and picked up seamlessly.

**Bug Fix Documentation:**
On Day 7, I encountered a CORS issue. After fixing it with the agent's help, I said "Bug Fix Complete" and got:

📄 **[agentic/bugs/2025-11-03-v01-bug-fix.md](agentic/bugs/2025-11-03-v01-bug-fix.md)**

Now if this happens again (or happens to a teammate), we have the solution documented.

**Key Insight:** The framework isn't just about planning. It supports you through the messy middle of building.

**Time Investment:** 3 days of actual coding (your mileage will vary based on project size).

---

## Day 8: Sharing Progress

### Step 6: Status Recap

I needed to update my stakeholder (in this case, myself and potential users).

**"Do Step 6"**

### The Result: Shareable Status Report

📄 **[0001-status-recap-reading-list.md](agentic/tasks/mods/0001-reading-list/0001-status-recap-reading-list.md)**

A clean, professional document showing:
- What we built
- What's working
- What's left to do
- Next steps

Perfect for emailing to clients, posting in Slack, or documenting in project management tools.

**Key Insight:** You're never scrambling to explain what you did. The framework tracks everything, and Step 6 packages it up nicely.

**Time Investment:** 2 minutes. The agent generated it from existing artifacts.

---

## Look Where We Ended Up

Starting from "I want to track my reading," we now have:

✅ **Complete documentation trail**
- Executive SRS for stakeholders
- Technical SRS for developers
- PRD with user stories and requirements
- Task list with clear sub-tasks
- Tech stack with rationale
- Status recap for updates

✅ **Working application**
- Add books with title, author, status
- Mark books as currently reading or finished
- Add and view notes
- See complete reading list

✅ **Project hygiene**
- Checkpoints for pausing/resuming
- Bug fix documentation
- Decision history (why we chose React, PostgreSQL, etc.)

✅ **Total active time investment:** About 3.5 days
- 30 minutes of planning (Steps 1-4)
- 3 days of building (Step 5)
- 2 minutes of reporting (Step 6)

---

## The Safety Net Features (When You Need Them)

### Seeds: Skip Ahead If You Want

If I already knew exactly what I wanted to build, I could have skipped the discovery interview by creating a seed file first, then using:

**"Do Step 1 using 0001-reading-list/seed.md"**

This tells the agent to read my pre-written concept from:

📄 **[0001-reading-list/seed.md](agentic/tasks/mods/0001-reading-list/seed.md)**

The agent would then generate the SRS documents directly from my seed file, potentially eliminating the interview questions entirely if the seed is detailed enough.

Seeds are for when you already know what you want and don't need the discovery process.

### Explainers: Learn As You Go

When implementing PostgreSQL queries, I wasn't sure about best practices. I checked:

📄 **[agentic/tasks/explainers/postgresql.md](../agentic/tasks/explainers/postgresql.md)**

Explainer files exist covering common technologies. They're there when you need them, invisible when you don't.

**Pro tip:** The [Tech Stack document](agentic/tasks/mods/0001-reading-list/0001-tech-stack.md) has direct hyperlinks to all relevant explainers at the bottom. Click any technology name to learn more about it.

### Checkpoints: Pause Anytime

Life happens. Meetings, emergencies, context switches. Say "Checkpoint" and resume later with "Restart".

### Bug Fix Docs: Never Solve the Same Problem Twice

Every bug fix gets documented. Build up a knowledge base for your team.

---

## It's Not Complicated. It's Guided.

You don't need to memorize this framework. You don't need to understand all the files.

You just need to:
1. Say "Do Step 1"
2. Answer questions
3. Follow the steps the agent suggests
4. Build your thing

Everything else—the structure, the documentation, the organization—happens automatically.

---

## Your Turn

Now that you've seen how this works, it's time to build your own project.

### Checkout Main

```bash
git checkout main
```

### Start Your Journey

Open a conversation with your AI agent and say:

**"Do Step 1"**

Then answer the questions about *your* idea. In 30 minutes, you'll have SRS documents. In an hour, you'll have a complete PRD and task list. In days (not weeks), you'll have a shipped product.

### The Framework Has Your Back

- Lost? The task list knows what's next.
- Stuck? Explainers explain the tech.
- Interrupted? Checkpoints save your place.
- Confused about a decision? The docs show your reasoning.

---

## Questions?

The framework is simple once you see it in action. You just saw it. Now go build something.

**Pro tip:** Don't overthink it. Just start with "Do Step 1" and trust the process. Thousands of lines of documentation and dozens of features exist to support you, but you don't need to know about them until you need them.

Welcome to structured, guided, productive development.

Now go checkout `main` and ship something amazing.
