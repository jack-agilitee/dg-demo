## PR Review - Post-Implementation Review and CLAUDE.md Improvements

**Command:** PR Review

**Purpose:** 
This command is called after a developer has used an original command (like create-component) that didn't fully succeed on the first attempt, requiring manual fixes or additional prompting. It reviews the changes, commits them, and suggests improvements to CLAUDE.md based on what the user had to fix.

**Process:**
1. Stage and commit all current changes
2. Review the PR comprehensively (like in create-component)
3. Analyze the delta between what was originally generated and what the user had to fix
4. Generate improved CLAUDE.md content based on lessons learned
5. Write improvements to database using MCP tools
6. Check if 50+ suggestions exist and mesh them into a comprehensive variant
7. Save the meshed variant to the database

**Implementation Steps:**

```bash
# 1. Check current git status to see what files have been modified
git status

# 2. Review all changes to understand what was modified
git diff

# 3. Stage all changes
git add .

# 4. Create a descriptive commit message based on the changes
git commit -m "fix: address issues from initial component generation

- [List specific fixes made by user]
- [Include any additional functionality added]
- [Note any patterns or conventions that were corrected]

These changes were necessary after initial generation to meet project requirements."

# 5. Push the changes
git push

# 6. Get the current PR number (if exists)
PR_NUMBER=$(gh pr list --head $(git branch --show-current) --json number --jq '.[0].number')

# 7. Review the full PR diff to understand all changes
gh pr diff $PR_NUMBER

# 8. Add comprehensive review comment to the PR
gh pr comment $PR_NUMBER --body "## Post-Implementation Review 🔍

### Changes Made After Initial Generation:
[Analyze and list all changes the user had to make]

### Code Quality Assessment:
- ✅ Next.js/React best practices compliance
- ✅ TypeScript/JavaScript type safety
- ✅ Security review completed
- ✅ Test coverage adequate
- ✅ Documentation updated
- ✅ Accessibility standards met
- ✅ Performance optimized

### Issues Addressed:
[List specific issues that were fixed after initial generation]

### Patterns Identified:
[Note any recurring patterns or conventions that weren't followed initially]

**Review Status:** Changes improve code quality and align with project standards ✅"

# 9. Analyze what went wrong and generate improved CLAUDE.md content
```

**Database Integration for CLAUDE.md Improvements:**

After reviewing the changes, follow these steps:

1. **Generate Improved CLAUDE.md Content:**
   - Read the current CLAUDE.md file
   - Analyze the fixes that were required
   - Create an improved version that incorporates lessons learned
   - Focus on patterns, conventions, and specific examples

2. **Write to Database:**
   - Use the MCP tool `mcp__database-connect__write-suggestion` to save the improved CLAUDE.md content
   - Extract the workspace ID from the `ID:` line at the top of CLAUDE.md file (e.g., `ID: cme78g7a700018ovg8p0ijuv0`)
   - Pass this ID as the `workspaceId` parameter to the tool
   - The tool will automatically track the suggestion count

3. **Check for Meshing Threshold:**
   - Use the MCP tool `mcp__database-connect__check-and-mesh-suggestions` to check if 50+ suggestions exist
   - If 50+ suggestions exist, the tool will return all suggestion contents

4. **Mesh Suggestions (if threshold met) - MAXIMUM COMPRESSION:**
   - If 50+ suggestions are returned, analyze all of them
   - **CRITICAL: Create the SMALLEST possible CLAUDE.md without losing ANY value**
   - Compression strategies:
     * Remove ALL redundancy - if something is said once, never repeat it
     * Combine similar patterns into single, comprehensive rules
     * Use concise bullet points instead of paragraphs
     * Replace verbose explanations with clear, minimal examples
     * Merge overlapping concepts into unified guidelines
     * Remove filler words and unnecessary context
     * Use shorthand notation where clear (e.g., "FC" for functional components)
     * Consolidate error patterns into single "NEVER do X, ALWAYS do Y" statements
   - Organize by priority categories (most important first)
   - Each rule should be actionable and specific
   - Prefer code examples over text descriptions where shorter

5. **Save Meshed Variant:**
   - Use the MCP tool `mcp__database-connect__write-variant` to save the meshed content
   - Generate a one-sentence summary of the key changes/improvements in the meshed CLAUDE.md
   - Pass both the content and summary to the write-variant tool
   - This creates a new comprehensive version incorporating all 50 suggestions

6. **Clean Up Old Suggestions:**
   - After successfully saving the variant, use `mcp__database-connect__delete-suggestions`
   - This deletes all processed suggestions for the workspace
   - Ensures a clean slate for the next iteration of improvements

**Example Workflow:**

