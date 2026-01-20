"use client"

import { useState } from "react"
import { CheckCircle, Check, Loader2 } from "lucide-react"

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
  inviteToken: string
  tokenExpiresAt: string
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
  inviteToken,
  tokenExpiresAt,
  destinationUrl,
  destinationType,
}: EligibleAccessCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-detect destination type from URL
  const isDiscord = destinationUrl.includes('discord.gg') || destinationUrl.includes('discord.com')
  const buttonText = isDiscord ? "Join Discord" : "Access Website"
  const reviewBalance = positiveReviews - negativeReviews

  const handleAccessClick = async () => {
    // If no token, use old direct link (backward compatibility)
    if (!inviteToken) {
      window.open(destinationUrl, '_blank')
      return
    }

    setIsRedeeming(true)
    setError(null)

    try {
      const response = await fetch(`/api/invites/${inviteToken}`, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success && data.redirect_url) {
        // Redirect to destination
        window.location.href = data.redirect_url
      } else {
        // Show error
        setError(data.message || 'Failed to access invite')
        setIsRedeeming(false)
      }
    } catch (err) {
      console.error('Error redeeming invite:', err)
      setError('Network error. Please try again.')
      setIsRedeeming(false)
    }
  }

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
          You meet all project requirements. Click below to {isDiscord ? "join the Discord server" : "access the website"}.
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

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
            <p className="text-sm text-red-600 font-sans">{error}</p>
          </div>
        )}

        {/* Primary Button */}
        <button
          onClick={handleAccessClick}
          disabled={isRedeeming}
          className="w-full py-[18px] rounded-xl font-sans text-base font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#1E3A5F" }}
        >
          {isRedeeming ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Preparing your invite...
            </span>
          ) : (
            buttonText
          )}
        </button>

        {/* Expiration Notice */}
        {inviteToken && tokenExpiresAt && (
          <p className="text-xs text-gray-500 mb-4">
            This invite expires: {new Date(tokenExpiresAt).toLocaleString()}
          </p>
        )}

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
