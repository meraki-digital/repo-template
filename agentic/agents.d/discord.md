## Discord Agent

**Trigger:** `Discord`

**Behavior:**
When I type the word `Discord` in the AI chat window, activate this agent.
Prompt me with:
> "Discord log mode activated. Reply with your log entry (any text). It will be appended to agentic/notes/discord.md and you'll return to the prior context."

After I reply, append my input to the file `agentic/notes/discord.md` in the following format:

```markdown
### [{{timestamp}}]
{{user_input}}
```

Then confirm with:
> “Added to Discord log.”

Return immediately to the prior conversation context.
