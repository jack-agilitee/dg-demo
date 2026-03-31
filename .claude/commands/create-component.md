## Create a New Component from Figma

**Command:** Create a new component

**Process:**
1. Prompt user for Figma URL
2. Extract node ID from URL (e.g., node-id=1-2 becomes 1:2)
3. Use Figma MCP tools to validate and extract component details
4. **Check for user interactions in the design** - examine the component for any interactive elements like buttons, links, form inputs, or clickable areas
5. **If user interactions are found:**
   - Call out each interactive element specifically
   - Ask what should happen when users interact with each element
   - Request any relevant designs for post-interaction states (hover, pressed, error states, etc.)
   - Ask for designs showing what happens AFTER user interactions (navigation, modals, form submissions, etc.)
6. **Check for icons in the design** - if the component includes any icons:
   - Ask the user for the path to the icon file in the project (e.g., `/public/icon-name.svg`)
   - Use Next.js Image component to load icons from the provided path
   - Never create inline SVGs or embed icon code directly
7. Generate component name from Figma data
8. **Ask user for atomic design level** - determine where in the components folder structure the component should be placed:
   - **atoms**: Basic building blocks (buttons, inputs, labels, icons)
   - **molecules**: Simple combinations of atoms (form fields, cards, list items)
   - **organisms**: Complex components made of molecules/atoms (forms, lists, navigation)
   - **templates**: Page layouts and structures
   - **pages**: Complete page components
9. **Analyze component composition** - check if the component can be built using existing atomic elements:
   - For molecules: check if any existing atoms can be reused (Button, TextField, Dropdown, Chip, etc.)
   - For organisms: check if any existing atoms or molecules can be reused
   - Import and compose with existing components rather than duplicating functionality
   - Only create new sub-components if they don't already exist
10. Create GitHub issue for component development
11. Create feature branch: `feature/${component-name}`
12. Generate component following Next.js and React best practices from CLAUDE.md
13. Create comprehensive test suite
14. Add documentation to docs folder
15. Add component to showcase page in the appropriate atomic design section
16. **Visual testing with Playwright against Figma** - use the `.claude/agents/visual-testing-specialist.md` agent to visually test the new component:
    - Compare the rendered component on the showcase page against the original Figma design
    - Run Playwright visual regression tests to verify pixel-accurate implementation
    - Report any visual discrepancies found between the implementation and the Figma design
    - Fix any visual issues before proceeding
17. Push branch and create pull request
17. Review PR using code-reviewer subagent:
    - Use Task tool with subagent_type="code-reviewer"
    - Check adherence to project standards
    - Verify security best practices
    - Ensure proper testing coverage
18. Link PR to GitHub issue and close issue when PR is completed

