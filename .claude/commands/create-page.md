## Create a New Page

**Command:** Create a new page

**CRITICAL REQUIREMENTS:**
- **DO NOT choose page templates for the user** - Always ask them to select from available options
- **DO NOT choose components for placeholders** - Always ask the user which components they want to use
- **Present options and wait for user selection** before proceeding with implementation

**Process:**
1. Gather page information (name, route, purpose)
2. **IMPORTANT: Ask user to choose page template** from available options
3. **IMPORTANT: Ask user to select components** for each template placeholder
4. Analyze required components and data needs
5. **Check for Figma designs and API integration needs**
6. **Create GitHub issue for page development**
7. **Create feature branch**: `feature/${page-name}-page`
8. Create API client functions if needed
9. Generate page structure following Next.js app router conventions
10. **Create comprehensive test suite for the page**
11. **Add documentation to docs/pages folder**
12. Add page to navigation/routing as appropriate
13. **Push branch and create pull request**
14. **Review PR for code quality and security vulnerabilities**
15. **Link PR to GitHub issue and close issue when PR is completed**

**Implementation Steps:**
```bash
# 1. Get page information from user
# - Page name (e.g., "dashboard", "settings", "profile")
# - Page route (e.g., "/dashboard", "/admin/settings", "/user/profile")
# - Purpose and main functionality

# 2. Create GitHub issue for page development
gh issue create --title "feat: Add ${page-name} page" --body "## Description
Create a new ${page-name} page with routing at ${page-route}.

## Requirements
- Page Route: ${page-route}
- Template: [Template Name]
- Components: [List of components]
- Data Requirements: [API endpoints if any]

## Tasks
- [ ] Generate page structure
- [ ] Implement page logic and data fetching
- [ ] Add comprehensive tests
- [ ] Create documentation
- [ ] Update navigation/routing
- [ ] Ensure accessibility compliance

## Acceptance Criteria
- Page follows Next.js app router conventions
- Test coverage >90%
- Documentation includes usage examples
- Passes all linting checks
- Responsive design implemented"

# 3. Create and checkout feature branch
git checkout -b feature/${page-name}-page

# 4. Show available page templates to user
# IMPORTANT: Navigate to ckye-fe folder first (project root)
cd ckye-fe
ls -la src/components/pages/

# IMPORTANT: ASK THE USER to choose which page template they want to use
# DO NOT choose for them - present the options and wait for their selection

# 5. Analyze selected page template structure
# Identify placeholder sections and required props
# List available components from atomic design structure

# IMPORTANT: ASK THE USER which components they want to use for each placeholder
# DO NOT choose components for them - present options and wait for their selection
# Show them available components from atoms/, molecules/, organisms/, templates/

# 5a. CHECK FOR FIGMA DESIGN (NEW STEP)
# After user selects components, check if they have a Figma design for the page
# Ask: "Do you have a Figma design for this page? If yes, please provide the Figma URL or node ID"
# If they provide a Figma URL/node ID:
#   - Use mcp__figma-dev-mode-mcp-server__get_image to view the design
#   - Use mcp__figma-dev-mode-mcp-server__get_code to get component details
#   - Analyze the design to extract:
#     * Text content (titles, labels, placeholders)
#     * Component props (button text, icon paths, etc.)
#     * Layout structure and spacing
#     * Color schemes and styling hints

# 5b. PREFILL COMPONENT PROPS FROM FIGMA (NEW STEP)
# Based on Figma analysis, create a list of props that can be prefilled:
# Example:
# - SearchHeader title: "Workspaces" (from Figma)
# - SearchHeader placeholder: "Search Workspaces" (from Figma)
# - Button text: "Add Workspace" (from Figma)
# - Sidebar activeItem: "workspaces" (inferred from page context)

# 5c. ASK USER ABOUT REMAINING PROPS (NEW STEP)
# For any component props that couldn't be determined from Figma:
# Present a list to the user asking them to fill in the values
# Example prompt:
# "I've prefilled some props from the Figma design. Please provide values for these remaining props:
# - WorkspacesTable: What data source should it use?
# - SearchHeader onSearchChange: Should this filter the table data?
# - AddButton onClick: Should this open a modal or navigate to a new page?"

# 5d. API INTEGRATION (NEW STEP)
# Ask the user about API integration needs:
# "Do any components in this page need to fetch data from APIs? If yes, please specify:
# 1. Which component needs API data?
# 2. What API endpoint should be called?
# 3. Which component props will be filled by the API response?"
#
# Example user responses:
# - "Yes, WorkspacesTable needs data from GET /api/workspaces, it will fill the 'workspaces' prop"
# - "Yes, UserProfile needs data from GET /api/users/[id], it will fill 'user' prop"
# - "No API integration needed, all data will be passed as props"
#
# Based on response, determine:
# - Whether to make this a Server Component (for server-side API calls)
# - Whether to use Client Component with useEffect/custom hooks
# - Which API client functions need to be created in lib/api/
# - How to handle loading and error states

# 6. Parse route to determine file location
# Examples:
# /dashboard -> src/app/dashboard/page.jsx
# /admin/users -> src/app/admin/users/page.jsx
# /profile/[id] -> src/app/profile/[id]/page.jsx

# 7. Create API client functions if needed
# If user specified API integration:
# - Check if lib/api/${resource}.js exists
# - If not, create it with the necessary functions
# Example for workspaces:
# ```javascript
# // lib/api/workspaces.js
# const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
# 
# export async function getWorkspaces(params = {}) {
#   try {
#     const queryString = new URLSearchParams(params).toString();
#     const response = await fetch(`${API_BASE}/api/workspaces${queryString ? `?${queryString}` : ''}`, {
#       method: 'GET',
#       headers: { 'Content-Type': 'application/json' },
#     });
#     if (!response.ok) {
#       const error = await response.json();
#       throw new Error(error.error || 'Failed to fetch workspaces');
#     }
#     return await response.json();
#   } catch (error) {
#     console.error('Error fetching workspaces:', error);
#     throw error;
#   }
# }
# ```

