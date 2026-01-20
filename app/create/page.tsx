"use client"

import { useState, useRef } from "react"
import FilterCards from "@/components/filter-cards"
import CreatePageForm from "@/components/create-page-form"
import type { FilterPreset } from "@/lib/filters"

export default function CreatePage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterPreset>("standard")
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const handleContinue = (filter: FilterPreset) => {
    setSelectedFilter(filter)
    setShowForm(true)
    // Плавная прокрутка к форме после небольшой задержки
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-[#EFE9DF]">
      {/* Filter Cards Section */}
      <FilterCards onContinue={handleContinue} />

      {/* Create Form Section */}
      {showForm && (
        <div
          ref={formRef}
          className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-8">
            <h2 className="font-serif text-3xl text-[#1E3A5F] mb-6">
              Configure Access Page
            </h2>
            <CreatePageForm selectedFilter={selectedFilter} />
          </div>
        </div>
      )}
    </div>
  )
}
