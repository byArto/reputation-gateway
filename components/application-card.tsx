"use client"

import { Shield, Calendar, Check, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApplicationCardProps {
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
}

export default function ApplicationCard({
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
}: ApplicationCardProps) {
  const statusBorderColors = {
    pending: "border-l-[#F59E0B]",
    accepted: "border-l-[#22C55E]",
    rejected: "border-l-[#EF4444]",
  }

  return (
    <div
      className={cn(
        "bg-white border border-[#E5E0D8] rounded-xl p-6 transition-all duration-200 ease-in-out",
        "hover:border-[#1E3A5F] hover:-translate-y-0.5 hover:shadow-md",
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
        "border-l-[3px]",
        statusBorderColors[status]
      )}
    >
      {/* Left Section - Main Info */}
      <div className="flex-1">
        {/* Username */}
        <h3 className="font-sans text-lg font-semibold text-[#1A1A1A] mb-3">
          @{username}
        </h3>

        {/* Metrics Row */}
        <div className="flex flex-wrap items-center gap-4 mb-3">
          {/* Score Badge */}
          <span className="bg-[rgba(30,58,95,0.1)] text-[#1E3A5F] text-[13px] font-sans px-3 py-1.5 rounded-md">
            Score: {score}
          </span>

          {/* Vouches */}
          <div className="flex items-center gap-1.5 text-[#5C5C5C]">
            <Shield size={14} />
            <span className="text-[13px] font-sans">
              {vouches} {vouches === 1 ? "vouch" : "vouches"}
            </span>
          </div>

          {/* Account Age */}
          <div className="flex items-center gap-1.5 text-[#5C5C5C]">
            <Calendar size={14} />
            <span className="text-[13px] font-sans">
              {accountAge} {accountAge === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-[#888888] font-sans">{timestamp}</p>
      </div>

      {/* Right Section - Actions */}
      <div className="flex flex-col items-start md:items-end gap-3">
        {/* Link to Ethos */}
        <a
          href={ethosProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-sans text-[#1E3A5F] hover:underline inline-flex items-center gap-1 transition-colors"
        >
          View on Ethos
          <ExternalLink size={12} />
        </a>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onApprove}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-sans transition-colors",
                "bg-[rgba(34,197,94,0.1)] text-[#22C55E] border border-[rgba(34,197,94,0.2)]",
                "hover:bg-[rgba(34,197,94,0.2)]"
              )}
            >
              <Check size={16} />
              Approve
            </button>
            <button
              type="button"
              onClick={onReject}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-sans transition-colors",
                "bg-[rgba(239,68,68,0.1)] text-[#EF4444] border border-[rgba(239,68,68,0.2)]",
                "hover:bg-[rgba(239,68,68,0.2)]"
              )}
            >
              <X size={16} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
