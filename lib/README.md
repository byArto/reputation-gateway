# Database Query Functions

This directory contains database connection and query functions.

## Files

- `db.ts` - Main database queries for projects and applications
- `init-db.ts` - Database initialization and migration functions
- `utils.ts` - Utility functions (e.g., `cn` for classnames)

## Usage Examples

### Creating a Project

```typescript
import { createProject } from "@/lib/db"

const project = await createProject({
  name: "DeFi Protocol Beta",
  slug: "defi-protocol",
  criteria: {
    minScore: 1400,
    minVouches: 1,
    positiveReviews: true,
    minAccountAge: 7,
  },
  manualReview: true,
  destinationUrl: "https://discord.gg/defi-protocol",
  destinationType: "discord",
})
```

### Getting a Project

```typescript
import { getProjectBySlug } from "@/lib/db"

const project = await getProjectBySlug("defi-protocol")

if (project) {
  console.log(project.name) // "DeFi Protocol Beta"
}
```

### Creating an Application

```typescript
import { createApplication } from "@/lib/db"

const application = await createApplication({
  projectId: project.id,
  ethosProfileId: 12345,
  username: "alice.eth",
  score: 1650,
  status: "pending",
  criteriaSnapshot: project.criteria,
})
```

### Getting Applications for a Project

```typescript
import { getApplicationsByProjectId } from "@/lib/db"

const applications = await getApplicationsByProjectId(project.id)

applications.forEach((app) => {
  console.log(`${app.username}: ${app.status}`)
})
```

### Updating Application Status

```typescript
import { updateApplicationStatus } from "@/lib/db"

// Accept an application
await updateApplicationStatus(applicationId, "accepted")

// Reject with reason
await updateApplicationStatus(
  applicationId,
  "rejected",
  "Score below minimum threshold"
)
```

### Getting Statistics

```typescript
import { getApplicationStats } from "@/lib/db"

const stats = await getApplicationStats(project.id)

console.log(stats)
// {
//   totalApplications: 147,
//   last24h: 12,
//   accepted: 52,
//   rejected: 95,
//   pending: 0,
//   avgScore: 1385,
//   avgAcceptedScore: 1612
// }
```

### Checking for Existing Application

```typescript
import { checkExistingApplication } from "@/lib/db"

const existing = await checkExistingApplication(projectId, ethosProfileId)

if (existing) {
  if (existing.status === "rejected" && existing.can_reapply_at) {
    const canReapply = new Date() > new Date(existing.can_reapply_at)
    if (!canReapply) {
      console.log("User cannot reapply yet")
    }
  }
}
```

## API Routes Example

Here's how to use these functions in API routes:

```typescript
// app/api/projects/route.ts
import { NextResponse } from "next/server"
import { createProject, getAllProjects } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const project = await createProject(data)
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const projects = await getAllProjects()
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}
```

## Type Definitions

### Project

```typescript
interface Project {
  id: string
  name: string
  slug: string
  criteria: {
    minScore: number
    minVouches: number
    positiveReviews: boolean
    minAccountAge: number
  }
  manual_review: boolean
  destination_url: string
  destination_type: "discord" | "beta"
  created_at: Date
}
```

### Application

```typescript
interface Application {
  id: string
  project_id: string
  ethos_profile_id: number
  username: string
  score: number
  status: "accepted" | "rejected" | "pending"
  rejection_reason: string | null
  criteria_snapshot: {
    minScore: number
    minVouches: number
    positiveReviews: boolean
    minAccountAge: number
  }
  can_reapply_at: Date | null
  created_at: Date
}
```

## Error Handling

All query functions can throw errors. Always wrap them in try-catch:

```typescript
try {
  const project = await getProjectBySlug("my-project")
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  // ... use project
} catch (error) {
  console.error("Database error:", error)
  return NextResponse.json(
    { error: "Database error" },
    { status: 500 }
  )
}
```

## Best Practices

1. **Always validate input** before passing to query functions
2. **Use transactions** for operations that need to be atomic
3. **Check for existing records** before creating duplicates
4. **Handle null/undefined** returns properly
5. **Use TypeScript types** for type safety
6. **Add proper error logging** in production

## Database Initialization

To initialize or reset the database:

```typescript
import { initDatabase, resetDatabase } from "@/lib/init-db"

// First time setup
await initDatabase()

// Reset (drops and recreates tables)
await resetDatabase()
```

**Warning:** `resetDatabase()` will delete all data!
