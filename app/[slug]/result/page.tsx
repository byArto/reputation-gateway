import ResultEligible from "@/components/result-eligible"
import ResultNotEligible from "@/components/result-not-eligible"

interface ResultPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    status: string
    url?: string
    type?: string
    reason?: string
    reapply?: string
    score?: string
    required_score?: string
    vouches?: string
    required_vouches?: string
    positive_reviews?: string
    negative_reviews?: string
    requires_positive_reviews?: string
    account_age?: string
    required_account_age?: string
  }>
}

export default async function ResultPage({ params, searchParams }: ResultPageProps) {
  await params
  const {
    status,
    url,
    type,
    reason,
    reapply,
    score,
    required_score,
    vouches,
    required_vouches,
    positive_reviews,
    negative_reviews,
    requires_positive_reviews,
    account_age,
    required_account_age
  } = await searchParams

  // Parse all numeric parameters
  const currentScore = score ? parseInt(score) : 0
  const requiredScore = required_score ? parseInt(required_score) : 1400
  const userVouches = vouches ? parseInt(vouches) : 0
  const requiredVouches = required_vouches ? parseInt(required_vouches) : 0
  const positiveReviewsCount = positive_reviews ? parseInt(positive_reviews) : 0
  const negativeReviewsCount = negative_reviews ? parseInt(negative_reviews) : 0
  const requiresPositiveReviewsFlag = requires_positive_reviews === 'true'
  const accountAgeInDays = account_age ? parseInt(account_age) : 0
  const requiredAccountAgeInDays = required_account_age ? parseInt(required_account_age) : 0

  if (status === "accepted" && url) {
    return (
      <ResultEligible
        score={currentScore}
        requiredScore={requiredScore}
        vouches={userVouches}
        requiredVouches={requiredVouches}
        positiveReviews={positiveReviewsCount}
        negativeReviews={negativeReviewsCount}
        requiresPositiveReviews={requiresPositiveReviewsFlag}
        accountAge={accountAgeInDays}
        requiredAccountAge={requiredAccountAgeInDays}
        destinationUrl={url}
        destinationType={(type as "discord" | "beta") || "discord"}
      />
    )
  }

  // Parse reapply date if provided
  const defaultReapplyTime = reapply
    ? new Date(reapply).getTime()
    : Date.now() + 60 * 1000 // Default 1 minute from now

  return (
    <ResultNotEligible
      reason={reason || "Requirements not met"}
      currentScore={currentScore}
      requiredScore={requiredScore}
      vouches={userVouches}
      requiredVouches={requiredVouches}
      positiveReviews={positiveReviewsCount}
      negativeReviews={negativeReviewsCount}
      requiresPositiveReviews={requiresPositiveReviewsFlag}
      accountAge={accountAgeInDays}
      requiredAccountAge={requiredAccountAgeInDays}
      canReapplyAt={defaultReapplyTime}
    />
  )
}
