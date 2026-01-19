import { NextResponse } from "next/server"
import { getProjectBySlug, getApplicationStats } from "@/lib/db"

interface RouteContext {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Get project by slug
    const project = await getProjectBySlug(slug)

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Get application statistics
    const stats = await getApplicationStats(project.id)

    // Calculate acceptance percentage
    const acceptedPercent =
      stats.totalApplications > 0
        ? Math.round((stats.accepted / stats.totalApplications) * 100)
        : 0

    const rejectedPercent =
      stats.totalApplications > 0
        ? Math.round((stats.rejected / stats.totalApplications) * 100)
        : 0

    // Return project info with stats
    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        criteria: project.criteria,
        manual_review: project.manual_review,
        destination_url: project.destination_url,
        destination_type: project.destination_type,
        created_at: project.created_at,
        stats: {
          total_applications: stats.totalApplications,
          last_24h: stats.last24h,
          accepted: stats.accepted,
          accepted_percent: acceptedPercent,
          rejected: stats.rejected,
          rejected_percent: rejectedPercent,
          pending: stats.pending,
          avg_score: stats.avgScore,
          avg_accepted_score: stats.avgAcceptedScore,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
