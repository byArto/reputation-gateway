import { NextResponse } from "next/server"
import { initDatabase } from "@/lib/init-db"

/**
 * API endpoint to initialize database
 * GET /api/init-db
 *
 * This should be run once to set up the database schema.
 * In production, you should protect this endpoint or remove it after setup.
 */
export async function GET() {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "This endpoint is disabled in production" },
        { status: 403 }
      )
    }

    await initDatabase()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
