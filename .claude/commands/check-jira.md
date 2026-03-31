# Auto-Resolve or Sync Jira Tickets

**Command:** Automatically resolve clear Jira tickets or add ambiguous ones to todos.md

**Purpose:** Process open Jira tickets by attempting to resolve them autonomously when possible, only adding to todos.md when human input is needed.

## Process Overview

1. Fetch all open Jira tickets assigned to current user
2. For each ticket:
   - Analyze the requirements 
   - Attempt to implement if clear
   - Add to todos.md only if questions arise
3. Create PRs for successfully resolved tickets
4. Update Jira with PR links

## Implementation

```javascript
async function processJiraTickets() {
  // 1. Connect to Jira
  const userInfo = await mcp__atlassian__atlassianUserInfo();
  const resources = await mcp__atlassian__getAccessibleAtlassianResources();
  const cloudId = resources[0].id;
  
  // 2. Get open tickets
  const jql = `assignee = currentUser() AND status NOT IN (Done, Closed, Resolved) ORDER BY priority DESC`;
  const issues = await mcp__atlassian__searchJiraIssuesUsingJql({
    cloudId: cloudId,
    jql: jql,
    fields: ["summary", "description", "status", "issuetype", "priority", "key", "project"],
    maxResults: 50
  });
  
  // 3. Check existing todos to avoid duplicates
  const todosPath = "/Users/jack/Documents/Projects/Ckye/todos.md";
  let existingContent = "";
  try {
    existingContent = await Read(todosPath);
  } catch {
    existingContent = "# TODOs\n\n";
  }
  
  const existingJiraKeys = new Set();
  existingContent.split('\n').forEach(line => {
    const keyMatch = line.match(/\[([A-Z]+-\d+)\]/);
    if (keyMatch) existingJiraKeys.add(keyMatch[1]);
  });
  
  // 4. Process each new ticket
  const results = {
    autoResolved: [],
    addedToTodos: [],
    failed: []
  };
  
  for (const issue of issues.issues) {
    if (existingJiraKeys.has(issue.key)) {
      console.log(`⏭️  Skipping ${issue.key} - already in todos`);
      continue;
    }
    
    console.log(`\n📋 Processing ${issue.key}: ${issue.fields.summary}`);
    
    // Try to auto-resolve
    const result = await attemptAutoResolve(issue, cloudId, resources);
    
    if (result.success) {
      results.autoResolved.push(issue.key);
    } else if (result.needsHumanInput) {
      await addToTodos(issue, result.questions, existingContent);
      results.addedToTodos.push(issue.key);
    } else {
      results.failed.push({ key: issue.key, error: result.error });
    }
  }
  
  // 5. Report results
  console.log(`\n✅ Auto-Resolution Complete:`);
  console.log(`   - Auto-resolved: ${results.autoResolved.length} tickets`);
  console.log(`   - Added to todos: ${results.addedToTodos.length} tickets`);
  console.log(`   - Failed: ${results.failed.length} tickets`);
  
  if (results.autoResolved.length > 0) {
    console.log(`\n🎉 Successfully created PRs for: ${results.autoResolved.join(', ')}`);
  }
}

async function attemptAutoResolve(issue, cloudId, resources) {
  const ticketKey = issue.key;
  const summary = issue.fields.summary;
  const description = issue.fields.description || '';
  
  try {
    // Analyze the ticket - Claude will read and understand requirements
    console.log(`🤔 Analyzing requirements for ${ticketKey}...`);
    
    // This is where Claude actually reads the ticket and decides
    // Can I understand what needs to be done?
    // Do I have all the information I need?
    // Are there any ambiguous requirements?
    
    // Example: If the ticket says "Hide Settings and Invite Members from navigation"
    // Claude can understand: 
    // - What: Hide specific menu items
    // - Where: In the navigation component  
    // - How: Find the component and comment out or remove those items
    // This is clear and can be done without questions
    
    // But if ticket says "Improve the user experience of the dashboard"
    // Claude would recognize this needs human input:
    // - What specific improvements?
    // - Which aspects of UX?
    // - What metrics define "improved"?
    
    // Attempt implementation
    const canImplement = await analyzeAndAttemptImplementation(issue);
    
    if (!canImplement.possible) {
      return {
        success: false,
        needsHumanInput: true,
        questions: canImplement.questions
      };
    }
    
    // Switch to main branch
    await Bash("git checkout main && git pull origin main");
    
    // Create feature branch
    const branchName = `feature/${ticketKey.toLowerCase()}-${summary.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`;
    await Bash(`git checkout -b ${branchName}`);
    
    // Make the changes
    console.log(`🛠️  Implementing changes for ${ticketKey}...`);
    await canImplement.implement();
    
    // Run all checks
    console.log(`🧪 Running tests and checks...`);
    await Bash("cd ckye-fe && npm run lint -- --fix");
    await Bash("cd ckye-fe && npm run typecheck");
    await Bash("cd ckye-fe && npm run test");
    await Bash("cd ckye-fe && npm run build");
    
    // Commit changes
    await Bash("git add -A");
    await Bash(`git commit -m "[${ticketKey}] ${summary}

Automated resolution of Jira ticket.
Link: https://${resources[0].url}/browse/${ticketKey}"`);
    
    // Push branch
    await Bash(`git push -u origin ${branchName}`);
    
    // Create PR
    const prBody = `## Summary
Automated resolution of Jira ticket ${ticketKey}.

## Jira Ticket  
[${ticketKey}](https://${resources[0].url}/browse/${ticketKey}): ${summary}

## Description
${description}

## Changes Made
${canImplement.changesSummary}

## Testing
- ✅ Lint checks passed
- ✅ TypeScript validation passed
- ✅ All tests passed
- ✅ Production build successful`;

    const pr = await mcp__github__create_pull_request({
      owner: "jack-agilitee",
      repo: "ckye-fe",
      title: `[${ticketKey}] ${summary}`,
      body: prBody,
      head: branchName,
      base: "main"
    });
    
    // Add page ID comment
    await mcp__github__add_issue_comment({
      owner: "jack-agilitee",
      repo: "ckye-fe",
      issue_number: pr.number,
      body: `Page ID: ${getCurrentPageId()}`
    });
    
    // Update Jira
    await mcp__atlassian__addCommentToJiraIssue({
      cloudId: cloudId,
      issueKey: ticketKey,
      comment: `🤖 Automated PR created: ${pr.html_url}

This ticket was automatically resolved by Claude Code.
- Branch: ${branchName}
- PR: #${pr.number}
- Status: Ready for review

The implementation has passed all tests and checks.`
    });
    
    // Update todos.md with the completed ticket
    const todosPath = "/Users/jack/Documents/Projects/Ckye/todos.md";
    let todosContent = await Read(todosPath);
    
    // Find where to insert the completed ticket
    const lines = todosContent.split('\n');
    let insertIndex = lines.findIndex(line => line.includes('## Jira Tickets'));
    if (insertIndex === -1) {
      // No Jira section, add it
      lines.push('');
      lines.push('## Jira Tickets (Synced: ' + new Date().toISOString() + ')');
      lines.push('');
      insertIndex = lines.length;
    } else {
      // Find where to insert after the section header
      insertIndex += 2;
    }
    
    // Find the next number for the todo
    let nextNumber = 1;
    lines.forEach(line => {
      const match = line.match(/^(\d+)\./);
      if (match) {
        nextNumber = Math.max(nextNumber, parseInt(match[1]) + 1);
      }
    });
    
    // Build the completed ticket entry
    const completedEntry = [
      `${nextNumber}. ✅ COMPLETE - [${ticketKey}] ${issue.fields.priority?.name || 'Medium'}: ${summary}`,
      `   - Status: In Review`,
      `   - Type: ${issue.fields.issuetype.name}`,
      `   - Project: ${issue.fields.project.name}`,
      `   - Link: https://ckye.atlassian.net/browse/${ticketKey}`,
      `   - Description: ${description.substring(0, 200)}${description.length > 200 ? '...' : ''}`,
      `   - PR: #${pr.number} (${pr.html_url})`,
      `   - [x] Implementation completed`,
      `   - [x] Tests passed`,
      `   - [x] PR created and linked to Jira`,
      `   - [ ] Jira ticket moved to Done (awaiting PR merge)`,
      ''
    ];
    
    // Insert the completed entry
    lines.splice(insertIndex, 0, ...completedEntry);
    
    // Write back to todos.md
    await Write(todosPath, lines.join('\n'));
    console.log(`📝 Updated todos.md with completed ticket ${ticketKey}`);
    
    // Return to main
    await Bash("git checkout main");
    
    console.log(`✅ Successfully auto-resolved ${ticketKey} with PR #${pr.number}`);
    return { success: true, pr: pr.number };
    
  } catch (error) {
    console.error(`❌ Failed to auto-resolve ${ticketKey}: ${error.message}`);
    await Bash("git checkout main 2>/dev/null || true");
    
    return {
      success: false,
      needsHumanInput: true,
      questions: [`Failed during implementation: ${error.message}`]
    };
  }
}