**Implementation Steps:**
```bash
# 1. Get Figma URL from user input
# Example: https://figma.com/design/fileKey/fileName?node-id=1-2

# 2. Extract node ID and validate with Figma MCP
# Use mcp__figma-dev-mode-mcp-server__get_image to verify component exists
# Use mcp__figma-dev-mode-mcp-server__get_code to get component code

# 3. Create GitHub issue for component development
gh issue create --title "feat: Add ${component-name} component from Figma design" --body "## Description
Create a new ${component-name} component based on Figma design.

## Figma Reference
- URL: [Figma URL]
- Node ID: [Node ID]

## Tasks
- [ ] Generate component structure
- [ ] Implement component logic
- [ ] Add comprehensive tests
- [ ] Create documentation
- [ ] Ensure accessibility compliance

## Acceptance Criteria
- Component follows Next.js/React best practices
- Test coverage >90%
- Documentation includes usage examples
- Passes all linting checks"

# 4. Create and checkout feature branch
git checkout -b feature/${component-name}

# 5. Ask user for atomic design level
# Prompt: "Where should this component be placed in the atomic design structure?"
# - atoms: Basic building blocks (buttons, inputs, labels, icons)
# - molecules: Simple combinations of atoms (form fields, cards, list items)  
# - organisms: Complex components made of molecules/atoms (forms, lists, navigation)
# - templates: Page layouts and structures
# - pages: Complete page components

# 6. Analyze existing components for reuse
# Check src/components/${lower-levels} for existing components that can be composed:
# - For molecules: check atoms/ directory
# - For organisms: check atoms/ and molecules/ directories
# List all components that can be reused and plan composition strategy

# 7. Generate component with full structure
# IMPORTANT: Navigate to ckye-fe folder first (project root)
cd ckye-fe
# Create component directory in appropriate atomic level
mkdir -p src/components/${atomic-level}/${component-name}

# 7. Create component files following CLAUDE.md patterns:
# - ${component-name}.jsx (functional React component with CSS modules import)
# - ${component-name}.module.scss (with nested BEM methodology and SCSS imports)
# - ${component-name}.test.jsx (comprehensive tests)
# IMPORTANT: DO NOT create index.js files - components should be imported directly from their .jsx files
# IMPORTANT: Import and use existing atomic components rather than recreating functionality

# 8. Create documentation
# Add file to docs/${component-name}.md with:
# - Figma URL reference
# - Usage examples
# - Props documentation
# - Testing information

# 9. Run tests and linting (from ckye-fe folder)
npm run test && npm run lint

# 10. Add component to showcase page
# Update src/app/showcase/page.jsx to include the new component in the appropriate section
# Follow the existing SearchBar example structure:
# - Import the component at the top
# - Add a new showcase__component div in the correct atomic section
# - Include component title, description, and multiple examples
# - Add usage code snippet

# 11. Visual testing with Playwright against Figma
# Use the visual-testing-specialist agent to validate the component visually:
# Agent(
#   subagent_type="visual-testing-specialist",
#   description="Visual test new component against Figma",
#   prompt="Use Playwright to visually test the newly added ${component-name} component on the
#     showcase page. Compare the rendered component against the original Figma design at [Figma URL].
#     Steps:
#     1. Navigate to the showcase page (e.g. http://localhost:3000/showcase)
#     2. Take a screenshot of the ${component-name} section
#     3. Compare it pixel-by-pixel against the Figma design export
#     4. Report all visual discrepancies (spacing, color, typography, layout)
#     5. Verify all interactive states (hover, focus, disabled) match the Figma design
#     Fix any issues found before proceeding."
# )

# 12. Commit and push
git add .
git commit -m "feat: add ${component-name} component from Figma design

- Implemented ${component-name} component from Figma design
- Added comprehensive tests and documentation
- Added component to showcase page

Closes #[issue-number]"
git push -u origin feature/${component-name}

# 12. Create pull request linked to GitHub issue
gh pr create --title "feat: Add ${component-name} component from Figma design" --body "## Description
Implements ${component-name} component based on Figma design.

## Changes
- Added component structure with Next.js/React best practices
- Implemented comprehensive test suite
- Created documentation with usage examples
- Ensured accessibility compliance

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser compatibility verified

# 13. Review PR using code-reviewer subagent
# Invoke the code review after PR creation:
# Task(
#   subagent_type="code-reviewer",
#   description="Review new component PR",
#   prompt="Review the ${component-name} component PR for:
#     - Adherence to CLAUDE.md standards (functional components, SCSS modules, BEM)
#     - Proper React hooks and Next.js patterns
#     - SCSS using variables/mixins from styles folder
#     - Security vulnerabilities
#     - Performance issues
#     - Test coverage adequacy
#     Provide actionable feedback for any issues found."
# )

Closes #[issue-number]"

# 13. Review the PR for code quality and security
# Use gh pr view to examine the changes and review for:
# - Next.js/React best practices compliance
# - TypeScript/JavaScript type safety
# - Security vulnerabilities (XSS, injection attacks, etc.)
# - Performance considerations
# - Accessibility compliance
# - Test coverage and quality
# - Documentation completeness

# Review checklist:
gh pr view [pr-number] --comments
gh pr diff [pr-number]

# Add review comments if issues found:
gh pr comment [pr-number] --body "## Code Review Findings

### Issues Found:
- [List any issues]

### Recommendations:
- [List recommendations]

Please address these issues before merging."

# If no issues found, add approval comment:
gh pr comment [pr-number] --body "## Code Review Complete ✅

Reviewed this PR and found **0 issues**. 

### Review Summary:
- ✅ Next.js/React best practices followed
- ✅ TypeScript/JavaScript types properly defined
- ✅ No security vulnerabilities detected
- ✅ Test coverage >90%
- ✅ Documentation complete
- ✅ Accessibility compliant
- ✅ Performance optimized

**Approved for merge** 🚀"

# 14. Issue will be automatically closed when PR is merged due to "Closes #[issue-number]" in commit message
```

**Template Structure:**
- Component follows Next.js/React best practices from CLAUDE.md
- Uses functional components with React hooks
- **NO index.js files** - import components directly from their .jsx files
- **Icons use Next.js Image component** - always ask user for icon file paths
- **Atomic Design Pattern**: Components organized in atoms/molecules/organisms/templates/pages
- **CSS Modules with SCSS**: `import styles from './ComponentName.module.scss'`
- **BEM methodology**: `.component-name`, `.component-name__element`, `.component-name--modifier`
- **SCSS imports**: Always include appropriate relative imports to styles folder
- **Class references**: `className={styles['component-name']}` or `className={styles.componentName}`
- Includes Server Component by default, Client Component when interactive
- Comprehensive test suite with >90% coverage
- Documentation with usage examples and API reference

**Component Template:**
```jsx
'use client'; // Only if interactive

import { useState } from 'react'; // If needed
import Image from 'next/image'; // If icons are needed
// Import existing atomic components as needed
import Button from '@/components/atoms/Button/Button';
import TextField from '@/components/atoms/TextField/TextField';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import Chip from '@/components/atoms/Chip/Chip';
// Import other components based on atomic level
import styles from './ComponentName.module.scss';

const ComponentName = ({ title, variant = 'default', onAction }) => {
  // Component logic here

  return (
    <div className={styles['component-name']}>
      <h2 className={styles['component-name__title']}>{title}</h2>
      {/* Compose with existing atomic components when possible:
      <TextField 
        label="Name"
        placeholder="Enter name"
        value={value}
        onChange={onChange}
      />
      <Button onClick={onAction}>
        Submit
      </Button>
      */}
      {/* If component has icons, use Image component with user-provided path:
      <Image 
        src="/icon-name.svg"  // Path provided by user
        alt=""
        width={16}
        height={16}
        className={styles['component-name__icon']}
      />
      */}
      {/* More JSX using styles['class-name'] pattern */}
    </div>
  );
};

export default ComponentName;
```

**SCSS Template:**
```scss
@import '../../../styles/variables'; // Adjust path based on atomic level
@import '../../../styles/mixins';

.component-name {
  // Block styles
  background-color: $background-dark;
  padding: 20px;

  &__title {
    // Element styles
    color: $text-primary;
    font-size: 24px;
    margin-bottom: 16px;
  }

  &__content {
    // Another element
    display: flex;
    gap: 12px;
  }

  // Modifiers
  &--large {
    padding: 32px;
  }

  &--primary {
    background-color: $primary-color;
  }

  // States
  &:hover {
    background-color: rgba($white, 0.05);
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
