import { sql } from "@vercel/postgres"

export { sql }

// Type definitions for database tables
export interface Project {
  id: string
  name: string
  slug: string
  criteria: {
    minScore: number
    minVouches: number
    positiveReviews: boolean
    minAccountAge: number
  }
  manual_review: boolean
  destination_url: string
  destination_type: "discord" | "beta"
  benefits?: string
  created_at: Date
}

export interface Application {
  id: string
  project_id: string
  ethos_profile_id: number
  username: string
  score: number
  status: "accepted" | "rejected" | "pending"
  rejection_reason: string | null
  criteria_snapshot: {
    minScore: number
    minVouches: number
    positiveReviews: boolean
    minAccountAge: number
  }
  can_reapply_at: Date | null
  created_at: Date
}

// Project queries
export async function createProject(data: {
  name: string
  slug: string
  criteria: Project["criteria"]
  manualReview: boolean
  destinationUrl: string
  destinationType: "discord" | "beta"
  benefits?: string
}) {
  const result = await sql`
    INSERT INTO projects (name, slug, criteria, manual_review, destination_url, destination_type, benefits)
    VALUES (${data.name}, ${data.slug}, ${JSON.stringify(data.criteria)}, ${data.manualReview}, ${data.destinationUrl}, ${data.destinationType}, ${data.benefits || null})
    RETURNING *
  `
  return result.rows[0] as Project
}

export async function getProjectBySlug(slug: string) {
  const result = await sql`
    SELECT * FROM projects WHERE slug = ${slug} LIMIT 1
  `
  return result.rows[0] as Project | undefined
}

export async function getAllProjects() {
  const result = await sql`
    SELECT * FROM projects ORDER BY created_at DESC
  `
  return result.rows as Project[]
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "created_at">>
) {
  const updates: string[] = []
  const values: unknown[] = []
  let paramCount = 1

  if (data.name !== undefined) {
    updates.push(`name = $${paramCount++}`)
    values.push(data.name)
  }
  if (data.criteria !== undefined) {
    updates.push(`criteria = $${paramCount++}`)
    values.push(JSON.stringify(data.criteria))
  }
  if (data.manual_review !== undefined) {
    updates.push(`manual_review = $${paramCount++}`)
    values.push(data.manual_review)
  }
  if (data.destination_url !== undefined) {
    updates.push(`destination_url = $${paramCount++}`)
    values.push(data.destination_url)
  }
  if (data.destination_type !== undefined) {
    updates.push(`destination_type = $${paramCount++}`)
    values.push(data.destination_type)
  }

  if (updates.length === 0) {
    throw new Error("No fields to update")
  }

  values.push(id)
  const query = `UPDATE projects SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`

  const result = await sql.query(query, values)
  return result.rows[0] as Project
}

// Application queries
export async function createApplication(data: {
  projectId: string
  ethosProfileId: number
  username: string
  score: number
  status: "accepted" | "rejected" | "pending"
  rejectionReason?: string
  criteriaSnapshot: Application["criteria_snapshot"]
  canReapplyAt?: Date
}) {
  const canReapplyAtValue = data.canReapplyAt
    ? data.canReapplyAt.toISOString()
    : null

  const result = await sql`
    INSERT INTO applications (
      project_id, ethos_profile_id, username, score, status,
      rejection_reason, criteria_snapshot, can_reapply_at
    )
    VALUES (
      ${data.projectId}, ${data.ethosProfileId}, ${data.username},
      ${data.score}, ${data.status}, ${data.rejectionReason || null},
      ${JSON.stringify(data.criteriaSnapshot)}, ${canReapplyAtValue}
    )
    RETURNING *
  `
  return result.rows[0] as Application
}

export async function getApplicationsByProjectId(projectId: string) {
  const result = await sql`
    SELECT * FROM applications
    WHERE project_id = ${projectId}
    ORDER BY created_at DESC
  `
  return result.rows as Application[]
}

export async function getApplicationById(id: string) {
  const result = await sql`
    SELECT * FROM applications WHERE id = ${id} LIMIT 1
  `
  return result.rows[0] as Application | undefined
}

export async function updateApplicationStatus(
  id: string,
  status: "accepted" | "rejected" | "pending",
  rejectionReason?: string
) {
  const result = await sql`
    UPDATE applications
    SET status = ${status}, rejection_reason = ${rejectionReason || null}
    WHERE id = ${id}
    RETURNING *
  `
  return result.rows[0] as Application
}

export async function getApplicationStats(projectId: string) {
  const result = await sql`
    SELECT
      COUNT(*) as total_applications,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as last_24h,
      COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
      COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      ROUND(AVG(score)) as avg_score,
      ROUND(AVG(score) FILTER (WHERE status = 'accepted')) as avg_accepted_score
    FROM applications
    WHERE project_id = ${projectId}
  `

  const stats = result.rows[0]
  return {
    totalApplications: parseInt(stats.total_applications) || 0,
    last24h: parseInt(stats.last_24h) || 0,
    accepted: parseInt(stats.accepted) || 0,
    rejected: parseInt(stats.rejected) || 0,
    pending: parseInt(stats.pending) || 0,
    avgScore: parseInt(stats.avg_score) || 0,
    avgAcceptedScore: parseInt(stats.avg_accepted_score) || 0,
  }
}

export async function checkExistingApplication(
  projectId: string,
  ethosProfileId: number
) {
  const result = await sql`
    SELECT * FROM applications
    WHERE project_id = ${projectId} AND ethos_profile_id = ${ethosProfileId}
    ORDER BY created_at DESC
    LIMIT 1
  `
  return result.rows[0] as Application | undefined
}
