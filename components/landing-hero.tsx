"use client"

import { ShieldCheck } from "lucide-react"

const stats = [
  { value: "1,200+", label: "Projects" },
  { value: "500K+", label: "Verified Profiles" },
  { value: "99%", label: "Accuracy" },
]

export default function LandingHero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#EFE9DF] px-4 py-16">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1E3A5F]/10 bg-[rgba(30,58,95,0.06)]">
          <ShieldCheck className="w-4 h-4 text-[#1E3A5F]" />
          <span className="text-sm font-sans text-[#1E3A5F]">Powered by Ethos Network</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-5xl md:text-7xl font-normal text-[#1A1A1A] leading-tight text-balance">
          Filter Beta Testers
          <br />
          by Reputation
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-lg md:text-xl text-[#5C5C5C] max-w-[560px]">
          Stop wasting time on low-quality testers. Only accept users with proven on-chain credibility.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            className="px-9 py-4 bg-[#1E3A5F] text-white font-sans font-medium rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Access Page
          </button>
          <button
            className="px-9 py-4 bg-transparent border border-[#1E3A5F] text-[#1E3A5F] font-sans font-medium rounded-lg hover:bg-[#1E3A5F]/5 transition-all duration-200"
          >
            View Demo
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl md:text-4xl text-[#1A1A1A]">{stat.value}</div>
              <div className="font-sans text-sm text-[#888888] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
