"use client"

import { useState, useEffect } from "react"
import { XCircle, AlertCircle, Clock } from "lucide-react"

interface NotEligibleScreenProps {
  reason: string
  currentScore: number
  requiredScore: number
  canReapplyAt: number
}

export default function ResultNotEligible({
  currentScore,
  requiredScore,
  canReapplyAt,
}: NotEligibleScreenProps) {
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

        {/* Reason Box */}
        <div className="bg-[#F9F9F9] border border-[#E5E0D8] rounded-xl p-5 my-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-[#4A4A4A] text-left">
              Your Ethos Score ({currentScore}) is below the minimum requirement ({requiredScore})
            </p>
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
