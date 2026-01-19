import { NextResponse } from "next/server"
import { updateApplicationStatus } from "@/lib/db"

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

/**
 * Update application status
 * PATCH /api/applications/[id]
 * Body: { status: 'accepted' | 'rejected', rejection_reason?: string }
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      )
    }

    const { status, rejection_reason } = body

    if (!status || !["accepted", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required (accepted, rejected, or pending)" },
        { status: 400 }
      )
    }

    const application = await updateApplicationStatus(
      id,
      status as "accepted" | "rejected" | "pending",
      rejection_reason
    )

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    )
  }
}
