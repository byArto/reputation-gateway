import { NextResponse } from "next/server"
import { createProject, getProjectBySlug } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, slug, criteria, manual_review, destination_url, destination_type, benefits } = body

    if (!name || !slug || !criteria || !destination_url || !destination_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate slug format (lowercase, alphanumeric, hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProject = await getProjectBySlug(slug)
    if (existingProject) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      )
    }

    // Validate destination_type
    if (destination_type !== "discord" && destination_type !== "beta") {
      return NextResponse.json(
        { error: "destination_type must be either 'discord' or 'beta'" },
        { status: 400 }
      )
    }

    // Validate destination_url
    if (!destination_url.startsWith("https://")) {
      return NextResponse.json(
        { error: "destination_url must start with https://" },
        { status: 400 }
      )
    }

    // Validate criteria structure
    if (
      typeof criteria.minScore !== "number" ||
      typeof criteria.minVouches !== "number" ||
      typeof criteria.positiveReviews !== "boolean" ||
      typeof criteria.minAccountAge !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid criteria structure" },
        { status: 400 }
      )
    }

    // Validate benefits if provided
    if (benefits && typeof benefits !== 'string') {
      return NextResponse.json(
        { error: "benefits must be a string" },
        { status: 400 }
      )
    }

    // Create project
    const project = await createProject({
      name,
      slug,
      criteria: {
        minScore: criteria.minScore,
        minVouches: criteria.minVouches,
        positiveReviews: criteria.positiveReviews,
        minAccountAge: criteria.minAccountAge,
      },
      manualReview: manual_review ?? false,
      destinationUrl: destination_url,
      destinationType: destination_type,
      benefits: benefits || undefined,
    })

    // Get the base URL for the response
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    return NextResponse.json(
      {
        success: true,
        project: {
          id: project.id,
          name: project.name,
          slug: project.slug,
          access_page_url: `${baseUrl}/${project.slug}`,
          dashboard_url: `${baseUrl}/dashboard/${project.slug}`,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