# 8. Create necessary directories
mkdir -p src/app/${parsed-route}

# 9. Generate page component with USER-SELECTED template, components, and API integration
# IMPORTANT: Use the template and components that the USER selected
# IMPORTANT: Use the props prefilled from Figma design (if available)
# IMPORTANT: Use the props provided by the user for remaining values
# IMPORTANT: Integrate API calls based on user's API integration response
# DO NOT make assumptions about which components to use or their props
# Follow Next.js app router conventions:
# - Server Component by default (no 'use client') when using server-side API calls
# - Client Component only if needed for interactivity or client-side API calls
# - Implement async data fetching if required
# Include all props from Figma analysis and user input
# 
# Example with API integration (Server Component):
# ```jsx
# import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
# import Navigation from '@/components/organisms/Navigation/Navigation';
# import WorkspacesTable from '@/components/organisms/WorkspacesTable/WorkspacesTable';
# import { getWorkspaces } from '@/lib/api/workspaces';
# 
# export default async function WorkspacesPage() {
#   // Server-side API call
#   const { data: workspaces } = await getWorkspaces();
#   
#   return (
#     <TwoColumnPage
#       sidebar={<Navigation activeItem="workspaces" />}
#       content={
#         <>
#           <h1>Workspaces</h1>
#           <WorkspacesTable workspaces={workspaces} />
#         </>
#       }
#     />
#   );
# }
# ```
# 
# Example with API integration (Client Component):
# ```jsx
# 'use client';
# import { useState, useEffect } from 'react';
# import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
# import Navigation from '@/components/organisms/Navigation/Navigation';
# import WorkspacesTable from '@/components/organisms/WorkspacesTable/WorkspacesTable';
# import LoadingSpinner from '@/components/atoms/LoadingSpinner/LoadingSpinner';
# import ErrorMessage from '@/components/atoms/ErrorMessage/ErrorMessage';
# import { getWorkspaces } from '@/lib/api/workspaces';
# 
# export default function WorkspacesPage() {
#   const [workspaces, setWorkspaces] = useState([]);
#   const [loading, setLoading] = useState(true);
#   const [error, setError] = useState(null);
#   
#   useEffect(() => {
#     fetchWorkspaces();
#   }, []);
#   
#   const fetchWorkspaces = async () => {
#     try {
#       setLoading(true);
#       setError(null);
#       const { data } = await getWorkspaces();
#       setWorkspaces(data);
#     } catch (err) {
#       setError(err.message);
#     } finally {
#       setLoading(false);
#     }
#   };
#   
#   if (loading) return <LoadingSpinner />;
#   if (error) return <ErrorMessage message={error} onRetry={fetchWorkspaces} />;
#   
#   return (
#     <TwoColumnPage
#       sidebar={<Navigation activeItem="workspaces" />}
#       content={
#         <>
#           <h1>Workspaces</h1>
#           <WorkspacesTable workspaces={workspaces} />
#         </>
#       }
#     />
#   );
# }
# ```

