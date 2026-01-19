# Database Setup Guide

## Overview

This project uses **Vercel Postgres** for database storage. We have two main tables:
- `projects` - stores project configurations
- `applications` - stores user applications for beta access

## Setup Instructions

### 1. Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Navigate to the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name and region
6. Click "Create"

### 2. Configure Environment Variables

Vercel will automatically add these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

For local development, create a `.env.local` file and add these variables:

```env
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-prisma-url"
POSTGRES_URL_NON_POOLING="your-non-pooling-url"
POSTGRES_USER="your-user"
POSTGRES_HOST="your-host"
POSTGRES_PASSWORD="your-password"
POSTGRES_DATABASE="your-database"
```

### 3. Initialize Database

**Option A: Using API Endpoint (Recommended for development)**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the initialization endpoint:
   ```
   http://localhost:3000/api/init-db
   ```

3. You should see a success message.

**Option B: Using Vercel Dashboard**

1. Go to your Vercel Postgres dashboard
2. Click on the "Query" tab
3. Copy and paste the contents of `sql/schema.sql`
4. Click "Run Query"

**Option C: Using SQL File Directly**

If you have `psql` installed:
```bash
psql $POSTGRES_URL -f sql/schema.sql
```

### 4. (Optional) Add Sample Data

To add sample data for testing:

**Via Vercel Dashboard:**
1. Go to Query tab
2. Paste contents of `sql/seed.sql`
3. Run the query

**Via psql:**
```bash
psql $POSTGRES_URL -f sql/seed.sql
```

## Database Schema

### Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  criteria JSONB NOT NULL,
  manual_review BOOLEAN NOT NULL DEFAULT false,
  destination_url TEXT NOT NULL,
  destination_type TEXT NOT NULL CHECK (destination_type IN ('discord', 'beta')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Criteria JSON Structure:**
```json
{
  "minScore": 1400,
  "minVouches": 1,
  "positiveReviews": true,
  "minAccountAge": 7
}
```

### Applications Table

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  ethos_profile_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'rejected', 'pending')),
  rejection_reason TEXT,
  criteria_snapshot JSONB NOT NULL,
  can_reapply_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Query Functions

All database query functions are located in `/lib/db.ts`. Here are the available functions:

### Project Queries

- `createProject(data)` - Create a new project
- `getProjectBySlug(slug)` - Get project by slug
- `getAllProjects()` - Get all projects
- `updateProject(id, data)` - Update project

### Application Queries

- `createApplication(data)` - Create a new application
- `getApplicationsByProjectId(projectId)` - Get all applications for a project
- `getApplicationById(id)` - Get single application
- `updateApplicationStatus(id, status, rejectionReason)` - Update application status
- `getApplicationStats(projectId)` - Get statistics for a project
- `checkExistingApplication(projectId, ethosProfileId)` - Check if user already applied

## Example Usage

```typescript
import {
  createProject,
  getProjectBySlug,
  createApplication,
  getApplicationStats,
} from "@/lib/db"

// Create a project
const project = await createProject({
  name: "My Project",
  slug: "my-project",
  criteria: {
    minScore: 1400,
    minVouches: 1,
    positiveReviews: true,
    minAccountAge: 7,
  },
  manualReview: true,
  destinationUrl: "https://discord.gg/my-project",
  destinationType: "discord",
})

// Get project by slug
const project = await getProjectBySlug("my-project")

// Create application
const application = await createApplication({
  projectId: project.id,
  ethosProfileId: 12345,
  username: "alice.eth",
  score: 1650,
  status: "pending",
  criteriaSnapshot: project.criteria,
})

// Get stats
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

## Troubleshooting

### Connection Issues

If you can't connect to the database:
1. Check that environment variables are set correctly
2. Verify the database is running in Vercel dashboard
3. Try redeploying your project

### Table Already Exists

If you see "table already exists" errors:
1. The tables might already be created
2. You can drop and recreate using the init-db functions

### Permission Errors

Make sure your Vercel Postgres user has the necessary permissions to create tables and extensions.

## Security Notes

- The `/api/init-db` endpoint is disabled in production for security
- Never commit `.env.local` to version control
- Use environment variables for all database credentials
- Consider adding authentication to sensitive endpoints
