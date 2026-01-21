"use client"

interface NotEligibleViewProps {
  projectName: string
  username: string
  userStats: {
    score: number
    vouches: number
    reviewBalance: number
    accountAge: number
  }
  requirements: {
    minScore: number
    minVouches: number
    positiveReviews: boolean
    minAccountAge: number
  }
  ethosProfileUrl: string
  onChangeWallet?: () => void
}

export default function NotEligibleView({
  projectName,
  username,
  userStats,
  requirements,
  ethosProfileUrl,
  onChangeWallet
}: NotEligibleViewProps) {
  // Calculate pass/fail for each requirement
  const checks = [
    {
      title: 'Ethos Score',
      current: userStats.score,
      required: requirements.minScore,
      passed: userStats.score >= requirements.minScore,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      progress: Math.min(100, (userStats.score / requirements.minScore) * 100)
    },
    {
      title: 'Vouches',
      current: userStats.vouches,
      required: requirements.minVouches,
      passed: userStats.vouches >= requirements.minVouches,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      progress: Math.min(100, (userStats.vouches / requirements.minVouches) * 100)
    },
    {
      title: 'Review Balance',
      current: userStats.reviewBalance > 0 ? 'Positive' : userStats.reviewBalance === 0 ? 'Neutral' : 'Negative',
      required: 'Positive',
      passed: requirements.positiveReviews ? userStats.reviewBalance > 0 : true,
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      progress: userStats.reviewBalance > 0 ? 100 : userStats.reviewBalance === 0 ? 50 : 0
    },
    {
      title: 'Account Age',
      current: `${userStats.accountAge} days`,
      required: `${requirements.minAccountAge} days`,
      passed: userStats.accountAge >= requirements.minAccountAge,
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      progress: Math.min(100, (userStats.accountAge / requirements.minAccountAge) * 100)
    }
  ]

  const passedCount = checks.filter(c => c.passed).length
  const failedChecks = checks.filter(c => !c.passed)
  const nearMiss = passedCount >= checks.length - 1 // Only 1 requirement failed

  return (
    <div className="max-w-[600px] w-full mx-auto animate-[fadeInUp_0.6s_ease-out]">
      {/* Error Icon */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-[rgba(239,68,68,0.2)] to-[rgba(220,38,38,0.2)] border-2 border-[rgba(239,68,68,0.4)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
          <svg className="w-14 h-14 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-5xl font-black bg-gradient-to-r from-white via-[#ef4444] to-[#f97316] bg-clip-text text-transparent mb-3">
          Not Eligible
        </h1>

        <p className="text-lg text-[#cbd5e1] font-semibold mb-2">
          Hey <span className="text-[#a78bfa]">{username}</span>, you're close!
        </p>

        <p className="text-[14px] text-[#94a3b8]">
          {nearMiss
            ? "You're just one requirement away from accessing the beta."
            : "Your reputation doesn't quite meet the requirements yet."}
        </p>
      </div>

      {/* Progress Summary */}
      {nearMiss && (
        <div className="flex items-center gap-3 p-4 px-5 bg-[rgba(251,146,60,0.1)] border border-[rgba(251,146,60,0.3)] rounded-2xl mb-6">
          <svg className="w-6 h-6 text-[#fb923c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span className="text-sm text-[#cbd5e1]">
            <strong>So close!</strong> You passed {passedCount} out of {checks.length} requirements.
          </span>
        </div>
      )}

      {/* Requirements Progress Card */}
      <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(239,68,68,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
        <div className="text-lg font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          📊 Requirements Check
        </div>

        {checks.map((check, index) => (
          <div key={index} className="mb-5 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  check.passed
                    ? 'bg-gradient-to-br from-[rgba(34,197,94,0.3)] to-[rgba(16,185,129,0.3)]'
                    : 'bg-gradient-to-br from-[rgba(239,68,68,0.3)] to-[rgba(220,38,38,0.3)]'
                }`}>
                  {check.passed ? (
                    <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#e0d5ff]">{check.title}</div>
                  <div className="text-[13px] text-[#94a3b8]">
                    Your {check.title.toLowerCase()}: <span className={check.passed ? 'text-[#22c55e]' : 'text-[#ef4444]'}>{check.current}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] text-[#94a3b8]">Required</div>
                <div className="text-[14px] font-semibold text-[#cbd5e1]">{check.required}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-[rgba(139,92,246,0.1)] rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                  check.passed
                    ? 'bg-gradient-to-r from-[#22c55e] to-[#10b981]'
                    : 'bg-gradient-to-r from-[#ef4444] to-[#f97316]'
                }`}
                style={{ width: `${check.progress}%` }}
              />
            </div>

            {/* Gap indicator for failed checks */}
            {!check.passed && check.progress >= 70 && (
              <div className="text-xs text-[#fb923c] mt-1">
                Almost there! Only {typeof check.required === 'number' ? check.required - Number(check.current) : '1 step'} away
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations Card */}
      <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(139,92,246,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
        <div className="text-lg font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          💡 How to Qualify
        </div>

        <div className="space-y-3">
          {failedChecks.map((check, index) => (
            <div key={index} className="flex items-start gap-3 p-3.5 px-4 bg-[rgba(139,92,246,0.05)] rounded-xl">
              <div className="w-6 h-6 bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 stroke-white" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={check.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-[#e0d5ff] mb-1">
                  {check.title === 'Ethos Score' && 'Increase Your Ethos Score'}
                  {check.title === 'Vouches' && 'Get More Vouches'}
                  {check.title === 'Review Balance' && 'Improve Your Review Balance'}
                  {check.title === 'Account Age' && 'Wait for Account Maturity'}
                </div>
                <div className="text-[13px] text-[#94a3b8]">
                  {check.title === 'Ethos Score' && 'Participate in the Ethos network to earn a higher score.'}
                  {check.title === 'Vouches' && 'Ask trusted community members to vouch for you.'}
                  {check.title === 'Review Balance' && 'Contribute positively to earn better reviews.'}
                  {check.title === 'Account Age' && `Your account needs to be at least ${requirements.minAccountAge} days old.`}
                </div>
              </div>
            </div>
          ))}

          {/* General recommendation */}
          <div className="flex items-start gap-3 p-3.5 px-4 bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)] rounded-xl">
            <div className="text-2xl flex-shrink-0">🚀</div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-[#e0d5ff] mb-1">
                Build Your Reputation
              </div>
              <div className="text-[13px] text-[#94a3b8]">
                Visit your Ethos profile to see detailed recommendations for improving your reputation score.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <a
          href={ethosProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-8 py-[18px] bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] border-none rounded-2xl text-white text-center text-[17px] font-bold cursor-pointer transition-all shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(139,92,246,0.6)]"
        >
          View My Ethos Profile →
        </a>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-8 py-[16px] bg-[rgba(139,92,246,0.1)] border-2 border-[rgba(139,92,246,0.3)] rounded-2xl text-[#a78bfa] text-[16px] font-bold cursor-pointer transition-all hover:bg-[rgba(139,92,246,0.2)] hover:translate-y-[-2px]"
        >
          Check Again
        </button>

        {onChangeWallet && (
          <button
            onClick={onChangeWallet}
            className="w-full px-8 py-[16px] bg-[rgba(139,92,246,0.05)] border-2 border-[rgba(139,92,246,0.2)] rounded-2xl text-[#94a3b8] text-[16px] font-bold cursor-pointer transition-all hover:border-[rgba(139,92,246,0.4)] hover:text-[#a78bfa] hover:translate-y-[-2px]"
          >
            Try Different Wallet
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[13px] text-[#64748b] space-y-2">
        <div className="flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Your reputation will be re-checked when you return
        </div>
        <div>
          Reputation verification powered by{' '}
          <a href="https://ethos.network" target="_blank" rel="noopener noreferrer" className="text-[#06b6d4] font-semibold hover:text-[#22d3ee] transition-colors">
            Ethos Network
          </a>
        </div>
      </div>
    </div>
  )
}
