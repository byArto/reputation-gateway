# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Vercel Postgres

### Create Database
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to Storage tab
4. Click "Create Database" → Select "Postgres"
5. Name it (e.g., "reputation-gateway-db")

### Get Environment Variables
Vercel will automatically provide these variables. Copy them to `.env.local`:

```bash
cp .env.example .env.local
# Then fill in the values from Vercel Dashboard
```

## 3. Initialize Database

Start dev server:
```bash
npm run dev
```

Visit: http://localhost:3000/api/init-db

You should see:
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

## 4. (Optional) Add Sample Data

Run this SQL in Vercel Postgres dashboard:
```bash
# Copy contents of sql/seed.sql and run in Query tab
```

## 5. Verify Setup

Check that tables were created:
```sql
SELECT * FROM projects;
SELECT * FROM applications;
```

## Quick Start Development

```bash
npm run dev
```

Visit:
- Main page: http://localhost:3000
- Create page: http://localhost:3000/create
- Tester view: http://localhost:3000/my-project
- Dashboard: http://localhost:3000/dashboard/my-project

## Project Structure

```
/app
  /page.tsx                    # Landing page
  /create/page.tsx            # Create project page
  /[slug]/page.tsx            # Tester view (dynamic)
  /dashboard/[slug]/page.tsx  # Dashboard (dynamic)
  /api/init-db/route.ts       # Database init endpoint

/components                    # UI components
  /landing-hero.tsx
  /filter-cards.tsx
  /create-page-form.tsx
  /tester-view.tsx
  /dashboard-stats.tsx
  /application-card.tsx
  /result-eligible.tsx
  /result-not-eligible.tsx

/lib
  /db.ts                      # Database queries
  /init-db.ts                 # Database initialization
  /validation.ts              # Criteria validation logic
  /utils.ts                   # Utility functions

/sql
  /schema.sql                 # Database schema
  /seed.sql                   # Sample data

/app/api
  /init-db/route.ts           # Database initialization endpoint
  /projects/create/route.ts   # Create project
  /projects/[slug]/route.ts   # Get project info
  /apply/route.ts             # Submit application
```

## Environment Variables Required

```
POSTGRES_URL                  # Main connection string
POSTGRES_PRISMA_URL          # For Prisma (if needed)
POSTGRES_URL_NON_POOLING     # Non-pooling connection
POSTGRES_USER                # Database user
POSTGRES_HOST                # Database host
POSTGRES_PASSWORD            # Database password
POSTGRES_DATABASE            # Database name
```

## API Endpoints

The following API routes are available:

**Projects:**
1. **POST /api/projects/create** - Create a new project
2. **GET /api/projects/[slug]** - Get project info and stats
3. **POST /api/apply** - Submit beta access application

**Authentication:**
1. **GET /api/auth/ethos/login** - Initiate Ethos OAuth login
2. **GET /api/auth/ethos/callback** - OAuth callback handler
3. **GET /api/auth/me** - Get current authenticated user
4. **POST /api/auth/logout** - Logout user

For detailed API documentation, see [API.md](./API.md)

For Ethos OAuth setup, see [ETHOS_AUTH.md](./ETHOS_AUTH.md)

To test the API, use the examples in [api-examples.http](./api-examples.http)

## Setup Ethos OAuth

1. Register OAuth app at [Ethos Developers](https://ethos.network/developers)
2. Set callback URL: `http://localhost:3000/api/auth/ethos/callback`
3. Add credentials to `.env.local`:
   ```env
   ETHOS_CLIENT_ID="your-client-id"
   ETHOS_CLIENT_SECRET="your-client-secret"
   SESSION_SECRET="$(openssl rand -base64 32)"
   ```

## Next Steps

1. ✅ Setup Ethos Network OAuth integration
2. ✅ Add authentication
3. Connect forms to API endpoints
4. Deploy to Vercel

## Troubleshooting

### Can't connect to database?
- Check `.env.local` has correct values
- Verify database is running in Vercel dashboard
- Try restarting dev server

### Tables not created?
- Visit `/api/init-db` endpoint
- Check Vercel logs for errors
- Run SQL manually in Vercel dashboard

### TypeScript errors?
```bash
npx tsc --noEmit
```

For detailed database documentation, see [DATABASE.md](./DATABASE.md)
