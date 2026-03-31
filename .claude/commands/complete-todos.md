## Complete Todos from todos.md

**Command:** Complete all todos from todos.md

**Purpose:** Automatically read through todos.md and complete each task following proper git protocols and project standards using MCP GitHub server.

**Process:**
1. Read todos.md file at project root
2. Parse each todo item
3. For each todo:
   - Create a GitHub issue via MCP
   - Create a feature branch
   - Implement the required changes
   - Run all tests and checks
   - Create pull request via MCP
   - Link PR to issue

**Implementation Steps:**

### 1. Read and Parse Todos
```bash
# Read todos.md from project root
cat /Users/jack/Documents/Projects/Ckye/todos.md

# Parse each line as a todo item
# Format expected: - [ ] Task description
# or just plain text tasks
```

### 2. For Each Todo Item

#### A. Create GitHub Issue
```javascript
// Use MCP GitHub server to create issue
mcp__github__create_issue({
  owner: "username",
  repo: "ckye-fe",
  title: `todo: ${task_summary}`,
  body: `## Task
${task_description}

## Source
From todos.md

## Acceptance Criteria
- [ ] Task completed as described
- [ ] All tests passing
- [ ] Code follows project standards
- [ ] Documentation updated if needed`,
  labels: ["todo", "automated"]
})
```

#### B. Create Feature Branch
```javascript
// First get the default branch
const repoInfo = await mcp__github__get_me();

// Create new branch via MCP
mcp__github__create_branch({
  owner: "username",
  repo: "ckye-fe",
  branch: `${branch_type}/${task_slug}`,
  from_branch: "main" // or master
})

// Then checkout locally
git checkout -b ${branch_type}/${task_slug}
git pull origin ${branch_type}/${task_slug}
```

#### C. Implement Changes
- Navigate to correct directory (ckye-fe for frontend tasks)
- Make required code changes following CLAUDE.md standards
- If creating components:
  - Follow atomic design structure
  - Use functional components with hooks
  - SCSS modules with BEM methodology
  - Import existing components when possible
- If fixing bugs:
  - Identify root cause
  - Implement fix
  - Add tests to prevent regression

#### D. Pre-PR Checks (MANDATORY)
```bash
# Navigate to project root
cd /Users/jack/Documents/Projects/Ckye/ckye-fe

# 1. Run linting
npm run lint
# Fix any issues: npm run lint -- --fix

# 2. Run type checking
npm run typecheck
# Resolve all TypeScript errors

# 3. Run tests
npm run test
# Ensure all tests pass

# 4. Run build
npm run build
# Verify production build succeeds
```

#### E. Commit and Push Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "$(cat <<'EOF'
${commit_type}: ${task_summary}

- ${change_detail_1}
- ${change_detail_2}
- ${change_detail_3}

Closes #${issue_number}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Push to remote
git push -u origin ${branch_name}
```

#### F. Create Pull Request via MCP
```javascript
// Create PR using MCP GitHub server
mcp__github__create_pull_request({
  owner: "username",
  repo: "ckye-fe",
  title: `${pr_type}: ${task_summary}`,
  head: `${branch_name}`,
  base: "main",
  body: `## Summary
${task_description}

## Changes
- ${change_1}
- ${change_2}
- ${change_3}

## Testing
- [x] Linting passed
- [x] Type checking passed
- [x] All tests passed
- [x] Production build successful

## Related Issue
Closes #${issue_number}

🤖 Generated with [Claude Code](https://claude.ai/code)`,
  draft: false
})
```

#### G. Record PR Creation
```javascript
// Use MCP database server to record PR
mcp__database-connect__record-pr-creation({
  prId: pr_number,
  pageId: "cme78g7a700018ovg8p0ijuv0" // From CLAUDE.md
})

// Then check and update PR statistics
// Execute check-pr-statuses.md command
```

#### H. Request Copilot Code Review
```javascript
// Request automated Copilot review for code quality and best practices
mcp__github__request_copilot_review({
  owner: owner,
  repo: "ckye-fe",
  pullNumber: pr.number
})

