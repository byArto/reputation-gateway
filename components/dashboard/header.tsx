interface DashboardHeaderProps {
  projectName: string
  onSettingsClick: () => void
}

export default function DashboardHeader({ projectName, onSettingsClick }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-[fadeInUp_0.6s_ease-out]">
      <div className="flex items-center gap-3 sm:gap-4">
        <a
          href="/"
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-xl text-[#a78bfa] text-xs sm:text-sm font-semibold cursor-pointer transition-all hover:bg-[rgba(139,92,246,0.15)] hover:translate-x-[-4px]"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </a>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-[#a78bfa] to-[#06b6d4] bg-clip-text text-transparent leading-tight tracking-tight">
          Dashboard - {projectName}
        </h1>
      </div>
      <button
        onClick={onSettingsClick}
        className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-xl text-[#e0d5ff] text-xs sm:text-sm font-semibold cursor-pointer transition-all hover:bg-[rgba(139,92,246,0.2)] hover:border-[rgba(139,92,246,0.5)]"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </button>
    </div>
  )
}
