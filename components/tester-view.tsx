"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Check, Lock } from "lucide-react"
import { usePrivy, useCrossAppAccounts } from '@privy-io/react-auth'

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
  const { ready, authenticated, user, login } = usePrivy()
  const { linkCrossAppAccount } = useCrossAppAccounts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Автоматически подать заявку после аутентификации
  useEffect(() => {
    if (!ready || !authenticated || !user || isSubmitting) return

    const crossAppAccount = user.linkedAccounts?.find(
      (account) => account.type === 'cross_app'
    )

    if (!crossAppAccount || !crossAppAccount.embeddedWallets?.[0]?.address) {
      return
    }

    const walletAddress = crossAppAccount.embeddedWallets[0].address

    setIsSubmitting(true)

    fetch("/api/auth/privy/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, projectSlug: slug }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "accepted") {
          router.push(
            `/${slug}/result?status=accepted&url=${encodeURIComponent(
              data.destination_url
            )}&type=discord&score=${data.user_score}`
          )
        } else {
          router.push(
            `/${slug}/result?status=rejected&reason=${encodeURIComponent(
              data.rejection_reason || "Requirements not met"
            )}&reapply=${data.can_reapply_at || ""}&score=${data.user_score}`
          )
        }
      })
      .catch((err) => {
        console.error("Error:", err)
        setError("Failed to submit. Please try again.")
        setIsSubmitting(false)
      })
  }, [ready, authenticated, user, slug, router, isSubmitting])

  const handleCheckAccess = async () => {
    try {
      setError(null)

      if (!authenticated) {
        await login()
        return
      }

      const crossAppAccount = user?.linkedAccounts?.find(
        (account) => account.type === 'cross_app'
      )

      if (!crossAppAccount) {
        const ethosProviderAppId = process.env.NEXT_PUBLIC_ETHOS_PROVIDER_APP_ID
        if (!ethosProviderAppId) {
          setError("Ethos integration not configured")
          return
        }

        await linkCrossAppAccount({ appId: ethosProviderAppId })
      }
    } catch (error) {
      console.error("Auth error:", error)
      setError("Authentication failed. Please try again.")
    }
  }

  return (
    <main className="min-h-screen bg-[#EFE9DF] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[600px] flex flex-col items-center">
        <h1 className="font-serif text-[56px] text-[#1A1A1A] text-center leading-tight">
          {projectName}
        </h1>

        <p className="font-sans text-[18px] text-[#5C5C5C] text-center mb-12">
          Closed Beta Access
        </p>

        <div className="w-full bg-white border border-[#E5E0D8] rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#1E3A5F] flex-shrink-0" />
            <p className="font-sans text-[15px]">
              This project uses reputation-based access powered by Ethos Network
            </p>
          </div>
        </div>

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

        {error && (
          <div className="w-full rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
            <p className="text-sm text-red-600 font-sans">{error}</p>
          </div>
        )}

        <button
          onClick={handleCheckAccess}
          disabled={!ready || isSubmitting}
          className="w-full bg-[#1E3A5F] text-white font-sans font-medium text-[18px] py-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Checking..." : "Check My Access"}
        </button>

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
