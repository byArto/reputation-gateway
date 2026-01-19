import { NextResponse } from "next/server"
import { getEthosAuthUrl } from "@/lib/ethos"
import { cookies } from "next/headers"
import { SignJWT } from "jose"

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "your-secret-key-change-this-in-production"
)

/**
 * Initiate Ethos OAuth login
 * GET /api/auth/ethos/login
 *
 * Optional query params:
 * - redirect_to: URL to redirect after successful login
 * - project_slug: Project slug to apply to after login
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get("redirect_to") || "/"
    const projectSlug = searchParams.get("project_slug")

    // Get base URL for callback
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    const callbackUrl = `${baseUrl}/api/auth/ethos/callback`

    // Create state parameter with redirect info
    const stateData = {
      redirectTo,
      projectSlug,
      timestamp: Date.now(),
    }

    // Sign state to prevent tampering
    const state = await new SignJWT({ data: stateData })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .sign(SECRET_KEY)

    // Store state in cookie for verification
    const cookieStore = await cookies()
    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    })

    // Get Ethos OAuth URL
    const authUrl = getEthosAuthUrl(callbackUrl, state)

    // Redirect to Ethos OAuth
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Error initiating Ethos login:", error)
    return NextResponse.json(
      { error: "Failed to initiate login" },
      { status: 500 }
    )
  }
}
