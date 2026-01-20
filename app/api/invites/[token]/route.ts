import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getInviteToken, markTokenAsUsed } from '@/lib/invite-tokens'

/**
 * POST /api/invites/[token]
 *
 * Redeem a one-time-use invite token
 *
 * Validates:
 * - User is authenticated
 * - Token exists
 * - Token belongs to current user
 * - Token hasn't been used
 * - Token hasn't expired
 *
 * On success, marks token as used and returns destination URL
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token: tokenParam } = await params

    // 1. Verify user session
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'Please log in to access this invite'
        },
        { status: 401 }
      )
    }

    // 2. Get token from database
    const tokenData = await getInviteToken(tokenParam)

    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          error: 'invalid_token',
          message: 'Invite token not found'
        },
        { status: 404 }
      )
    }

    // 3. Verify token belongs to current user (security check)
    if (tokenData.ethos_profile_id !== session.profileId) {
      console.warn('Token theft attempt detected:', {
        token: `${tokenParam.slice(0, 8)}...`,
        token_profile: tokenData.ethos_profile_id,
        session_profile: session.profileId,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      })

      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: 'This invite belongs to a different account'
        },
        { status: 403 }
      )
    }

    // 4. Check if token already used
    if (tokenData.is_used) {
      return NextResponse.json(
        {
          success: false,
          error: 'token_used',
          message: 'This invite has already been used',
          used_at: tokenData.used_at
        },
        { status: 400 }
      )
    }

    // 5. Check if token expired
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)

    if (now > expiresAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'token_expired',
          message: 'This invite has expired. Please request a new one.',
          expired_at: tokenData.expires_at
        },
        { status: 400 }
      )
    }

    // 6. Mark token as used (atomic operation)
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'

    await markTokenAsUsed(tokenParam, ipAddress)

    // 7. Return destination URL
    console.log('Token redeemed successfully:', {
      token: `${tokenParam.slice(0, 8)}...`,
      profile: session.profileId,
      ip: ipAddress
    })

    return NextResponse.json({
      success: true,
      redirect_url: tokenData.destination_url,
      destination_type: 'discord' // TODO: get from project table
    })

  } catch (error) {
    console.error('Error redeeming invite token:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        message: 'Failed to redeem invite. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
