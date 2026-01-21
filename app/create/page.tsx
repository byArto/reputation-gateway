"use client"

import { useState } from "react"
import FilterSelection from "@/components/filter-selection"
import ConfigureForm from "@/components/configure-form"
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

export default function CreatePage() {
  const [step, setStep] = useState<"filter" | "configure">("filter")
  const [filterSettings, setFilterSettings] = useState<FilterSettings | null>(null)

  const handleContinue = (settings: FilterSettings) => {
    setFilterSettings(settings)
    setStep("configure")
  }

  const handleBack = () => {
    setStep("filter")
  }

  return (
    <>
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1443 25%, #2d1b69 50%, #1e3a5f 75%, #0f2744 100%);
          color: #fff;
          overflow-x: hidden;
          position: relative;
          min-height: 100vh;
        }
      `}</style>

      <div className="min-h-screen relative">
        {/* Background elements */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Blockchain grid */}
          <div className="absolute inset-0 z-[1]" style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.06) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(139, 92, 246, 0.06) 1.5px, transparent 1.5px)',
            backgroundSize: '60px 60px',
            animation: 'gridMove 30s linear infinite'
          }}></div>

          {/* Glow orbs */}
          <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] z-[1]" style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
            animation: 'float1 20s infinite'
          }}></div>
          <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] z-[1]" style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
            animation: 'float2 25s infinite'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-5 py-[60px]">
          {step === "filter" && (
            <FilterSelection onContinue={handleContinue} />
          )}
          {step === "configure" && filterSettings && (
            <ConfigureForm
              filterSettings={filterSettings}
              onBack={handleBack}
            />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-100px, 100px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(100px, -100px); }
        }
      `}</style>
    </>
  )
}
