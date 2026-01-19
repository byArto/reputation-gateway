/**
 * Ethos Network API Client
 * Documentation: https://docs.ethos.network
 */

const ETHOS_API_BASE_URL = "https://api.ethos.network/api/v2"

export interface EthosUser {
  profileId: number
  primaryAddress: string
  username: string | null
  score: number
  positiveReviews: number
  negativeReviews: number
  vouches: number
  accountCreatedAt: string // ISO date string
}

export interface EthosUserResponse {
  success: boolean
  data: {
    id: number
    primaryAddress: string
    username: string | null
    score: number
    positiveReviewCount: number
    negativeReviewCount: number
    receivedVouchCount: number
    createdAt: string
  }
}

/**
 * Get Ethos user profile by profile ID
 */
export async function getEthosUserByProfileId(
  profileId: number
): Promise<EthosUser | null> {
  try {
    const response = await fetch(
      `${ETHOS_API_BASE_URL}/users/by/profile-id/${profileId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        // Cache for 5 minutes to reduce API calls
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      console.error(
        `Ethos API error: ${response.status} ${response.statusText}`
      )
      return null
    }

    const data: EthosUserResponse = await response.json()

    if (!data.success || !data.data) {
      return null
    }

    return {
      profileId: data.data.id,
      primaryAddress: data.data.primaryAddress,
      username: data.data.username || `user_${data.data.id}`,
      score: data.data.score,
      positiveReviews: data.data.positiveReviewCount,
      negativeReviews: data.data.negativeReviewCount,
      vouches: data.data.receivedVouchCount,
      accountCreatedAt: data.data.createdAt,
    }
  } catch (error) {
    console.error("Error fetching Ethos user:", error)
    return null
  }
}

/**
 * Get Ethos OAuth authorization URL
 */
export function getEthosAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.ETHOS_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "profile",
    state,
  })

  return `https://ethos.network/oauth/authorize?${params.toString()}`
}

/**
 * Exchange OAuth code for access token and user info
 */
export async function exchangeEthosCode(
  code: string,
  redirectUri: string
): Promise<{ profileId: number; accessToken: string } | null> {
  try {
    const response = await fetch("https://ethos.network/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.ETHOS_CLIENT_ID,
        client_secret: process.env.ETHOS_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!response.ok) {
      console.error(
        `Ethos token exchange error: ${response.status} ${response.statusText}`
      )
      return null
    }

    const data = await response.json()

    if (!data.access_token) {
      console.error("No access token in response")
      return null
    }

    // Get user info using access token
    const userResponse = await fetch(`${ETHOS_API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        "Content-Type": "application/json",
      },
    })

    if (!userResponse.ok) {
      console.error("Failed to fetch user info")
      return null
    }

    const userData = await userResponse.json()

    return {
      profileId: userData.data.id,
      accessToken: data.access_token,
    }
  } catch (error) {
    console.error("Error exchanging Ethos code:", error)
    return null
  }
}

/**
 * Helper function to convert Ethos user to application profile format
 */
export function ethosUserToApplicationProfile(user: EthosUser) {
  // Calculate account age in days
  const accountAge = Math.floor(
    (Date.now() - new Date(user.accountCreatedAt).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return {
    profileId: user.profileId,
    username: user.username,
    score: user.score,
    vouches: user.vouches,
    positiveReviews: user.positiveReviews,
    negativeReviews: user.negativeReviews,
    accountAge,
  }
}
