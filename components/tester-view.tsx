"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Check, Lock } from "lucide-react"
import { usePrivy } from '@privy-io/react-auth'

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
  const { ready, authenticated, user, login, logout } = usePrivy()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualSubmit, setManualSubmit] = useState(false) // Новый флаг

  // Сбросить состояние при смене проекта (slug)
  useEffect(() => {
    setIsSubmitting(false)
    setError(null)
    setManualSubmit(false)
  }, [slug])

  // Подать заявку ТОЛЬКО после ручного нажатия кнопки
  useEffect(() => {
    if (!ready || !authenticated || !user || isSubmitting || !manualSubmit) return

    // Получить адрес кошелька
    const externalWallet = user.linkedAccounts?.find(
      (account) => account.type === 'wallet'
    )

    const crossAppAccount = user.linkedAccounts?.find(
      (account) => account.type === 'cross_app'
    )

    let walletAddress: string | undefined

    if (externalWallet && 'address' in externalWallet) {
      walletAddress = externalWallet.address
    } else if (crossAppAccount && 'embeddedWallets' in crossAppAccount && crossAppAccount.embeddedWallets?.[0]?.address) {
      walletAddress = crossAppAccount.embeddedWallets[0].address
    }

    if (!walletAddress) {
      setError("No wallet found. Please reconnect.")
      setManualSubmit(false)
      return
    }

    console.log('DEBUG Frontend: Wallet address:', walletAddress)
    console.log('DEBUG Frontend: All linked accounts:', JSON.stringify(user.linkedAccounts, null, 2))

    setIsSubmitting(true)

    fetch("/api/auth/privy/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, projectSlug: slug }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('DEBUG Frontend: API response:', data)
        
        if (data.status === "accepted") {
          router.push(
            `/${slug}/result?status=accepted&url=${encodeURIComponent(
              data.destination_url
            )}&type=discord&score=${data.user_score}&required=${data.required_score || 1400}`
          )
        } else {
          router.push(
            `/${slug}/result?status=rejected&reason=${encodeURIComponent(
              data.rejection_reason || data.error || "Requirements not met"
            )}&reapply=${data.can_reapply_at || ""}&score=${data.user_score || 0}&required=${data.required_score || 1400}`
          )
        }
      })
      .catch((err) => {
        console.error("Error:", err)
        setError("Failed to submit. Please try again.")
        setIsSubmitting(false)
        setManualSubmit(false)
      })
  }, [ready, authenticated, user, slug, router, isSubmitting, manualSubmit])

  const handleCheckAccess = async () => {
    try {
      setError(null)

      if (!authenticated) {
        await login()
        // После успешного логина, установить флаг для отправки
        setManualSubmit(true)
        return
      }

      // Если уже залогинен, просто отправить заявку
      setManualSubmit(true)

    } catch (error) {
      console.error("Auth error:", error)
      setError("Authentication failed. Please try again.")
    }
  }

  const handleLogout = async () => {
    await logout()
    setManualSubmit(false)
    setIsSubmitting(false)
    setError(null)
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

        {/* Показать статус если залогинен */}
        {authenticated && (
          <div className="w-full rounded-lg bg-blue-50 border border-blue-200 p-4 mb-6">
            <p className="text-sm text-blue-800 font-sans">
              Connected as: {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
            </p>
            <button 
              onClick={handleLogout}
              className="text-sm text-blue-600 underline mt-2"
            >
              Disconnect and try different wallet
            </button>
          </div>
        )}

        <button
          onClick={handleCheckAccess}
          disabled={!ready || isSubmitting}
          className="w-full bg-[#1E3A5F] text-white font-sans font-medium text-[18px] py-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Checking..." : authenticated ? "Check My Access" : "Connect Wallet"}
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