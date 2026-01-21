"use client"

import { useState } from "react"

interface URLShareBoxProps {
  url: string
}

export default function URLShareBox({ url }: URLShareBoxProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-white/8 to-white/4 border-2 border-[rgba(139,92,246,0.4)] rounded-[20px] p-6 px-8 mb-10 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] animate-[fadeInUp_0.6s_ease-out_0.1s_both] transition-all hover:border-[#06b6d4] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2),0_0_30px_rgba(6,182,212,0.4)]">
      <div className="text-sm text-[#94a3b8] mb-3 font-semibold">
        Share this URL with testers:
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-5 py-4 bg-[rgba(139,92,246,0.08)] border-2 border-[rgba(139,92,246,0.3)] rounded-xl text-[#e0d5ff] text-sm sm:text-base font-mono"
        />
        <button
          onClick={handleCopy}
          className="px-8 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] border-none rounded-xl text-white text-[15px] font-bold cursor-pointer transition-all shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(139,92,246,0.6)] whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  )
}
