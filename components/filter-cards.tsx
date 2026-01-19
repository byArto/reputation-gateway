"use client"

import { useState } from "react"
import { Shield, ShieldCheck, ShieldAlert, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type PresetType = "basic" | "standard" | "strict" | null

interface CustomSettings {
  minScore: number
  minVouches: string
  positiveReviews: boolean
  minAccountAge: string
  manualReview: boolean
}

const presets = [
  {
    id: "basic" as const,
    title: "Basic",
    subtitle: "Light verification",
    percentage: "~70%",
    icon: Shield,
    requirements: ["Score ≥ 1200", "Slash protection"],
  },
  {
    id: "standard" as const,
    title: "Standard",
    subtitle: "Balanced verification",
    percentage: "~35%",
    icon: ShieldCheck,
    recommended: true,
    requirements: ["Score ≥ 1400", "1+ vouches", "Positive reviews", "7+ days old"],
  },
  {
    id: "strict" as const,
    title: "Strict",
    subtitle: "High-trust only",
    percentage: "~10%",
    icon: ShieldAlert,
    requirements: ["Score ≥ 1600", "2+ vouches", "Positive reviews", "30+ days old"],
  },
]

export default function FilterCards() {
  const [selectedPreset, setSelectedPreset] = useState<PresetType>("standard")
  const [customExpanded, setCustomExpanded] = useState(false)
  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    minScore: 1400,
    minVouches: "No minimum",
    positiveReviews: false,
    minAccountAge: "No minimum",
    manualReview: false,
  })

  const handlePresetSelect = (presetId: PresetType) => {
    setSelectedPreset(presetId)
    setCustomExpanded(false)
  }

  const handleCustomToggle = () => {
    if (!customExpanded) {
      setSelectedPreset(null)
    }
    setCustomExpanded(!customExpanded)
  }

  return (
    <div className="min-h-screen bg-[#EFE9DF] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1E3A5F] mb-4">
            Choose Verification Level
          </h1>
          <p className="font-sans text-lg text-[#5C5C5C]">
            Select how strict you want the reputation filter to be
          </p>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {presets.map((preset) => {
            const Icon = preset.icon
            const isSelected = selectedPreset === preset.id

            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={cn(
                  "relative bg-white rounded-2xl p-6 text-left transition-all duration-200",
                  "border hover:border-[#1E3A5F] hover:-translate-y-1 hover:shadow-lg",
                  isSelected
                    ? "border-[#1E3A5F] shadow-md"
                    : "border-[#E5E0D8]"
                )}
              >
                {/* Recommended Badge */}
                {preset.recommended && (
                  <div className="absolute top-4 right-4 bg-[#1E3A5F] text-white text-xs font-sans font-medium px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                {/* Icon */}
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-[#1E3A5F]" strokeWidth={1.5} />
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-sans text-xl font-semibold text-[#1E3A5F] mb-1">
                  {preset.title}
                </h3>
                <p className="font-sans text-sm text-[#888888] mb-4">
                  {preset.subtitle}
                </p>

                {/* Percentage */}
                <div className="mb-4">
                  <span className="font-serif text-5xl text-[#1E3A5F]">
                    {preset.percentage}
                  </span>
                  <p className="font-sans text-sm text-[#5C5C5C] mt-1">
                    will pass
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-[#E5E0D8] my-4" />

                {/* Requirements */}
                <ul className="space-y-2">
                  {preset.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-2 font-sans text-sm text-[#5C5C5C]">
                      <Check className="w-4 h-4 text-[#1E3A5F]" />
                      {req}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        {/* Custom Settings Section */}
        <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden mb-8">
          <button
            onClick={handleCustomToggle}
            className={cn(
              "w-full flex items-center justify-between p-6 transition-colors",
              customExpanded && selectedPreset === null && "bg-[#F8F6F3]"
            )}
          >
            <span className="font-sans text-lg font-medium text-[#1E3A5F]">
              Custom Requirements
            </span>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-[#1E3A5F] transition-transform duration-200",
                customExpanded && "rotate-180"
              )}
            />
          </button>

          {customExpanded && (
            <div className="px-6 pb-6 space-y-6">
              {/* Score Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-sans text-sm font-medium text-[#1E3A5F]">
                    Minimum Score
                  </label>
                  <span className="font-sans text-sm font-semibold text-[#1E3A5F]">
                    {customSettings.minScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="2000"
                  step="50"
                  value={customSettings.minScore}
                  onChange={(e) =>
                    setCustomSettings((prev) => ({
                      ...prev,
                      minScore: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-[#E5E0D8] rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
                />
                <div className="flex justify-between text-xs text-[#888888] mt-1">
                  <span>1000</span>
                  <span>2000</span>
                </div>
              </div>

              {/* Vouches Dropdown */}
              <div>
                <label className="block font-sans text-sm font-medium text-[#1E3A5F] mb-2">
                  Minimum Vouches
                </label>
                <select
                  value={customSettings.minVouches}
                  onChange={(e) =>
                    setCustomSettings((prev) => ({
                      ...prev,
                      minVouches: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white border border-[#E5E0D8] rounded-lg font-sans text-sm text-[#1E3A5F] focus:outline-none focus:border-[#1E3A5F] transition-colors"
                >
                  <option>No minimum</option>
                  <option>1+</option>
                  <option>2+</option>
                  <option>3+</option>
                </select>
              </div>

              {/* Review Balance Toggle */}
              <div className="flex items-center justify-between">
                <label className="font-sans text-sm font-medium text-[#1E3A5F]">
                  Require positive review balance
                </label>
                <button
                  onClick={() =>
                    setCustomSettings((prev) => ({
                      ...prev,
                      positiveReviews: !prev.positiveReviews,
                    }))
                  }
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-colors",
                    customSettings.positiveReviews ? "bg-[#1E3A5F]" : "bg-[#E5E0D8]"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                      customSettings.positiveReviews && "translate-x-6"
                    )}
                  />
                </button>
              </div>

              {/* Account Age Dropdown */}
              <div>
                <label className="block font-sans text-sm font-medium text-[#1E3A5F] mb-2">
                  Minimum Account Age
                </label>
                <select
                  value={customSettings.minAccountAge}
                  onChange={(e) =>
                    setCustomSettings((prev) => ({
                      ...prev,
                      minAccountAge: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-white border border-[#E5E0D8] rounded-lg font-sans text-sm text-[#1E3A5F] focus:outline-none focus:border-[#1E3A5F] transition-colors"
                >
                  <option>No minimum</option>
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>90 days</option>
                </select>
              </div>

              {/* Manual Review Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-sans text-sm font-medium text-[#1E3A5F] block">
                    Enable manual review
                  </label>
                  <p className="font-sans text-xs text-[#888888] mt-0.5">
                    Review applications before accepting
                  </p>
                </div>
                <button
                  onClick={() =>
                    setCustomSettings((prev) => ({
                      ...prev,
                      manualReview: !prev.manualReview,
                    }))
                  }
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-colors",
                    customSettings.manualReview ? "bg-[#1E3A5F]" : "bg-[#E5E0D8]"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                      customSettings.manualReview && "translate-x-6"
                    )}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button className="bg-[#1E3A5F] text-white font-sans font-medium px-12 py-4 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
