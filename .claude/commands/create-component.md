## Create a New Component from Figma

**Command:** Create a new component

**CRITICAL RULES:**
- **NEVER stop to ask the user questions.** Make every decision yourself and keep executing.
- **Maximize parallel agent launches.** Independent agents MUST run simultaneously.
- **Speed is everything.** The user should be able to run this and walk away.
- The only user input is the Figma URL provided when invoking the command.
- If Code Connect mappings are missing, send empty mappings `[]` and move on immediately.
- **Every numbered step below maps to a specific agent.** Use the `Agent` tool with the `subagent_type` shown.

---

## Process

### Phase 1: Extract Design (you + figma-design-extractor)

**Step 1 — Parse Figma URL and extract design context**
- Extract `fileKey` and `nodeId` from the URL (e.g., `node-id=1-2` → `1:2`)
- Load the `figma:figma-use` skill, then call `get_design_context` with fileKey + nodeId
- If Code Connect says components are unmapped → send empty mappings `[]` immediately

**Step 2 — Analyze design with figma-design-extractor** (in parallel with Step 1 asset downloads)

```
Agent(subagent_type="figma-design-extractor")
```

Provide: Figma URL, fileKey, nodeId, the raw `get_design_context` output (code + screenshot).

Expect back:
- Component name (PascalCase)
- Atomic design level recommendation
- Interactive elements inventory (buttons, links, inputs → prop types)
- Design token specs (colors, typography, spacing, shadows)
- Asset inventory (all image URLs to download)
- Implementation notes

### Phase 2: Determine Structure (atomic-design-architect)

**Step 3 — Confirm atomic level and composition strategy**

```
Agent(subagent_type="atomic-design-architect")
```

Provide: Component name, figma-design-extractor analysis, list of existing components in `components/`.

Expect back:
- Confirmed atomic level (atom/molecule/organism/template/page)
- Component directory path (`components/{level}/{ComponentName}/`)
- Existing components to reuse
- Dependency map and import structure

### Phase 3: Setup (git-github-specialist + asset downloads) — ALL IN PARALLEL

**Step 4 — Create GitHub issue + feature branch + download assets**

```
Agent(subagent_type="git-github-specialist")
```

Provide: Component name, atomic level, Figma URL, repo `jack-agilitee/dg-demo`.

Expect back:
- GitHub issue number and URL
- Feature branch name (e.g., `feature/rewards-card`)
- Confirmation branch is checked out locally

**In parallel with the agent above**, download ALL Figma assets yourself:

**CRITICAL: SVG vs PNG handling — `get_design_context` URLs only return PNGs.**
Use the figma-design-extractor's asset inventory to determine format. For each asset:

1. **PNG/JPG assets** (photos, complex raster backgrounds) — download via curl:
```bash
mkdir -p public/${component-name-kebab}/
curl -sL "${asset-url}" -o public/${component-name-kebab}/${asset-name}.png
```

2. **SVG assets** (icons, logos, simple vector graphics) — export via Figma Plugin API:
   - Use the **Figma node name** from the extractor's asset inventory
   - Load `figma:figma-use` skill, then call `use_figma` with a script that:
     a. Gets the parent component node by ID
     b. Traverses children to find nodes matching the asset's node name
     c. Calls `exportAsync({ format: 'SVG_STRING' })` on each vector node
     d. Returns the SVG strings
   - Write each SVG string to `public/${component-name-kebab}/${asset-name}.svg`

**NEVER save vector content as .png. Icons, logos, and simple graphics MUST be .svg files.**

### Phase 4: Build Component — ALL THREE AGENTS IN PARALLEL

**Step 5 — Create React component file**

```
Agent(subagent_type="react-component-developer")
```

