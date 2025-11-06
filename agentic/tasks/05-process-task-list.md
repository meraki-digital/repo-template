# Step 5: Execute Tasks and Build the Feature

## Purpose

This step transforms your task list into working code by systematically executing each task. The agent's job is to write code, run tests, fix issues, and deliver a complete, working feature.

---

## Core Workflow

### 1. Task Execution Loop

For each task in your task list:

1. **Read the task description carefully**
   - Understand what needs to be built
   - Identify the files that need to be created or modified
   - Check for dependencies on other tasks

2. **Plan the implementation**
   - Break down complex tasks into coding steps
   - Identify what tests need to be written
   - Consider error handling and edge cases

3. **Write the code**
   - Create new files or modify existing ones
   - Follow established patterns from `./agentic/architecture.md`
   - Write clean, readable, well-documented code

4. **Test your work**
   - Run unit tests: `pytest` (Python) or `npm test` (Node.js)
   - Run integration tests if available
   - Test manually by running the application locally

5. **Fix any issues**
   - Address test failures
   - Fix runtime errors
   - Handle edge cases discovered during testing

6. **Update tracking**
   - Mark task as `[x]` in the task list
   - Commit your changes with descriptive message

7. **Get user approval (context-dependent)**
   - **Single task execution:** Ask "Ready for the next task?" and wait for confirmation
   - **Range execution (e.g., "Do all of 2.x"):** Continue automatically through the range, marking each task `[x]` as completed
   - **Always stop for:** Technical issues, architectural decisions, or when the range is complete

### 2. When to Stop and Ask

**Always stop and ask the user:**
- Before starting each major task (when doing single-task execution)
- When you encounter unexpected technical challenges
- When you need to make architectural decisions not covered in the PRD
- When tests are failing and you need guidance on priorities
- When you discover missing requirements or ambiguities
- When a range execution is complete (e.g., all 2.x tasks finished)

**Continue automatically when:**
- User specified a range (e.g., "Do all of 2.x", "tasks 3.1 through 3.5", "Do all of 2.x through 4.x")
- Mark each individual task `[x]` as you complete it within the range

**Example - Single task:**
```
✅ Task 2.3 complete: User authentication endpoint built and tested
Ready to start Task 2.4: Password reset functionality? (y/n)
```

**Example - Single phase range:**
```
Starting range: Tasks 2.1 through 2.4...
✅ Task 2.1 complete: User model and schema
✅ Task 2.2 complete: Registration endpoint
✅ Task 2.3 complete: Authentication endpoint
✅ Task 2.4 complete: Password reset functionality
Range complete! All 2.x authentication tasks finished.
```

**Example - Multi-phase range:**
```
Starting range: All of 2.x through 4.x...
Phase 2 - Authentication:
✅ Task 2.1 complete: User model and schema
✅ Task 2.2 complete: Registration endpoint
✅ Task 2.3 complete: Authentication endpoint
Phase 3 - Data Management:
✅ Task 3.1 complete: Database migrations
✅ Task 3.2 complete: Data validation service
Phase 4 - API Integration:
✅ Task 4.1 complete: External API client
✅ Task 4.2 complete: API error handling
Range complete! All phases 2.x through 4.x finished.
```

---

## Implementation Guidelines

### Code Quality Standards

1. **Follow patterns from architecture.md**
   - Use established database models and schemas
   - Follow existing API routing conventions
   - Match the project's coding style and structure

2. **Write production-ready code**
   - Include proper error handling
   - Add input validation
   - Write meaningful comments for complex logic
   - Use descriptive variable and function names

3. **Test everything**
   - Write unit tests for business logic
   - Test API endpoints with various inputs
   - Verify database operations work correctly
   - Test error conditions and edge cases

### File Organization

1. **Create files in the right locations**
   - Follow the project's established folder structure
   - Put models, routes, services, and tests in their proper directories
   - Update import statements and dependencies as needed

2. **Update configuration files**
   - Add new routes to router configurations
   - Update database migrations if schema changes are needed
   - Modify environment variables or config files as required

### Git Workflow

1. **Commit frequently**
   - Commit after completing each logical unit of work
   - Use conventional commit messages: `feat:`, `fix:`, `refactor:`, etc.
   - Include brief description of what was accomplished

2. **Example commit:**
   ```bash
   git add .
   git commit -m "feat: add user profile endpoint" -m "- GET /api/users/profile returns user data" -m "- Includes authentication middleware" -m "- Added unit tests for success and error cases"
   ```

---

## Progress Tracking

### Task List Updates

After completing each task:

1. **Mark as complete:** Change `[ ]` to `[x]`
2. **Use descriptive commit messages** that capture what was accomplished

---

## Troubleshooting Common Issues

### Tests Failing

1. **Read the error messages carefully**
   - Understand what the test is expecting
   - Check if you're missing required imports or dependencies
   - Verify your implementation matches the test assumptions

2. **Fix the code, not the tests**
   - The tests usually represent the correct behavior
   - Modify your implementation to make tests pass
   - Only change tests if there's a clear error in the test itself

### Dependencies Missing

1. **Check requirements.txt or package.json**
   - Add any new dependencies you've introduced
   - Update version numbers if needed
   - Run `pip install -r requirements.txt` or `npm install`

### Database Issues

1. **Run migrations**
   - If you've added new models, create and run migrations
   - Check that database schema matches your code
   - Verify connection strings and credentials

### Runtime Errors

1. **Check logs carefully**
   - Look for import errors, missing files, or configuration issues
   - Verify environment variables are set correctly
   - Check that all services are running (database, etc.)

---

## Communication Standards

### Status Updates

Provide regular updates as you work:

```
Task 3.1: Building payment validation service...
✅ Created PaymentValidator class with card type detection
✅ Added unit tests for valid/invalid card numbers
✅ Integrated with existing Payment model
Task 3.1 complete: Payment validation working and tested

Ready for Task 3.2: Payment processing endpoint? (y/n)
```

### Asking for Help

When you encounter issues:

```
❌ Issue with Task 4.2: Database migration failing

Error: "column 'user_id' already exists"

Possible causes:
1. Migration was already run previously
2. Manual database changes conflict with migration
3. Migration script has incorrect logic

Should I:
A) Check migration history and skip if already applied
B) Modify migration to handle existing column
C) Reset database and run all migrations fresh

What's your preference?
```

---

## Success Criteria

A task is complete when:

1. ✅ **Code is written** and follows project patterns
2. ✅ **Tests are passing** (unit and integration)
3. ✅ **Feature works** when tested manually
4. ✅ **Documentation is updated** (if needed)
5. ✅ **Changes are committed** to git
6. ✅ **Task is marked** `[x]` in the task list

The goal is to deliver working, tested, production-ready code that implements the requirements from your PRD.