# 10. Create test file following Next.js testing conventions
# Test file location: src/app/${parsed-route}/__tests__/page.test.jsx
mkdir -p src/app/${parsed-route}/__tests__

# Create comprehensive test suite covering:
# - Page rendering
# - Data fetching (if applicable)
# - Component integration
# - User interactions
# - Error states
# - Loading states
# - Accessibility

# 11. Create documentation
mkdir -p docs/pages
# Add file to docs/pages/${page-name}.md with:
# - Page purpose and functionality
# - Route information
# - Components used
# - Data requirements
# - Props documentation
# - Usage examples
# - Testing information
# - SEO considerations

# 12. Update navigation/routing if needed
# Check if navigation components need updating
# Add new route to any route constants or navigation configs

# 13. Run tests and linting (from ckye-fe folder)
npm run test && npm run lint

# 14. Commit and push
git add .
git commit -m "feat: add ${page-name} page

- Implemented ${page-name} page at route ${page-route}
- Added comprehensive tests and documentation
- Updated navigation and routing as needed

Closes #[issue-number]"
git push -u origin feature/${page-name}-page

# 15. Create pull request linked to GitHub issue
gh pr create --title "feat: Add ${page-name} page" --body "## Description
Implements ${page-name} page with routing at ${page-route}.

## Changes
- Added page structure following Next.js app router conventions
- Implemented comprehensive test suite
- Created documentation with usage examples
- Updated navigation/routing as appropriate
- Ensured accessibility compliance

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested

## Page Details
- **Route**: ${page-route}
- **Template**: ${template-name}
- **Components**: ${component-list}
- **Data Sources**: ${data-sources}

Closes #[issue-number]"

# 16. Review the PR for code quality and security
# Use gh pr view to examine the changes and review for:
# - Next.js app router best practices
# - React Server Components usage
# - Data fetching patterns
# - Security vulnerabilities
# - Performance considerations
# - SEO implementation
# - Accessibility compliance
# - Test coverage and quality

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
- ✅ Next.js app router conventions followed
- ✅ React Server Components properly used
- ✅ Data fetching patterns optimized
- ✅ No security vulnerabilities detected
- ✅ Test coverage >90%
- ✅ Documentation complete
- ✅ SEO meta tags implemented
- ✅ Accessibility compliant
- ✅ Performance optimized

**Approved for merge** 🚀"

# 17. Issue will be automatically closed when PR is merged due to "Closes #[issue-number]" in commit message
```

**Page Template Example (Server Component):**
```jsx
// src/app/admin/users/page.jsx
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Navigation from '@/components/organisms/Navigation/Navigation';
import UsersTable from '@/components/organisms/UsersTable/UsersTable';
import { getUserData } from '@/lib/api/users';

export const metadata = {
  title: 'Users Management | Ckye',
  description: 'Manage system users and permissions',
};

const UsersPage = async () => {
  // Server-side data fetching
  const users = await getUserData();
  
  return (
    <TwoColumnPage
      sidebar={<Navigation activeItem="users" />}
      content={
        <>
          <h1>Users Management</h1>
          <UsersTable users={users} />
        </>
      }
    />
  );
};

export default UsersPage;
```

**Page Template Example (Client Component with interactivity):**
```jsx
'use client';

// src/app/dashboard/page.jsx
import { useState, useEffect } from 'react';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Navigation from '@/components/organisms/Navigation/Navigation';
import DashboardStats from '@/components/organisms/DashboardStats/DashboardStats';
import styles from './page.module.scss';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side data fetching for real-time updates
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TwoColumnPage
      sidebar={<Navigation activeItem="dashboard" />}
      content={
        <div className={styles.dashboard}>
          <h1 className={styles.dashboard__title}>Dashboard</h1>
          {loading ? (
            <div className={styles.dashboard__loading}>Loading...</div>
          ) : (
            <DashboardStats stats={stats} />
          )}
        </div>
      }
    />
  );
};

export default DashboardPage;
```

**Test Template Example:**
```jsx
// src/app/admin/users/__tests__/page.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import UsersPage from '../page';
import { getUserData } from '@/lib/api/users';

// Mock the API module
jest.mock('@/lib/api/users');