async function analyzeAndAttemptImplementation(issue) {
  // This is where Claude analyzes each ticket individually
  // No keywords, just understanding the actual requirements
  
  const result = {
    possible: false,
    questions: [],
    implement: null,
    changesSummary: ""
  };
  
  // Claude reads the ticket and determines if it can be done
  // This happens at runtime when the command is executed
  
  return result;
}

async function addToTodos(issue, questions, existingContent) {
  const lines = existingContent.split('\n');
  let highestNumber = 0;
  
  lines.forEach(line => {
    const match = line.match(/^(\d+)\./);
    if (match) {
      highestNumber = Math.max(highestNumber, parseInt(match[1]));
    }
  });
  
  const nextNumber = highestNumber + 1;
  const priority = issue.fields.priority?.name || 'Normal';
  const description = issue.fields.description || 'No description';
  
  const todo = `${nextNumber}. [${issue.key}] ${priority}: ${issue.fields.summary}
   - Status: ${issue.fields.status.name}
   - Type: ${issue.fields.issuetype.name}
   - Project: ${issue.fields.project.name}
   - Link: https://ckye.atlassian.net/browse/${issue.key}
   - Description: ${description.substring(0, 200)}${description.length > 200 ? '...' : ''}
   - ⚠️ Needs clarification: ${questions.join(', ')}
   - [ ] Review and clarify requirements
   - [ ] Implementation completed
   - [ ] Tests added/updated
   - [ ] PR created and linked to Jira`;
  
  const timestamp = new Date().toISOString();
  const updatedContent = existingContent + `\n\n${todo}\n<!-- Added from Jira: ${timestamp} -->`;
  
  await Write("/Users/jack/Documents/Projects/Ckye/todos.md", updatedContent);
  console.log(`📝 Added ${issue.key} to todos.md for manual review`);
}

