# Create API Command

This command helps you create a new API endpoint with both route handler and client implementation, following Next.js App Router patterns and Prisma best practices.

## Prerequisites
- Ensure you're in the project root directory
- Have GitHub CLI (`gh`) installed and authenticated
- Have proper database access for Prisma operations

## Step 1: Gather API Information

Ask the user for the following information:
1. **API Name** (e.g., "users", "products", "orders")
   - This will be used for the route path: `/api/{name}`
   - Should be lowercase and plural for RESTful conventions

2. **API Purpose** 
   - A brief description of what this API will do
   - This helps generate appropriate documentation and tests

3. **Database Interaction**
   - Ask: "Will this API interact with the PostgreSQL database? (yes/no)"
   - If yes, ask: "Which tables will it interact with? (comma-separated list)"
   - If a new table is needed, ask: "Do you need to create a new table? (yes/no)"

4. **API Operations**
   - Ask which HTTP methods will be supported:
     - GET (list/read)
     - POST (create)
     - PUT (update)
     - DELETE (delete)
     - PATCH (partial update)

## Step 2: Create GitHub Issue

```bash
# Create a GitHub issue for tracking
gh issue create --title "feat: add ${API_NAME} API endpoint" --body "## Description
Create a new API endpoint for ${API_PURPOSE}.

## API Specification
- **Endpoint**: /api/${API_NAME}
- **Methods**: ${SELECTED_METHODS}
- **Database Tables**: ${TABLES_LIST}

## Tasks
- [ ] Create Prisma schema (if needed)
- [ ] Run Prisma migrations (if needed)
- [ ] Create API route handler in app/api/${API_NAME}/route.js
- [ ] Implement ${SELECTED_METHODS} methods with proper error handling
- [ ] Create API client in lib/api/${API_NAME}.js
- [ ] Add input validation
- [ ] Add authentication/authorization (if needed)
- [ ] Write API tests
- [ ] Add API documentation
- [ ] Test with Prisma Studio

## Acceptance Criteria
- API endpoints respond correctly to all supported HTTP methods
- Proper error handling and status codes
- Input validation prevents invalid data
- Database operations use Prisma best practices
- Client functions handle errors gracefully
- All tests pass with >90% coverage
- API is documented in docs/api/${API_NAME}.md"

# Store the issue number
ISSUE_NUMBER=$(gh issue list --limit 1 --json number --jq '.[0].number')
echo "Created issue #$ISSUE_NUMBER"
```

## Step 3: Create Feature Branch

```bash
# Create and checkout feature branch
git checkout -b feature/${API_NAME}-api
echo "Created and switched to feature/${API_NAME}-api branch"
```

## Step 4: Handle Prisma Schema (if needed)

If a new table needs to be created:

### 4.1: Design Schema

Ask the user to define the schema for the new table:
- Model name (PascalCase, singular)
- Fields with their types
- Relationships to other models
- Indexes needed

Example schema prompt:
```
Please define your table schema:
- Model name: User
- Fields:
  - id: String @id @default(cuid())
  - email: String @unique
  - name: String?
  - createdAt: DateTime @default(now())
  - updatedAt: DateTime @updatedAt
- Relations: posts Post[]
- Indexes: @@index([email])
```

### 4.2: Update Prisma Schema

Edit `ckye-fe/prisma/schema.prisma` to add the new model:

```prisma
model ${MODEL_NAME} {
  ${FIELD_DEFINITIONS}
  
  ${RELATIONS}
  
  ${INDEXES}
  @@map("${TABLE_NAME}")
}
```

### 4.3: Run Prisma Commands

```bash
cd ckye-fe

# Format the schema file
npx prisma format

# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add-${TABLE_NAME}-table

# Open Prisma Studio to verify
npx prisma studio

cd ..
```

## Step 5: Create Prisma Singleton

If not already exists, create `ckye-fe/src/lib/prisma.js`:

```javascript
import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

## Step 6: Create API Route Handler

Create `ckye-fe/src/app/api/${API_NAME}/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

