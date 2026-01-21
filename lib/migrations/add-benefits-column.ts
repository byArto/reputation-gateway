import { sql } from "@vercel/postgres"

/**
 * Migration: Add benefits column to projects table
 *
 * This adds an optional JSONB column to store beta tester benefits
 */
export async function addBenefitsColumn() {
  try {
    console.log("Adding benefits column to projects table...")

    await sql`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS benefits JSONB
    `

    console.log("✅ Benefits column added successfully!")
    return { success: true }
  } catch (error) {
    console.error("❌ Error adding benefits column:", error)
    throw error
  }
}

/**
 * Rollback: Remove benefits column from projects table
 */
export async function removeBenefitsColumn() {
  try {
    console.log("Removing benefits column from projects table...")

    await sql`
      ALTER TABLE projects
      DROP COLUMN IF EXISTS benefits
    `

    console.log("✅ Benefits column removed successfully!")
    return { success: true }
  } catch (error) {
    console.error("❌ Error removing benefits column:", error)
    throw error
  }
}