```javascript
// Step 1: Read current CLAUDE.md
const currentContent = await readFile('./CLAUDE.md');

// Step 2: Generate improved version based on fixes
const improvedContent = generateImprovedCLAUDEmd(currentContent, fixesAnalysis);

// Step 3: Extract workspace ID from CLAUDE.md and write to suggestions table
const workspaceId = currentContent.match(/^ID:\s*([a-z0-9]+)/m)?.[1];
await mcp__database-connect__write-suggestion({
  content: improvedContent,
  workspaceId: workspaceId
});

// Step 4: Check if we have 50+ suggestions
const checkResult = await mcp__database-connect__check-and-mesh-suggestions({
  workspaceId: workspaceId
});

// Step 5: If ready to mesh, create MAXIMALLY COMPRESSED version
if (checkResult.status === "ready_to_mesh") {
  const meshedContent = compressAndMeshSuggestions(checkResult.suggestions);
  
  // Generate a one-sentence summary of the changes
  const summary = generateSummary(meshedContent); // e.g., "Enhanced component patterns with improved SCSS practices, added React hooks best practices, and clarified API integration guidelines."
  
  // Step 6: Save the variant with summary
  await mcp__database-connect__write-variant({
    content: meshedContent,
    summary: summary,
    workspaceId: workspaceId
  });
  
  // Step 7: Delete old suggestions after successful variant creation
  await mcp__database-connect__delete-suggestions({
    workspaceId: workspaceId
  });
}
```

**Review Checklist:**
- [ ] All changes have been committed
- [ ] PR has been reviewed and commented on
- [ ] Delta between original and fixed code has been analyzed
- [ ] Patterns and conventions have been identified
- [ ] Improved CLAUDE.md content has been generated
- [ ] Suggestion has been written to database
- [ ] Checked for 50+ suggestions threshold
- [ ] Meshed variant created and saved (if threshold met)
- [ ] Examples are provided where helpful

**Common Issues to Look For:**
1. **Styling Issues:**
   - Missing SCSS variable imports
   - Incorrect BEM naming conventions
   - Hardcoded colors instead of variables
   - Missing typography mixins

2. **Component Structure:**
   - Missing atomic design patterns
   - Not reusing existing components
   - Incorrect file organization
   - Missing 'use client' directive for interactive components

3. **React Patterns:**
   - Using class components instead of functional
   - Incorrect hook usage
   - Missing state management patterns
   - Props validation issues

4. **Next.js Specific:**
   - Server vs Client component confusion
   - Missing Image component for icons
   - Incorrect routing patterns
   - API route issues

5. **Testing:**
   - Insufficient test coverage
   - Missing edge cases
   - Incorrect test patterns

6. **Documentation:**
   - Missing usage examples
   - Incomplete prop documentation
   - No Figma references
   - Missing atomic design level explanation

**Database Operations Output:**
When using the MCP tools, you'll see:
- Confirmation when suggestion is saved with ID and count
- Status message when checking for 50+ suggestions
- If threshold met: All suggestions will be returned for meshing
- Confirmation when variant is saved with ID and summary
- Confirmation of deleted suggestions count after variant creation

**Summary Generation Guidelines:**
When creating a summary for the variant:
- Keep it to ONE sentence (max 150 characters)
- Focus on the main categories of improvements
- Use action words: "Enhanced", "Improved", "Added", "Clarified", "Strengthened"
- Example summaries:
  - "Enhanced React patterns, improved SCSS practices, and clarified database access rules."
  - "Added atomic design examples, strengthened TypeScript usage, and updated API patterns."
  - "Improved component structure, added performance optimizations, and clarified state management."

**COMPRESSION ALGORITHM FOR MESHING:**

When meshing 50+ suggestions into a single CLAUDE.md:

1. **Deduplication Phase:**
   - Identify all duplicate rules/patterns across suggestions
   - Keep only the most comprehensive version of each rule
   - Merge similar rules into single statements

2. **Compression Phase:**
   - Replace verbose explanations with concise rules
   - Convert multi-line descriptions to single-line directives
   - Use code snippets ONLY when shorter than text explanation
   - Remove all transitional phrases ("In order to", "You should", etc.)
   - Replace "Do not use X, instead use Y" with "Use Y, not X"

3. **Optimization Phase:**
   - Group related rules under minimal headers
   - Use abbreviations consistently (FC, SCSS, API, etc.)
   - Combine error prevention into existing rules
   - Remove examples that duplicate the rule statement
   - Consolidate file paths and imports into single references

4. **Priority Ordering:**
   - Place most violated rules first
   - Group by impact: Breaking changes > Errors > Warnings > Style
   - Put project-specific rules before generic best practices

5. **Format for Maximum Density:**
   ```markdown
   # CLAUDE.md [ID]
   
   ## Critical Rules
   - NEVER use class components, ALWAYS FC with hooks
   - ALWAYS import SCSS variables: `@import 'path/variables'`
   - API calls ONLY in /api routes, NEVER in components
   
   ## Commands
   npm run build|dev|lint [from ckye-fe/]
   
   ## Structure
   components/atoms|molecules|organisms
   ```

**Compression Metrics Target:**
- Reduce total character count by 60-80%
- Maintain 100% of actionable information
- Zero redundancy between rules
- Maximum 3 lines per concept

**Important Notes:**
- DO NOT modify CLAUDE.md file directly - use database tools
- Generate COMPRESSED improved CLAUDE.md content
- Focus on patterns that would prevent similar issues in the future
- When meshing 50 suggestions, create SMALLEST possible document
- Include ONLY essential examples
- Organize by priority, not categories
- Remove ALL duplicates and merge similar patterns