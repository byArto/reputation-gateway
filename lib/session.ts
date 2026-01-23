import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// Ensure SESSION_SECRET is set - no insecure fallback
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required')
}

const SECRET_KEY = new TextEncoder().encode(process.env.SESSION_SECRET)

const COOKIE_NAME = "ethos_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface SessionData {
  profileId: number
  username: string
  accessToken: string
  createdAt: number
}

/**
 * Create a new session
 */
export async function createSession(data: Omit<SessionData, "createdAt">) {
  const sessionData: SessionData = {
    ...data,
    createdAt: Date.now(),
  }

  // Create JWT token
  const token = await new SignJWT({ data: sessionData })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })

  return token
}

/**
 * Get current session
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)

    if (!token?.value) {
      return null
    }

    const verified = await jwtVerify(token.value, SECRET_KEY)
    return (verified.payload.data as SessionData) || null
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

/**
 * Delete session
 */
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Verify if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Require authentication (use in server components/actions)
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  return session
}