function getCurrentPageId() {
  // Get the page ID from CLAUDE.md
  return "cme78g7a700018ovg8p0ijuv0";
}

// Execute
await processJiraTickets();
```

## How Auto-Resolution Works

When Claude analyzes each ticket, it will:

1. **Read the full ticket** - Summary, description, acceptance criteria
2. **Understand the requirements** - What needs to be changed and why
3. **Determine feasibility** - Can this be done without human decisions?
4. **Implement if possible** - Make the changes, test them, create PR
5. **Ask for help if needed** - Add to todos.md with specific questions

## Examples

### Auto-Resolvable Tickets

✅ **"Hide Settings and Invite Members from the left navigation"**
- Clear requirement: Hide specific UI elements
- Claude can find the navigation component and remove/comment items
- No design decisions needed

✅ **"Fix: Browser tab should respect workspace name capitalization"**  
- Specific bug with clear expected behavior
- Claude can find where the tab title is set and fix capitalization
- Has clear acceptance criteria

✅ **"Add loading spinner to user table while data fetches"**
- Clear requirement with obvious implementation
- Claude can add loading state and spinner component
- Standard UX pattern

### Needs Human Input

❌ **"Improve dashboard performance"**
- Too vague - what aspects? what metrics?
- Multiple approaches possible
- Needs performance benchmarks

❌ **"Redesign the user profile page"**
- Requires design decisions
- No specific requirements
- Needs mockups or specifications

❌ **"Add better error handling"**
- Where specifically?
- What constitutes "better"?
- Needs error handling strategy

## Safety Features

- Always creates new branch for each ticket
- Runs all tests before creating PR
- Returns to main branch after each ticket
- Adds to todos.md if any step fails
- Never force pushes or overwrites work
- Logs all actions for debugging

## Manual Execution

```bash
claude code --command check-jira
```

## Scheduled Execution

See sync-jira.sh for cron job setup.