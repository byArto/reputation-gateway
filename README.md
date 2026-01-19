# Reputation Gateway

A Next.js application for filtering beta testers by on-chain reputation using Ethos Network.

## Features

- **Project Creation** - Create access pages with custom reputation criteria
- **Automatic Filtering** - Accept/reject applicants based on Ethos score, vouches, reviews, and account age
- **Manual Review** - Optional manual approval process
- **Dashboard** - Monitor applications and statistics
- **Reapplication Logic** - Rejected users can reapply after 30 days

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Vercel Postgres
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **Fonts**: Playfair Display (serif) + Inter (sans)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
1. Create Vercel Postgres database
2. Copy `.env.example` to `.env.local`
3. Add your database credentials

### 3. Initialize Database
```bash
npm run dev
# Visit http://localhost:3000/api/init-db
```

### 4. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

## Project Structure

```
/app
  /page.tsx                    # Landing page
  /create/page.tsx             # Create project
  /[slug]/page.tsx             # Tester access page
  /dashboard/[slug]/page.tsx   # Dashboard
  /api                         # API routes

/components                     # React components
/lib                           # Database & utilities
/sql                           # SQL schemas
```

## API Routes

- `POST /api/projects/create` - Create new project
- `GET /api/projects/[slug]` - Get project info
- `POST /api/apply` - Submit application

See [API.md](./API.md) for detailed documentation.

## Database Schema

### Projects Table
- Project configuration and criteria
- Destination URLs (Discord/Beta)
- Manual review settings

### Applications Table
- User applications
- Status tracking (accepted/rejected/pending)
- Reapplication logic

See [DATABASE.md](./DATABASE.md) for full schema.

## URL Structure

- `/` - Landing page
- `/create` - Create access page
- `/[slug]` - Tester view (e.g., `/defi-protocol`)
- `/dashboard/[slug]` - Dashboard (e.g., `/dashboard/defi-protocol`)

## Filter Presets

### Basic
- Score ≥ 1200
- Slash protection

### Standard (Recommended)
- Score ≥ 1400
- 1+ vouches
- Positive reviews
- 7+ days old

### Strict
- Score ≥ 1600
- 2+ vouches
- Positive reviews
- 30+ days old

### Custom
- Configure your own criteria

## Environment Variables

Required environment variables:

**Database (from Vercel Postgres):**
```env
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

**Ethos OAuth:**
```env
ETHOS_CLIENT_ID
ETHOS_CLIENT_SECRET
SESSION_SECRET
```

**Optional:**
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Documentation

- [SETUP.md](./SETUP.md) - Setup guide
- [API.md](./API.md) - API documentation
- [DATABASE.md](./DATABASE.md) - Database documentation
- [ETHOS_AUTH.md](./ETHOS_AUTH.md) - Ethos OAuth authentication
- [lib/README.md](./lib/README.md) - Query functions guide
- [lib/FILTERS.md](./lib/FILTERS.md) - Filter system and eligibility checking

## Testing

Test API endpoints using [api-examples.http](./api-examples.http)

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add Postgres database
4. Deploy

Environment variables will be automatically added.

## Development Workflow

1. **Create Project** via `/create` page or API
2. **Share Access Page** at `/{slug}`
3. **Users Apply** with their Ethos profiles
4. **Review Applications** in `/dashboard/{slug}`
5. **Users Get Access** via Discord/Beta URL

## Application Logic

```
User applies → Check criteria → Auto accept/reject/pending
                                ↓
                        Manual review (optional)
                                ↓
                        Accepted → Destination URL
                        Rejected → Can reapply in 30 days
```

## Validation Rules

Applications are validated against:
1. Minimum Ethos score
2. Minimum vouches
3. Positive review balance
4. Minimum account age (days)

All criteria must pass for acceptance.

## Contributing

This is a hackathon project. Feel free to fork and modify.

## License

MIT

## Support

For issues and questions, see the documentation files.
