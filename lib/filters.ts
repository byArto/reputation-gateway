/**
 * Filters and eligibility checking logic
 */

export interface UserProfile {
  profileId: number
  username: string
  score: number
  vouches: number
  positiveReviews: number
  negativeReviews: number
  accountAge: number // in days
  hasSlashProtection?: boolean // If false, user has been slashed
}

export interface ProjectCriteria {
  minScore: number
  minVouches: number
  positiveReviews: boolean
  minAccountAge: number // in days
}

export interface EligibilityResult {
  eligible: boolean
  status: "accepted" | "rejected" | "pending"
  reason?: string
  failedCriteria?: string[]
}

/**
 * Check if user is eligible for project access
 *
 * Checks criteria in order:
 * 1. Slash protection (hard reject if slashed)
 * 2. Score >= minimum
 * 3. Vouches >= minimum (older than 24h)
 * 4. Review balance (positive > negative)
 * 5. Account age >= minimum
 *
 * @param userProfile - User's Ethos profile data
 * @param projectCriteria - Project's filter criteria
 * @param manualReview - Whether manual review is enabled
 * @returns Eligibility result with status and optional reason
 */
export function checkEligibility(
  userProfile: UserProfile,
  projectCriteria: ProjectCriteria,
  manualReview: boolean = false
): EligibilityResult {
  const failedCriteria: string[] = []

  // 1. HARD REJECT: Slash protection check
  // If user has been slashed on Ethos, they are permanently ineligible
  if (userProfile.hasSlashProtection === false) {
    return {
      eligible: false,
      status: "rejected",
      reason: "Account has been slashed on Ethos Network. This is a permanent disqualification.",
      failedCriteria: ["Slash protection failed"],
    }
  }

  // 2. Check minimum score
  if (userProfile.score < projectCriteria.minScore) {
    failedCriteria.push(
      `Score ${userProfile.score} is below minimum ${projectCriteria.minScore}`
    )
  }

  // 3. Check minimum vouches (assuming all vouches are older than 24h)
  // In real implementation, you would check vouch timestamps
  if (userProfile.vouches < projectCriteria.minVouches) {
    failedCriteria.push(
      `Vouches ${userProfile.vouches} is below minimum ${projectCriteria.minVouches}`
    )
  }

  // 4. Check positive review balance
  if (projectCriteria.positiveReviews) {
    const reviewBalance = userProfile.positiveReviews - userProfile.negativeReviews
    if (reviewBalance <= 0) {
      failedCriteria.push(
        `Review balance ${reviewBalance} is not positive (${userProfile.positiveReviews} positive, ${userProfile.negativeReviews} negative)`
      )
    }
  }

  // 5. Check minimum account age
  if (userProfile.accountAge < projectCriteria.minAccountAge) {
    failedCriteria.push(
      `Account age ${userProfile.accountAge} days is below minimum ${projectCriteria.minAccountAge} days`
    )
  }

  // If any hard criteria failed, reject immediately
  if (failedCriteria.length > 0) {
    return {
      eligible: false,
      status: "rejected",
      reason: failedCriteria.join("; "),
      failedCriteria,
    }
  }

  // All criteria passed
  // If manual review is enabled, mark as pending
  if (manualReview) {
    return {
      eligible: true,
      status: "pending",
      reason: "Application meets all criteria and is pending manual review",
    }
  }

  // Auto-accept if all criteria passed and no manual review
  return {
    eligible: true,
    status: "accepted",
    reason: "All criteria met - access granted",
  }
}

/**
 * Get human-readable criterion name
 */
export function getCriterionName(criterion: string): string {
  const names: Record<string, string> = {
    score: "Ethos Score",
    vouches: "Vouches",
    positiveReviews: "Review Balance",
    accountAge: "Account Age",
    slash: "Slash Protection",
  }

  for (const [key, name] of Object.entries(names)) {
    if (criterion.toLowerCase().includes(key.toLowerCase())) {
      return name
    }
  }

  return criterion
}

/**
 * Format criteria for display
 */
export function formatCriteria(criteria: ProjectCriteria): string[] {
  const formatted: string[] = []

  if (criteria.minScore > 0) {
    formatted.push(`Ethos Score minimum ${criteria.minScore}`)
  }

  if (criteria.minVouches > 0) {
    formatted.push(
      `At least ${criteria.minVouches} vouch${criteria.minVouches === 1 ? "" : "es"} (older than 24h)`
    )
  }

  if (criteria.positiveReviews) {
    formatted.push("Positive review balance")
  }

  if (criteria.minAccountAge > 0) {
    formatted.push(`Account age: ${criteria.minAccountAge}+ days`)
  }

  return formatted
}

/**
 * Calculate percentage of users that pass criteria
 * (Rough estimate based on score distribution)
 */
export function estimatePassRate(criteria: ProjectCriteria): number {
  // Very rough estimates based on typical Ethos distributions
  let passRate = 100

  // Score-based reduction
  if (criteria.minScore >= 1600) {
    passRate *= 0.1 // ~10% have 1600+
  } else if (criteria.minScore >= 1400) {
    passRate *= 0.35 // ~35% have 1400+
  } else if (criteria.minScore >= 1200) {
    passRate *= 0.7 // ~70% have 1200+
  }

  // Vouches reduction
  if (criteria.minVouches >= 2) {
    passRate *= 0.4
  } else if (criteria.minVouches >= 1) {
    passRate *= 0.6
  }

  // Review balance reduction
  if (criteria.positiveReviews) {
    passRate *= 0.8
  }

  // Account age reduction
  if (criteria.minAccountAge >= 90) {
    passRate *= 0.5
  } else if (criteria.minAccountAge >= 30) {
    passRate *= 0.7
  } else if (criteria.minAccountAge >= 7) {
    passRate *= 0.9
  }

  return Math.round(passRate)
}

/**
 * Get filter preset by name
 */
export type FilterPreset = "basic" | "standard" | "strict"

export function getFilterPreset(preset: FilterPreset): ProjectCriteria {
  switch (preset) {
    case "basic":
      return {
        minScore: 1200,
        minVouches: 0,
        positiveReviews: false,
        minAccountAge: 0,
      }
    case "standard":
      return {
        minScore: 1400,
        minVouches: 1,
        positiveReviews: true,
        minAccountAge: 7,
      }
    case "strict":
      return {
        minScore: 1600,
        minVouches: 2,
        positiveReviews: true,
        minAccountAge: 30,
      }
    default:
      return getFilterPreset("standard")
  }
}

/**
 * Validate criteria values
 */
export function validateCriteria(criteria: ProjectCriteria): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (criteria.minScore < 0 || criteria.minScore > 3000) {
    errors.push("Minimum score must be between 0 and 3000")
  }

  if (criteria.minVouches < 0 || criteria.minVouches > 100) {
    errors.push("Minimum vouches must be between 0 and 100")
  }

  if (criteria.minAccountAge < 0 || criteria.minAccountAge > 1000) {
    errors.push("Minimum account age must be between 0 and 1000 days")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
