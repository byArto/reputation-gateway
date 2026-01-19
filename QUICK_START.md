# Quick Start Guide

Get Reputation Gateway running in 5 minutes.

## Prerequisites

- Node.js 18+
- Vercel account
- Ethos Network account

## Step 1: Clone & Install (1 min)

```bash
npm install
```

## Step 2: Setup Database (2 min)

1. Create Vercel Postgres database in dashboard
2. Copy credentials to `.env.local`:
   ```bash
   cp .env.example .env.local
   # Paste Vercel Postgres credentials
   ```

## Step 3: Setup Ethos OAuth (1 min)

1. Go to [Ethos Developers](https://ethos.network/developers)
2. Create OAuth app
3. Callback URL: `http://localhost:3000/api/auth/ethos/callback`
4. Add to `.env.local`:
   ```env
   ETHOS_CLIENT_ID="your-id"
   ETHOS_CLIENT_SECRET="your-secret"
   SESSION_SECRET="$(openssl rand -base64 32)"
   ```

## Step 4: Initialize & Run (1 min)

```bash
# Start dev server
npm run dev

# Initialize database (in browser)
open http://localhost:3000/api/init-db

# Open app
open http://localhost:3000
```

## Test the Flow

### Create a Project

```bash
curl -X POST http://localhost:3000/api/projects/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "slug": "test-project",
    "criteria": {
      "minScore": 1400,
      "minVouches": 1,
      "positiveReviews": true,
      "minAccountAge": 7
    },
    "manual_review": false,
    "destination_url": "https://discord.gg/test",
    "destination_type": "discord"
  }'
```

### Test Login

```bash
open http://localhost:3000/api/auth/ethos/login?project_slug=test-project
```

### View Project

```bash
open http://localhost:3000/test-project
```

### View Dashboard

```bash
open http://localhost:3000/dashboard/test-project
```

## What's Next?

- Read [API.md](./API.md) for API documentation
- Read [ETHOS_AUTH.md](./ETHOS_AUTH.md) for auth details
- Connect UI forms to API
- Deploy to Vercel

## Common Issues

**Database not initialized?**
```bash
curl http://localhost:3000/api/init-db
```

**Session not working?**
- Check SESSION_SECRET is set
- Check cookies are enabled
- Restart dev server

**OAuth failing?**
- Verify callback URL matches Ethos settings
- Check ETHOS_CLIENT_ID and SECRET
- Ensure using http://localhost:3000 (not 127.0.0.1)

## Key URLs

- Landing: http://localhost:3000
- Create: http://localhost:3000/create
- Project: http://localhost:3000/{slug}
- Dashboard: http://localhost:3000/dashboard/{slug}
- Login: http://localhost:3000/api/auth/ethos/login
- API Docs: [API.md](./API.md)

## File Structure

```
/app
  /api/auth/ethos      # OAuth routes
  /api/projects        # Project API
  /api/apply           # Application API
  /[slug]              # Tester view
  /dashboard/[slug]    # Dashboard

/lib
  /ethos.ts           # Ethos API client
  /session.ts         # Session management
  /db.ts              # Database queries
  /validation.ts      # Criteria validation
```

## Environment Variables

```env
# Database (from Vercel)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Ethos OAuth (from ethos.network/developers)
ETHOS_CLIENT_ID=
ETHOS_CLIENT_SECRET=

# Session (generate with openssl)
SESSION_SECRET=

# Base URL (optional)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Deploy to Production

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push

# Deploy to Vercel
vercel

# Add environment variables in Vercel dashboard
# Update Ethos OAuth callback URL to production URL
```

That's it! 🎉
