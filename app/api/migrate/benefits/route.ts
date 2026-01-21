import { NextResponse } from "next/server"
import { addBenefitsColumn } from "@/lib/migrations/add-benefits-column"

export async function POST() {
  try {
    await addBenefitsColumn()

    return NextResponse.json({
      success: true,
      message: "Benefits column added successfully"
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Migration failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
