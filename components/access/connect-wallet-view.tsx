"use client"

interface ConnectWalletViewProps {
  projectName: string
  projectDescription?: string
  requirements: Array<{
    title: string
    subtitle: string
    icon: string
  }>
  benefits?: string
  onConnect: () => void
  walletAddress?: string | null
  authenticated?: boolean
  onChangeWallet?: () => void
}

export default function ConnectWalletView({
  projectName,
  projectDescription = "Join our exclusive beta program and get early access to cutting-edge features. Connect your wallet to verify your reputation and start testing.",
  requirements,
  benefits,
  onConnect,
  walletAddress,
  authenticated,
  onChangeWallet
}: ConnectWalletViewProps) {
  // Parse benefits if it's a string (from textarea)
  const benefitsList = benefits
    ? benefits.split('\n').filter(b => b.trim()).map(text => {
        // Try to extract emoji from start of line
        const emojiMatch = text.match(/^([\u{1F300}-\u{1F9FF}])\s*/u)
        return {
          emoji: emojiMatch ? emojiMatch[1] : '✨',
          text: emojiMatch ? text.slice(emojiMatch[0].length).trim() : text.trim()
        }
      })
    : []

  return (
    <div className="max-w-[600px] w-full mx-auto animate-[fadeInUp_0.6s_ease-out]">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(6,182,212,0.2)] border-2 border-[rgba(139,92,246,0.3)] rounded-[20px] flex items-center justify-center text-[36px] font-black mx-auto mb-6 animate-[float_3s_ease-in-out_infinite]">
          {projectName.charAt(0)}
        </div>

        <h1 className="text-5xl font-black bg-gradient-to-r from-white via-[#a78bfa] to-[#06b6d4] bg-clip-text text-transparent mb-3">
          {projectName}
        </h1>

        <p className="text-lg text-[#94a3b8] font-semibold mb-4">Closed Beta Access</p>

        <p className="text-[15px] text-[#cbd5e1] leading-relaxed max-w-[480px] mx-auto">
          {projectDescription}
        </p>
      </div>

      {/* Connected Wallet Info */}
      {authenticated && walletAddress && (
        <div className="flex items-center justify-between gap-3 p-4 px-5 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-2xl mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-[#a78bfa] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <div className="text-xs text-[#94a3b8] font-medium">Connected Wallet</div>
              <div className="text-sm text-[#e0d5ff] font-bold font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            </div>
          </div>
          {onChangeWallet && (
            <button
              onClick={onChangeWallet}
              className="px-4 py-2 bg-[rgba(139,92,246,0.2)] border border-[rgba(139,92,246,0.4)] rounded-xl text-[#a78bfa] text-sm font-semibold transition-all hover:bg-[rgba(139,92,246,0.3)] hover:translate-y-[-1px]"
            >
              Change Wallet
            </button>
          )}
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-center gap-3 p-4 px-5 bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.3)] rounded-2xl mb-6">
        <svg className="w-6 h-6 text-[#06b6d4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <span className="text-sm text-[#cbd5e1]">
          This project uses reputation-based access powered by <strong>Ethos Network</strong>
        </span>
      </div>

      {/* Process Timeline */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-6 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[rgba(139,92,246,0.5)] to-[rgba(6,182,212,0.5)]" />

        {['Connect Wallet', 'Verify Reputation', 'Get Access'].map((label, index) => (
          <div key={index} className="flex flex-col items-center gap-3 flex-1 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] rounded-full flex items-center justify-center text-xl font-bold shadow-[0_4px_20px_rgba(139,92,246,0.4)]">
              {index + 1}
            </div>
            <div className="text-[13px] font-semibold text-[#e0d5ff] text-center">{label}</div>
            <div className="text-[11px] text-[#64748b]">{['1 sec', 'instant', 'immediately'][index]}</div>
          </div>
        ))}
      </div>

      {/* Requirements Card */}
      <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(139,92,246,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
        <div className="text-lg font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          📋 Requirements
        </div>

        {requirements.map((req, index) => (
          <div key={index} className="flex items-start gap-3 p-3.5 px-4 bg-[rgba(139,92,246,0.05)] rounded-xl mb-3 transition-all hover:bg-[rgba(139,92,246,0.1)] hover:translate-x-1 last:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(6,182,212,0.2)] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 stroke-[#a78bfa]" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={req.icon} />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-[#e0d5ff] mb-1">{req.title}</div>
              <div className="text-[13px] text-[#94a3b8]">{req.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      {benefitsList.length > 0 && (
        <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(139,92,246,0.3)] rounded-3xl p-7 px-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-6">
          <div className="text-lg font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
            ✨ What You'll Get
          </div>

          {benefitsList.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-3 px-4 bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)] rounded-xl mb-2.5 transition-all hover:bg-[rgba(34,197,94,0.1)] hover:translate-x-1 last:mb-0">
              <div className="text-2xl flex-shrink-0">{benefit.emoji}</div>
              <div className="text-sm text-[#cbd5e1] font-medium">{benefit.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Button */}
      <button
        onClick={onConnect}
        className="w-full px-8 py-[18px] bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] border-none rounded-2xl text-white text-[17px] font-bold cursor-pointer transition-all shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:translate-y-[-2px] hover:shadow-[0_12px_40px_rgba(139,92,246,0.6)] mb-4"
      >
        {authenticated && walletAddress ? 'Check My Access' : 'Connect Wallet'}
      </button>

      <div className="text-center text-[13px] text-[#64748b] flex items-center justify-center gap-1.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        You'll be asked to log in with{' '}
        <a href="https://ethos.network" target="_blank" rel="noopener noreferrer" className="text-[#06b6d4] font-semibold hover:text-[#22d3ee] transition-colors">
          Ethos Network
        </a>
      </div>
    </div>
  )
}
