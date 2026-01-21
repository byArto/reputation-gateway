"use client"

import { useEffect, useState } from "react"

interface EligibleViewProps {
  projectName: string
  username: string
  score: number
  vouches: number
  reviewBalance: number
  accountAge: number
  benefits?: string
  destinationUrl: string
  onAccessClick: () => void
}

export default function EligibleView({
  projectName,
  username,
  score,
  vouches,
  reviewBalance,
  accountAge,
  benefits,
  destinationUrl,
  onAccessClick
}: EligibleViewProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [copied, setCopied] = useState(false)

  // Parse benefits if it's a string (from textarea)
  const benefitsList = benefits
    ? benefits.split('\n').filter(b => b.trim()).map(text => {
        const emojiMatch = text.match(/^([\u{1F300}-\u{1F9FF}])\s*/u)
        return {
          emoji: emojiMatch ? emojiMatch[1] : '✨',
          text: emojiMatch ? text.slice(emojiMatch[0].length).trim() : text.trim()
        }
      })
    : []

  // Trigger confetti on mount
  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: 'twitter' | 'discord') => {
    const shareText = `I just got accepted to the ${projectName} beta! 🎉`
    const url = window.location.href

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'discord') {
      // Discord doesn't have a direct share URL, so we copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${url}`)
      alert('Link copied! Paste it in Discord.')
    }
  }

  // Calculate profile strength (simplified logic)
  const profileStrength = Math.min(100, Math.round(
    (score / 2000 * 40) +
    (Math.min(vouches, 10) / 10 * 20) +
    (reviewBalance > 0 ? 20 : 0) +
    (accountAge >= 30 ? 20 : accountAge / 30 * 20)
  ))

  return (
    <div className="max-w-[680px] w-full mx-auto animate-[fadeInUp_0.6s_ease-out] relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                backgroundColor: ['#8b5cf6', '#06b6d4', '#22d3ee', '#a78bfa'][Math.floor(Math.random() * 4)],
                animation: `confettiFall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-[rgba(34,197,94,0.2)] to-[rgba(16,185,129,0.2)] border-2 border-[rgba(34,197,94,0.4)] rounded-full flex items-center justify-center mx-auto mb-6 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_40px_rgba(34,197,94,0.3)]">
          <svg className="w-14 h-14 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-5xl font-black bg-gradient-to-r from-white via-[#22c55e] to-[#06b6d4] bg-clip-text text-transparent mb-3">
          You're In!
        </h1>

        <p className="text-lg text-[#cbd5e1] font-semibold mb-2">
          Welcome to {projectName}, <span className="text-[#22c55e]">{username}</span>
        </p>

        <p className="text-[14px] text-[#94a3b8]">
          Your reputation meets the requirements. You now have exclusive access to the beta.
        </p>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.5)]">
            <div className="w-28 h-28 rounded-full bg-[#0f172a] flex flex-col items-center justify-center">
              <div className="text-3xl font-black text-white">{score}</div>
              <div className="text-xs text-[#94a3b8]">Ethos Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Checklist */}
      <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(34,197,94,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
        <div className="text-lg font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          ✅ Your Profile
        </div>

        {[
          { label: 'Ethos Score', value: score, requirement: 'Verified' },
          { label: 'Vouches', value: vouches, requirement: 'Verified' },
          { label: 'Review Balance', value: reviewBalance > 0 ? 'Positive' : 'Neutral', requirement: 'Verified' },
          { label: 'Account Age', value: `${accountAge} days`, requirement: 'Verified' }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3.5 px-4 bg-[rgba(34,197,94,0.05)] rounded-xl mb-3 last:mb-0">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-[rgba(34,197,94,0.3)] to-[rgba(16,185,129,0.3)] rounded-md flex items-center justify-center">
                <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#e0d5ff]">{item.label}</div>
                <div className="text-[13px] text-[#94a3b8]">{item.value}</div>
              </div>
            </div>
            <div className="text-[13px] font-semibold text-[#22c55e]">{item.requirement}</div>
          </div>
        ))}
      </div>

      {/* What's Next Section */}
      <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(139,92,246,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
        <div className="text-lg font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          🚀 What's Next?
        </div>

        <div className="space-y-4">
          {[
            { step: '1', title: 'Click "Access Beta"', subtitle: 'Get instant access to the platform' },
            { step: '2', title: 'Explore Features', subtitle: 'Start testing and provide feedback' },
            { step: '3', title: 'Earn Rewards', subtitle: 'Active testers get exclusive perks' }
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-[rgba(139,92,246,0.05)] rounded-xl transition-all hover:bg-[rgba(139,92,246,0.1)] hover:translate-x-1">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                {item.step}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#e0d5ff] mb-1">{item.title}</div>
                <div className="text-[13px] text-[#94a3b8]">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Strength */}
      <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(139,92,246,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-[#e0d5ff]">Profile Strength</div>
          <div className="text-2xl font-black bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
            {profileStrength}%
          </div>
        </div>

        <div className="relative w-full h-3 bg-[rgba(139,92,246,0.1)] rounded-full overflow-hidden mb-4">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] rounded-full transition-all duration-1000"
            style={{ width: `${profileStrength}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)] rounded-xl">
            <div className="text-xs text-[#94a3b8] mb-1">Strong</div>
            <div className="text-sm font-semibold text-[#22c55e]">
              {score >= 1600 ? 'Score' : vouches >= 3 ? 'Vouches' : 'Account Age'}
            </div>
          </div>
          <div className="p-3 bg-[rgba(251,146,60,0.05)] border border-[rgba(251,146,60,0.2)] rounded-xl">
            <div className="text-xs text-[#94a3b8] mb-1">Could Improve</div>
            <div className="text-sm font-semibold text-[#fb923c]">
              {score < 1600 ? 'Score' : vouches < 3 ? 'Vouches' : reviewBalance <= 0 ? 'Reviews' : 'All Good'}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      {benefitsList.length > 0 && (
        <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(139,92,246,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
          <div className="text-lg font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
            🎁 Your Beta Perks
          </div>

          {benefitsList.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-3 px-4 bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.2)] rounded-xl mb-2.5 transition-all hover:bg-[rgba(139,92,246,0.1)] hover:translate-x-1 last:mb-0">
              <div className="text-2xl flex-shrink-0">{benefit.emoji}</div>
              <div className="text-sm text-[#cbd5e1] font-medium">{benefit.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Share Section */}
      <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(139,92,246,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
        <div className="text-lg font-bold text-[#e0d5ff] mb-4 text-center">Share Your Access</div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2 px-6 py-3 bg-[rgba(29,155,240,0.1)] border border-[rgba(29,155,240,0.3)] rounded-xl text-[#1d9bf0] font-semibold text-sm transition-all hover:bg-[rgba(29,155,240,0.2)] hover:translate-y-[-2px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </button>

          <button
            onClick={() => handleShare('discord')}
            className="flex items-center gap-2 px-6 py-3 bg-[rgba(88,101,242,0.1)] border border-[rgba(88,101,242,0.3)] rounded-xl text-[#5865f2] font-semibold text-sm transition-all hover:bg-[rgba(88,101,242,0.2)] hover:translate-y-[-2px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-6 py-3 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-xl text-[#a78bfa] font-semibold text-sm transition-all hover:bg-[rgba(139,92,246,0.2)] hover:translate-y-[-2px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Access Button */}
      <button
        onClick={onAccessClick}
        className="w-full px-8 py-[20px] bg-gradient-to-r from-[#22c55e] to-[#06b6d4] border-none rounded-2xl text-white text-[18px] font-bold cursor-pointer transition-all shadow-[0_8px_32px_rgba(34,197,94,0.4)] hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(34,197,94,0.6)] mb-4"
      >
        Access Beta Now →
      </button>

      {/* Footer */}
      <div className="text-center text-[13px] text-[#64748b] space-y-2">
        <div className="flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Your access expires in 7 days. Please log in to extend.
        </div>
        <div>
          Powered by{' '}
          <a href="https://ethos.network" target="_blank" rel="noopener noreferrer" className="text-[#06b6d4] font-semibold hover:text-[#22d3ee] transition-colors">
            Ethos Network
          </a>
        </div>
      </div>
    </div>
  )
}
