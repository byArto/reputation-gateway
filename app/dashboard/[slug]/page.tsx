"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BlockchainGrid, GlowOrbs } from "@/components/dashboard/background"
import DashboardHeader from "@/components/dashboard/header"
import URLShareBox from "@/components/dashboard/url-share-box"
import StatsGrid from "@/components/dashboard/stats-grid"
import LeftSidebar from "@/components/dashboard/left-sidebar"
import MainContent from "@/components/dashboard/main-content"
import RightSidebar from "@/components/dashboard/right-sidebar"
import SettingsModal from "@/components/dashboard/settings-modal"

interface Application {
  id: string
  project_id: string
  ethos_profile_id: number
  username: string
  score: number
  vouches: number
  positive_reviews: number
  negative_reviews: number
  account_age: number
  status: "accepted" | "rejected" | "pending"
  rejection_reason: string | null
  created_at: string
}

interface Project {
  id: string
  name: string
  slug: string
  criteria: {
    minScore: number
    minVouches: number
    positiveReviews: boolean
    minAccountAge: number
  }
  manual_review: boolean
  destination_url: string
  destination_type: string
  created_at: string
}

interface ProjectStats {
  total_applications: number
  last_24h: number
  accepted: number
  accepted_percent: number
  rejected: number
  rejected_percent: number
  pending: number
  avg_score: number
  avg_accepted_score: number
}

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [project, setProject] = useState<Project | null>(null)
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set())
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Load project and stats
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Fetch project info and stats
        const projectResponse = await fetch(`/api/projects/${slug}`)
        if (!projectResponse.ok) {
          throw new Error("Failed to load project")
        }

        const projectData = await projectResponse.json()
        setProject(projectData.project)
        setStats(projectData.project.stats)

        // Fetch applications
        const appsResponse = await fetch(
          `/api/applications?project_id=${projectData.project.id}`
        )
        if (!appsResponse.ok) {
          throw new Error("Failed to load applications")
        }

        const appsData = await appsResponse.json()
        setApplications(appsData.applications)
      } catch (err) {
        console.error("Error loading dashboard data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [slug])

  const handleApprove = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve application")
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: "accepted" as const } : app
        )
      )

      // Reload stats
      const projectResponse = await fetch(`/api/projects/${slug}`)
      const projectData = await projectResponse.json()
      setStats(projectData.project.stats)
    } catch (err) {
      console.error("Error approving application:", err)
      alert("Failed to approve application")
    }
  }

  const handleReject = async (applicationId: string) => {
    const reason = prompt("Reason for rejection (optional):")

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          rejection_reason: reason || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject application")
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: "rejected" as const, rejection_reason: reason || null }
            : app
        )
      )

      // Reload stats
      const projectResponse = await fetch(`/api/projects/${slug}`)
      const projectData = await projectResponse.json()
      setStats(projectData.project.stats)
    } catch (err) {
      console.error("Error rejecting application:", err)
      alert("Failed to reject application")
    }
  }

  const handleSelectApp = (id: string, selected: boolean) => {
    setSelectedApps((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedApps(new Set(applications.map((app) => app.id)))
    } else {
      setSelectedApps(new Set())
    }
  }

  const handleSaveSettings = async (settings: {
    name: string
    slug: string
    minScore: number
  }) => {
    try {
      // TODO: Implement PATCH /api/projects/[slug] endpoint
      console.log("Save settings:", settings)

      // For now, just update local state
      if (project) {
        setProject({
          ...project,
          name: settings.name,
          slug: settings.slug,
          criteria: {
            ...project.criteria,
            minScore: settings.minScore,
          },
        })
      }

      alert("Settings saved successfully!")
    } catch (err) {
      console.error("Error saving settings:", err)
      alert("Failed to save settings")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1443] via-[#2d1b69] via-[#1e3a5f] to-[#0f2744] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[rgba(139,92,246,0.3)] border-t-[#8b5cf6] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#e0d5ff] text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !project || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1443] via-[#2d1b69] via-[#1e3a5f] to-[#0f2744] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || "Failed to load project"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Get full page URL
  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `https://yourdomain.com/${slug}`

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0e27] via-[#1a1443] via-[#2d1b69] via-[#1e3a5f] to-[#0f2744]">
        <BlockchainGrid />
        <GlowOrbs />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          {/* Header */}
          <DashboardHeader
            projectName={project.name}
            onSettingsClick={() => setShowSettingsModal(true)}
          />

          {/* URL Share Box */}
          <div className="mt-8 mb-8">
            <URLShareBox url={pageUrl} />
          </div>

          {/* Stats Grid */}
          <div className="mb-8">
            <StatsGrid stats={stats} />
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-6">
            {/* Left Sidebar */}
            <LeftSidebar applications={applications} />

            {/* Main Content */}
            <MainContent
              applications={applications}
              onApprove={handleApprove}
              onReject={handleReject}
              selectedIds={selectedApps}
              onSelectApp={handleSelectApp}
              onSelectAll={handleSelectAll}
            />

            {/* Right Sidebar */}
            <RightSidebar applications={applications} project={project} />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          project={project}
          onSave={handleSaveSettings}
        />
      )}
    </>
  )
}
