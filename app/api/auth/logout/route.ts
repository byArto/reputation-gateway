import { NextResponse } from "next/server"
import { deleteSession } from "@/lib/session"

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function POST(request: Request) {
  try {
    await deleteSession()

    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get("redirect_to") || "/"

    return NextResponse.json({
      success: true,
      redirect_to: redirectTo,
    })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}

/**
 * Logout via GET (for simple links)
 */
export async function GET(request: Request) {
  try {
    await deleteSession()

    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get("redirect_to") || "/"

    return NextResponse.redirect(new URL(redirectTo, request.url))
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