// Mock the components
jest.mock('@/components/pages/TwoColumnPage/TwoColumnPage', () => ({
  __esModule: true,
  default: ({ sidebar, content }) => (
    <div data-testid="two-column-page">
      <div data-testid="sidebar">{sidebar}</div>
      <div data-testid="content">{content}</div>
    </div>
  ),
}));

jest.mock('@/components/organisms/Navigation/Navigation', () => ({
  __esModule: true,
  default: ({ activeItem }) => <nav data-testid={`navigation-${activeItem}`}>Navigation</nav>,
}));

jest.mock('@/components/organisms/UsersTable/UsersTable', () => ({
  __esModule: true,
  default: ({ users }) => (
    <table data-testid="users-table">
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe('UsersPage', () => {
  const mockUsers = [
    { id: 1, name: 'User 1', email: 'user1@example.com' },
    { id: 2, name: 'User 2', email: 'user2@example.com' },
  ];

  beforeEach(() => {
    getUserData.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with correct structure', async () => {
    const { container } = render(await UsersPage());
    
    expect(screen.getByTestId('two-column-page')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders navigation with correct active item', async () => {
    render(await UsersPage());
    
    expect(screen.getByTestId('navigation-users')).toBeInTheDocument();
  });

  it('renders page title', async () => {
    render(await UsersPage());
    
    expect(screen.getByText('Users Management')).toBeInTheDocument();
  });

  it('fetches and displays user data', async () => {
    render(await UsersPage());
    
    await waitFor(() => {
      expect(getUserData).toHaveBeenCalledTimes(1);
    });

    const usersTable = screen.getByTestId('users-table');
    expect(usersTable).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('handles empty user data', async () => {
    getUserData.mockResolvedValue([]);
    
    render(await UsersPage());
    
    const usersTable = screen.getByTestId('users-table');
    expect(usersTable).toBeInTheDocument();
    expect(usersTable.querySelector('tbody').children).toHaveLength(0);
  });

  it('has proper accessibility attributes', async () => {
    const { container } = render(await UsersPage());
    
    // Check for heading hierarchy
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Users Management');
  });
});
```

**Documentation Template:**
```markdown
# ${Page Name} Page

## Overview
Brief description of the page's purpose and functionality.

## Route Information
- **Path**: `${page-route}`
- **File Location**: `src/app/${path}/page.jsx`
- **Access Level**: Public/Private/Admin

## Components Used
- **Page Template**: ${template-name}
- **Sidebar Component**: ${sidebar-component}
- **Content Components**: 
  - ${component-1}
  - ${component-2}

## Data Requirements
### API Integration
- **Component**: ${component-name}
- **Endpoint**: `/api/${endpoint}`
- **Method**: GET/POST
- **Props Filled**: ${props-list}
- **API Client Function**: `${functionName}` in `lib/api/${resource}.js`

### Response Format
```json
{
  "data": [],
  "total": 0
}
```

### Error Handling
- Loading states displayed during fetch
- Error messages shown on failure
- Retry functionality available

## Props Documentation
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| prop1 | string | Description | 'default' |

## Usage Examples
### Basic Usage
```jsx
import ${PageName} from '@/app/${path}/page';

// The page is automatically rendered by Next.js router
```

### With Custom Layout
```jsx
// In layout.jsx
export default function Layout({ children }) {
  return (
    <div className="custom-layout">
      {children}
    </div>
  );
}
```

## Testing
- Test file: `src/app/${path}/__tests__/page.test.jsx`
- Coverage requirements: >90%
- Key test scenarios:
  - Page rendering
  - Data fetching
  - Error handling
  - Loading states
  - User interactions

## SEO Considerations
- **Title**: Dynamic/Static title
- **Description**: Meta description content
- **Keywords**: Relevant keywords
- **Open Graph**: Social media tags

## Accessibility
- ARIA labels implemented
- Keyboard navigation supported
- Screen reader friendly
- Color contrast compliant

## Performance
- Server-side rendering for initial load
- Code splitting implemented
- Lazy loading for heavy components
- Optimized images and assets
```

**Notes:**
- Pages follow Next.js app router conventions
- Server Components are default, Client Components only when needed
- Comprehensive testing in `__tests__` folders within app directory
- Documentation organized in `docs/pages/` folder
- Git workflow includes issue creation, feature branches, and PR reviews
- All pages must pass accessibility and security reviews before merge