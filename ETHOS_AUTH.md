# Ethos OAuth Authentication

This document explains how Ethos OAuth authentication is implemented in the Reputation Gateway.

## Overview

The application uses Ethos Network OAuth for user authentication. Users sign in with their Ethos profiles, which provides access to their on-chain reputation data.

## Setup

### 1. Register OAuth Application

1. Go to [Ethos Network Developers](https://ethos.network/developers)
2. Create a new OAuth application
3. Set the redirect URI to: `https://your-domain.com/api/auth/ethos/callback`
4. Copy your Client ID and Client Secret

### 2. Configure Environment Variables

Add to your `.env.local`:

```env
ETHOS_CLIENT_ID="your-client-id"
ETHOS_CLIENT_SECRET="your-client-secret"
SESSION_SECRET="generate-with-openssl-rand-base64-32"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Generate a secure session secret:
```bash
openssl rand -base64 32
```

## Authentication Flow

### 1. Login Initiation

**Endpoint:** `GET /api/auth/ethos/login`

**Query Parameters:**
- `redirect_to` (optional) - URL to redirect after login (default: `/`)
- `project_slug` (optional) - Auto-redirect to project page after login

**Example:**
```
/api/auth/ethos/login?project_slug=defi-protocol
```

**Flow:**
1. Creates signed state parameter with redirect info
2. Stores state in HTTP-only cookie
3. Redirects to Ethos OAuth authorization page

### 2. OAuth Callback

**Endpoint:** `GET /api/auth/ethos/callback`

**Query Parameters** (from Ethos):
- `code` - Authorization code
- `state` - State parameter for CSRF protection

**Flow:**
1. Verifies state parameter matches stored value
2. Exchanges authorization code for access token
3. Fetches user profile from Ethos API
4. Creates encrypted session cookie
5. Redirects to original destination

### 3. Session Management

Sessions are stored in HTTP-only cookies using JWT tokens.

**Session Data:**
```typescript
interface SessionData {
  profileId: number
  username: string
  accessToken: string
  createdAt: number
}
```

**Cookie Configuration:**
- Name: `ethos_session`
- Duration: 7 days
- HTTP-only: Yes
- Secure: Yes (in production)
- SameSite: Lax

## API Endpoints

### Get Current User

**Endpoint:** `GET /api/auth/me`

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "profileId": 12345,
    "username": "alice.eth",
    "primaryAddress": "0x...",
    "score": 1650,
    "vouches": 3,
    "positiveReviews": 15,
    "negativeReviews": 2,
    "accountCreatedAt": "2023-01-15T00:00:00Z"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "authenticated": false
}
```

### Logout

**Endpoint:** `POST /api/auth/logout` or `GET /api/auth/logout`

**Query Parameters:**
- `redirect_to` (optional) - URL to redirect after logout

**POST Response:**
```json
{
  "success": true,
  "redirect_to": "/"
}
```

**GET:** Redirects to specified URL

## Usage in Components

### Client Components

```typescript
'use client'

import { useEffect, useState } from 'react'

export function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user)
        }
      })
  }, [])

  if (!user) {
    return (
      <a href="/api/auth/ethos/login">
        Login with Ethos
      </a>
    )
  }

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <p>Score: {user.score}</p>
      <a href="/api/auth/logout">Logout</a>
    </div>
  )
}
```

### Server Components

```typescript
import { getSession } from '@/lib/session'

export default async function ProtectedPage() {
  const session = await getSession()

  if (!session) {
    redirect('/api/auth/ethos/login')
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {session.username}!</p>
    </div>
  )
}
```

### Server Actions

```typescript
import { requireAuth } from '@/lib/session'

export async function protectedAction() {
  try {
    const session = await requireAuth()
    // User is authenticated
    // Do something with session.profileId
  } catch (error) {
    throw new Error('Unauthorized')
  }
}
```

## Library Functions

### lib/ethos.ts

**Get User Profile:**
```typescript
import { getEthosUserByProfileId } from '@/lib/ethos'

const user = await getEthosUserByProfileId(12345)
```

**Convert to Application Format:**
```typescript
import { ethosUserToApplicationProfile } from '@/lib/ethos'

const profile = ethosUserToApplicationProfile(user)
// Use with /api/apply endpoint
```

### lib/session.ts

**Get Current Session:**
```typescript
import { getSession } from '@/lib/session'

const session = await getSession()
if (session) {
  console.log(session.profileId)
}
```

**Check Authentication:**
```typescript
import { isAuthenticated } from '@/lib/session'

const authed = await isAuthenticated()
```

**Require Authentication:**
```typescript
import { requireAuth } from '@/lib/session'

const session = await requireAuth() // Throws if not authenticated
```

**Delete Session:**
```typescript
import { deleteSession } from '@/lib/session'

await deleteSession()
```

## Security Features

### CSRF Protection

- State parameter is cryptographically signed
- State is stored in HTTP-only cookie
- Verified on callback

### Session Security

- Sessions stored in encrypted JWT tokens
- HTTP-only cookies prevent XSS attacks
- Secure flag in production
- 7-day expiration
- SameSite: Lax prevents CSRF

### Token Storage

- Access tokens stored in session
- Never exposed to client-side JavaScript
- Used for server-side API calls only

## Error Handling

OAuth errors are redirected to home page with error parameter:

- `?error=oauth_access_denied` - User denied access
- `?error=missing_parameters` - Missing code or state
- `?error=invalid_state` - State verification failed
- `?error=token_exchange_failed` - Failed to get access token
- `?error=failed_to_fetch_profile` - Failed to get user profile
- `?error=callback_failed` - General callback error

## Testing

### Manual Testing

1. **Login Flow:**
   ```
   Visit: http://localhost:3000/api/auth/ethos/login
   - Should redirect to Ethos OAuth page
   - Authorize the application
   - Should redirect back and create session
   ```

2. **Check Session:**
   ```
   Visit: http://localhost:3000/api/auth/me
   - Should return user data if authenticated
   ```

3. **Logout:**
   ```
   Visit: http://localhost:3000/api/auth/logout
   - Should clear session
   ```

### Integration with Application Flow

1. User visits project page: `/{slug}`
2. Clicks "Check My Access"
3. Redirects to: `/api/auth/ethos/login?project_slug={slug}`
4. After OAuth, redirects back to: `/{slug}?login_success=true`
5. Page detects login and auto-submits application

## Production Considerations

### Environment Variables

In Vercel, add these environment variables:
- `ETHOS_CLIENT_ID`
- `ETHOS_CLIENT_SECRET`
- `SESSION_SECRET`
- `NEXT_PUBLIC_BASE_URL` (auto-detected if not set)

### Callback URL

Update OAuth application callback URL to:
```
https://your-domain.com/api/auth/ethos/callback
```

### HTTPS

Sessions are only secure with HTTPS in production. The `secure` flag is automatically enabled in production.

### Rate Limiting

Consider implementing rate limiting for:
- Login endpoint (prevent brute force)
- Callback endpoint (prevent abuse)
- User info endpoint (prevent API spam)

## Troubleshooting

### "Invalid state" error

- Check that SESSION_SECRET is set
- Verify cookies are enabled
- Check that callback URL matches registered URL

### "Failed to fetch profile" error

- Check ETHOS_CLIENT_ID and ETHOS_CLIENT_SECRET
- Verify Ethos API is accessible
- Check network/firewall settings

### Session not persisting

- Verify cookies are enabled
- Check cookie domain settings
- Ensure HTTPS in production
- Verify SESSION_SECRET is consistent

### OAuth redirect loop

- Check callback URL configuration
- Verify state parameter handling
- Check for cookie issues