// GET /api/${API_NAME}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause based on search
    const where = search
      ? {
          OR: [
            // Add searchable fields here
            // { name: { contains: search, mode: 'insensitive' } },
            // { email: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};

    // Execute query with pagination
    const [items, total] = await prisma.$transaction([
      prisma.${MODEL_NAME_LOWER}.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          // Select only needed fields
          id: true,
          // Add other fields
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.${MODEL_NAME_LOWER}.count({ where })
    ]);

    return NextResponse.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ${API_NAME}:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ${API_NAME}' },
      { status: 500 }
    );
  }
}

// POST /api/${API_NAME}
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    // if (!body.requiredField) {
    //   return NextResponse.json(
    //     { error: 'Required field is missing' },
    //     { status: 400 }
    //   );
    // }

    const item = await prisma.${MODEL_NAME_LOWER}.create({
      data: {
        // Map body fields to database fields
        ...body
      },
      select: {
        id: true,
        // Add fields to return
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A record with this unique field already exists' },
          { status: 409 }
        );
      }
    }
    console.error('Error creating ${API_NAME}:', error);
    return NextResponse.json(
      { error: 'Failed to create ${API_NAME}' },
      { status: 500 }
    );
  }
}
```

If dynamic routes are needed, create `ckye-fe/src/app/api/${API_NAME}/[id]/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

// GET /api/${API_NAME}/:id
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const item = await prisma.${MODEL_NAME_LOWER}.findUnique({
      where: { id },
      select: {
        id: true,
        // Add fields to return
        createdAt: true,
        updatedAt: true
      }
    });

    if (!item) {
      return NextResponse.json(
        { error: '${MODEL_NAME} not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error(`Error fetching ${API_NAME} ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch ${API_NAME}' },
      { status: 500 }
    );
  }
}

// PUT /api/${API_NAME}/:id
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const item = await prisma.${MODEL_NAME_LOWER}.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
      },
      select: {
        id: true,
        // Add fields to return
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: '${MODEL_NAME} not found' },
          { status: 404 }
        );
      }
    }
    console.error(`Error updating ${API_NAME} ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update ${API_NAME}' },
      { status: 500 }
    );
  }
}

// DELETE /api/${API_NAME}/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.${MODEL_NAME_LOWER}.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: '${MODEL_NAME} deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: '${MODEL_NAME} not found' },
          { status: 404 }
        );
      }
    }
    console.error(`Error deleting ${API_NAME} ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete ${API_NAME}' },
      { status: 500 }
    );
  }
}
```

## Step 7: Create API Client

Create `ckye-fe/src/lib/api/${API_NAME}.js`:

```javascript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch all ${API_NAME} with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function get${MODEL_NAME}s(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/api/${API_NAME}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch ${API_NAME}');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ${API_NAME}:', error);
    throw error;
  }
}

/**
 * Fetch a single ${MODEL_NAME} by ID
 * @param {string} id - The ${MODEL_NAME} ID
 * @returns {Promise<Object>}
 */
