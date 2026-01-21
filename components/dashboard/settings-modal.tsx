"use client"

import { useState } from "react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    name: string
    slug: string
    criteria: {
      minScore: number
    }
  }
  onSave: (settings: { name: string; slug: string; minScore: number }) => void
}

export default function SettingsModal({ isOpen, onClose, project, onSave }: SettingsModalProps) {
  const [name, setName] = useState(project.name)
  const [slug, setSlug] = useState(project.slug)
  const [minScore, setMinScore] = useState(project.criteria.minScore)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, slug, minScore })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-[8px] z-[1000] flex items-center justify-center animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-[#1a1443] to-[#2d1b69] border-2 border-[rgba(139,92,246,0.5)] rounded-[24px] p-8 max-w-[600px] w-[90%] max-h-[80vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black bg-gradient-to-r from-white to-[#a78bfa] bg-clip-text text-transparent">
            ⚙️ Project Settings
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-lg text-[#a78bfa] cursor-pointer flex items-center justify-center transition-all hover:bg-[rgba(139,92,246,0.2)] hover:rotate-90"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#e0d5ff] mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 bg-[rgba(139,92,246,0.08)] border-2 border-[rgba(139,92,246,0.3)] rounded-xl text-white text-[15px] transition-all focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#e0d5ff] mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="w-full px-4 py-3.5 bg-[rgba(139,92,246,0.08)] border-2 border-[rgba(139,92,246,0.3)] rounded-xl text-white text-[15px] transition-all focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
            />
            <div className="text-xs text-[#94a3b8] mt-1">
              Only lowercase letters, numbers, and hyphens
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#e0d5ff] mb-2">
              Minimum Score
            </label>
            <input
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              min="1000"
              max="2000"
              className="w-full px-4 py-3.5 bg-[rgba(139,92,246,0.08)] border-2 border-[rgba(139,92,246,0.3)] rounded-xl text-white text-[15px] transition-all focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] border-none rounded-xl text-white text-[15px] font-bold cursor-pointer transition-all shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(139,92,246,0.6)]"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-xl text-[#a78bfa] text-[15px] font-bold cursor-pointer transition-all hover:bg-[rgba(139,92,246,0.2)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
