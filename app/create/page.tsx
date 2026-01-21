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

          {/* Blockchain Graffiti */}
          <div className="absolute inset-0 z-[2] opacity-[0.08]">
            {/* Top Left - Chain Icon */}
            <svg className="absolute top-[10%] left-[8%] w-16 h-16 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>

            {/* Top Right - Shield with checkmark */}
            <svg className="absolute top-[15%] right-[12%] w-20 h-20 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>

            {/* Middle Left - Star (reputation) */}
            <svg className="absolute top-[45%] left-[5%] w-14 h-14 text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>

            {/* Middle Right - Fingerprint (identity) */}
            <svg className="absolute top-[40%] right-[8%] w-18 h-18 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>
            </svg>

            {/* Bottom Left - Users group */}
            <svg className="absolute bottom-[20%] left-[10%] w-16 h-16 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>

            {/* Bottom Right - Badge check */}
            <svg className="absolute bottom-[15%] right-[15%] w-14 h-14 text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>

            {/* Center Top - Lock (security) */}
            <svg className="absolute top-[25%] left-[50%] -translate-x-1/2 w-12 h-12 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>

            {/* Text watermarks */}
            <div className="absolute top-[30%] right-[5%] transform rotate-[-15deg] text-[#8b5cf6] text-[24px] font-[900] opacity-[0.08]">
              ETHOS
            </div>
            <div className="absolute bottom-[35%] left-[12%] transform rotate-[12deg] text-[#06b6d4] text-[20px] font-[700] opacity-[0.08]">
              REPUTATION
            </div>
            <div className="absolute top-[60%] right-[20%] transform rotate-[-8deg] text-[#a78bfa] text-[18px] font-[700] opacity-[0.08]">
              VERIFIED
            </div>
          </div>

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
