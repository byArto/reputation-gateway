import { NextResponse } from "next/server"
import { getApplicationsByProjectId } from "@/lib/db"

/**
 * Get applications by project ID
 * GET /api/applications?project_id=uuid
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")

    if (!projectId) {
      return NextResponse.json(
        { error: "project_id is required" },
        { status: 400 }
      )
    }

    const applications = await getApplicationsByProjectId(projectId)

    return NextResponse.json({
      success: true,
      applications,
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}
