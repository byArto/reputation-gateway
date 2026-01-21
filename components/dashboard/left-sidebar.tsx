interface Application {
  id: string
  username: string
  score: number
  status: string
  created_at: string
}

interface LeftSidebarProps {
  applications: Application[]
}

export default function LeftSidebar({ applications }: LeftSidebarProps) {
  // Get top 3 accepted testers by score
  const topTesters = applications
    .filter(app => app.status === 'accepted')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  // Calculate average accepted score
  const acceptedApps = applications.filter(app => app.status === 'accepted')
  const avgAcceptedScore = acceptedApps.length > 0
    ? Math.round(acceptedApps.reduce((sum, app) => sum + app.score, 0) / acceptedApps.length)
    : 0

  // Get recent activity (last 5 events)
  const recentActivity = applications
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(app => {
      const timeAgo = getTimeAgo(new Date(app.created_at))
      let action = ''
      if (app.status === 'accepted') action = 'accepted'
      else if (app.status === 'rejected') action = 'rejected'
      else action = 'applied'

      return {
        time: timeAgo,
        text: `${app.username} ${action}${app.status === 'rejected' ? ' (low score)' : ''}`
      }
    })

  return (
    <div className="flex flex-col gap-6">
      {/* Top Testers */}
      <div className="bg-gradient-to-br from-white/5 to-white/2 border-[1.5px] border-[rgba(139,92,246,0.2)] rounded-[20px] p-6 backdrop-blur-[20px]">
        <div className="text-base font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          🏆 Top Testers
        </div>
        {topTesters.map((tester, index) => (
          <div
            key={tester.id}
            className="flex items-center justify-between p-3 bg-[rgba(139,92,246,0.05)] rounded-xl mb-2 transition-all hover:bg-[rgba(139,92,246,0.1)] hover:translate-x-1 last:mb-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#e0d5ff]">{tester.username}</div>
                <div className="text-xs text-[#94a3b8]">Score: {tester.score}</div>
              </div>
            </div>
          </div>
        ))}
        {topTesters.length === 0 && (
          <div className="text-sm text-[#64748b] text-center py-4">
            No accepted applications yet
          </div>
        )}
        <div className="mt-4 p-3 bg-[rgba(139,92,246,0.05)] rounded-xl">
          <div className="text-xs text-[#94a3b8] mb-1">💡 Average accepted:</div>
          <div className="text-base font-bold text-[#22c55e]">{avgAcceptedScore}</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-gradient-to-br from-white/5 to-white/2 border-[1.5px] border-[rgba(139,92,246,0.2)] rounded-[20px] p-6 backdrop-blur-[20px]">
        <div className="text-base font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          📅 Activity Timeline
        </div>
        {recentActivity.map((activity, index) => (
          <div
            key={index}
            className="flex gap-3 py-3 border-b border-[rgba(139,92,246,0.1)] last:border-b-0"
          >
            <div className="text-[11px] text-[#64748b] whitespace-nowrap">{activity.time}</div>
            <div className="text-[13px] text-[#cbd5e1] leading-relaxed">{activity.text}</div>
          </div>
        ))}
        {recentActivity.length === 0 && (
          <div className="text-sm text-[#64748b] text-center py-4">
            No activity yet
          </div>
        )}
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds} sec ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return date.toLocaleDateString()
}
