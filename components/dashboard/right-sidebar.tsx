interface Application {
  created_at: string
}

interface Project {
  name: string
  slug: string
  criteria: {
    minScore: number
  }
  created_at: string
}

interface RightSidebarProps {
  applications: Application[]
  project: Project
}

export default function RightSidebar({ applications, project }: RightSidebarProps) {
  // Calculate applications per day for the last 7 days
  const chartData = getWeeklyChartData(applications)

  // Determine filter type based on minScore
  const getFilterType = (minScore: number) => {
    if (minScore >= 1600) return 'Strict'
    if (minScore >= 1400) return 'Standard'
    return 'Basic'
  }

  const filterType = getFilterType(project.criteria.minScore)
  const createdDate = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Analytics Chart */}
      <div className="bg-gradient-to-br from-white/5 to-white/2 border-[1.5px] border-[rgba(139,92,246,0.2)] rounded-[20px] p-6 backdrop-blur-[20px]">
        <div className="text-base font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          📈 Applications Over Time
        </div>
        <div className="h-[200px] flex items-end gap-2 py-5">
          {chartData.map((bar, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-[rgba(139,92,246,0.6)] to-[rgba(6,182,212,0.4)] rounded-t-lg min-h-[20px] relative transition-all hover:opacity-80 hover:scale-y-105"
              style={{ height: `${bar.percentage}%` }}
            >
              <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[11px] text-[#64748b] whitespace-nowrap">
                {bar.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Settings */}
      <div className="bg-gradient-to-br from-white/5 to-white/2 border-[1.5px] border-[rgba(139,92,246,0.2)] rounded-[20px] p-6 backdrop-blur-[20px]">
        <div className="text-base font-bold text-[#e0d5ff] mb-5 flex items-center gap-2">
          ⚙️ Project Settings
        </div>
        <SettingsItem label="Project Name" value={project.name} />
        <SettingsItem label="URL Slug" value={project.slug} />
        <SettingsItem label="Filter Type" value={filterType} />
        <SettingsItem label="Min Score" value={`≥ ${project.criteria.minScore}`} />
        <SettingsItem label="Status" value="Active ✅" valueColor="#22c55e" />
        <SettingsItem label="Created" value={createdDate} isLast />
      </div>
    </div>
  )
}

function SettingsItem({
  label,
  value,
  valueColor,
  isLast = false
}: {
  label: string
  value: string
  valueColor?: string
  isLast?: boolean
}) {
  return (
    <div
      className={`flex justify-between items-center py-3 ${
        !isLast ? 'border-b border-[rgba(139,92,246,0.1)]' : ''
      }`}
    >
      <div className="text-[13px] text-[#94a3b8]">{label}</div>
      <div className="text-sm font-semibold text-[#e0d5ff]" style={valueColor ? { color: valueColor } : {}}>
        {value}
      </div>
    </div>
  )
}

function getWeeklyChartData(applications: Application[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const counts: number[] = new Array(7).fill(0)

  // Count applications per day of week
  applications.forEach(app => {
    const date = new Date(app.created_at)
    const dayIndex = (date.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
    counts[dayIndex]++
  })

  const maxCount = Math.max(...counts, 1)

  return days.map((label, index) => ({
    label,
    count: counts[index],
    percentage: (counts[index] / maxCount) * 100
  }))
}
