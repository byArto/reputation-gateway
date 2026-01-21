import { sql } from "@vercel/postgres"

/**
 * Initialize database tables
 * Run this once to set up the database schema
 */
export async function initDatabase() {
  try {
    console.log("Creating tables...")

    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        criteria JSONB NOT NULL,
        manual_review BOOLEAN NOT NULL DEFAULT false,
        destination_url TEXT NOT NULL,
        destination_type TEXT NOT NULL CHECK (destination_type IN ('discord', 'beta')),
        benefits TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create applications table
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        ethos_profile_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        score INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('accepted', 'rejected', 'pending')),
        rejection_reason TEXT,
        criteria_snapshot JSONB NOT NULL,
        can_reapply_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug)`
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_ethos_profile_id ON applications(ethos_profile_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC)`
    await sql`CREATE INDEX IF NOT EXISTS idx_applications_project_ethos ON applications(project_id, ethos_profile_id)`

    console.log("✅ Database tables created successfully!")
    return { success: true }
  } catch (error) {
    console.error("❌ Error creating database tables:", error)
    throw error
  }
}

/**
 * Drop all tables (use with caution!)
 */
export async function dropDatabase() {
  try {
    console.log("Dropping tables...")
    await sql`DROP TABLE IF EXISTS applications CASCADE`
    await sql`DROP TABLE IF EXISTS projects CASCADE`
    console.log("✅ Database tables dropped successfully!")
    return { success: true }
  } catch (error) {
    console.error("❌ Error dropping database tables:", error)
    throw error
  }
}

/**
 * Reset database (drop and recreate)
 */
export async function resetDatabase() {
  await dropDatabase()
  await initDatabase()
}
