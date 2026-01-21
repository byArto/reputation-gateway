interface StatsGridProps {
  stats: {
    total_applications: number
    last_24h: number
    accepted: number
    rejected: number
    accepted_percent: number
    rejected_percent: number
    avg_score: number
    avg_accepted_score: number
  }
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      label: "Total Applications",
      value: stats.total_applications,
      change: "+12% from last week",
      changeType: "positive" as const,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      )
    },
    {
      label: "Last 24 Hours",
      value: stats.last_24h,
      change: `+${stats.last_24h} from yesterday`,
      changeType: "positive" as const,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      )
    },
    {
      label: "Accepted Rate",
      value: `${stats.accepted_percent}%`,
      change: `${stats.accepted} accepted`,
      changeType: "positive" as const,
      iconColor: "#22c55e",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      )
    },
    {
      label: "Rejected Rate",
      value: `${stats.rejected_percent}%`,
      change: `${stats.rejected} rejected`,
      changeType: "negative" as const,
      iconColor: "#ef4444",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      )
    },
    {
      label: "Average Score",
      value: Math.round(stats.avg_score),
      change: `Accepted avg: ${Math.round(stats.avg_accepted_score)}`,
      changeType: "positive" as const,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      )
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-white/5 to-white/2 border-[1.5px] border-[rgba(139,92,246,0.2)] rounded-[20px] p-6 backdrop-blur-[20px] transition-all hover:translate-y-[-4px] hover:border-[rgba(139,92,246,0.4)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.3)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(6,182,212,0.2)] rounded-xl flex items-center justify-center">
              <svg width="20" height="20" fill="none" stroke={card.iconColor || "#a78bfa"} viewBox="0 0 24 24">
                {card.icon}
              </svg>
            </div>
            <div className="text-[13px] text-[#94a3b8] uppercase tracking-wide font-semibold">
              {card.label}
            </div>
          </div>
          <div className="text-4xl font-black bg-gradient-to-r from-white to-[#a78bfa] bg-clip-text text-transparent leading-none mb-2">
            {card.value}
          </div>
          <div className={`text-[13px] flex items-center gap-1 ${card.changeType === 'positive' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
            <span>{card.changeType === 'positive' ? '↑' : '↓'}</span>
            <span>{card.change}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
