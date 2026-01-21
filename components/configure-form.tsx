"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { FilterPreset } from "@/lib/filters"
import { getFilterPreset } from "@/lib/filters"

interface FilterSettings {
  preset: FilterPreset
  customSettings?: {
    minScore: number
    minVouches: number
    positiveReviews: boolean
    minAccountAge: number
    manualReview: boolean
  }
}

interface ConfigureFormProps {
  filterSettings: FilterSettings
  onBack: () => void
}

export default function ConfigureForm({ filterSettings, onBack }: ConfigureFormProps) {
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [pageSlug, setPageSlug] = useState("")
  const [destinationType, setDestinationType] = useState<"discord" | "beta">("beta")
  const [destinationUrl, setDestinationUrl] = useState("")
  const [benefits, setBenefits] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get filter summary
  const getFilterSummary = () => {
    if (filterSettings.preset === "custom" && filterSettings.customSettings) {
      const cs = filterSettings.customSettings
      return {
        name: "Custom",
        score: `≥ ${cs.minScore}`,
        vouches: cs.minVouches === 0 ? "None" : `${cs.minVouches}+`,
        reviews: cs.positiveReviews ? "Positive" : "Not required",
        age: cs.minAccountAge === 0 ? "None" : `${cs.minAccountAge}+ days`,
        pass: "Custom"
      }
    }

    const presetData = {
      basic: { name: "Basic", score: "≥ 1200", vouches: "None", reviews: "Not required", age: "None", pass: "~26K (70%)" },
      standard: { name: "Standard", score: "≥ 1400", vouches: "1+", reviews: "Positive", age: "7+ days", pass: "~13K (35%)" },
      strict: { name: "Strict", score: "≥ 1600", vouches: "2+", reviews: "Positive", age: "30+ days", pass: "~3.7K (10%)" }
    }

    return presetData[filterSettings.preset as keyof typeof presetData] || presetData.standard
  }

  const summary = getFilterSummary()

  const handleSlugChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setPageSlug(sanitized)
  }

  const handleSubmit = async () => {
    setError("")

    if (!projectName.trim()) {
      setError("Project name is required")
      return
    }

    if (!pageSlug.trim()) {
      setError("Page URL is required")
      return
    }

    if (!destinationUrl.trim()) {
      setError("Destination URL is required")
      return
    }

    if (!destinationUrl.startsWith("https://")) {
      setError("Destination URL must start with https://")
      return
    }

    setIsSubmitting(true)

    try {
      let criteria
      if (filterSettings.preset === "custom" && filterSettings.customSettings) {
        criteria = {
          minScore: filterSettings.customSettings.minScore,
          minVouches: filterSettings.customSettings.minVouches,
          positiveReviews: filterSettings.customSettings.positiveReviews,
          minAccountAge: filterSettings.customSettings.minAccountAge
        }
      } else {
        criteria = getFilterPreset(filterSettings.preset)
      }

      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          slug: pageSlug,
          criteria,
          manual_review: filterSettings.customSettings?.manualReview || false,
          destination_url: destinationUrl,
          destination_type: destinationType,
          benefits: benefits.trim() || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project")
      }

      router.push(`/dashboard/${data.project.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        .side-panel {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 20px;
          padding: 24px 20px;
          backdrop-filter: blur(10px);
          opacity: 0.7;
          transition: all 0.3s;
        }
        .side-panel:hover { opacity: 1; border-color: rgba(139, 92, 246, 0.25); }
        .side-panel-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #a78bfa;
        }
        .side-panel-content { font-size: 13px; line-height: 1.6; color: #94a3b8; }
        .side-panel-item { padding: 8px 0; border-bottom: 1px solid rgba(139, 92, 246, 0.1); }
        .side-panel-item:last-child { border-bottom: none; }
        .side-panel-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .side-panel-value { font-size: 13px; font-weight: 600; color: #e0d5ff; }
        .side-panel-list { list-style: none; }
        .side-panel-list li { padding: 6px 0; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #cbd5e1; }
        .side-panel-list li::before { content: '✓'; color: #8b5cf6; font-weight: 700; }
        .side-panel-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent); margin: 20px 0; }
        .config-main {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
          border: 2px solid rgba(139, 92, 246, 0.4);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        @media (max-width: 1200px) {
          .config-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className={`max-w-[1400px] mx-auto transition-all duration-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8 items-start">
          {/* LEFT: Filter Summary */}
          <div className="side-panel">
            <div className="side-panel-title">🎯 Your Filter</div>
            <div className="side-panel-content">
              <div className="side-panel-item">
                <div className="side-panel-label">Filter Type</div>
                <div className="side-panel-value">{summary.name}</div>
              </div>
              <div className="side-panel-item">
                <div className="side-panel-label">Min Score</div>
                <div className="side-panel-value">{summary.score}</div>
              </div>
              <div className="side-panel-item">
                <div className="side-panel-label">Vouches</div>
                <div className="side-panel-value">{summary.vouches}</div>
              </div>
              <div className="side-panel-item">
                <div className="side-panel-label">Reviews</div>
                <div className="side-panel-value">{summary.reviews}</div>
              </div>
              <div className="side-panel-item">
                <div className="side-panel-label">Account Age</div>
                <div className="side-panel-value">{summary.age}</div>
              </div>
              <div className="side-panel-divider"></div>
              <div className="side-panel-item">
                <div className="side-panel-label">Expected Pass</div>
                <div className="side-panel-value">{summary.pass}</div>
              </div>
            </div>
          </div>

          {/* CENTER: Main Form */}
          <div className="config-main">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-3 mb-8 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-[12px] text-[#a78bfa] text-[14px] font-[600] cursor-pointer transition-all hover:bg-[#8b5cf6]/15 hover:border-[#8b5cf6]/50 hover:translate-x-[-4px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to filters</span>
            </button>

            <div className="text-center mb-10">
              <h2 className="text-[42px] font-[900] mb-3 bg-gradient-to-r from-white via-[#a78bfa] to-[#06b6d4] bg-clip-text text-transparent tracking-tight">
                Configure Access Page
              </h2>
              <p className="text-[16px] text-[#94a3b8]">Set up your beta tester application page</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-[12px]">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Project Name */}
            <div className="mb-8">
              <label className="block text-[16px] font-[700] text-[#e0d5ff] mb-3">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
                className="w-full px-5 py-4 bg-[#8b5cf6]/8 border-2 border-[#8b5cf6]/30 rounded-[14px] text-white text-[16px] transition-all placeholder:text-[#64748b] hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/12 focus:outline-none focus:border-[#8b5cf6] focus:bg-[#8b5cf6]/15 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1)]"
              />
              <p className="text-[13px] text-[#94a3b8] mt-2">This will appear on your access page</p>
            </div>

            {/* Page URL */}
            <div className="mb-8">
              <label className="block text-[16px] font-[700] text-[#e0d5ff] mb-3">Page URL</label>
              <div className="flex gap-3 items-center">
                <div className="px-5 py-4 bg-[#64748b]/20 border-2 border-[#64748b]/30 rounded-[14px] text-[#94a3b8] text-[16px] whitespace-nowrap">
                  repgateway.xyz/
                </div>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="my-project"
                  className="flex-1 px-5 py-4 bg-[#8b5cf6]/8 border-2 border-[#8b5cf6]/30 rounded-[14px] text-white text-[16px] transition-all placeholder:text-[#64748b] hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/12 focus:outline-none focus:border-[#8b5cf6] focus:bg-[#8b5cf6]/15 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1)]"
                />
              </div>
              <p className="text-[13px] text-[#94a3b8] mt-2">Only lowercase letters, numbers, and hyphens</p>
            </div>

            {/* Destination Type */}
            <div className="mb-8">
              <label className="block text-[16px] font-[700] text-[#e0d5ff] mb-3">Where should accepted users go?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDestinationType("discord")}
                  className={`flex items-center justify-center gap-3 px-6 py-[18px] rounded-[14px] border-2 text-[15px] font-[600] transition-all ${
                    destinationType === "discord"
                      ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                      : "border-[#8b5cf6]/30 bg-[#8b5cf6]/8 text-[#cbd5e1] hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/12"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span>Discord Server</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDestinationType("beta")}
                  className={`flex items-center justify-center gap-3 px-6 py-[18px] rounded-[14px] border-2 text-[15px] font-[600] transition-all ${
                    destinationType === "beta"
                      ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                      : "border-[#8b5cf6]/30 bg-[#8b5cf6]/8 text-[#cbd5e1] hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/12"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>Beta Access URL</span>
                </button>
              </div>
            </div>

            {/* Destination URL */}
            <div className="mb-10">
              <label className="block text-[16px] font-[700] text-[#e0d5ff] mb-3">
                {destinationType === "discord" ? "Discord Invite Link" : "Beta Access URL"}
              </label>
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder={destinationType === "discord" ? "https://discord.gg/..." : "https://..."}
                className="w-full px-5 py-4 bg-[#8b5cf6]/8 border-2 border-[#8b5cf6]/30 rounded-[14px] text-white text-[16px] transition-all placeholder:text-[#64748b] hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/12 focus:outline-none focus:border-[#8b5cf6] focus:bg-[#8b5cf6]/15 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1)]"
              />
            </div>

            {/* Beta Tester Benefits */}
            <div className="mb-10">
              <label className="block text-[16px] font-[700] text-[#e0d5ff] mb-3">
                Beta Tester Benefits (Optional)
              </label>
              <p className="text-[13px] text-[#94a3b8] mb-2">
                Tell testers what they&apos;ll get for participating
              </p>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="e.g., Early access to platform, Premium features for free, Beta tester badge..."
                rows={4}
                className="w-full px-5 py-4 bg-[#8b5cf6]/8 border-2 border-[#8b5cf6]/30 rounded-[14px] text-white text-[15px] transition-all placeholder:text-[#64748b] hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/12 focus:outline-none focus:border-[#8b5cf6] focus:bg-[#8b5cf6]/15 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.1)] resize-none"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-12 py-[22px] text-[19px] font-[700] rounded-[16px] border-none cursor-pointer transition-all duration-[400ms] bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#06b6d4] bg-[length:200%_200%] text-white shadow-[0_16px_56px_rgba(139,92,246,0.6),0_0_0_1px_rgba(255,255,255,0.1)_inset] hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-[0_24px_70px_rgba(139,92,246,0.8),0_0_0_1px_rgba(255,255,255,0.2)_inset] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 relative overflow-hidden"
            >
              {isSubmitting ? "Creating..." : "Create Access Page"}
            </button>
          </div>

          {/* RIGHT: Security + What's Next */}
          <div>
            <div className="side-panel mb-6">
              <div className="side-panel-title">🔒 Security</div>
              <div className="side-panel-content">
                <ul className="side-panel-list">
                  <li>One-time tokens</li>
                  <li>24h expiration</li>
                  <li>On-chain verified</li>
                  <li>Anti-bot protection</li>
                </ul>
              </div>
            </div>

            <div className="side-panel">
              <div className="side-panel-title">🎯 What&apos;s Next</div>
              <div className="side-panel-content">
                <ul className="side-panel-list">
                  <li>Shareable link</li>
                  <li>Live dashboard</li>
                  <li>Track applications</li>
                  <li>Manage approvals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
