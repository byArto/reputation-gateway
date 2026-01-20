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
    required?: string
  }>
}

export default async function ResultPage({ params, searchParams }: ResultPageProps) {
  await params
  const { status, url, type, reason, reapply, score, required } = await searchParams

  // Validate score parameter
  const parsedScore = score ? parseInt(score) : null
  const currentScore = parsedScore && !isNaN(parsedScore) ? parsedScore : 0

  // Validate required score parameter
  const parsedRequired = required ? parseInt(required) : null
  const requiredScore = parsedRequired && !isNaN(parsedRequired) ? parsedRequired : 1400

  if (status === "accepted" && url) {
    return (
      <ResultEligible
        score={currentScore || 1500}
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
      canReapplyAt={defaultReapplyTime}
    />
  )
}
