/**
 * Check tokens in database
 */

import { config } from 'dotenv'
import { sql } from '@vercel/postgres'

config({ path: '.env.local' })

async function checkTokens() {
  console.log('Checking invite tokens in database...')
  console.log('=====================================')

  try {
    const tokens = await sql`
      SELECT
        token,
        ethos_profile_id,
        destination_url,
        is_used,
        expires_at,
        created_at
      FROM invite_tokens
      ORDER BY created_at DESC
      LIMIT 5
    `

    console.log(`Found ${tokens.rows.length} tokens:\n`)

    tokens.rows.forEach((row, i) => {
      console.log(`${i + 1}. Token: ${row.token.substring(0, 16)}...`)
      console.log(`   Profile: ${row.ethos_profile_id}`)
      console.log(`   Used: ${row.is_used}`)
      console.log(`   Expires: ${row.expires_at}`)
      console.log(`   Destination: ${row.destination_url}`)
      console.log('')
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    process.exit(0)
  }
}

checkTokens()
