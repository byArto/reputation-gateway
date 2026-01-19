import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getEthosUserByProfileId } from "@/lib/ethos"

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Get fresh user data from Ethos
    const user = await getEthosUserByProfileId(session.profileId)

    if (!user) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        profileId: user.profileId,
        username: user.username,
        primaryAddress: user.primaryAddress,
        score: user.score,
        vouches: user.vouches,
        positiveReviews: user.positiveReviews,
        negativeReviews: user.negativeReviews,
        accountCreatedAt: user.accountCreatedAt,
      },
    })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}