export async function get${MODEL_NAME}ById(id) {
  try {
    const response = await fetch(`${API_BASE}/api/${API_NAME}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '${MODEL_NAME} not found');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${MODEL_NAME} ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new ${MODEL_NAME}
 * @param {Object} data - The ${MODEL_NAME} data
 * @returns {Promise<Object>}
 */
export async function create${MODEL_NAME}(data) {
  try {
    const response = await fetch(`${API_BASE}/api/${API_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create ${MODEL_NAME}');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating ${MODEL_NAME}:', error);
    throw error;
  }
}

/**
 * Update an existing ${MODEL_NAME}
 * @param {string} id - The ${MODEL_NAME} ID
 * @param {Object} data - The updated data
 * @returns {Promise<Object>}
 */
export async function update${MODEL_NAME}(id, data) {
  try {
    const response = await fetch(`${API_BASE}/api/${API_NAME}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update ${MODEL_NAME}');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating ${MODEL_NAME} ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a ${MODEL_NAME}
 * @param {string} id - The ${MODEL_NAME} ID
 * @returns {Promise<Object>}
 */
export async function delete${MODEL_NAME}(id) {
  try {
    const response = await fetch(`${API_BASE}/api/${API_NAME}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete ${MODEL_NAME}');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${MODEL_NAME} ${id}:`, error);
    throw error;
  }
}
```

## Step 8: Add Input Validation

Create `ckye-fe/src/lib/validation/${API_NAME}.js`:

```javascript
/**
 * Validate ${MODEL_NAME} input data
 * @param {Object} data - The data to validate
 * @returns {{isValid: boolean, errors: Object}}
 */
export function validate${MODEL_NAME}Input(data) {
  const errors = {};
  
  // Add validation rules
  // Example:
  // if (!data.email || !isValidEmail(data.email)) {
  //   errors.email = 'Valid email is required';
  // }
  
  // if (!data.name || data.name.length < 2) {
  //   errors.name = 'Name must be at least 2 characters';
  // }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Sanitize ${MODEL_NAME} input data
 * @param {Object} data - The data to sanitize
 * @returns {Object} Sanitized data
 */
export function sanitize${MODEL_NAME}Input(data) {
  return {
    // Sanitize each field as needed
    // Example:
    // name: data.name?.trim(),
    // email: data.email?.toLowerCase().trim(),
  };
}
```

## Step 9: Create API Tests

Create `ckye-fe/src/app/api/${API_NAME}/__tests__/route.test.js`:

```javascript
import { GET, POST } from '../route';
import { GET as GET_BY_ID, PUT, DELETE } from '../[id]/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    ${MODEL_NAME_LOWER}: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('/api/${API_NAME}', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/${API_NAME}', () => {
    it('should return paginated ${API_NAME}', async () => {
      const mockData = [
        { id: '1', /* other fields */ },
        { id: '2', /* other fields */ },
      ];
      
      prisma.$transaction.mockResolvedValue([mockData, 2]);

      const request = new NextRequest('http://localhost:3000/api/${API_NAME}?page=1&limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('meta');
      expect(data.meta.page).toBe(1);
      expect(data.meta.limit).toBe(10);
      expect(data.meta.total).toBe(2);
    });

    it('should handle search parameter', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      const request = new NextRequest('http://localhost:3000/api/${API_NAME}?search=test');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('POST /api/${API_NAME}', () => {
    it('should create a new ${MODEL_NAME}', async () => {
      const newItem = { id: '1', /* fields */ };
      prisma.${MODEL_NAME_LOWER}.create.mockResolvedValue(newItem);

      const request = new NextRequest('http://localhost:3000/api/${API_NAME}', {
        method: 'POST',
        body: JSON.stringify({ /* required fields */ }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(newItem);
    });

    it('should return 400 for invalid input', async () => {
      const request = new NextRequest('http://localhost:3000/api/${API_NAME}', {
        method: 'POST',
        body: JSON.stringify({}), // Missing required fields
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });
});

describe('/api/${API_NAME}/[id]', () => {
  describe('GET /api/${API_NAME}/:id', () => {
    it('should return a single ${MODEL_NAME}', async () => {
      const mockItem = { id: '1', /* fields */ };
      prisma.${MODEL_NAME_LOWER}.findUnique.mockResolvedValue(mockItem);

      const request = new NextRequest('http://localhost:3000/api/${API_NAME}/1');
      const response = await GET_BY_ID(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockItem);
    });

    it('should return 404 for non-existent ${MODEL_NAME}', async () => {
      prisma.${MODEL_NAME_LOWER}.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/${API_NAME}/999');
      const response = await GET_BY_ID(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
    });
  });

  describe('PUT /api/${API_NAME}/:id', () => {
    it('should update an existing ${MODEL_NAME}', async () => {
      const updatedItem = { id: '1', /* updated fields */ };
      prisma.${MODEL_NAME_LOWER}.update.mockResolvedValue(updatedItem);

      const request = new NextRequest('http://localhost:3000/api/${API_NAME}/1', {
        method: 'PUT',
        body: JSON.stringify({ /* update data */ }),
      });

      const response = await PUT(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedItem);
    });
  });

  describe('DELETE /api/${API_NAME}/:id', () => {
    it('should delete a ${MODEL_NAME}', async () => {
      prisma.${MODEL_NAME_LOWER}.delete.mockResolvedValue({});

      const request = new NextRequest('http://localhost:3000/api/${API_NAME}/1');
      const response = await DELETE(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('${MODEL_NAME} deleted successfully');
    });
  });
});
```

## Step 10: Create API Documentation

Create `ckye-fe/docs/api/${API_NAME}.md`:

```markdown
# ${API_NAME} API Documentation

## Overview
${API_PURPOSE}

## Base URL
`/api/${API_NAME}`

## Authentication
[Describe authentication requirements if any]

## Endpoints

### List ${MODEL_NAME}s
```
GET /api/${API_NAME}
```

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| search | string | - | Search term |
| sortBy | string | createdAt | Field to sort by |
| sortOrder | string | desc | Sort order (asc/desc) |

#### Response
```json
{
  "data": [
    {
      "id": "string",
      // ... other fields
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Get Single ${MODEL_NAME}
```
GET /api/${API_NAME}/:id
```

#### Response
```json
{
  "id": "string",
  // ... other fields
}
```

### Create ${MODEL_NAME}
```
POST /api/${API_NAME}
```

#### Request Body
```json
{
  // ... required fields
}
```

#### Response
```json
{
  "id": "string",
  // ... created fields
}
```

### Update ${MODEL_NAME}
```
PUT /api/${API_NAME}/:id
```

#### Request Body
```json
{
  // ... fields to update
}
```

#### Response
```json
{
  "id": "string",
  // ... updated fields
}
```

### Delete ${MODEL_NAME}
```
DELETE /api/${API_NAME}/:id
```

#### Response
```json
{
  "message": "${MODEL_NAME} deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message",
  "details": {
    "field": "Error details"
  }
}
```

### 404 Not Found
```json
{
  "error": "${MODEL_NAME} not found"
}
```

### 409 Conflict
```json
{
  "error": "A record with this unique field already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to perform operation"
}
```

## Usage Examples

### JavaScript/TypeScript
```javascript
import { get${MODEL_NAME}s, create${MODEL_NAME} } from '@/lib/api/${API_NAME}';

// Fetch ${API_NAME}
const response = await get${MODEL_NAME}s({ page: 1, limit: 20 });
console.log(response.data);

// Create new ${MODEL_NAME}
const newItem = await create${MODEL_NAME}({
  // ... data
});
```

### cURL
```bash
# List ${API_NAME}
curl -X GET "http://localhost:3000/api/${API_NAME}?page=1&limit=10"

# Create ${MODEL_NAME}
curl -X POST "http://localhost:3000/api/${API_NAME}" \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```
```

## Step 11: Run Tests and Lint

```bash
cd ckye-fe

# Run tests
npm run test -- src/app/api/${API_NAME}

# Run linter
npm run lint

# Test the API manually with Prisma Studio
npx prisma studio

cd ..
```

## Step 12: Commit Changes

```bash
# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: add ${API_NAME} API endpoint with Prisma integration

- Created API route handlers for ${SELECTED_METHODS} operations
- Implemented Prisma database queries with pagination and search
- Added API client functions in lib/api/${API_NAME}
- Created input validation and sanitization
- Added comprehensive API tests
- Documented API endpoints and usage
- Followed Prisma best practices for connection management
- Added proper error handling with specific status codes

Closes #$ISSUE_NUMBER"
```

## Step 13: Push and Create PR

```bash
# Push the feature branch
git push -u origin feature/${API_NAME}-api

# Create pull request
gh pr create --title "feat: add ${API_NAME} API endpoint" --body "## Description
Created a new API endpoint for ${API_PURPOSE}.

## Changes
- Added Prisma schema for ${MODEL_NAME} model (if applicable)
- Created API route handlers in \`app/api/${API_NAME}/\`
- Implemented ${SELECTED_METHODS} methods with error handling
- Added API client functions in \`lib/api/${API_NAME}.js\`
- Created input validation in \`lib/validation/${API_NAME}.js\`
- Added comprehensive test coverage
- Documented API in \`docs/api/${API_NAME}.md\`

## Database Changes
- ${DATABASE_CHANGES_SUMMARY}

## Testing
- [ ] Unit tests pass
- [ ] API endpoints tested manually
- [ ] Prisma Studio verification completed
- [ ] Error handling tested
- [ ] Input validation tested

## Security Considerations
- [x] Input validation prevents injection attacks
- [x] Prisma parameterized queries prevent SQL injection
- [x] Proper error messages don't expose sensitive information
- [x] Authentication/authorization implemented (if required)

## Performance
- [x] Database queries optimized with proper indexes
- [x] Pagination implemented for list endpoints
- [x] Only required fields selected in queries

## Documentation
- [x] API documentation complete
- [x] JSDoc comments added to functions
- [x] Usage examples provided

Closes #$ISSUE_NUMBER"

# Store the PR number
PR_NUMBER=$(gh pr list --limit 1 --json number --jq '.[0].number')
echo "Created PR #$PR_NUMBER"
```

## Step 14: Review and Approve PR

```bash
# View the PR
gh pr view $PR_NUMBER --comments

# Check the diff
gh pr diff $PR_NUMBER

# Run automated checks
gh pr checks $PR_NUMBER

# Review checklist:
# 1. API follows RESTful conventions
# 2. Prisma queries are optimized
# 3. Error handling is comprehensive
# 4. Input validation prevents bad data
# 5. Tests cover edge cases
# 6. Documentation is complete
# 7. No hardcoded credentials
# 8. Connection management follows singleton pattern

# If issues found, comment:
gh pr comment $PR_NUMBER --body "## Code Review Findings

### Issues Found:
1. [List any issues]

### Recommendations:
1. [List recommendations]

Please address these issues before merging."

# If approved:
gh pr comment $PR_NUMBER --body "## Code Review Complete ✅

Reviewed this PR and found **0 issues**.

### Review Summary:
- ✅ API follows RESTful conventions
- ✅ Prisma integration follows best practices
- ✅ Proper error handling and status codes
- ✅ Input validation prevents injection attacks
- ✅ Comprehensive test coverage (>90%)
- ✅ API documentation is complete
- ✅ Performance optimizations in place
- ✅ Security best practices followed

### Prisma Specific:
- ✅ Schema follows naming conventions
- ✅ Migrations are clean and reversible
- ✅ Queries use proper select/include
- ✅ Connection management uses singleton pattern
- ✅ Error codes handled appropriately

**Approved for merge** 🚀"

# Approve the PR
gh pr review $PR_NUMBER --approve
```

## Step 15: Merge PR

```bash
# Merge the PR (squash and merge recommended)
gh pr merge $PR_NUMBER --squash --delete-branch

# Switch back to main branch
git checkout main
git pull origin main

echo "✅ ${API_NAME} API successfully created and merged!"
```

## Additional Notes

### Environment Variables
Make sure to add necessary environment variables:
```bash
# .env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="http://localhost:3000" # for development
```

### Common Prisma Error Codes
- P2002: Unique constraint violation
- P2025: Record not found
- P2003: Foreign key constraint violation
- P2014: Relation violation

### Testing the API
Use tools like:
- Postman or Insomnia for manual testing
- Prisma Studio for database inspection
- Jest for automated testing
- cURL for command-line testing

### Security Checklist
- [ ] Never expose Prisma client to frontend
- [ ] Validate all input data
- [ ] Use parameterized queries (Prisma default)
- [ ] Implement rate limiting if needed
- [ ] Add authentication/authorization as required
- [ ] Log errors but don't expose sensitive data