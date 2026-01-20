import type { Project } from "./db"
import { checkEligibility, type UserProfile } from "./filters"

export interface EthosProfile {
  profileId: number
  username: string
  score: number
  vouches: number
  positiveReviews: number
  negativeReviews: number
  accountAge: number // in days
  hasSlashProtection?: boolean
}

export interface ValidationResult {
  passed: boolean
  status: "accepted" | "rejected" | "pending"
  rejectionReason?: string
  failedCriteria?: string[]
}

/**
 * Validates if an Ethos profile meets the project criteria
 * This is a wrapper around checkEligibility from filters.ts
 */
export function validateCriteria(
  profile: EthosProfile,
  criteria: Project["criteria"],
  manualReview: boolean
): ValidationResult {
  // Convert EthosProfile to UserProfile format
  const userProfile: UserProfile = {
    profileId: profile.profileId,
    username: profile.username,
    score: profile.score,
    vouches: profile.vouches,
    positiveReviews: profile.positiveReviews,
    negativeReviews: profile.negativeReviews,
    accountAge: profile.accountAge,
    hasSlashProtection: profile.hasSlashProtection ?? true, // Default to true if not provided
  }

  // Use checkEligibility from filters.ts
  const result = checkEligibility(userProfile, criteria, manualReview)

  // Convert to ValidationResult format
  return {
    passed: result.eligible,
    status: result.status,
    rejectionReason: result.reason,
    failedCriteria: result.failedCriteria,
  }
}

/**
 * Calculate when a user can reapply after rejection
 * Returns a date 1 minute from now (for testing)
 */
export function calculateReapplyDate(): Date {
  const reapplyDate = new Date()
  reapplyDate.setTime(reapplyDate.getTime() + 60 * 1000) // 1 minute
  return reapplyDate
}

/**
 * Check if a user can reapply based on their last rejection date
 */
export function canReapply(canReapplyAt: Date | null): boolean {
  if (!canReapplyAt) {
    return true
  }
  return new Date() >= new Date(canReapplyAt)
}
