"use client"

import { useState, useEffect } from "react"
import { XCircle, Clock, X, Check } from "lucide-react"

interface NotEligibleScreenProps {
  reason: string
  currentScore: number
  requiredScore: number
  vouches: number
  requiredVouches: number
  positiveReviews: number
  negativeReviews: number
  requiresPositiveReviews: boolean
  accountAge: number
  requiredAccountAge: number
  canReapplyAt: number
}

export default function ResultNotEligible({
  currentScore,
  requiredScore,
  vouches,
  requiredVouches,
  positiveReviews,
  negativeReviews,
  requiresPositiveReviews,
  accountAge,
  requiredAccountAge,
  canReapplyAt,
}: NotEligibleScreenProps) {
  const reviewBalance = positiveReviews - negativeReviews
  const hasReviews = positiveReviews + negativeReviews > 0
  const improvementTips = [
    "Complete more transactions on Ethos",
    "Get vouches from trusted users",
    "Build positive review history",
    "Connect more social accounts",
  ]

  const [timeUntilReapply, setTimeUntilReapply] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now()
      const diff = canReapplyAt - now
      if (diff <= 0) {
        setTimeUntilReapply("You can reapply now")
      } else {
        const hours = Math.ceil(diff / (1000 * 60 * 60))
        setTimeUntilReapply(`You can reapply in ${hours} hour${hours !== 1 ? "s" : ""}`)
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [canReapplyAt])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#EFE9DF]">
      <div
        className="w-full max-w-[500px] bg-white border border-[#E5E0D8] rounded-3xl p-10 md:p-14 shadow-sm animate-in fade-in duration-500"
      >
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <XCircle className="w-[72px] h-[72px] text-[#EF4444]" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-5xl text-[#1A1A1A] text-center text-balance">
          Not Eligible
        </h1>

        {/* Requirements Details */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 my-8">
          <h3 className="font-sans text-sm font-semibold text-red-900 mb-3 text-left">
            Requirements Not Met
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {currentScore >= requiredScore ? (
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span className={currentScore >= requiredScore ? "text-green-900" : "text-red-900"}>
                <span className="font-medium">Score:</span> {currentScore} / {requiredScore} required
              </span>
            </div>

            {requiredVouches > 0 && (
              <div className="flex items-center gap-2 text-sm">
                {vouches >= requiredVouches ? (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span className={vouches >= requiredVouches ? "text-green-900" : "text-red-900"}>
                  <span className="font-medium">Vouches:</span> {vouches} / {requiredVouches} required
                </span>
              </div>
            )}

            {requiresPositiveReviews && (
              <div className="flex items-center gap-2 text-sm">
                {(!hasReviews || reviewBalance > 0) ? (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span className={(!hasReviews || reviewBalance > 0) ? "text-green-900" : "text-red-900"}>
                  <span className="font-medium">Reviews:</span> {positiveReviews} positive, {negativeReviews} negative (balance: {reviewBalance >= 0 ? '+' : ''}{reviewBalance})
                </span>
              </div>
            )}

            {requiredAccountAge > 0 && (
              <div className="flex items-center gap-2 text-sm">
                {accountAge >= requiredAccountAge ? (
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span className={accountAge >= requiredAccountAge ? "text-green-900" : "text-red-900"}>
                  <span className="font-medium">Account Age:</span> {accountAge} days / {requiredAccountAge} required
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Improvement Section */}
        <div className="mb-10">
          <h2 className="font-sans text-base font-semibold text-[#1A1A1A] text-left mb-4">
            How to improve your reputation:
          </h2>
          <ul className="flex flex-col gap-3">
            {improvementTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#1E3A5F] text-base leading-5">•</span>
                <span className="font-sans text-sm text-[#5C5C5C] text-left">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Learn More Button */}
        <a
          href="https://ethos.network"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full border-2 border-[#1E3A5F] text-[#1E3A5F] bg-transparent py-[18px] rounded-xl font-sans text-base font-medium transition-colors hover:bg-[rgba(30,58,95,0.05)] mb-6 text-center"
        >
          Learn About Ethos Network
        </a>

        {/* Reapply Note */}
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-[#888888]" />
          <span className="font-sans text-[13px] text-[#888888]">
            {timeUntilReapply}
          </span>
        </div>
      </div>
    </div>
  )
}
