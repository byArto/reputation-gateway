# API Documentation

## Base URL

- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

## Endpoints

### 1. Create Project

Create a new project with access criteria.

**Endpoint:** `POST /api/projects/create`

**Request Body:**
```json
{
  "name": "DeFi Protocol Beta",
  "slug": "defi-protocol",
  "criteria": {
    "minScore": 1400,
    "minVouches": 1,
    "positiveReviews": true,
    "minAccountAge": 7
  },
  "manual_review": true,
  "destination_url": "https://discord.gg/defi-protocol",
  "destination_type": "discord"
}
```

**Field Validations:**
- `name`: Required, string
- `slug`: Required, string (lowercase, alphanumeric, hyphens only, must be unique)
- `criteria`: Required, object
  - `minScore`: number (Ethos score minimum)
  - `minVouches`: number (minimum number of vouches)
  - `positiveReviews`: boolean (require positive review balance)
  - `minAccountAge`: number (minimum account age in days)
- `manual_review`: boolean (default: false)
- `destination_url`: Required, string (must start with https://)
- `destination_type`: Required, string ("discord" or "beta")

**Success Response (201):**
```json
{
  "success": true,
  "project": {
    "id": "uuid",
    "name": "DeFi Protocol Beta",
    "slug": "defi-protocol",
    "access_page_url": "https://your-domain.com/defi-protocol",
    "dashboard_url": "https://your-domain.com/dashboard/defi-protocol"
  }
}
```

**Error Responses:**

`400 Bad Request`:
```json
{
  "error": "Missing required fields"
}
```

`409 Conflict`:
```json
{
  "error": "A project with this slug already exists"
}
```

---

### 2. Get Project Information

Get project details and statistics by slug.

**Endpoint:** `GET /api/projects/[slug]`

**Example:** `GET /api/projects/defi-protocol`

**Success Response (200):**
```json
{
  "success": true,
  "project": {
    "id": "uuid",
    "name": "DeFi Protocol Beta",
    "slug": "defi-protocol",
    "criteria": {
      "minScore": 1400,
      "minVouches": 1,
      "positiveReviews": true,
      "minAccountAge": 7
    },
    "manual_review": true,
    "destination_url": "https://discord.gg/defi-protocol",
    "destination_type": "discord",
    "created_at": "2024-01-19T12:00:00Z",
    "stats": {
      "total_applications": 147,
      "last_24h": 12,
      "accepted": 52,
      "accepted_percent": 35,
      "rejected": 95,
      "rejected_percent": 65,
      "pending": 0,
      "avg_score": 1385,
      "avg_accepted_score": 1612
    }
  }
}
```

**Error Response (404):**
```json
{
  "error": "Project not found"
}
```

---

### 3. Submit Application

Submit a beta access application for a project.

**Endpoint:** `POST /api/apply`

**Request Body:**
```json
{
  "project_slug": "defi-protocol",
  "ethos_profile": {
    "profileId": 12345,
    "username": "alice.eth",
    "score": 1650,
    "vouches": 3,
    "positiveReviews": 15,
    "negativeReviews": 2,
    "accountAge": 45
  }
}
```

**Field Descriptions:**
- `project_slug`: The project's slug
- `ethos_profile`: Object containing Ethos Network profile data
  - `profileId`: Ethos profile ID (number)
  - `username`: Ethos username (string)
  - `score`: Current Ethos credibility score (number)
  - `vouches`: Number of vouches received (number)
  - `positiveReviews`: Number of positive reviews (number)
  - `negativeReviews`: Number of negative reviews (number)
  - `accountAge`: Account age in days (number)

**Success Response - Accepted (201):**
```json
{
  "success": true,
  "application_id": "uuid",
  "status": "accepted",
  "message": "Congratulations! Your application has been accepted. You now have access to the beta.",
  "destination_url": "https://discord.gg/defi-protocol"
}
```

**Success Response - Pending Manual Review (201):**
```json
{
  "success": true,
  "application_id": "uuid",
  "status": "pending",
  "message": "Your application is pending manual review. You will be notified of the decision."
}
```

**Success Response - Rejected (200):**
```json
{
  "success": false,
  "application_id": "uuid",
  "status": "rejected",
  "message": "Unfortunately, your application does not meet the required criteria at this time.",
  "rejection_reason": "Score 1180 is below minimum 1400; Vouches 0 is below minimum 1",
  "failed_criteria": [
    "Score 1180 is below minimum 1400",
    "Vouches 0 is below minimum 1"
  ],
  "can_reapply_at": "2024-02-19T12:00:00Z"
}
```

**Error Responses:**

`400 Bad Request`:
```json
{
  "error": "Missing required fields: project_slug and ethos_profile"
}
```

`404 Not Found`:
```json
{
  "error": "Project not found"
}
```

`403 Forbidden` (Cannot reapply yet):
```json
{
  "error": "Cannot reapply yet",
  "status": "rejected",
  "can_reapply_at": "2024-02-19T12:00:00Z",
  "rejection_reason": "Score below minimum threshold"
}
```

`409 Conflict` (Already applied):
```json
{
  "error": "Application already exists",
  "status": "accepted",
  "application_id": "uuid"
}
```

---

## Application Flow

### For Project Creators:

1. **Create Project** → `POST /api/projects/create`
2. Share the access page URL with users
3. Monitor applications in dashboard

### For Beta Testers:

1. Visit project access page (`/{slug}`)
2. Connect Ethos profile
3. Submit application → `POST /api/apply`
4. Receive immediate result:
   - **Accepted**: Get destination URL (Discord/Beta link)
   - **Pending**: Wait for manual review
   - **Rejected**: See rejection reasons, can reapply in 30 days

---

## Application Status Logic

### Auto-Accept Flow
```
User applies → Criteria check → All pass + No manual review → ACCEPTED
```

### Manual Review Flow
```
User applies → Criteria check → All pass + Manual review enabled → PENDING
```

### Auto-Reject Flow
```
User applies → Criteria check → Any criteria fails → REJECTED
```

---

## Validation Rules

### Criteria Checks (in order):

1. **Minimum Score**: `profile.score >= criteria.minScore`
2. **Minimum Vouches**: `profile.vouches >= criteria.minVouches`
3. **Positive Review Balance**: `(positiveReviews - negativeReviews) > 0`
   - Only checked if `criteria.positiveReviews === true`
4. **Minimum Account Age**: `profile.accountAge >= criteria.minAccountAge`

All criteria must pass for acceptance (unless rejected).

### Reapplication Rules

- Users can reapply **30 days** after rejection
- Previous application status is checked before allowing new application
- Pending or accepted applications cannot be replaced

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

Common HTTP Status Codes:
- `200` - Success (also used for rejected applications)
- `201` - Created (new application accepted/pending)
- `400` - Bad Request (validation error)
- `403` - Forbidden (cannot reapply yet)
- `404` - Not Found (project doesn't exist)
- `409` - Conflict (duplicate slug/application)
- `500` - Internal Server Error

---

## Example Usage

### Complete Flow Example (using fetch)

```javascript
// 1. Create a project
const createProject = async () => {
  const response = await fetch('/api/projects/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "My DeFi Protocol",
      slug: "my-defi",
      criteria: {
        minScore: 1400,
        minVouches: 1,
        positiveReviews: true,
        minAccountAge: 7
      },
      manual_review: false,
      destination_url: "https://discord.gg/my-defi",
      destination_type: "discord"
    })
  })

  const data = await response.json()
  console.log('Project created:', data.project.access_page_url)
}

// 2. Get project info
const getProject = async (slug) => {
  const response = await fetch(`/api/projects/${slug}`)
  const data = await response.json()
  console.log('Project:', data.project)
}

// 3. Submit application
const applyForAccess = async (slug, ethosProfile) => {
  const response = await fetch('/api/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project_slug: slug,
      ethos_profile: ethosProfile
    })
  })

  const data = await response.json()

  if (data.status === 'accepted') {
    console.log('Accepted! Go to:', data.destination_url)
  } else if (data.status === 'pending') {
    console.log('Pending review:', data.message)
  } else if (data.status === 'rejected') {
    console.log('Rejected:', data.rejection_reason)
    console.log('Can reapply at:', data.can_reapply_at)
  }
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production to prevent abuse.

---

## Authentication

Currently no authentication is required for these endpoints. In production, you may want to:

1. Add API key authentication for project creation
2. Require Ethos authentication for applications
3. Add admin authentication for manual review actions

---

## Database Initialization

Before using the API, initialize the database:

**Endpoint:** `GET /api/init-db` (Development only)

This endpoint is disabled in production for security reasons.
