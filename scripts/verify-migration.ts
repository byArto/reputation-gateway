/**
 * Verify migration was applied correctly
 */

import { config } from 'dotenv'
import { sql } from '@vercel/postgres'

config({ path: '.env.local' })

async function verifyMigration() {
  console.log('Verifying migration...')
  console.log('=====================================')

  try {
    // Check if table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'invite_tokens'
      );
    `

    if (tableCheck.rows[0].exists) {
      console.log('✅ Table "invite_tokens" exists')
    } else {
      console.log('❌ Table "invite_tokens" not found')
      process.exit(1)
    }

    // Check columns
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'invite_tokens'
      ORDER BY ordinal_position;
    `

    console.log('\n📋 Table columns:')
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(nullable)'}`)
    })

    // Check indexes
    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'invite_tokens';
    `

    console.log(`\n🔍 Indexes (${indexes.rows.length} total):`)
    indexes.rows.forEach(idx => {
      console.log(`  - ${idx.indexname}`)
    })

    console.log('\n✅ Migration verification complete!')

  } catch (error) {
    console.error('❌ Verification failed:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

verifyMigration()
