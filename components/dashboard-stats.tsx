"use client"

import { Users, CheckCircle, XCircle, TrendingUp, ArrowUp } from "lucide-react"

interface StatCardsProps {
  totalApplications: number
  last24h: number
  accepted: number
  acceptedPercent: number
  rejected: number
  rejectedPercent: number
  avgScore: number
  avgAcceptedScore: number
}

export default function DashboardStats({
  totalApplications,
  last24h,
  accepted,
  acceptedPercent,
  rejected,
  rejectedPercent,
  avgScore,
  avgAcceptedScore,
}: StatCardsProps) {
  return (
    <section className="min-h-screen bg-[#EFE9DF] py-16 px-4">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="font-serif text-[36px] text-[#1A1A1A] mb-8">
          Application Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 - Total Applications */}
          <div className="relative bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="absolute top-8 right-8 w-14 h-14 rounded-full bg-[rgba(30,58,95,0.1)] flex items-center justify-center">
              <Users className="w-8 h-8 text-[#1E3A5F]" />
            </div>
            <div className="font-serif text-[56px] font-bold text-[#1A1A1A] mb-2 leading-none">
              {totalApplications}
            </div>
            <div className="font-sans text-[14px] text-[#888888]">
              Total applications
            </div>
            <div className="flex items-center gap-1 mt-2 font-sans text-[12px] text-[#22C55E]">
              <ArrowUp className="w-3 h-3" />
              +{last24h} in last 24h
            </div>
          </div>

          {/* Card 2 - Accepted */}
          <div className="relative bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="absolute top-8 right-8 w-14 h-14 rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#22C55E]" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-[56px] font-bold text-[#1A1A1A] leading-none">
                {accepted}
              </span>
              <span className="font-sans text-[20px] text-[#888888]">
                ({acceptedPercent}%)
              </span>
            </div>
            <div className="font-sans text-[14px] text-[#888888] mt-2">
              Accepted
            </div>
          </div>

          {/* Card 3 - Rejected */}
          <div className="relative bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="absolute top-8 right-8 w-14 h-14 rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
              <XCircle className="w-8 h-8 text-[#EF4444]" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-[56px] font-bold text-[#1A1A1A] leading-none">
                {rejected}
              </span>
              <span className="font-sans text-[20px] text-[#888888]">
                ({rejectedPercent}%)
              </span>
            </div>
            <div className="font-sans text-[14px] text-[#888888] mt-2">
              Rejected
            </div>
          </div>

          {/* Card 4 - Average Score */}
          <div className="relative bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="absolute top-8 right-8 w-14 h-14 rounded-full bg-[rgba(124,58,237,0.1)] flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <div className="font-serif text-[56px] font-bold text-[#1A1A1A] mb-2 leading-none">
              {avgScore}
            </div>
            <div className="font-sans text-[14px] text-[#888888]">
              Average applicant score
            </div>
            <div className="font-sans text-[12px] text-[#5C5C5C] mt-2">
              Accepted avg: {avgAcceptedScore}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
