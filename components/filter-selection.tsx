"use client"

import { useState } from "react"
import type { FilterPreset } from "@/lib/filters"

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

interface FilterSelectionProps {
  onContinue: (settings: FilterSettings) => void
}

const filters = [
  {
    id: "basic" as const,
    name: "Basic",
    subtitle: "Light verification",
    passRate: "~70%",
    iconPath: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    criteria: ["Score ≥ 1200", "Slash protection"],
    bestFor: [
      "Mass community launches (1000+ testers)",
      "Early-stage projects & airdrops",
      "Maximum reach > quality"
    ],
    stats: {
      pass: "~26K (70%)",
      filtered: "~11K (30%)",
      note: "⚠️ Higher spam risk",
      noteType: "warning"
    }
  },
  {
    id: "standard" as const,
    name: "Standard",
    subtitle: "Balanced verification",
    passRate: "~35%",
    iconPath: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    criteria: ["Score ≥ 1400", "1+ vouches", "Positive reviews", "Age: 7d+"],
    bestFor: [
      "DeFi protocols & gaming betas",
      "NFT launches & Web3 dApps",
      "Balanced security + participation"
    ],
    stats: {
      pass: "~13K (35%)",
      filtered: "~24K (65%)",
      note: "✨ Most popular (67% of projects)",
      noteType: "success"
    }
  },
  {
    id: "strict" as const,
    name: "Strict",
    subtitle: "High-trust only",
    passRate: "~10%",
    iconPath: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
    criteria: ["Score ≥ 1600", "2+ vouches", "Positive reviews", "Age: 30d+"],
    bestFor: [
      "High-value incentives ($10K+ pools)",
      "Security-critical & exclusive alphas",
      "VIP rounds, top-tier only"
    ],
    stats: {
      pass: "~3.7K (10%)",
      filtered: "~33K (90%)",
      note: "🔒 Maximum quality, elite community",
      noteType: "lock"
    }
  }
]

