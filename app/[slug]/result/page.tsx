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
  }>
}

export default async function ResultPage({ params, searchParams }: ResultPageProps) {
  await params
  const { status, url, type, reason, reapply, score } = await searchParams

  if (status === "accepted" && url) {
    return (
      <ResultEligible
        score={score ? parseInt(score) : 1500}
        destinationUrl={url}
        destinationType={(type as "discord" | "beta") || "discord"}
      />
    )
  }

  // Parse reapply date if provided - use default 30 days from now
  // For server component, compute once during render
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  const defaultReapplyTime = reapply
    ? new Date(reapply).getTime()
    : thirtyDaysFromNow.getTime()

  return (
    <ResultNotEligible
      reason={reason || "Requirements not met"}
      currentScore={score ? parseInt(score) : 1200}
      requiredScore={1400}
      canReapplyAt={defaultReapplyTime}
    />
  )
}
