"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import DashboardStats from "@/components/dashboard-stats"
import ApplicationCard from "@/components/application-card"

interface Application {
  id: string
  project_id: string
  ethos_profile_id: number
  username: string
  score: number
  status: "accepted" | "rejected" | "pending"
  rejection_reason: string | null
  created_at: string
}

interface ProjectStats {
  totalApplications: number
  pendingCount: number
  acceptedCount: number
  rejectedCount: number
  acceptedPercent: number
  rejectedPercent: number
  avgScore: number
  avgAcceptedScore: number
  last24hCount: number
}

export default function DashboardPage() {
  const params = useParams()
  const slug = params.slug as string

  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [projectId, setProjectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Convert slug to display name
  const projectName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

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
        setProjectId(projectData.project.id)
        setStats(projectData.stats)

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
      if (projectId) {
        const projectResponse = await fetch(`/api/projects/${slug}`)
        const projectData = await projectResponse.json()
        setStats(projectData.stats)
      }
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
      if (projectId) {
        const projectResponse = await fetch(`/api/projects/${slug}`)
        const projectData = await projectResponse.json()
        setStats(projectData.stats)
      }
    } catch (err) {
      console.error("Error rejecting application:", err)
      alert("Failed to reject application")
    }
  }

  // Format timestamp to relative time
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    } else {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFE9DF] flex items-center justify-center">
        <p className="font-sans text-[#5C5C5C]">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EFE9DF] flex items-center justify-center">
        <div className="text-center">
          <p className="font-sans text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="font-sans text-[#1E3A5F] hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Get full page URL
  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${slug}`
    : `https://yourdomain.com/${slug}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageUrl)
    alert('Page URL copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-[#EFE9DF]">
      {/* Stats Section */}
      {stats && (
        <div className="pb-8">
          <DashboardStats
            totalApplications={stats.totalApplications}
            last24h={stats.last24hCount}
            accepted={stats.acceptedCount}
            acceptedPercent={stats.acceptedPercent}
            rejected={stats.rejectedCount}
            rejectedPercent={stats.rejectedPercent}
            avgScore={stats.avgScore}
            avgAcceptedScore={stats.avgAcceptedScore}
          />
        </div>
      )}

      {/* Applications List Section */}
      <div className="max-w-[1000px] mx-auto px-4 pb-16">
        {/* Page URL Section */}
        <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 mb-6">
          <h3 className="font-sans text-sm font-medium text-[#5C5C5C] mb-2">
            Share this URL with testers:
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={pageUrl}
              readOnly
              className="flex-1 px-4 py-3 bg-[#F8F6F3] border border-[#E5E0D8] rounded-lg font-mono text-sm text-[#1E3A5F] focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-[#1E3A5F] text-white font-sans font-medium rounded-lg hover:bg-[#152d47] transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-serif text-3xl text-[#1A1A1A] mb-2">
            Recent Applications
          </h2>
          <p className="font-sans text-[15px] text-[#5C5C5C]">
            Project: {projectName}
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white border border-[#E5E0D8] rounded-xl p-8 text-center">
            <p className="font-sans text-[#5C5C5C]">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                username={app.username}
                score={app.score}
                vouches={0}
                accountAge={0}
                timestamp={formatTimestamp(app.created_at)}
                status={app.status}
                ethosProfileUrl={`https://ethos.network/profile/${app.ethos_profile_id}`}
                showActions={app.status === "pending"}
                onApprove={() => handleApprove(app.id)}
                onReject={() => handleReject(app.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
