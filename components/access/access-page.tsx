"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from '@privy-io/react-auth'
import ConnectWalletView from "./connect-wallet-view"
import EligibleView from "./eligible-view"
import NotEligibleView from "./not-eligible-view"

type AccessState = "connect" | "checking" | "eligible" | "not_eligible"

interface AccessPageProps {
  projectName: string
  projectDescription?: string
  slug: string
  requirements: {
    minScore: number
    minVouches: number
    positiveReviews: boolean
    minAccountAge: number
  }
  benefits?: string
  destinationUrl: string
}

export default function AccessPage({
  projectName,
  projectDescription,
  slug,
  requirements,
  benefits,
  destinationUrl
}: AccessPageProps) {
  const router = useRouter()
  const { ready, authenticated, user, login, logout } = usePrivy()
  const [accessState, setAccessState] = useState<AccessState>("connect")
  const [userStats, setUserStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Format requirements for display
  const requirementsList = [
    {
      title: 'Ethos Score',
      subtitle: `Minimum ${requirements.minScore} required`,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      title: 'Vouches',
      subtitle: `At least ${requirements.minVouches} vouch${requirements.minVouches !== 1 ? 'es' : ''} needed`,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    {
      title: 'Review Balance',
      subtitle: requirements.positiveReviews ? 'Positive reviews required' : 'No negative balance',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
    },
    {
      title: 'Account Age',
      subtitle: `Minimum ${requirements.minAccountAge} days old`,
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    }
  ]

  const handleConnect = async () => {
    try {
      setError(null)
      setAccessState("checking")

      if (!authenticated) {
        await login()
        return
      }

      // If already authenticated, proceed to check eligibility
      await checkEligibility()
    } catch (error) {
      console.error("Auth error:", error)
      setError("Authentication failed. Please try again.")
      setAccessState("connect")
    }
  }

  const checkEligibility = async () => {
    try {
      // Get wallet address
      const externalWallet = user?.linkedAccounts?.find(
        (account) => account.type === 'wallet'
      )

      const crossAppAccount = user?.linkedAccounts?.find(
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
        setAccessState("connect")
        return
      }

      // Сохранить адрес кошелька для отображения
      setWalletAddress(walletAddress)

      // Check eligibility via API
      const response = await fetch("/api/auth/privy/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, projectSlug: slug }),
      })

      const data = await response.json()

      // Handle Ethos registration error
      if (data.error && data.message && data.registration_url) {
        setError(`${data.message}. Please register at Ethos Network first.`)
        setAccessState("connect")
        return
      }

      // Store user stats
      setUserStats({
        username: data.username || 'User',
        score: data.user_score || 0,
        vouches: data.user_vouches || 0,
        reviewBalance: (data.user_positive_reviews || 0) - (data.user_negative_reviews || 0),
        accountAge: data.user_account_age || 0,
        ethosProfileUrl: `https://ethos.network/profile/${walletAddress}`
      })

      if (data.status === "accepted") {
        setAccessState("eligible")
      } else {
        setAccessState("not_eligible")
      }
    } catch (err) {
      console.error("Error checking eligibility:", err)
      setError("Failed to check eligibility. Please try again.")
      setAccessState("connect")
    }
  }

  // Auto-check eligibility after authentication
  useEffect(() => {
    if (ready && authenticated && accessState === "checking") {
      checkEligibility()
    }
  }, [ready, authenticated, accessState])

  const handleChangeWallet = async () => {
    try {
      await logout()
      setAccessState("connect")
      setWalletAddress(null)
      setUserStats(null)
      setError(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleAccessClick = () => {
    // Redirect to destination URL
    window.location.href = destinationUrl
  }

  // Dark gradient background
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1443 25%, #2d1b69 50%, #1e3a5f 75%, #0f2744 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  }

  return (
    <main style={backgroundStyle}>
      {/* Render appropriate view based on state */}
      {accessState === "connect" && (
        <ConnectWalletView
          projectName={projectName}
          projectDescription={projectDescription}
          requirements={requirementsList}
          benefits={benefits}
          onConnect={handleConnect}
          walletAddress={walletAddress}
          authenticated={authenticated}
          onChangeWallet={handleChangeWallet}
        />
      )}

      {accessState === "checking" && (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking your reputation...</p>
        </div>
      )}

      {accessState === "eligible" && userStats && (
        <EligibleView
          projectName={projectName}
          username={userStats.username}
          score={userStats.score}
          vouches={userStats.vouches}
          reviewBalance={userStats.reviewBalance}
          accountAge={userStats.accountAge}
          benefits={benefits}
          destinationUrl={destinationUrl}
          onAccessClick={handleAccessClick}
        />
      )}

      {accessState === "not_eligible" && userStats && (
        <NotEligibleView
          projectName={projectName}
          username={userStats.username}
          userStats={{
            score: userStats.score,
            vouches: userStats.vouches,
            reviewBalance: userStats.reviewBalance,
            accountAge: userStats.accountAge
          }}
          requirements={requirements}
          ethosProfileUrl={userStats.ethosProfileUrl}
          onChangeWallet={handleChangeWallet}
        />
      )}

      {/* Error Display */}
      {error && accessState === "connect" && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </main>
  )
}