export default function FilterSelection({ onContinue }: FilterSelectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterPreset | null>("standard")
  const [customExpanded, setCustomExpanded] = useState(false)
  const [customSettings, setCustomSettings] = useState({
    minScore: 1400,
    minVouches: 1,
    positiveReviews: true,
    minAccountAge: 7,
    manualReview: false
  })

  const handleCardClick = (filterId: FilterPreset) => {
    setSelectedFilter(filterId)
    setCustomExpanded(false)
  }

  const handleCustomToggle = () => {
    setCustomExpanded(!customExpanded)
    if (!customExpanded) {
      setSelectedFilter(null)
    } else {
      setSelectedFilter("standard")
    }
  }

  const handleContinue = () => {
    // Add fade out animation
    const container = document.querySelector('.filter-selection-container')
    if (container) {
      container.classList.add('fade-out')
    }

    // Delay continue call to allow animation
    setTimeout(() => {
      if (customExpanded) {
        onContinue({
          preset: "custom",
          customSettings
        })
      } else if (selectedFilter) {
        onContinue({ preset: selectedFilter })
      }
    }, 400)
  }

  return (
    <>
      <style jsx global>{`
        .flip-card { perspective: 1000px; height: 400px; cursor: pointer; transition: transform 0.3s ease; }
        .flip-card.selected { transform: scale(1.05); }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 24px; padding: 28px 20px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%); border: 1.5px solid rgba(139, 92, 246, 0.2); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); transition: all 0.3s ease; }
        .flip-card.selected .flip-card-front, .flip-card.selected .flip-card-back { border: 2px solid #8b5cf6; box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), 0 20px 60px rgba(139, 92, 246, 0.4); }
        .flip-card-back { transform: rotateY(180deg); background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%); border-color: rgba(139, 92, 246, 0.4); }
        .filter-icon { width: 48px; height: 48px; margin: 0 auto 12px; padding: 12px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2)); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .filter-icon svg { width: 24px; height: 24px; stroke: #a78bfa; fill: none; stroke-width: 2; }
        .filter-name { font-size: 28px; font-weight: 800; margin-bottom: 6px; text-align: center; background: linear-gradient(135deg, #ffffff 0%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .filter-subtitle { font-size: 14px; color: #94a3b8; text-align: center; margin-bottom: 16px; }
        .pass-rate { font-size: 52px; font-weight: 900; text-align: center; margin-bottom: 6px; background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
        .pass-label { font-size: 14px; color: #94a3b8; text-align: center; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .criteria-list { list-style: none; }
        .criteria-list li { display: flex; align-items: center; gap: 10px; padding: 4px 0; font-size: 12px; color: #cbd5e1; border-bottom: 1px solid rgba(139, 92, 246, 0.1); }
        .criteria-list li:last-child { border-bottom: none; }
        .check-icon { width: 16px; height: 16px; color: #8b5cf6; flex-shrink: 0; }
        .back-content { height: 100%; display: flex; flex-direction: column; }
        .best-for-title { font-size: 15px; font-weight: 700; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; color: #a78bfa; }
        .best-for-list { list-style: none; margin-bottom: 24px; flex-grow: 1; }
        .best-for-list li { display: flex; gap: 10px; margin-bottom: 10px; font-size: 13px; line-height: 1.5; color: #cbd5e1; }
        .best-for-list li span:first-child { color: #8b5cf6; font-weight: 600; }
        .stats-section { padding: 18px; background: rgba(139, 92, 246, 0.1); border-radius: 14px; border: 1px solid rgba(139, 92, 246, 0.3); }
        .stats-title { font-size: 11px; color: #a78bfa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600; }
        .stats-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 13px; }
        .stats-row:last-child { margin-bottom: 0; }
        .stats-label { color: #94a3b8; }
        .stats-value { font-weight: 600; color: #fff; }
        .stats-value.success { color: #22c55e; }
        .stats-value.error { color: #ef4444; }
        .warning-note, .success-note, .lock-note { display: flex; align-items: center; gap: 6px; margin-top: 10px; padding: 6px 10px; border-radius: 8px; font-size: 11px; }
        .warning-note { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
        .success-note { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .lock-note { background: rgba(139, 92, 246, 0.1); color: #a78bfa; }
        @media (max-width: 1024px) {
          .filter-cards { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto 40px; }
          .flip-card { height: 400px; }
        }
      `}</style>

      <div className="filter-selection-container max-w-[1200px] mx-auto transition-opacity duration-400">
        <div className="text-center mb-[60px] animate-[fadeInUp_1s_ease-out]">
          <h1 className="text-[56px] font-[900] mb-4 bg-gradient-to-r from-white via-[#a78bfa] to-[#06b6d4] bg-clip-text text-transparent leading-tight tracking-tight">
            Choose Verification Level
          </h1>
          <p className="text-[18px] text-[#cbd5e1]">
            Select how strict you want the reputation filter to be
          </p>
        </div>

        <div className="filter-cards grid grid-cols-1 md:grid-cols-3 gap-[30px] mb-10">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className={`flip-card ${selectedFilter === filter.id ? 'selected' : ''}`}
              onClick={() => handleCardClick(filter.id)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="filter-icon">
                    <svg viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={filter.iconPath} />
                    </svg>
                  </div>
                  <h3 className="filter-name">{filter.name}</h3>
                  <p className="filter-subtitle">{filter.subtitle}</p>
                  <div className="pass-rate">{filter.passRate}</div>
                  <p className="pass-label">will pass</p>
                  <ul className="criteria-list">
                    {filter.criteria.map((criterion, idx) => (
                      <li key={idx}>
                        <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {criterion}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flip-card-back">
                  <div className="back-content">
                    <div className="best-for-title">💡 BEST FOR:</div>
                    <ul className="best-for-list">
                      {filter.bestFor.map((item, idx) => (
                        <li key={idx}><span>•</span><span>{item}</span></li>
                      ))}
                    </ul>
                    <div className="stats-section">
                      <div className="stats-title">📊 EXPECTED RESULTS:</div>
                      <div className="stats-row">
                        <span className="stats-label">From 37,000 profiles</span>
                      </div>
                      <div className="stats-row">
                        <span className="stats-label">✅ Will pass</span>
                        <span className="stats-value success">{filter.stats.pass}</span>
                      </div>
                      <div className="stats-row">
                        <span className="stats-label">❌ Filtered out</span>
                        <span className="stats-value error">{filter.stats.filtered}</span>
                      </div>
                      <div className={`${filter.stats.noteType}-note`}>
                        <span>{filter.stats.note.split(' ')[0]}</span>
                        <span>{filter.stats.note.substring(filter.stats.note.indexOf(' ') + 1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Requirements */}
        <div className="bg-gradient-to-br from-white/5 to-white/2 border-[1.5px] border-[#8b5cf6]/20 rounded-[16px] overflow-hidden mb-10 backdrop-blur-[20px]">
          <button
            onClick={handleCustomToggle}
            className={`w-full flex items-center justify-between p-6 transition-colors ${customExpanded && selectedFilter === null ? 'bg-white/5' : ''}`}
          >
            <h3 className="text-[20px] font-[700] text-white">Custom Requirements</h3>
            <svg className={`w-6 h-6 text-[#8b5cf6] transition-transform duration-200 ${customExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {customExpanded && (
            <div className="px-8 pb-8 space-y-7">
              {/* Score Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[15px] font-[600] text-[#e0d5ff]">Minimum Score</label>
                  <span className="text-[18px] font-[700] text-[#a78bfa]">{customSettings.minScore}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="2000"
                  step="50"
                  value={customSettings.minScore}
                  onChange={(e) => setCustomSettings({...customSettings, minScore: Number(e.target.value)})}
                  className="w-full h-[6px] bg-gradient-to-r from-[#8b5cf6]/30 to-[#06b6d4]/30 rounded-[10px] appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3))`
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-[#64748b]">
                  <span>1000</span>
                  <span>2000</span>
                </div>
              </div>

              {/* Vouches Select */}
              <div>
                <label className="block text-[15px] font-[600] text-[#e0d5ff] mb-3">Minimum Vouches</label>
                <select
                  value={customSettings.minVouches}
                  onChange={(e) => setCustomSettings({...customSettings, minVouches: Number(e.target.value)})}
                  className="w-full px-[18px] py-[14px] bg-[#8b5cf6]/10 border-[1.5px] border-[#8b5cf6]/30 rounded-[12px] text-white text-[15px] cursor-pointer transition-all hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/15 focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
                >
                  <option value={0}>No minimum</option>
                  <option value={1}>1+ vouches</option>
                  <option value={2}>2+ vouches</option>
                  <option value={3}>3+ vouches</option>
                  <option value={5}>5+ vouches</option>
                </select>
              </div>

              {/* Review Toggle */}
              <div className="flex justify-between items-center p-5 bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-[12px] transition-all hover:bg-[#8b5cf6]/8 hover:border-[#8b5cf6]/30">
                <div>
                  <h4 className="text-[15px] font-[600] text-[#e0d5ff] mb-1">Require positive review balance</h4>
                  <p className="text-[13px] text-[#94a3b8]">User must have more positive than negative reviews</p>
                </div>
                <div
                  onClick={() => setCustomSettings({...customSettings, positiveReviews: !customSettings.positiveReviews})}
                  className={`relative w-[52px] h-[28px] rounded-[20px] cursor-pointer transition-all ${customSettings.positiveReviews ? 'bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]' : 'bg-[#64748b]/30'}`}
                >
                  <div className={`absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${customSettings.positiveReviews ? 'left-[27px]' : 'left-[3px]'}`}></div>
                </div>
              </div>

              {/* Account Age Select */}
              <div>
                <label className="block text-[15px] font-[600] text-[#e0d5ff] mb-3">Minimum Account Age</label>
                <select
                  value={customSettings.minAccountAge}
                  onChange={(e) => setCustomSettings({...customSettings, minAccountAge: Number(e.target.value)})}
                  className="w-full px-[18px] py-[14px] bg-[#8b5cf6]/10 border-[1.5px] border-[#8b5cf6]/30 rounded-[12px] text-white text-[15px] cursor-pointer transition-all hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/15 focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
                >
                  <option value={0}>No minimum</option>
                  <option value={7}>7+ days</option>
                  <option value={30}>30+ days</option>
                  <option value={90}>90+ days</option>
                  <option value={180}>180+ days</option>
                </select>
              </div>

              {/* Manual Review Toggle */}
              <div className="flex justify-between items-center p-5 bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-[12px] transition-all hover:bg-[#8b5cf6]/8 hover:border-[#8b5cf6]/30">
                <div>
                  <h4 className="text-[15px] font-[600] text-[#e0d5ff] mb-1">Enable manual review</h4>
                  <p className="text-[13px] text-[#94a3b8]">Review applications before accepting</p>
                </div>
                <div
                  onClick={() => setCustomSettings({...customSettings, manualReview: !customSettings.manualReview})}
                  className={`relative w-[52px] h-[28px] rounded-[20px] cursor-pointer transition-all ${customSettings.manualReview ? 'bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]' : 'bg-[#64748b]/30'}`}
                >
                  <div className={`absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${customSettings.manualReview ? 'left-[27px]' : 'left-[3px]'}`}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedFilter && !customExpanded}
            className="flex items-center justify-center gap-3 max-w-[400px] w-full mx-auto px-12 py-5 text-[18px] font-[700] rounded-[14px] border-none cursor-pointer transition-all duration-[400ms] bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#06b6d4] bg-[length:200%_200%] text-white shadow-[0_12px_48px_rgba(139,92,246,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] hover:translate-y-[-3px] hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(139,92,246,0.7),0_0_0_1px_rgba(255,255,255,0.2)_inset] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 relative overflow-hidden"
          >
            <span>Continue</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .filter-selection-container.fade-out {
          opacity: 0;
          transform: translateY(-30px);
        }
      `}</style>
    </>
  )
}