// Copilot will automatically:
// - Review code for security vulnerabilities
// - Check for code quality issues
// - Suggest improvements and optimizations
// - Identify potential bugs
// - Ensure best practices are followed
```

### 3. Interactive Mode

For each todo, ask the user if unclear:
- "What should happen when [specific interaction]?"
- "Which atomic level for this component (atoms/molecules/organisms)?"
- "Should this replace an existing component or create new?"
- "Any specific requirements for this task?"

### 4. Error Handling

If any check fails:
- **DO NOT** create PR
- Fix issues in current branch
- Re-run all checks
- Only proceed when all checks pass

### 5. Task Categories

Identify todo type and apply appropriate workflow:

**Component Creation:**
- Follow create-component.md protocols
- Use Figma integration if design provided
- Place in correct atomic level
- Reuse existing components

**Bug Fixes:**
- Create detailed issue with steps to reproduce
- Branch naming: `fix/description`
- Add regression tests

**Feature Additions:**
- Create feature specification
- Branch naming: `feature/description`
- Update documentation

**Refactoring:**
- Maintain existing functionality
- Branch naming: `refactor/description`
- Ensure all tests still pass

**Documentation:**
- Update relevant .md files
- Branch naming: `docs/description`
- Include examples

### 6. Completion Tracking

After each todo is processed:
- Mark as complete in todos.md
- Update with PR link
- Note any blockers or issues

### Example Execution Flow with MCP

```javascript
// 1. Read todos.md
const todos = Read("/Users/jack/Documents/Projects/Ckye/todos.md");

// 2. Get repository info
const userInfo = await mcp__github__get_me();
const owner = userInfo.login;

// 3. For first todo "Fix navigation dropdown alignment"
const issue = await mcp__github__create_issue({
  owner: owner,
  repo: "ckye-fe",
  title: "fix: Navigation dropdown alignment",
  body: "Fix alignment issues in navigation dropdown",
  labels: ["bug", "todo"]
});

// 4. Create branch
await mcp__github__create_branch({
  owner: owner,
  repo: "ckye-fe",
  branch: "fix/navigation-dropdown-alignment",
  from_branch: "main"
});

// 5. Checkout locally and make changes
git checkout -b fix/navigation-dropdown-alignment
// ... implement fixes ...

// 6. Run all checks
npm run lint
npm run typecheck  
npm run test
npm run build

// 7. If all pass, commit and push
git add .
git commit -m "fix: Navigation dropdown alignment"
git push -u origin fix/navigation-dropdown-alignment

// 8. Create PR via MCP
const pr = await mcp__github__create_pull_request({
  owner: owner,
  repo: "ckye-fe",
  title: "fix: Navigation dropdown alignment",
  head: "fix/navigation-dropdown-alignment",
  base: "main",
  body: "Fixes #" + issue.number
});

// 9. Record PR in database
await mcp__database-connect__record-pr-creation({
  prId: pr.number.toString(),
  pageId: "cme78g7a700018ovg8p0ijuv0"
});

// 10. Request Copilot code review
await mcp__github__request_copilot_review({
  owner: owner,
  repo: "ckye-fe",
  pullNumber: pr.number
});

// 11. Move to next todo
```

### MCP GitHub Functions Reference

**Issue Management:**
- `mcp__github__create_issue` - Create new issue
- `mcp__github__get_issue` - Get issue details
- `mcp__github__update_issue` - Update existing issue
- `mcp__github__add_issue_comment` - Add comment to issue

**Branch Management:**
- `mcp__github__create_branch` - Create new branch
- `mcp__github__list_branches` - List all branches

**Pull Request Management:**
- `mcp__github__create_pull_request` - Create new PR
- `mcp__github__get_pull_request` - Get PR details
- `mcp__github__update_pull_request` - Update PR
- `mcp__github__merge_pull_request` - Merge PR
- `mcp__github__request_copilot_review` - Request Copilot code review

**File Management:**
- `mcp__github__create_or_update_file` - Create/update single file
- `mcp__github__push_files` - Push multiple files
- `mcp__github__get_file_contents` - Read file from repo

**Database Recording:**
- `mcp__database-connect__record-pr-creation` - Record PR in database
- `mcp__database-connect__update-page-statistics` - Update statistics

### Important Notes

- **ALWAYS** run all checks before creating PR
- **NEVER** skip tests or linting
- **ASK** user when requirements unclear
- **FOLLOW** CLAUDE.md standards strictly
- **REUSE** existing components when possible
- **DOCUMENT** any new patterns or components
- **USE** MCP servers for all GitHub operations