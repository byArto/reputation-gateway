"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Check, Lock } from "lucide-react"

interface TesterViewProps {
  projectName?: string
  requirements?: string[]
  slug: string
}

export default function TesterView({
  projectName = "Project Name",
  requirements = [
    "Ethos Score minimum 1400",
    "At least 1 vouch (older than 24h)",
    "Positive review balance",
    "Account age: 7+ days",
  ],
  slug
}: TesterViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loginSuccess = searchParams.get("login_success")
  const [isSubmitting, setIsSubmitting] = useState(loginSuccess === "true")
  const [error, setError] = useState<string | null>(null)

  // Handle OAuth callback and auto-submit application
  useEffect(() => {
    if (loginSuccess === "true" && isSubmitting) {
      // Submit application
      fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectSlug: slug,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Get user info to pass score
          fetch("/api/auth/me")
            .then((res) => res.json())
            .then((userData) => {
              const userScore = userData.user?.score || 1500

              if (data.status === "accepted") {
                // Redirect to success page with destination URL
                router.push(`/${slug}/result?status=accepted&url=${encodeURIComponent(data.destination_url)}&type=discord&score=${userScore}`)
              } else {
                // Redirect to rejection page with reason
                router.push(`/${slug}/result?status=rejected&reason=${encodeURIComponent(data.rejection_reason || "Requirements not met")}&reapply=${data.can_reapply_at || ""}&score=${userScore}`)
              }
            })
            .catch(() => {
              // Fallback without score if user info fetch fails
              if (data.status === "accepted") {
                router.push(`/${slug}/result?status=accepted&url=${encodeURIComponent(data.destination_url)}&type=discord`)
              } else {
                router.push(`/${slug}/result?status=rejected&reason=${encodeURIComponent(data.rejection_reason || "Requirements not met")}&reapply=${data.can_reapply_at || ""}`)
              }
            })
        })
        .catch((err) => {
          console.error("Error submitting application:", err)
          setError("Failed to submit application. Please try again.")
          setIsSubmitting(false)
        })
    }
  }, [loginSuccess, slug, router, isSubmitting])

  const handleCheckAccess = () => {
    // Redirect to OAuth login with project slug
    window.location.href = `/api/auth/ethos/login?project_slug=${slug}&redirect_to=/${slug}?login_success=true`
  }

  return (
    <main className="min-h-screen bg-[#EFE9DF] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[600px] flex flex-col items-center">
        {/* Project Name */}
        <h1 className="font-serif text-[56px] text-[#1A1A1A] text-center leading-tight">
          {projectName}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-[18px] text-[#5C5C5C] text-center mb-12">
          Closed Beta Access
        </p>

        {/* Info Box */}
        <div className="w-full bg-white border border-[#E5E0D8] rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#1E3A5F] flex-shrink-0" />
            <p className="font-sans text-[15px]">
              This project uses reputation-based access powered by Ethos Network
            </p>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="w-full bg-white border border-[#E5E0D8] rounded-xl p-6 mb-6">
          <h2 className="font-sans text-[20px] font-semibold text-[#1A1A1A] mb-4">
            Requirements
          </h2>
          <div className="flex flex-col gap-4">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#1E3A5F] flex-shrink-0" />
                <span className="font-sans text-[15px] text-[#4A4A4A]">
                  {requirement}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
            <p className="text-sm text-red-600 font-sans">{error}</p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleCheckAccess}
          disabled={isSubmitting}
          className="w-full bg-[#1E3A5F] text-white font-sans font-medium text-[18px] py-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Checking..." : "Check My Access"}
        </button>

        {/* Footer Note */}
        <div className="flex items-center gap-2 mt-6">
          <Lock className="w-4 h-4 text-[#888888]" />
          <p className="font-sans text-[14px] text-[#888888]">
            You&apos;ll be asked to log in with Ethos
          </p>
        </div>
      </div>
    </main>
  )
}