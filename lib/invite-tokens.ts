/**
 * Invite Tokens - One-time-use secure tokens for destination URL access
 *
 * This module provides utilities for creating, validating, and redeeming
 * invite tokens with 24-hour expiration and single-use enforcement.
 */

import crypto from 'crypto'
import { sql } from './db'

/**
 * Generate cryptographically secure random token
 * Uses 32 bytes (256 bits) of entropy for security
 *
 * @returns 64-character hexadecimal token string
 */
export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Calculate token expiration time (24 hours from now)
 *
 * @returns Date object representing expiration time
 */
export function calculateTokenExpiration(): Date {
  const expiration = new Date()
  expiration.setHours(expiration.getHours() + 24)
  return expiration
}

/**
 * Create new invite token in database
 *
 * @param params Token creation parameters
 * @returns Token string and expiration date
 */
export async function createInviteToken(params: {
  applicationId: string
  projectId: string
  ethosProfileId: number
  destinationUrl: string
}): Promise<{ token: string; expiresAt: Date }> {
  const token = generateInviteToken()
  const expiresAt = calculateTokenExpiration()

  await sql`
    INSERT INTO invite_tokens (
      application_id,
      project_id,
      ethos_profile_id,
      token,
      destination_url,
      expires_at
    ) VALUES (
      ${params.applicationId},
      ${params.projectId},
      ${params.ethosProfileId},
      ${token},
      ${params.destinationUrl},
      ${expiresAt.toISOString()}
    )
  `

  console.log('Created invite token:', {
    token: `${token.slice(0, 8)}...`,
    expiresAt: expiresAt.toISOString(),
    applicationId: params.applicationId
  })

  return { token, expiresAt }
}

/**
 * Get invite token data by token string
 *
 * @param token Token string to look up
 * @returns Token data or null if not found
 */
export async function getInviteToken(token: string) {
  const result = await sql`
    SELECT
      id,
      application_id,
      project_id,
      ethos_profile_id,
      token,
      destination_url,
      is_used,
      used_at,
      expires_at,
      created_at
    FROM invite_tokens
    WHERE token = ${token}
    LIMIT 1
  `

  return result.rows[0] || null
}

/**
 * Mark invite token as used
 * Records usage timestamp and IP address for audit trail
 *
 * @param token Token string to mark as used
 * @param ipAddress IP address from which token was redeemed
 */
export async function markTokenAsUsed(
  token: string,
  ipAddress: string
): Promise<void> {
  await sql`
    UPDATE invite_tokens
    SET
      is_used = true,
      used_at = NOW(),
      used_from_ip = ${ipAddress}
    WHERE token = ${token}
  `

  console.log('Marked token as used:', {
    token: `${token.slice(0, 8)}...`,
    ip: ipAddress
  })
}

/**
 * Check if user already has valid (unused, unexpired) token for application
 * Used to avoid creating duplicate tokens on re-access
 *
 * @param applicationId Application ID to check
 * @returns Existing valid token or null
 */
export async function findValidTokenForApplication(
  applicationId: string
): Promise<{ token: string; expiresAt: Date } | null> {
  const result = await sql`
    SELECT token, expires_at
    FROM invite_tokens
    WHERE
      application_id = ${applicationId}
      AND is_used = false
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (result.rows[0]) {
    return {
      token: result.rows[0].token,
      expiresAt: new Date(result.rows[0].expires_at)
    }
  }

  return null
}
