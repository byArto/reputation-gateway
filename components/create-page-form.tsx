"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { getFilterPreset, type FilterPreset } from "@/lib/filters"

type DestinationType = "discord" | "beta"

interface CreatePageFormProps {
  selectedFilter: FilterPreset
}

export default function CreatePageForm({ selectedFilter }: CreatePageFormProps) {
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [projectSlug, setProjectSlug] = useState("")
  const [destinationType, setDestinationType] = useState<DestinationType>("discord")
  const [destinationUrl, setDestinationUrl] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateSlug = (value: string) => {
    if (value && !/^[a-z0-9-]*$/.test(value)) {
      return "Only lowercase letters, numbers, and hyphens allowed"
    }
    return ""
  }

  const validateUrl = (value: string) => {
    if (value && !value.startsWith("https://")) {
      return "URL must start with https://"
    }
    return ""
  }

  const handleSlugChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setProjectSlug(sanitized)
    const error = validateSlug(sanitized)
    setErrors((prev) => ({ ...prev, slug: error }))
  }

  const handleUrlChange = (value: string) => {
    setDestinationUrl(value)
    const error = validateUrl(value)
    setErrors((prev) => ({ ...prev, url: error }))
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate all fields
    const newTouched = {
      name: true,
      slug: true,
      url: true,
    }
    setTouched(newTouched)

    // Check for errors
    if (!projectName || !projectSlug || !destinationUrl || errors.slug || errors.url) {
      setIsSubmitting(false)
      return
    }

    try {
      // Get selected filter preset
      const criteria = getFilterPreset(selectedFilter)

      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          slug: projectSlug,
          criteria,
          manual_review: false,
          destination_url: destinationUrl,
          destination_type: destinationType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project")
      }

      // Redirect to dashboard
      router.push(`/dashboard/${data.project.slug}`)
    } catch (error) {
      console.error("Error creating project:", error)
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Failed to create project",
      }))
      setIsSubmitting(false)
    }
  }

  const getInputClass = (field: string, hasError: boolean) => {
    return cn(
      "w-full rounded-lg border px-4 py-3.5 text-[15px] font-sans transition-colors outline-none",
      "placeholder:text-[#9CA3AF]",
      hasError && touched[field]
        ? "border-red-500 focus:border-red-500"
        : "border-[#E5E0D8] focus:border-[#1E3A5F]"
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6">
        {/* Error Message */}
        {errors.submit && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-600 font-sans">{errors.submit}</p>
          </div>
        )}

        {/* Project Name */}
        <div className="space-y-2">
          <label className="block text-[15px] font-medium text-[#1E3A5F] font-sans">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter your project name"
            className={getInputClass("name", !projectName && touched.name)}
            disabled={isSubmitting}
          />
          <p className="text-[13px] text-[#5C5C5C] font-sans">
            This will appear on your access page
          </p>
        </div>

        {/* Project Slug */}
        <div className="space-y-2">
          <label className="block text-[15px] font-medium text-[#1E3A5F] font-sans">
            Page URL
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-[#E5E0D8] bg-[#F9F7F4] px-4 text-[15px] text-[#5C5C5C] font-sans">
              repgateway.xyz/
            </span>
            <input
              type="text"
              value={projectSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              onBlur={() => handleBlur("slug")}
              placeholder="my-project"
              className={cn(
                "flex-1 rounded-r-lg border px-4 py-3.5 text-[15px] font-sans transition-colors outline-none",
                "placeholder:text-[#9CA3AF]",
                errors.slug && touched.slug
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#E5E0D8] focus:border-[#1E3A5F]"
              )}
              disabled={isSubmitting}
            />
          </div>
          <p className={cn(
            "text-[13px] font-sans",
            errors.slug && touched.slug ? "text-red-500" : "text-[#5C5C5C]"
          )}>
            {errors.slug && touched.slug ? errors.slug : "Only lowercase letters, numbers, and hyphens"}
          </p>
        </div>

        {/* Destination Type */}
        <div className="space-y-3">
          <label className="block text-[15px] font-medium text-[#1E3A5F] font-sans">
            Where should accepted users go?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDestinationType("discord")}
              disabled={isSubmitting}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-4 transition-all",
                "font-sans text-[15px] font-medium",
                destinationType === "discord"
                  ? "border-[#1E3A5F] bg-[#F0F4F8] text-[#1E3A5F]"
                  : "border-[#E5E0D8] bg-white text-[#5C5C5C] hover:border-[#C5C0B8]",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              <MessageCircle className="h-5 w-5" />
              Discord Server
            </button>
            <button
              type="button"
              onClick={() => setDestinationType("beta")}
              disabled={isSubmitting}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-4 transition-all",
                "font-sans text-[15px] font-medium",
                destinationType === "beta"
                  ? "border-[#1E3A5F] bg-[#F0F4F8] text-[#1E3A5F]"
                  : "border-[#E5E0D8] bg-white text-[#5C5C5C] hover:border-[#C5C0B8]",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              <Globe className="h-5 w-5" />
              Beta Access URL
            </button>
          </div>
        </div>

        {/* Destination URL */}
        <div className="space-y-2">
          <label className="block text-[15px] font-medium text-[#1E3A5F] font-sans">
            {destinationType === "discord" ? "Discord Invite Link" : "Beta Access URL"}
          </label>
          <input
            type="url"
            value={destinationUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={() => handleBlur("url")}
            placeholder={
              destinationType === "discord"
                ? "https://discord.gg/..."
                : "https://..."
            }
            className={getInputClass("url", !!errors.url)}
            disabled={isSubmitting}
          />
          {errors.url && touched.url && (
            <p className="text-[13px] text-red-500 font-sans">{errors.url}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full rounded-lg bg-[#1E3A5F] px-6 py-[18px] text-[16px] font-semibold text-white font-sans",
            "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1E3A5F]/25",
            "active:translate-y-0",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Creating..." : "Create Access Page"}
        </button>
      </div>
    </form>
  )
}