Provide:
- Full Figma design context (code, screenshot, design tokens)
- Component name, atomic level, directory path
- Props interface (from figma-design-extractor interactive elements analysis)
- Asset paths in `public/${component-name-kebab}/`
- Existing SCSS variables from `styles/_variables.scss` (create if doesn't exist)
- Existing SCSS mixins from `styles/_mixins.scss` (create if doesn't exist)
- Project standards: functional components, hooks only, `'use client'` if interactive, Next.js `Image` for all assets, `className={styles['block__element']}` pattern

Expect back:
- `components/{level}/{ComponentName}/{ComponentName}.tsx`
- TypeScript interface for props
- If `styles/_variables.scss` or `styles/_mixins.scss` don't exist, create them

**Step 6 — Create SCSS module**

```
Agent(subagent_type="style-engineer")
```

Provide:
- Full Figma design context (code, screenshot, design tokens)
- Component name, atomic level, directory path
- Design token specs from figma-design-extractor
- Existing `styles/_variables.scss` and `styles/_mixins.scss` content
- Project standards: BEM methodology, SCSS Modules, no hardcoded colors/fonts, `@use` imports

Expect back:
- `components/{level}/{ComponentName}/{ComponentName}.module.scss`
- Updates to `styles/_variables.scss` if new tokens needed
- Updates to `styles/_mixins.scss` if new mixins needed

**Step 7 — Create test suite**

```
Agent(subagent_type="test-suite-developer")
```

Provide:
- Component name, props interface, interactive behaviors
- Component file path
- Accessibility requirements (keyboard nav, ARIA roles)
- Target: >90% coverage
- **IMPORTANT: Tell the agent that testing infrastructure (jest, config, mocks) already exists. It should ONLY write the .test.tsx file. No installing packages, no creating config files, no creating __mocks__ directories.**

Expect back:
- `components/{level}/{ComponentName}/{ComponentName}.test.tsx`
- Nothing else — no config files, no mock files, no package installs

### Phase 5: Documentation + Showcase — BOTH AGENTS IN PARALLEL

**Step 8 — Write component documentation**

```
Agent(subagent_type="documentation-specialist")
```

Provide:
- Component name, props interface, atomic level
- Figma design URL
- Usage examples
- Accessibility features

Expect back:
- `docs/${ComponentName}.md`

**Step 9 — Add to showcase page**

```
Agent(subagent_type="showcase-page-manager")
```

Provide:
- Component name, import path, atomic level
- Props for 2-3 meaningful demo variants
- Existing showcase page content (if `app/showcase/page.tsx` exists)

Expect back:
- Updated or created `app/showcase/page.tsx`

### Phase 6: Verify

**Step 10 — Lint and type check**
Run yourself (not an agent):
```bash
npm run lint
npm run lint -- --fix  # if lint fails
```

### Phase 7: Ship (git-github-specialist)

**Step 11 — Commit, push, create PR**

```
Agent(subagent_type="git-github-specialist")
```

Provide:
- All files created/modified (list them)
- Component name, issue number
- Commit message: `feat: add ${ComponentName} component from Figma design\n\nCloses #${issue-number}`
- PR title: `feat: Add ${ComponentName} component`
- PR body with: summary, Figma link, files added, test plan
- After PR creation: add comment `Page ID: cme78g7a700018ovg8p0ijuv0`

Expect back:
- PR URL

### Phase 8: Quality Gates — BOTH AGENTS IN BACKGROUND

**Step 12 — Visual testing**

```
Agent(subagent_type="visual-testing-specialist", run_in_background=true)
```

Provide: Component name, showcase page route `/showcase`, Figma URL, Figma screenshot for comparison.

**Step 13 — Code review**

```
Agent(subagent_type="code-review-specialist", run_in_background=true)
```

Provide: PR number, repo, project standards from CLAUDE.md.

---

## Agent Mapping Summary

| Step | Agent | Parallel Group |
|------|-------|---------------|
| 1 | (self) — Figma extraction | A |
| 2 | `figma-design-extractor` | A |
| 3 | `atomic-design-architect` | — |
| 4 | `git-github-specialist` | B |
| 4b | (self) — asset downloads | B |
| 5 | `react-component-developer` | C |
| 6 | `style-engineer` | C |
| 7 | `test-suite-developer` | C |
| 8 | `documentation-specialist` | D |
| 9 | `showcase-page-manager` | D |
| 10 | (self) — lint/typecheck | — |
| 11 | `git-github-specialist` | — |
| 12 | `visual-testing-specialist` | E (background) |
| 13 | `code-review-specialist` | E (background) |

**Parallel groups** (same letter = launch simultaneously):
- **A**: Figma extraction + design analysis
- **B**: GitHub setup + asset downloads
- **C**: Component TSX + SCSS + Tests (all three at once)
- **D**: Documentation + Showcase
- **E**: Visual testing + Code review (background, non-blocking)

---

## Key Standards (from CLAUDE.md)
- Functional components only, React hooks, no classes
- SCSS Modules + BEM naming — no Tailwind, no hardcoded colors/fonts
- `className={styles['block__element']}` pattern
- Next.js Image component for all icons (downloaded from Figma to public/)
- No index.ts barrel files — import directly from ComponentName.tsx
- async/await only, never .then()/.catch()
- `'use client'` directive on all interactive components
