"use client"

interface ApplicationCardProps {
  id: string
  username: string
  score: number
  vouches: number
  accountAge: number
  timestamp: string
  status: "pending" | "accepted" | "rejected"
  ethosProfileUrl: string
  onApprove?: () => void
  onReject?: () => void
  showActions?: boolean
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
}

export default function ApplicationCard({
  id,
  username,
  score,
  vouches,
  accountAge,
  timestamp,
  status,
  ethosProfileUrl,
  onApprove,
  onReject,
  showActions = false,
  isSelected = false,
  onSelect,
}: ApplicationCardProps) {
  const statusBadgeColors = {
    pending: "bg-[rgba(245,158,11,0.2)] text-[#f59e0b] border-[rgba(245,158,11,0.3)]",
    accepted: "bg-[rgba(34,197,94,0.2)] text-[#22c55e] border-[rgba(34,197,94,0.3)]",
    rejected: "bg-[rgba(239,68,68,0.2)] text-[#ef4444] border-[rgba(239,68,68,0.3)]",
  }

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/2 border-[1.5px] border-[rgba(139,92,246,0.2)] rounded-[16px] p-5 px-6 backdrop-blur-[20px] transition-all hover:border-[rgba(139,92,246,0.4)] hover:translate-x-1">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(id, e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
          )}
          <div className="text-lg font-bold text-[#e0d5ff]">{username}</div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${statusBadgeColors[status]}`}>
            {status}
          </div>
        </div>
      </div>

      <div className="flex gap-5 text-sm text-[#94a3b8] mb-3">
        <div>Score: {score}</div>
        <div>{vouches} vouches</div>
        <div>{accountAge} days</div>
        <div>{timestamp}</div>
      </div>

      <div className="flex gap-2">
        <a
          href={ethosProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-lg text-[#a78bfa] text-[13px] font-semibold cursor-pointer transition-all hover:bg-[rgba(139,92,246,0.2)] inline-block"
        >
          View on Ethos →
        </a>
        {showActions && onApprove && onReject && (
          <>
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-lg text-[#22c55e] text-[13px] font-semibold cursor-pointer transition-all hover:bg-[rgba(34,197,94,0.2)]"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="px-4 py-2 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg text-[#ef4444] text-[13px] font-semibold cursor-pointer transition-all hover:bg-[rgba(239,68,68,0.2)]"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  )
}
