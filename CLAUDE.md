# CLAUDE.md

ID: cme78g7a700018ovg8p0ijuv0

This file provides context and instructions for Claude Code to help with this project.

## Project Information
- Project Name: Ckye Frontend
- Working Directory: /Users/jack/Documents/Projects/Ckye/ckye-fe
- Framework: Next.js 15.4.2 with React 19.1.0
- Styling: SCSS with CSS Modules and BEM methodology
- Component Style: Functional components with React hooks only
- Design Pattern: Atomic Design (atoms, molecules, organisms, templates, pages)
- Database: Azure PostgreSQL (accessed via Prisma ORM only)

## Development Commands
**IMPORTANT**: Always run commands from the `ckye-fe` folder (project root).

```bash
npm run build      # Build production
npm run dev        # Development server
npm run test       # Run tests
npm run lint       # Lint code
npm run typecheck  # TypeScript checking

# Prisma Commands
npx prisma generate       # Generate Prisma Client
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio
npx prisma format         # Format schema
```

## Pull Request Creation Rules

### Pre-PR Checklist (MANDATORY)
Before creating any pull request, run ALL commands in order:

1. `npm run lint` (fix with `npm run lint -- --fix` if needed)
2. `npm run typecheck` (resolve all TypeScript errors)
3. `npm run test` (ensure all tests pass)
4. `npm run build` (verify production build)

### PR Creation Process
1. Create descriptive branch name (`feature/xyz`, `fix/abc`)
2. Write clear PR title and description
3. **IMMEDIATELY after PR creation**: Add a comment with the page/variant ID:
   - Comment format: `Page ID: cme78g7a700018ovg8p0ijuv0`
   - This identifies Claude's contributions for statistics tracking

**Never create PR until all checks pass!**

## Code Standards

### React Components
- **Always functional components** with hooks
- **No class components** (never use `this.state`, `this.setState`)
- Follow Atomic Design structure
- Use Context API for global state
- Mark interactive components with `'use client'`

### File Structure
```
src/
  components/
    atoms/        # Basic blocks (Button, Input)
    molecules/    # Combinations (FormField, UserCard)
    organisms/    # Complex (UsersTable, Navigation)
    templates/    # Page layouts
    pages/        # Complete pages
  context/        # Global state
  hooks/          # Custom hooks
  lib/            # API functions
  styles/         # SCSS utilities
    _variables.scss
    _mixins.scss
```

### SCSS & CSS Modules
- **Import pattern**: `import styles from './Component.module.scss'`
- **Usage**: `className={styles['class-name']}`
- **BEM naming**: `.block`, `.block__element`, `.block--modifier`
- **NO Tailwind CSS**
- **Always import variables**: `@import '../../../styles/variables';`
- **Always import mixins**: `@import '../../../styles/mixins';`
- **Never hardcode colors or fonts** - use variables and mixins
- **Prefer CSS pseudo-selectors** over JavaScript hover handlers

### Typography Mixins
```scss
@include heading-1, heading-2, heading-3  # Headings
@include body-large, body-medium, body-small  # Body text
@include label, button-text, nav-item  # Special text
@include font-medium, font-semibold, font-bold  # Weights
@include text-primary, text-secondary  # Colors
@include truncate, line-clamp($lines)  # Utilities
```

## Component Examples

### Functional Component with Hooks
```jsx
'use client';
import { useState } from 'react';
import styles from './Button.module.scss';

const Button = ({ children, variant = 'primary', onClick }) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
```

### SCSS Module with BEM
```scss
@import '../../../styles/variables';
@import '../../../styles/mixins';

.button {
  @include button-text;
  background: $primary-color;
  
  &--secondary {
    background: transparent;
    border: 2px solid $primary-color;
  }
  
  &:hover {
    background: darken($primary-color, 10%);
  }
}
```

### Global State with Context
```jsx
// context/AppContext.jsx
import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {});
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be within AppProvider');
  return context;
};
```

## Database & Prisma

### Critical Rules
- **ONLY API routes** can use Prisma Client
- **NEVER import Prisma** in frontend components
- **ALL database operations** through API endpoints
- **Frontend calls API routes**, which use Prisma

### Prisma Configuration
- Schema: `ckye-fe/prisma/schema.prisma`
- Client: `src/generated/prisma/`
- Connection: `DATABASE_URL` in `.env`

### Query Best Practices
```javascript
// ✅ Good - Select only needed fields
await prisma.user.findMany({
  select: { id: true, name: true },
  skip: (page - 1) * limit,
  take: limit
});

// ❌ Bad - Fetching all fields
await prisma.user.findMany();
```

### Singleton Pattern
```javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Error Handling
```javascript
import { Prisma } from '@prisma/client';

try {
  const user = await prisma.user.create({ data });
  return NextResponse.json(user, { status: 201 });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email exists' }, { status: 409 });
    }
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 });
}
```

## API Development

### Route Structure
```
app/api/
  users/
    route.js          # GET (list), POST (create)
    [id]/
      route.js        # GET (single), PUT, DELETE
```

### Route Handler Pattern
```javascript
// app/api/users/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const users = await prisma.user.findMany({
      skip: (page - 1) * 10,
      take: 10
    });
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    const user = await prisma.user.create({ data: body });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Response Standards
```javascript
// Success
{ "data": {...}, "meta": { "page": 1, "total": 100 } }

// Error
{ "error": "Message", "details": {...} }
```

## Frontend API Calls

### API Client Pattern
```javascript
// lib/api/users.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function getUsers(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/api/users${query ? `?${query}` : ''}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Usage in Components
```jsx
// Server Component
import { getUsers } from '@/lib/api/users';

export default async function UsersPage() {
  const { data: users } = await getUsers();
  return <UsersTable users={users} />;
}

// Client Component
'use client';
import { useState, useEffect } from 'react';
import { getUsers } from '@/lib/api/users';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render users */}</div>;
}
```

### Custom Hook Pattern
```jsx
// hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(apiFunction, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const result = await apiFunction();
        setData(result.data || result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, deps);

  return { data, loading, error };
}
```

## Important Rules
1. **Never use .then()/.catch()** - Always async/await
2. **Always handle errors** with try/catch
3. **Show loading states** in UI
4. **No hardcoded colors/fonts** in SCSS
5. **Functional components only** - no classes
6. **API routes only** for database access
7. **Run all checks** before creating PRs
8. **Work from ckye-fe folder** for npm commands

## Project Paths
- Root: `/Users/jack/Documents/Projects/Ckye/ckye-fe/`
- Components: Follow atomic design structure
- API Routes: `app/api/[resource]/route.js`
- Styles: Import from `src/styles/`