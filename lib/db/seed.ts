/**
 * Database Seed Script
 * Populates the candidates table with all 20 presidential candidates for Costa Rica 2026
 *
 * Run with: npm run seed
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { neon } from '@neondatabase/serverless'
import candidatesData from '../candidatos-data-oficial.json'

interface CandidateData {
  id: number
  partyCode: string
  partyName: string
  candidateName: string
  photoUrl?: string
  planUrl?: string
  interviewUrl?: string
  websiteUrl?: string
  slogan: string
  colorPrimary: string
  colorSecondary: string
  scores: {
    security: number
    economy: number
    education: number
    health: number
    agriculture: number
    environment: number
    reforms: number
    social: number
  }
  planSummary: string
  isActive: boolean
}

async function seedCandidates() {
  console.log('🌱 Starting database seed...\n')

  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const sql = neon(databaseUrl)

  try {
    // 1. Clear existing data
    console.log('🗑️  Clearing existing candidates...')
    await sql`DELETE FROM candidates`
    console.log('✅ Candidates table cleared\n')

    // 2. Insert all candidates
    console.log('📝 Inserting 20 candidates...\n')

    let successCount = 0
    let errorCount = 0

    for (const candidate of candidatesData.candidatos as CandidateData[]) {
      try {
        await sql`
          INSERT INTO candidates (
            party_code,
            party_name,
            candidate_name,
            candidate_photo_url,
            party_logo_url,
            slogan,
            color_primary,
            color_secondary,
            website_url,
            plan_file_path,
            interview_url,
            score_security,
            score_economy,
            score_education,
            score_health,
            score_agriculture,
            score_environment,
            score_reforms,
            score_social,
            plan_summary,
            is_active
          ) VALUES (
            ${candidate.partyCode},
            ${candidate.partyName},
            ${candidate.candidateName},
            ${candidate.photoUrl || null},
            NULL,
            ${candidate.slogan},
            ${candidate.colorPrimary},
            ${candidate.colorSecondary},
            ${candidate.websiteUrl || null},
            ${candidate.planUrl || null},
            ${candidate.interviewUrl || null},
            ${candidate.scores.security},
            ${candidate.scores.economy},
            ${candidate.scores.education},
            ${candidate.scores.health},
            ${candidate.scores.agriculture},
            ${candidate.scores.environment},
            ${candidate.scores.reforms},
            ${candidate.scores.social},
            ${candidate.planSummary},
            ${candidate.isActive}
          )
        `

        console.log(`  ✓ ${candidate.partyCode} - ${candidate.candidateName}`)
        successCount++
      } catch (error) {
        console.error(`  ✗ Error inserting ${candidate.partyCode}:`, error)
        errorCount++
      }
    }

    console.log(`\n📊 Seed Summary:`)
    console.log(`   • Successful: ${successCount}`)
    console.log(`   • Failed: ${errorCount}`)
    console.log(`   • Total: ${candidatesData.candidatos.length}`)

    // 3. Verify insertion
    const result = await sql`SELECT COUNT(*) as count FROM candidates`
    const count = result[0]?.count || 0
    console.log(`\n✅ Database now contains ${count} candidates`)

    // 4. Show sample data
    const sample = await sql`
      SELECT
        party_code,
        candidate_name,
        (score_security + score_economy + score_education + score_health +
         score_agriculture + score_environment + score_reforms + score_social) / 8.0 as avg_score
      FROM candidates
      ORDER BY avg_score DESC
      LIMIT 5
    `

    console.log('\n📈 Top 5 candidates by average score:')
    sample.forEach((row: any, index: number) => {
      console.log(`   ${index + 1}. ${row.party_code} - ${row.candidate_name} (${Number(row.avg_score).toFixed(2)})`)
    })

    console.log('\n🎉 Seed completed successfully!\n')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

// Run the seed function
seedCandidates()
  .then(() => {
    console.log('✨ All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
