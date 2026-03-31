# Purina Demo Command

This command creates a data visualization dashboard based on JIRA ticket requirements.

## Overview
Creates a static dashboard at `/purina-demo` route that fetches requirements from a Jira ticket, queries the database accordingly, and displays the results with appropriate visualizations.

## Execution Steps

### Step 1: Fetch Jira Ticket
- Use Atlassian MCP to fetch the specified ticket (default: CKYE-13)
- Extract and analyze the requirements to understand what data needs to be displayed
- Identify key metrics, entities, and relationships mentioned

### Step 2: Analyze & Query Database
- Based on ticket requirements, explore available tables using `explore-database-schema`
- Look for tables that match the business domain mentioned in the ticket
- Use efficient query patterns like `json_agg(row_to_json(t))` for fetching complete datasets
- Execute queries via PostgreSQL MCP's `query-database` tool
- Collect all results for visualization
- **NOTE**: Tables may be added dynamically - always check what's available

### Step 3: Create Static Page Component
Location: `/src/app/purina-demo/page.jsx`

**IMPORTANT: Store query results as static data arrays in the component**
- Do NOT create API routes
- Embed the fetched data directly in the component as const arrays
- This creates a static snapshot for demo purposes

## Visualization Best Practices

### Choose the Right Visualization Type

#### Use Histograms/Bar Charts When:
- Showing percentages or rates (completion %, success rates)
- Comparing categories or groups
- Data has meaningful magnitude differences
- **DON'T** show redundant data (e.g., both count and percentage)
- **DO** use single data series for clarity
- **DO** use thick bars (barSize={40}) for better visibility
- **DO** use brand colors (Purina: #8B0000)

#### Use Ranked Lists When:
- Displaying people, items, or entities with counts
- Data is discrete and needs individual identification
- Context matters (names, titles, departments)
- You need to show top/bottom N items
- Include rank numbers, visual progress bars, and exact counts

#### Use Visual Lists When:
- Many values are zero or near-zero (invisible bars problem)
- Need to emphasize critical/failing items
- Color-coding by severity is important
- Text labels are more important than relative size

#### Use Summary Cards When:
- Showing KPIs or high-level metrics
- Need prominent display of 3-4 key numbers
- Want to provide at-a-glance overview

### Data Handling Guidelines

1. **Analyze the data distribution first**
   - Check for zero/null values that won't show in charts
   - Identify if data is continuous or discrete
   - Determine if ranking or grouping makes more sense

2. **Consider the audience**
   - Managers need actionable insights, not raw data
   - Use color coding for quick severity assessment
   - Provide specific names/items for follow-up action

3. **Avoid common mistakes**
   - Don't use line charts for non-continuous data
   - Don't create charts where most bars are invisible
   - Don't show multiple related metrics that confuse (counts + percentages)
   - Don't use overly complex visualizations when lists work better

## Styling Specifications

### Color Palette
- Background: Use dark theme ($background-dark)
- Cards: $black-bg-dark with subtle shadows
- Text: $text-primary (headings), $text-secondary (labels)
- Brand colors: Adapt to client (Purina uses #8B0000)
- Status indicators:
  - Critical/Failed: #ef4444 (red)
  - Warning/Pending: #fb923c (orange) 
  - Caution: #fbbf24 (yellow)
  - Success/Complete: #4ade80 (green)

### Recharts Configuration
```javascript
// Consistent tooltip styling
<Tooltip 
  contentStyle={{ backgroundColor: '#252525', border: '1px solid #444' }}
  labelStyle={{ color: '#D5D5D5' }}
/>

// Axis configuration - watch for label overlap!
<YAxis 
  tick={{ fill: '#9B9B9B' }}
  label={{ 
    value: 'Label Text', 
    angle: -90, 
    position: 'insideLeft', 
    offset: -5,  // Use negative offset to push label LEFT away from axis values
    style: { fill: '#9B9B9B', textAnchor: 'middle' } 
  }}
/>

// Adequate margins for rotated labels
margin={{ top: 20, right: 30, left: 50, bottom: 100 }}
```

### ComposedChart Layering Tips
- **Line vs Area**: Use `Line` components for better visibility when overlaying with bars
- **Bar opacity**: Set `fillOpacity={0.6}` on bars when they need to coexist with lines
- **Reference lines**: Keep them simple without labels if they clutter the chart
- **Component order matters**: Place bars before lines in JSX for proper layering

### Layout Patterns
- Use responsive grid: `grid-template-columns: repeat(auto-fit, minmax(600px, 1fr))`
- Consistent spacing and padding across cards
- Hover effects for interactive elements
- Clear visual hierarchy with typography mixins

## Key Principles

1. **Let data drive visualization choice** - Don't force a histogram if a list works better
2. **Prioritize clarity over complexity** - Simple, clear visualizations win
3. **Make zeros visible** - If data has many zero values, choose visualizations that show them
4. **Context matters** - Include names, titles, labels that help users take action
5. **Static is fine** - For demos, embed data directly rather than building complex APIs
6. **Brand appropriately** - Use client's colors and design language

## Testing Checklist
- [ ] Run `npm run build` - ensure no errors
- [ ] Check responsive design at different widths
- [ ] Verify all zero/null values are visible
- [ ] Confirm hover states and interactions work
- [ ] Validate color coding matches severity
- [ ] Ensure text is readable on dark backgrounds