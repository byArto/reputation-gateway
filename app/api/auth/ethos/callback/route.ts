import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { exchangeEthosCode, getEthosUserByProfileId } from "@/lib/ethos"
import { createSession } from "@/lib/session"

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "your-secret-key-change-this-in-production"
)

/**
 * Handle Ethos OAuth callback
 * GET /api/auth/ethos/callback
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Check for OAuth errors
    if (error) {
      console.error("OAuth error:", error)
      return NextResponse.redirect(
        new URL(`/?error=oauth_${error}`, request.url)
      )
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/?error=missing_parameters", request.url)
      )
    }

    // Verify state parameter
    const cookieStore = await cookies()
    const storedState = cookieStore.get("oauth_state")

    if (!storedState || storedState.value !== state) {
      console.error("State mismatch")
      return NextResponse.redirect(
        new URL("/?error=invalid_state", request.url)
      )
    }

    // Decode state to get redirect info
    let stateData: {
      redirectTo: string
      projectSlug?: string
      timestamp: number
    }

    try {
      const verified = await jwtVerify(state, SECRET_KEY)
      stateData = verified.payload.data as typeof stateData
    } catch (error) {
      console.error("State verification failed:", error)
      return NextResponse.redirect(
        new URL("/?error=invalid_state", request.url)
      )
    }

    // Get callback URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    const callbackUrl = `${baseUrl}/api/auth/ethos/callback`

    // Exchange code for access token and profile ID
    const tokenData = await exchangeEthosCode(code, callbackUrl)

    if (!tokenData) {
      return NextResponse.redirect(
        new URL("/?error=token_exchange_failed", request.url)
      )
    }

    // Get user profile data
    const user = await getEthosUserByProfileId(tokenData.profileId)

    if (!user) {
      return NextResponse.redirect(
        new URL("/?error=failed_to_fetch_profile", request.url)
      )
    }

    // Create session
    await createSession({
      profileId: user.profileId,
      username: user.username || `user_${user.profileId}`,
      accessToken: tokenData.accessToken,
    })

    // Delete oauth_state cookie
    cookieStore.delete("oauth_state")

    // Redirect based on state data
    let redirectUrl = stateData.redirectTo

    // If logging in to apply to a project, redirect to that project's page
    if (stateData.projectSlug) {
      redirectUrl = `/${stateData.projectSlug}?login_success=true`
    }

    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error("Error in OAuth callback:", error)
    return NextResponse.redirect(
      new URL("/?error=callback_failed", request.url)
    )
  }
}
