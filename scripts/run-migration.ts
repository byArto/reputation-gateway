/**
 * Migration runner script
 * Run with: npx tsx scripts/run-migration.ts
 */

import { config } from 'dotenv'
import { sql } from '@vercel/postgres'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function runMigration() {
  const migrationPath = path.join(process.cwd(), 'sql/migrations/001_add_invite_tokens.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

  console.log('Running migration: 001_add_invite_tokens.sql')
  console.log('=====================================')

  try {
    // Execute the migration
    await sql.query(migrationSQL)

    console.log('✅ Migration completed successfully!')
    console.log('Created table: invite_tokens')
    console.log('Created indexes: 6 indexes for performance')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

runMigration()
