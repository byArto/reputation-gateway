"use client"

import { CheckCircle, Check } from "lucide-react"

interface EligibleAccessCardProps {
  score: number
  requiredScore: number
  vouches: number
  requiredVouches: number
  positiveReviews: number
  negativeReviews: number
  requiresPositiveReviews: boolean
  accountAge: number
  requiredAccountAge: number
  destinationUrl: string
  destinationType: "discord" | "beta"
}

export default function ResultEligible({
  score,
  requiredScore,
  vouches,
  requiredVouches,
  positiveReviews,
  negativeReviews,
  requiresPositiveReviews,
  accountAge,
  requiredAccountAge,
  destinationUrl,
  destinationType,
}: EligibleAccessCardProps) {
  const buttonText = destinationType === "discord" ? "Join Discord" : "Access Beta"
  const reviewBalance = positiveReviews - negativeReviews

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 w-full max-w-[500px] mx-auto">
      <div
        className="bg-white rounded-3xl p-14 px-10 text-center border shadow-sm"
        style={{
          borderColor: "#E5E0D8",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle
            size={72}
            strokeWidth={1.5}
            style={{ color: "#22C55E" }}
            className="mx-auto"
          />
        </div>

        {/* Heading */}
        <h1
          className="font-serif text-5xl mb-8"
          style={{ color: "#1A1A1A" }}
        >
          You&apos;re Eligible!
        </h1>

        {/* Reputation Badge */}
        <div
          className="mx-auto w-[110px] h-[110px] rounded-full bg-white flex flex-col items-center justify-center mb-8"
          style={{ border: "3px solid #1E3A5F" }}
        >
          <span
            className="font-serif text-4xl"
            style={{ color: "#1A1A1A" }}
          >
            {score}
          </span>
          <span
            className="font-sans text-xs"
            style={{ color: "#888888" }}
          >
            Ethos Score
          </span>
        </div>

        {/* Description */}
        <p
          className="font-sans text-base leading-relaxed max-w-[380px] mx-auto mb-6"
          style={{ color: "#5C5C5C" }}
        >
          You meet all project requirements. Click below to access the beta.
        </p>

        {/* Requirements Details */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 text-left">
          <h3 className="font-sans text-sm font-semibold text-green-900 mb-3">
            Your Profile Details
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-green-900">
                <span className="font-medium">Score:</span> {score} / {requiredScore} required
              </span>
            </div>

            {requiredVouches > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-green-900">
                  <span className="font-medium">Vouches:</span> {vouches} / {requiredVouches} required
                </span>
              </div>
            )}

            {requiresPositiveReviews && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-green-900">
                  <span className="font-medium">Reviews:</span> {positiveReviews} positive, {negativeReviews} negative (balance: +{reviewBalance})
                </span>
              </div>
            )}

            {requiredAccountAge > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-green-900">
                  <span className="font-medium">Account Age:</span> {accountAge} days / {requiredAccountAge} required
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Button */}
        <a
          href={destinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-[18px] rounded-xl font-sans text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mb-4"
          style={{ backgroundColor: "#1E3A5F" }}
        >
          {buttonText}
        </a>

        {/* Secondary Link */}
        <a
          href="https://ethos.network"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm hover:underline transition-all"
          style={{ color: "#1E3A5F" }}
        >
          View on Ethos Network →
        </a>
      </div>
    </div>
  )
}
