"use client"

import { useState } from "react"
import ApplicationCard from "../application-card"

interface Application {
  id: string
  username: string
  score: number
  vouches: number
  accountAge: number
  timestamp: string
  status: "pending" | "accepted" | "rejected"
  ethos_profile_id: number
}

interface MainContentProps {
  applications: Application[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  selectedIds: Set<string>
  onSelectApp: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
}

export default function MainContent({
  applications,
  onApprove,
  onReject,
  selectedIds,
  onSelectApp,
  onSelectAll,
}: MainContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFilter, setCurrentFilter] = useState("all")

  // Filter applications
  let filteredApps = applications

  // Apply status filter
  if (currentFilter === "accepted") {
    filteredApps = filteredApps.filter(app => app.status === "accepted")
  } else if (currentFilter === "rejected") {
    filteredApps = filteredApps.filter(app => app.status === "rejected")
  } else if (currentFilter === "pending") {
    filteredApps = filteredApps.filter(app => app.status === "pending")
  } else if (currentFilter === "high-score") {
    filteredApps = filteredApps.filter(app => app.score >= 1600)
  }

  // Apply search filter
  if (searchQuery) {
    filteredApps = filteredApps.filter(app =>
      app.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filterCounts = {
    all: applications.length,
    accepted: applications.filter(a => a.status === "accepted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    pending: applications.filter(a => a.status === "pending").length,
    highScore: applications.filter(a => a.score >= 1600).length,
  }

  const allSelected = filteredApps.length > 0 && filteredApps.every(app => selectedIds.has(app.id))

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters */}
      <div className="bg-gradient-to-br from-white/5 to-white/2 border-[1.5px] border-[rgba(139,92,246,0.2)] rounded-[20px] p-6 backdrop-blur-[20px]">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search by username..."
            className="flex-1 px-5 py-3.5 bg-[rgba(139,92,246,0.08)] border-2 border-[rgba(139,92,246,0.3)] rounded-xl text-white text-[15px] placeholder:text-[#64748b]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterTag
            label={`All (${filterCounts.all})`}
            active={currentFilter === "all"}
            onClick={() => setCurrentFilter("all")}
          />
          <FilterTag
            label={`Accepted (${filterCounts.accepted})`}
            active={currentFilter === "accepted"}
            onClick={() => setCurrentFilter("accepted")}
          />
          <FilterTag
            label={`Rejected (${filterCounts.rejected})`}
            active={currentFilter === "rejected"}
            onClick={() => setCurrentFilter("rejected")}
          />
          <FilterTag
            label={`Pending (${filterCounts.pending})`}
            active={currentFilter === "pending"}
            onClick={() => setCurrentFilter("pending")}
          />
          <FilterTag
            label={`High Score (${filterCounts.highScore})`}
            active={currentFilter === "high-score"}
            onClick={() => setCurrentFilter("high-score")}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-3 p-4 px-6 bg-[rgba(139,92,246,0.05)] rounded-xl">
        <label className="flex items-center gap-2 text-sm text-[#cbd5e1] cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Select All</span>
        </label>
        <BulkButton
          icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          label="Email Selected"
          disabled={selectedIds.size === 0}
        />
        <BulkButton
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          label="Approve All"
          disabled={selectedIds.size === 0}
        />
        <BulkButton
          icon="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          label="Export CSV"
          disabled={selectedIds.size === 0}
        />
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-4">
        {filteredApps.map(app => (
          <ApplicationCard
            key={app.id}
            id={app.id}
            username={app.username}
            score={app.score}
            vouches={app.vouches || 0}
            accountAge={app.accountAge || 0}
            timestamp={app.timestamp}
            status={app.status}
            ethosProfileUrl={`https://ethos.network/profile/${app.ethos_profile_id}`}
            onApprove={() => onApprove(app.id)}
            onReject={() => onReject(app.id)}
            showActions={app.status === "pending"}
            isSelected={selectedIds.has(app.id)}
            onSelect={onSelectApp}
          />
        ))}
        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-[#64748b]">
            No applications found
          </div>
        )}
      </div>
    </div>
  )
}

function FilterTag({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[13px] cursor-pointer transition-all ${
        active
          ? "bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white border-transparent"
          : "bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] text-[#cbd5e1] hover:bg-[rgba(139,92,246,0.2)]"
      }`}
    >
      {label}
    </div>
  )
}

function BulkButton({ icon, label, disabled }: { icon: string; label: string; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className="flex items-center gap-1.5 px-4 py-2 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-lg text-[#e0d5ff] text-[13px] font-semibold cursor-pointer transition-all hover:bg-[rgba(139,92,246,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      {label}
    </button>
  )
}
