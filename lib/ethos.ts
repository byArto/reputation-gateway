// lib/ethos.ts
/**
 * Ethos Network API Client
 * Documentation: https://docs.ethos.network
 */

const ETHOS_API_BASE_URL = "https://api.ethos.network/api/v2"
const ETHOS_CLIENT_NAME = "reputation-gateway"

export interface EthosUser {
  profileId: number
  primaryAddress: string
  username: string | null
  score: number
  positiveReviews: number
  negativeReviews: number
  vouches: number
  accountCreatedAt: string
  hasSlashProtection?: boolean
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
    slashed?: boolean
  }
}

/**
 * Get Ethos user score by wallet address
 * Uses /score/address endpoint
 */
async function getScoreByAddress(walletAddress: string): Promise<{ score: number; level: string } | null> {
  try {
    const response = await fetch(
      `${ETHOS_API_BASE_URL}/score/address?address=${walletAddress}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Ethos-Client': ETHOS_CLIENT_NAME,
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      console.error(`Score API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return { score: data.score, level: data.level }
  } catch (error) {
    console.error('Error fetching score:', error)
    return null
  }
}

/**
 * Get profile creation date using /profiles endpoint
 */
async function getProfileCreatedAt(walletAddress: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${ETHOS_API_BASE_URL}/profiles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Ethos-Client': ETHOS_CLIENT_NAME,
        },
        body: JSON.stringify({
          addresses: [walletAddress],
          limit: 1,
        }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      console.error(`Profiles API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()

    console.log('DEBUG getProfileCreatedAt: API response:', JSON.stringify(data, null, 2))

    if (data.values && data.values.length > 0) {
      const profileData = data.values[0]

      // createdAt находится в profile.createdAt, а не в values[0].createdAt
      if (profileData.profile && profileData.profile.createdAt) {
        const createdAt = profileData.profile.createdAt
        console.log('DEBUG getProfileCreatedAt: Found createdAt:', createdAt)

        // createdAt это timestamp в миллисекундах (number)
        return new Date(createdAt).toISOString()
      }
    }

    console.log('DEBUG getProfileCreatedAt: No createdAt found')
    return null
  } catch (error) {
    console.error('Error fetching profile createdAt:', error)
    return null
  }
}

/**
 * Get Ethos user profile data using activities endpoint with userkey
 */
async function getProfileByUserkey(walletAddress: string): Promise<{
  profileId: number
  username: string | null
  score: number
  positiveReviews: number
  negativeReviews: number
  vouches: number
  primaryAddress: string
} | null> {
  try {
    const userkey = `address:${walletAddress}`
    
    const response = await fetch(
      `${ETHOS_API_BASE_URL}/activities/profile/received`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Ethos-Client': ETHOS_CLIENT_NAME,
        },
        body: JSON.stringify({
          userkey,
          filter: ['review', 'vouch'],
          limit: 1,
        }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      console.error(`Profile API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    
    // Extract user data from subjectUser in the response
    if (data.values && data.values.length > 0 && data.values[0].subjectUser) {
      const user = data.values[0].subjectUser
      return {
        profileId: user.profileId,
        username: user.username,
        score: user.score,
        positiveReviews: user.stats?.review?.received?.positive || 0,
        negativeReviews: user.stats?.review?.received?.negative || 0,
        vouches: user.stats?.vouch?.received?.count || 0,
        primaryAddress: user.userkeys?.find((k: string) => k.startsWith('address:'))?.replace('address:', '') || walletAddress,
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

/**
 * Get Ethos user profile by wallet address
 * Main function that combines score and profile data
 */
export async function getEthosUserByWalletAddress(
  walletAddress: string,
  clientName: string = ETHOS_CLIENT_NAME
): Promise<EthosUser | null> {
  console.log('DEBUG: Fetching Ethos user for wallet:', walletAddress)

  try {
    // First, get the score
    const scoreData = await getScoreByAddress(walletAddress)
    
    if (!scoreData) {
      console.log('DEBUG: No score found for address')
      return null
    }

    console.log('DEBUG: Score found:', scoreData.score)

    // Get profile details and creation date in parallel
    const [profileData, createdAt] = await Promise.all([
      getProfileByUserkey(walletAddress),
      getProfileCreatedAt(walletAddress)
    ])

    if (profileData) {
      console.log('DEBUG: Profile found:', profileData.username, 'Score:', profileData.score)
      console.log('DEBUG: Account created at:', createdAt || 'unknown')

      return {
        profileId: profileData.profileId,
        primaryAddress: profileData.primaryAddress,
        username: profileData.username || `user_${profileData.profileId}`,
        score: profileData.score, // Use score from profile (more accurate)
        positiveReviews: profileData.positiveReviews,
        negativeReviews: profileData.negativeReviews,
        vouches: profileData.vouches,
        accountCreatedAt: createdAt || new Date().toISOString(), // Use real creation date if available
        hasSlashProtection: true, // Default, could be checked separately
      }
    }

    // Fallback: return minimal data with just score
    console.log('DEBUG: Using score-only fallback')
    return {
      profileId: 0,
      primaryAddress: walletAddress,
      username: `user_${walletAddress.slice(0, 8)}`,
      score: scoreData.score,
      positiveReviews: 0,
      negativeReviews: 0,
      vouches: 0,
      accountCreatedAt: createdAt || new Date().toISOString(), // Use real creation date if available
      hasSlashProtection: true,
    }

  } catch (error) {
    console.error('Error fetching Ethos user by wallet:', error)
    return null
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
          "X-Ethos-Client": ETHOS_CLIENT_NAME,
        },
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
      hasSlashProtection: !data.data.slashed,
    }
  } catch (error) {
    console.error("Error fetching Ethos user:", error)
    return null
  }
}

/**
 * Helper function to convert Ethos user to application profile format
 */
export function ethosUserToApplicationProfile(user: EthosUser) {
  const accountAge = Math.floor(
    (Date.now() - new Date(user.accountCreatedAt).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const score = typeof user.score === 'number' && !isNaN(user.score)
    ? user.score
    : 0

  return {
    profileId: user.profileId,
    username: user.username || `user_${user.profileId}`, // Добавлен fallback
    score,
    vouches: user.vouches || 0,
    positiveReviews: user.positiveReviews || 0,
    negativeReviews: user.negativeReviews || 0,
    accountAge,
    hasSlashProtection: user.hasSlashProtection ?? true,
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