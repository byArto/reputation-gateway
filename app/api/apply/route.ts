import { NextResponse } from "next/server"
import {
  getProjectBySlug,
  createApplication,
  checkExistingApplication,
} from "@/lib/db"
import {
  validateCriteria,
  calculateReapplyDate,
  canReapply,
  type EthosProfile,
} from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { project_slug, ethos_profile } = body

    if (!project_slug || !ethos_profile) {
      return NextResponse.json(
        { error: "Missing required fields: project_slug and ethos_profile" },
        { status: 400 }
      )
    }

    // Validate ethos_profile structure
    const profile: EthosProfile = ethos_profile
    if (
      typeof profile.profileId !== "number" ||
      typeof profile.username !== "string" ||
      typeof profile.score !== "number" ||
      typeof profile.vouches !== "number" ||
      typeof profile.positiveReviews !== "number" ||
      typeof profile.negativeReviews !== "number" ||
      typeof profile.accountAge !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid ethos_profile structure" },
        { status: 400 }
      )
    }

    // Get project
    const project = await getProjectBySlug(project_slug)
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Check if user already applied
    const existingApplication = await checkExistingApplication(
      project.id,
      profile.profileId
    )

    if (existingApplication) {
      // If previously rejected, check if they can reapply
      if (existingApplication.status === "rejected") {
        if (!canReapply(existingApplication.can_reapply_at)) {
          const reapplyDate = new Date(existingApplication.can_reapply_at!)
          return NextResponse.json(
            {
              error: "Cannot reapply yet",
              status: "rejected",
              can_reapply_at: reapplyDate.toISOString(),
              rejection_reason: existingApplication.rejection_reason,
            },
            { status: 403 }
          )
        }
        // Can reapply - continue with new application
      } else {
        // Already has pending or accepted application
        return NextResponse.json(
          {
            error: "Application already exists",
            status: existingApplication.status,
            application_id: existingApplication.id,
          },
          { status: 409 }
        )
      }
    }

    // Validate against criteria
    const validation = validateCriteria(
      profile,
      project.criteria,
      project.manual_review
    )

    // Create application
    const application = await createApplication({
      projectId: project.id,
      ethosProfileId: profile.profileId,
      username: profile.username,
      score: profile.score,
      status: validation.status,
      rejectionReason: validation.rejectionReason,
      criteriaSnapshot: project.criteria,
      canReapplyAt:
        validation.status === "rejected" ? calculateReapplyDate() : undefined,
    })

    // Prepare response based on status
    const response: {
      success: boolean
      application_id: string
      status: "accepted" | "rejected" | "pending"
      message: string
      rejection_reason?: string
      failed_criteria?: string[]
      can_reapply_at?: string
      destination_url?: string
    } = {
      success: validation.status !== "rejected",
      application_id: application.id,
      status: application.status,
      message: getStatusMessage(application.status, project.manual_review),
    }

    if (validation.status === "rejected") {
      response.rejection_reason = validation.rejectionReason
      response.failed_criteria = validation.failedCriteria
      if (application.can_reapply_at) {
        response.can_reapply_at = new Date(
          application.can_reapply_at
        ).toISOString()
      }
    }

    if (validation.status === "accepted") {
      response.destination_url = project.destination_url
    }

    return NextResponse.json(response, {
      status: validation.status === "rejected" ? 200 : 201,
    })
  } catch (error) {
    console.error("Error processing application:", error)
    return NextResponse.json(
      {
        error: "Failed to process application",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

function getStatusMessage(
  status: "accepted" | "rejected" | "pending",
  manualReview: boolean
): string {
  switch (status) {
    case "accepted":
      return "Congratulations! Your application has been accepted. You now have access to the beta."
    case "rejected":
      return "Unfortunately, your application does not meet the required criteria at this time."
    case "pending":
      return manualReview
        ? "Your application is pending manual review. You will be notified of the decision."
        : "Your application is being processed."
  }
}
